import Card from '../Card/Card'

const Board = ({ cards, handleCardClick, size, disabled }) => {
  return (
    <div
      className="grid gap-3 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(70px, 1fr))`,
        maxWidth: size === 4
          ? '500px'
          : size === 6
          ? '700px'
          : '900px'
      }}
    >
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onClick={handleCardClick}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

export default Board