import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
    barangay: string;
    value: number;
}

interface LineData {
    name: string;
    color: string;
    data: DataPoint[];
}

const LineChart: React.FC<{
    data: LineData[];
    width: number;
    height: number;
}> = ({ data, width, height }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [tooltip, setTooltip] = useState<{
        value: number;
        type: string;
        x: number;
        y: number;
    } | null>(null);

    useEffect(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return;

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
            d3.max(data, (line) => d3.max(line.data, (d) => d.value))!,
        ];

        const y = d3
            .scaleLinear()
            .domain(yDomain)
            .range([height - margin.top - margin.bottom, 0]);

        const line = d3
            .line<DataPoint>()
            .x((d) => x(d.barangay)! || 0) // Ensure valid x position
            .y((d) => y(d.value))
            .curve(d3.curveMonotoneX);

        // Append the x-axis
        const xAxis = svg
            .append("g")
            .attr(
                "transform",
                `translate(0,${height - margin.top - margin.bottom})`
            )
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
                .attr("cx", (d) => x(d.barangay)! || 0) // Ensure valid x position
                .attr("cy", (d) => y(d.value))
                .attr("r", 4)
                .attr("fill", lineData.color)
                .on("mouseover", (event, d) => {
                    setTooltip({
                        value: d.value,
                        type: lineData.name, // Set the type based on lineData
                        x: x(d.barangay)! + margin.left,
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

    return (
        <div style={{ position: "relative" }}>
            <svg ref={svgRef}></svg>
            {tooltip && (
                <div
                    style={{
                        position: "absolute",
                        left: tooltip.x,
                        top: tooltip.y,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: "4px",
                        pointerEvents: "none",
                    }}
                >
                    <span className="text-sm">
                        {tooltip.type} count: {tooltip.value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default LineChart;
