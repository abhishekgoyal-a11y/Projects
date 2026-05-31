import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Navbar from "./components/Navbar";
import Editor from "./components/Editor";
import Toolbar from "./components/Toolbar";
import OutputPanel from "./components/OutputPanel";
import ErrorPanel from "./components/ErrorPanel";
import Footer from "./components/Footer";
import JsonTreeView from "./components/JsonTreeView";
import DiffViewer from "./components/DiffViewer";
import ApiTester from "./components/ApiTester";
import SchemaValidator from "./components/SchemaValidator";

import {
  formatData,
  minifyData,
} from "./utils/formatter";

import { validateData } from "./utils/validator";

import { convertData } from "./utils/converter";

import {
  copyToClipboard,
  downloadFile,
} from "./utils/helpers";

import {
  extractErrorInfo,
} from "./utils/errorHandler";

import useDebounce from "./hooks/useDebounce";

function App() {

  const [text, setText] = useState(
    localStorage.getItem("editorText") || ""
  );

  const [output, setOutput] =
    useState("");

  const [previousOutput, setPreviousOutput] =
    useState("");

  const [treeData, setTreeData] =
    useState(null);

  const [error, setError] =
    useState("");

  const [errorLine, setErrorLine] =
    useState(null);

  const [format, setFormat] =
    useState(
      localStorage.getItem("format") ||
      "json"
    );

  const [darkMode, setDarkMode] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "darkMode"
        )
      ) ?? true
    );

  const [leftWidth, setLeftWidth] =
    useState(50);

  const debouncedText =
    useDebounce(text, 500);

  const startResizing = (e) => {

    const startX = e.clientX;

    const startWidth = leftWidth;

    const handleMouseMove = (
      moveEvent
    ) => {

      const newWidth =
        startWidth +
        (
          (
            moveEvent.clientX -
            startX
          ) /
            window.innerWidth
        ) *
          100;

      if (
        newWidth > 20 &&
        newWidth < 80
      ) {

        setLeftWidth(newWidth);
      }
    };

    const stopResizing = () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        stopResizing
      );
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      stopResizing
    );
  };

  const handleFormat = () => {

    try {

      const result = formatData(
        text,
        format
      );

      setPreviousOutput(output);

      setOutput(result);

      try {

        if (format === "json") {

          setTreeData(
            JSON.parse(result)
          );

        } else {

          setTreeData(null);
        }

      } catch {

        setTreeData(null);
      }

      setError("");
      setErrorLine(null);

      toast.success(
        "Formatted Successfully ✅"
      );

    } catch (err) {

      setError(err.message);

      toast.error(
        "Formatting Failed ❌"
      );

      const info =
        extractErrorInfo(
          err.message
        );

      setErrorLine(info.line);
    }
  };

  const handleMinify = () => {

    try {

      const result = minifyData(
        text,
        format
      );

      setPreviousOutput(output);

      setOutput(result);

      setError("");
      setErrorLine(null);

      toast.success(
        "Minified Successfully ✅"
      );

    } catch (err) {

      setError(err.message);

      toast.error(
        "Minify Failed ❌"
      );

      const info =
        extractErrorInfo(
          err.message
        );

      setErrorLine(info.line);
    }
  };

  const handleValidate = () => {

    const result = validateData(
      text,
      format
    );

    if (result.valid) {

      setError("");
      setErrorLine(null);

      toast.success(
        "Valid Data ✅"
      );

    } else {

      setError(result.error);

      toast.error(
        "Invalid Data ❌"
      );

      const info =
        extractErrorInfo(
          result.error
        );

      setErrorLine(info.line);
    }
  };

  const handleConvert = () => {

    try {

      const result = convertData(
        text,
        format
      );

      setPreviousOutput(output);

      setOutput(result);

      try {

        if (format === "yaml") {

          setTreeData(
            JSON.parse(result)
          );

        } else {

          setTreeData(null);
        }

      } catch {

        setTreeData(null);
      }

      setError("");
      setErrorLine(null);

      toast.success(
        "Converted Successfully ✅"
      );

    } catch (err) {

      setError(err.message);

      toast.error(
        "Conversion Failed ❌"
      );

      const info =
        extractErrorInfo(
          err.message
        );

      setErrorLine(info.line);
    }
  };

  const handleCopy = async () => {

    if (!output) {

      toast.error(
        "Nothing to copy"
      );

      return;
    }

    await copyToClipboard(output);

    toast.success(
      "Copied Successfully ✅"
    );
  };

  const handleDownload = () => {

    if (!output) {

      toast.error(
        "Nothing to download"
      );

      return;
    }

    downloadFile(output, format);

    toast.success(
      "Download Started ✅"
    );
  };

  const handleFileUpload = async (
    event
  ) => {

    const file =
      event.target.files[0];

    if (!file) return;

    const fileText =
      await file.text();

    setText(fileText);

    toast.success(
      "File Uploaded Successfully ✅"
    );
  };

  useEffect(() => {

    localStorage.setItem(
      "editorText",
      text
    );

  }, [text]);

  useEffect(() => {

    localStorage.setItem(
      "format",
      format
    );

  }, [format]);

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );

  }, [darkMode]);

  useEffect(() => {

    if (!debouncedText.trim()) {

      setError("");
      setErrorLine(null);

      return;
    }

    const result = validateData(
      debouncedText,
      format
    );

    if (result.valid) {

      setError("");
      setErrorLine(null);

    } else {

      setError(result.error);

      const info =
        extractErrorInfo(
          result.error
        );

      setErrorLine(info.line);
    }

  }, [debouncedText, format]);

  return (

    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Toolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onValidate={handleValidate}
        onConvert={handleConvert}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onFileUpload={handleFileUpload}
        format={format}
        setFormat={setFormat}
      />

      <div className="flex gap-2 min-h-[750px]">

        <div
          style={{
            width: `${leftWidth}%`,
          }}
          className="flex flex-col gap-4 transition-all"
        >

          <div
            className="
              overflow-auto
              border
              border-gray-700
              rounded-xl
              p-3
              resize-y
            "
          >

            <h2 className="text-xl font-semibold mb-3">
              Input Editor
            </h2>

            <Editor
              text={text}
              setText={setText}
              language={format}
              errorLine={errorLine}
            />

          </div>

          <div
            className="
              overflow-auto
              border
              border-gray-700
              rounded-xl
              p-3
              resize-y
            "
          >

            <DiffViewer
              oldText={previousOutput}
              newText={output}
              darkMode={darkMode}
            />

          </div>

        </div>

        <div
          onMouseDown={startResizing}
          className="
            w-1
            hover:w-2
            bg-transparent
            hover:bg-cyan-400
            cursor-col-resize
            transition-all
          "
        />

        <div
          style={{
            width: `${100 - leftWidth}%`,
          }}
          className="flex flex-col gap-4 transition-all"
        >

          <div
            className="
              overflow-auto
              border
              border-gray-700
              rounded-xl
              p-3
              resize-y
            "
          >

            <h2 className="text-xl font-semibold mb-3">
              Formatted Output
            </h2>

            <OutputPanel output={output} />

          </div>

          <div
            className="
              overflow-auto
              border
              border-gray-700
              rounded-xl
              p-3
              resize-y
            "
          >

            <JsonTreeView
              data={treeData}
            />

          </div>

        </div>

      </div>

      <ApiTester
        darkMode={darkMode}
      />

      <SchemaValidator
        darkMode={darkMode}
      />

      <ErrorPanel error={error} />

      <Footer />

    </div>
  );
}

export default App;