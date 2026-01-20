import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { geocodeAddress } from "../Utils/geocodeAddress";
const Geocode = () => {
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const handleGeocode = async () => {
        const result = await geocodeAddress(address);
        if (result) {
            setCoordinates(result);
        }
        else {
            alert("Address could not be geocoded");
        }
    };
    return (_jsxs("div", { children: [_jsx("input", { type: "text", value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Enter address in Digos City", className: "input-field" }), _jsx("button", { onClick: handleGeocode, className: "btn", children: "Geocode Address" }), coordinates && (_jsxs("div", { children: [_jsxs("p", { children: ["Latitude: ", coordinates.lat] }), _jsxs("p", { children: ["Longitude: ", coordinates.lng] })] }))] }));
};
export default Geocode;
