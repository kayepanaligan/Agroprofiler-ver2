import axios from "axios";

const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY; // Store your API key in environment variables

interface GeocodeResponse {
    lat: number;
    lng: number;
}

export const geocodeAddress = async (
    address: string
): Promise<GeocodeResponse | null> => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                address: `${address}, Digos City, Philippines`, // Limit to Digos City
                key: API_KEY,
            },
        });

        const result = response.data.results[0];
        if (result) {
            const { lat, lng } = result.geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};
