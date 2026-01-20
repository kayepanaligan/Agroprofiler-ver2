import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
const Histogram = ({ data, title, color = "#F59E0B", }) => {
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);
    return (_jsxs("div", { className: "w-full h-[20rem] sm:h-[25rem] p-3 sm:p-4 border rounded-lg shadow-lg bg-white dark:bg-[#161616] dark:border-gray-700", children: [title && (_jsx("h2", { className: "text-center text-base sm:text-lg font-semibold mb-2 dark:text-white", children: title })), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 10, right: 10, left: -20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: isDarkMode ? "#374151" : "#e5e7eb" }), _jsx(XAxis, { dataKey: "ageRange", stroke: isDarkMode ? "#9ca3af" : "#374151", tick: { fill: isDarkMode ? "#9ca3af" : "#374151" } }), _jsx(YAxis, { stroke: isDarkMode ? "#9ca3af" : "#374151", tick: { fill: isDarkMode ? "#9ca3af" : "#374151" } }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                                color: isDarkMode ? "white" : "black",
                                border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                            } }), _jsx(Bar, { dataKey: "count", fill: color })] }) })] }));
};
export default Histogram;
