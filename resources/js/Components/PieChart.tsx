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
    "#6EC207",
    "#FFEB00",
    "#074799",
    "#009990",
    "#3674B5",
    "#D84040",
    "#3D8D7A",
    "#EB5B00",
    "#66D2CE",
    "#FFB22C",
    "#B9B28A",
    "#66D2CE",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4567",
    "#A28CF3",
];

const PieChart: React.FC<PieChartProps> = ({
    data = [],
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

    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
            return (
                <div
                    style={{
                        backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                        color: isDarkMode ? "white" : "black",
                        padding: "12px",
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
                            fontWeight: "semi-bold",
                            fontSize: "14px",
                        }}
                    >
                        {payload[0].name}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px" }}>
                        Count: {value.toLocaleString()}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px" }}>
                        Percentage: {percentage}%
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
                maxWidth: "700px",
                margin: "0 auto",
                padding: "5px",
                flex: "wrap",
                marginBottom: "10px",
            }}
            className="overflow-auto"
        >
            <ResponsiveContainer width="100%" height={500}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({
                            x,
                            y,
                            cx,
                            cy,
                            midAngle,
                            name,
                            index,
                            outerRadius,
                            value,
                        }) => {
                            const words: string[] = name.split(" ");
                            const RADIAN = Math.PI / 180;
                            const sin = Math.sin(-midAngle * RADIAN);
                            const cos = Math.cos(-midAngle * RADIAN);
                            const radius = (outerRadius ?? 150) + 50;
                            const labelX = cx + radius * cos;
                            const labelY = cy + radius * sin;
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                            return (
                                <g>
                                    <line
                                        x1={cx + (outerRadius ?? 150) * cos}
                                        y1={cy + (outerRadius ?? 150) * sin}
                                        x2={labelX}
                                        y2={labelY}
                                        stroke="#878787"
                                        strokeWidth={2}
                                    />
                                    <g
                                        transform={`translate(${labelX}, ${labelY})`}
                                    >
                                        {words.map(
                                            (word: string, i: number) => (
                                                <text
                                                    key={i}
                                                    x={0}
                                                    y={i * 14}
                                                    textAnchor={
                                                        cos >= 0
                                                            ? "start"
                                                            : "end"
                                                    }
                                                    fontSize="14px"
                                                    fontWeight="bold"
                                                    fill={
                                                        colors[
                                                            index %
                                                                colors.length
                                                        ]
                                                    }
                                                >
                                                    {word}
                                                </text>
                                            )
                                        )}
                                        <text
                                            x={0}
                                            y={words.length * 14 + 4}
                                            textAnchor={
                                                cos >= 0
                                                    ? "start"
                                                    : "end"
                                            }
                                            fontSize="12px"
                                            fontWeight="bold"
                                            fill={
                                                colors[
                                                    index %
                                                        colors.length
                                                ]
                                            }
                                        >
                                            {percentage}%
                                        </text>
                                    </g>
                                </g>
                            );
                        }}
                        labelLine={(props) => {
                            const { cx, cy, midAngle, outerRadius } = props;
                            const RADIAN = Math.PI / 180;
                            const sin = Math.sin(-midAngle * RADIAN);
                            const cos = Math.cos(-midAngle * RADIAN);
                            const radius = (outerRadius ?? 150) + 20;

                            return (
                                <line
                                    x1={cx + (outerRadius ?? 150) * cos}
                                    y1={cy + (outerRadius ?? 150) * sin}
                                    x2={cx + radius * cos}
                                    y2={cy + radius * sin}
                                    stroke="#878787"
                                    strokeWidth={2}
                                />
                            );
                        }}
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
