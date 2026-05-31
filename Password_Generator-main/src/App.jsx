import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import PasswordBox from "./components/PasswordBox/PasswordBox";
import StrengthMeter from "./components/StrengthMeter/StrengthMeter";
import OptionsPanel from "./components/OptionsPanel/OptionsPanel";
import ModeSwitcher from "./components/ModeSwitch/ModeSwitch";
import PassphraseOptions from "./components/PassphraseOptions/PassphraseOptions";
import PasswordHistory from "./components/PasswordHistory/PasswordHistory";

import { estimateCrackTime } from "./utils/crackTime";
import { validateOptions } from "./utils/validations";
import { generatePassword } from "./utils/generator";
import { generatePassphrase } from "./utils/passphraseGenerator";
import { calculateEntropy } from "./utils/entropy";
import { checkStrength } from "./utils/strengthChecker";

export default function App() {

  // THEME
  const [darkMode, setDarkMode] =
    useState(false);

  // MODE
  const [mode, setMode] =
    useState("password");

  // GENERATED OUTPUT
  const [password, setPassword] =
    useState("");

  // PASSWORD HISTORY
  const [history, setHistory] =
    useState([]);

  // PASSWORD SETTINGS
  const [length, setLength] =
    useState(16);

  const [uppercase, setUppercase] =
    useState(true);

  const [lowercase, setLowercase] =
    useState(true);

  const [numbers, setNumbers] =
    useState(true);

  const [symbols, setSymbols] =
    useState(true);

  // SECURITY SETTINGS
  const [
    avoidAmbiguous,
    setAvoidAmbiguous
  ] = useState(false);

  // PASSPHRASE SETTINGS
  const [wordCount, setWordCount] =
    useState(4);

  const [separator, setSeparator] =
    useState("-");

  const [capitalize, setCapitalize] =
    useState(false);

  const [includeNumber, setIncludeNumber] =
    useState(false);

  // VALIDATION
  const validation =
    validateOptions({
      uppercase,
      lowercase,
      numbers,
      symbols,
    });

  // GENERATE PASSWORD / PASSPHRASE
  function handleGeneratePassword(
    addToHistory = true
  ) {

    let generatedValue = "";

    // PASSWORD MODE
    if (mode === "password") {

      generatedValue =
        generatePassword({
          length,
          uppercase,
          lowercase,
          numbers,
          symbols,
          avoidAmbiguous,
        });
    }

    // PASSPHRASE MODE
    else {

      generatedValue =
        generatePassphrase({
          wordCount,
          separator,
          capitalize,
          includeNumber,
        });
    }

    // SET PASSWORD
    setPassword(generatedValue);

    // ADD TO HISTORY
    if (addToHistory) {

      setHistory((prev) => {

        const updated = [

          generatedValue,

          ...prev.filter(
            (item) =>
              item !== generatedValue
          ),

        ];

        return updated.slice(0, 3);
      });
    }
  }

  // AUTO GENERATE
  useEffect(() => {

    // INITIAL GENERATION
    // NO HISTORY

    handleGeneratePassword(false);

  }, [

    mode,

    length,
    uppercase,
    lowercase,
    numbers,
    symbols,

    wordCount,
    separator,
    capitalize,
    includeNumber,

    avoidAmbiguous,

  ]);

  // ENTROPY
  const entropy =

    mode === "password"

      ? calculateEntropy({

          length,
          uppercase,
          lowercase,
          numbers,
          symbols,

        })

      : wordCount * 32;

  // STRENGTH
  const strength =
    checkStrength(entropy);

  // CRACK TIME
  const crackTime =
    estimateCrackTime(
      entropy
    );

  return (

    <div className={darkMode ? "dark" : ""}>

      <div className="app-container">

        <div className="main-wrapper">

          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <div className="generator-card">

            <ModeSwitcher
              mode={mode}
              setMode={setMode}
            />

            <PasswordBox
              password={password}
              disabled={
                mode === "password"
                  ? !validation.valid
                  : false
              }
            />

            <StrengthMeter
              entropy={entropy}
              strength={strength}
              crackTime={crackTime}
              onRefresh={
                handleGeneratePassword
              }
              disabled={
                mode === "password"
                  ? !validation.valid
                  : false
              }
            />

            {/* PASSWORD OPTIONS */}

            {
              mode === "password" && (

                <OptionsPanel

                  length={length}
                  setLength={setLength}

                  uppercase={uppercase}
                  setUppercase={setUppercase}

                  lowercase={lowercase}
                  setLowercase={setLowercase}

                  numbers={numbers}
                  setNumbers={setNumbers}

                  symbols={symbols}
                  setSymbols={setSymbols}

                  avoidAmbiguous={avoidAmbiguous}
                  setAvoidAmbiguous={
                    setAvoidAmbiguous
                  }

                />
              )
            }

            {/* PASSPHRASE OPTIONS */}

            {
              mode === "passphrase" && (

                <PassphraseOptions

                  wordCount={wordCount}
                  setWordCount={setWordCount}

                  separator={separator}
                  setSeparator={setSeparator}

                  capitalize={capitalize}
                  setCapitalize={setCapitalize}

                  includeNumber={includeNumber}
                  setIncludeNumber={setIncludeNumber}

                />
              )
            }

            {/* PASSWORD HISTORY */}

            <PasswordHistory
              history={history}
            />

          </div>

        </div>

      </div>

    </div>
  );
}