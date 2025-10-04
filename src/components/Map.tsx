"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  onCitySelect: (city: string) => void;
};

export default function Map({ onCitySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [78.4867, 17.385], // Hyderabad
      zoom: 5,
      maxZoom: 8, // 🚫 Prevent zooming in too far
    });

    // 🖱️ Detect clicks on city labels
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["poi_r20"],
      });

      // Debug: log features on click
      console.log(
        "POI features:",
        features.map((f) => f.properties)
      );

      const cityFeature = features.find((f) => {
        const name = f.properties?.name;
        const kind = f.properties?.kind;
        return (
          typeof name === "string" && (kind === "city" || kind === "locality")
        );
      });

      if (cityFeature) {
        const cityName = cityFeature.properties!.name;
        onCitySelect(cityName);
      }
    });

    map.on("load", () => {
      const layers = map.getStyle().layers;
      console.log(
        "Available layers:",
        layers?.map((l) => l.id)
      );
    });

    return () => map.remove();
  }, [onCitySelect]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ height: "100%" }}
    />
  );
}
