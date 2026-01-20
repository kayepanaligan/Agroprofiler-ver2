import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";
const Heatmap = ({ heatmapData, commodityCategories, allocationType, }) => {
    const [geoData, setGeoData] = useState(null);
    const mapRef = useRef(null);
    const [view, setView] = useState("allocations");
    const [subtype, setSubtype] = useState("All");
    const [category, setCategory] = useState("All");
    const [allocations, setAllocations] = useState([]);
    const [farmers, setFarmers] = useState([
        "Registered",
        "Unregistered",
    ]);
    const [categories, setCategories] = useState({});
    useEffect(() => {
        const categoryMap = {};
        commodityCategories.forEach((category) => {
            categoryMap[category.name] = category.commodities.map((commodity) => commodity.name);
        });
        setCategories(categoryMap);
    }, [commodityCategories]);
    useEffect(() => {
        const allocationNames = allocationType.map((type) => type.name);
        setAllocations(allocationNames);
    }, [allocationType]);
    const distributions = {
        allocations: allocations,
        commodities: Object.keys(categories),
        farmers: farmers,
    };
    useEffect(() => {
        if (view === "allocations" && allocationType.length > 0) {
            setSubtype(allocationType[0]?.name);
        }
        else if (view === "commodities" && category === "All" && categories) {
            const firstCategory = Object.keys(categories)[0];
            setCategory(firstCategory || "All");
            if (firstCategory && categories[firstCategory]?.length > 0) {
                setSubtype(categories[firstCategory][0] || "All");
            }
        }
        else if (view === "farmers") {
            setSubtype("Registered");
        }
        else if (view === "crop_damage") {
            // No subtype selection needed
            setSubtype("All");
        }
    }, [view, category, allocationType, categories]);
    const handleChangeView = (e) => {
        setView(e.target.value);
        setSubtype("");
        setCategory("All");
    };
    const handleChangeSubtype = (e) => {
        setSubtype(e.target.value);
    };
    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
        setSubtype("");
    };
    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await axios.get("/Digos_City.geojson");
                setGeoData(response.data);
                console.log(geoData);
            }
            catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };
        fetchGeoData();
    }, []);
    const getColor = (barangayName) => {
        let percentage = 0;
        let count = 0;
        if (view === "allocations" && subtype !== "All") {
            const allocationTypeData = allocationType.find((type) => type.name === subtype);
            const totalAllocationTypeAmount = allocationTypeData
                ? parseFloat(allocationTypeData.amount)
                : 0;
            const allocationAmount = parseFloat(heatmapData[barangayName]?.allocations?.[subtype]?.amount || "0");
            if (totalAllocationTypeAmount > 0) {
                percentage =
                    totalAllocationTypeAmount > 0
                        ? (allocationAmount / totalAllocationTypeAmount) * 100
                        : 0;
            }
            else {
                percentage = 0;
            }
        }
        else if (view === "farmers") {
            const totalFarmers = heatmapData[barangayName]?.farmers?.Total || 0;
            const selectedFarmers = heatmapData[barangayName]?.farmers?.[subtype] || 0;
            percentage =
                totalFarmers > 0 ? (selectedFarmers / totalFarmers) * 100 : 0;
        }
        else if (view === "crop_damage") {
            percentage = heatmapData[barangayName]?.crop_damage?.percentage || 0;
        }
        else if (view === "commodities" &&
            category !== "All" &&
            subtype !== "All") {
            count =
                heatmapData[barangayName]?.commodities_categories?.[category]?.[subtype] || 0;
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
    const calculatePercentageIntensity = (barangayName) => {
        if (view === "commodities" && category !== "All" && subtype !== "All") {
            const barangayTotal = heatmapData[barangayName]?.commodities?.[category]?.[subtype] ||
                0;
            const overallTotal = Object.values(heatmapData)
                .map((data) => data.commodities?.[category]?.[subtype] || 0)
                .reduce((acc, val) => acc + val, 0);
            return overallTotal > 0 ? (barangayTotal / overallTotal) * 100 : 0;
        }
        return 0;
    };
    const style = (feature) => {
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
        }
        else if (view === "crop_damage") {
            legendTitle = "Crop Damage (% Damaged Farms)";
            high = "High (61–100%)";
            medium = "Medium (31–60%)";
            low = "Low (1–30%)";
        }
        else if (view === "commodities") {
            legendTitle = "Commodity Count";
            high = "High (>70)";
            medium = "Medium (30-70)";
            low = "Low (<30)";
        }
        const legendColors = view === "crop_damage"
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
        return (_jsx("div", { className: "legend-container dark:bg-[#0D1A25]", children: _jsxs("div", { className: "legend", children: [_jsx("h4", { className: "text-md dark:text-white", children: legendTitle }), _jsxs("ul", { children: [_jsxs("li", { className: "legend-item", style: { color: legendColors.high }, children: [_jsx("span", { className: "legend-icon", style: { backgroundColor: legendColors.high } }), " ", high] }), _jsxs("li", { className: "legend-item", style: { color: legendColors.medium }, children: [_jsx("span", { className: "legend-icon", style: { backgroundColor: legendColors.medium } }), " ", medium] }), _jsxs("li", { className: "legend-item", style: { color: legendColors.low }, children: [_jsx("span", { className: "legend-icon", style: { backgroundColor: legendColors.low } }), " ", low] })] })] }) }));
    };
    useEffect(() => {
        const allocationNames = allocationType.map((type) => type.name);
        setAllocations(allocationNames);
    }, [allocationType]);
    const onEachFeature = (feature, layer) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        if (!heatmapData[barangayName]) {
            return;
        }
        let tooltipContent = `<strong>${barangayName}</strong><br/>`;
        const getDamageLevel = (pct) => {
            if (pct >= 61)
                return "High";
            if (pct >= 31)
                return "Medium";
            if (pct >= 1)
                return "Low";
            return "Low";
        };
        if (view === "farmers") {
            const totalFarmers = heatmapData[barangayName]?.farmers?.Total || 0;
            const registeredFarmers = heatmapData[barangayName]?.farmers?.Registered || 0;
            const unregisteredFarmers = heatmapData[barangayName]?.farmers?.Unregistered || 0;
            const registeredPercentage = totalFarmers > 0
                ? ((registeredFarmers / totalFarmers) * 100).toFixed(2)
                : 0;
            const unregisteredPercentage = totalFarmers > 0
                ? ((unregisteredFarmers / totalFarmers) * 100).toFixed(2)
                : 0;
            tooltipContent += `
            All: ${totalFarmers} Farmers<br/>
            Registered: ${registeredPercentage}% (${registeredFarmers})<br/>
            Unregistered: ${unregisteredPercentage}% (${unregisteredFarmers})
        `;
        }
        else if (view === "allocations" && subtype !== "All") {
            let percentage = 0;
            const allocationTypeData = allocationType.find((type) => type.name === subtype);
            const allocationTypeIdentifier = allocationTypeData
                ? allocationTypeData.identifier.title
                : "";
            const totalAllocationTypeAmount = allocationTypeData
                ? parseFloat(allocationTypeData.amount)
                : 0;
            const allocationAmount = parseFloat(heatmapData[barangayName]?.allocations?.[subtype]?.amount || "0");
            if (totalAllocationTypeAmount > 0) {
                percentage =
                    totalAllocationTypeAmount > 0
                        ? (allocationAmount / totalAllocationTypeAmount) * 100
                        : 0;
            }
            else {
                percentage = 0;
            }
            tooltipContent += `
        Allocation Type: ${subtype}<br/>
        Total Allocation: ${totalAllocationTypeAmount}<br/>
        ${barangayName} received ${percentage}% (${allocationAmount}) ${allocationTypeIdentifier}
        of ${subtype} (${totalAllocationTypeAmount}) ${allocationTypeIdentifier}
    `;
        }
        else if (view === "commodities" &&
            category !== "All" &&
            subtype !== "All") {
            const commodityCount = heatmapData[barangayName]?.commodities_categories?.[category]?.[subtype] || 0;
            tooltipContent += `${category} ${subtype}: ${commodityCount} farms`;
        }
        else if (view === "crop_damage") {
            const pct = heatmapData[barangayName]?.crop_damage?.percentage ?? 0;
            const damaged = heatmapData[barangayName]?.crop_damage?.damagedFarms ?? 0;
            const total = heatmapData[barangayName]?.crop_damage?.totalFarms ?? 0;
            tooltipContent += `
                Damage Level: ${getDamageLevel(pct)} (${pct}%)<br/>
                Damaged Farms: ${damaged} / ${total}
            `;
        }
        layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: "top",
        });
        // Click popup (especially for crop damage view)
        layer.on("click", () => {
            if (view !== "crop_damage")
                return;
            const crop = heatmapData[barangayName]?.crop_damage ?? {};
            const pct = crop.percentage ?? 0;
            const damaged = crop.damagedFarms ?? 0;
            const total = crop.totalFarms ?? 0;
            const sevHigh = crop.severity?.high ?? 0;
            const sevMed = crop.severity?.medium ?? 0;
            const sevLow = crop.severity?.low ?? 0;
            const topCommodity = crop.topCommodity ?? "N/A";
            const topCause = crop.topCause ?? "N/A";
            const popupContent = `
                <div style="min-width: 240px;">
                    <div><strong>Barangay:</strong> ${barangayName}</div>
                    <div style="margin-top: 6px;"><strong>Damage Level:</strong> ${getDamageLevel(pct)} (${pct}%)</div>
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
    return (_jsxs("div", { className: "heatmap-container", children: [_jsxs("div", { className: "select-container mb-10 grid lg:grid-flow-row lg:grid-rows-2 md:grid-flow-col md:grid-cols-3 gap-4", children: [_jsxs("select", { value: view, onChange: handleChangeView, className: "border-slate-400 dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] rounded-xl cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "allocations", className: "dark:text-white", children: "Allocations" }), _jsx("option", { value: "commodities", className: "dark:text-white", children: "Commodities" }), _jsx("option", { value: "farmers", className: "dark:text-white", children: "Farmers" }), _jsx("option", { value: "crop_damage", className: "dark:text-white", children: "Crop Damage" })] }), view !== "commodities" && view !== "crop_damage" && (_jsxs("select", { id: "subtype-select", onChange: handleChangeSubtype, value: subtype, className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "All", className: "dark:text-white", children: "Select category" }), distributions[view]?.map((dist) => (_jsx("option", { value: dist, className: "dark:text-white", children: dist }, dist)))] })), view === "commodities" && (_jsxs(_Fragment, { children: [_jsxs("select", { value: category, onChange: handleChangeCategory, className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "All", className: "dark:text-white", children: "Select category" }), Object.keys(categories).map((categoryName) => (_jsx("option", { value: categoryName, className: "capitalize dark:text-white", children: categoryName }, categoryName)))] }), category !== "All" && (_jsxs("select", { value: subtype, onChange: handleChangeSubtype, className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "All", className: "dark:text-white", children: "Select Commodity" }), categories[category]?.map((commodityName) => (_jsx("option", { value: commodityName, className: "capitalize dark:text-white", children: commodityName }, commodityName)))] }))] }))] }), _jsxs(MapContainer, { ref: mapRef, center: [6.78, 125.35], scrollWheelZoom: true, zoom: 10.5, style: {
                    width: "100%",
                    height: "500px",
                    zIndex: "10",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                }, className: "dark:bg-black", children: [geoData && (_jsx(GeoJSON, { data: geoData, style: style, onEachFeature: onEachFeature }, view + subtype)), renderLegend()] })] }));
};
export default Heatmap;
