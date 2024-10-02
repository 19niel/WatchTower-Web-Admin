import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
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
  { lat: 14.6134, lng: 121.0347 }, // Point 1
  { lat: 14.6093, lng: 121.0419 }, // Point 2
  { lat: 14.6041, lng: 121.0420 }, // Point 3
  { lat: 14.6017, lng: 121.0403 }, // Point 4
  { lat: 14.6008, lng: 121.0362 }, // Point 5
  { lat: 14.6017, lng: 121.0348 }, // Point 6

  // 14.594834, 121.026099
  // 14.595662, 121.026662
  // 14.595857, 121.026893
  // 14.595881, 121.026945
  // 14.595896, 121.027019
  // 14.595888, 121.027082
  // 14.595858, 121.027165
  // 14.595847, 121.027193
  // 14.595070, 121.028490
  // 14.595020, 121.028601
  // 14.595020, 121.028670
  // 14.595208, 121.028994
  // 14.595220, 121.029060
  // 14.595210, 121.029138
  // 14.595081, 121.029272
  // 14.594929, 121.029383
  // 14.594833, 121.029421


  

];

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
          zoom={13} // Adjust zoom level for better visibility of the polygon
          center={center}
        >
          <Marker position={center} />
          
          {/* Polygon for San Juan City */}
          <Polygon
            paths={sanJuanPolygon}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.1,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default Geography;
