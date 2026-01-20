import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";
import { Tooltip } from "react-leaflet";

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
    totalAmount: number;
    amount: string;
    identifier_title: string;
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
        commodities: Object.keys(categories),
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

    const getColor = (barangayName: string) => {
        let percentage = 0;
        let count = 0;

        if (view === "allocations" && subtype !== "All") {
            const allocationTypeData = allocationType.find(
                (type) => type.name === subtype
            );

            const totalAllocationTypeAmount = allocationTypeData
                ? parseFloat(allocationTypeData.amount)
                : 0;

            const allocationAmount = parseFloat(
                heatmapData[barangayName]?.allocations?.[subtype]?.amount || "0"
            );

            if (totalAllocationTypeAmount > 0) {
                percentage =
                    (allocationAmount / totalAllocationTypeAmount) * 100;
            } else {
                percentage = 0;
            }
        } else if (view === "farmers") {
            const totalFarmers = heatmapData[barangayName]?.farmers?.Total || 0;
            const selectedFarmers =
                heatmapData[barangayName]?.farmers?.[subtype] || 0;
            percentage =
                totalFarmers > 0 ? (selectedFarmers / totalFarmers) * 100 : 0;
        } else if (
            view === "commodities" &&
            category !== "All" &&
            subtype !== "All"
        ) {
            count =
                heatmapData[barangayName]?.commodities_categories?.[category]?.[
                    subtype
                ] || 0;
        }

        if (view === "commodities") {
            return count > 70 ? "#0ba60a" : count >= 30 ? "#ecdd09" : "#ec1809";
        } else {
            return percentage > 40
                ? "#0ba60a"
                : percentage >= 20
                ? "#ecdd09"
                : "#ec1809";
        }
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
        return {
            fillColor: getColor(barangayName),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const renderLegend = () => {
        let legendTitle = "Legend";
        let high = "High";
        let medium = "Medium";
        let low = "Low";

        if (view === "allocations" || view === "farmers") {
            legendTitle = "Percentage Distribution";
            high = "High (>40%)";
            medium = "Medium (20-40%)";
            low = "Low (<20%)";
        } else if (view === "commodities") {
            legendTitle = "Commodity Count";
            high = "High (>70)";
            medium = "Medium (30-70)";
            low = "Low (<30)";
        }

        return (
            <div className="legend-container dark:bg-[#0D1A25]">
                <div className="legend">
                    <h4 className="text-md dark:text-white">{legendTitle}</h4>
                    <ul>
                        <li
                            className="legend-item"
                            style={{ color: "#0ba60a" }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: "#0ba60a" }}
                            ></span>{" "}
                            {high}
                        </li>
                        <li
                            className="legend-item"
                            style={{ color: "#ecdd09" }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: "#ecdd09" }}
                            ></span>{" "}
                            {medium}
                        </li>
                        <li
                            className="legend-item"
                            style={{ color: "#ec1809" }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: "#ec1809" }}
                            ></span>{" "}
                            {low}
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const allocationNames = allocationType.map(
            (type: AllocationType) => type.name
        );
        setAllocations(["All", ...allocationNames]);
    }, [allocationType]);

    const onEachFeature = (feature: any, layer: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");

        if (!heatmapData[barangayName]) {
            return;
        }

        let tooltipContent = `<strong>${barangayName}</strong><br/>`;

        if (view === "farmers") {
            const totalFarmers = heatmapData[barangayName]?.farmers?.Total || 0;
            const registeredFarmers =
                heatmapData[barangayName]?.farmers?.Registered || 0;
            const unregisteredFarmers =
                heatmapData[barangayName]?.farmers?.Unregistered || 0;

            const registeredPercentage =
                totalFarmers > 0
                    ? ((registeredFarmers / totalFarmers) * 100).toFixed(2)
                    : 0;
            const unregisteredPercentage =
                totalFarmers > 0
                    ? ((unregisteredFarmers / totalFarmers) * 100).toFixed(2)
                    : 0;

            tooltipContent += `
            All: ${totalFarmers} Farmers<br/>
            Registered: ${registeredPercentage}% (${registeredFarmers})<br/>
            Unregistered: ${unregisteredPercentage}% (${unregisteredFarmers})
        `;
        } else if (view === "allocations" && subtype !== "All") {
            const allocationData = heatmapData[barangayName]?.allocations?.[
                subtype
            ] || { amount: 0 };
            const allocationAmount = allocationData.amount || 0;

            const totalAllocationAmount =
                allocationType.find((type) => type.name === subtype)
                    ?.totalAmount || 0;

            const allocationPercentage =
                totalAllocationAmount > 0
                    ? (
                          (allocationAmount / totalAllocationAmount) *
                          100
                      ).toFixed(2)
                    : "0";

            tooltipContent += `
        Allocation Type: ${subtype}<br/>
        Total Allocation: ${totalAllocationAmount}<br/>
        ${barangayName} received ${allocationPercentage}% (${allocationAmount}) ${allocationType.identifier_title} of ${subtype} (${totalAllocationAmount})
    `;
        } else if (
            view === "commodities" &&
            category !== "All" &&
            subtype !== "All"
        ) {
            const commodityCount =
                heatmapData[barangayName]?.commodities_categories?.[category]?.[
                    subtype
                ] || 0;
            tooltipContent += `${category} ${subtype}: ${commodityCount} farms`;
        }

        layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: "top",
        });
    };

    console.log("Selected Category:", category);
    console.log("Selected Commodity:", subtype);

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
                        <option value="All" className="dark:text-white">
                            All Categories
                        </option>
                        {Object.keys(categories).map((categoryName) => (
                            <option
                                className="dark:text-white"
                                key={categoryName}
                                value={categoryName}
                            >
                                {categoryName}
                            </option>
                        ))}
                    </select>
                )}

                {view === "commodities" && category !== "All" && (
                    <select
                        value={subtype}
                        onChange={handleChangeSubtype}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All">All Categories</option>
                        {categories[category].map((commodity: string) => (
                            <option
                                className="dark:text-white"
                                key={commodity}
                                value={commodity}
                            >
                                {commodity}
                            </option>
                        ))}
                    </select>
                )}
            </div>
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
                        onEachFeature={onEachFeature}
                    />
                )}
                {renderLegend()}
            </MapContainer>
        </div>
    );
};

export default Heatmap;
