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
      maxZoom: 7, // 🚫 Prevent zooming in too far
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);

      const labelFeature = features.find(
        (f) => f.layer.type === "symbol" && f.properties?.name // or f.properties?.text
      );

      if (labelFeature) {
        console.log("Clicked label:", labelFeature.properties.name);
      } else {
        console.log("No label found at click point");
      }
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
