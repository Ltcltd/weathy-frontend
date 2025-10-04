"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  onCitySelect: (data: { city: string; lat: number; lon: number }) => void;
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
        (f) =>
          f.layer.type === "symbol" &&
          f.properties?.name &&
          f.geometry.type === "Point"
      );

      if (labelFeature && labelFeature.geometry.type === "Point") {
        let coord = labelFeature.geometry.coordinates as [number, number];
        const coords = [Math.round(coord[0]), Math.round(coord[1])];
        const label = labelFeature.properties.name;
        const lat = coords[1];
        const lon = coords[0];

        console.log(`Clicked label: ${label}`);
        console.log(`Label coordinates: ${lat}, ${lon}`);

        onCitySelect({ city: label, lat, lon });
      } else {
        console.log("No label with coordinates found at click point");
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
