import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON, } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";
import Modal from "./Modal";
import { Maximize } from "lucide-react";
const DSSMap = () => {
    const [geoData, setGeoData] = useState(null);
    const mapRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMaximizeModalOpen, setIsMaximizeModalOpen] = useState(false);
    const [view, setView] = useState("allocation"); // Only allocation view
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openMaximizeModal = () => {
        setIsMaximizeModalOpen(true);
    };
    const closeMaximizeModal = () => {
        setIsMaximizeModalOpen(false);
    };
    const allocationData = {
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
            }
            catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };
        fetchGeoData();
    }, []);
    const getColor = (intensity) => {
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
    const style = (feature) => {
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
    const onEachFeature = (feature, layer) => {
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
            click: (e) => {
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
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "map-container", children: [_jsxs("div", { className: "flex justify-end gap-5 ", children: [_jsx("button", { onClick: openMaximizeModal, className: "p-2 px-3 flex gap-2 text-black border rounded-2xl hover:text-green-700", children: _jsx(Maximize, { size: 16, className: "mt-0.5" }) }), _jsx("button", { onClick: openModal, className: "px-4 py-2 flex gap-2 text-black border rounded-2xl hover:text-green-700 ", children: _jsx("span", { className: "text-sm", children: "Summary" }) })] }), _jsxs(MapContainer, { ref: mapRef, center: [6.75, 125.35], zoom: 15, style: {
                        height: "400px",
                        width: "100%",
                        backgroundColor: "white",
                    }, className: "leaflet-map-container", children: [_jsx(TileLayer, { url: "" }), geoData && (_jsx(GeoJSON, { data: geoData, style: style, onEachFeature: onEachFeature })), _jsxs("div", { className: "legend-container", children: [_jsx("div", { className: "legend", children: _jsx("h5", { className: "text-slate-400 pb-2", children: "Legend" }) }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "legend-icon", style: {
                                                backgroundColor: "#006400",
                                                borderRadius: "none",
                                            } }), _jsx("span", { children: "High Priority" })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "legend-icon", style: { backgroundColor: "#008000" } }), _jsx("span", { children: "Medium Priority" })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "legend-icon", style: { backgroundColor: "#00FF00" } }), _jsx("span", { children: "Low Priority" })] }), _jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "legend-icon", style: { backgroundColor: "#98FB98" } }), _jsx("span", { children: "No Allocation" })] })] })] }), _jsx(Modal, { show: isModalOpen, maxWidth: "2xl", onClose: closeModal, children: _jsxs("div", { className: "p-8", children: [_jsx("h2", { className: "text-xl font-bold", children: "Heatmap Summary" }), _jsx("p", { className: "mt-4", children: "Allocation intensity varies across barangays. The darkest green areas indicate the highest allocation priority." })] }) }), _jsx(Modal, { show: isMaximizeModalOpen, maxWidth: "lg", onClose: closeMaximizeModal, children: _jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "Full Screen Mode" }), _jsxs(MapContainer, { ref: mapRef, center: [6.75, 125.35], zoom: 13, style: {
                                    height: "600px",
                                    width: "100%",
                                    backgroundColor: "white",
                                }, className: "leaflet-map-container", children: [_jsx(TileLayer, { url: "" }), geoData && (_jsx(GeoJSON, { data: geoData, style: style, onEachFeature: onEachFeature }))] })] }) })] }) }));
};
export default DSSMap;
