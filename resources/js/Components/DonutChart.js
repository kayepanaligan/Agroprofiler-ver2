import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";
const DonutChart = ({ data, colors = ["#3B82F6", "#6366F1"], title, }) => {
    return (_jsxs("div", { className: "w-full h-[330px] p-4 border rounded-lg shadow-lg bg-white", children: [title && (_jsx("h2", { className: "text-center text-lg font-semibold mb-2", children: title })), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, fill: "#8884d8", paddingAngle: 5, dataKey: "value", label: ({ name }) => name, children: data.map((entry, index) => (_jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, { wrapperStyle: {
                                height: 70,
                                marginTop: 200,
                                padding: 10,
                                textTransform: "capitalize",
                            } })] }) })] }));
};
export default DonutChart;
