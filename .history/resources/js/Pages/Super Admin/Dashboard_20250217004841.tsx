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
import CommodityDonutChart from "@/Components/CommodityDonutChart";
import BoxPlot from "@/Components/BoxPlot";
import BoxPlotComponent from "@/Components/BoxPlot";
import StackedRowChart from "@/Components/StackedRowChart";
import {
    Box,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";
import MapOfDistribution from "@/Components/MapOfDistribution";
import AnotherBarChart from "@/Components/AnotherBarChart";
import { Tab, Tabs } from "@/Components/Tabs";
import InputLabel from "@/Components/InputLabel";

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

    const [data, setData] = useState<any>(null);
    const [yearss, setYears] = useState<number[]>([]);
    // const [selectedYearr, setSelectedYear] = useState<number>(selectedYear);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    // const [currentYear, setCurrentYear] = useState<number>(selectedYear);
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

    // useEffect(() => {
    //     fetchData(selectedYear, selectedMonth);
    // }, [selectedYear, selectedMonth]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[24px] block font-semibold text-green-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex mb-5 gap-4 w-20">
                <select
                    value={currentYear}
                    onChange={(e) => {
                        const year = e.target.value;
                        setCurrentYear(year);
                        router.get("/dashboard", {
                            year: year === "All" ? "all" : year,
                        });
                    }}
                    className="rounded-[12px] border border-slate-200 p-2 text-[14px]"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex mb-5 gap-4">
                <div>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="rounded-[12px] border border-slate-200 p-2 flex text-[14px]">
                                Year{" "}
                                <ChevronDown size={15} className="mt-1 ml-3" />
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
            </div>

            <div className="">
                <div className="mb-4" id="farmer">
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                        <Card title="Farmers Distribution" className="w-50">
                            <div>
                                <div>
                                    <h1 className="font-semibold text-2xl text-green-600">
                                        Total: {totalFarmers.toLocaleString()}
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
                                <div>
                                    <PieChart data={farmerCount} />
                                </div>
                            </div>
                        </Card>

                        <Card title="Allocations Distribution" className="w-50">
                            <h1 className="font-semibold text-2xl text-green-600">
                                Total: {totalAllocations.toLocaleString()}
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
                                    className="rounded-[12px] border-slate-500 mb-5"
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
