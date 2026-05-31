import { motion } from 'framer-motion'
import './Card.css'

const Card = ({ card, onClick, disabled }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
      onClick={() => !disabled && onClick(card)}
    >
      <div className="card-inner">
        <div className="card-front">
          ?
        </div>

        <div className="card-back">
          {card.icon}
        </div>
      </div>
    </motion.div>
  )
}
export default Card