"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type CitySelection = {
  city: string;
  lat: number;
  lon: number;
};

export default function MapWrapper({
  onCitySelect,
}: {
  onCitySelect: (data: CitySelection) => void;
}) {
  return <Map onCitySelect={onCitySelect} />;
}
