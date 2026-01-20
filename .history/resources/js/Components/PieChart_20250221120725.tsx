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
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4567",
    "#A28CF3",
    "#D84040",
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
                                fill={colors[index % colors.length]} // Use user-defined colors
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        wrapperStyle={{
                            height: "auto",
                            padding: 10,
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontSize: "12px",
                            borderColor: "none",
                        }}
                        contentStyle={{
                            backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                            color: isDarkMode ? "white" : "black",
                            borderRadius: "10px",
                            border: "none",
                            padding: "10px",
                            boxShadow: isDarkMode
                                ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                                : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                        formatter={(value) => `${value}`}
                    />
                    <Legend
                        wrapperStyle={{
                            height: 50,
                            marginTop: 200,
                            padding: 10,
                            border: "1px",
                            textTransform: "capitalize",
                            fontSize: "14px",
                            borderRadius: "20px",
                        }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
