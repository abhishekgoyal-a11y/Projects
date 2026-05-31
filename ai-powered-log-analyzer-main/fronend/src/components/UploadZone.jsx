import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

export default function UploadZone() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("logFile", file);

      const response = await api.post("/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/analysis", {
        state: {
          result: response.data.analysis,
        },
      });
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Analysis failed. Check that the backend is running and Groq is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 px-6">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-10 text-center">
        <h2 className="text-2xl font-bold text-white">Upload Log File</h2>

        <p className="text-zinc-400 mt-2">Supports .log and .txt</p>

        <input
          ref={fileInputRef}
          id="logFile"
          type="file"
          accept=".log,.txt"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Button
          type="button"
          className="mt-6 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Log File
        </Button>

        {file && (
          <div className="mt-6">
            <p className="text-green-400">{file.name}</p>

            <Button onClick={handleAnalyze} disabled={loading} className="mt-4">
              {loading ? "Analyzing..." : "Analyze Logs"}
            </Button>
          </div>
        )}

        {error && <p className="mt-5 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
