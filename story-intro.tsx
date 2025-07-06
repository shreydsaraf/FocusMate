"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface StoryIntroProps {
  onComplete: (data: {
    adventurerName: string
    companionName: string
    companionPersonality: string
  }) => void
}

export default function StoryIntro({ onComplete }: StoryIntroProps) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [adventurerName, setAdventurerName] = useState("")
  const [companionName, setCompanionName] = useState("")
  const [companionPersonality, setCompanionPersonality] = useState("")

  const nextScreen = () => {
    if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1)
    } else {
      onComplete({ adventurerName, companionName, companionPersonality })
    }
  }

  const selectPersonality = (personality: string) => {
    setCompanionPersonality(personality)
    setTimeout(() => nextScreen(), 1000)
  }

  const screens = [
    // Screen 0: Welcome to the Realm
    {
      title: "Welcome to the Realm of Focus",
      scene: "forest",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-8xl mb-4"
          >
            🌟
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-lg text-white/90 leading-relaxed"
          >
            Welcome, brave soul! You're about to embark on the greatest adventure of all - mastering your focus and
            conquering the chaos of tasks that lie before you.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-white/80"
          >
            But every great adventurer needs a name...
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="space-y-4"
          >
            <Input
              value={adventurerName}
              onChange={(e) => setAdventurerName(e.target.value)}
              placeholder="Enter your adventurer name..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-center text-lg"
            />
            <Button
              onClick={nextScreen}
              disabled={!adventurerName.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            >
              Begin My Journey ✨
            </Button>
          </motion.div>
        </div>
      ),
    },

    // Screen 1: Meet Your Companion
    {
      title: "A Magical Encounter",
      scene: "clearing",
      content: (
        <div className="text-center space-y-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-white/90">
            Greetings, {adventurerName}! As you venture deeper into the enchanted forest, you discover a magical
            clearing where a friendly spirit awaits...
          </motion.p>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-24 h-24 bg-red-500 rounded-full mx-auto relative shadow-2xl"
          >
            <div className="absolute top-6 left-4 w-3 h-3 bg-white rounded-full">
              <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5 ml-0.5" />
            </div>
            <div className="absolute top-6 right-4 w-3 h-3 bg-white rounded-full">
              <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5 ml-0.5" />
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 border-2 border-white rounded-b-full" />
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-green-500 rounded-full"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-white/90 italic"
          >
            "Hello there, {adventurerName}! I'm a Focus Spirit, here to guide you on your quest. But I need a name to
            bond with you properly..."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-4"
          >
            <Input
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="Name your Focus Spirit..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-center"
            />
            <Button
              onClick={nextScreen}
              disabled={!companionName.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
            >
              Nice to meet you, {companionName}! 🤝
            </Button>
          </motion.div>
        </div>
      ),
    },

    // Screen 2: Choose Companion Personality
    {
      title: "The Spirit's Nature",
      scene: "clearing",
      content: (
        <div className="text-center space-y-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-white/90">
            Wonderful! {companionName} glows with magical energy. But every Focus Spirit has a unique personality. What
            kind of companion do you need on this journey?
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Button
                onClick={() => selectPersonality("encouraging")}
                className="w-full h-24 bg-yellow-600 hover:bg-yellow-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-2xl">🌟</span>
                <span className="font-bold">Encouraging</span>
                <span className="text-xs opacity-80">Cheers you on with enthusiasm</span>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Button
                onClick={() => selectPersonality("gentle")}
                className="w-full h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-2xl">🌸</span>
                <span className="font-bold">Gentle</span>
                <span className="text-xs opacity-80">Offers calm, peaceful guidance</span>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <Button
                onClick={() => selectPersonality("playful")}
                className="w-full h-24 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-2xl">🎮</span>
                <span className="font-bold">Playful</span>
                <span className="text-xs opacity-80">Makes productivity fun and engaging</span>
              </Button>
            </motion.div>
          </div>

          {companionPersonality && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white/90 bg-white/20 rounded-lg p-4 mt-4"
            >
              Perfect choice! {companionName} radiates {companionPersonality} energy and is ready to help you succeed!
              ✨
            </motion.p>
          )}
        </div>
      ),
    },

    // Screen 3: Learn Focus Magic
    {
      title: "The Ancient Art of Focus Magic",
      scene: "study",
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/90"
          >
            {companionName} leads you to an ancient library filled with glowing tomes. "Here," they whisper, "lies the
            secret of Focus Magic..."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/20 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">🍅 The Pomodoro Spell</h3>
            <p className="text-white/90">
              "Focus Magic works in powerful 25-minute bursts, followed by 5-minute rest periods. This ancient rhythm
              helps your mind stay sharp and prevents magical exhaustion!"
            </p>
            <div className="flex items-center justify-center space-x-4 text-white/80">
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
            <Button onClick={nextScreen} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              I understand the Focus Magic! 🔮
            </Button>
          </motion.div>
        </div>
      ),
    },

    // Screen 4: Dragon Slaying Technique
    {
      title: "The Dragon Slaying Technique",
      scene: "mountain",
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/90"
          >
            As you climb the mystical mountain, {companionName} shares an ancient warrior's wisdom...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/20 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">🐸 Slay Your Dragon First</h3>
            <p className="text-white/90">
              "Every day, brave adventurer, you must face your biggest, scariest task first - your 'Dragon of the Day.'
              When you defeat it early, the rest of your quests become much easier!"
            </p>
            <div className="bg-green-600/30 rounded-lg p-4">
              <p className="text-white/90 italic">
                "Eat that frog! If you have to eat a frog, do it first thing in the morning. If you have to eat two
                frogs, eat the biggest one first." - Ancient Productivity Wisdom
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
            <Button onClick={nextScreen} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              I'll slay my dragon first! 🗡️
            </Button>
          </motion.div>
        </div>
      ),
    },

    // Screen 5: Treasure Collecting
    {
      title: "The Art of Treasure Collecting",
      scene: "treasure",
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/90"
          >
            Finally, {companionName} brings you to a glittering treasure chamber...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/20 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">⚡ Quick Win Treasures</h3>
            <p className="text-white/90">
              "Not all quests take hours to complete! Some treasures can be claimed in just 2 minutes. These 'Quick
              Wins' build momentum and fill your adventure pouch with confidence!"
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
            <Button onClick={nextScreen} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              I'm ready to collect treasures! 💎
            </Button>
          </motion.div>
        </div>
      ),
    },

    // Screen 6: Quest Begins
    {
      title: "Your Adventure Begins!",
      scene: "sunrise",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl mb-4"
          >
            🚀
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 font-bold"
          >
            Congratulations, {adventurerName}!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/20 rounded-lg p-6 space-y-4"
          >
            <p className="text-white/90">
              You now possess the ancient knowledge of productivity magic!
              {companionName} will be by your side, ready to help you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-red-600/30 rounded-lg p-3">
                <div className="text-2xl mb-2">🔮</div>
                <div className="font-bold">Cast Focus Spells</div>
                <div className="opacity-80">25-minute magic sessions</div>
              </div>
              <div className="bg-green-600/30 rounded-lg p-3">
                <div className="text-2xl mb-2">🐉</div>
                <div className="font-bold">Slay Dragons</div>
                <div className="opacity-80">Tackle your biggest task first</div>
              </div>
              <div className="bg-purple-600/30 rounded-lg p-3">
                <div className="text-2xl mb-2">💎</div>
                <div className="font-bold">Collect Treasures</div>
                <div className="opacity-80">Complete 2-minute quick wins</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-4"
          >
            <p className="text-white/90 italic">
              "Remember, {adventurerName}, every great adventure begins with a single step. Your productivity quest
              starts now!"
            </p>
            <Button
              onClick={nextScreen}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-bold"
            >
              Begin My Quest! ⚔️✨
            </Button>
          </motion.div>
        </div>
      ),
    },
  ]

  const getSceneBackground = (scene: string) => {
    switch (scene) {
      case "forest":
        return "bg-gradient-to-b from-indigo-900 via-purple-900 to-green-900"
      case "clearing":
        return "bg-gradient-to-b from-blue-900 via-purple-800 to-green-800"
      case "study":
        return "bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900"
      case "mountain":
        return "bg-gradient-to-b from-gray-800 via-purple-900 to-blue-900"
      case "treasure":
        return "bg-gradient-to-b from-yellow-800 via-purple-900 to-indigo-900"
      case "sunrise":
        return "bg-gradient-to-b from-orange-400 via-pink-500 to-purple-600"
      default:
        return "bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900"
    }
  }

  const currentScreenData = screens[currentScreen]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ${getSceneBackground(currentScreenData.scene)}`}>
        {/* Stars */}
        {currentScreenData.scene !== "sunrise" && (
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
        {currentScreenData.scene === "treasure" && (
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
        {currentScreenData.scene === "mountain" && (
          <div className="absolute bottom-0 left-0 right-0 h-64">
            <svg viewBox="0 0 1200 400" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
              <path
                d="M0,400 L0,250 Q200,150 400,200 Q600,100 800,150 Q1000,50 1200,100 L1200,400 Z"
                fill="rgba(0,0,0,0.6)"
              />
              <path d="M0,400 L0,300 Q300,200 600,250 Q900,180 1200,220 L1200,400 Z" fill="rgba(0,0,0,0.4)" />
            </svg>
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1
                  className="text-3xl font-bold text-white text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentScreenData.title}
                </motion.h1>

                {currentScreenData.content}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
