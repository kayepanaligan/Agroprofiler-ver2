import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type AgeData = {
    age: number;
};

type Props = {
    data: AgeData[];
};

const AgeHistogram: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        // Set up dimensions and margins
        const width = 400;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const svgWidth = width + margin.left + margin.right;
        const svgHeight = height + margin.top + margin.bottom;

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Append SVG and set dimensions
        const svg = d3
            .select(svgRef.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Prepare histogram data
        const bins = d3
            .histogram<AgeData, number>() // Specify types for histogram
            .value((d) => d.age) // Correctly extract age property
            .domain(d3.extent(data, (d) => d.age) as [number, number])
            .thresholds(d3.range(0, 100, 10)); // Change range as needed for age brackets

        const histogramData = bins(data); // Create bins from the data

        // Set scales
        const x = d3
            .scaleBand()
            .domain(histogramData.map((d) => `${d.x0}-${d.x1}`))
            .range([0, width])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(histogramData, (d) => d.length)!])
            .nice()
            .range([height, 0]);

        // Add axes
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

        // Create bars
        svg.selectAll("rect")
            .data(histogramData)
            .enter()
            .append("rect")
            .attr("x", (d) => x(`${d.x0}-${d.x1}`)!)
            .attr("y", (d) => y(d.length))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.length))
            .attr("fill", "#4CAF50");

        // Add labels
        svg.selectAll("text.label")
            .data(histogramData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (d) => x(`${d.x0}-${d.x1}`)! + x.bandwidth() / 2)
            .attr("y", (d) => y(d.length) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d.length);
    }, [data]);

    return <svg ref={svgRef} />;
};

export default AgeHistogram;
