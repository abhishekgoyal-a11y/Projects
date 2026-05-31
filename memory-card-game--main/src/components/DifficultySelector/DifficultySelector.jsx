const DifficultySelector = ({ difficulty, setDifficulty }) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        className="bg-green-500 px-4 py-2 rounded"
        onClick={() => setDifficulty('easy')}
      >
        Easy
      </button>

      <button
        className="bg-yellow-500 px-4 py-2 rounded"
        onClick={() => setDifficulty('medium')}
      >
        Medium
      </button>

      <button
        className="bg-red-500 px-4 py-2 rounded"
        onClick={() => setDifficulty('hard')}
      >
        Hard
      </button>
    </div>
  )
}

export default DifficultySelector