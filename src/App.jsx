
import React, { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import './App.css'

const soundscapes = [
  { id: 1, name: 'Rain', url: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-loop-1243.mp3' },
  { id: 2, name: 'Forest', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-352.mp3' },
  { id: 3, name: 'Cafe', url: 'https://assets.mixkit.co/sfx/preview/mixkit-busy-cafe-ambience-445.mp3' },
  { id: 4, name: 'Waves', url: '/sounds/ocean-waves-250310.mp3' }
]

export default function App() {
  const [workTime, setWorkTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [timeLeft, setTimeLeft] = useState(workTime * 60)
  const [isActive, setIsActive] = useState(false)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [selectedSounds, setSelectedSounds] = useState([])
  const soundsRef = useRef([])

  useEffect(() => {
    setTimeLeft(isWorkTime ? workTime * 60 : breakTime * 60)
  }, [workTime, breakTime, isWorkTime])

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      setIsWorkTime(!isWorkTime)
      setTimeLeft(isWorkTime ? breakTime * 60 : workTime * 60)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isWorkTime, workTime, breakTime])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsWorkTime(true)
    setTimeLeft(workTime * 60)
  }

  const toggleSound = (sound) => {
    if (selectedSounds.includes(sound.id)) {
      setSelectedSounds(selectedSounds.filter(id => id !== sound.id))
      soundsRef.current[sound.id]?.stop()
    } else {
      setSelectedSounds([...selectedSounds, sound.id])
      soundsRef.current[sound.id] = new Howl({
        src: [sound.url],
        loop: true,
        volume: 1
      })
      soundsRef.current[sound.id].play()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <h1>{isWorkTime ? 'Work Time' : 'Break Time'}</h1>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div className="controls">
        <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="settings">
        <div>
          <label>Work (minutes):</label>
          <input 
            type="number" 
            value={workTime} 
            onChange={(e) => setWorkTime(parseInt(e.target.value) || 0)} 
            min="1" 
            disabled={isActive}
          />
        </div>
        <div>
          <label>Break (minutes):</label>
          <input 
            type="number" 
            value={breakTime} 
            onChange={(e) => setBreakTime(parseInt(e.target.value) || 0)} 
            min="1" 
            disabled={isActive}
          />
        </div>
      </div>
      <div className="soundscapes">
        <h2>Soundscapes</h2>
        <div className="sound-list">
          {soundscapes.map(sound => (
            <div 
              key={sound.id} 
              className={`sound ${selectedSounds.includes(sound.id) ? 'active' : ''}`}
              onClick={() => toggleSound(sound)}
            >
              {sound.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
