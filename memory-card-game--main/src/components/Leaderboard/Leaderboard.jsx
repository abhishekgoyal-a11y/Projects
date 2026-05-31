const Leaderboard = ({
  bestScore,
  bestMoves,
  bestTime
}) => {

  return (
    <div className="bg-slate-800 p-6 rounded-xl mt-10 max-w-md mx-auto">

      <h2 className="text-3xl font-bold text-center mb-4">
        🏆 Leaderboard
      </h2>

      <div className="space-y-3 text-lg">

        <p>
          Best Score:
          {' '}
          {bestScore}
        </p>

        <p>
          Least Moves:
          {' '}
          {bestMoves === Infinity ? '-' : bestMoves}
        </p>

        <p>
          Best Time:
          {' '}
          {bestTime === Infinity ? '-' : `${bestTime}s`}
        </p>

      </div>

    </div>
  )
}

export default Leaderboard