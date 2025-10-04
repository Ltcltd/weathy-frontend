"use client";

import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import MapWrapper from "./_components/MapWrapper";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Pune");

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute top-6 left-6 z-10">
        <WeatherCard city={selectedCity} temp={28} condition="Partly Cloudy" />
      </div>

      <div className="absolute inset-0 z-0">
        <MapWrapper onCitySelect={setSelectedCity} />
      </div>
    </main>
  );
}
