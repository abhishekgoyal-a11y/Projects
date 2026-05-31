import { useState } from "react";

import Ajv from "ajv";

import toast from "react-hot-toast";

function SchemaValidator({
  darkMode,
}) {

  const [schema, setSchema] =
    useState("");

  const [jsonData, setJsonData] =
    useState("");

  const [result, setResult] =
    useState("");

  const validateSchema = () => {

    try {

      const ajv = new Ajv();

      const parsedSchema =
        JSON.parse(schema);

      const parsedData =
        JSON.parse(jsonData);

      const validate =
        ajv.compile(
          parsedSchema
        );

      const valid =
        validate(parsedData);

      if (valid) {

        setResult(
          "✅ Valid JSON according to schema"
        );

        toast.success(
          "Schema Validation Passed"
        );

      } else {

        setResult(
          JSON.stringify(
            validate.errors,
            null,
            2
          )
        );

        toast.error(
          "Schema Validation Failed"
        );
      }

    } catch (err) {

      setResult(err.message);

      toast.error(
        "Invalid Schema or JSON"
      );
    }
  };

  return (

    <div
      className={`
        mt-6
        border
        rounded-xl
        p-4
        ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-300"
        }
      `}
    >

      <h2 className="text-2xl font-bold mb-4">
        JSON Schema Validator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* SCHEMA */}

        <div>

          <h3 className="font-semibold mb-2">
            JSON Schema
          </h3>

          <textarea
            value={schema}
            onChange={(e) =>
              setSchema(
                e.target.value
              )
            }
            placeholder="Paste JSON Schema..."
            className="
              w-full
              h-72
              p-3
              rounded-xl
              bg-gray-800
              text-white
              outline-none
            "
          />

        </div>

        {/* JSON */}

        <div>

          <h3 className="font-semibold mb-2">
            JSON Data
          </h3>

          <textarea
            value={jsonData}
            onChange={(e) =>
              setJsonData(
                e.target.value
              )
            }
            placeholder="Paste JSON..."
            className="
              w-full
              h-72
              p-3
              rounded-xl
              bg-gray-800
              text-white
              outline-none
            "
          />

        </div>

      </div>

      <button
        onClick={validateSchema}
        className="
          mt-4
          bg-purple-500
          hover:bg-purple-600
          px-6 py-2
          rounded-lg
          font-semibold
        "
      >

        Validate Schema

      </button>

      <pre
        className="
          mt-4
          bg-black
          text-green-400
          p-4
          rounded-xl
          overflow-auto
          max-h-[300px]
        "
      >

        {result}

      </pre>

    </div>
  );
}

export default SchemaValidator;