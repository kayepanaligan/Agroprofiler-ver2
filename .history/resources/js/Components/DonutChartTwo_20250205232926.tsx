import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Label,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface DonutChartProps {
    data: {
        allocationType: string;
        demographic: string;
        value: number;
    }[];
    allocationTypes: string[];
    demographics: string[];
    colors: string[]; // Array of colors for the slices
}

const DonutChartTwo: React.FC<DonutChartProps> = ({
    data,
    allocationTypes,
    demographics,
    colors,
}) => {
    // Calculate the total values for inner and outer rings
    const innerData = allocationTypes.map((allocationType) => ({
        name: allocationType,
        value: data
            .filter((item) => item.allocationType === allocationType)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));

    const outerData = demographics.map((demographic) => ({
        name: demographic,
        value: data
            .filter((item) => item.demographic === demographic)
            .reduce((acc, curr) => acc + curr.value, 0),
    }));

    const renderPie = (
        data: { name: string; value: number }[],
        innerRadius: number,
        outerRadius: number
    ) => {
        return (
            <Pie
                data={data}
                dataKey="value"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={5}
                labelLine={false}
                label={({ name }) => name}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                    />
                ))}
            </Pie>
        );
    };

    return (
        <div className="w-full h-[30rem] p-4 border rounded-lg shadow-lg bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    {renderPie(innerData, 60, 80)}

                    {/* Outer Ring: Demographic Categories */}
                    {renderPie(outerData, 80, 100)}

                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChartTwo;
