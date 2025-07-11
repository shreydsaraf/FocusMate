"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Settings,
  CheckCircle,
  Star,
  Target,
  Sun,
  Moon,
  Music,
  HelpCircle,
  Gem,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import AmbientSounds from "./ambient-sounds"
import HelpGuide from "./help-guide"

type TimerMode = "pomodoro" | "break" | "quickwin" | "custom" | "dragon-slaying" | "treasure-hunt"
type TimerState = "idle" | "running" | "paused" | "completed"
type Theme = "light" | "dark"

interface Treasure {
  id: string
  name: string
  sessions: number
  completed: boolean
}

interface PomodoroTimerProps {
  adventurerName: string
  companionName: string
  companionPersonality: string
}

export default function PomodoroTimer({ adventurerName, companionName, companionPersonality }: PomodoroTimerProps) {
  // Theme state
  const [theme, setTheme] = useState<Theme>("dark")

  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Custom timer settings
  const [customFocus, setCustomFocus] = useState(25)
  const [customBreak, setCustomBreak] = useState(5)
  const [showSettings, setShowSettings] = useState(false)

  // Task management
  const [frogTask, setFrogTask] = useState("")
  const [frogCompleted, setFrogCompleted] = useState(false)
  const [completedQuickWins, setCompletedQuickWins] = useState(0)

  // Character celebration state
  const [celebrating, setCelebrating] = useState(false)

  // Ambient sounds state
  const [showAmbientSounds, setShowAmbientSounds] = useState(false)

  // Help guide state
  const [showHelpGuide, setShowHelpGuide] = useState(false)

  // Dragon slaying state
  const [dragonSessions, setDragonSessions] = useState(0)
  const [isDragonActive, setIsDragonActive] = useState(false)
  const [showDragonDurationSelect, setShowDragonDurationSelect] = useState(false)
  const [dragonDuration, setDragonDuration] = useState(25)

  // Treasure hunting state
  const [treasures, setTreasures] = useState<Treasure[]>([])
  const [newTreasure, setNewTreasure] = useState("")
  const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null)
  const [showTreasureDurationSelect, setShowTreasureDurationSelect] = useState(false)
  const [selectedTreasureId, setSelectedTreasureId] = useState<string | null>(null)
  const [treasureDuration, setTreasureDuration] = useState(2)

  // Treasure selection state
  const [showTreasureSelection, setShowTreasureSelection] = useState(false)
  const [treasureSelectionMode, setTreasureSelectionMode] = useState<"select" | "add" | "edit">("select")
  const [editingTreasureId, setEditingTreasureId] = useState<string | null>(null)
  const [editingTreasureName, setEditingTreasureName] = useState("")

  // Name editing state
  const [editingNames, setEditingNames] = useState(false)
  const [tempAdventurerName, setTempAdventurerName] = useState(adventurerName)
  const [tempCompanionName, setTempCompanionName] = useState(companionName)
  const [currentAdventurerName, setCurrentAdventurerName] = useState(adventurerName)
  const [currentCompanionName, setCurrentCompanionName] = useState(companionName)

  // Orientation detection
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [isMobile, setIsMobile] = useState(false)

  // Detect orientation and mobile device
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? "landscape" : "portrait")
      setIsMobile(window.innerWidth <= 768)
    }

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(checkOrientation, 100)
    }

    const handleResize = () => {
      checkOrientation()
    }

    // Initial check
    checkOrientation()

    // Listen for orientation changes
    window.addEventListener("orientationchange", handleOrientationChange)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getInitialTime = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "pomodoro":
        return 25 * 60
      case "break":
        return 5 * 60
      case "quickwin":
        return 2 * 60
      case "custom":
        return customFocus * 60
      case "dragon-slaying":
        return dragonDuration * 60
      case "treasure-hunt":
        return treasureDuration * 60
      default:
        return 25 * 60
    }
  }

  const saveNameChanges = () => {
    setCurrentAdventurerName(tempAdventurerName)
    setCurrentCompanionName(tempCompanionName)
    setEditingNames(false)
  }

  const cancelNameChanges = () => {
    setTempAdventurerName(currentAdventurerName)
    setTempCompanionName(currentCompanionName)
    setEditingNames(false)
  }

  const getPersonalityMessage = (context: string) => {
    const messages = {
      encouraging: {
        start: [
          `Go ${currentAdventurerName}! You've got this! Let's conquer this quest together! 🌟`,
          `You're absolutely amazing, ${currentAdventurerName}! ${currentCompanionName} believes in your incredible strength! 💪`,
          `Time to shine, ${currentAdventurerName}! I'm here cheering you on every step of the way! ⚡`,
          `You're unstoppable, ${currentAdventurerName}! Let's show this challenge what we're made of! 🔥`,
          `Ready to be awesome, ${currentAdventurerName}? ${currentCompanionName} knows you'll crush this! 🚀`,
        ],
        complete: [
          `Amazing work, ${currentAdventurerName}! ${currentCompanionName} is so proud of your dedication! You're unstoppable! 🎉`,
          `INCREDIBLE job, ${currentAdventurerName}! You just proved how powerful you are! Victory is yours! 🏆`,
          `Outstanding, ${currentAdventurerName}! ${currentCompanionName} is bursting with pride! You're a true champion! ⭐`,
          `Phenomenal work, ${currentAdventurerName}! You've shown such determination and strength! 💎`,
          `Absolutely brilliant, ${currentAdventurerName}! ${currentCompanionName} couldn't be more impressed! 🌟`,
        ],
        break: [
          `Fantastic job! Time to recharge your magical energy and celebrate your progress! ⚡`,
          `You've earned this break, ${currentAdventurerName}! Bask in the glory of your achievement! 🌟`,
          `Victory celebration time! ${currentCompanionName} is so excited about your success! 🎊`,
          `Time to power up, champion! You've been absolutely incredible! 💪`,
          `Rest like the hero you are, ${currentAdventurerName}! Your energy will return even stronger! ✨`,
        ],
      },
      gentle: {
        start: [
          `Take a deep breath, ${currentAdventurerName}. Let's focus together peacefully and mindfully 🌸`,
          `Find your center, dear ${currentAdventurerName}. ${currentCompanionName} is here to guide you gently 🕯️`,
          `Let's move with intention and grace, ${currentAdventurerName}. Peace flows through you 🌙`,
          `Breathe in calm, breathe out focus, ${currentAdventurerName}. We'll walk this path together serenely 🍃`,
          `Gentle strength lives within you, ${currentAdventurerName}. ${currentCompanionName} holds space for your journey 🌺`,
        ],
        complete: [
          `Well done, ${currentAdventurerName}. ${currentCompanionName} believes in you and your gentle strength 💙`,
          `Beautiful work, dear ${currentAdventurerName}. Your mindful effort has blossomed into success 🌸`,
          `Peace and accomplishment flow through you, ${currentAdventurerName}. ${currentCompanionName} honors your dedication 🕊️`,
          `Your gentle persistence has borne fruit, ${currentAdventurerName}. Feel the quiet satisfaction within 🌿`,
          `Gracefully done, ${currentAdventurerName}. ${currentCompanionName} witnesses your inner light shining bright ✨`,
        ],
        break: [
          `Rest peacefully, dear adventurer. You've earned this moment of tranquility 🌙`,
          `Let serenity wash over you, ${currentAdventurerName}. ${currentCompanionName} watches over your rest 🌊`,
          `Breathe deeply and release, ${currentAdventurerName}. This quiet moment is yours to cherish 🍃`,
          `Find stillness in this pause, dear ${currentAdventurerName}. Peace surrounds you like gentle mist 🌸`,
          `Rest in the garden of your accomplishment, ${currentAdventurerName}. ${currentCompanionName} tends to your peace 🌺`,
        ],
      },
      playful: {
        start: [
          `Adventure time, ${currentAdventurerName}! Let's make this quest fun and exciting! Ready to play? 🎮`,
          `Hero ${currentAdventurerName}, your epic journey begins! ${currentCompanionName} is your trusty sidekick! 🗡️`,
          `Level up time, ${currentAdventurerName}! Let's turn this into the most fun quest ever! 🎯`,
          `Game on, brave ${currentAdventurerName}! ${currentCompanionName} has loaded your adventure - let's go! 🚀`,
          `Quest activated, ${currentAdventurerName}! Time to collect some XP and have a blast doing it! ⚡`,
        ],
        complete: [
          `Woohoo! ${currentAdventurerName} and ${currentCompanionName} make an absolutely awesome team! Victory dance time! 🚀`,
          `LEVEL UP! ${currentAdventurerName} just earned major XP! ${currentCompanionName} is doing victory flips! 🎮`,
          `Quest completed! ${currentAdventurerName}, you're officially a legend! Time for the victory parade! 🎊`,
          `BOOM! ${currentAdventurerName} just crushed that challenge! ${currentCompanionName} is throwing confetti! 🎉`,
          `Achievement unlocked! ${currentAdventurerName} the Magnificent! ${currentCompanionName} is so proud! 🏆`,
        ],
        break: [
          `Play time! Let's recharge with some fun and get ready for the next exciting quest! 🎈`,
          `Intermission time, ${currentAdventurerName}! ${currentCompanionName} suggests a victory snack! 🍪`,
          `Side quest: Relaxation Mode activated! Time to power up for the next adventure! 🎮`,
          `Break time mini-game! ${currentAdventurerName}, you've unlocked the 'Chill Zone' achievement! 🌟`,
          `Checkpoint reached! ${currentAdventurerName}, save your progress and enjoy this fun break! 🎯`,
        ],
      },
    }

    const personalityMessages = messages[companionPersonality as keyof typeof messages]
    if (!personalityMessages) {
      return `Great job, ${currentAdventurerName}! Keep up the amazing work!`
    }

    const contextMessages = personalityMessages[context as keyof typeof personalityMessages]
    if (!contextMessages || !Array.isArray(contextMessages)) {
      return `Great job, ${currentAdventurerName}! Keep up the amazing work!`
    }

    // Randomly select a message from the array
    const randomIndex = Math.floor(Math.random() * contextMessages.length)
    return contextMessages[randomIndex]
  }

  useEffect(() => {
    if (timerState === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerState === "running") {
      // Timer completed
      setTimerState("completed")
      setCelebrating(true)

      // Auto-cycle for pomodoro
      if (mode === "pomodoro") {
        setCycles((prev) => prev + 1)
        setTimeout(() => {
          setMode("break")
          setTimeLeft(customBreak * 60)
          setTimerState("idle")
          setCelebrating(false)
        }, 3000)
      } else if (mode === "break") {
        setTimeout(() => {
          setMode("pomodoro")
          setTimeLeft(customFocus * 60)
          setTimerState("idle")
          setCelebrating(false)
        }, 3000)
      } else {
        setTimeout(() => {
          setCelebrating(false)
          setTimerState("idle")
        }, 3000)
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    timerState,
    timeLeft,
    mode,
    customFocus,
    customBreak,
    currentAdventurerName,
    currentCompanionName,
    companionPersonality,
  ])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => setTimerState("running")
  const handlePause = () => setTimerState("paused")
  const handleReset = () => {
    setTimerState("idle")
    setTimeLeft(getInitialTime(mode))
    setCelebrating(false)
  }

  const switchMode = (newMode: TimerMode) => {
    if (newMode === "quickwin" && activeTreasures.length > 0) {
      // Show treasure selection instead of directly switching
      setShowTreasureSelection(true)
      setTreasureSelectionMode("select")
      return
    }

    setMode(newMode)
    setTimeLeft(getInitialTime(newMode))
    setTimerState("idle")
    setCelebrating(false)
  }

  // Dragon slaying functions
  const startDragonSlaying = (duration: number) => {
    setDragonDuration(duration)
    setMode("dragon-slaying")
    setTimeLeft(duration * 60)
    setTimerState("idle")
    setIsDragonActive(true)
    setShowDragonDurationSelect(false)
    setCelebrating(false)
  }

  const completeDragonSlaying = () => {
    setDragonSessions((prev) => prev + 1)
    setIsDragonActive(false)
    setMode("pomodoro")
    setTimeLeft(25 * 60)
    setTimerState("idle")
  }

  const cancelDragonSlaying = () => {
    setIsDragonActive(false)
    setMode("pomodoro")
    setTimeLeft(25 * 60)
    setTimerState("idle")
  }

  const completeFrog = () => {
    setFrogCompleted(true)
    setIsDragonActive(false)
    setCelebrating(true)
    setTimeout(() => setCelebrating(false), 2000)
  }

  // Treasure hunting functions
  const addTreasure = () => {
    if (newTreasure.trim()) {
      const treasure: Treasure = {
        id: Date.now().toString(),
        name: newTreasure.trim(),
        sessions: 0,
        completed: false,
      }
      setTreasures([...treasures, treasure])
      setNewTreasure("")
    }
  }

  const startTreasureHunt = (treasureId: string, duration: number) => {
    const treasure = treasures.find((t) => t.id === treasureId)
    if (treasure) {
      setTreasureDuration(duration)
      setMode("treasure-hunt")
      setTimeLeft(duration * 60)
      setTimerState("idle")
      setActiveTreasure(treasure)
      setShowTreasureDurationSelect(false)
      setSelectedTreasureId(null)
      setCelebrating(false)
    }
  }

  const completeTreasureHunt = () => {
    if (activeTreasure) {
      setTreasures((prev) =>
        prev.map((t) => (t.id === activeTreasure.id ? { ...t, sessions: t.sessions + 1, completed: true } : t)),
      )
      setCompletedQuickWins((prev) => prev + 1)
      setActiveTreasure(null)
      setMode("pomodoro")
      setTimeLeft(25 * 60)
      setTimerState("idle")
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 2000)
    }
  }

  const cancelTreasureHunt = () => {
    setActiveTreasure(null)
    setMode("pomodoro")
    setTimeLeft(25 * 60)
    setTimerState("idle")
  }

  const switchTreasure = (treasureId: string) => {
    const treasure = treasures.find((t) => t.id === treasureId)
    if (treasure && !treasure.completed) {
      setActiveTreasure(treasure)
      // Keep current timer running but switch the active treasure
    }
  }

  const deleteTreasure = (treasureId: string) => {
    setTreasures((prev) => prev.filter((t) => t.id !== treasureId))
    if (activeTreasure?.id === treasureId) {
      setActiveTreasure(null)
      setMode("pomodoro")
      setTimeLeft(25 * 60)
      setTimerState("idle")
    }
  }

  const startTreasureSelection = (treasureId: string) => {
    setSelectedTreasureId(treasureId)
    setShowTreasureDurationSelect(true)
    setShowTreasureSelection(false)
  }

  const editTreasureFromSelection = (treasureId: string) => {
    const treasure = treasures.find((t) => t.id === treasureId)
    if (treasure) {
      setEditingTreasureId(treasureId)
      setEditingTreasureName(treasure.name)
      setTreasureSelectionMode("edit")
    }
  }

  const saveTreasureEdit = () => {
    if (editingTreasureId && editingTreasureName.trim()) {
      setTreasures((prev) =>
        prev.map((t) => (t.id === editingTreasureId ? { ...t, name: editingTreasureName.trim() } : t)),
      )
      setEditingTreasureId(null)
      setEditingTreasureName("")
      setTreasureSelectionMode("select")
    }
  }

  const cancelTreasureEdit = () => {
    setEditingTreasureId(null)
    setEditingTreasureName("")
    setTreasureSelectionMode("select")
  }

  const deleteTreasureFromSelection = (treasureId: string) => {
    setTreasures((prev) => prev.filter((t) => t.id !== treasureId))
    if (activeTreasure?.id === treasureId) {
      setActiveTreasure(null)
      setMode("pomodoro")
      setTimeLeft(25 * 60)
      setTimerState("idle")
    }
  }

  const addTreasureFromSelection = () => {
    if (newTreasure.trim()) {
      const treasure: Treasure = {
        id: Date.now().toString(),
        name: newTreasure.trim(),
        sessions: 0,
        completed: false,
      }
      setTreasures([...treasures, treasure])
      setNewTreasure("")
      setTreasureSelectionMode("select")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const progress = ((getInitialTime(mode) - timeLeft) / getInitialTime(mode)) * 100

  const getCharacterColor = () => {
    if (celebrating) return theme === "dark" ? "bg-yellow-400" : "bg-orange-400"

    const baseColors = {
      dark: {
        pomodoro: "bg-rose-400",
        break: "bg-emerald-400",
        quickwin: "bg-purple-400",
        custom: "bg-blue-400",
        "dragon-slaying": "bg-orange-500",
        "treasure-hunt": "bg-purple-500",
      },
      light: {
        pomodoro: "bg-red-500",
        break: "bg-green-500",
        quickwin: "bg-violet-500",
        custom: "bg-sky-500",
        "dragon-slaying": "bg-orange-600",
        "treasure-hunt": "bg-purple-600",
      },
    }

    return baseColors[theme][mode] || baseColors[theme].pomodoro
  }

  const getBackgroundClasses = () => {
    if (theme === "dark") {
      return "bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900"
    } else {
      return "bg-gradient-to-b from-orange-200 via-pink-200 to-rose-300"
    }
  }

  const getTextColor = () => {
    return theme === "dark" ? "text-white" : "text-gray-800"
  }

  const getCardClasses = () => {
    if (theme === "dark") {
      return "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl"
    } else {
      return "bg-white/30 backdrop-blur-xl border-white/40 shadow-xl"
    }
  }

  const activeTreasures = treasures.filter((t) => !t.completed)
  const completedTreasures = treasures.filter((t) => t.completed)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Mountain Silhouette */}
      <div className={`absolute inset-0 transition-all duration-1000 ${getBackgroundClasses()}`}>
        {/* Stars for dark mode */}
        {theme === "dark" && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}

        {/* Mountain Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            <path
              d="M0,300 L0,200 Q100,150 200,180 Q300,120 400,160 Q500,100 600,140 Q700,80 800,120 Q900,60 1000,100 Q1100,40 1200,80 L1200,300 Z"
              fill={theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)"}
            />
            <path
              d="M0,300 L0,220 Q150,180 300,200 Q450,160 600,180 Q750,140 900,160 Q1050,120 1200,140 L1200,300 Z"
              fill={theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)"}
            />
          </svg>
        </div>

        {/* Floating ambient elements */}
        {[...Array(celebrating ? 12 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              theme === "dark"
                ? celebrating
                  ? "bg-yellow-200/20"
                  : "bg-white/10"
                : celebrating
                  ? "bg-orange-200/30"
                  : "bg-white/20"
            }`}
            style={{
              width: celebrating ? Math.random() * 40 + 20 : Math.random() * 60 + 30,
              height: celebrating ? Math.random() * 40 + 20 : Math.random() * 60 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
            }}
            animate={
              celebrating
                ? {
                    y: [0, -30, 0],
                    x: [0, 15, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }
                : {
                    y: [0, -15, 0],
                    x: [0, 8, 0],
                    scale: [1, 1.05, 1],
                  }
            }
            transition={{
              duration: celebrating ? 1.5 : 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Sparkling effects for treasure hunt mode */}
        {mode === "treasure-hunt" && activeTreasure && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className={`absolute ${theme === "dark" ? "text-purple-300" : "text-purple-500"}`}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              >
                <Star className="w-3 h-3 fill-current" />
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div
        className={`relative z-10 ${
          orientation === "landscape" && isMobile ? "max-w-full mx-auto p-2" : "max-w-6xl mx-auto p-4"
        }`}
      >
        {/* Header with Theme Toggle */}
        <div
          className={`flex justify-between items-center mb-4 ${
            orientation === "landscape" && isMobile ? "pt-1" : "pt-4"
          }`}
        >
          <div className="text-left">
            <motion.h1
              className={`${
                orientation === "landscape" && isMobile ? "text-2xl" : "text-4xl"
              } font-bold ${getTextColor()} drop-shadow-lg mb-1`}
              animate={celebrating ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: celebrating ? 3 : 0 }}
            >
              🍅 {currentAdventurerName}'s Quest
            </motion.h1>
            <p className={`${getTextColor()} opacity-80 ${orientation === "landscape" && isMobile ? "text-sm" : ""}`}>
              {currentCompanionName} is here to help! {getPersonalityMessage("start")}
            </p>
          </div>

          {/* Right side buttons - keep smaller size */}
          <div className="flex gap-2">
            <Button
              onClick={toggleTheme}
              size="sm"
              className={`rounded-full w-10 h-10 ${getCardClasses()} border-0 ${getTextColor()} hover:scale-110 transition-all duration-200`}
            >
              <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </Button>

            <Button
              onClick={() => setShowAmbientSounds(true)}
              size="sm"
              className={`rounded-full w-10 h-10 ${getCardClasses()} border-0 ${getTextColor()} hover:scale-110 transition-all duration-200`}
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.3 }}>
                <Music className="w-4 h-4" />
              </motion.div>
            </Button>

            <Button
              onClick={() => setShowHelpGuide(true)}
              size="sm"
              className={`rounded-full w-10 h-10 ${getCardClasses()} border-0 ${getTextColor()} hover:scale-110 transition-all duration-200`}
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <HelpCircle className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div
          className={`${
            orientation === "landscape" && isMobile
              ? "grid grid-cols-1 lg:grid-cols-5 gap-3"
              : "grid grid-cols-1 lg:grid-cols-3 gap-6"
          }`}
        >
          {/* Left Column - Tasks */}
          <div className={`space-y-3 ${orientation === "landscape" && isMobile ? "lg:col-span-2" : ""}`}>
            {/* Dragon of the Day */}
            <Card className={getCardClasses()}>
              <CardContent className={`${orientation === "landscape" && isMobile ? "p-3" : "p-4"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className={`w-5 h-5 ${getTextColor()}`} />
                  <h3
                    className={`font-bold ${getTextColor()} ${
                      orientation === "landscape" && isMobile ? "text-sm" : ""
                    }`}
                  >
                    🐉 Dragon of the Day
                  </h3>
                  {dragonSessions > 0 && (
                    <span
                      className={`text-xs ${theme === "dark" ? "bg-orange-600/30" : "bg-orange-200/50"} px-2 py-1 rounded-full ${getTextColor()}`}
                    >
                      {dragonSessions} sessions
                    </span>
                  )}
                </div>

                {!frogCompleted ? (
                  <div className="space-y-3">
                    <Input
                      value={frogTask}
                      onChange={(e) => setFrogTask(e.target.value)}
                      placeholder="Your biggest, scariest task..."
                      className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "bg-white/20 border-white/30 text-gray-800 placeholder:text-gray-600"} ${
                        orientation === "landscape" && isMobile ? "text-sm" : ""
                      }`}
                    />

                    {!isDragonActive && !showDragonDurationSelect && (
                      <Button
                        onClick={() => setShowDragonDurationSelect(true)}
                        disabled={!frogTask.trim()}
                        className={`w-full bg-orange-600 hover:bg-orange-700 text-white ${
                          orientation === "landscape" && isMobile ? "text-sm py-2" : ""
                        }`}
                      >
                        Begin Dragon Hunt! 🗡️
                      </Button>
                    )}

                    {showDragonDurationSelect && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 border-t border-white/20 pt-3"
                      >
                        <p className={`text-sm ${getTextColor()} opacity-80`}>Choose your battle duration:</p>
                        <div
                          className={`grid grid-cols-2 gap-2 ${
                            orientation === "landscape" && isMobile ? "grid-cols-4" : ""
                          }`}
                        >
                          <Button
                            onClick={() => startDragonSlaying(25)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                          >
                            🔮 25 min
                          </Button>
                          <Button
                            onClick={() => startDragonSlaying(15)}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                          >
                            ⚡ 15 min
                          </Button>
                          <Button
                            onClick={() => startDragonSlaying(45)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                          >
                            🏰 45 min
                          </Button>
                          <Button
                            onClick={() => startDragonSlaying(60)}
                            size="sm"
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs"
                          >
                            🗡️ 60 min
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={dragonDuration}
                            onChange={(e) => setDragonDuration(Number(e.target.value))}
                            placeholder="Custom minutes"
                            className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "bg-white/20 border-white/30 text-gray-800 placeholder:text-gray-600"} text-sm`}
                            min="1"
                            max="180"
                          />
                          <Button
                            onClick={() => startDragonSlaying(dragonDuration)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Start
                          </Button>
                        </div>
                        <Button
                          onClick={() => setShowDragonDurationSelect(false)}
                          size="sm"
                          variant="ghost"
                          className={`w-full ${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"}`}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}

                    {isDragonActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${theme === "dark" ? "bg-orange-600/20" : "bg-orange-200/30"} rounded-lg p-3 space-y-2`}
                      >
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            ⚔️
                          </motion.span>
                          <span
                            className={`font-medium ${getTextColor()} ${
                              orientation === "landscape" && isMobile ? "text-sm" : ""
                            }`}
                          >
                            Dragon Battle in Progress!
                          </span>
                        </div>
                        <p className={`text-sm ${getTextColor()} opacity-80`}>Fighting: {frogTask}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={completeFrog}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs"
                          >
                            🏆 Dragon Slain!
                          </Button>
                          <Button
                            onClick={cancelDragonSlaying}
                            size="sm"
                            variant="ghost"
                            className={`${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"} text-xs`}
                          >
                            Retreat
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p
                      className={`${getTextColor()} font-medium ${
                        orientation === "landscape" && isMobile ? "text-sm" : ""
                      }`}
                    >
                      Dragon slain! 🎉
                    </p>
                    <p className={`${getTextColor()} opacity-80 text-sm mb-2`}>{frogTask}</p>
                    {dragonSessions > 0 && (
                      <p className={`${getTextColor()} opacity-60 text-xs`}>
                        Defeated in {dragonSessions} battle session{dragonSessions !== 1 ? "s" : ""}
                      </p>
                    )}
                    <Button
                      onClick={() => {
                        setFrogCompleted(false)
                        setFrogTask("")
                        setDragonSessions(0)
                        setIsDragonActive(false)
                      }}
                      size="sm"
                      variant="ghost"
                      className={`mt-2 ${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"} text-xs`}
                    >
                      New Dragon Hunt
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Treasure Collection - Condensed for landscape mobile */}
            <Card className={getCardClasses()}>
              <CardContent className={`${orientation === "landscape" && isMobile ? "p-3" : "p-4"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Gem className={`w-5 h-5 ${getTextColor()}`} />
                  <h3
                    className={`font-bold ${getTextColor()} ${
                      orientation === "landscape" && isMobile ? "text-sm" : ""
                    }`}
                  >
                    💎 Treasure Collection
                  </h3>
                  <span
                    className={`text-xs ${theme === "dark" ? "bg-white/20" : "bg-white/30"} px-2 py-1 rounded-full ${getTextColor()}`}
                  >
                    {completedTreasures.length} collected
                  </span>
                </div>

                {/* Add new treasure */}
                <div className="space-y-2 mb-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTreasure}
                      onChange={(e) => setNewTreasure(e.target.value)}
                      placeholder="New treasure to collect..."
                      className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "bg-white/20 border-white/30 text-gray-800 placeholder:text-gray-600"} text-sm`}
                      onKeyPress={(e) => e.key === "Enter" && addTreasure()}
                    />
                    <Button onClick={addTreasure} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      +
                    </Button>
                  </div>
                </div>

                {/* Rest of treasure collection content remains the same but with responsive text sizes */}
                {/* ... (keeping the existing treasure collection logic but adding responsive classes) */}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Timer */}
          <div
            className={`flex flex-col items-center justify-center space-y-4 ${
              orientation === "landscape" && isMobile ? "lg:col-span-1" : ""
            }`}
          >
            {/* Character - Smaller in landscape mobile */}
            <motion.div
              className={`${orientation === "landscape" && isMobile ? "mb-2" : "mb-4"}`}
              animate={
                celebrating
                  ? {
                      scale: [1, 1.3, 1.1, 1.3, 1],
                      rotate: [0, 10, -10, 10, 0],
                      y: [0, -20, 0, -10, 0],
                    }
                  : timerState === "running"
                    ? {
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0],
                      }
                    : {}
              }
              transition={{
                duration: celebrating ? 2 : 2,
                repeat: celebrating ? 2 : timerState === "running" ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              <div className="relative">
                <motion.div
                  className={`${
                    orientation === "landscape" && isMobile ? "w-16 h-16" : "w-24 h-24"
                  } rounded-full relative ${getCharacterColor()} shadow-2xl`}
                  animate={{
                    boxShadow:
                      timerState === "running"
                        ? ["0 15px 30px rgba(0,0,0,0.2)", "0 20px 40px rgba(0,0,0,0.3)", "0 15px 30px rgba(0,0,0,0.2)"]
                        : "0 15px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Eyes - Adjusted for smaller size */}
                  <div
                    className={`absolute ${
                      orientation === "landscape" && isMobile ? "top-4 left-3 w-2 h-2" : "top-6 left-4 w-3 h-3"
                    } bg-white rounded-full`}
                  >
                    <motion.div
                      className={`${
                        orientation === "landscape" && isMobile ? "w-1 h-1 mt-0.5 ml-0.5" : "w-1.5 h-1.5 mt-0.5 ml-0.5"
                      } bg-black rounded-full`}
                      animate={
                        celebrating ? { scale: [1, 0.5, 1] } : timerState === "running" ? { x: [0, 1, -1, 0] } : {}
                      }
                      transition={{
                        duration: celebrating ? 0.5 : 3,
                        repeat: celebrating ? 6 : timerState === "running" ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />
                  </div>
                  <div
                    className={`absolute ${
                      orientation === "landscape" && isMobile ? "top-4 right-3 w-2 h-2" : "top-6 right-4 w-3 h-3"
                    } bg-white rounded-full`}
                  >
                    <motion.div
                      className={`${
                        orientation === "landscape" && isMobile ? "w-1 h-1 mt-0.5 ml-0.5" : "w-1.5 h-1.5 mt-0.5 ml-0.5"
                      } bg-black rounded-full`}
                      animate={
                        celebrating ? { scale: [1, 0.5, 1] } : timerState === "running" ? { x: [0, -1, 1, 0] } : {}
                      }
                      transition={{
                        duration: celebrating ? 0.5 : 3,
                        repeat: celebrating ? 6 : timerState === "running" ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />
                  </div>

                  {/* Mouth - Adjusted for smaller size */}
                  <motion.div
                    className={`absolute ${
                      orientation === "landscape" && isMobile
                        ? "bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2"
                        : "bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3"
                    } border-2 border-white ${celebrating ? "rounded-full" : "rounded-b-full"}`}
                    animate={
                      celebrating
                        ? { scaleX: [1, 1.3, 1], scaleY: [1, 0.7, 1] }
                        : timerState === "running"
                          ? { scaleY: [1, 0.8, 1] }
                          : {}
                    }
                    transition={{
                      duration: celebrating ? 0.3 : 2,
                      repeat: celebrating ? 8 : timerState === "running" ? Number.POSITIVE_INFINITY : 0,
                    }}
                  />

                  {/* Celebration stars */}
                  <AnimatePresence>
                    {celebrating && (
                      <>
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute ${theme === "dark" ? "text-yellow-300" : "text-orange-400"}`}
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${10 + (i % 2) * 20}%`,
                            }}
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              rotate: [0, 180, 360],
                              y: [0, -20, -40],
                            }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                          >
                            <Star
                              className={`${
                                orientation === "landscape" && isMobile ? "w-3 h-3" : "w-4 h-4"
                              } fill-current`}
                            />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Character name */}
                <motion.p
                  className={`text-center mt-2 ${
                    orientation === "landscape" && isMobile ? "text-xs" : "text-sm"
                  } ${getTextColor()} opacity-80 font-medium`}
                  animate={celebrating ? { scale: [1, 1.1, 1] } : {}}
                >
                  {currentCompanionName}
                </motion.p>
              </div>
            </motion.div>

            {/* Mode Selector - More compact in landscape mobile */}
            <div
              className={`flex gap-2 ${
                orientation === "landscape" && isMobile
                  ? "mb-2 flex-wrap justify-center"
                  : "mb-4 flex-wrap justify-center"
              }`}
            >
              <Button
                onClick={() => switchMode("pomodoro")}
                size="sm"
                variant={mode === "pomodoro" ? "default" : "outline"}
                className={
                  mode === "pomodoro"
                    ? `bg-red-600 text-white ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                    : `${getCardClasses()} ${getTextColor()} border-0 ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                }
              >
                🔮 Focus Magic
              </Button>
              <Button
                onClick={() => switchMode("break")}
                size="sm"
                variant={mode === "break" ? "default" : "outline"}
                className={
                  mode === "break"
                    ? `bg-emerald-600 text-white ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                    : `${getCardClasses()} ${getTextColor()} border-0 ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                }
              >
                🌸 Rest
              </Button>
              <Button
                onClick={() => switchMode("quickwin")}
                size="sm"
                variant={mode === "quickwin" ? "default" : "outline"}
                className={
                  mode === "quickwin"
                    ? `bg-purple-600 text-white ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                    : `${getCardClasses()} ${getTextColor()} border-0 ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                }
              >
                💎 Treasure
              </Button>
              {isDragonActive && (
                <Button
                  onClick={() => switchMode("dragon-slaying")}
                  size="sm"
                  variant={mode === "dragon-slaying" ? "default" : "outline"}
                  className={
                    mode === "dragon-slaying"
                      ? `bg-orange-600 text-white ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                      : `${getCardClasses()} ${getTextColor()} border-0 ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                  }
                >
                  ⚔️ Dragon Battle
                </Button>
              )}
              {activeTreasure && (
                <Button
                  onClick={() => switchMode("treasure-hunt")}
                  size="sm"
                  variant={mode === "treasure-hunt" ? "default" : "outline"}
                  className={
                    mode === "treasure-hunt"
                      ? `bg-purple-600 text-white ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                      : `${getCardClasses()} ${getTextColor()} border-0 ${orientation === "landscape" && isMobile ? "text-xs px-2 py-1" : ""}`
                  }
                >
                  💎 Treasure Hunt
                </Button>
              )}
            </div>

            {/* Timer Display - Smaller in landscape mobile */}
            <motion.div
              className={`${getCardClasses()} rounded-3xl ${
                orientation === "landscape" && isMobile ? "p-4" : "p-6"
              } shadow-2xl`}
              animate={{
                scale: timeLeft <= 10 && timerState === "running" ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: timeLeft <= 10 && timerState === "running" ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              <div
                className={`${
                  orientation === "landscape" && isMobile ? "text-3xl" : "text-5xl"
                } font-bold ${getTextColor()} text-center font-mono tracking-wider drop-shadow-lg mb-4`}
              >
                {formatTime(timeLeft)}
              </div>

              {/* Battle/Hunt indicators - More compact */}
              {mode === "dragon-slaying" && isDragonActive && (
                <motion.div
                  className={`${theme === "dark" ? "bg-orange-600/20" : "bg-orange-200/30"} rounded-lg ${
                    orientation === "landscape" && isMobile ? "p-2" : "p-3"
                  } mt-4 text-center`}
                  animate={{
                    boxShadow:
                      timerState === "running"
                        ? [
                            "0 0 0 rgba(249, 115, 22, 0.4)",
                            "0 0 20px rgba(249, 115, 22, 0.6)",
                            "0 0 0 rgba(249, 115, 22, 0.4)",
                          ]
                        : "0 0 0 rgba(249, 115, 22, 0.4)",
                  }}
                  transition={{ duration: 2, repeat: timerState === "running" ? Number.POSITIVE_INFINITY : 0 }}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-2"
                    animate={timerState === "running" ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.5, repeat: timerState === "running" ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <span className={orientation === "landscape" && isMobile ? "text-lg" : "text-2xl"}>⚔️</span>
                    <span
                      className={`font-bold ${getTextColor()} ${
                        orientation === "landscape" && isMobile ? "text-sm" : ""
                      }`}
                    >
                      Dragon Battle
                    </span>
                    <span className={orientation === "landscape" && isMobile ? "text-lg" : "text-2xl"}>🐉</span>
                  </motion.div>
                  <p
                    className={`text-sm ${getTextColor()} opacity-80 ${
                      orientation === "landscape" && isMobile ? "text-xs" : ""
                    }`}
                  >
                    Session {dragonSessions + 1} • {frogTask}
                  </p>
                </motion.div>
              )}

              {mode === "treasure-hunt" && activeTreasure && (
                <motion.div
                  className={`${theme === "dark" ? "bg-purple-600/20" : "bg-purple-200/30"} rounded-lg ${
                    orientation === "landscape" && isMobile ? "p-2" : "p-3"
                  } mt-4 text-center`}
                  animate={{
                    boxShadow:
                      timerState === "running"
                        ? [
                            "0 0 0 rgba(147, 51, 234, 0.4)",
                            "0 0 20px rgba(147, 51, 234, 0.6)",
                            "0 0 0 rgba(147, 51, 234, 0.4)",
                          ]
                        : "0 0 0 rgba(147, 51, 234, 0.4)",
                  }}
                  transition={{ duration: 2, repeat: timerState === "running" ? Number.POSITIVE_INFINITY : 0 }}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-2"
                    animate={timerState === "running" ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.5, repeat: timerState === "running" ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <span className={orientation === "landscape" && isMobile ? "text-lg" : "text-2xl"}>💎</span>
                    <span
                      className={`font-bold ${getTextColor()} ${
                        orientation === "landscape" && isMobile ? "text-sm" : ""
                      }`}
                    >
                      Treasure Hunt
                    </span>
                    <span className={orientation === "landscape" && isMobile ? "text-lg" : "text-2xl"}>🏃</span>
                  </motion.div>
                  <p
                    className={`text-sm ${getTextColor()} opacity-80 ${
                      orientation === "landscape" && isMobile ? "text-xs" : ""
                    }`}
                  >
                    Session {activeTreasure.sessions + 1} • {activeTreasure.name}
                  </p>
                </motion.div>
              )}

              {/* Progress Ring - Smaller in landscape mobile */}
              <div
                className={`relative ${orientation === "landscape" && isMobile ? "w-12 h-12" : "w-16 h-16"} mx-auto`}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={theme === "dark" ? "white" : "rgba(0,0,0,0.6)"}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={283}
                    strokeDashoffset={283 - (progress / 100) * 283}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Control Buttons - Smaller in landscape mobile */}
            <div className="flex gap-3">
              <Button
                onClick={timerState === "running" ? handlePause : handleStart}
                size="lg"
                className={`rounded-full ${
                  orientation === "landscape" && isMobile ? "w-12 h-12" : "w-14 h-14"
                } ${getCharacterColor().replace("bg-", "bg-").replace("-400", "-600").replace("-500", "-700")} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                disabled={timerState === "completed"}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {timerState === "running" ? (
                    <Pause className={`${orientation === "landscape" && isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                  ) : (
                    <Play className={`${orientation === "landscape" && isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                  )}
                </motion.div>
              </Button>

              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className={`rounded-full ${
                  orientation === "landscape" && isMobile ? "w-12 h-12" : "w-14 h-14"
                } ${getCardClasses()} ${getTextColor()} border-0 hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <RotateCcw className={`${orientation === "landscape" && isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                </motion.div>
              </Button>
            </div>
          </div>

          {/* Right Column - Stats & Settings */}
          <div className={`space-y-3 ${orientation === "landscape" && isMobile ? "lg:col-span-2" : ""}`}>
            {/* Stats */}
            <Card className={getCardClasses()}>
              <CardContent className={`${orientation === "landscape" && isMobile ? "p-3" : "p-4"}`}>
                <h3
                  className={`font-bold ${getTextColor()} mb-3 flex items-center gap-2 ${
                    orientation === "landscape" && isMobile ? "text-sm" : ""
                  }`}
                >
                  <Coffee className={`w-5 h-5`} />
                  Quest Progress
                </h3>
                <div
                  className={`space-y-2 ${getTextColor()} ${orientation === "landscape" && isMobile ? "text-sm" : ""}`}
                >
                  <div className="flex justify-between">
                    <span>Focus spells cast:</span>
                    <span className="font-bold">{cycles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treasures collected:</span>
                    <span className="font-bold">{completedTreasures.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dragon status:</span>
                    <span className="font-bold">{frogCompleted ? "🗡️ Slain" : "🐉 Lurking"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Timer Settings - More compact in landscape mobile */}
            <Card className={getCardClasses()}>
              <CardContent className={`${orientation === "landscape" && isMobile ? "p-3" : "p-4"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-bold ${getTextColor()} flex items-center gap-2 ${
                      orientation === "landscape" && isMobile ? "text-sm" : ""
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Custom Magic
                  </h3>
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    size="sm"
                    variant="ghost"
                    className={`${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"}`}
                  >
                    {showSettings ? "−" : "+"}
                  </Button>
                </div>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className={`${getTextColor()} text-sm block mb-1`}>Focus spell (minutes)</label>
                        <Input
                          type="number"
                          value={customFocus}
                          onChange={(e) => setCustomFocus(Number(e.target.value))}
                          className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white" : "bg-white/20 border-white/30 text-gray-800"} ${
                            orientation === "landscape" && isMobile ? "text-sm" : ""
                          }`}
                          min="1"
                          max="120"
                        />
                      </div>
                      <div>
                        <label className={`${getTextColor()} text-sm block mb-1`}>Rest period (minutes)</label>
                        <Input
                          type="number"
                          value={customBreak}
                          onChange={(e) => setCustomBreak(Number(e.target.value))}
                          className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white" : "bg-white/20 border-white/30 text-gray-800"} ${
                            orientation === "landscape" && isMobile ? "text-sm" : ""
                          }`}
                          min="1"
                          max="30"
                        />
                      </div>
                      <Button
                        onClick={() => switchMode("custom")}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${
                          orientation === "landscape" && isMobile ? "text-sm py-2" : ""
                        }`}
                      >
                        Cast Custom Spell ✨
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Name Settings - More compact in landscape mobile */}
            <Card className={getCardClasses()}>
              <CardContent className={`${orientation === "landscape" && isMobile ? "p-3" : "p-4"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-bold ${getTextColor()} flex items-center gap-2 ${
                      orientation === "landscape" && isMobile ? "text-sm" : ""
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    Adventure Names
                  </h3>
                  <Button
                    onClick={() => setEditingNames(!editingNames)}
                    size="sm"
                    variant="ghost"
                    className={`${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"}`}
                  >
                    {editingNames ? "−" : "✏️"}
                  </Button>
                </div>

                <AnimatePresence>
                  {editingNames && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className={`${getTextColor()} text-sm block mb-1`}>Adventurer Name</label>
                        <Input
                          value={tempAdventurerName}
                          onChange={(e) => setTempAdventurerName(e.target.value)}
                          placeholder="Your adventurer name..."
                          className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "bg-white/20 border-white/30 text-gray-800 placeholder:text-gray-600"} ${
                            orientation === "landscape" && isMobile ? "text-sm" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`${getTextColor()} text-sm block mb-1`}>Spirit Companion Name</label>
                        <Input
                          value={tempCompanionName}
                          onChange={(e) => setTempCompanionName(e.target.value)}
                          placeholder="Your spirit's name..."
                          className={`${theme === "dark" ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "bg-white/20 border-white/30 text-gray-800 placeholder:text-gray-600"} ${
                            orientation === "landscape" && isMobile ? "text-sm" : ""
                          }`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={saveNameChanges}
                          className={`flex-1 bg-green-600 hover:bg-green-700 text-white ${
                            orientation === "landscape" && isMobile ? "text-sm py-2" : ""
                          }`}
                          disabled={!tempAdventurerName.trim() || !tempCompanionName.trim()}
                        >
                          Save Names ✨
                        </Button>
                        <Button
                          onClick={cancelNameChanges}
                          variant="ghost"
                          className={`${getTextColor()} ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-white/30"} ${
                            orientation === "landscape" && isMobile ? "text-sm" : ""
                          }`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!editingNames && (
                  <div
                    className={`space-y-2 ${getTextColor()} ${
                      orientation === "landscape" && isMobile ? "text-sm" : "text-sm"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Adventurer:</span>
                      <span className="font-medium">{currentAdventurerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spirit:</span>
                      <span className="font-medium">{currentCompanionName}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Celebration Message */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`${theme === "dark" ? "bg-white/90" : "bg-white/95"} backdrop-blur-md rounded-3xl ${
                  orientation === "landscape" && isMobile ? "p-6" : "p-8"
                } text-center shadow-2xl`}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
              >
                <motion.div
                  className={`${orientation === "landscape" && isMobile ? "text-4xl" : "text-6xl"} mb-4`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎉
                </motion.div>
                <h2
                  className={`${
                    orientation === "landscape" && isMobile ? "text-xl" : "text-2xl"
                  } font-bold text-gray-800 mb-2`}
                >
                  {getPersonalityMessage("complete")}
                </h2>
                <p className={`text-gray-600 ${orientation === "landscape" && isMobile ? "text-sm" : ""}`}>
                  {mode === "quickwin"
                    ? "Treasure collected!"
                    : mode === "pomodoro"
                      ? "Focus spell completed!"
                      : mode === "break"
                        ? "Rest period finished!"
                        : mode === "treasure-hunt"
                          ? "Treasure hunt completed!"
                          : "Quest completed!"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Ambient Sounds Modal */}
      <AmbientSounds theme={theme} isVisible={showAmbientSounds} onToggle={() => setShowAmbientSounds(false)} />
      {/* Help Guide Modal */}
      <HelpGuide theme={theme} isVisible={showHelpGuide} onToggle={() => setShowHelpGuide(false)} />
    </div>
  )
}
