import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    LabelList,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface DonutChartProps {
    data: {
        allocationType: string;
        demographic: string;
        sourceOfFund: string;
        value: number;
    }[];
    allocationTypes: string[];
    demographics: string[];
    sourcesOfFund: string[];
    colors: string[]; // Array of colors for each slice
}

const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const DonutChartTwo: React.FC<DonutChartProps> = ({
    data,
    allocationTypes,
    demographics,
    sourcesOfFund,
    colors,
}) => {
    // Inner Ring: Total values for allocation types
    const innerData = allocationTypes.map((allocationType) => ({
        name: allocationType,
        value: data
            .filter((item) => item.allocationType === allocationType)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));

    // Outer Ring: Total values for demographic categories
    const outerData = demographics.map((demographic) => ({
        name: demographic,
        value: data
            .filter((item) => item.demographic === demographic)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));

    // Super Outer Ring: Total values for sources of funds
    const superOuterData = sourcesOfFund.map((source) => ({
        name: source,
        value: data
            .filter((item) => item.sourceOfFund === source)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));

    const renderPie = (
        data: { name: string; value: number }[],
        innerRadius: number,
        outerRadius: number,
        isInnerRing: boolean = false
    ) => {
        // Create a new colors array if needed
        const dynamicColors = data.map(() => generateRandomColor());

        return (
            <Pie
                data={data}
                dataKey="value"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={5}
                labelLine={true} // Keep label lines enabled
                label={({ name }) => name}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={dynamicColors[index]} // Use generated colors
                    />
                ))}
                {isInnerRing && (
                    <LabelList
                        dataKey="name"
                        position="outside"
                        fill="#000"
                        offset={90} // Increase this value to make lines longer
                    />
                )}
            </Pie>
        );
    };

    return (
        <div className="w-full h-[30rem] p-4 border rounded-lg shadow-lg bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    {/* Inner Ring: Allocation Types */}
                    {renderPie(innerData, 70, 90, true)}{" "}
                    {/* Increased radius */}
                    {/* Outer Ring: Demographic Categories */}
                    {renderPie(outerData, 90, 110)} {/* Increased radius */}
                    {/* Super Outer Ring: Source of Funds */}
                    {renderPie(superOuterData, 110, 130)}{" "}
                    {/* Increased radius */}
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChartTwo;
