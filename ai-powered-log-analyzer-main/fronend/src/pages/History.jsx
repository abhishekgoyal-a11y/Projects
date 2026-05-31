import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { Button } from "@/components/ui/button";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const clearHistory = async () => {
    const confirmDelete = window.confirm("Delete all history?");

    if (!confirmDelete) return;

    try {
      await api.delete("/history/clear");

      setHistory([]);
    } catch (error) {
      console.error(error);
    }
  };
    
    useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history");
        setHistory(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Analysis History</h1>

          <Button variant="destructive" onClick={clearHistory}>
            Clear History
          </Button>
        </div>

        {loading ? (
          <p className="mt-6">Loading...</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"
              >
                <h2 className="text-xl font-semibold">{item.fileName}</h2>

                <p className="mt-2 text-zinc-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <p className="mt-3 text-sm text-zinc-300">
                  {item.aiAnalysis?.rootCause}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
