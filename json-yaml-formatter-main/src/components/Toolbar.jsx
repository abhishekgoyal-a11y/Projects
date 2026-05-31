import {
  FaCompressAlt,
  FaExpandAlt,
  FaCheckCircle,
  FaExchangeAlt,
  FaCopy,
  FaDownload,
  FaUpload,
} from "react-icons/fa";

function Toolbar({
  onFormat,
  onMinify,
  onValidate,
  onConvert,
  onCopy,
  onDownload,
  onFileUpload,
  format,
  setFormat,
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">

      <select
        value={format}
        onChange={(e) =>
          setFormat(e.target.value)
        }
        className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg shadow-md outline-none"
      >
        <option value="json">
          JSON
        </option>

        <option value="yaml">
          YAML
        </option>
      </select>

      <button
        onClick={onFormat}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaExpandAlt />
          Format
        </div>
      </button>

      <button
        onClick={onMinify}
        className="bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaCompressAlt />
          Minify
        </div>
      </button>

      <button
        onClick={onValidate}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-black px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaCheckCircle />
          Validate
        </div>
      </button>

      <button
        onClick={onConvert}
        className="bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaExchangeAlt />
          Convert
        </div>
      </button>

      <button
        onClick={onCopy}
        className="bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaCopy />
          Copy
        </div>
      </button>

      <button
        onClick={onDownload}
        className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-2">
          <FaDownload />
          Download
        </div>
      </button>

      <label className="bg-gradient-to-r from-pink-500 to-pink-700 hover:scale-105 hover:shadow-xl active:scale-95 duration-200 transition-all text-white px-5 py-2 rounded-lg shadow-md cursor-pointer">

        <div className="flex items-center gap-2">
          <FaUpload />
          Upload
        </div>

        <input
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={onFileUpload}
        />

      </label>

    </div>
  );
}

export default Toolbar;