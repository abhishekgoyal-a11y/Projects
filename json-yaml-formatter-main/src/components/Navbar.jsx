import {
  FaCode,
  FaMoon,
  FaSun,
} from "react-icons/fa";

function Navbar({
  darkMode,
  setDarkMode,
}) {
  return (
    <div className="bg-gray-900 text-white px-6 py-4 rounded-xl mb-6 shadow-lg flex items-center justify-between transition-all duration-300">

      <div className="flex items-center gap-3">

        <FaCode size={24} />

        <h1 className="text-2xl font-bold">
          JSON YAML Formatter
        </h1>

      </div>

      <div className="flex items-center gap-5">

        <p className="text-gray-400 text-sm">
          Developer Tool
        </p>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all duration-300 shadow-md"
        >

          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-white" />
          )}

        </button>

      </div>

    </div>
  );
}

export default Navbar;