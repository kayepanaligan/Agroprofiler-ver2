import React, { useState } from "react";
import { geocodeAddress } from "../Utils/geocodeAddress";

const Geocode = () => {
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const handleGeocode = async () => {
        const result = await geocodeAddress(address);
        if (result) {
            setCoordinates(result);
        } else {
            alert("Address could not be geocoded");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address in Digos City"
                className="input-field"
            />
            <button onClick={handleGeocode} className="btn">
                Geocode Address
            </button>

            {coordinates && (
                <div>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lng}</p>
                </div>
            )}
        </div>
    );
};

export default Geocode;
