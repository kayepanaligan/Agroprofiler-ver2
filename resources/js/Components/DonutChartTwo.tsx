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
    colors: string[];
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
        const dynamicColors = data.map(() => generateRandomColor());

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
                    <Cell key={`cell-${index}`} fill={dynamicColors[index]} />
                ))}
                {isInnerRing && (
                    <LabelList dataKey="name" position="outside" fill="#000" />
                )}
            </Pie>
        );
    };

    return (
        <div className="w-full h-[30rem] p-4 border rounded-lg shadow-lg bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    {renderPie(innerData, 70, 90, true)}{" "}
                    {renderPie(outerData, 90, 110)}
                    {renderPie(superOuterData, 110, 130)} <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChartTwo;
