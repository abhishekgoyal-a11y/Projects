import Timer from '../Timer/Timer'

const Scoreboard = ({
  time,
  moves,
  score,

  isMultiplayer,

  currentPlayer,

  player1Score,

  player2Score
}) => {

  return (

    <div className="
      flex
      flex-col
      items-center
      gap-4
      mb-6
    ">

      <div className="
        flex
        gap-4
        flex-wrap
        justify-center
        items-center
        text-lg
        font-bold
      ">

        <div className="
          bg-slate-800
          px-5
          py-2
          rounded-lg
        ">
          <Timer time={time} />
        </div>

        <div className="
          bg-slate-800
          px-5
          py-2
          rounded-lg
        ">
          Moves: {moves}
        </div>

        {
          !isMultiplayer && (

            <div className="
              bg-slate-800
              px-5
              py-2
              rounded-lg
            ">
              Score: {score}
            </div>
          )
        }

      </div>

      {
        isMultiplayer && (

          <div className="
            flex
            gap-6
            flex-wrap
            justify-center
          ">

            <div className={`
              px-6
              py-3
              rounded-xl
              text-xl
              font-bold
              ${
                currentPlayer === 1
                  ? 'bg-green-500'
                  : 'bg-slate-700'
              }
            `}>

              🎮 Player 1:
              {player1Score}

            </div>

            <div className={`
              px-6
              py-3
              rounded-xl
              text-xl
              font-bold
              ${
                currentPlayer === 2
                  ? 'bg-purple-500'
                  : 'bg-slate-700'
              }
            `}>

              🎮 Player 2:
              {player2Score}

            </div>

          </div>
        )
      }

    </div>
  )
}

export default Scoreboard