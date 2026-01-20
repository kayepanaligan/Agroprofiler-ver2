import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, } from "recharts";
const AnotherBarChart = ({ data = [] }) => {
    // Define an array of colors for bars
    const barColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
    ];
    return (_jsx("div", { style: {
            width: "100%",
            maxWidth: "750px",
            margin: "0 auto",
            padding: "10px",
            borderRadius: "20px",
        }, children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(RechartsBarChart, { data: data, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 14 } }), _jsx(YAxis, { tick: { fontSize: 14 } }), _jsx(Tooltip, { contentStyle: {
                            backgroundColor: "lightsteelblue",
                            borderRadius: "15px",
                            fontSize: "12px",
                        }, formatter: (value) => `${value}` }), _jsx(Legend, { wrapperStyle: { fontSize: "14px" } }), data.map((entry, index) => (_jsx(Bar, { dataKey: "value", fill: barColors[index % barColors.length], radius: [20, 20, 20, 20], barSize: 30 }, index)))] }) }) }));
};
export default AnotherBarChart;
