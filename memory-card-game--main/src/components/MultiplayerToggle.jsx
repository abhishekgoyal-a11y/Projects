const MultiplayerToggle = ({
  isMultiplayer,
  setIsMultiplayer
}) => {

  return (

    <div className="
      flex
      justify-center
      gap-4
      mb-6
    ">

      <button
        onClick={() =>
          setIsMultiplayer(false)
        }

        className={`
          px-5
          py-2
          rounded-lg
          font-bold
          transition

          ${
            !isMultiplayer
              ? 'bg-green-500'
              : 'bg-gray-600'
          }
        `}
      >
        Single Player
      </button>

      <button
        onClick={() =>
          setIsMultiplayer(true)
        }

        className={`
          px-5
          py-2
          rounded-lg
          font-bold
          transition

          ${
            isMultiplayer
              ? 'bg-purple-500'
              : 'bg-gray-600'
          }
        `}
      >
        Multiplayer
      </button>

    </div>
  )
}

export default MultiplayerToggle