import { useEffect, useState } from 'react'

const useTimer = (isRunning) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const resetTimer = () => {
    setTime(0)
  }

  return {
    time,
    resetTimer
  }
}
export default useTimer