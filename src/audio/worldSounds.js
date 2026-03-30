import { Howl, Howler } from 'howler'

Howler.volume(0.4)

const sounds = {}

// Synthesized ambient using Web Audio API
const AC = new (window.AudioContext || window.webkitAudioContext)()

function createOscillator(freq, type, vol, duration) {
  const o = AC.createOscillator()
  const g = AC.createGain()
  o.connect(g); g.connect(AC.destination)
  o.type = type; o.frequency.value = freq
  g.gain.setValueAtTime(vol, AC.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + duration)
  o.start(); o.stop(AC.currentTime + duration)
}

function createNoise(duration, vol, filterFreq = 1000) {
  const buf = AC.createBuffer(1, AC.sampleRate * duration, AC.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = AC.createBufferSource()
  const g = AC.createGain()
  const f = AC.createBiquadFilter()
  f.type = 'bandpass'; f.frequency.value = filterFreq
  src.buffer = buf; src.connect(f); f.connect(g); g.connect(AC.destination)
  g.gain.setValueAtTime(vol, AC.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + duration)
  src.start(); src.stop(AC.currentTime + duration)
}

export function resumeAudio() {
  if (AC.state === 'suspended') AC.resume()
}

// UI Sounds
export function playUIClick() {
  resumeAudio()
  createOscillator(800, 'sine', 0.1, 0.08)
  createOscillator(1200, 'sine', 0.05, 0.05)
}

export function playUIHover() {
  resumeAudio()
  createOscillator(600, 'sine', 0.04, 0.04)
}

export function playUISuccess() {
  resumeAudio()
  ;[440, 550, 660, 880].forEach((f, i) =>
    setTimeout(() => createOscillator(f, 'sine', 0.08, 0.2), i * 60)
  )
}

export function playUIError() {
  resumeAudio()
  createOscillator(200, 'sawtooth', 0.1, 0.3)
  createNoise(0.2, 0.05, 300)
}

// World ambient loops
let ambientNode = null
let ambientGain = null

export function startAmbient(worldType) {
  resumeAudio()
  stopAmbient()
  ambientGain = AC.createGain()
  ambientGain.connect(AC.destination)
  ambientGain.gain.setValueAtTime(0, AC.currentTime)
  ambientGain.gain.linearRampToValueAtTime(0.08, AC.currentTime + 2)

  if (worldType === 'FOREST') {
    // Wind-like noise
    const buf = AC.createBuffer(1, AC.sampleRate * 4, AC.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = AC.createBufferSource()
    const f = AC.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = 400; f.Q.value = 0.5
    src.buffer = buf; src.loop = true
    src.connect(f); f.connect(ambientGain)
    src.start(); ambientNode = src
  } else if (worldType === 'DUNGEON') {
    const o = AC.createOscillator()
    o.type = 'sine'; o.frequency.value = 55
    o.connect(ambientGain); o.start()
    ambientNode = o
  } else if (worldType === 'OCEAN') {
    const buf = AC.createBuffer(1, AC.sampleRate * 3, AC.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = AC.createBufferSource()
    const f = AC.createBiquadFilter()
    f.type = 'lowpass'; f.frequency.value = 600
    src.buffer = buf; src.loop = true
    src.connect(f); f.connect(ambientGain)
    src.start(); ambientNode = src
  } else {
    const o = AC.createOscillator()
    o.type = 'sine'; o.frequency.value = 80
    o.connect(ambientGain); o.start()
    ambientNode = o
  }
}

export function stopAmbient() {
  if (ambientNode) {
    try { ambientNode.stop() } catch (e) {}
    ambientNode = null
  }
  if (ambientGain) {
    ambientGain.disconnect()
    ambientGain = null
  }
}

// Step/movement sound
export function playFootstep(terrain = 'grass') {
  resumeAudio()
  const freqs = { grass: 150, stone: 300, water: 100, sand: 200 }
  createNoise(0.06, 0.04, freqs[terrain] || 150)
}

// Thunder
export function playThunder() {
  resumeAudio()
  createNoise(0.1, 0.5, 200)
  const o = AC.createOscillator(), g = AC.createGain()
  o.connect(g); g.connect(AC.destination)
  o.type = 'sawtooth'; o.frequency.setValueAtTime(60, AC.currentTime)
  o.frequency.linearRampToValueAtTime(20, AC.currentTime + 3)
  g.gain.setValueAtTime(0.3, AC.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 3.5)
  o.start(); o.stop(AC.currentTime + 3.6)
}

// Portal sound
export function playPortal() {
  resumeAudio()
  ;[220, 330, 440, 660, 880, 1100].forEach((f, i) =>
    setTimeout(() => createOscillator(f, 'sine', 0.06, 0.4), i * 80)
  )
}

// Level up
export function playLevelUp() {
  resumeAudio()
  ;[261, 329, 392, 523, 659, 784].forEach((f, i) =>
    setTimeout(() => createOscillator(f, 'triangle', 0.1, 0.3), i * 100)
  )
}