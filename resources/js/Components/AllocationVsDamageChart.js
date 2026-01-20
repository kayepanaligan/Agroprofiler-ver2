import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
const AllocationVsDamageChart = ({ data = [], }) => {
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);
    // Normalize data: scale allocation amount to percentage range for comparison
    // Find max allocation amount to scale it proportionally
    const maxAllocation = Math.max(...data.map(d => d.allocationAmount), 1);
    const maxDamagePercentage = Math.max(...data.map(d => d.damagePercentage), 1);
    const maxValue = Math.max(maxAllocation, maxDamagePercentage * 100); // Scale damage percentage to match allocation scale
    const chartData = data.map((item) => ({
        barangay: item.barangay,
        'Allocation Amount (₱)': item.allocationAmount,
        'Damage Percentage (%)': item.damagePercentage,
        totalFarms: item.totalFarms,
        damagedFarms: item.damagedFarms,
    }));
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const allocationAmount = data['Allocation Amount (₱)'];
            const damagePercentage = data['Damage Percentage (%)'];
            const totalFarms = data.totalFarms;
            const damagedFarms = data.damagedFarms;
            // Determine alignment status
            let alignmentStatus = '';
            let alignmentColor = '';
            if (damagePercentage > 50 && allocationAmount < maxAllocation * 0.3) {
                alignmentStatus = '⚠️ High damage but low allocation - Policy adjustment needed';
                alignmentColor = '#ef4444';
            }
            else if (damagePercentage < 30 && allocationAmount > maxAllocation * 0.7) {
                alignmentStatus = 'ℹ️ Low damage but high allocation - Review allocation strategy';
                alignmentColor = '#3b82f6';
            }
            else {
                alignmentStatus = '✓ Allocation aligns with damage level';
                alignmentColor = '#10b981';
            }
            return (_jsxs("div", { style: {
                    backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                    color: isDarkMode ? "white" : "black",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: isDarkMode
                        ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                        : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    minWidth: "250px",
                }, children: [_jsx("p", { style: {
                            margin: 0,
                            marginBottom: "8px",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }, children: data.barangay }), _jsxs("p", { style: { margin: 0, marginBottom: "4px", fontSize: "12px" }, children: [_jsx("strong", { children: "Allocation:" }), " \u20B1", allocationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }), _jsxs("p", { style: { margin: 0, marginBottom: "4px", fontSize: "12px" }, children: [_jsx("strong", { children: "Damage:" }), " ", damagePercentage, "% (", damagedFarms, " / ", totalFarms, " farms)"] }), _jsx("div", { style: { marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}` }, children: _jsx("p", { style: { margin: 0, fontSize: "11px", color: alignmentColor, fontWeight: "600" }, children: alignmentStatus }) })] }));
        }
        return null;
    };
    if (!data || data.length === 0) {
        return (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No data available" }));
    }
    return (_jsx("div", { className: "w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: 500, children: _jsxs(RechartsBarChart, { data: chartData, margin: { top: 20, right: 30, left: 20, bottom: 80 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: isDarkMode ? "#374151" : "#e5e7eb" }), _jsx(XAxis, { dataKey: "barangay", angle: -45, textAnchor: "end", height: 100, tick: {
                            fontSize: 11,
                            fill: isDarkMode ? "#9ca3af" : "#374151",
                        } }), _jsx(YAxis, { yAxisId: "left", orientation: "left", label: {
                            value: 'Allocation Amount (₱)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: isDarkMode ? '#9ca3af' : '#374151' }
                        }, tick: {
                            fontSize: 12,
                            fill: isDarkMode ? "#9ca3af" : "#374151",
                        } }), _jsx(YAxis, { yAxisId: "right", orientation: "right", label: {
                            value: 'Damage Percentage (%)',
                            angle: 90,
                            position: 'insideRight',
                            style: { textAnchor: 'middle', fill: isDarkMode ? '#9ca3af' : '#374151' }
                        }, tick: {
                            fontSize: 12,
                            fill: isDarkMode ? "#9ca3af" : "#374151",
                        }, domain: [0, 100] }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, { wrapperStyle: {
                            paddingTop: "20px",
                            fontSize: "12px",
                        } }), _jsx(Bar, { yAxisId: "left", dataKey: "Allocation Amount (\u20B1)", fill: "#3b82f6", name: "Allocation Amount (\u20B1)", radius: [10, 10, 0, 0] }), _jsx(Bar, { yAxisId: "right", dataKey: "Damage Percentage (%)", fill: "#ef4444", name: "Damage Percentage (%)", radius: [10, 10, 0, 0] })] }) }) }));
};
export default AllocationVsDamageChart;
