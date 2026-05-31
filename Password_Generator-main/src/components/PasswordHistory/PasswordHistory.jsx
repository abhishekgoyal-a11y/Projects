import "./PasswordHistory.css";
import { useState } from "react";

export default function PasswordHistory({

  history,

}) {

  const [copiedIndex, setCopiedIndex] =
    useState(null);

  async function handleCopy(
    value,
    index
  ) {

    try {

      await navigator.clipboard.writeText(
        value
      );

      setCopiedIndex(index);

      setTimeout(() => {

        setCopiedIndex(null);

      }, 1800);

    } catch (error) {

      console.error(error);
    }
  }

  if (!history.length) {

    return null;
  }

  return (

    <section className="history-section">

      <h3 className="history-title">

        Recent Passwords

      </h3>

      <div className="history-list">

        {
          history.map((item, index) => (

            <div
              key={index}
              className="history-item"
            >

              <span className="history-password">

                {item}

              </span>

              <button
                className={`history-copy-btn ${
                  copiedIndex === index
                    ? "copied"
                    : ""
                }`}
                onClick={() =>
                  handleCopy(
                    item,
                    index
                  )
                }
              >

                {
                  copiedIndex === index
                    ? "Copied!"
                    : "Copy"
                }

              </button>

            </div>
          ))
        }

      </div>

    </section>
  );
}