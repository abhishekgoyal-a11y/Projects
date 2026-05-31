import { useState } from 'react'

import { generateTheme }
from '../../services/themeService'

const AIThemeGenerator = ({
  setCustomTheme
}) => {

  const [themeInput, setThemeInput] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleGenerate = async () => {

    if (!themeInput) return

    setLoading(true)

    const generatedTheme =
      await generateTheme(themeInput)

    setCustomTheme(generatedTheme)

    setLoading(false)
  }

  return (

    <div className="
      flex
      flex-col
      items-center
      gap-4
      mt-6
      mb-6
    ">

      <input
        type="text"

        placeholder="
          Enter AI Theme
        "

        value={themeInput}

        onChange={(e) =>
          setThemeInput(e.target.value)
        }

        className="
  px-4
  py-3
  rounded-lg
  bg-white
  text-black
  placeholder:text-black
  w-72
  outline-none
"
      />

      <button
        onClick={handleGenerate}

        className="
          bg-pink-500
          hover:bg-pink-600
          px-6
          py-3
          rounded-lg
          font-bold
          transition
        "
      >

        ✨ Generate Theme

      </button>

      {
        loading && (
          <p>
            Generating Theme...
          </p>
        )
      }

    </div>
  )
}

export default AIThemeGenerator