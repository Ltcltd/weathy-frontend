"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  onCitySelect: (data: { city: string; lat: number; lon: number }) => void;
};

export default function Map({ onCitySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markerInstance = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [78.4867, 17.385],
      zoom: 5,
      maxZoom: 7,
    });

    mapInstance.current = map;

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);

      const labelFeature = features.find(
        (f) =>
          f.layer.type === "symbol" &&
          f.properties?.name &&
          f.geometry.type === "Point"
      );

      if (labelFeature && labelFeature.geometry.type === "Point") {
        const [lon, lat] = labelFeature.geometry.coordinates as [
          number,
          number
        ];
        const label = labelFeature.properties.name;

        console.log(`Clicked label: ${label}`);
        console.log(`Label coordinates: ${lat}, ${lon}`);

        // ✅ Drop or move the marker
        if (markerInstance.current) {
          markerInstance.current.setLngLat([lon, lat]);
        } else {
          markerInstance.current = new maplibregl.Marker({ color: "#f43f5e" })
            .setLngLat([lon, lat])
            .addTo(map);
        }

        onCitySelect({ city: label, lat, lon });
      } else {
        console.log("No label with coordinates found at click point");
      }
    });

    const hoverMarker = new maplibregl.Marker({
      color: "#f43f5e",
      scale: 0.5, // smaller than click marker
    })
      .setLngLat([0, 0])
      .addTo(map);
    hoverMarker.getElement().style.display = "none"; // hide initially

    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point);

      const labelFeature = features.find(
        (f) =>
          f.layer.type === "symbol" &&
          f.properties?.name &&
          f.geometry.type === "Point"
      );

      if (labelFeature && labelFeature.geometry.type === "Point") {
        const [lon, lat] = labelFeature.geometry.coordinates as [
          number,
          number
        ];
        hoverMarker.setLngLat([lon, lat]);
        hoverMarker.getElement().style.display = "block";
        map.getCanvas().style.cursor = "pointer";
      } else {
        hoverMarker.getElement().style.display = "none";
        map.getCanvas().style.cursor = "";
      }
    });

    return () => {
      map.remove();
      mapInstance.current = null;
      markerInstance.current = null;
    };
  }, []); // ✅ Empty dependency array - only run once

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ height: "100%" }}
    />
  );
}
