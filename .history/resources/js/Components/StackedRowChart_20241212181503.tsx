import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
    category: string;
    subcategories: { [key: string]: number };
}

interface StackedRowChartProps {
    data: DataItem[];
    colors: string[];
}

const StackedRowChart: React.FC<StackedRowChartProps> = ({ data, colors }) => {
    const chartRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data.length) return;

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = { top: 10, right: 10, bottom: 10, left: 100 };
        const width = 400 - margin.left - margin.right;
        const height = 90 - margin.top - margin.bottom;

        const categories = data.map((d) => d.category);
        const subcategoryKeys = Object.keys(data[0].subcategories);

        const x = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, (d) => d3.sum(Object.values(d.subcategories))) ||
                    0,
            ])
            .range([0, width]);

        const y = d3
            .scaleBand()
            .domain(categories)
            .range([0, height])
            .padding(0.2);

        const colorScale = d3
            .scaleOrdinal<string>()
            .domain(subcategoryKeys)
            .range(colors);

        const stack = d3
            .stack<DataItem>()
            .keys(subcategoryKeys)
            .value((d, key) => d.subcategories[key]);

        const stackedData = stack(data);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", (d) => colorScale(d.key))
            .selectAll("rect")
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => x(d[0]))
            .attr("y", (d) => y(d.data.category)!)
            .attr("width", (d) => x(d[1]) - x(d[0]))
            .attr("height", y.bandwidth())
            .on("mouseover", function (event, d) {
                const [x0, x1] = d;
                const tooltip = d3.select("#tooltip");
                tooltip
                    .style("opacity", 1)
                    .html(
                        `<strong>${d.data.category}</strong><br>Value: ${
                            x1 - x0
                        }`
                    )
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY + 5}px`);
            })
            .on("mouseout", () => {
                d3.select("#tooltip").style("opacity", 0);
            });

        g.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5));
    }, [data, colors]);

    return (
        <div>
            <svg ref={chartRef} width={800} height={400} />
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    opacity: 0,
                    backgroundColor: "white",
                    border: "1px solid black",
                    padding: "5px",
                }}
            />
        </div>
    );
};

export default StackedRowChart;
