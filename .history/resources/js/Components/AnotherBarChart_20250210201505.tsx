import React from "react";
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface BarChartProps {
    data?: { name: string; value: number }[]; // Make `data` optional
}

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4567",
    "#A28CF3",
];

const AnotherBarChart: React.FC<BarChartProps> = ({ data = [] }) => {
    // Default to an empty array
    return (
        <div
            style={{
                width: "100%",
                maxWidth: "750px",
                margin: "0 auto",
                padding: "5px",
            }}
        >
            <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "lightsteelblue",
                            borderRadius: "20px",
                            fontSize: "12px",
                        }}
                        formatter={(value) => `${value}`}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                        {data.map((entry, index) => (
                            <rect
                                key={`bar-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnotherBarChart;
