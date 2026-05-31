import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <h1 className="text-2xl font-bold text-white">AI Log Analyzer</h1>

      <div className="flex gap-4">
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>

        <Link to="/history">
          <Button variant="ghost">History</Button>
        </Link>

        <Link to="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>

        <Button>GitHub</Button>
      </div>
    </nav>
  );
}
