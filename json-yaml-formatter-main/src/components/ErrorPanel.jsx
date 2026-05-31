function ErrorPanel({ error }) {

  if (!error) return null;

  return (

    <div
      className="
        fixed
        bottom-6
        right-6
        z-50
        max-w-lg
        bg-red-500/20
        backdrop-blur-md
        border
        border-red-500
        text-red-200
        px-5
        py-4
        rounded-2xl
        shadow-2xl
        animate-pulse
      "
    >

      <div className="flex items-start gap-3">

        <span className="text-2xl">
          ⚠️
        </span>

        <div>

          <h3 className="font-bold text-lg">
            Validation Error
          </h3>

          <p className="text-sm mt-1 break-words">
            {error}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ErrorPanel;