import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const SanJuanMap = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedLocation, setSelectedLocation] = useState(null); // State to store selected location

  useEffect(() => {
    console.log("Map component rendered");
  }, []); // Empty dependency array means this runs only once when mounted.

  const handleMapClick = (event) => {
    const { lat, lng } = event.latLng.toJSON();
    setSelectedLocation({ lat, lng });
    onLocationSelect({ lat, lng }); // Pass the selected location back to the parent component
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box sx={{ width: "100%", height: "100%", backgroundColor: "lightgray" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={{ lat: 14.601972841610728, lng: 121.03527772039602 }}
        onClick={handleMapClick} // Handle map clicks
      >
        {selectedLocation && ( // Show marker if a location is selected
          <Marker position={selectedLocation} />
        )}
      </GoogleMap>
    </Box>
  );
};

export default SanJuanMap;
