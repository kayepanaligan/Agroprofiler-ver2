import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

const getIntensity = (value, thresholds) => {
    if (value > thresholds.high) return "high";
    if (value >= thresholds.medium) return "medium";
    return "low";
};

const HeatmapLegend = () => {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "info legend");
            const grades = ["low", "medium", "high"];
            const colors = ["#FFFF00", "#FFA500", "#FF0000"];

            div.innerHTML = "<strong>Intensity</strong><br>";
            grades.forEach((grade, index) => {
                div.innerHTML += `<i style="background:${colors[index]}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i>${grade}<br>`;
            });

            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
};

const Heatmap = ({ data, type }) => {
    const [barangayData, setBarangayData] = useState([]);
    const [geojsonData, setGeojsonData] = useState(null);

    useEffect(() => {
        axios.get("/api/heatmap-data").then((response) => {
            setBarangayData(response.data);
        });
    }, []);

    useEffect(() => {
        fetch("/public/Digos_City.geojson")
            .then((response) => response.json())
            .then((data) => setGeojsonData(data))
            .catch((error) => console.error("Error loading GeoJSON:", error));
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
            {geojsonData && <GeoJSON data={geojsonData} style={styleFeature} />}
            <HeatmapLegend />
        </MapContainer>
    );
};

export default Heatmap;
