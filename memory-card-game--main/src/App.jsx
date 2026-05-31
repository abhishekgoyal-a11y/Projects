import { useEffect, useState } from 'react'

import Board from './components/Board/Board'
import Scoreboard from './components/Scoreboard/Scoreboard'
import DifficultySelector from './components/DifficultySelector/DifficultySelector'
import ThemeSelector from './components/ThemeSelector/ThemeSelector'
import Leaderboard from './components/Leaderboard/Leaderboard'
import MultiplayerToggle from './components/MultiplayerToggle'

import AIHint from './components/AIHint/AIHint'
import AIThemeGenerator from './components/AIThemeGenerator/AIThemeGenerator'
import DailyChallenge from './components/DailyChallenge/DailyChallenge'

import { themes } from './utils/themes'
import { difficultyConfig } from './utils/difficultyConfig'
import { generateCards } from './utils/generateCards'
import { calculateScore } from './utils/scoreCalculator'

import useTimer from './hooks/useTimer'

import Confetti from 'react-confetti'

const flipSound = new Audio('/sounds/flip.mp3')
const matchSound = new Audio('/sounds/match.mp3')
const wrongSound = new Audio('/sounds/wrong.mp3')
const winSound = new Audio('/sounds/win.mp3')

flipSound.volume = 0.4
matchSound.volume = 0.5
wrongSound.volume = 0.5
winSound.volume = 0.7

const App = () => {

  const [difficulty, setDifficulty] =
    useState('easy')

  const [selectedTheme, setSelectedTheme] =
    useState('animals')

  const [customTheme, setCustomTheme] =
    useState(null)

  const [cards, setCards] =
    useState([])

  const [flippedCards, setFlippedCards] =
    useState([])

  const [moves, setMoves] =
    useState(0)

  const [matches, setMatches] =
    useState(0)

  const [disabled, setDisabled] =
    useState(false)

  const [gameStarted, setGameStarted] =
    useState(false)

  const [gameWon, setGameWon] =
    useState(false)

  const [isMultiplayer, setIsMultiplayer] =
    useState(false)

  const [currentPlayer, setCurrentPlayer] =
    useState(1)

  const [player1Score, setPlayer1Score] =
    useState(0)

  const [player2Score, setPlayer2Score] =
    useState(0)

  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore')) || 0
  )

  const [bestMoves, setBestMoves] = useState(
    Number(localStorage.getItem('bestMoves')) || Infinity
  )

  const [bestTime, setBestTime] = useState(
    Number(localStorage.getItem('bestTime')) || Infinity
  )

  const { time, resetTimer } =
    useTimer(gameStarted)

  const config =
    difficultyConfig[difficulty]

  const score =
    calculateScore(matches, moves, time)

  const currentTheme =
    customTheme || themes[selectedTheme]

  const initializeGame = () => {

    localStorage.removeItem(
      'memoryGameProgress'
    )

    const generated = generateCards(
      currentTheme,
      config.pairs
    )

    setCards(generated)

    setFlippedCards([])

    setMoves(0)

    setMatches(0)

    setDisabled(false)

    setGameStarted(false)

    setGameWon(false)

    setCurrentPlayer(1)

    setPlayer1Score(0)

    setPlayer2Score(0)

    resetTimer()
  }

  useEffect(() => {

    const generated =
      generateCards(
        currentTheme,
        config.pairs
      )

    setCards(generated)

  }, [])

  useEffect(() => {

    if (
      matches === config.pairs &&
      matches > 0
    ) {

      setGameWon(true)

      setGameStarted(false)

      winSound.currentTime = 0

      winSound.play()
        .catch(() => {})

      if (
        !isMultiplayer &&
        score > bestScore
      ) {

        localStorage.setItem(
          'bestScore',
          score
        )

        setBestScore(score)
      }

      if (
        !isMultiplayer &&
        moves < bestMoves
      ) {

        localStorage.setItem(
          'bestMoves',
          moves
        )

        setBestMoves(moves)
      }

      if (
        !isMultiplayer &&
        time < bestTime
      ) {

        localStorage.setItem(
          'bestTime',
          time
        )

        setBestTime(time)
      }
    }

  }, [matches])

  useEffect(() => {

    initializeGame()

  }, [
    difficulty,
    selectedTheme,
    customTheme,
    isMultiplayer
  ])

  const handleCardClick = (
    clickedCard
  ) => {

    if (!gameStarted) {
      setGameStarted(true)
    }

    if (
      clickedCard.flipped ||
      clickedCard.matched ||
      disabled
    ) {
      return
    }

    flipSound.currentTime = 0

    flipSound.play()
      .catch(() => {})

    const updatedCards = cards.map(
      card =>
        card.id === clickedCard.id
          ? {
              ...card,
              flipped: true
            }
          : card
    )

    setCards(updatedCards)

    const updatedFlipped = [
      ...flippedCards,
      clickedCard
    ]

    setFlippedCards(updatedFlipped)

    if (updatedFlipped.length === 2) {

      setDisabled(true)

      setMoves(prev => prev + 1)

      const [first, second] =
        updatedFlipped

      if (
        first.icon === second.icon
      ) {

        matchSound.currentTime = 0

        matchSound.play()
          .catch(() => {})

        setCards(prev =>
          prev.map(card =>
            card.icon === first.icon
              ? {
                  ...card,
                  matched: true
                }
              : card
          )
        )

        setMatches(prev => prev + 1)

        if (isMultiplayer) {

          if (currentPlayer === 1) {

            setPlayer1Score(
              prev => prev + 1
            )

          } else {

            setPlayer2Score(
              prev => prev + 1
            )
          }
        }

        setFlippedCards([])

        setDisabled(false)

      } else {

        wrongSound.currentTime = 0

        wrongSound.play()
          .catch(() => {})

        setTimeout(() => {

          setCards(prev =>
            prev.map(card =>
              card.id === first.id ||
              card.id === second.id
                ? {
                    ...card,
                    flipped: false
                  }
                : card
            )
          )

          setFlippedCards([])

          setDisabled(false)

          if (isMultiplayer) {

            setCurrentPlayer(prev =>
              prev === 1 ? 2 : 1
            )
          }

        }, 1000)
      }
    }
  }

  return (

    <div className="
  min-h-screen
  bg-slate-900
  text-white
  px-6
  py-4
">

      {gameWon && <Confetti />}

      <h1 className="
        text-4xl
        font-bold
        text-center
        mb-6
      ">
        Memory Card Game
      </h1>

      <DailyChallenge />

      <MultiplayerToggle
        isMultiplayer={isMultiplayer}
        setIsMultiplayer={setIsMultiplayer}
      />

      <DifficultySelector
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <ThemeSelector
        selectedTheme={selectedTheme}
        setSelectedTheme={
          setSelectedTheme
        }
      />

      <AIThemeGenerator
        setCustomTheme={
          setCustomTheme
        }
      />

      <Scoreboard
        time={time}
        moves={moves}
        score={score}

        isMultiplayer={
          isMultiplayer
        }

        currentPlayer={
          currentPlayer
        }

        player1Score={
          player1Score
        }

        player2Score={
          player2Score
        }
      />

      <Board
        cards={cards}
        handleCardClick={
          handleCardClick
        }
        size={config.size}
        disabled={disabled}
      />

      <AIHint
        moves={moves}
        matches={matches}
        difficulty={difficulty}
      />

      {
        gameWon && (

          <div className="
            text-center
            mt-8
          ">

            <h2 className="
              text-4xl
              font-bold
              text-green-400
              mb-4
            ">
              🎉 Game Over!
            </h2>

            {
              isMultiplayer ? (

                <div>

                  <p className="text-2xl">
                    Player 1:
                    {player1Score}
                  </p>

                  <p className="text-2xl">
                    Player 2:
                    {player2Score}
                  </p>

                  <h3 className="
                    text-3xl
                    mt-4
                    text-yellow-300
                  ">

                    {
                      player1Score >
                      player2Score

                        ? '🏆 Player 1 Wins!'

                        : player2Score >
                          player1Score

                        ? '🏆 Player 2 Wins!'

                        : '🤝 Draw!'
                    }

                  </h3>

                </div>

              ) : (

                <p className="text-2xl">
                  Final Score:
                  {score}
                </p>
              )
            }

          </div>
        )
      }

      <div className="
        flex
        justify-center
        mt-8
      ">

        <button
          onClick={initializeGame}

          className="
            bg-blue-500
            hover:bg-blue-600
            px-6
            py-3
            rounded-lg
            text-lg
            font-bold
            transition
          "
        >
          Restart Game
        </button>

      </div>

      <Leaderboard
        bestScore={bestScore}
        bestMoves={bestMoves}
        bestTime={bestTime}
      />

    </div>
  )
}

export default App