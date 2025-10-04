"use client";

import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import MapWrapper from "./_components/MapWrapper";

type WeatherPayload = {
  location: { lat: number; lon: number; address: string };
  date: string;
  probabilities: Record<
    string,
    { value: number; uncertainty: number; confidence: string }
  >;
  recommendations: string[];
};

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherPayload>({
    location: { lat: 18.5204, lon: 73.8567, address: "Pune, MH" },
    date: "2025-10-05",
    probabilities: {
      rain: { value: 0.3, uncertainty: 0.1, confidence: "medium" },
      cloud_cover: { value: 0.6, uncertainty: 0.15, confidence: "high" },
      temperature_hot: { value: 0.2, uncertainty: 0.05, confidence: "low" },
    },
    recommendations: ["Carry an umbrella", "Avoid outdoor meetings"],
  });

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Floating Weather Widget */}
      <div className="absolute bottom-4 left-4 z-10 w-[320px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg bg-card border">
        <WeatherCard {...weatherData} />
      </div>

      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper
          onCitySelect={(cityName) => {
            console.log("Clicked city:", cityName);
            // Replace with actual fetch from backend
            setWeatherData({
              location: {
                lat: 40.7,
                lon: -74.0,
                address: `${cityName}, NY`,
              },
              date: "2026-06-15",
              probabilities: {
                rain: { value: 0.45, uncertainty: 0.08, confidence: "medium" },
                snow: { value: 0.02, uncertainty: 0.03, confidence: "high" },
                cloud_cover: {
                  value: 0.67,
                  uncertainty: 0.12,
                  confidence: "medium",
                },
                wind_speed_high: {
                  value: 0.23,
                  uncertainty: 0.06,
                  confidence: "high",
                },
                temperature_hot: {
                  value: 0.15,
                  uncertainty: 0.07,
                  confidence: "medium",
                },
                temperature_cold: {
                  value: 0.08,
                  uncertainty: 0.04,
                  confidence: "high",
                },
                heat_wave: {
                  value: 0.03,
                  uncertainty: 0.02,
                  confidence: "low",
                },
                cold_snap: {
                  value: 0.05,
                  uncertainty: 0.03,
                  confidence: "medium",
                },
                heavy_rain: {
                  value: 0.12,
                  uncertainty: 0.05,
                  confidence: "medium",
                },
                dust_event: {
                  value: 0.01,
                  uncertainty: 0.01,
                  confidence: "low",
                },
                uncomfortable_index: {
                  value: 0.18,
                  uncertainty: 0.09,
                  confidence: "low",
                },
              },
              recommendations: [
                "Consider indoor backup venue",
                "Monitor forecasts closer to date",
                "Plan for potential wet conditions",
              ],
            });
          }}
        />
      </div>
    </main>
  );
}
