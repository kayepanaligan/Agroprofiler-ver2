import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
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
import CommodityDonutChart from "@/Components/CommodityDonutChart";
import BoxPlot from "@/Components/BoxPlot";
import BoxPlotComponent from "@/Components/BoxPlot";
import StackedRowChart from "@/Components/StackedRowChart";
import { Box, CircularProgress } from "@mui/material";
import MapOfDistribution from "@/Components/MapOfDistribution";

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

interface DataItem {
    category: string;
    subcategories: { [key: string]: number };
}

interface AllocationCount {
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

    const [data, setData] = useState<any>(null);

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

    const [allocationData, setAllocationData] = useState<AllocationCount[]>([]);

    useEffect(() => {
        const fetchAllocationData = async () => {
            try {
                const response = await axios.get("/allocation-type-counts");
                setAllocationData(response.data);
            } catch (error) {
                console.error("Error fetching allocation data:", error);
            }
        };

        fetchAllocationData();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl block text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex mb-5 gap-4">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="rounded-[12px] border border-slate-200 p-2 flex">
                            Year <ChevronDown size={15} className="mt-1 ml-3" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="left">
                        <Dropdown.Link href="/link1">2024</Dropdown.Link>
                        <Dropdown.Link href="/link2">2023</Dropdown.Link>
                        <Dropdown.Link href="/link3">2022</Dropdown.Link>
                        <Dropdown.Link href="/link2">2021</Dropdown.Link>
                        <Dropdown.Link href="/link3">2020</Dropdown.Link>
                        <Dropdown.Link href="/link3">2019</Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>

            <div className="bg-green-500">
                <div className="mb-4">
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-2">
                        <Card title="Farmers" className="w-50">
                            <div className="flex">
                                <div>
                                    <h1 className="font-semibold text-2xl">
                                        Total: {totalFarmers}
                                    </h1>
                                    <hr />
                                    <div className="p-4 border rounded-lg text-sm font-medium h-auto">
                                        <span className="flex justify-between text-sm">
                                            <span>Registered</span>
                                            <span>{registeredFarmers}</span>
                                        </span>
                                        <span className="flex justify-between text-sm">
                                            <span>Unregistered</span>
                                            <span>{unregisteredFarmers}</span>
                                        </span>
                                    </div>
                                </div>
                                <br />
                                <div className="w-[100px] h-[100px]">
                                    <PieChart data={farmerCount} />
                                </div>
                            </div>
                        </Card>

                        <Card title="Allocations" className="w-50">
                            <h1 className="font-semibold text-2xl">
                                Total: {totalAllocations}
                            </h1>
                            {allocationData.length > 0 ? (
                                <>
                                    <div className="p-4 border rounded-lg text-sm font-medium h-auto">
                                        {allocationData.map(
                                            (allocation, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between text-sm mb-2"
                                                >
                                                    <span>
                                                        {allocation.name}
                                                    </span>
                                                    <span>
                                                        {allocation.value}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div>
                                        <PieChart data={allocationData} />
                                    </div>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "5rem",
                                    }}
                                >
                                    {/* <CircularProgress /> */}
                                    No data to show
                                </Box>
                            )}
                        </Card>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-2">
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
                                <h1 className="font-semibold text-xl">
                                    Total: {category.commodity_category_total}
                                </h1>
                                <div>
                                    <div className="p-4 border rounded-lg text-sm font-medium h-auto mb-4">
                                        <ul>
                                            {category.commodities.map(
                                                (commodity) => (
                                                    <li
                                                        key={
                                                            commodity.commodity_name
                                                        }
                                                        className="mb-2 flex justify-between"
                                                    >
                                                        <span className="">
                                                            {
                                                                commodity.commodity_name
                                                            }
                                                        </span>
                                                        <span>
                                                            {
                                                                commodity.commodity_total
                                                            }
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

                <div className="">
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
                </div>

                <Card title="Barangay Data Distribution">
                    <>
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
                                className="rounded-2xl mb-5"
                            >
                                <option value="allocations">Allocations</option>
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

                        <GroupedBarChart
                            data={heatmapData}
                            distributionType={distributionType}
                        />
                    </>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
