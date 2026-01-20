import React, { useEffect, useState } from "react";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface PieChartProps {
    data: { name: string; value: number }[];
    colors?: string[];
}

const DEFAULT_COLORS = [
    "#3674B5",
    "#D84040",
    "#3D8D7A",
    "#EB5B00",
    "#FFB22C",
    "#B9B28A",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4567",
    "#A28CF3",
];

const PieChart: React.FC<PieChartProps> = ({
    data,
    colors = DEFAULT_COLORS,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                        color: isDarkMode ? "white" : "black", // Ensure text color changes
                        padding: "10px",
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: isDarkMode
                            ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                            : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                    >
                        {payload[0].name}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px" }}>
                        Value: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "750px",
                margin: "0 auto",
                padding: "5px",
                flex: "wrap",
            }}
        >
            <ResponsiveContainer width="90%" height={400}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        label={({ name }) => name}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        wrapperStyle={{
                            height: 50,
                            marginTop: 200,
                            padding: 10,
                            border: "1px",
                            textTransform: "capitalize",
                            fontSize: "12px",
                            borderRadius: "20px",
                        }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
