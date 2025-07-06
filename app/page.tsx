"use client"

import { useState } from "react"
import StoryIntro from "../story-intro"
import PomodoroTimer from "../pomodoro-timer"

export default function Page() {
  const [showStory, setShowStory] = useState(true)
  const [storyData, setStoryData] = useState({
    adventurerName: "",
    companionName: "",
    companionPersonality: "",
  })

  const handleStoryComplete = (data: typeof storyData) => {
    setStoryData(data)
    setShowStory(false)
  }

  if (showStory) {
    return <StoryIntro onComplete={handleStoryComplete} />
  }

  return (
    <PomodoroTimer
      adventurerName={storyData.adventurerName}
      companionName={storyData.companionName}
      companionPersonality={storyData.companionPersonality}
    />
  )
}
