import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import UploadZone from "../components/UploadZone";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <HeroSection />

      <UploadZone />
      <section className="max-w-6xl mx-auto mt-24 px-6">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Error Detection"
            description="Automatically detect critical errors and failures."
          />

          <FeatureCard
            title="Pattern Analysis"
            description="Identify recurring issues and trends."
          />

          <FeatureCard
            title="AI Root Cause"
            description="Find the most likely source of failures."
          />
        </div>
      </section>
    </div>
  );
}
