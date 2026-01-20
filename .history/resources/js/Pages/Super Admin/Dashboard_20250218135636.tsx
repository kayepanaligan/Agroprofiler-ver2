import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import Card from "@/Components/Card";
import { useEffect, useState } from "react";
import PieChart from "@/Components/PieChart";
import DonutChart from "@/Components/DonutChart";
import Heatmap from "@/Components/Heatmap";
import Dropdown from "@/Components/Dropdown";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import GroupedBarChart from "@/Components/GroupedBarChart";

interface Commodity {
    id: number;
    name: string;
    farms_count: number;
    count: number;
    commodity_name: string;
    commodity_total: number;
}

interface DataPoint {
    barangay: string;
    value: number;
}

interface LineData {
    name: string;
    color: string;
    data: DataPoint[];
}

type HeatmapData = {
    [barangay: string]: {
        allocations?: { [subtype: string]: number };
        commodities_categories?: {
            [subtype: string]: { [subcategory: string]: number };
        };
        farmers?: { [subtype: string]: number };
        commodities?: Array<{
            commodities_category_name: string;
            commodities: Array<{ name: string; count: number }>;
        }>;
    };
};

interface BarangayData {
    [key: string]: {
        registeredFarmers: number;
        unregisteredFarmers: number;
        commodityCounts: {
            [commodityType: string]: number;
        };
        allocationCounts: {
            [allocationType: string]: number;
        };
    };
}

interface CommodityCategory {
    id: number;
    name: string;
    desc: string;
    commodity_category_name: string;
    commodity_category_total: number;
    commodities: Commodity[];
}

interface DashboardProps extends PageProps {
    totalAllocations: number;
    commoditiesDistribution: Array<{
        id: number;
        name: string;
        farms_count: number;
    }>;
    farms: {
        latitude: number;
        longitude: number;
        barangay: string;
    };
    registeredFarmers: number;
    unregisteredFarmers: number;
    totalFarmers: number;
    commodityCounts: {
        rice: number;
        corn: number;
        fish: number;
    };
    highValueCounts: {
        high_value: number;
        vegetable: number;
        fruit_bearing: number;
    };
    barangayData: BarangayData;
    heatmapData: HeatmapData;
    commodityCategories: CommodityCategory[];
}

type CommodityDistribution = {
    commodity_name: string;
    commodity_total: number;
};

type CommodityCategoryDistribution = {
    commodity_category_name: string;
    commodity_category_total: number;
    commodities: Commodity[];
};

interface DashboardProps {
    years: (number | string)[];
    selectedYear: string | number;
}

interface DataItem {
    category: string;
    subcategories: { [key: string]: number };
}

interface AllocationCount {
    data: any;
    name: string;
    value: number;
}

export default function Dashboard({
    auth,
    children,
    totalAllocations,
    commoditiesDistribution,
    registeredFarmers,
    unregisteredFarmers,
    totalFarmers,
    commodityCounts,
    data,
    years,
    selectedYear,
    barangayData,
    heatmapData,
    highValueCounts,
    commodityCategories,
}: DashboardProps) {
    const [distributionType, setDistributionType] = useState<
        "allocations" | "farmers" | string
    >("allocations");

    const [farmersData, setFarmersData] = useState<any>(null);

    const [allocationsData, setAllocationsData] = useState<any>(null);

    const [allocationsDistributionData, setAllocationsDistributionData] =
        useState<any[]>([]);
    const [chartData, setChartData] = useState<DataItem[]>([]);
    const subcategories = {
        farmers: ["all", "registered", "unregistered"],
    };

    const pieData = [
        { name: "Registered", value: registeredFarmers },
        { name: "Unregistered", value: unregisteredFarmers },
    ];

    const [geoData, setGeoData] = useState<any>(null);

    const [distributionData, setDistributionData] = useState<any>(null);

    const [farmersDistributionData, setFarmersDistributionData] = useState<
        any[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/farmers");
                const data = await response.json();
                setFarmersDistributionData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/allocations");
                const data = await response.json();
                setAllocationsDistributionData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    const [commodityCategoryDistribution, setCommodityCategoryDistribution] =
        useState<CommodityCategoryDistribution[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/commoditycategorycounts");
                const data = await response.json();
                setCommodityCategoryDistribution(data);
                console.log(
                    "commodity categories distribution: ",
                    commodityCategoryDistribution
                );
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoResponse = await axios.get("/Digos_City.geojson");
                setGeoData(geoResponse.data);

                const distributionResponse = await axios.get("/dashboard");
                setDistributionData(distributionResponse.data);
            } catch (error) {
                console.error("Error fetching allocations data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        axios.get("/api/stacked-data").then((response) => {
            setChartData(response.data);
        });
    }, []);

    const farmerCount = [
        { name: "Registered", value: registeredFarmers },
        { name: "Unregistered", value: unregisteredFarmers },
    ];

    const [yearss, setYears] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const months = [
        { value: "all", label: "All" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const fetchData = async (year: string, month: string) => {
        try {
            const response = await axios.get("/indexresponse", {
                params: {
                    year: year !== "all" ? year : undefined,
                    month: month !== "all" ? month : undefined,
                },
            });
            setData(response.data);
            setYears(response.data.years);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [currentYear, setCurrentYear] = useState<string | number>(
        selectedYear
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[24px] block font-semibold text-green-600 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex mb-5 gap-4 w-30">
                <select
                    value={currentYear}
                    onChange={(e) => {
                        const year = e.target.value;
                        setCurrentYear(year);
                        router.get("/dashboard", {
                            year: year === "All" ? "all" : year,
                        });
                    }}
                    className="rounded-[12px] focus:ring-green-600 focus:outline-none dark:text-white dark:focus:ring-green-400 dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] text-[15px] w-[470px] cursor-pointer outline-none after:outline-none"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="">
                <div className="mb-4" id="farmer">
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                        <Card title="Farmers Distribution" className="w-50">
                            <div>
                                <div>
                                    <h1 className="font-semibold text-2xl text-green-700">
                                        Total: {totalFarmers.toLocaleString()}
                                    </h1>
                                    <hr />
                                    <div className="p-4 border rounded-lg text-sm font-medium h-auto">
                                        <span className="flex justify-between text-sm dark:text-white">
                                            <span>Registered</span>
                                            <span>
                                                {registeredFarmers.toLocaleString()}
                                            </span>
                                        </span>
                                        <span className="flex justify-between text-sm dark:text-white">
                                            <span>Unregistered</span>
                                            <span>
                                                {unregisteredFarmers.toLocaleString()}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <br />
                                <div>
                                    <PieChart data={farmerCount} />
                                </div>
                            </div>
                        </Card>

                        <Card title="Allocations Distribution" className="w-50">
                            <h1 className="font-semibold text-2xl text-green-700">
                                Total: {totalAllocations.toLocaleString()}
                            </h1>

                            <div className="p-4 border rounded-lg text-sm font-medium h-auto mb-4 text-[14px] dark:text-white">
                                {data && data.length > 0 ? (
                                    data.map((d, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between text-sm mb-2"
                                        >
                                            <span>{d.name}</span>
                                            <span>{d.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        No data available
                                    </p>
                                )}
                            </div>

                            <div>
                                <PieChart data={data} />
                            </div>
                        </Card>
                    </div>
                </div>

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
                                title={`${category.commodity_category_name} Distribution`}
                                key={category.commodity_category_name}
                                className="mb-1 capitalize"
                            >
                                <h1 className="font-semibold text-xl text-green-600">
                                    Total:{" "}
                                    {category.commodity_category_total.toLocaleString()}
                                </h1>
                                <div>
                                    <div className="p-4 border rounded-lg text-sm font-medium h-auto mb-4 text-[14px]">
                                        <ul>
                                            {category.commodities.map(
                                                (commodity) => (
                                                    <li
                                                        key={
                                                            commodity.commodity_name
                                                        }
                                                        className="mb-2 flex justify-between dark:text-white"
                                                    >
                                                        <span className="">
                                                            {
                                                                commodity.commodity_name
                                                            }
                                                        </span>
                                                        <span>
                                                            {commodity.commodity_total.toLocaleString()}
                                                        </span>
                                                    </li>
                                                )
                                            )}
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

                <div
                    className="grid grid-flow-col grid-cols-2 gap-4 mb-4"
                    id="geospatial"
                >
                    <div>
                        <Card title="Map of Digos City, Davao del Sur">
                            <div>
                                {geoData && (
                                    <Heatmap
                                        distributionData={heatmapData}
                                        geoData={geoData}
                                    />
                                )}
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card title="Barangay Data Distribution">
                            card here
                        </Card>
                    </div>
                </div>

                <div>
                    <Card title="Barangay Data Distribution">
                        <div>
                            <div className="p-5">
                                <select
                                    onChange={(e) =>
                                        setDistributionType(
                                            e.target.value as
                                                | "allocations"
                                                | "farmers"
                                                | `commodity_categories_${string}`
                                        )
                                    }
                                    className="rounded-[12px] border-slate-500 mb-5 cursor-pointer dark:border-green-600 dark:bg-[#0D1A25] dark:text-white"
                                >
                                    <option value="allocations">
                                        Allocations
                                    </option>
                                    <option value="farmers">Farmers</option>
                                    {commodityCategories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={`commodity_categories_${category.name}`}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
