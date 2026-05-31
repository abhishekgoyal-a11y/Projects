import "./StrengthMeter.css";

export default function StrengthMeter({

  entropy,
  strength,
  crackTime,

  onRefresh,
  disabled,

}) {

  return (

    <section className="strength-section">

      <div className="strength-left">

        <h2 className="strength-title">

          Generated Password

        </h2>

        <div className="strength-badges">

          <span
            className={`strength-badge ${strength.className}`}
          >

            {strength.label}

          </span>

          <span className="entropy-badge">

            {Math.round(entropy)}
            {" "}
            bits

          </span>

        </div>

        <p className="crack-time">

          {crackTime}

        </p>

      </div>

      <button
        className="refresh-btn"
        onClick={onRefresh}
        disabled={disabled}
      >

        Refresh

      </button>

    </section>
  );
}