import { useEffect, useRef } from 'react'

export default function AmbientSound({ worldType, active }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!active) return

    // Stop previous
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Pick music based on world
    const tracks = {
      FOREST:  '/music1.aac',
      DUNGEON: '/music2.mp3',
      OCEAN:   '/music2.mp3',
      CITY:    '/music3.mp3',
      DESERT:  '/music3.mp3',
    }

    const src = tracks[worldType] || '/music1.aac'
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    // Play on user interaction
    const playAudio = () => {
      audio.play().catch(() => {})
      document.removeEventListener('click', playAudio)
      document.removeEventListener('keydown', playAudio)
    }

    document.addEventListener('click', playAudio)
    document.addEventListener('keydown', playAudio)

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', playAudio)
      document.removeEventListener('keydown', playAudio)
    }
  }, [worldType, active])

  return null
}