import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";
const CommodityDonutChart = ({ commodityCategories, }) => {
    const donutData = commodityCategories.flatMap((category) => {
        return category.commodities.map((commodity) => ({
            name: commodity.name,
            value: commodity.count,
        }));
    });
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#FF5733",
        "#C70039",
        "#900C3F",
    ];
    return (_jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: donutData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 150, innerRadius: 100, labelLine: false, label: ({ name, value }) => `${name}: ${value}`, children: donutData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }));
};
export default CommodityDonutChart;
