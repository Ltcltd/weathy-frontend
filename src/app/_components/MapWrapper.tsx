"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapWrapper({
  onCitySelect,
}: {
  onCitySelect: (city: string) => void;
}) {
  return <Map onCitySelect={onCitySelect} />;
}
