function TreeNode({
  data,
  nodeName,
  level = 0,
}) {

  const isObject =
    typeof data === "object" &&
    data !== null;

  return (
    <div
      style={{
        paddingLeft: `${level * 20}px`,
      }}
      className="font-mono text-sm"
    >

      {isObject ? (

        <div>

          <div className="text-cyan-400">
            ▼ {nodeName}
          </div>

          {Array.isArray(data)
            ? data.map(
                (item, index) => (
                  <TreeNode
                    key={index}
                    data={item}
                    nodeName={`[${index}]`}
                    level={level + 1}
                  />
                )
              )
            : Object.entries(data).map(
                ([key, value]) => (
                  <TreeNode
                    key={key}
                    data={value}
                    nodeName={key}
                    level={level + 1}
                  />
                )
              )}

        </div>

      ) : (

        <div className="text-green-400">
          ├── {nodeName}:{" "}
          <span className="text-yellow-300">
            {String(data)}
          </span>
        </div>

      )}

    </div>
  );
}

function JsonTreeView({
  data,
}) {

  if (!data) return null;

  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded-xl p-5 mt-6 overflow-auto shadow-2xl">

      <h2 className="text-xl font-semibold mb-4 text-white">
        JSON Tree Explorer
      </h2>

      <TreeNode
        data={data}
        nodeName="root"
      />

    </div>
  );
}

export default JsonTreeView;