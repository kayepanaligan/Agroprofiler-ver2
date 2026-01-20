import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";

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
        commodities: farmers, // Keep "farmers" as the current list of farmers
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

    const getColor = (intensity: number) => {
        return intensity > 100
            ? "#0ba60a"
            : intensity > 40
            ? "#ecdd09"
            : "#ec1809";
    };

    const getIntensityCategory = (intensity: number) => {
        return intensity > 100 ? "High" : intensity > 70 ? "Medium" : "Low";
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        let intensity = 0;
        if (subtype === "All") {
            intensity = calculateTotalForAll(barangayName)[view] || 0;
        } else {
            intensity = heatmapData[barangayName]?.[view]?.[subtype] || 0;
        }

        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const calculateTotalForAll = (barangayName: string) => {
        const allocationTotal = Object.values(
            heatmapData[barangayName]?.allocations || {}
        ).reduce((acc, val) => acc + val, 0);

        const commodityTotal = Object.values(
            heatmapData[barangayName]?.commodities || {}
        ).reduce((acc, commodityCategory) => {
            if (
                typeof commodityCategory === "object" &&
                commodityCategory !== null
            ) {
                return (
                    acc +
                    Object.values(
                        commodityCategory as Record<string, number>
                    ).reduce((subAcc, val) => subAcc + val, 0)
                );
            }
            return acc + (commodityCategory as number);
        }, 0);

        const farmerTotal = Object.values(
            heatmapData[barangayName]?.farmers || {}
        ).reduce((acc, val) => acc + val, 0);

        return {
            allocations: allocationTotal,
            commodities: commodityTotal,
            farmers: farmerTotal,
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

    return (
        <div className="heatmap-container">
            <div className="select-container mb-10 grid lg:grid-flow-row lg:grid-rows-1 md:grid-flow-col md:grid-cols-2 gap-4">
                <select
                    value={view}
                    onChange={handleChangeView}
                    className="border-slate-400 dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] rounded-xl cursor-pointer focus:border-green-500 sm:text-[14px]"
                >
                    <option value="allocations" className="dark:text-white">
                        Allocations
                    </option>
                    <option value="commodities" className="dark:text-white">
                        Commodities
                    </option>
                    <option value="farmers" className="dark:text-white">
                        Farmers
                    </option>
                </select>

                <select
                    id="subtype-select"
                    onChange={handleChangeSubtype}
                    value={subtype}
                    className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                >
                    {distributions[view]?.map((dist) => (
                        <option
                            key={dist}
                            value={dist}
                            className="dark:text-white"
                        >
                            {dist}
                        </option>
                    ))}
                </select>

                {view === "commodities" && (
                    <select
                        value={category}
                        onChange={handleChangeCategory}
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
                        value={category}
                        onChange={handleChangeCategory}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All">All Categories</option>
                        {categories[category].map((commodity: string) => (
                            <option key={commodity} value={commodity}>
                                {commodity}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <MapContainer
                ref={mapRef}
                center={[7.0718, 125.608]}
                zoom={12}
                style={{ height: "500px", width: "100%" }}
            >
                {geoData && (
                    <GeoJSON
                        key={view + subtype}
                        data={geoData}
                        style={style}
                        // onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
            {renderLegend()}
        </div>
    );
};

export default Heatmap;
