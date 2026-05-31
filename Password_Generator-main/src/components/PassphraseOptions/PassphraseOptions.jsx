import "./PassphraseOptions.css";
import { useState } from "react";

export default function PassphraseOptions({

  wordCount,
  setWordCount,

  separator,
  setSeparator,

  capitalize,
  setCapitalize,

  includeNumber,
  setIncludeNumber,

}) {

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  function getSeparatorLabel() {

    if (separator === "-")
      return "Hyphen (-)";

    if (separator === "_")
      return "Underscore (_)";

    if (separator === ".")
      return "Dot (.)";

    if (separator === " ")
      return "Space";

    return "Hyphen (-)";
  }

  function handleSelect(value) {

    setSeparator(value);

    setDropdownOpen(false);
  }

  return (

    <section className="passphrase-options">

      {/* WORD COUNT */}

      <div className="option-group">

        <div className="option-header">

          <h2>
            Word Count
          </h2>

          <span>
            {wordCount}
          </span>

        </div>

        <input
          type="range"
          min="3"
          max="10"
          value={wordCount}
          onChange={(e) =>
            setWordCount(
              Number(e.target.value)
            )
          }
          className="word-slider"
        />

      </div>

      {/* SEPARATOR */}

      <div className="option-group">

        <label>
          Separator
        </label>

        <div className="custom-select">

          <button
            type="button"
            className="custom-select-trigger"
            onClick={() =>
              setDropdownOpen(
                !dropdownOpen
              )
            }
          >

            <span>
              {getSeparatorLabel()}
            </span>

            <span
              className={`dropdown-arrow ${
                dropdownOpen
                  ? "rotate"
                  : ""
              }`}
            >
              ▼
            </span>

          </button>

          {
            dropdownOpen && (

              <div className="custom-options">

                <button
                  type="button"
                  onClick={() =>
                    handleSelect("-")
                  }
                >
                  Hyphen (-)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelect("_")
                  }
                >
                  Underscore (_)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelect(".")
                  }
                >
                  Dot (.)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelect(" ")
                  }
                >
                  Space
                </button>

              </div>
            )
          }

        </div>

      </div>

      {/* CAPITALIZE */}

      <div className="toggle-row">

        <span>
          Capitalize Words
        </span>

        <label className="switch">

          <input
            type="checkbox"
            checked={capitalize}
            onChange={() =>
              setCapitalize(
                !capitalize
              )
            }
          />

          <span className="slider"></span>

        </label>

      </div>

      {/* INCLUDE NUMBER */}

      <div className="toggle-row">

        <span>
          Include Number
        </span>

        <label className="switch">

          <input
            type="checkbox"
            checked={includeNumber}
            onChange={() =>
              setIncludeNumber(
                !includeNumber
              )
            }
          />

          <span className="slider"></span>

        </label>

      </div>

    </section>
  );
}