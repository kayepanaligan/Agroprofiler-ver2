import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";

interface Commodity {
    id: number;
    name: string;
    farms_count: number;
    count: number;
    commodity_name: string;
    commodity_total: number;
}

interface CommodityCategory {
    id: number;
    name: string;
    desc: string;
    commodity_category_name: string;
    commodity_category_total: number;
    commodities: Commodity[];
}

interface AllocationType {
    id: number;
    name: string;
}

interface HeatmapProps {
    heatmapData: Record<string, any>;
    commodityCategories: CommodityCategory[];
    allocationType: AllocationType[];
}

const Heatmap: React.FC<HeatmapProps> = ({
    heatmapData,
    commodityCategories,
    allocationType,
}: HeatmapProps) => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<any>(null);
    const [view, setView] = useState("allocations");
    const [subtype, setSubtype] = useState("All");
    const [category, setCategory] = useState("All");
    const [allocations, setAllocations] = useState<string[]>(["All"]);
    const [farmers, setFarmers] = useState<string[]>([
        "Registered",
        "Unregistered",
    ]);
    const [categories, setCategories] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const categoryMap: Record<string, string[]> = {};
        commodityCategories.forEach((category: CommodityCategory) => {
            categoryMap[category.name] = category.commodities.map(
                (commodity: Commodity) => commodity.name
            );
        });
        setCategories(categoryMap);
    }, [commodityCategories]);

    useEffect(() => {
        const allocationNames = allocationType.map(
            (type: AllocationType) => type.name
        );
        setAllocations(["All", ...allocationNames]);
    }, [allocationType]);

    const distributions: Record<string, string[]> = {
        allocations: allocations,
        commodities: Object.keys(categories), // Keep "farmers" as the current list of farmers
        farmers: farmers,
    };

    const handleChangeView = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setView(e.target.value);
        setSubtype("All");
        setCategory("All");
    };

    const handleChangeSubtype = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubtype(e.target.value);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubtype("All");
    };

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await axios.get("/Digos_City.geojson");
                setGeoData(response.data);
                console.log(geoData);
            } catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };

        fetchGeoData();
    }, []);

    const getColor = (percentage: number) => {
        return percentage > 50
            ? "#0ba60a" // High intensity (Green)
            : percentage >= 20
            ? "#ecdd09" // Medium intensity (Yellow)
            : "#ec1809"; // Low intensity (Red)
    };

    const calculatePercentageIntensity = (barangayName: string) => {
        if (view === "commodities" && category !== "All" && subtype !== "All") {
            const barangayTotal =
                heatmapData[barangayName]?.commodities?.[category]?.[subtype] ||
                0;
            const overallTotal = Object.values(heatmapData)
                .map(
                    (data: any) => data.commodities?.[category]?.[subtype] || 0
                )
                .reduce((acc, val) => acc + val, 0);

            return overallTotal > 0 ? (barangayTotal / overallTotal) * 100 : 0;
        }
        return 0;
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        const intensity = calculatePercentageIntensity(barangayName);

        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const renderLegend = () => (
        <div className="legend-container dark:bg-[#0D1A25]">
            <div className="legend">
                <h4 className="text-md dark:text-white">
                    {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                    {subtype && subtype !== "All" ? `- ${subtype}` : ""}
                </h4>
                <ul>
                    <li className="legend-item" style={{ color: "#0ba60a" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#0ba60a" }}
                        ></span>{" "}
                        Very High (More than 100)
                    </li>
                    <li className="legend-item" style={{ color: "#ecdd09" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#ecdd09" }}
                        ></span>{" "}
                        Medium (More than 50)
                    </li>
                    <li className="legend-item" style={{ color: "#ec1809" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#ec1809" }}
                        ></span>{" "}
                        Low (0 - 40)
                    </li>
                </ul>
            </div>
        </div>
    );

    console.log("Selected Category:", category);
    console.log("Selected Commodity:", subtype);

    return (
        <div className="heatmap-container">
            <div className="select-container mb-10 grid lg:grid-flow-row lg:grid-rows-1 md:grid-flow-col md:grid-cols-2 gap-4">
                <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="border-slate-400 dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] rounded-xl cursor-pointer focus:border-green-500 sm:text-[14px]"
                >
                    <option value="allocations">Allocations</option>
                    <option value="commodities">Commodities</option>
                    <option value="farmers">Farmers</option>
                </select>

                {view === "commodities" && (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All">All Categories</option>
                        {Object.keys(categories).map((categoryName) => (
                            <option key={categoryName} value={categoryName}>
                                {categoryName}
                            </option>
                        ))}
                    </select>
                )}

                {view === "commodities" && category !== "All" && (
                    <select
                        value={subtype}
                        onChange={(e) => setSubtype(e.target.value)}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All">All Commodities</option>
                        {categories[category].map((commodity) => (
                            <option key={commodity} value={commodity}>
                                {commodity}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {hoveredBarangay && (
                <div className="hover-info">
                    <p>
                        <strong>{hoveredBarangay.name}</strong>:{" "}
                        {hoveredBarangay.value ?? "No Data"}
                    </p>
                </div>
            )}

            <MapContainer
                ref={mapRef}
                center={[6.75, 125.35]}
                scrollWheelZoom={true}
                zoom={12}
                style={{
                    width: "100%",
                    height: "500px",
                    zIndex: "10",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                }}
                className="dark:bg-black"
            >
                {geoData && (
                    <GeoJSON
                        key={view + subtype}
                        data={geoData}
                        style={style}
                        onEachFeature={(feature: any, layer: any) => {
                            layer.on({
                                click: () => {
                                    const barangayName =
                                        feature.properties.NAME_2.replace(
                                            /\s+/g,
                                            ""
                                        );
                                    const data = heatmapData[barangayName];
                                    alert(JSON.stringify(data));
                                },
                                mouseover: () => {
                                    const barangayName =
                                        feature.properties.NAME_2.replace(
                                            /\s+/g,
                                            ""
                                        );
                                    const value =
                                        calculatePercentageIntensity(
                                            barangayName
                                        );
                                    setHoveredBarangay({
                                        name: barangayName,
                                        value,
                                    });
                                    layer.setStyle({
                                        weight: 3,
                                        color: "blue",
                                    });
                                },
                                mouseout: () => {
                                    setHoveredBarangay(null);
                                    layer.setStyle({
                                        weight: 2,
                                        color: "black",
                                    });
                                },
                            });
                        }}
                    />
                )}
                {renderLegend()}
            </MapContainer>
        </div>
    );
};

export default Heatmap;
