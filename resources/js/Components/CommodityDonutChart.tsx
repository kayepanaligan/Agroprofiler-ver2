import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { CommodityCategory } from "../types/commodityCategories";

type CommodityDonutChartProps = {
    commodityCategories: CommodityCategory[];
};

const CommodityDonutChart = ({
    commodityCategories,
}: CommodityDonutChartProps) => {
    const donutData = commodityCategories.flatMap((category) => {
        return category.commodities.map((commodity) => ({
            name: commodity.name,
            value: commodity.count,
        }));
    });

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#FF5733",
        "#C70039",
        "#900C3F",
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={100}
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                >
                    {donutData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CommodityDonutChart;
