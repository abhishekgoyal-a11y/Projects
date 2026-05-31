import "./ThemeToggle.css";

import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle({
  darkMode,
  setDarkMode,
}) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}