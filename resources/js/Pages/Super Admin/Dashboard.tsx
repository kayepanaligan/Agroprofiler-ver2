import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import Card from "@/Components/Card";
import { useEffect, useState } from "react";
import PieChart from "@/Components/PieChart";
import DonutChart from "@/Components/DonutChart";
import Heatmap from "@/Components/Heatmap";
import Dropdown from "@/Components/Dropdown";
import { ChevronDown, HelpCircle } from "lucide-react";
import axios from "axios";
import GroupedBarChart from "@/Components/GroupedBarChart";
import Histogram from "@/Components/Histogram";
import {
    FarmerKPICard,
    FarmsKPICard,
    CropDamageKPICard,
    AllocationCoverageKPICard,
} from "@/Components/KPICard";
import { barangays } from "@/Utils/brgy";
import AllocationVsDamageChart from "@/Components/AllocationVsDamageChart";
import PolicyEffectivenessChart from "@/Components/PolicyEffectivenessChart";

const PolicyEffectivenessTitle = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <span>Policy Effectiveness Analysis</span>
            <div 
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
                        <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800 dark:border-b-gray-900"></div>
                        <p className="mb-2">
                            This scatter plot visualizes the correlation between crop damage and funding allocation per barangay.
                        </p>
                        <p className="mb-2">
                            <strong>The Trend Line:</strong> Represents the "ideal" allocation strategy where funding increases linearly with damage.
                        </p>
                        <p className="mb-2">
                            <strong>Outliers:</strong> Barangays significantly above the line are receiving more funding than their relative damage suggests, 
                            while those significantly below the line may be under-resourced relative to their needs.
                        </p>
                        <p className="text-xs">
                            Hover over each point to see detailed information, expected allocation, and deviation from the trend.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AllocationVsDamageTitle = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <span>Allocation vs. Damage Alignment</span>
            <div 
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
                        <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800 dark:border-b-gray-900"></div>
                        <p className="mb-2">
                            This chart compares allocation amounts (blue bars) with crop damage percentages (red bars) per barangay.
                        </p>
                        <p className="mb-2">
                            <strong>What to look for:</strong> Ideally, the heights of red bars (Damage %) and blue bars (Allocation) should follow a similar pattern. 
                            Discrepancies indicate areas where allocation policy might need adjustment.
                        </p>
                        <p className="text-xs">
                            Hover over each bar to see detailed information and alignment status.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

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
        allocations?: { 
            [subtype: string]: { 
                count: number; 
                amount?: number;
                commodities?: {
                    [commodityName: string]: {
                        amount: number;
                        count: number;
                        percentage: number;
                    };
                };
                farmersReceived?: number;
                farmersYetToReceive?: number;
            } 
        };
        commodities_categories?: {
            [subtype: string]: { 
                [subcategory: string]: number | {
                    count: number;
                    avgFarmSize: number;
                    farmersCount: number;
                };
            };
        };
        farmers?: { 
            Registered?: number;
            Unregistered?: number;
            Total?: number;
            RegisteredDetails?: {
                total: number;
                male: number;
                female: number;
                pwd: number;
                ip: number;
                '4ps': number;
                avgFarmSize: number;
            };
            UnregisteredDetails?: {
                total: number;
                male: number;
                female: number;
                pwd: number;
                ip: number;
                '4ps': number;
                avgFarmSize: number;
            };
            [subtype: string]: number | {
                total: number;
                male: number;
                female: number;
                pwd: number;
                ip: number;
                '4ps': number;
                avgFarmSize: number;
            } | undefined;
        };
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

interface AllocationType {
    id: number;
    name: string;
    totalAmount: number;
    amount: string;
    identifier_title: string;
    identifier: {
        id: number;
        title: string;
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
    farmersPerCommodity?: Array<{ name: string; value: number }>;
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
    allocationType: AllocationType[];
    barangayData: BarangayData;
    heatmapData: HeatmapData;
    data: { name: string; value: number }[];
    commodityCategories: CommodityCategory[];
    cropDamageCauses?: Array<{ id: number; name: string; desc?: string }>;
    kpiData?: {
        farmers: {
            total: number;
            percentages: {
                registered: number;
                unregistered: number;
                pwd: number;
                ip: number;
                "4ps": number;
            };
            counts: {
                registered: number;
                unregistered: number;
                pwd: number;
                ip: number;
                "4ps": number;
            };
        };
        farms: {
            total: number;
            topCommodity: string;
            avgFarmSize: number;
            avgFarmsPerBarangay: number;
            avgFarmsPerFarmer: number;
        };
        cropDamage: {
            percentage: number;
            intensityPercentages?: {
                high: number;
                medium: number;
                low: number;
            };
            mostAffectedCommodity: string;
            mostImpactedGroup: string;
            topCropDamageCause: string;
            mostAffectedBarangay: string;
        };
        allocationCoverage: {
            percentage: number;
            totalPlanned: number;
            totalDelivered: number;
            topAllocationType: string;
            topAllocationSource: string;
            topAllocatedCommodity: string;
            avgAllocationPerFarm: number;
            topAllocatedBarangays: string[];
        };
    };
    ageGroupData?: { ageRange: string; count: number }[];
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
    data: { name: string; value: number }[];
    dateFrom?: string;
    dateTo?: string;
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
    farmersPerCommodity = [],
    commodityCounts,
    allocationType,
    data,
    dateFrom: dateFromProp = '',
    dateTo: dateToProp = '',
    barangayData,
    heatmapData,
    highValueCounts,
    commodityCategories,
    cropDamageCauses = [],
    kpiData,
    ageGroupData = [],
}: DashboardProps) {
    const [distributionType, setDistributionType] = useState<
        "allocations" | "farmers" | string
    >("allocations");

    const [farmersData, setFarmersData] = useState<any>(null);

    const [allocationsData, setAllocationsData] = useState<any>(null);

    const [allocationsDistributionData, setAllocationsDistributionData] =
        useState<any[]>([]);
    const [chartData, setChartData] = useState<DataItem[]>([]);
    const [dateFromState, setDateFromState] = useState<string>(dateFromProp || '');
    const [dateToState, setDateToState] = useState<string>(dateToProp || '');
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
    const [selectedCommodityCategory, setSelectedCommodityCategory] = useState<string>("");
    const [selectedBarangay, setSelectedBarangay] = useState<string>("all");
    const [selectedGenderBarangay, setSelectedGenderBarangay] = useState<string>("all");
    const [genderDistribution, setGenderDistribution] = useState<{
        male: number;
        female: number;
        total: number;
        malePercentage: number;
        femalePercentage: number;
    } | null>(null);
    const [allocationVsDamageData, setAllocationVsDamageData] = useState<Array<{
        barangay: string;
        allocationAmount: number;
        damagePercentage: number;
        totalFarms: number;
        damagedFarms: number;
    }>>([]);
    const [policyEffectivenessData, setPolicyEffectivenessData] = useState<Array<{
        barangay: string;
        allocationAmount: number;
        damagePercentage: number;
        totalFarms: number;
        damagedFarms: number;
    }>>([]);
    const [loading, setLoading] = useState(true);

    // Set default category to first one when data loads
    useEffect(() => {
        if (commodityCategoryDistribution && commodityCategoryDistribution.length > 0 && !selectedCommodityCategory) {
            setSelectedCommodityCategory(commodityCategoryDistribution[0].commodity_category_name);
        }
    }, [commodityCategoryDistribution]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();
                if (selectedBarangay && selectedBarangay !== "all") {
                    params.append("barangay_id", selectedBarangay);
                }
                if (dateFromProp) {
                    params.append("date_from", dateFromProp);
                }
                if (dateToProp) {
                    params.append("date_to", dateToProp);
                }
                
                const url = `/commoditycategorycounts${params.toString() ? `?${params.toString()}` : ''}`;
                const response = await fetch(url);
                const data = await response.json();
                setCommodityCategoryDistribution(data);
                // Reset to first category if current selection doesn't exist
                if (data && data.length > 0) {
                    const categoryExists = data.some((cat: CommodityCategoryDistribution) => 
                        cat.commodity_category_name === selectedCommodityCategory
                    );
                    if (!categoryExists || !selectedCommodityCategory) {
                        setSelectedCommodityCategory(data[0].commodity_category_name);
                    }
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, [selectedBarangay, dateFromProp, dateToProp]);

    useEffect(() => {
        const fetchGenderData = async () => {
            try {
                const url = selectedGenderBarangay === "all" 
                    ? `/farmer-gender-distribution?date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`
                    : `/farmer-gender-distribution?barangay_id=${selectedGenderBarangay}&date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`;
                const response = await fetch(url);
                const data = await response.json();
                setGenderDistribution(data);
            } catch (error) {
                console.error("Error fetching gender distribution data: ", error);
            }
        };
        fetchGenderData();
    }, [selectedGenderBarangay, dateFromProp, dateToProp]);

    useEffect(() => {
        const fetchAllocationVsDamageData = async () => {
            try {
                const url = `/allocation-vs-damage-alignment?date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`;
                const response = await fetch(url);
                const data = await response.json();
                setAllocationVsDamageData(data);
            } catch (error) {
                console.error("Error fetching allocation vs damage data: ", error);
            }
        };
        fetchAllocationVsDamageData();
    }, [dateFromProp, dateToProp]);

    useEffect(() => {
        const fetchPolicyEffectivenessData = async () => {
            try {
                const url = `/policy-effectiveness-analysis?date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`;
                const response = await fetch(url);
                const data = await response.json();
                setPolicyEffectivenessData(data);
            } catch (error) {
                console.error("Error fetching policy effectiveness data: ", error);
            }
        };
        fetchPolicyEffectivenessData();
    }, [dateFromProp, dateToProp]);

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

    // Use farmersPerCommodity if available, otherwise fallback to registered/unregistered
    const farmerCount = farmersPerCommodity && farmersPerCommodity.length > 0 
        ? farmersPerCommodity 
        : [
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

    const validDistributionTypes = [
        "allocations",
        "commodityCategories",
        "farmers",
    ] as const;

    const isValidDistributionType = (
        value: string
    ): value is (typeof validDistributionTypes)[number] => {
        return validDistributionTypes.includes(value as any);
    };

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

            <div className="flex flex-col sm:flex-row mb-5 gap-3 sm:gap-4 items-stretch sm:items-end">
                <div className="flex flex-col flex-1 sm:flex-initial">
                    <label className="text-sm font-medium mb-1 dark:text-white">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={dateFromState}
                        onChange={(e) => {
                            setDateFromState(e.target.value);
                        }}
                        className="rounded-[12px] focus:ring-green-600 focus:outline-none dark:text-white dark:focus:ring-green-400 dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] text-[15px] w-full sm:w-[200px] cursor-pointer outline-none"
                    />
                </div>
                <div className="flex flex-col flex-1 sm:flex-initial">
                    <label className="text-sm font-medium mb-1 dark:text-white">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={dateToState}
                        onChange={(e) => {
                            setDateToState(e.target.value);
                        }}
                        className="rounded-[12px] focus:ring-green-600 focus:outline-none dark:text-white dark:focus:ring-green-400 dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] text-[15px] w-full sm:w-[200px] cursor-pointer outline-none"
                    />
                </div>
                <button
                    onClick={() => {
                        if (dateFromState && dateToState) {
                            router.get("/dashboard", {
                                date_from: dateFromState,
                                date_to: dateToState,
                            });
                        }
                    }}
                    disabled={!dateFromState || !dateToState}
                    className="rounded-[12px] bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 text-[15px] h-[42px] whitespace-nowrap"
                >
                    Apply Filter
                </button>
                {(dateFromProp || dateToProp) && (
                    <button
                        onClick={() => {
                            setDateFromState('');
                            setDateToState('');
                            router.get("/dashboard");
                        }}
                        className="rounded-[12px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-[15px] h-[42px] whitespace-nowrap"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            <div className="">
                {/* KPI Cards Section */}
                {kpiData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <FarmerKPICard
                            total={kpiData.farmers.total}
                            percentages={kpiData.farmers.percentages}
                            counts={kpiData.farmers.counts}
                        />
                        <FarmsKPICard
                            total={kpiData.farms.total}
                            topCommodity={kpiData.farms.topCommodity}
                            avgFarmSize={kpiData.farms.avgFarmSize}
                            avgFarmsPerBarangay={kpiData.farms.avgFarmsPerBarangay}
                            avgFarmsPerFarmer={kpiData.farms.avgFarmsPerFarmer}
                        />
                        <CropDamageKPICard
                            percentage={kpiData.cropDamage.percentage}
                            intensityPercentages={kpiData.cropDamage.intensityPercentages}
                            mostAffectedCommodity={kpiData.cropDamage.mostAffectedCommodity}
                            mostImpactedGroup={kpiData.cropDamage.mostImpactedGroup}
                            topCropDamageCause={kpiData.cropDamage.topCropDamageCause}
                            mostAffectedBarangay={kpiData.cropDamage.mostAffectedBarangay}
                        />
                        <AllocationCoverageKPICard
                            percentage={kpiData.allocationCoverage.percentage}
                            totalPlanned={kpiData.allocationCoverage.totalPlanned}
                            totalDelivered={kpiData.allocationCoverage.totalDelivered}
                            topAllocationType={kpiData.allocationCoverage.topAllocationType}
                            topAllocationSource={kpiData.allocationCoverage.topAllocationSource}
                            topAllocatedCommodity={kpiData.allocationCoverage.topAllocatedCommodity}
                            avgAllocationPerFarm={kpiData.allocationCoverage.avgAllocationPerFarm}
                            topAllocatedBarangays={kpiData.allocationCoverage.topAllocatedBarangays}
                        />
                    </div>
                )}

                <div className="mb-4" id="farmer">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="Farmers per Commodity Distribution" className="w-full">
                            <div>
                                <div>
                                    <h1 className="font-semibold text-xl sm:text-2xl text-green-700">
                                        Total: {totalFarmers.toLocaleString()}
                                    </h1>

                                    <div className="p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto">
                                        {farmerCount.length > 0 ? (() => {
                                            const total = farmerCount.reduce((sum, item) => sum + item.value, 0);
                                            return farmerCount.slice(0, 5).map((item, index) => {
                                                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(2) : 0;
                                                return (
                                                    <span key={index} className="flex justify-between text-sm dark:text-white mb-2">
                                                        <span>{item.name}</span>
                                                        <span>
                                                            {item.value.toLocaleString()} ({percentage}%)
                                                        </span>
                                                    </span>
                                                );
                                            });
                                        })() : (() => {
                                            const total = registeredFarmers + unregisteredFarmers;
                                            const registeredPercentage = total > 0 ? ((registeredFarmers / total) * 100).toFixed(2) : 0;
                                            const unregisteredPercentage = total > 0 ? ((unregisteredFarmers / total) * 100).toFixed(2) : 0;
                                            return (
                                                <>
                                                    <span className="flex justify-between text-sm dark:text-white">
                                                        <span>Registered</span>
                                                        <span>
                                                            {registeredFarmers.toLocaleString()} ({registeredPercentage}%)
                                                        </span>
                                                    </span>
                                                    <span className="flex justify-between text-sm dark:text-white">
                                                        <span>Unregistered</span>
                                                        <span>
                                                            {unregisteredFarmers.toLocaleString()} ({unregisteredPercentage}%)
                                                        </span>
                                                    </span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <br />
                                <div>
                                    <PieChart data={farmerCount} />
                                </div>
                            </div>
                        </Card>

                        <Card title="Allocations Distribution" className="w-full">
                            <h1 className="font-semibold text-xl sm:text-2xl text-green-700">
                                Total: {totalAllocations.toLocaleString()}
                            </h1>

                            <div className="p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4 dark:text-white">
                                {Array.isArray(data) && data.length > 0 ? (() => {
                                    const total = data.reduce((sum, item) => sum + item.value, 0);
                                    return data.map((d, index) => {
                                        const percentage = total > 0 ? ((d.value / total) * 100).toFixed(2) : 0;
                                        return (
                                            <div
                                                key={index}
                                                className="flex justify-between text-sm mb-2"
                                            >
                                                <span>{d.name}</span>
                                                <span>
                                                    {d.value.toLocaleString()} ({percentage}%)
                                                </span>
                                            </div>
                                        );
                                    });
                                })() : (
                                    <p className="text-gray-500">
                                        No data available
                                    </p>
                                )}
                            </div>

                            <div>
                                <PieChart data={data} />
                            </div>
                        </Card>

                        <Card title="Farmers Gender Distribution" className="w-full">
                            <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex flex-col flex-1 sm:flex-initial">
                                    <label className="text-sm font-medium mb-1 dark:text-white">
                                        Barangay
                                    </label>
                                    <select
                                        value={selectedGenderBarangay}
                                        onChange={(e) => setSelectedGenderBarangay(e.target.value)}
                                        className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                                    >
                                        <option value="all" className="dark:text-white">
                                            All
                                        </option>
                                        {barangays.map((barangay) => (
                                            <option
                                                key={barangay.id}
                                                value={barangay.id}
                                                className="dark:text-white"
                                            >
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {genderDistribution && (
                                <>
                                    <h1 className="font-semibold text-lg sm:text-xl text-green-600 mb-4">
                                        Total: {genderDistribution.total.toLocaleString()}
                                    </h1>
                                    <div className="p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4">
                                        <ul>
                                            <li className="mb-2 flex justify-between dark:text-white">
                                                <span>Male</span>
                                                <span>
                                                    {genderDistribution.male.toLocaleString()} ({genderDistribution.malePercentage}%)
                                                </span>
                                            </li>
                                            <li className="mb-2 flex justify-between dark:text-white">
                                                <span>Female</span>
                                                <span>
                                                    {genderDistribution.female.toLocaleString()} ({genderDistribution.femalePercentage}%)
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <PieChart data={[
                                            { name: 'Male', value: genderDistribution.male },
                                            { name: 'Female', value: genderDistribution.female },
                                        ]} />
                                    </div>
                                </>
                            )}
                        </Card>

                        <Card title="Commodity Distribution" className="w-full capitalize">
                            <div id="commodities">
                                <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex flex-col flex-1 sm:flex-initial">
                                <label className="text-sm font-medium mb-1 dark:text-white">
                                    Commodity Category
                                </label>
                                <select
                                    value={selectedCommodityCategory}
                                    onChange={(e) => setSelectedCommodityCategory(e.target.value)}
                                    className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                                >
                                    {commodityCategoryDistribution?.map((category) => (
                                        <option
                                            key={category.commodity_category_name}
                                            value={category.commodity_category_name}
                                            className="dark:text-white capitalize"
                                        >
                                            {category.commodity_category_name}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className="flex flex-col flex-1 sm:flex-initial">
                                <label className="text-sm font-medium mb-1 dark:text-white">
                                    Barangay
                                </label>
                                <select
                                    value={selectedBarangay}
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                    className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
                                >
                                    <option value="all" className="dark:text-white">
                                        All
                                    </option>
                                    {barangays.map((barangay) => (
                                        <option
                                            key={barangay.id}
                                            value={barangay.id}
                                            className="dark:text-white"
                                        >
                                            {barangay.name}
                                        </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            {commodityCategoryDistribution && selectedCommodityCategory && (() => {
                                const selectedCategory = commodityCategoryDistribution.find(
                                    (cat) => cat.commodity_category_name === selectedCommodityCategory
                                );
                                
                                if (!selectedCategory) return null;
                                
                                const chartData = selectedCategory.commodities.map(
                                    (commodity: {
                                        commodity_name: string;
                                        commodity_total: number;
                                    }) => ({
                                        name: commodity.commodity_name,
                                        value: commodity.commodity_total,
                                    })
                                );
                                
                                return (
                                    <>
                                        <h1 className="font-semibold text-lg sm:text-xl text-green-600 mb-4">
                                            Total: {selectedCategory.commodity_category_total.toLocaleString()}
                                        </h1>
                                        <div>
                                            <div className="p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4">
                                                <ul>
                                                    {selectedCategory.commodities.map((commodity) => {
                                                        const percentage = selectedCategory.commodity_category_total > 0 
                                                            ? ((commodity.commodity_total / selectedCategory.commodity_category_total) * 100).toFixed(2) 
                                                            : 0;
                                                        return (
                                                            <li
                                                                key={commodity.commodity_name}
                                                                className="mb-2 flex justify-between dark:text-white"
                                                            >
                                                                <span>{commodity.commodity_name}</span>
                                                                <span>
                                                                    {commodity.commodity_total.toLocaleString()} ({percentage}%)
                                                                </span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div>
                                                <PieChart data={chartData} />
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mb-4">
                    <Card 
                        title={<AllocationVsDamageTitle />}
                        className="w-full"
                    >
                        <AllocationVsDamageChart data={allocationVsDamageData} />
                    </Card>
                </div>

                <div
                    className="grid grid-cols-1 mb-4"
                    id="geospatial"
                >
                    <div>
                        <Card title="Map of Digos City, Davao del Sur">
                            <div>
                                <Heatmap
                                    heatmapData={heatmapData}
                                    commodityCategories={commodityCategories}
                                    allocationType={allocationType}
                                    cropDamageCauses={cropDamageCauses || []}
                                />
                            </div>
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
                                    className="rounded-[12px] border-slate-500 w-[170px] dark:text-white mb-5 cursor-pointer dark:border-green-600 dark:bg-[#0D1A25] "
                                >
                                    <option
                                        value="allocations"
                                        className="dark:text-white"
                                    >
                                        Allocations
                                    </option>
                                    <option
                                        value="farmers"
                                        className="dark:text-white"
                                    >
                                        Farmers
                                    </option>
                                    {commodityCategories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={`commodity_categories_${category.name}`}
                                            className="dark:text-white"
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <GroupedBarChart
                                data={heatmapData}
                                distributionType={
                                    isValidDistributionType(distributionType)
                                        ? distributionType
                                        : "allocations"
                                }
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
