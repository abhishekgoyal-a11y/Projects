import { useState } from 'react'

import { generateHint } from '../../services/hintService'

const AIHint = ({
  moves,
  matches,
  difficulty
}) => {

  const [hint, setHint] = useState('')

  const [loading, setLoading] = useState(false)

  const getHint = async () => {

    setLoading(true)

    const response = await generateHint(
      moves,
      matches,
      difficulty
    )

    setHint(response)

    setLoading(false)
  }

  return (

    <div className="text-center mt-6">

      <button
        onClick={getHint}
        className="
          bg-purple-500
          px-5
          py-2
          rounded-lg
          font-bold
        "
      >
        🧠 Get AI Hint
      </button>

      {
        loading && (
          <p className="mt-4">
            Thinking...
          </p>
        )
      }

      {
        hint && (
          <p className="
            mt-4
            bg-slate-800
            p-4
            rounded-lg
          ">
            {hint}
          </p>
        )
      }

    </div>
  )
}

export default AIHint