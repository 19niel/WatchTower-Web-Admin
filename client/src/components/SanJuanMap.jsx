// SanJuanMap.jsx
import React from "react";
import { Box } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, Polygon } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Center coordinates for San Juan City
const center = {
  lat: 14.601682665364194,
  lng: 121.03525637034869,
};

// Define the coordinates for the polygon around San Juan City
const sanJuanPolygon = [
  { lat: 14.6090, lng: 121.0341 },
  { lat: 14.6050, lng: 121.0380 },
  { lat: 14.6010, lng: 121.0355 },
  { lat: 14.5970, lng: 121.0320 },
  { lat: 14.6010, lng: 121.0300 },
  { lat: 14.6050, lng: 121.0315 },
];

const SanJuanMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Make sure to add your API key in .env
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        {/* Add Marker */}
        <Marker position={center} />

        {/* Add Polygon */}
        <Polygon
          paths={sanJuanPolygon}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </Box>
  );
};

export default SanJuanMap;
