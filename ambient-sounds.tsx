"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AmbientSoundsProps {
  theme: "light" | "dark"
  isVisible: boolean
  onToggle: () => void
}

type SoundType =
  | "none"
  | "enchanted-forest"
  | "mystical-rain"
  | "crackling-fire"
  | "ocean-waves"
  | "mountain-wind"
  | "library-whispers"
  | "cafe-chatter"
  | "gentle-stream"
  | "night-crickets"
  | "wizard-study"
  | "dragon-cave"

interface Sound {
  id: SoundType
  name: string
  icon: string
  description: string
}

export default function AmbientSounds({ theme, isVisible, onToggle }: AmbientSoundsProps) {
  const [selectedSound, setSelectedSound] = useState<SoundType>("none")
  const [volume, setVolume] = useState([50])
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContextState, setAudioContextState] = useState<"suspended" | "running" | "closed">("suspended")
  const [isMobile, setIsMobile] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)

  const sounds: Sound[] = [
    { id: "none", name: "Silence", icon: "🔇", description: "Pure quiet for deep focus" },
    {
      id: "enchanted-forest",
      name: "Enchanted Forest",
      icon: "🌲",
      description: "Gentle rustling leaves and distant birds",
    },
    { id: "mystical-rain", name: "Mystical Rain", icon: "🌧️", description: "Soft raindrops on magical leaves" },
    { id: "crackling-fire", name: "Cozy Campfire", icon: "🔥", description: "Warm crackling flames" },
    { id: "ocean-waves", name: "Serene Shores", icon: "🌊", description: "Gentle waves on a peaceful beach" },
    { id: "mountain-wind", name: "Mountain Breeze", icon: "🏔️", description: "Soft wind through mountain peaks" },
    {
      id: "library-whispers",
      name: "Ancient Library",
      icon: "📚",
      description: "Quiet page turns and distant whispers",
    },
    { id: "cafe-chatter", name: "Tavern Ambience", icon: "☕", description: "Gentle murmur of a cozy tavern" },
    { id: "gentle-stream", name: "Crystal Stream", icon: "💧", description: "Babbling brook through the forest" },
    { id: "night-crickets", name: "Starlit Evening", icon: "🦗", description: "Peaceful cricket symphony" },
    { id: "wizard-study", name: "Wizard's Study", icon: "🔮", description: "Magical ambience with soft chimes" },
    { id: "dragon-cave", name: "Dragon's Lair", icon: "🐉", description: "Deep, resonant cave atmosphere" },
  ]

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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Initialize Web Audio Context with mobile support
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          audioContextRef.current = new AudioContext()
          gainNodeRef.current = audioContextRef.current.createGain()
          gainNodeRef.current.connect(audioContextRef.current.destination)

          // Set initial volume
          gainNodeRef.current.gain.value = volume[0] / 100

          // Track audio context state
          setAudioContextState(audioContextRef.current.state)

          // Listen for state changes
          const handleStateChange = () => {
            if (audioContextRef.current) {
              setAudioContextState(audioContextRef.current.state)
            }
          }

          audioContextRef.current.addEventListener("statechange", handleStateChange)

          return () => {
            if (audioContextRef.current) {
              audioContextRef.current.removeEventListener("statechange", handleStateChange)
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize AudioContext:", error)
      }
    }

    return () => {
      stopAllSounds()
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume[0] / 100
    }
  }, [volume])

  // Resume audio context on user interaction (required for mobile)
  const resumeAudioContext = async () => {
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume()
        setAudioContextState(audioContextRef.current.state)
      } catch (error) {
        console.error("Failed to resume AudioContext:", error)
      }
    }
  }

  const createWhiteNoise = () => {
    if (!audioContextRef.current || audioContextRef.current.state !== "running") return null

    try {
      const bufferSize = audioContextRef.current.sampleRate * 2
      const noiseBuffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate)
      const output = noiseBuffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = audioContextRef.current.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true
      return whiteNoise
    } catch (error) {
      console.error("Failed to create white noise:", error)
      return null
    }
  }

  const createTone = (frequency: number, type: OscillatorType = "sine") => {
    if (!audioContextRef.current || audioContextRef.current.state !== "running") return null

    try {
      const oscillator = audioContextRef.current.createOscillator()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      return oscillator
    } catch (error) {
      console.error("Failed to create tone:", error)
      return null
    }
  }

  const stopAllSounds = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
        osc.disconnect()
      } catch (e) {
        // Oscillator might already be stopped
      }
    })
    oscillatorsRef.current = []

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop()
        noiseNodeRef.current.disconnect()
      } catch (e) {
        // Node might already be stopped
      }
      noiseNodeRef.current = null
    }
  }

  const playSound = async (soundType: SoundType) => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    // Resume audio context if suspended (required for mobile)
    await resumeAudioContext()

    if (audioContextRef.current.state !== "running") {
      console.warn("AudioContext is not running")
      return
    }

    stopAllSounds()

    if (soundType === "none") {
      setIsPlaying(false)
      return
    }

    try {
      const ctx = audioContextRef.current
      const gainNode = gainNodeRef.current

      switch (soundType) {
        case "enchanted-forest":
          // White noise filtered for forest sounds
          const forestNoise = createWhiteNoise()
          if (forestNoise) {
            const forestFilter = ctx.createBiquadFilter()
            forestFilter.type = "lowpass"
            forestFilter.frequency.value = 800
            forestNoise.connect(forestFilter)
            forestFilter.connect(gainNode)
            forestNoise.start()
            noiseNodeRef.current = forestNoise
          }
          break

        case "mystical-rain":
          // High-frequency filtered white noise
          const rainNoise = createWhiteNoise()
          if (rainNoise) {
            const rainFilter = ctx.createBiquadFilter()
            rainFilter.type = "highpass"
            rainFilter.frequency.value = 1000
            const rainGain = ctx.createGain()
            rainGain.gain.value = 0.3
            rainNoise.connect(rainFilter)
            rainFilter.connect(rainGain)
            rainGain.connect(gainNode)
            rainNoise.start()
            noiseNodeRef.current = rainNoise
          }
          break

        case "crackling-fire":
          // Low-frequency noise with random pops
          const fireNoise = createWhiteNoise()
          if (fireNoise) {
            const fireFilter = ctx.createBiquadFilter()
            fireFilter.type = "lowpass"
            fireFilter.frequency.value = 400
            const fireGain = ctx.createGain()
            fireGain.gain.value = 0.4
            fireNoise.connect(fireFilter)
            fireFilter.connect(fireGain)
            fireGain.connect(gainNode)
            fireNoise.start()
            noiseNodeRef.current = fireNoise
          }
          break

        case "ocean-waves":
          // Low-frequency oscillating noise
          const waveNoise = createWhiteNoise()
          const waveLFO = createTone(0.1, "sine")
          if (waveNoise && waveLFO) {
            const waveFilter = ctx.createBiquadFilter()
            waveFilter.type = "lowpass"
            waveFilter.frequency.value = 600
            const waveGain = ctx.createGain()
            const lfoGain = ctx.createGain()
            lfoGain.gain.value = 0.3

            waveLFO.connect(lfoGain)
            lfoGain.connect(waveGain.gain)
            waveNoise.connect(waveFilter)
            waveFilter.connect(waveGain)
            waveGain.connect(gainNode)

            waveNoise.start()
            waveLFO.start()
            noiseNodeRef.current = waveNoise
            oscillatorsRef.current.push(waveLFO)
          }
          break

        case "mountain-wind":
          // Mid-frequency filtered noise
          const windNoise = createWhiteNoise()
          if (windNoise) {
            const windFilter = ctx.createBiquadFilter()
            windFilter.type = "bandpass"
            windFilter.frequency.value = 500
            windFilter.Q.value = 0.5
            const windGain = ctx.createGain()
            windGain.gain.value = 0.3
            windNoise.connect(windFilter)
            windFilter.connect(windGain)
            windGain.connect(gainNode)
            windNoise.start()
            noiseNodeRef.current = windNoise
          }
          break

        case "gentle-stream":
          // High-frequency noise with gentle modulation
          const streamNoise = createWhiteNoise()
          const streamLFO = createTone(0.3, "sine")
          if (streamNoise && streamLFO) {
            const streamFilter = ctx.createBiquadFilter()
            streamFilter.type = "highpass"
            streamFilter.frequency.value = 800
            const streamGain = ctx.createGain()
            const streamLfoGain = ctx.createGain()
            streamLfoGain.gain.value = 0.2

            streamLFO.connect(streamLfoGain)
            streamLfoGain.connect(streamGain.gain)
            streamNoise.connect(streamFilter)
            streamFilter.connect(streamGain)
            streamGain.connect(gainNode)

            streamNoise.start()
            streamLFO.start()
            noiseNodeRef.current = streamNoise
            oscillatorsRef.current.push(streamLFO)
          }
          break

        case "wizard-study":
          // Soft tones with gentle harmonics
          const tone1 = createTone(220, "sine")
          const tone2 = createTone(330, "sine")
          const tone3 = createTone(440, "sine")
          if (tone1 && tone2 && tone3) {
            const studyGain1 = ctx.createGain()
            const studyGain2 = ctx.createGain()
            const studyGain3 = ctx.createGain()
            studyGain1.gain.value = 0.1
            studyGain2.gain.value = 0.08
            studyGain3.gain.value = 0.06

            tone1.connect(studyGain1)
            tone2.connect(studyGain2)
            tone3.connect(studyGain3)
            studyGain1.connect(gainNode)
            studyGain2.connect(gainNode)
            studyGain3.connect(gainNode)

            tone1.start()
            tone2.start()
            tone3.start()
            oscillatorsRef.current.push(tone1, tone2, tone3)
          }
          break

        default:
          // Default to gentle white noise
          const defaultNoise = createWhiteNoise()
          if (defaultNoise) {
            const defaultGain = ctx.createGain()
            defaultGain.gain.value = 0.2
            defaultNoise.connect(defaultGain)
            defaultGain.connect(gainNode)
            defaultNoise.start()
            noiseNodeRef.current = defaultNoise
          }
      }

      setIsPlaying(true)
    } catch (error) {
      console.error("Failed to play sound:", error)
      setIsPlaying(false)
    }
  }

  const handleSoundSelect = async (soundType: SoundType) => {
    setSelectedSound(soundType)
    await playSound(soundType)
  }

  // Handle touch events for mobile
  const handleTouchStart = async (soundType: SoundType) => {
    if (isMobile) {
      await resumeAudioContext()
    }
    await handleSoundSelect(soundType)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        >
          <motion.div onClick={(e) => e.stopPropagation()} className="w-full max-w-md max-h-[80vh] overflow-hidden">
            <Card className={getCardClasses()}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Music className={`w-6 h-6 ${getTextColor()}`} />
                    <h2 className={`text-xl font-bold ${getTextColor()}`}>🎵 Ambient Soundscapes</h2>
                  </div>
                  <Button
                    onClick={onToggle}
                    size="sm"
                    variant="ghost"
                    className={`${getTextColor()} hover:bg-white/20`}
                  >
                    ✕
                  </Button>
                </div>

                {/* Audio Context Status for Mobile */}
                {isMobile && audioContextState === "suspended" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg ${theme === "dark" ? "bg-yellow-900/30 border-yellow-600/50" : "bg-yellow-100/50 border-yellow-400/50"} border text-center`}
                  >
                    <p className={`text-sm ${getTextColor()} opacity-80`}>📱 Tap any sound to enable audio on mobile</p>
                  </motion.div>
                )}

                {/* Volume Control */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <VolumeX className={`w-4 h-4 ${getTextColor()}`} />
                    <div className="flex-1 relative h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-200"
                        style={{ width: `${volume[0]}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume[0]}
                        onChange={(e) => setVolume([Number(e.target.value)])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onTouchStart={resumeAudioContext}
                      />
                    </div>
                    <Volume2 className={`w-4 h-4 ${getTextColor()}`} />
                  </div>
                  <p className={`text-sm ${getTextColor()} opacity-70 text-center`}>Volume: {volume[0]}%</p>
                </div>

                {/* Sound Selection */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sounds.map((sound) => (
                    <motion.button
                      key={sound.id}
                      onClick={() => handleSoundSelect(sound.id)}
                      onTouchStart={() => handleTouchStart(sound.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedSound === sound.id
                          ? theme === "dark"
                            ? "bg-purple-600/30 border-purple-400/50"
                            : "bg-purple-200/50 border-purple-400/50"
                          : theme === "dark"
                            ? "bg-white/5 hover:bg-white/10 border-white/10"
                            : "bg-white/10 hover:bg-white/20 border-white/20"
                      } border touch-manipulation`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sound.icon}</span>
                        <div className="flex-1">
                          <div className={`font-medium ${getTextColor()}`}>{sound.name}</div>
                          <div className={`text-xs ${getTextColor()} opacity-70`}>{sound.description}</div>
                        </div>
                        {selectedSound === sound.id && isPlaying && audioContextState === "running" && (
                          <motion.div
                            className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-purple-400" : "bg-purple-600"}`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Current Playing */}
                {selectedSound !== "none" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-white/10" : "bg-white/20"} text-center`}
                  >
                    <p className={`text-sm ${getTextColor()} opacity-80`}>
                      {audioContextState === "running" && isPlaying ? (
                        <>
                          Now playing:{" "}
                          <span className="font-medium">{sounds.find((s) => s.id === selectedSound)?.name}</span>
                        </>
                      ) : (
                        <>
                          Selected:{" "}
                          <span className="font-medium">{sounds.find((s) => s.id === selectedSound)?.name}</span>
                          {audioContextState === "suspended" && isMobile && (
                            <span className="block text-xs mt-1 opacity-60">Tap to start audio</span>
                          )}
                        </>
                      )}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
