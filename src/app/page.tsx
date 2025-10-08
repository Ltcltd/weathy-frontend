"use client";

import { useState, useCallback } from "react";
import WeatherCard from "@/components/WeatherCard";
import ChatbotCard from "@/components/ChatbotCard";
import MapWrapper from "./_components/MapWrapper";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_ENDPOINTS } from "@/lib/api";

type WeatherPayload = {
  location: { lat: number; lon: number; address: string };
  date: string;
  probabilities: Record<
    string,
    { value: number; uncertainty: number; confidence: string }
  >;
  recommendations?: string[];
};

type ChatbotResponse = {
  response: string;
  structured_data: {
    location: { lat: number; lon: number; name: string };
    date: string;
    primary_concern: string;
    probability: number;
    confidence: string;
  };
  recommendations?: { type: string; priority: string }[];
  followup_questions?: string[];
};

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherPayload | null>(null);
  const [chatbotData, setChatbotData] = useState<ChatbotResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    city: string;
    lat: number;
    lon: number;
  } | null>(null);

  const queryChatbot = useCallback(async (message: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.chatbot.query, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChatbotData(data);
    } catch (err) {
      console.error("Chatbot query failed:", err);
    }
  }, []);

  const fetchWeatherData = useCallback(
    async (city: string, lat: number, lon: number, date: string) => {
      try {
        const res = await fetch(API_ENDPOINTS.map.probability(lat, lon, date));
        const data = await res.json();
        console.log("API response:", data);

        const patchedData = {
          ...data,
          location: {
            ...data.location,
            address: city,
          },
        };

        setWeatherData(patchedData);

        // Auto-query chatbot based on first concern
        const primaryConcern = Object.keys(patchedData.probabilities)[0];
        const query = `Will it ${primaryConcern} in ${city} on ${date}?`;
        queryChatbot(query);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    },
    [queryChatbot]
  );

  const handleCitySelect = useCallback(
    async ({ city, lat, lon }: { city: string; lat: number; lon: number }) => {
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

                    const localDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    ).toLocaleDateString("en-CA");

                    setSelectedDate(localDate);

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
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Floating Chatbot Widget */}
      {chatbotData && (
        <div className="absolute bottom-4 right-4 z-10">
          <ChatbotCard initial={chatbotData} />
        </div>
      )}

      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper onCitySelect={handleCitySelect} />
      </div>
    </main>
  );
}
