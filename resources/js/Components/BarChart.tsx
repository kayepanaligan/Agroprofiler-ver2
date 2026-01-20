import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BarChartProps {
    data: { name: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (svgRef.current && data) {
            const svg = d3.select(svgRef.current);
            const width = svgRef.current.clientWidth;
            const height = svgRef.current.clientHeight;
            const margin = { top: 20, right: 30, bottom: 40, left: 40 };
            const x = d3
                .scaleBand()
                .domain(data.map((d) => d.name))
                .range([margin.left, width - margin.right])
                .padding(0.1);
            const y = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.value) || 0])
                .nice()
                .range([height - margin.bottom, margin.top]);
            const tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.selectAll("*").remove(); // Clear previous contents

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("x", width - margin.right)
                .attr("y", margin.bottom - 4)
                .attr("fill", "#000")
                .attr("text-anchor", "end")
                .text("Categories");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .append("text")
                .attr("x", 4)
                .attr("y", margin.top)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .attr("text-anchor", "start")
                .text("Value");

            svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.name) || 0)
                .attr("y", (d) => y(d.value))
                .attr("width", x.bandwidth())
                .attr("height", (d) => height - margin.bottom - y(d.value))
                .style("fill", "steelblue")
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html(`${d.name}: ${d.value}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .style("fill", "orange");
                })
                .on("mouseout", (event) => {
                    tooltip.transition().duration(500).style("opacity", 0);
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .style("fill", "steelblue");
                })
                .on("click", (event, d) => {
                    alert(`You clicked on ${d.name}`);
                });

            // Add a legend
            const legend = svg
                .append("g")
                .attr(
                    "transform",
                    `translate(${width - margin.right - 100},${margin.top})`
                );

            legend
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", "steelblue");

            legend
                .append("text")
                .attr("x", 30)
                .attr("y", 15)
                .text("Value")
                .style("font-size", "12px");
        }
    }, [data]);

    return (
        <div>
            <svg
                ref={svgRef}
                width="100%"
                height="250"
                style={{ border: "none", borderRadius: "5px" }}
            ></svg>
            <style>
                {`
                    .tooltip {
                        position: absolute;
                        text-align: center;
                        padding: 5px;
                        font-size: 12px;
                        background: lightsteelblue;
                        border-radius: 5px;
                        pointer-events: none;
                    }
                    .bar:hover {
                        fill: orange;
                    }
                `}
            </style>
        </div>
    );
};

export default BarChart;
