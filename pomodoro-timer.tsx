"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { usePlausible } from "next-plausible"

import { useSettings } from "@/context/settings"
import { useTaskContext } from "@/context/task"

import { getPersonalityDescription, getPersonalityEmoji, getPersonalityMessage } from "@/utils/personality"

import {
  DEFAULT_ADVENTURER_NAME,
  DEFAULT_COMPANION_NAME,
  DEFAULT_COMPANION_PERSONALITY,
  DEFAULT_FOCUS_LENGTH,
  DEFAULT_BREAK_LENGTH,
  DEFAULT_LONG_BREAK_LENGTH,
  DEFAULT_ROUNDS,
} from "@/utils/constants"

const PomodoroTimer = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const plausible = usePlausible()

  const { settings, updateSettings } = useSettings()
  const { currentTask } = useTaskContext()

  const [timerType, setTimerType] = useState<"focus" | "break" | "longBreak">("focus")
  const [timeRemaining, setTimeRemaining] = useState(settings?.focusLength * 60 || DEFAULT_FOCUS_LENGTH * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [roundsCompleted, setRoundsCompleted] = useState(0)

  const [currentAdventurerName, setCurrentAdventurerName] = useState(
    settings?.adventurerName || DEFAULT_ADVENTURER_NAME,
  )
  const [currentCompanionName, setCurrentCompanionName] = useState(settings?.companionName || DEFAULT_COMPANION_NAME)
  const [currentCompanionPersonality, setCurrentCompanionPersonality] = useState(
    settings?.companionPersonality || DEFAULT_COMPANION_PERSONALITY,
  )

  const [editingNames, setEditingNames] = useState(false)
  const [tempAdventurerName, setTempAdventurerName] = useState(currentAdventurerName)
  const [tempCompanionName, setTempCompanionName] = useState(currentCompanionName)
  const [tempCompanionPersonality, setTempCompanionPersonality] = useState(currentCompanionPersonality)

  const audioRef = useRef<HTMLAudioElement>(null)

  const focusLength = settings?.focusLength || DEFAULT_FOCUS_LENGTH
  const breakLength = settings?.breakLength || DEFAULT_BREAK_LENGTH
  const longBreakLength = settings?.longBreakLength || DEFAULT_LONG_BREAK_LENGTH
  const rounds = settings?.rounds || DEFAULT_ROUNDS

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    setTimeRemaining(focusLength * 60)
    setTimerType("focus")
  }, [focusLength])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (!isRunning) {
      clearInterval(interval)
    }

    if (timeRemaining < 0) {
      clearInterval(interval)
      audioRef.current?.play()
      handleTimerEnd()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(focusLength * 60)
    setTimerType("focus")
    setRoundsCompleted(0)
  }

  const handleTimerEnd = () => {
    if (timerType === "focus") {
      setRoundsCompleted((prevRounds) => prevRounds + 1)

      if (roundsCompleted + 1 === rounds) {
        setTimerType("longBreak")
        setTimeRemaining(longBreakLength * 60)
        toast.success(getPersonalityMessage(currentCompanionPersonality, "longBreak"))
      } else {
        setTimerType("break")
        setTimeRemaining(breakLength * 60)
        toast.success(getPersonalityMessage(currentCompanionPersonality, "break"))
      }
    } else {
      setTimerType("focus")
      setTimeRemaining(focusLength * 60)
      toast.success(getPersonalityMessage(currentCompanionPersonality, "focus"))
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleNameEdit = () => {
    setTempAdventurerName(currentAdventurerName)
    setTempCompanionName(currentCompanionName)
    setTempCompanionPersonality(currentCompanionPersonality)
    setEditingNames((prev) => !prev)
  }

  const saveNameChanges = () => {
    setCurrentAdventurerName(tempAdventurerName)
    setCurrentCompanionName(tempCompanionName)
    setCurrentCompanionPersonality(tempCompanionPersonality)
    setEditingNames(false)
    updateSettings({
      adventurerName: tempAdventurerName,
      companionName: tempCompanionName,
      companionPersonality: tempCompanionPersonality,
    })
    plausible("Update Names")
  }

  const cancelNameChanges = () => {
    setTempAdventurerName(currentAdventurerName)
    setTempCompanionName(currentCompanionName)
    setTempCompanionPersonality(currentCompanionPersonality)
    setEditingNames(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-stone-700 bg-stone-800/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Focusing on</h3>
          <button className="rounded-md border border-stone-700 px-2 py-1 text-sm" onClick={toggleNameEdit}>
            {editingNames ? "Cancel" : "Edit Names"}
          </button>
        </div>

        {editingNames ? (
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-sm">Adventurer Name</label>
            <input
              type="text"
              className="rounded-md border border-stone-700 bg-stone-900 px-2 py-1"
              value={tempAdventurerName}
              onChange={(e) => setTempAdventurerName(e.target.value)}
            />
            <label className="text-sm">Companion Name</label>
            <input
              type="text"
              className="rounded-md border border-stone-700 bg-stone-900 px-2 py-1"
              value={tempCompanionName}
              onChange={(e) => setTempCompanionName(e.target.value)}
            />
            <label className="text-sm">Companion Personality</label>
            <select
              className="rounded-md border border-stone-700 bg-stone-900 px-2 py-1"
              value={tempCompanionPersonality}
              onChange={(e) => setTempCompanionPersonality(e.target.value as any)}
            >
              <option value="helpful">Helpful</option>
              <option value="sarcastic">Sarcastic</option>
              <option value="motivational">Motivational</option>
            </select>
            <div className="flex justify-end gap-2">
              <button className="rounded-md border border-stone-700 px-2 py-1 text-sm" onClick={cancelNameChanges}>
                Cancel
              </button>
              <button className="rounded-md border border-stone-700 px-2 py-1 text-sm" onClick={saveNameChanges}>
                Save
              </button>
            </div>
            {tempCompanionPersonality !== currentCompanionPersonality && (
              <div className="mt-2 rounded-md border border-amber-700 bg-amber-800/50 p-2 text-sm">
                <span className="font-medium">Preview:</span> {getPersonalityDescription(tempCompanionPersonality)}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p>
                {currentAdventurerName} is working hard with <span className="font-medium">{currentCompanionName}</span>
                .
              </p>
              <p className="text-sm text-stone-400">{getPersonalityDescription(currentCompanionPersonality)}</p>
            </div>
            <span className="font-medium flex items-center gap-1">
              {getPersonalityEmoji(currentCompanionPersonality)}
              {currentCompanionPersonality.charAt(0).toUpperCase() + currentCompanionPersonality.slice(1)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-stone-700 bg-stone-800/50 p-8">
        <h2 className="text-5xl font-bold">{formatTime(timeRemaining)}</h2>
        <div className="flex gap-4">
          {isRunning ? (
            <button className="rounded-md border border-amber-700 bg-amber-800/20 px-4 py-2" onClick={pauseTimer}>
              Pause
            </button>
          ) : (
            <button className="rounded-md border border-green-700 bg-green-800/20 px-4 py-2" onClick={startTimer}>
              Start
            </button>
          )}
          <button className="rounded-md border border-stone-700 px-4 py-2" onClick={resetTimer}>
            Reset
          </button>
        </div>
        <p className="text-sm text-stone-400">
          {timerType === "focus"
            ? `Focusing on ${currentTask?.name || "work"}.`
            : timerType === "break"
              ? "Taking a short break."
              : "Taking a long break."}
        </p>
      </div>

      <audio ref={audioRef} src="/alarm.mp3" />
    </div>
  )
}

export default PomodoroTimer
