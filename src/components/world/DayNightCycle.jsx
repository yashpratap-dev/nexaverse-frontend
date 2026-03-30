import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function DayNightCycle({ onTimeUpdate, speed = 0.001 }) {
  const timeRef = useRef(0.3) // Start at day

  useFrame(() => {
    timeRef.current = (timeRef.current + speed) % 1
    onTimeUpdate && onTimeUpdate(timeRef.current)
  })

  return null
}