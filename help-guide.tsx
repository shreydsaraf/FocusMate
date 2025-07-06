"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface HelpGuideProps {
  theme: "light" | "dark"
  isVisible: boolean
  onToggle: () => void
}

type HelpTopic = "overview" | "focus-magic" | "dragon-slaying" | "treasure-collecting"

interface HelpScreen {
  id: HelpTopic
  title: string
  scene: string
  icon: string
  content: React.ReactNode
}

export default function HelpGuide({ theme, isVisible, onToggle }: HelpGuideProps) {
  const [currentTopic, setCurrentTopic] = useState<HelpTopic>("overview")

  const getCardClasses = () => {
    if (theme === "dark") {
      return "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl"
    } else {
      return "bg-white/30 backdrop-blur-xl border-white/40 shadow-xl"
    }
  }

  const getTextColor = () => {
    return theme === "dark" ? "text-white" : "text-gray-800"
  }

  const getSceneBackground = (scene: string) => {
    const baseGradient =
      theme === "dark" ? "from-indigo-900 via-purple-900 to-blue-900" : "from-orange-200 via-pink-200 to-rose-300"

    switch (scene) {
      case "overview":
        return `bg-gradient-to-b ${baseGradient}`
      case "study":
        return theme === "dark"
          ? "bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900"
          : "bg-gradient-to-b from-purple-200 via-blue-200 to-indigo-300"
      case "mountain":
        return theme === "dark"
          ? "bg-gradient-to-b from-gray-800 via-purple-900 to-blue-900"
          : "bg-gradient-to-b from-gray-300 via-purple-200 to-blue-300"
      case "treasure":
        return theme === "dark"
          ? "bg-gradient-to-b from-yellow-800 via-purple-900 to-indigo-900"
          : "bg-gradient-to-b from-yellow-300 via-orange-200 to-purple-300"
      default:
        return `bg-gradient-to-b ${baseGradient}`
    }
  }

  const helpScreens: HelpScreen[] = [
    {
      id: "overview",
      title: "Adventure Guide",
      scene: "overview",
      icon: "🗺️",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl mb-4"
          >
            🏰
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-lg ${getTextColor()} leading-relaxed`}
          >
            Welcome to your productivity quest! This magical realm transforms everyday tasks into an epic adventure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Button
              onClick={() => setCurrentTopic("focus-magic")}
              className="h-20 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-2xl">🔮</span>
              <span className="font-bold">Focus Magic</span>
            </Button>
            <Button
              onClick={() => setCurrentTopic("dragon-slaying")}
              className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-2xl">🐉</span>
              <span className="font-bold">Dragon Slaying</span>
            </Button>
            <Button
              onClick={() => setCurrentTopic("treasure-collecting")}
              className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-2xl">💎</span>
              <span className="font-bold">Treasure Collecting</span>
            </Button>
          </motion.div>
        </div>
      ),
    },
    {
      id: "focus-magic",
      title: "The Ancient Art of Focus Magic",
      scene: "study",
      icon: "🔮",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl mb-4"
          >
            🔮
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${getCardClasses()} rounded-lg p-6 space-y-4`}
          >
            <h3 className={`text-xl font-bold ${getTextColor()}`}>🍅 The Pomodoro Spell</h3>
            <p className={`${getTextColor()}`}>
              Focus Magic works in powerful 25-minute bursts, followed by 5-minute rest periods. This ancient rhythm
              helps your mind stay sharp and prevents magical exhaustion!
            </p>
            <div className={`flex items-center justify-center space-x-4 ${getTextColor()}`}>
              <div className="text-center">
                <div className="text-2xl">⚡</div>
                <div className="text-sm">25 min Focus</div>
              </div>
              <div className="text-xl">→</div>
              <div className="text-center">
                <div className="text-2xl">🌸</div>
                <div className="text-sm">5 min Rest</div>
              </div>
            </div>
            <div className={`text-sm ${getTextColor()} opacity-80 italic`}>
              "The 🔮 Focus Magic button casts this spell. Use it when you need deep concentration!"
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "dragon-slaying",
      title: "The Dragon Slaying Technique",
      scene: "mountain",
      icon: "🐉",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl mb-4"
          >
            🐉
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${getCardClasses()} rounded-lg p-6 space-y-4`}
          >
            <h3 className={`text-xl font-bold ${getTextColor()}`}>🗡️ Slay Your Dragon First</h3>
            <p className={`${getTextColor()}`}>
              Every day, brave adventurer, you must face your biggest, scariest task first - your 'Dragon of the Day.'
              When you defeat it early, the rest of your quests become much easier!
            </p>
            <div className={`${theme === "dark" ? "bg-green-600/30" : "bg-green-200/50"} rounded-lg p-4`}>
              <p className={`${getTextColor()} italic`}>
                "Eat that frog! If you have to eat a frog, do it first thing in the morning. If you have to eat two
                frogs, eat the biggest one first." - Ancient Productivity Wisdom
              </p>
            </div>
            <div className={`text-sm ${getTextColor()} opacity-80 italic`}>
              "The 🐉 Dragon of the Day section is where you write your most important task!"
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "treasure-collecting",
      title: "The Art of Treasure Collecting",
      scene: "treasure",
      icon: "💎",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl mb-4"
          >
            💎
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${getCardClasses()} rounded-lg p-6 space-y-4`}
          >
            <h3 className={`text-xl font-bold ${getTextColor()}`}>⚡ Quick Win Treasures</h3>
            <p className={`${getTextColor()}`}>
              Not all quests take hours to complete! Some treasures can be claimed in just 2 minutes. These 'Quick Wins'
              build momentum and fill your adventure pouch with confidence!
            </p>
            <div className="flex justify-center space-x-4">
              {["💎", "⭐", "🏆", "✨"].map((gem, i) => (
                <motion.div
                  key={i}
                  className="text-3xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                >
                  {gem}
                </motion.div>
              ))}
            </div>
            <div className={`text-sm ${getTextColor()} opacity-80 italic`}>
              "The 💎 Treasure Collection section is for your 2-minute tasks that give quick wins!"
            </div>
          </motion.div>
        </div>
      ),
    },
  ]

  const currentScreen = helpScreens.find((screen) => screen.id === currentTopic) || helpScreens[0]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Animated Background */}
          <div className={`absolute inset-0 transition-all duration-1000 ${getSceneBackground(currentScreen.scene)}`}>
            {/* Stars for dark theme */}
            {theme === "dark" && (
              <>
                {[...Array(30)].map((_, i) => (
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

            {/* Scene-specific elements */}
            {currentScreen.scene === "treasure" && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300 opacity-40"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 20 + 10}px`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  >
                    💎
                  </motion.div>
                ))}
              </>
            )}

            {/* Mountain Silhouette for mountain scene */}
            {currentScreen.scene === "mountain" && (
              <div className="absolute bottom-0 left-0 right-0 h-64">
                <svg viewBox="0 0 1200 400" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
                  <path
                    d="M0,400 L0,250 Q200,150 400,200 Q600,100 800,150 Q1000,50 1200,100 L1200,400 Z"
                    fill={theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)"}
                  />
                  <path
                    d="M0,400 L0,300 Q300,200 600,250 Q900,180 1200,220 L1200,400 Z"
                    fill={theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)"}
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            <Card className={`w-full max-w-4xl ${getCardClasses()}`}>
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {currentTopic !== "overview" && (
                      <Button
                        onClick={() => setCurrentTopic("overview")}
                        size="sm"
                        variant="ghost"
                        className={`${getTextColor()} hover:bg-white/20`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    )}
                    <span className="text-2xl">{currentScreen.icon}</span>
                    <h1 className={`text-2xl font-bold ${getTextColor()}`}>{currentScreen.title}</h1>
                  </div>
                  <Button
                    onClick={onToggle}
                    size="sm"
                    variant="ghost"
                    className={`${getTextColor()} hover:bg-white/20`}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTopic}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentScreen.content}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation hint */}
                {currentTopic === "overview" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className={`text-center mt-6 text-sm ${getTextColor()} opacity-70`}
                  >
                    Click on any topic above to learn more about your adventure tools!
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
