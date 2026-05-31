import { formatTime } from '../../utils/timerFormatter'

const Timer = ({ time }) => {
  return (
    <div className="text-xl font-bold">
      Time: {formatTime(time)}
    </div>
  )
}

export default Timer