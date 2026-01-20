import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import {
    Map as LeafletMap,
    GeoJSON as LeafletGeoJSON,
    LeafletEvent,
} from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import { ChevronDown, Maximize } from "lucide-react";

const DSSMap: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMaximizeModalOpen, setIsMaximizeModalOpen] =
        useState<boolean>(false);
    const [view, setView] = useState<"allocation">("allocation"); // Only allocation view

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const openMaximizeModal = (): void => {
        setIsMaximizeModalOpen(true);
    };

    const closeMaximizeModal = (): void => {
        setIsMaximizeModalOpen(false);
    };

    const allocationData: { [key: string]: number } = {
        Aplaya: 50,
        Balabag: 70,
        Binaton: 30,
        Cogon: 90,
        Colorado: 60,
        Dawis: 40,
        Dulangan: 20,
        Goma: 80,
        Igpit: 75,
        Kapatagan: 10,
        Kiagot: 55,
        Lungag: 95,
        Mahayahay: 65,
        Matti: 85,
        Ruparan: 45,
        SanAgustin: 35,
        SanJose: 25,
        SanMiguel: 15,
        SanRoque: 100,
        Sinawilan: 40,
        Soong: 70,
        Tiguman: 60,
        TresDeMayo: 30,
        Zone1: 55,
        Zone2: 20,
        Zone3: 90,
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

    const getColor = (intensity: number) => {
        return intensity > 80
            ? "#006400"
            : intensity > 60
            ? "#008000"
            : intensity > 40
            ? "#00FF00"
            : intensity > 20
            ? "#98FB98"
            : "#E0FFE0";
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = allocationData[barangayName] || 0;
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
        const label = feature.properties.NAME_2 || "Unnamed";

        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = allocationData[barangayName] || 0;

        layer.bindTooltip(`${label}`, {
            permanent: false,
            direction: "top",
            className: "custom-tooltip",
        });

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
            click: (e: LeafletEvent) => {
                console.log("Clicked feature:", feature.properties.NAME_2);
                layer.setStyle({
                    weight: 1,
                    color: "#FF0000",
                    dashArray: "1px",
                    fillOpacity: 0.7,
                });
            },
        });
    };

    return (
        <>
            <div className="map-container">
                <div className="flex justify-end gap-5 ">
                    <button
                        onClick={openMaximizeModal}
                        className="p-2 px-3 flex gap-2 text-black border rounded-2xl hover:text-green-700"
                    >
                        <Maximize size={16} className="mt-0.5" />
                    </button>

                    <button
                        onClick={openModal}
                        className="px-4 py-2 flex gap-2 text-black border rounded-2xl hover:text-green-700 "
                    >
                        <span className="text-sm">Summary</span>
                    </button>
                </div>

                <MapContainer
                    ref={mapRef}
                    center={[6.75, 125.35]}
                    zoom={15}
                    style={{
                        height: "400px",
                        width: "100%",
                        backgroundColor: "white",
                    }}
                    className="leaflet-map-container"
                >
                    <TileLayer url="" />
                    {geoData && (
                        <GeoJSON
                            data={geoData}
                            style={style}
                            onEachFeature={onEachFeature}
                        />
                    )}

                    {/* Legend Component */}
                    <div className="legend-container">
                        <div className="legend">
                            <h5 className="text-slate-400 pb-2">Legend</h5>
                        </div>
                        <div className="legend-item">
                            <div
                                className="legend-icon"
                                style={{
                                    backgroundColor: "#006400",
                                    borderRadius: "none",
                                }}
                            />
                            <span>High Priority</span>
                        </div>

                        <div className="legend-item">
                            <div
                                className="legend-icon"
                                style={{ backgroundColor: "#008000" }}
                            />
                            <span>Medium Priority</span>
                        </div>

                        <div className="legend-item">
                            <div
                                className="legend-icon"
                                style={{ backgroundColor: "#00FF00" }}
                            />
                            <span>Low Priority</span>
                        </div>

                        <div className="legend-item">
                            <div
                                className="legend-icon"
                                style={{ backgroundColor: "#98FB98" }}
                            />
                            <span>No Allocation</span>
                        </div>
                    </div>
                </MapContainer>

                <Modal show={isModalOpen} maxWidth="2xl" onClose={closeModal}>
                    <div className="p-8">
                        <h2 className="text-xl font-bold">Heatmap Summary</h2>
                        <p className="mt-4">
                            Allocation intensity varies across barangays. The
                            darkest green areas indicate the highest allocation
                            priority.
                        </p>
                    </div>
                </Modal>

                <Modal
                    show={isMaximizeModalOpen}
                    maxWidth="lg"
                    onClose={closeMaximizeModal}
                >
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Full Screen Mode</h2>
                        <MapContainer
                            ref={mapRef}
                            center={[6.75, 125.35]}
                            zoom={13}
                            style={{
                                height: "600px",
                                width: "100%",
                                backgroundColor: "white",
                            }}
                            className="leaflet-map-container"
                        >
                            <TileLayer url="" />
                            {geoData && (
                                <GeoJSON
                                    data={geoData}
                                    style={style}
                                    onEachFeature={onEachFeature}
                                />
                            )}
                        </MapContainer>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default DSSMap;
