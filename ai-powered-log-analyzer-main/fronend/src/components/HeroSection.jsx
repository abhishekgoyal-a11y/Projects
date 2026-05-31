import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="text-center mt-24">
      <h1 className="text-6xl font-bold text-white">AI-Powered</h1>

      <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mt-3">
        Log Analysis
      </h1>

      <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto">
        Detect errors, discover patterns, and identify root causes automatically
        using AI.
      </p>

      <div className="flex justify-center gap-4 mt-10">
        <Button size="lg">Upload Logs</Button>

        <Link to="/dashboard">
          <Button size="lg" variant="outline">
            Dashboard
          </Button>
        </Link>
      </div>
    </section>
  );
}
