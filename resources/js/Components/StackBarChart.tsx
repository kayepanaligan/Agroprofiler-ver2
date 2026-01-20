import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface CommodityData {
    category: string;
    [key: string]: number | string; // Dynamic commodity names with their values
}

interface StackedBarChartProps {
    data: CommodityData[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const colors = d3.schemeCategory10;

    useEffect(() => {
        if (!data || !svgRef.current) return;

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current);
        const margin = { top: 40, right: 200, bottom: 40, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const categories = data.map((d) => d.category);
        const keys = Object.keys(data[0]).filter((key) => key !== "category");

        const x = d3
            .scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.3);
        const y = d3.scaleLinear().range([height, 0]);
        const color = d3.scaleOrdinal<string>().domain(keys).range(colors);

        // Stacked data
        const stackedData = d3.stack<CommodityData>().keys(keys)(data);

        // Set y-axis domain
        y.domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1])) ?? 0]);

        const svgContent = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X Axis
        svgContent
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y Axis
        svgContent.append("g").call(d3.axisLeft(y));

        // Tooltip
        const tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#f9f9f9")
            .style("border", "1px solid #ccc")
            .style("padding", "10px")
            .style("display", "none");

        // Bars
        const bars = svgContent
            .selectAll(".layer")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => color(d.key))
            .attr("class", "layer");

        bars.selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.category) ?? 0)
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => {
                tooltip
                    .style("display", "block")
                    .html(
                        `Category: ${d.data.category}<br>Value: ${d[1] - d[0]}`
                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 20 + "px");
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 20 + "px");
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            });

        // Interactive Legend
        const legend = svgContent
            .selectAll(".legend")
            .data(keys)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${width + 20}, ${i * 25})`)
            .attr("class", "legend");

        legend
            .append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", (d) => color(d))
            .on("click", function (event, key) {
                // Toggle visibility of bars
                const active = d3.select(this).classed("hidden");
                d3.select(this).classed("hidden", !active);
                d3.selectAll(`.layer rect[fill="${color(key)}"]`).style(
                    "display",
                    active ? "block" : "none"
                );
            });

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .text((d) => d);
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default StackedBarChart;
