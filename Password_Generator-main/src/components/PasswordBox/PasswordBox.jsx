import "./PasswordBox.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function PasswordBox({
  password,
  disabled,
}) {

  const [copied, setCopied] =
    useState(false);

  const timeoutRef =
    useRef(null);

  // RESET STATES WHEN PASSWORD OR VALIDATION CHANGES
  useEffect(() => {

    setCopied(false);

    if (timeoutRef.current) {

      clearTimeout(
        timeoutRef.current
      );
    }

  }, [disabled, password]);

  async function handleCopy() {

    // STOP IF INVALID
    if (disabled) {

      setCopied(false);

      return;
    }

    try {

      await navigator.clipboard.writeText(
        password
      );

      setCopied(true);

      // CLEAR OLD TIMER
      if (timeoutRef.current) {

        clearTimeout(
          timeoutRef.current
        );
      }

      timeoutRef.current =
        setTimeout(() => {

          setCopied(false);

        }, 2000);

    } catch (error) {

      console.error(
        "Copy failed",
        error
      );
    }
  }

  // FINAL BUTTON CLASS
  const buttonClass =
    disabled
      ? "copy-btn disabled-btn"
      : copied
        ? "copy-btn copied"
        : "copy-btn";

  // FINAL BUTTON TEXT
  const buttonText =
    disabled
      ? "Disabled"
      : copied
        ? "Copied!"
        : "Copy";

  return (
    <section
      className={
        disabled
          ? "password-box invalid"
          : "password-box"
      }
    >

      <div className="password-display">
        {password}

      </div>

      <button
        className={buttonClass}
        onClick={handleCopy}
        disabled={disabled}
      >

        {buttonText}

      </button>

    </section>
  );
}