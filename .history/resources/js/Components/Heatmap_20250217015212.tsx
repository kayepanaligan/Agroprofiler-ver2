import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

interface Commodity {
    id: number;
    name: string;
}

interface AllocationType {
    id: number;
    name: string;
}

interface CommodityCategory {
    id: number;
    name: string;
    commodities: Commodity[];
}

interface HeatmapData {
    [barangay: string]: {
        allocations: { [key: string]: number };
        commodities_categories: { [key: string]: { [key: string]: number } };
        farmers: { Registered: number; Unregistered: number };
    };
}

interface HeatmapProps {
    allocationType: AllocationType[];
    commodityCategories: CommodityCategory[];
    heatmapData: HeatmapData;
}

const Heatmap: React.FC<HeatmapProps> = ({
    allocationType,
    commodityCategories,
    heatmapData,
}) => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<any>(null);
    const [view, setView] = useState<
        "allocations" | "commodities_categories" | "farmers"
    >("allocations");
    const [subtype, setSubtype] = useState<string>("All");
    const geoJsonLayer = useRef<any>(null);
    const [category, setCategory] = useState<string>("All");
    const [subtypes, setSubtypes] = useState<string[]>([]);

    useEffect(() => {
        if (view === "allocations") {
            setSubtypes(allocationType.map((type) => type.name));
            setSubtype(allocationType.length > 0 ? allocationType[0].name : "");
        } else if (view === "commodities_categories") {
            const allCommodities = commodityCategories.flatMap((category) =>
                category.commodities.map((c) => c.name)
            );
            setSubtypes(allCommodities);
            setSubtype(allCommodities.length > 0 ? allCommodities[0] : "");
        } else {
            setSubtypes(["Registered", "Unregistered"]);
            setSubtype("Registered");
        }
    }, [view, allocationType, commodityCategories]);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await axios.get("/Digos_City.geojson");
                setGeoData(response.data);

                if (mapRef.current && response.data) {
                    geoJsonLayer.current = new L.GeoJSON(response.data);
                    const bounds = geoJsonLayer.current.getBounds();
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
        return intensity > 100
            ? "#0ba60a"
            : intensity > 40
            ? "#ecdd09"
            : "#ec1809";
    };

    const getIntensity = (barangayName: string) => {
        let intensity = 0;

        if (!heatmapData[barangayName]) return intensity;

        if (view === "allocations") {
            if (subtype === "All") {
                intensity = Object.values(
                    heatmapData[barangayName].allocations
                ).reduce((acc, val) => acc + val, 0);
            } else {
                intensity = heatmapData[barangayName].allocations[subtype] || 0;
            }
        } else if (view === "commodities_categories") {
            if (subtype === "All") {
                intensity = Object.values(
                    heatmapData[barangayName].commodities_categories
                )
                    .flatMap((category) => Object.values(category))
                    .reduce((acc, val) => acc + val, 0);
            } else {
                intensity = Object.values(
                    heatmapData[barangayName].commodities_categories
                )
                    .flatMap((category) => category[subtype] || 0)
                    .reduce((acc, val) => acc + val, 0);
            }
        } else if (view === "farmers") {
            intensity = heatmapData[barangayName].farmers[subtype] || 0;
        }

        return intensity;
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = getIntensity(barangayName);

        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setView(
            e.target.value as
                | "allocations"
                | "commodities_categories"
                | "farmers"
        );
        setSubtype("All");
    };

    const handleSubtypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubtype(e.target.value);
    };

    return (
        <div>
            <div>
                <label>View: </label>
                <select value={view} onChange={handleViewChange}>
                    <option value="allocations">Allocations</option>
                    <option value="commodities_categories">Commodities</option>
                    <option value="farmers">Farmers</option>
                </select>

                {subtypes.length > 0 && (
                    <>
                        <label>Subtype: </label>
                        <select value={subtype} onChange={handleSubtypeChange}>
                            <option value="All">All</option>
                            {subtypes.map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            {geoData && (
                <MapContainer
                    center={[6.75, 125.35]}
                    zoom={12}
                    style={{ height: "500px", width: "100%" }}
                    ref={mapRef}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <GeoJSON data={geoData} style={style} />
                </MapContainer>
            )}
        </div>
    );
};

export default Heatmap;
