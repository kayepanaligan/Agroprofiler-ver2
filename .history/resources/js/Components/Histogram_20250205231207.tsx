import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend, // Import the Legend component
} from "recharts";

interface HistogramProps {
    data: { ageRange: string; count: number }[];
    title?: string;
    color?: string;
}

const Histogram: React.FC<HistogramProps> = ({
    data,
    title,
    color = "#F59E0B",
}) => {
    return (
        <div className="w-full h-[25rem] p-4 border rounded-lg shadow-lg bg-white">
            {title && (
                <h2 className="text-center text-lg font-semibold mb-2">
                    {title}
                </h2>
            )}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageRange" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="count" fill={color} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Histogram;
