import WeatherCard from "@/components/WeatherCard";

export default function HomePage() {
  return (
    <main className="p-6">
      <WeatherCard city="Pune" temp={28} condition="Partly Cloudy" />
    </main>
  );
}
