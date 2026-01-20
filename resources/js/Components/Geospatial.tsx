import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";

type DataType = {
    farmers: Record<string, number>;
    allocations: Record<string, number>;
    commodities: Record<string, number>;
    highValueCrops: Record<string, number>;
    cropDamages: Record<string, number>;
};

const GeospatialHeatmap: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const [view, setView] = useState<keyof DataType>("farmers");

    // Sample data for different views
    const data: DataType = {
        farmers: {
            Aplaya: 30,
            Balabag: 45,
            Binaton: 20,
        },
        allocations: {
            Aplaya: 50,
            Balabag: 30,
            Binaton: 10,
        },
        commodities: {
            Aplaya: 70,
            Balabag: 40,
            Binaton: 35,
        },
        highValueCrops: {
            Aplaya: 20,
            Balabag: 50,
            Binaton: 15,
        },
        cropDamages: {
            Aplaya: 15,
            Balabag: 25,
            Binaton: 50,
        },
    };

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await axios.get("/Digos_City.geojson");
                setGeoData(response.data);

                if (mapRef.current && response.data) {
                    const geoJsonLayer = new LeafletGeoJSON(response.data);
                    const bounds = geoJsonLayer.getBounds();
                    mapRef.current.fitBounds(bounds);
                    mapRef.current.setMaxBounds(bounds);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };

        fetchGeoData();
    }, []);

    const getColor = (value: number) => {
        return value > 70
            ? "#800026"
            : value > 50
            ? "#BD0026"
            : value > 30
            ? "#E31A1C"
            : value > 10
            ? "#FC4E2A"
            : "#FFEDA0";
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = data[view][barangayName] || 0;
        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = data[view][barangayName] || 0;

        layer.bindTooltip(
            `${feature.properties.NAME_2} - Intensity: ${intensity}`,
            {
                permanent: false,
                direction: "top",
                className: "custom-tooltip",
            }
        );

        layer.on({
            mouseover: () => {
                layer.openTooltip();
                layer.setStyle({
                    weight: 1,
                    color: "#FF0000",
                    dashArray: "2px",
                    fillOpacity: 0.7,
                });
            },
            mouseout: () => {
                layer.setStyle(style(feature));
            },
        });
    };

    return (
        <div className="map-container">
            <div className="p-4 flex justify-around border border-slate-200 rounded-xl shadow-sm mb-4">
                <button
                    onClick={() => setView("farmers")}
                    className={`text-sm rounded-lg mr-2 toggle-button ${
                        view === "farmers"
                            ? "active text-green-600 font-semibold"
                            : ""
                    }`}
                >
                    Farmers
                </button>
                <button
                    onClick={() => setView("allocations")}
                    className={`toggle-button text-sm mr-2  ${
                        view === "allocations"
                            ? "active text-green-600 font-semibold"
                            : ""
                    }`}
                >
                    Allocations
                </button>
                <button
                    onClick={() => setView("commodities")}
                    className={`toggle-button text-sm mr-2 ${
                        view === "commodities"
                            ? "active text-green-600 font-semibold"
                            : ""
                    }`}
                >
                    Commodities
                </button>
                <button
                    onClick={() => setView("highValueCrops")}
                    className={`toggle-button text-sm mr-2 ${
                        view === "highValueCrops"
                            ? "active text-green-600 font-semibold"
                            : ""
                    }`}
                >
                    High Value
                </button>
                <button
                    onClick={() => setView("cropDamages")}
                    className={`toggle-button text-sm mr-2 ${
                        view === "cropDamages"
                            ? "active text-green-600 font-semibold"
                            : ""
                    }`}
                >
                    Damages
                </button>
            </div>
            <MapContainer
                ref={mapRef}
                center={[6.75, 125.35]}
                zoom={12}
                style={{
                    height: "400px",
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                }}
                className="leaflet-map-container"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={style}
                        onEachFeature={onEachFeature}
                    />
                )}

                <div className="legend-container">
                    <div className="legend">
                        <h5 className="text-slate-400 pb-2">Legend</h5>
                        <div>
                            <div className="legend-item">
                                <div
                                    className="legend-icon"
                                    style={{ backgroundColor: "#800026" }}
                                />
                                {" > 70"}
                            </div>
                            <div className="legend-item">
                                <div
                                    className="legend-icon"
                                    style={{ backgroundColor: "#BD0026" }}
                                />
                                {" 51 - 70"}
                            </div>
                            <div className="legend-item">
                                <div
                                    className="legend-icon"
                                    style={{ backgroundColor: "#E31A1C" }}
                                />
                                {" 31 - 50"}
                            </div>
                            <div className="legend-item">
                                <div
                                    className="legend-icon"
                                    style={{ backgroundColor: "#FC4E2A" }}
                                />
                                {" 11 - 30"}
                            </div>
                            <div className="legend-item">
                                <div
                                    className="legend-icon"
                                    style={{ backgroundColor: "#FFEDA0" }}
                                />
                                {" 0 - 10"}
                            </div>
                        </div>
                    </div>
                </div>
            </MapContainer>
        </div>
    );
};

export default GeospatialHeatmap;
