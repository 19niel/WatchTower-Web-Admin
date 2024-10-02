import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.7749, // Example latitude (San Francisco)
  lng: -122.4194, // Example longitude
};

const Geography = () => {
  const theme = useTheme();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Map of Reports" subtitle="Find all the history of reports" />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        >
          <Marker position={center} />
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default Geography;
