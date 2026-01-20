import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import LineChart from "./LineChart";
const DistributionSelector = ({ distributions, getDataForDistribution, barangayData = {}, }) => {
    const [selectedDistribution, setSelectedDistribution] = useState(null);
    const [lineChartData, setLineChartData] = useState([]);
    useEffect(() => {
        // Check if the selectedDistribution is already set or the data hasn't changed
        if (selectedDistribution === null && distributions.length > 0) {
            const defaultDistribution = distributions.find((d) => d.name === "Commodity Distribution");
            if (defaultDistribution) {
                setSelectedDistribution(defaultDistribution);
                const data = getDataForDistribution(defaultDistribution.name, barangayData);
                setLineChartData(data);
            }
        }
    }, [
        distributions,
        barangayData,
        selectedDistribution,
        getDataForDistribution,
    ]);
    const handleDistributionChange = (event) => {
        const distributionName = event.target.value;
        const distribution = distributions.find((d) => d.name === distributionName);
        if (distribution && distribution !== selectedDistribution) {
            const data = getDataForDistribution(distributionName, barangayData);
            setLineChartData(data);
            setSelectedDistribution(distribution);
        }
    };
    return (_jsxs("div", { className: "w-full", children: [_jsxs("select", { onChange: handleDistributionChange, value: selectedDistribution?.name || "Commodity Distribution", className: "border-slate-300 rounded-lg", children: [_jsx("option", { value: "", disabled: true, children: "-- Select Distribution --" }), distributions.map((dist) => (_jsx("option", { value: dist.name, children: dist.name }, dist.name)))] }), selectedDistribution && (_jsxs(_Fragment, { children: [_jsx(LineChart, { data: lineChartData, width: 950, height: 400 }), _jsxs("div", { children: [_jsx("h4", { children: "Legend" }), _jsx("ul", { children: selectedDistribution.types.map((type) => (_jsx("li", { style: { color: type.color }, children: type.type }, type.type))) })] })] }))] }));
};
export default DistributionSelector;
