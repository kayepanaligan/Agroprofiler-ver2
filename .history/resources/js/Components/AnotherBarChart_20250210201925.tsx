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
    color?: string; // Customizable bar color
}

const AnotherBarChart: React.FC<BarChartProps> = ({
    data = [],
    color = "#8884d8",
}) => {
    return (
        <div
            style={{
                width: "100%",
                maxWidth: "750px",
                margin: "0 auto",
                padding: "10px",
                borderRadius: "20px",
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
                            borderRadius: "15px",
                            fontSize: "12px",
                        }}
                        formatter={(value) => `${value}`}
                    />
                    <Legend />
                    <Bar dataKey="value" fill={color} radius={[10, 10, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnotherBarChart;
