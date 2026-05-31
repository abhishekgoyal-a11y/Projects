import "./Header.css";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function Header({
  darkMode,
  setDarkMode,
}) {
  return (
    <header className="header">

      <div className="header-left">

        <h1 className="header-title">
          Secure Password Generator
        </h1>

        <p className="header-subtitle">
          Generate cryptographically secure passwords instantly.
        </p>

      </div>

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

    </header>
  );
}