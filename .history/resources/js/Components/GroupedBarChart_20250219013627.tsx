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
    const [openModal, setOpenModal] = useState(false);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const handleCategoryChange = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedCategory(event.target.value as string);
    };

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        console.warn("GroupedBarChart: Data is empty or invalid", data);
        return <div>No data available</div>;
    }

    const chartData = Object.keys(data).map((barangay) => {
        const entry = data?.[barangay] ?? {}; // Ensure entry is an object
        const rowData: any = { name: barangay };

        // Process allocation data
        if (distributionType === "allocations" && entry?.allocations) {
            Object.keys(entry.allocations ?? {}).forEach((allocation) => {
                rowData[allocation] = entry.allocations[allocation]?.count || 0;
            });
        }

        // Process commodity category data
        if (
            distributionType.startsWith("commodity_categories_") &&
            entry?.commodities_categories
        ) {
            const categoryName = distributionType.replace(
                "commodity_categories_",
                ""
            );
            const categoryData =
                entry?.commodities_categories?.[categoryName] ?? {};

            Object.keys(categoryData ?? {}).forEach((subcategory) => {
                rowData[subcategory] = categoryData[subcategory] || 0;
            });
        }

        // Process farmer data
        if (distributionType === "farmers" && entry?.farmers) {
            Object.keys(entry.farmers ?? {}).forEach((farmerType) => {
                rowData[farmerType] = entry.farmers[farmerType] || 0;
            });
        }

        return rowData;
    });

    console.log("Processed Chart Data: ", chartData);

    const commodityCategories = Object.keys(data).reduce(
        (categories: string[], barangay) => {
            const entry = data[barangay];
            entry.commodities?.forEach((category) => {
                if (!categories.includes(category.commodities_category_name)) {
                    categories.push(category.commodities_category_name);
                }
            });
            return categories;
        },
        []
    );

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
        </div>
    );
};

export default GroupedBarChart;
