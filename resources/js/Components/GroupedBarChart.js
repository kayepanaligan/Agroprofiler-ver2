import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
const GroupedBarChart = ({ data, distributionType, }) => {
    if (!data || Object.keys(data).length === 0) {
        console.warn("GroupedBarChart: Data is empty or invalid", data);
        return _jsx("div", { children: "No data available" });
    }
    const chartData = Object.keys(data).map((barangay) => {
        const entry = data[barangay] ?? {};
        const rowData = { name: barangay };
        const commodityCategory = distributionType.startsWith("commodity_categories_")
            ? distributionType.replace("commodity_categories_", "")
            : null;
        if (distributionType === "allocations" && entry.allocations) {
            Object.entries(entry.allocations).forEach(([allocationType, details]) => {
                rowData[allocationType] = details.count || 0;
            });
        }
        if (commodityCategory &&
            entry.commodities_categories?.[commodityCategory]) {
            Object.entries(entry.commodities_categories[commodityCategory]).forEach(([commodity, count]) => {
                // Handle both old format (number) and new format (object)
                if (typeof count === 'object' && count !== null && 'count' in count) {
                    rowData[commodity] = count.count || 0;
                }
                else {
                    rowData[commodity] = typeof count === 'number' ? count : 0;
                }
            });
        }
        if (distributionType === "farmers" && entry.farmers) {
            rowData["Registered Farmers"] = entry.farmers["Registered"] || 0;
            rowData["Unregistered Farmers"] =
                entry.farmers["Unregistered"] || 0;
        }
        console.log(`Processed rowData for ${barangay}:`, rowData);
        return rowData;
    });
    console.log("Final chartData:", chartData);
    const barKeys = Array.from(new Set(chartData.flatMap((item) => Object.keys(item)))).filter((key) => key !== "name");
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);
    return (_jsx("div", { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(ComposedChart, { data: chartData, children: [_jsx(CartesianGrid, { stroke: "#f5f5f5" }), _jsx(XAxis, { dataKey: "name", angle: -45, textAnchor: "end", interval: 0, height: 60, tick: {
                            fontSize: 10,
                            fill: isDarkMode ? "white" : "black",
                        } }), _jsx(Legend, { wrapperStyle: {
                            height: 50,
                            marginTop: 20,
                            padding: 10,
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontSize: "12px",
                        } }), _jsx(YAxis, { tick: {
                            fontSize: 14,
                            fill: isDarkMode ? "white" : "black",
                        } }), _jsx(Tooltip, { wrapperStyle: {
                            height: "auto",
                            padding: 10,
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontSize: "12px",
                            borderColor: "none",
                        }, contentStyle: {
                            backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                            color: isDarkMode ? "white" : "black",
                            borderRadius: "10px",
                            border: "none",
                            padding: "10px",
                            boxShadow: isDarkMode
                                ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                                : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        } }), barKeys.map((key) => (_jsx(Bar, { dataKey: key, barSize: 10, fill: generateRandomColor(), radius: [20, 20, 0, 0] }, key)))] }) }) }));
};
export default GroupedBarChart;
