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

interface Commodity {
    id: number;
    name: string;
    farms_count: number;
    count: number;
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
        commodities?: { [subtype: string]: number };
        farmers?: { [subtype: string]: number };
        highValue?: { [subtype: string]: number };
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
    commodities: Array<{ name: string; count: number }>;
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

interface DataItem {
    category: string;
    subcategories: { [key: string]: number };
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [distributionType, setDistributionType] = useState<
        "allocations" | "commodities" | "farmers" | "highValue"
    >("allocations");
    const [subtype, setSubtype] = useState<string>("");
    const [farmersData, setFarmersData] = useState<any>(null);
    const [selectedFarmerYear, setSelectedFarmerYear] = useState<string>("all");
    const [selectedFarmerSubcategory, setSelectedFarmerSubcategory] =
        useState<string>("all");
    const [allocationsData, setAllocationsData] = useState<any>(null);
    const [selectedAllocationsYear, setSelectedAllocationsYear] =
        useState<string>("all");
    const [selectedAllocationsSubcategory, setSelectedAllocationsSubcategory] =
        useState<string>("all");
    const [years, setYears] = useState<number[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const [dashboardData, setDashboardData] = useState<DashboardProps | null>(
        null
    );
    const [allocationsDistributionData, setAllocationsDistributionData] =
        useState<any[]>([]);
    const [chartData, setChartData] = useState<DataItem[]>([]);
    const subcategories = {
        farmers: ["all", "registered", "unregistered"],
    };

    const transformedData = commodityCategories.map((category) => ({
        ...category,
        commodities: Object.entries(category.commodities).map(
            ([name, count]) => ({
                name,
                count: typeof count === "number" ? count : 0,
            })
        ),
    }));

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
                const response = await fetch("admin/api/allocations");
                const data = await response.json();
                setAllocationsDistributionData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setYears([2023, 2024, 2025]);
    }, []);

    //fetching allocation data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/admin/api/allocations", {
                    params: {
                        year:
                            selectedAllocationsYear === "all"
                                ? null
                                : selectedAllocationsYear,
                        subcategory:
                            selectedAllocationsSubcategory === "all"
                                ? null
                                : selectedAllocationsSubcategory,
                    },
                });
                setAllocationsData(response.data);
                console.log("allocations data: ", allocationsData);
            } catch (error) {
                console.error("Error fetching allocations data:", error);
            }
        };

        fetchData();
    }, [selectedAllocationsYear, selectedAllocationsSubcategory]);

    //fetching geojson file
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

    //fetching kalimot ko asa ni dapit
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/dashboard`, {
                    params: { year: selectedYear },
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dasjbpard data:", error);
            }
        };
        fetchData();
    }, [selectedYear]);

    //fake data for stacked bar chart tbd
    useEffect(() => {
        axios.get("/api/stacked-data").then((response) => {
            setChartData(response.data);
        });
    }, []);

    //for the selection of years
    useEffect(() => {
        setYears([2019, 2020, 2021, 2022, 2023, 2024]);
    }, []);

    //fetching farmers data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/farmers", {
                    params: {
                        year:
                            selectedFarmerYear === "all"
                                ? null
                                : selectedFarmerYear,
                        subcategory:
                            selectedFarmerSubcategory === "all"
                                ? null
                                : selectedFarmerSubcategory,
                    },
                });
                setFarmersData(response.data);
                console.log("farmers data: ", farmersData);
            } catch (error) {
                console.error("Error fetching farmers data:", error);
            }
        };

        fetchData();
    }, [selectedFarmerYear, selectedFarmerSubcategory]);

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

            <div className="grid grid-flow-row grid-rows-1 gap-3 ">
                <div className="grid grid-flow-col grid-cols-4 gap-2 ">
                    {Object.entries(commodityCounts).map(
                        ([categoryName, commodities]) => {
                            if (Array.isArray(commodities)) {
                                return (
                                    <Card
                                        key={categoryName}
                                        title={categoryName}
                                    >
                                        {commodities.map(
                                            (
                                                commodity: {
                                                    name: string;
                                                    count: number;
                                                },
                                                index: number
                                            ) => (
                                                <p
                                                    className="text-sm"
                                                    key={index}
                                                >
                                                    {commodity.name}:{" "}
                                                    {commodity.count}
                                                </p>
                                            )
                                        )}
                                    </Card>
                                );
                            } else {
                                return (
                                    <div key={categoryName}>
                                        No commodities available
                                    </div>
                                );
                            }
                        }
                    )}

                    <div>
                        <Card title="Farmers">
                            <h1 className="font-semibold text-2xl">
                                Total: {totalFarmers}
                            </h1>
                            <hr />
                            <br />
                            <span className="text-sm">
                                Registered: {registeredFarmers}
                            </span>
                            <br />
                            <span className="text-sm">
                                Unregistered: {unregisteredFarmers}
                            </span>
                        </Card>
                    </div>
                    <div>
                        <Card title="Allocations">
                            <h1 className="font-semibold text-2xl">
                                {totalAllocations}
                            </h1>
                            <span>Registered: {registeredFarmers}</span>
                            <span>Unregistered: {unregisteredFarmers}</span>
                        </Card>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                        <Card title="Total Counts">
                            <div>
                                <StackedRowChart
                                    data={chartData}
                                    colors={[
                                        "#ff7f0e",
                                        "#2ca02c",
                                        "#1f77b4",
                                        "#d62728",
                                        "#9467bd",
                                    ]}
                                />
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
                                            | "commodities"
                                            | "farmers"
                                            | "highValue"
                                    )
                                }
                                className="rounded-2xl mb-5"
                            >
                                <option value="allocations">Allocations</option>
                                <option value="commodities">Commodities</option>
                                <option value="farmers">Farmers</option>
                                <option value="highValue">
                                    High Value Crops
                                </option>
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
