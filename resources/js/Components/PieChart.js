import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, } from "recharts";
const DEFAULT_COLORS = [
    "#6EC207",
    "#FFEB00",
    "#074799",
    "#009990",
    "#3674B5",
    "#D84040",
    "#3D8D7A",
    "#EB5B00",
    "#66D2CE",
    "#FFB22C",
    "#B9B28A",
    "#66D2CE",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4567",
    "#A28CF3",
];
const PieChart = ({ data = [], colors = DEFAULT_COLORS, }) => {
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { style: {
                    backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                    color: isDarkMode ? "white" : "black",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: isDarkMode
                        ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                        : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }, children: [_jsx("p", { style: {
                            margin: 0,
                            fontWeight: "semi-bold",
                            fontSize: "14px",
                        }, children: payload[0].name }), _jsxs("p", { style: { margin: 0, fontSize: "12px" }, children: ["Value: ", payload[0].value] })] }));
        }
        return null;
    };
    return (_jsx("div", { style: {
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "5px",
            flex: "wrap",
            marginBottom: "10px",
        }, className: "overflow-auto", children: _jsx(ResponsiveContainer, { width: "100%", height: 500, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: data, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 150, label: ({ x, y, cx, cy, midAngle, name, index, outerRadius, }) => {
                            const words = name.split(" ");
                            const RADIAN = Math.PI / 180;
                            const sin = Math.sin(-midAngle * RADIAN);
                            const cos = Math.cos(-midAngle * RADIAN);
                            const radius = (outerRadius ?? 150) + 50;
                            const labelX = cx + radius * cos;
                            const labelY = cy + radius * sin;
                            return (_jsxs("g", { children: [_jsx("line", { x1: cx + (outerRadius ?? 150) * cos, y1: cy + (outerRadius ?? 150) * sin, x2: labelX, y2: labelY, stroke: "#878787", strokeWidth: 2 }), _jsx("g", { transform: `translate(${labelX}, ${labelY})`, children: words.map((word, i) => (_jsx("text", { x: 0, y: i * 14, textAnchor: cos >= 0
                                                ? "start"
                                                : "end", fontSize: "14px", fontWeight: "bold", fill: colors[index %
                                                colors.length], children: word }, i))) })] }));
                        }, labelLine: (props) => {
                            const { cx, cy, midAngle, outerRadius } = props;
                            const RADIAN = Math.PI / 180;
                            const sin = Math.sin(-midAngle * RADIAN);
                            const cos = Math.cos(-midAngle * RADIAN);
                            const radius = (outerRadius ?? 150) + 20;
                            return (_jsx("line", { x1: cx + (outerRadius ?? 150) * cos, y1: cy + (outerRadius ?? 150) * sin, x2: cx + radius * cos, y2: cy + radius * sin, stroke: "#878787", strokeWidth: 2 }));
                        }, children: data.map((entry, index) => (_jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, { wrapperStyle: {
                            height: 50,
                            marginTop: 200,
                            padding: 10,
                            textTransform: "capitalize",
                            fontSize: "12px",
                            borderRadius: "20px",
                        } })] }) }) }));
};
export default PieChart;
