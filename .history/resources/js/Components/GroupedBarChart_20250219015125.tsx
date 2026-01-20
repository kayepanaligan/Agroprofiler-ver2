import React, { useState } from "react";
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
        allocations?: { [subtype: string]: { count: number } };
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
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        console.warn("GroupedBarChart: Data is empty or invalid", data);
        return <div>No data available</div>;
    }

    const chartData = Object.keys(data).map((barangay) => {
        const entry = data[barangay] ?? {};
        const rowData: any = { name: barangay };

        if (distributionType === "allocations" && entry.allocations) {
            Object.keys(entry.allocations).forEach((allocationType) => {
                rowData[allocationType] =
                    entry.allocations[allocationType]?.count || 0;
            });
        }

        if (
            distributionType === "commodityCategories" &&
            entry.commodities_categories
        ) {
            Object.entries(entry.commodities_categories).forEach(
                ([category, subtypes]) => {
                    Object.entries(subtypes).forEach(([commodity, count]) => {
                        rowData[`${category} - ${commodity}`] = count || 0;
                    });
                }
            );
        }

        if (distributionType === "farmers" && entry.farmers) {
            Object.keys(entry.farmers).forEach((farmerType) => {
                rowData[farmerType] = entry.farmers[farmerType] || 0;
            });
        }

        return rowData;
    });

    const barKeys = Array.from(
        new Set(chartData.flatMap((item) => Object.keys(item)))
    ).filter((key) => key !== "name");

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
                        tick={{ fontSize: 10 }}
                    />
                    <Legend
                        wrapperStyle={{
                            height: 50,
                            marginTop: 200,
                            padding: 10,
                            textTransform: "capitalize",
                            fontSize: "14px",
                            borderRadius: "20px",
                        }}
                    />
                    <YAxis tick={{ fontSize: 14 }} />
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
