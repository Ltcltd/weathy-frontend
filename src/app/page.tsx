"use client";

import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import MapWrapper from "./_components/MapWrapper";
import { Button } from "@/components/ui/button"; // ShadCN button

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`absolute top-0 left-0 h-full z-10 bg-card shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "w-80 p-4" : "w-0 p-0"
        }`}
      >
        <div
          className={`transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <WeatherCard
            city={selectedCity}
            temp={28}
            condition="Partly Cloudy"
          />
        </div>
      </aside>

      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-20"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide" : "Show"} Weather
      </Button>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper onCitySelect={setSelectedCity} />
      </div>
    </main>
  );
}
