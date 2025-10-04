import WeatherCard from "@/components/WeatherCard";
import MapWrapper from "./_components/MapWrapper";

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Floating Weather Card */}
      <div className="absolute top-6 left-6 z-10">
        <WeatherCard city="Pune" temp={28} condition="Partly Cloudy" />
      </div>

      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper />
      </div>
    </main>
  );
}
