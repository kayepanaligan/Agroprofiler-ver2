import React from "react";
import Card from "./Card";
import { PieChart } from "lucide-react";

interface CommodityAnalyticsProps {
    commodityCategoryDistribution: any[];
}

export default function CommoditiesAnalytics() {
    return (
        <div
            className="mb-4 grid lg:grid-cols-2 md:grid-cols-1 gap-4"
            id="commodities"
        >
            {commodityCategoryDistribution?.map((category) => {
                const chartData = category.commodities.map(
                    (commodity: {
                        commodity_name: string;
                        commodity_total: number;
                    }) => ({
                        name: commodity.commodity_name,
                        value: commodity.commodity_total,
                    })
                );
                return (
                    <Card
                        title={category.commodity_category_name}
                        key={category.commodity_category_name}
                        className="mb-1 capitalize"
                    >
                        <h1 className="font-semibold text-xl text-green-600">
                            Total:{" "}
                            {category.commodity_category_total.toLocaleString()}
                        </h1>
                        <div>
                            <div className="p-4 border rounded-lg text-sm font-medium h-auto mb-4">
                                <ul>
                                    {category.commodities.map((commodity) => (
                                        <li
                                            key={commodity.commodity_name}
                                            className="mb-2 flex justify-between"
                                        >
                                            <span className="">
                                                {commodity.commodity_name}
                                            </span>
                                            <span>
                                                {commodity.commodity_total}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <PieChart data={chartData} />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
