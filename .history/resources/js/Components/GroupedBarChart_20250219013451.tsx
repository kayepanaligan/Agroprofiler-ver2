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
        allocations?: { [subtype: string]: { count: number; amount: string } };
        commodities_categories?: {
            [subcategory: string]: { [commodity: string]: number };
        };
        farmers?: { [subtype: string]: number };
        commodities?: Array<{
            commodities_category_name: string;
            commodities: Array<{ name: string; count: number }>;
        }>;
    };
};

interface GroupedBarChartProps {
    data: HeatmapData;
    distributionType:
        | "allocations"
        | "commodityCategories"
        | "farmers"
        | "highValue";
}

const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
    data,
    distributionType,
}) => {
    const chartData = Object.keys(data).map((barangay) => {
        const entry = data[barangay];
        const rowData: any = { name: barangay };

        // Handle Allocations data
        if (distributionType === "allocations" && entry?.allocations) {
            Object.keys(entry.allocations).forEach((allocation) => {
                rowData[allocation] = entry.allocations[allocation]?.count || 0;
            });
        }

        // Handle Commodity Categories data
        if (
            distributionType.startsWith("commodity_categories_") &&
            entry?.commodities_categories
        ) {
            const categoryName = distributionType.replace(
                "commodity_categories_",
                ""
            );
            const categoryData =
                entry.commodities_categories[categoryName] || {};

            Object.keys(categoryData).forEach((subcategory) => {
                rowData[subcategory] = categoryData[subcategory] || 0;
            });
        }

        // Handle Farmers data
        if (distributionType === "farmers" && entry?.farmers) {
            Object.keys(entry.farmers).forEach((farmerType) => {
                rowData[farmerType] = entry.farmers[farmerType] || 0;
            });
        }

        return rowData;
    });

    return (
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
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
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

                {Object.keys(chartData[0]).map((key) => {
                    if (key !== "name") {
                        const randomColor = generateRandomColor();
                        return (
                            <Bar
                                key={key}
                                dataKey={key}
                                barSize={10}
                                fill={randomColor}
                                radius={[20, 20, 0, 0]}
                            />
                        );
                    }
                })}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default GroupedBarChart;
