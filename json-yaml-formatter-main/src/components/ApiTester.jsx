import { useState } from "react";

import toast from "react-hot-toast";

function ApiTester({
  darkMode,
}) {

  const [url, setUrl] =
    useState("");

  const [method, setMethod] =
    useState("GET");

  const [body, setBody] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRequest = async () => {

    if (!url) {

      toast.error(
        "Enter API URL"
      );

      return;
    }

    try {

      setLoading(true);

      const options = {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
      };

      if (
        method === "POST" &&
        body
      ) {

        options.body = body;
      }

      const res = await fetch(
        url,
        options
      );

      const data =
        await res.json();

      setResponse(
        JSON.stringify(
          data,
          null,
          2
        )
      );

      toast.success(
        "API Success ✅"
      );

    } catch (err) {

      toast.error(
        "API Failed ❌"
      );

      setResponse(
        err.message
      );

    } finally {

      setLoading(false);
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
            ? "border-gray-700 bg-gray-900"
            : "border-gray-300 bg-white"
        }
      `}
    >

      <h2 className="text-2xl font-bold mb-4">
        API Tester
      </h2>

      <div className="flex gap-3 mb-4">

        <select
          value={method}
          onChange={(e) =>
            setMethod(
              e.target.value
            )
          }
          className="
            px-4 py-2 rounded-lg
            bg-gray-800 text-white
          "
        >

          <option value="GET">
            GET
          </option>

          <option value="POST">
            POST
          </option>

        </select>

        <input
          type="text"
          placeholder="https://api.example.com"
          value={url}
          onChange={(e) =>
            setUrl(
              e.target.value
            )
          }
          className="
            flex-1
            px-4 py-2 rounded-lg
            bg-gray-800 text-white
            outline-none
          "
        />

        <button
          onClick={handleRequest}
          className="
            bg-cyan-500
            hover:bg-cyan-600
            px-5 py-2 rounded-lg
            font-semibold
          "
        >

          {
            loading
              ? "Loading..."
              : "Send"
          }

        </button>

      </div>

      {
        method === "POST" && (

          <textarea
            placeholder="Request Body JSON"
            value={body}
            onChange={(e) =>
              setBody(
                e.target.value
              )
            }
            className="
              w-full h-40 mb-4
              p-3 rounded-lg
              bg-gray-800 text-white
              outline-none
            "
          />

        )
      }

      <pre
        className="
          bg-black
          text-green-400
          p-4 rounded-xl
          overflow-auto
          max-h-[400px]
        "
      >

        {response}

      </pre>

    </div>
  );
}

export default ApiTester;