function OutputPanel({ output }) {
  return (
    <div className="bg-black border border-green-500 text-green-400 p-4 rounded-xl h-[500px] overflow-auto whitespace-pre-wrap shadow-lg">
      
      {output ? (
        output
      ) : (
        <div className="text-gray-500 flex items-center justify-center h-full">
          Output will appear here...
        </div>
      )}

    </div>
  );
}

export default OutputPanel;