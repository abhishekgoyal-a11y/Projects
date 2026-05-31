import ReactDiffViewer from
  "react-diff-viewer-continued";

function DiffViewer({
  oldText,
  newText,
  darkMode,
}) {

  if (!oldText || !newText) {
    return null;
  }

  return (

    <div className="mt-6">

      <h2 className="text-xl font-semibold mb-3">
        JSON Diff Viewer
      </h2>

      <div className="border border-gray-700 rounded-xl overflow-hidden">

        <ReactDiffViewer
          oldValue={oldText}
          newValue={newText}
          splitView={true}
          useDarkTheme={darkMode}
        />

      </div>

    </div>
  );
}

export default DiffViewer;