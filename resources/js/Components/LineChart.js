import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
const LineChart = ({ data, width, height }) => {
    const svgRef = useRef(null);
    const [tooltip, setTooltip] = useState(null);
    useEffect(() => {
        if (!data || !Array.isArray(data) || data.length === 0)
            return;
        const margin = { top: 40, right: 30, bottom: 100, left: 60 }; // Increased bottom margin for x-axis labels
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        const x = d3
            .scalePoint()
            .domain(data[0].data.map((d) => d.barangay))
            .range([0, width - margin.left - margin.right]);
        const yDomain = [
            0,
            d3.max(data, (line) => d3.max(line.data, (d) => d.value)),
        ];
        const y = d3
            .scaleLinear()
            .domain(yDomain)
            .range([height - margin.top - margin.bottom, 0]);
        const line = d3
            .line()
            .x((d) => x(d.barangay) || 0) // Ensure valid x position
            .y((d) => y(d.value))
            .curve(d3.curveMonotoneX);
        // Append the x-axis
        const xAxis = svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x));
        // Rotate the x-axis labels
        xAxis
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("text-anchor", "end") // Adjust the anchor point to the end
            .attr("dx", "-0.5em") // Adjust the horizontal position
            .attr("dy", "0.5em"); // Adjust the vertical position
        svg.append("g").call(d3.axisLeft(y));
        data.forEach((lineData) => {
            svg.append("path")
                .datum(lineData.data)
                .attr("fill", "none")
                .attr("stroke", lineData.color)
                .attr("stroke-width", 2)
                .attr("d", line);
            svg.selectAll(`.dot-${lineData.name}`)
                .data(lineData.data)
                .enter()
                .append("circle")
                .attr("cx", (d) => x(d.barangay) || 0) // Ensure valid x position
                .attr("cy", (d) => y(d.value))
                .attr("r", 4)
                .attr("fill", lineData.color)
                .on("mouseover", (event, d) => {
                setTooltip({
                    value: d.value,
                    type: lineData.name, // Set the type based on lineData
                    x: x(d.barangay) + margin.left,
                    y: y(d.value) + margin.top,
                });
            })
                .on("mouseout", () => {
                setTooltip(null);
            });
        });
        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };
    }, [data, width, height]);
    return (_jsxs("div", { style: { position: "relative" }, children: [_jsx("svg", { ref: svgRef }), tooltip && (_jsx("div", { style: {
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: "4px",
                    pointerEvents: "none",
                }, children: _jsxs("span", { className: "text-sm", children: [tooltip.type, " count: ", tooltip.value] }) }))] }));
};
export default LineChart;
