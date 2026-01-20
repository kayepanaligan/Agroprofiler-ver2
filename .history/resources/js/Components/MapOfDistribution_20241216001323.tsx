import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import "leaflet/dist/leaflet.css";

const MapOfDistribution = () => {
    const [distributionType, setDistributionType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [geoData, setGeoData] = useState<any>(null);
    const [heatmapData, setHeatmapData] = useState<any>({});
    const [allocationTypes, setAllocationTypes] = useState<any>([]);
    const [commodityCategories, setCommodityCategories] = useState<any>([]);
    const [farmersData, setFarmersData] = useState<any>({});

    useEffect(() => {
        // Fetch data from backend
        axios
            .get("/showResponseDashboard")
            .then((response) => {
                setGeoData(response.data.geoJson);
                setHeatmapData(response.data.heatmapData);
                setAllocationTypes(response.data.allocationType);
                setCommodityCategories(response.data.commodityCategories);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleDistributionChange = (event: any) => {
        setDistributionType(event.target.value);
        setSubtype(""); // Reset the subtype when the distribution type changes
    };

    const handleSubtypeChange = (event: any) => {
        setSubtype(event.target.value);
    };

    const getColor = (value: number) => {
        // Adjust the color intensity based on value
        return value > 10 ? "#d7301f" : value > 5 ? "#fc8d59" : "#fee08b";
    };

    const onEachFeature = (feature: any, layer: any) => {
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
        layer.bindPopup(
            `<b>${feature.properties.name}</b><br>Intensity: ${intensity}`
        );
    };

    return (
        <div>
            <div className="map-controls">
                <FormControl>
                    <InputLabel id="distribution-type-label">
                        Distribution Type
                    </InputLabel>
                    <Select
                        labelId="distribution-type-label"
                        value={distributionType}
                        onChange={handleDistributionChange}
                        fullWidth
                    >
                        <MenuItem value="allocations">Allocations</MenuItem>
                        <MenuItem value="farmers">Farmers</MenuItem>
                        <MenuItem value="commodities">Commodities</MenuItem>
                    </Select>
                </FormControl>

                {distributionType && (
                    <FormControl>
                        <InputLabel id="subtype-label">Subtype</InputLabel>
                        <Select
                            labelId="subtype-label"
                            value={subtype}
                            onChange={handleSubtypeChange}
                            fullWidth
                        >
                            {distributionType === "allocations" &&
                                allocationTypes.map((type: any) => (
                                    <MenuItem key={type.id} value={type.name}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            {distributionType === "farmers" && (
                                <>
                                    <MenuItem value="Registered">
                                        Registered
                                    </MenuItem>
                                    <MenuItem value="Unregistered">
                                        Unregistered
                                    </MenuItem>
                                </>
                            )}
                            {distributionType === "commodities" &&
                                commodityCategories.map((category: any) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                )}
            </div>

            <div className="map-container" style={{ height: "600px" }}>
                <MapContainer
                    center={[7.073, 125.612]}
                    zoom={12}
                    style={{ height: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    {geoData && (
                        <GeoJSON data={geoData} onEachFeature={onEachFeature} />
                    )}
                </MapContainer>
            </div>

            {distributionType && subtype && (
                <div className="legend">
                    <h4>
                        Legend: {distributionType} - {subtype}
                    </h4>
                    <ul>
                        <li style={{ backgroundColor: getColor(10) }}>
                            High Intensity (10+)
                        </li>
                        <li style={{ backgroundColor: getColor(5) }}>
                            Medium Intensity (5-9)
                        </li>
                        <li style={{ backgroundColor: getColor(0) }}>
                            Low Intensity (0)
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapOfDistribution;
