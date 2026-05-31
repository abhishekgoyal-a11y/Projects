import Navbar from "../components/Navbar";
import Hero from "../components/HeroSection.jsx";
import UploadBox from "../components/UploadZone";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <UploadBox />
    </div>
  );
}
