"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json", // free demo style
      center: [78.4867, 17.385], // Hyderabad coords
      zoom: 5,
    });

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-md" />
  );
}
