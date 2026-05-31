const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme
}) => {

  return (
    <div className="flex justify-center mb-6">

      <select
        value={selectedTheme}
        onChange={(e) =>
          setSelectedTheme(e.target.value)
        }
        className="bg-slate-800 text-white px-4 py-2 rounded-lg"
      >

        <option value="animals">
          Animals
        </option>

        <option value="space">
          Space
        </option>

        <option value="fruits">
          Fruits
        </option>

      </select>

    </div>
  )
}

export default ThemeSelector