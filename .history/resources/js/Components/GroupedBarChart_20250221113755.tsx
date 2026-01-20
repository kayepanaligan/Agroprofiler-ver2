import React, { useEffect, useState } from "react";
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type HeatmapData = {
    [barangay: string]: {
        allocations?: { [subtype: string]: { count: number; amount: number } };
        commodities_categories?: {
            [subcategory: string]: { [commodity: string]: number };
        };
        farmers?: { [subtype: string]: number };
    };
};

interface GroupedBarChartProps {
    data: HeatmapData;
    distributionType: "allocations" | "commodityCategories" | "farmers";
}

const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
    data,
    distributionType,
}) => {
    if (!data || Object.keys(data).length === 0) {
        console.warn("GroupedBarChart: Data is empty or invalid", data);
        return <div>No data available</div>;
    }

    const chartData = Object.keys(data).map((barangay) => {
        const entry = data[barangay] ?? {};
        const rowData: Record<string, number | string> = { name: barangay };

        // ✅ Extract commodity category from distributionType
        const commodityCategory = distributionType.startsWith(
            "commodity_categories_"
        )
            ? distributionType.replace("commodity_categories_", "")
            : null;

        if (distributionType === "allocations" && entry.allocations) {
            Object.entries(entry.allocations).forEach(
                ([allocationType, details]) => {
                    rowData[allocationType] = details.count || 0;
                }
            );
        }

        if (
            commodityCategory &&
            entry.commodities_categories?.[commodityCategory]
        ) {
            Object.entries(
                entry.commodities_categories[commodityCategory]
            ).forEach(([commodity, count]) => {
                rowData[commodity] = count || 0;
            });
        }

        if (distributionType === "farmers" && entry.farmers) {
            rowData["Registered Farmers"] = entry.farmers["Registered"] || 0;
            rowData["Unregistered Farmers"] =
                entry.farmers["Unregistered"] || 0;
        }

        console.log(`Processed rowData for ${barangay}:`, rowData);

        return rowData;
    });

    console.log("Final chartData:", chartData);

    const barKeys = Array.from(
        new Set(chartData.flatMap((item) => Object.keys(item)))
    ).filter((key) => key !== "name");

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
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={{
                            fontSize: 10,
                            fill: isDarkMode ? "white" : "black",
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            height: 50,
                            marginTop: 20,
                            padding: 10,
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontSize: "14px",
                        }}
                    />
                    <YAxis
                        tick={{
                            fontSize: 14,
                            fill: isDarkMode ? "white" : "black",
                        }}
                    />
                    <Tooltip />
                    {barKeys.map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            barSize={10}
                            fill={generateRandomColor()}
                            radius={[20, 20, 0, 0]}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GroupedBarChart;
