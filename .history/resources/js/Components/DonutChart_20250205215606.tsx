import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

interface DonutChartProps {
    data: { name: string; value: number }[];
    colors?: string[];
    title?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    colors = ["#8884d8", "#82ca9d", "#ffc658"],
    title,
}) => {
    return (
        <div className="w-full h-80 p-4 border rounded-lg shadow-lg bg-white">
            {title && (
                <h2 className="text-center text-lg font-regular mb-2">
                    {title}
                </h2>
            )}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                        <LabelList dataKey="name" position="outside" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChart;
