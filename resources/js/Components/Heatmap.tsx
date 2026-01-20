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
    identifier: {
        id: number;
        title: string;
    };
}

interface CropDamageCause {
    id: number;
    name: string;
    desc?: string;
}

interface HeatmapProps {
    heatmapData: Record<string, any>;
    commodityCategories: CommodityCategory[];
    allocationType: AllocationType[];
    cropDamageCauses?: CropDamageCause[];
}

const Heatmap: React.FC<HeatmapProps> = ({
    heatmapData,
    commodityCategories,
    allocationType,
    cropDamageCauses = [],
}: HeatmapProps) => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<any>(null);
    const [view, setView] = useState("allocations");
    const [subtype, setSubtype] = useState("All");
    const [category, setCategory] = useState("All");
    const [cropDamageCause, setCropDamageCause] = useState("All");
    const [allocations, setAllocations] = useState<string[]>([]);

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
        setAllocations(allocationNames);
    }, [allocationType]);

    const distributions: Record<string, string[]> = {
        allocations: allocations,
        commodities: Object.keys(categories),
        farmers: farmers,
    };

    useEffect(() => {
        if (view === "allocations" && allocationType.length > 0) {
            setSubtype(allocationType[0]?.name);
        } else if (view === "commodities" && category === "All" && categories) {
            const firstCategory = Object.keys(categories)[0];
            setCategory(firstCategory || "All");

            if (firstCategory && categories[firstCategory]?.length > 0) {
                setSubtype(categories[firstCategory][0] || "All");
            }
        } else if (view === "farmers") {
            setSubtype("Registered");
        } else if (view === "crop_damage") {
            // No subtype selection needed
            setSubtype("All");
            setCropDamageCause("All");
        }
    }, [view, category, allocationType, categories]);

    const handleChangeView = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setView(e.target.value);
        setSubtype("");
        setCategory("All");
    };

    const handleChangeSubtype = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubtype(e.target.value);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubtype("");
    };

    const handleChangeCropDamageCause = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCropDamageCause(e.target.value);
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
                    totalAllocationTypeAmount > 0
                        ? (allocationAmount / totalAllocationTypeAmount) * 100
                        : 0;
            } else {
                percentage = 0;
            }
        } else if (view === "farmers") {
            const totalFarmers = heatmapData[barangayName]?.farmers?.Total || 0;
            const selectedFarmers =
                heatmapData[barangayName]?.farmers?.[subtype] || 0;
            percentage =
                totalFarmers > 0 ? (selectedFarmers / totalFarmers) * 100 : 0;
        } else if (view === "crop_damage") {
            // Filter by crop damage cause if selected
            const cropDamageData = heatmapData[barangayName]?.crop_damage || {};
            if (cropDamageCause !== "All") {
                // Get filtered data by cause
                const causeData = cropDamageData.causes?.[cropDamageCause] || {};
                percentage = causeData.percentage || 0;
            } else {
                percentage = cropDamageData.percentage || 0;
            }
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
        }

        if (view === "crop_damage") {
            // Crop damage % ranges:
            // Low: 1–30 (Light Yellow), Medium: 31–60 (Orange), High: 61–100 (Red)
            // Treat 0% as low color.
            return percentage >= 61
                ? "#ef4444" // red
                : percentage >= 31
                ? "#f97316" // orange
                : "#fef08a"; // light yellow
        }

        return percentage > 40
            ? "#0ba60a"
            : percentage >= 20
            ? "#ecdd09"
            : "#ec1809";
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
        } else if (view === "crop_damage") {
            legendTitle = "Crop Damage (% Damaged Farms)";
            high = "High (61–100%)";
            medium = "Medium (31–60%)";
            low = "Low (1–30%)";
        } else if (view === "commodities") {
            legendTitle = "Commodity Count";
            high = "High (>70)";
            medium = "Medium (30-70)";
            low = "Low (<30)";
        }

        const legendColors =
            view === "crop_damage"
                ? {
                      high: "#ef4444",
                      medium: "#f97316",
                      low: "#fef08a",
                  }
                : {
                      high: "#0ba60a",
                      medium: "#ecdd09",
                      low: "#ec1809",
                  };

        return (
            <div className="legend-container dark:bg-[#0D1A25]">
                <div className="legend">
                    <h4 className="text-md dark:text-white">{legendTitle}</h4>
                    <ul>
                        <li
                            className="legend-item"
                            style={{ color: legendColors.high }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: legendColors.high }}
                            ></span>{" "}
                            {high}
                        </li>
                        <li
                            className="legend-item"
                            style={{ color: legendColors.medium }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: legendColors.medium }}
                            ></span>{" "}
                            {medium}
                        </li>
                        <li
                            className="legend-item"
                            style={{ color: legendColors.low }}
                        >
                            <span
                                className="legend-icon"
                                style={{ backgroundColor: legendColors.low }}
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
        setAllocations(allocationNames);
    }, [allocationType]);

    const onEachFeature = (feature: any, layer: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");

        if (!heatmapData[barangayName]) {
            return;
        }

        let tooltipContent = `<strong>${barangayName}</strong><br/>`;

        const getDamageLevel = (pct: number) => {
            if (pct >= 61) return "High";
            if (pct >= 31) return "Medium";
            if (pct >= 1) return "Low";
            return "Low";
        };

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
            let percentage = 0;
            const allocationTypeData = allocationType.find(
                (type) => type.name === subtype
            );

            const allocationTypeIdentifier = allocationTypeData
                ? allocationTypeData.identifier.title
                : "";

            const totalAllocationTypeAmount = allocationTypeData
                ? parseFloat(allocationTypeData.amount)
                : 0;

            const allocationAmount = parseFloat(
                heatmapData[barangayName]?.allocations?.[subtype]?.amount || "0"
            );

            if (totalAllocationTypeAmount > 0) {
                percentage =
                    totalAllocationTypeAmount > 0
                        ? (allocationAmount / totalAllocationTypeAmount) * 100
                        : 0;
            } else {
                percentage = 0;
            }

            tooltipContent += `
        Allocation Type: ${subtype}<br/>
        Total Allocation: ${totalAllocationTypeAmount}<br/>
        ${barangayName} received ${percentage}% (${allocationAmount}) ${allocationTypeIdentifier}
        of ${subtype} (${totalAllocationTypeAmount}) ${allocationTypeIdentifier}
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
        } else if (view === "crop_damage") {
            const cropDamageData = heatmapData[barangayName]?.crop_damage || {};
            let pct, damaged, total, sevHigh, sevMed, sevLow, topCommodity, topCause;
            
            if (cropDamageCause !== "All") {
                const causeData = cropDamageData.causes?.[cropDamageCause] || {};
                pct = causeData.percentage ?? 0;
                damaged = causeData.damagedFarms ?? 0;
                total = causeData.totalFarms ?? cropDamageData.totalFarms ?? 0;
                sevHigh = causeData.severity?.high ?? 0;
                sevMed = causeData.severity?.medium ?? 0;
                sevLow = causeData.severity?.low ?? 0;
                topCommodity = causeData.topCommodity ?? cropDamageData.topCommodity ?? "N/A";
                topCause = cropDamageCauses.find(c => c.name === cropDamageCause)?.name ?? cropDamageData.topCause ?? "N/A";
            } else {
                pct = cropDamageData.percentage ?? 0;
                damaged = cropDamageData.damagedFarms ?? 0;
                total = cropDamageData.totalFarms ?? 0;
                sevHigh = cropDamageData.severity?.high ?? 0;
                sevMed = cropDamageData.severity?.medium ?? 0;
                sevLow = cropDamageData.severity?.low ?? 0;
                topCommodity = cropDamageData.topCommodity ?? "N/A";
                topCause = cropDamageData.topCause ?? "N/A";
            }

            tooltipContent += `
                <div style="min-width: 240px;">
                    <div><strong>Barangay:</strong> ${barangayName}</div>
                    <div style="margin-top: 6px;"><strong>Damage Level:</strong> ${getDamageLevel(pct)} (${pct.toFixed(1)}%)</div>
                    <div><strong>Damaged Farms:</strong> ${damaged} / ${total}</div>
                    <div style="margin-top: 10px;"><strong>Severity Breakdown:</strong></div>
                    <div style="margin-left: 10px;">
                        • High Intensity: ${sevHigh} farms<br/>
                        • Medium Intensity: ${sevMed} farms<br/>
                        • Low Intensity: ${sevLow} farms
                    </div>
                    <div style="margin-top: 10px;"><strong>Top Damaged Commodity:</strong> ${topCommodity}</div>
                    <div><strong>Top Cause:</strong> ${topCause}</div>
                </div>
            `;
        }

        layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: "top",
        });

        // Click popup (especially for crop damage view)
        layer.on("click", () => {
            if (view !== "crop_damage") return;

            const cropDamageData = heatmapData[barangayName]?.crop_damage || {};
            let pct, damaged, total, sevHigh, sevMed, sevLow, topCommodity, topCause;
            
            if (cropDamageCause !== "All") {
                const causeData = cropDamageData.causes?.[cropDamageCause] || {};
                pct = causeData.percentage ?? 0;
                damaged = causeData.damagedFarms ?? 0;
                total = causeData.totalFarms ?? cropDamageData.totalFarms ?? 0;
                sevHigh = causeData.severity?.high ?? 0;
                sevMed = causeData.severity?.medium ?? 0;
                sevLow = causeData.severity?.low ?? 0;
                topCommodity = causeData.topCommodity ?? cropDamageData.topCommodity ?? "N/A";
                topCause = cropDamageCauses.find(c => c.name === cropDamageCause)?.name ?? cropDamageData.topCause ?? "N/A";
            } else {
                pct = cropDamageData.percentage ?? 0;
                damaged = cropDamageData.damagedFarms ?? 0;
                total = cropDamageData.totalFarms ?? 0;
                sevHigh = cropDamageData.severity?.high ?? 0;
                sevMed = cropDamageData.severity?.medium ?? 0;
                sevLow = cropDamageData.severity?.low ?? 0;
                topCommodity = cropDamageData.topCommodity ?? "N/A";
                topCause = cropDamageData.topCause ?? "N/A";
            }

            const popupContent = `
                <div style="min-width: 240px;">
                    <div><strong>Barangay:</strong> ${barangayName}</div>
                    <div style="margin-top: 6px;"><strong>Damage Level:</strong> ${getDamageLevel(pct)} (${pct.toFixed(1)}%)</div>
                    <div><strong>Damaged Farms:</strong> ${damaged} / ${total}</div>
                    <div style="margin-top: 10px;"><strong>Severity Breakdown:</strong></div>
                    <div style="margin-left: 10px;">
                        • High Intensity: ${sevHigh} farms<br/>
                        • Medium Intensity: ${sevMed} farms<br/>
                        • Low Intensity: ${sevLow} farms
                    </div>
                    <div style="margin-top: 10px;"><strong>Top Damaged Commodity:</strong> ${topCommodity}</div>
                    <div><strong>Top Cause:</strong> ${topCause}</div>
                </div>
            `;

            layer.bindPopup(popupContent, { closeButton: true }).openPopup();
        });
    };

    return (
        <div className="heatmap-container">
            <div className="select-container mb-10 grid lg:grid-flow-row lg:grid-rows-2 md:grid-flow-col md:grid-cols-3 gap-4">
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
                    <option value="crop_damage" className="dark:text-white">
                        Crop Damage
                    </option>
                </select>

                {view !== "commodities" && view !== "crop_damage" && (
                    <select
                        id="subtype-select"
                        onChange={handleChangeSubtype}
                        value={subtype}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All" className="dark:text-white">
                            Select category
                        </option>
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
                )}

                {view === "crop_damage" && (
                    <select
                        id="crop-damage-cause-select"
                        onChange={handleChangeCropDamageCause}
                        value={cropDamageCause}
                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                    >
                        <option value="All" className="dark:text-white">
                            All Causes
                        </option>
                        {cropDamageCauses.map((cause) => (
                            <option
                                key={cause.id}
                                value={cause.name}
                                className="dark:text-white"
                            >
                                {cause.name}
                            </option>
                        ))}
                    </select>
                )}

                {view === "commodities" && (
                    <>
                        <select
                            value={category}
                            onChange={handleChangeCategory}
                            className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                        >
                            <option value="All" className="dark:text-white">
                                Select category
                            </option>
                            {Object.keys(categories).map((categoryName) => (
                                <option
                                    key={categoryName}
                                    value={categoryName}
                                    className="capitalize dark:text-white"
                                >
                                    {categoryName}
                                </option>
                            ))}
                        </select>

                        {category !== "All" && (
                            <select
                                value={subtype}
                                onChange={handleChangeSubtype}
                                className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                            >
                                <option value="All" className="dark:text-white">
                                    Select Commodity
                                </option>
                                {categories[category]?.map(
                                    (commodityName: string) => (
                                        <option
                                            key={commodityName}
                                            value={commodityName}
                                            className="capitalize dark:text-white"
                                        >
                                            {commodityName}
                                        </option>
                                    )
                                )}
                            </select>
                        )}
                    </>
                )}
            </div>
            <MapContainer
                ref={mapRef}
                center={[6.78, 125.35]}
                scrollWheelZoom={true}
                zoom={10.5}
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
                        key={view + subtype + cropDamageCause}
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
