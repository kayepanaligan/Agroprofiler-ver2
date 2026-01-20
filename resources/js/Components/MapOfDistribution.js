import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import "leaflet/dist/leaflet.css";
const MapOfDistribution = () => {
    const [distributionType, setDistributionType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [geoData, setGeoData] = useState(null);
    const [heatmapData, setHeatmapData] = useState({});
    const [allocationTypes, setAllocationTypes] = useState([]);
    const [commodityCategories, setCommodityCategories] = useState([]);
    useEffect(() => {
        // Fetch the local GeoJSON data
        fetch("/Digos_City.geojson")
            .then((response) => response.json())
            .then((data) => {
            setGeoData(data);
            console.log("GeoJSON loaded:", data); // Add this log to check if data is loaded
        })
            .catch((error) => console.error("Error loading GeoJSON:", error));
        // Fetch other required data from the backend
        axios
            .get("/api/dashboard")
            .then((response) => {
            setHeatmapData(response.data.heatmapData);
            setAllocationTypes(response.data.allocationType);
            setCommodityCategories(response.data.commodityCategories);
        })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    const handleDistributionChange = (event) => {
        setDistributionType(event.target.value);
        setSubtype(""); // Reset the subtype when the distribution type changes
    };
    const handleSubtypeChange = (event) => {
        setSubtype(event.target.value);
    };
    const getColor = (value) => {
        // Adjust the color intensity based on value
        return value > 10 ? "#d7301f" : value > 5 ? "#fc8d59" : "#fee08b";
    };
    const onEachFeature = (feature, layer) => {
        const brgyData = heatmapData[feature.properties.name];
        const intensity = brgyData?.[distributionType]?.[subtype] || 0;
        layer.setStyle({
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        });
        // Add popup to show detailed information
        layer.bindPopup(`<b>${feature.properties.name}</b><br>Intensity: ${intensity}`);
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "map-controls", children: [_jsxs(FormControl, { children: [_jsx(InputLabel, { id: "distribution-type-label", children: "Distribution Type" }), _jsxs(Select, { labelId: "distribution-type-label", value: distributionType, onChange: handleDistributionChange, fullWidth: true, children: [_jsx(MenuItem, { value: "allocations", children: "Allocations" }), _jsx(MenuItem, { value: "farmers", children: "Farmers" }), _jsx(MenuItem, { value: "commodities", children: "Commodities" })] })] }), distributionType && (_jsxs(FormControl, { children: [_jsx(InputLabel, { id: "subtype-label", children: "Subtype" }), _jsxs(Select, { labelId: "subtype-label", value: subtype, onChange: handleSubtypeChange, fullWidth: true, children: [distributionType === "allocations" &&
                                        allocationTypes.map((type) => (_jsx(MenuItem, { value: type.name, children: type.name }, type.id))), distributionType === "farmers" && (_jsxs(_Fragment, { children: [_jsx(MenuItem, { value: "Registered", children: "Registered" }), _jsx(MenuItem, { value: "Unregistered", children: "Unregistered" })] })), distributionType === "commodities" &&
                                        commodityCategories.map((category) => (_jsx(MenuItem, { value: category.name, children: category.name }, category.id)))] })] }))] }), _jsx("div", { className: "map-container", style: { height: "600px" }, children: _jsxs(MapContainer, { center: [7.073, 125.612], zoom: 12, style: { height: "100%" }, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "\u00A9 <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" }), geoData && (_jsx(GeoJSON, { data: geoData, onEachFeature: onEachFeature }))] }) }), distributionType && subtype && (_jsxs("div", { className: "legend", children: [_jsxs("h4", { children: ["Legend: ", distributionType, " - ", subtype] }), _jsxs("ul", { children: [_jsx("li", { style: { backgroundColor: getColor(10) }, children: "High Intensity (10+)" }), _jsx("li", { style: { backgroundColor: getColor(5) }, children: "Medium Intensity (5-9)" }), _jsx("li", { style: { backgroundColor: getColor(0) }, children: "Low Intensity (0)" })] })] }))] }));
};
export default MapOfDistribution;
