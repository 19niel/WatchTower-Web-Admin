// client/src/utils/geocode.js
import axios from 'axios';

export const geocodeLatLng = async (lat, lng) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log('Geocoding API response:', response.data); // Add this line for debugging

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      console.error('No results found or request error');
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    return 'Error fetching location';
  }
};
