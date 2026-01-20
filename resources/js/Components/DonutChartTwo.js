import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, LabelList, ResponsiveContainer, Legend, } from "recharts";
const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
const DonutChartTwo = ({ data, allocationTypes, demographics, sourcesOfFund, colors, }) => {
    const innerData = allocationTypes.map((allocationType) => ({
        name: allocationType,
        value: data
            .filter((item) => item.allocationType === allocationType)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));
    const outerData = demographics.map((demographic) => ({
        name: demographic,
        value: data
            .filter((item) => item.demographic === demographic)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));
    const superOuterData = sourcesOfFund.map((source) => ({
        name: source,
        value: data
            .filter((item) => item.sourceOfFund === source)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));
    const renderPie = (data, innerRadius, outerRadius, isInnerRing = false) => {
        const dynamicColors = data.map(() => generateRandomColor());
        return (_jsxs(Pie, { data: data, dataKey: "value", innerRadius: innerRadius, outerRadius: outerRadius, paddingAngle: 5, labelLine: false, label: ({ name }) => name, children: [data.map((entry, index) => (_jsx(Cell, { fill: dynamicColors[index] }, `cell-${index}`))), isInnerRing && (_jsx(LabelList, { dataKey: "name", position: "outside", fill: "#000" }))] }));
    };
    return (_jsx("div", { className: "w-full h-[30rem] p-4 border rounded-lg shadow-lg bg-white", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [renderPie(innerData, 70, 90, true), " ", renderPie(outerData, 90, 110), renderPie(superOuterData, 110, 130), " ", _jsx(Legend, {})] }) }) }));
};
export default DonutChartTwo;
