import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black pb-16">
      <Navbar />
      <div className="mx-auto mt-16 max-w-3xl px-6 text-center">
        <h1 className="text-4xl font-bold text-white">Log Analysis Dashboard</h1>
        <p className="mt-4 text-zinc-400">
          Upload a server log to parse lines, detect errors, and generate Groq
          root cause analysis.
        </p>
      </div>
      <UploadZone />
    </main>
  );
}
