import "./ModeSwitch.css";

export default function ModeSwitch({
  mode,
  setMode,
}) {

  return (

    <div className="mode-switch">

      <button
        className={
          mode === "password"
            ? "mode-btn active"
            : "mode-btn"
        }
        onClick={() =>
          setMode("password")
        }
      >

        Random Password

      </button>

      <button
        className={
          mode === "passphrase"
            ? "mode-btn active"
            : "mode-btn"
        }
        onClick={() =>
          setMode("passphrase")
        }
      >

        Passphrase

      </button>

    </div>
  );
}