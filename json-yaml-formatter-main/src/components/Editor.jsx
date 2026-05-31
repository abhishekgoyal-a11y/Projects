import MonacoEditor from "@monaco-editor/react";

function Editor({
  text,
  setText,
  language,
  errorLine,
}) {

  const handleEditorDidMount = (
    editor,
    monaco
  ) => {

    if (errorLine) {

      monaco.editor.setModelMarkers(
        editor.getModel(),
        "owner",
        [
          {
            startLineNumber: errorLine,
            startColumn: 1,
            endLineNumber: errorLine,
            endColumn: 100,

            message:
              "Syntax Error",

            severity:
              monaco.MarkerSeverity.Error,
          },
        ]
      );
    }
  };

  const handleDrop = async (e) => {

    e.preventDefault();

    const file =
      e.dataTransfer.files[0];

    if (!file) return;

    const fileText =
      await file.text();

    setText(fileText);
  };

  return (
    <div
      className="border border-gray-700 rounded-xl overflow-hidden shadow-2xl relative"
      onDragOver={(e) =>
        e.preventDefault()
      }
      onDrop={handleDrop}
    >

      <div className="absolute top-2 right-3 z-10 text-xs text-gray-400 bg-black/60 px-2 py-1 rounded">
        Drag & Drop JSON/YAML
      </div>

      <MonacoEditor
        height="500px"
        language={language}
        value={text}
        theme="hc-black"

        onChange={(value) =>
          setText(value || "")
        }

        onMount={
          handleEditorDidMount
        }

        options={{
          fontSize: 15,

          minimap: {
            enabled: false,
          },

          automaticLayout: true,

          scrollBeyondLastLine: false,

          wordWrap: "on",

          padding: {
            top: 15,
          },

          smoothScrolling: true,

          cursorBlinking: "smooth",

          cursorSmoothCaretAnimation:
            "on",

          roundedSelection: true,
        }}
      />

    </div>
  );
}

export default Editor;