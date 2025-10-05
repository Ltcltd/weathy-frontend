"use client";

import { useState } from "react";
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

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background text-foreground">
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
                  className="w-full justify-start text-left font-normal"
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) => {
                    if (!date) return;

                    // Convert to local date string (YYYY-MM-DD)
                    const localDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    ).toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD

                    setSelectedDate(localDate);
                  }}
                  disabled={(date) =>
                    date < new Date(Date.now() + 24 * 60 * 60 * 1000)
                  } // disable today and past
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper
          onCitySelect={async ({ city, lat, lon }) => {
            console.log("Clicked city:", city);

            const future = new Date();
            future.setDate(future.getDate() + 2);
            const date = future.toISOString().slice(0, 10);

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
          }}
        />
      </div>
    </main>
  );
}
