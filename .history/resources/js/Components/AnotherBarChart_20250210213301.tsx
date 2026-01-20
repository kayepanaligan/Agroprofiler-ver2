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
    data?: { name: string; value: number }[];
}

const AnotherBarChart: React.FC<BarChartProps> = ({ data = [] }) => {
    // Define an array of colors for bars
    const barColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
    ];

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
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "lightsteelblue",
                            borderRadius: "15px",
                            fontSize: "12px",
                        }}
                        formatter={(value) => `${value}`}
                    />
                    <Legend wrapperStyle={{ fontSize: "14px" }} />
                    {data.map((entry, index) => (
                        <Bar
                            key={index}
                            dataKey="value"
                            fill={barColors[index % barColors.length]} // Assign colors dynamically
                            radius={[20, 20, 20, 20]}
                            barSize={30} // Adjust the width of bars
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnotherBarChart;
