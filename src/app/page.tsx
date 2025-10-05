"use client";

import { useState, useCallback } from "react";
import WeatherCard from "@/components/WeatherCard";
import MapWrapper from "./_components/MapWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type WeatherPayload = {
  location: { lat: number; lon: number; address: string };
  date: string;
  probabilities: Record<
    string,
    { value: number; uncertainty: number; confidence: string }
  >;
  recommendations?: string[];
};

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherPayload | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    city: string;
    lat: number;
    lon: number;
  } | null>(null);

  const fetchWeatherData = useCallback(
    async (city: string, lat: number, lon: number, date: string) => {
      try {
        const res = await fetch(
          `https://studybuddy.allanhanan.qzz.io/api/map/probability/${lat}/${lon}/${date}`
        );
        const data = await res.json();
        console.log("API response:", data);

        // ✅ Inject city name into location.address
        const patchedData = {
          ...data,
          location: {
            ...data.location,
            address: city,
          },
        };

        setWeatherData(patchedData);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    },
    []
  );

  const handleCitySelect = useCallback(
    async ({ city, lat, lon }: { city: string; lat: number; lon: number }) => {
      console.log("Clicked city:", city);

      // Store the current location for future date changes
      setCurrentLocation({ city, lat, lon });

      const future = new Date();
      future.setDate(future.getDate() + 1);
      const date = future.toISOString().slice(0, 10);
      
      setSelectedDate(date);
      await fetchWeatherData(city, lat, lon, date);
    },
    [fetchWeatherData]
  );

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Floating Weather Widget */}
      {weatherData && (
        <div className="absolute bottom-4 left-4 z-10 w-[320px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg bg-card border">
          <WeatherCard {...weatherData} />

          {/* Date Selector */}
          <div className="px-4 pb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-card"
                >
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Pick a forecast date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card">
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) => {
                    if (!date || !currentLocation) return;

                    // Convert to local date string (YYYY-MM-DD)
                    const localDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    ).toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD

                    setSelectedDate(localDate);
                    
                    // Fetch weather data for the selected date
                    fetchWeatherData(
                      currentLocation.city,
                      currentLocation.lat,
                      currentLocation.lon,
                      localDate
                    );
                  }}
                  disabled={(date) => {
                    const tomorrow = new Date();
                    tomorrow.setHours(0, 0, 0, 0);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return date < tomorrow;
                  }} // disable today and past dates
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper onCitySelect={handleCitySelect} />
      </div>
    </main>
  );
}
