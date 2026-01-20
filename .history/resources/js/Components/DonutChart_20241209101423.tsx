import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DonutChartProps {
    data: { name: string; value: number }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (svgRef.current && data) {
            const svg = d3.select(svgRef.current);
            const width = svgRef.current.clientWidth;
            const height = svgRef.current.clientHeight;
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const radius =
                Math.min(width, height) / 2 -
                Math.max(margin.top, margin.bottom, margin.left, margin.right);

            const color = d3.scaleOrdinal(d3.schemeCategory10);
            const pie = d3.pie<any>().value((d) => d.value);
            const arc = d3
                .arc<any>()
                .innerRadius(radius - 20)
                .outerRadius(radius);
            const arcHover = d3
                .arc<any>()
                .innerRadius(radius - 10)
                .outerRadius(radius + 10);

            svg.selectAll("*").remove();

            svg.append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`)
                .selectAll("path")
                .data(pie(data))
                .enter()
                .append("path")
                .attr("d", arc as any)
                .attr("fill", (d) => color(d.data.name))
                .style("cursor", "pointer")
                .on("mouseover", (event, d) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr("d", arcHover as any);
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html(`${d.data.name}: ${d.data.value}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr("d", arc as any);
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .on("click", (event, d) => {
                    alert(`You clicked on ${d.data.name}`);
                });

            const tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            const legend = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`); // Top left position

            color.domain(data.map((d) => d.name));

            legend
                .selectAll("rect")
                .data(color.domain())
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", (d) => color(d as string));

            legend
                .selectAll("text")
                .data(color.domain())
                .enter()
                .append("text")
                .attr("x", 24)
                .attr("y", (d, i) => i * 20 + 9)
                .attr("dy", ".35em")
                .text((d) => d as string);
        }
    }, [data]);

    return (
        <div>
            <svg
                ref={svgRef}
                width="100%"
                height="315"
                style={{ border: "none", borderRadius: "5px" }}
            ></svg>
            <style>
                {`
                    .tooltip {
                        position: absolute;
                        text-align: center;
                        padding: 5px;
                        font-size: 8px;
                        background: lightsteelblue;
                        border-radius: 5px;
                        pointer-events: none;
                    }
                `}
            </style>
        </div>
    );
};

export default DonutChart;
