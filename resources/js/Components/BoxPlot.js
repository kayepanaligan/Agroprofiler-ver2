import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
const BoxPlot = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const chartRef = useRef(null);
    const tooltipRef = useRef(null);
    useEffect(() => {
        if (!data || !data.length)
            return;
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        const margin = { top: 30, right: 40, bottom: 40, left: 50 };
        const width = 1000 - margin.left - margin.right;
        const height = 470 - margin.top - margin.bottom;
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.barangay))
            .range([0, width])
            .padding(0.2);
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data.flatMap((d) => d.value)) || 0])
            .nice()
            .range([height, 0]);
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        // Add gridlines
        g.append("g")
            .attr("class", "grid")
            .call(d3
            .axisLeft(yScale)
            .tickSize(-width)
            .tickFormat(() => ""))
            .selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "2,2");
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");
        g.append("g").call(d3.axisLeft(yScale));
        const tooltip = d3.select(tooltipRef.current);
        g.selectAll(".box")
            .data(data)
            .join("g")
            .attr("transform", (d) => `translate(${xScale(d.barangay)}, 0)`)
            .each(function (d) {
            const q1 = d3.quantile(d.value, 0.25) ?? 0;
            const median = d3.quantile(d.value, 0.5) ?? 0;
            const q3 = d3.quantile(d.value, 0.75) ?? 0;
            const iqr = q3 - q1;
            const min = Math.max(d3.min(d.value) ?? 0, q1 - 1.5 * iqr);
            const max = Math.min(d3.max(d.value) ?? 0, q3 + 1.5 * iqr);
            const mean = d3.mean(d.value) ?? 0;
            const group = d3.select(this);
            // Box
            group
                .append("rect")
                .attr("x", 0)
                .attr("width", xScale.bandwidth())
                .attr("y", yScale(q3))
                .attr("height", yScale(q1) - yScale(q3))
                .attr("fill", "#65a30d")
                .on("mouseover", (event) => {
                tooltip
                    .style("display", "block")
                    .html(`<strong>${d.barangay}</strong><br>Mean: ${mean.toFixed(2)}<br>Range: ${min} - ${max}<br>Spread: ${iqr.toFixed(2)}`);
            })
                .on("mousemove", (event) => {
                const tooltipWidth = tooltip.node()?.getBoundingClientRect().width || 0;
                const tooltipHeight = tooltip.node()?.getBoundingClientRect().height || 0;
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - tooltipHeight - 50}px`)
                    .style("transform", "translate(0, 0)"); // Add transform if needed
            })
                .on("mouseout", () => {
                tooltip.style("display", "none");
            });
            // Median Line
            group
                .append("line")
                .attr("x1", 0)
                .attr("x2", xScale.bandwidth())
                .attr("y1", yScale(median))
                .attr("y2", yScale(median))
                .attr("stroke", "black");
            // Whisker Lines
            group
                .append("line")
                .attr("x1", xScale.bandwidth() / 2)
                .attr("x2", xScale.bandwidth() / 2)
                .attr("y1", yScale(max))
                .attr("y2", yScale(q3))
                .attr("stroke", "black");
            group
                .append("line")
                .attr("x1", xScale.bandwidth() / 2)
                .attr("x2", xScale.bandwidth() / 2)
                .attr("y1", yScale(min))
                .attr("y2", yScale(q1))
                .attr("stroke", "black");
            // Small horizontal lines at max and min
            group
                .append("line")
                .attr("x1", xScale.bandwidth() / 4)
                .attr("x2", (xScale.bandwidth() / 4) * 3)
                .attr("y1", yScale(max))
                .attr("y2", yScale(max))
                .attr("stroke", "black");
            group
                .append("line")
                .attr("x1", xScale.bandwidth() / 4)
                .attr("x2", (xScale.bandwidth() / 4) * 3)
                .attr("y1", yScale(min))
                .attr("y2", yScale(min))
                .attr("stroke", "black");
        });
        setIsLoading(false); // Data has finished loading
    }, [data]);
    return (_jsxs("div", { style: { position: "relative", width: "1200px", height: "500px" }, children: [isLoading ? (_jsx("div", { style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 100,
                }, children: _jsx("div", { className: "spinner", style: { textAlign: "center" }, children: _jsx("div", { className: "spinner-border", style: { width: "3rem", height: "3rem" }, role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }) }) })) : (_jsx("svg", { ref: chartRef, width: 1200, height: 500 })), _jsx("div", { ref: tooltipRef, style: {
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    padding: "5px",
                    borderRadius: "3px",
                    display: "none",
                    pointerEvents: "none",
                    zIndex: 50, // Ensure it is above the chart
                    width: "auto", // Optional to handle dynamic tooltip width
                } })] }));
};
export default BoxPlot;
