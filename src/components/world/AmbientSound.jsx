import { useEffect } from 'react'
import { startAmbient, stopAmbient, resumeAudio } from '../../audio/worldSounds'

export default function AmbientSound({ worldType, active }) {
  useEffect(() => {
    if (active) {
      resumeAudio()
      startAmbient(worldType)
    }
    return () => stopAmbient()
  }, [worldType, active])

  return null
}