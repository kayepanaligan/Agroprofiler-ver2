import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "public/Digos_City.geojson";
import { useState, useEffect } from "react";
import axios from "axios";

const getIntensity = (value, thresholds) => {
    if (value > thresholds.high) return "high";
    if (value >= thresholds.medium) return "medium";
    return "low";
};

const Heatmap = ({ data, type }) => {
    const [barangayData, setBarangayData] = useState([]);

    useEffect(() => {
        axios.get("/api/heatmap-data").then((response) => {
            setBarangayData(response.data);
        });
    }, []);

    const getIntensityForBarangay = (barangay) => {
        if (type === "allocations") {
            const { totalAllocated, totalTypeAmount } = barangay;
            const percentage = (totalAllocated / totalTypeAmount) * 100;
            return getIntensity(percentage, { high: 60, medium: 40 });
        } else if (type === "farmers") {
            const { registered, unregistered, totalFarmers } = barangay;
            const regPercentage = (registered / totalFarmers) * 100;
            const unregPercentage = (unregistered / totalFarmers) * 100;
            return {
                registered: getIntensity(regPercentage, {
                    high: 60,
                    medium: 40,
                }),
                unregistered: getIntensity(unregPercentage, {
                    high: 60,
                    medium: 40,
                }),
            };
        } else if (type === "commodities") {
            const { commodityCount } = barangay;
            return getIntensity(commodityCount, { high: 150, medium: 100 });
        }
        return "low";
    };

    const styleFeature = (feature) => {
        const barangay = barangayData.find(
            (b) => b.brgy_id === feature.properties.brgy_id
        );
        const intensity = barangay ? getIntensityForBarangay(barangay) : "low";
        const color =
            intensity === "high"
                ? "#FF0000"
                : intensity === "medium"
                ? "#FFA500"
                : "#FFFF00";
        return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: "white",
            fillOpacity: 0.7,
        };
    };

    return (
        <MapContainer
            center={[6.75, 125.35]}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geojsonData} style={styleFeature} />
        </MapContainer>
    );
};

export default Heatmap;
