import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type BarangayData = {
    barangay: string;
    registered: number;
    unregistered: number;
};

type Props = {
    data: BarangayData[];
};

const SideBySideBarChart: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        // Dimensions and margins
        const width = 450;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const svgWidth = width + margin.left + margin.right;
        const svgHeight = height + margin.top + margin.bottom;

        // Clear previous svg content
        d3.select(svgRef.current).selectAll("*").remove();

        // Append SVG and set dimensions
        const svg = d3
            .select(svgRef.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X-axis and Y-axis scales
        const x0 = d3
            .scaleBand()
            .domain(data.map((d) => d.barangay))
            .range([0, width])
            .padding(0.2);

        const x1 = d3
            .scaleBand()
            .domain(["registered", "unregistered"])
            .range([0, x0.bandwidth()])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, (d) => Math.max(d.registered, d.unregistered))!,
            ])
            .nice()
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(x0);
        const yAxis = d3.axisLeft(y);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").attr("class", "y-axis").call(yAxis);

        // Bars
        const barangays = svg
            .selectAll(".barangay-group")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${x0(d.barangay)},0)`);

        barangays
            .selectAll("rect")
            .data((d) => [
                { key: "registered", value: d.registered },
                { key: "unregistered", value: d.unregistered },
            ])
            .enter()
            .append("rect")
            .attr("x", (d) => x1(d.key)!)
            .attr("y", (d) => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(d.value))
            .attr("fill", (d) =>
                d.key === "registered" ? "#4CAF50" : "#FF5722"
            );

        // Add legend
        const legend = svg
            .append("g")
            .attr("transform", `translate(${width - 100}, 0)`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "#4CAF50");

        legend
            .append("text")
            .attr("x", 30)
            .attr("y", 15)
            .text("Registered")
            .style("font-size", "14px");

        legend
            .append("rect")
            .attr("x", 0)
            .attr("y", 30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "#FF5722");

        legend
            .append("text")
            .attr("x", 30)
            .attr("y", 45)
            .text("Unregistered")
            .style("font-size", "14px");
    }, [data]);

    return <svg ref={svgRef} />;
};

export default SideBySideBarChart;
