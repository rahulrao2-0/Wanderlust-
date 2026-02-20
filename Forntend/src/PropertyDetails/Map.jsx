import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Mapb = ({ coordinates }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  console.log("Received coordinates:", coordinates);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    // Extract center from GeoJSON coordinates (GeoJSON = [lng, lat])
    // Support both Point geometry and array of coordinates
    let center = [77.2088, 28.6139]; // default fallback

    if (coordinates) {
      if (Array.isArray(coordinates) && typeof coordinates[0] === "number") {
        // Direct [lng, lat] array
        center = coordinates;
      } else if (coordinates.type === "Feature") {
        center = coordinates.geometry.coordinates;
      } else if (coordinates.type === "Point") {
        center = coordinates.coordinates;
      }
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 9,
    });

    mapRef.current.on("load", () => {
      // Place marker at the coordinates
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(center)
        .addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]); // re-run if coordinates change

  return (
    <div
      ref={mapContainerRef}
      style={{ maxWidth: "800px", minWidth: "300px", height: "500px", minHeight: "300px", borderRadius:"10px", margin:"0 auto" }}
    />
  );
};

export default Mapb;