import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";

interface HeatmapProps {
    data: {
        category: string;
        cashAssistance: number;
        pesticides: number;
        seeds: number;
    }[];
    categories: string[];
    allocationTypes: string[];
    colorScale: (value: number) => string; // Function to determine color intensity based on value
}

const DonutChartTwo: React.FC<HeatmapProps> = ({
    data,
    categories,
    allocationTypes,
    colorScale,
}) => {
    return (
        <div className="w-full h-80 p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-center text-lg font-semibold mb-4">
                Allocation Recipient By Allocation Type
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {allocationTypes.map((allocationType, index) => (
                        <Bar
                            key={index}
                            dataKey={allocationType}
                            name={allocationType}
                            barSize={30}
                            fill={colorScale(index)} // Use color scale for each allocation type
                        >
                            {data.map((entry, idx) => (
                                <Cell
                                    key={`cell-${idx}`}
                                    fill={colorScale(
                                        entry[
                                            allocationType as keyof typeof entry
                                        ]
                                    )} // Apply dynamic color based on value
                                />
                            ))}
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChartTwo;
