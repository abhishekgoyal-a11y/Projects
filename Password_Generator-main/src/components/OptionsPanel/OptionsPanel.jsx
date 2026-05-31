import "./OptionsPanel.css";

export default function OptionsPanel({

  length,
  setLength,

  uppercase,
  setUppercase,

  lowercase,
  setLowercase,

  numbers,
  setNumbers,

  symbols,
  setSymbols,

  avoidAmbiguous,
  setAvoidAmbiguous,

}) {

  return (

    <section className="options-panel">

      {/* LENGTH */}

      <div className="length-section">

        <div className="length-header">

          <h2>Password Length</h2>

          <span>{length}</span>

        </div>

        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) =>
            setLength(
              Number(e.target.value)
            )
          }
          className="length-slider"
        />

      </div>

      {/* TOGGLES */}

      <div className="toggle-grid">

        {/* UPPERCASE */}

        <div className="toggle-item">

          <span>Uppercase</span>

          <label className="switch">

            <input
              type="checkbox"
              checked={uppercase}
              onChange={() =>
                setUppercase(
                  !uppercase
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* LOWERCASE */}

        <div className="toggle-item">

          <span>Lowercase</span>

          <label className="switch">

            <input
              type="checkbox"
              checked={lowercase}
              onChange={() =>
                setLowercase(
                  !lowercase
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* NUMBERS */}

        <div className="toggle-item">

          <span>Numbers</span>

          <label className="switch">

            <input
              type="checkbox"
              checked={numbers}
              onChange={() =>
                setNumbers(
                  !numbers
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* SYMBOLS */}

        <div className="toggle-item">

          <span>Symbols</span>

          <label className="switch">

            <input
              type="checkbox"
              checked={symbols}
              onChange={() =>
                setSymbols(
                  !symbols
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* AVOID AMBIGUOUS */}

        <div className="toggle-item">

          <span>
            Avoid Ambiguous
          </span>

          <label className="switch">

            <input
              type="checkbox"
              checked={
                avoidAmbiguous
              }
              onChange={() =>
                setAvoidAmbiguous(
                  !avoidAmbiguous
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>

    </section>
  );
}