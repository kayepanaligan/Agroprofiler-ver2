import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Card from "@/Components/Card";
import { useEffect, useState } from "react";
import PieChart from "@/Components/PieChart";
import Heatmap from "@/Components/Heatmap";
import { HelpCircle } from "lucide-react";
import axios from "axios";
import GroupedBarChart from "@/Components/GroupedBarChart";
import { FarmerKPICard, FarmsKPICard, CropDamageKPICard, AllocationCoverageKPICard, } from "@/Components/KPICard";
import { barangays } from "@/Utils/brgy";
import AllocationVsDamageChart from "@/Components/AllocationVsDamageChart";
import PolicyEffectivenessChart from "@/Components/PolicyEffectivenessChart";
const PolicyEffectivenessTitle = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: "Policy Effectiveness Analysis" }), _jsxs("div", { className: "relative", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(HelpCircle, { className: "w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" }), showTooltip && (_jsxs("div", { className: "absolute left-0 top-full mt-2 w-80 p-3 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50", children: [_jsx("div", { className: "absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800 dark:border-b-gray-900" }), _jsx("p", { className: "mb-2", children: "This scatter plot visualizes the correlation between crop damage and funding allocation per barangay." }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "The Trend Line:" }), " Represents the \"ideal\" allocation strategy where funding increases linearly with damage."] }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Outliers:" }), " Barangays significantly above the line are receiving more funding than their relative damage suggests, while those significantly below the line may be under-resourced relative to their needs."] }), _jsx("p", { className: "text-xs", children: "Hover over each point to see detailed information, expected allocation, and deviation from the trend." })] }))] })] }));
};
export default function Dashboard({ auth, children, totalAllocations, commoditiesDistribution, registeredFarmers, unregisteredFarmers, totalFarmers, farmersPerCommodity = [], commodityCounts, allocationType, data, dateFrom: dateFromProp = '', dateTo: dateToProp = '', barangayData, heatmapData, highValueCounts, commodityCategories, cropDamageCauses = [], kpiData, ageGroupData = [], }) {
    const [distributionType, setDistributionType] = useState("allocations");
    const [farmersData, setFarmersData] = useState(null);
    const [allocationsData, setAllocationsData] = useState(null);
    const [allocationsDistributionData, setAllocationsDistributionData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [dateFromState, setDateFromState] = useState(dateFromProp || '');
    const [dateToState, setDateToState] = useState(dateToProp || '');
    const subcategories = {
        farmers: ["all", "registered", "unregistered"],
    };
    const pieData = [
        { name: "Registered", value: registeredFarmers },
        { name: "Unregistered", value: unregisteredFarmers },
    ];
    const [geoData, setGeoData] = useState(null);
    const [distributionData, setDistributionData] = useState(null);
    const [farmersDistributionData, setFarmersDistributionData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/farmers");
                const data = await response.json();
                setFarmersDistributionData(data);
            }
            catch (error) {
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
            }
            catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);
    const [commodityCategoryDistribution, setCommodityCategoryDistribution] = useState(null);
    const [selectedCommodityCategory, setSelectedCommodityCategory] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("all");
    const [selectedGenderBarangay, setSelectedGenderBarangay] = useState("all");
    const [genderDistribution, setGenderDistribution] = useState(null);
    const [allocationVsDamageData, setAllocationVsDamageData] = useState([]);
    const [policyEffectivenessData, setPolicyEffectivenessData] = useState([]);
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
                const url = selectedBarangay === "all"
                    ? "/commoditycategorycounts"
                    : `/commoditycategorycounts?barangay_id=${selectedBarangay}`;
                const response = await fetch(url);
                const data = await response.json();
                setCommodityCategoryDistribution(data);
                // Reset to first category if current selection doesn't exist
                if (data && data.length > 0) {
                    const categoryExists = data.some((cat) => cat.commodity_category_name === selectedCommodityCategory);
                    if (!categoryExists || !selectedCommodityCategory) {
                        setSelectedCommodityCategory(data[0].commodity_category_name);
                    }
                }
            }
            catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, [selectedBarangay]);
    useEffect(() => {
        const fetchGenderData = async () => {
            try {
                const url = selectedGenderBarangay === "all"
                    ? `/farmer-gender-distribution?date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`
                    : `/farmer-gender-distribution?barangay_id=${selectedGenderBarangay}&date_from=${dateFromProp || ''}&date_to=${dateToProp || ''}`;
                const response = await fetch(url);
                const data = await response.json();
                setGenderDistribution(data);
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
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
    const [yearss, setYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("all");
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
    ];
    const isValidDistributionType = (value) => {
        return validDistributionTypes.includes(value);
    };
    return (_jsxs(AuthenticatedLayout, { user: auth.user, header: _jsx("h2", { className: "text-[24px] block font-semibold text-green-600 leading-tight", children: "Dashboard" }), children: [_jsx(Head, { title: "Dashboard" }), _jsxs("div", { className: "flex flex-col sm:flex-row mb-5 gap-3 sm:gap-4 items-stretch sm:items-end", children: [_jsxs("div", { className: "flex flex-col flex-1 sm:flex-initial", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "From Date" }), _jsx("input", { type: "date", value: dateFromState, onChange: (e) => {
                                    setDateFromState(e.target.value);
                                }, className: "rounded-[12px] focus:ring-green-600 focus:outline-none dark:text-white dark:focus:ring-green-400 dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] text-[15px] w-full sm:w-[200px] cursor-pointer outline-none" })] }), _jsxs("div", { className: "flex flex-col flex-1 sm:flex-initial", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "To Date" }), _jsx("input", { type: "date", value: dateToState, onChange: (e) => {
                                    setDateToState(e.target.value);
                                }, className: "rounded-[12px] focus:ring-green-600 focus:outline-none dark:text-white dark:focus:ring-green-400 dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] text-[15px] w-full sm:w-[200px] cursor-pointer outline-none" })] }), _jsx("button", { onClick: () => {
                            if (dateFromState && dateToState) {
                                router.get("/dashboard", {
                                    date_from: dateFromState,
                                    date_to: dateToState,
                                });
                            }
                        }, disabled: !dateFromState || !dateToState, className: "rounded-[12px] bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 text-[15px] h-[42px] whitespace-nowrap", children: "Apply Filter" }), (dateFromProp || dateToProp) && (_jsx("button", { onClick: () => {
                            setDateFromState('');
                            setDateToState('');
                            router.get("/dashboard");
                        }, className: "rounded-[12px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-[15px] h-[42px] whitespace-nowrap", children: "Clear Filter" }))] }), _jsxs("div", { className: "", children: [kpiData && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsx(FarmerKPICard, { total: kpiData.farmers.total, percentages: kpiData.farmers.percentages, counts: kpiData.farmers.counts }), _jsx(FarmsKPICard, { total: kpiData.farms.total, topCommodity: kpiData.farms.topCommodity, avgFarmSize: kpiData.farms.avgFarmSize, avgFarmsPerBarangay: kpiData.farms.avgFarmsPerBarangay, avgFarmsPerFarmer: kpiData.farms.avgFarmsPerFarmer }), _jsx(CropDamageKPICard, { percentage: kpiData.cropDamage.percentage, intensityPercentages: kpiData.cropDamage.intensityPercentages, mostAffectedCommodity: kpiData.cropDamage.mostAffectedCommodity, mostImpactedGroup: kpiData.cropDamage.mostImpactedGroup, topCropDamageCause: kpiData.cropDamage.topCropDamageCause, mostAffectedBarangay: kpiData.cropDamage.mostAffectedBarangay }), _jsx(AllocationCoverageKPICard, { percentage: kpiData.allocationCoverage.percentage, totalPlanned: kpiData.allocationCoverage.totalPlanned, totalDelivered: kpiData.allocationCoverage.totalDelivered, topAllocationType: kpiData.allocationCoverage.topAllocationType, topAllocationSource: kpiData.allocationCoverage.topAllocationSource, topAllocatedCommodity: kpiData.allocationCoverage.topAllocatedCommodity, avgAllocationPerFarm: kpiData.allocationCoverage.avgAllocationPerFarm, topAllocatedBarangays: kpiData.allocationCoverage.topAllocatedBarangays })] })), _jsx("div", { className: "mb-4", id: "farmer", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(Card, { title: "Farmers per Commodity Distribution", className: "w-full", children: _jsxs("div", { children: [_jsxs("div", { children: [_jsxs("h1", { className: "font-semibold text-xl sm:text-2xl text-green-700", children: ["Total: ", totalFarmers.toLocaleString()] }), _jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto", children: farmerCount.length > 0 ? (() => {
                                                            const total = farmerCount.reduce((sum, item) => sum + item.value, 0);
                                                            return farmerCount.slice(0, 5).map((item, index) => {
                                                                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(2) : 0;
                                                                return (_jsxs("span", { className: "flex justify-between text-sm dark:text-white mb-2", children: [_jsx("span", { children: item.name }), _jsxs("span", { children: [item.value.toLocaleString(), " (", percentage, "%)"] })] }, index));
                                                            });
                                                        })() : (() => {
                                                            const total = registeredFarmers + unregisteredFarmers;
                                                            const registeredPercentage = total > 0 ? ((registeredFarmers / total) * 100).toFixed(2) : 0;
                                                            const unregisteredPercentage = total > 0 ? ((unregisteredFarmers / total) * 100).toFixed(2) : 0;
                                                            return (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex justify-between text-sm dark:text-white", children: [_jsx("span", { children: "Registered" }), _jsxs("span", { children: [registeredFarmers.toLocaleString(), " (", registeredPercentage, "%)"] })] }), _jsxs("span", { className: "flex justify-between text-sm dark:text-white", children: [_jsx("span", { children: "Unregistered" }), _jsxs("span", { children: [unregisteredFarmers.toLocaleString(), " (", unregisteredPercentage, "%)"] })] })] }));
                                                        })() })] }), _jsx("br", {}), _jsx("div", { children: _jsx(PieChart, { data: farmerCount }) })] }) }), _jsxs(Card, { title: "Allocations Distribution", className: "w-full", children: [_jsxs("h1", { className: "font-semibold text-xl sm:text-2xl text-green-700", children: ["Total: ", totalAllocations.toLocaleString()] }), _jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4 dark:text-white", children: Array.isArray(data) && data.length > 0 ? (() => {
                                                const total = data.reduce((sum, item) => sum + item.value, 0);
                                                return data.map((d, index) => {
                                                    const percentage = total > 0 ? ((d.value / total) * 100).toFixed(2) : 0;
                                                    return (_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { children: d.name }), _jsxs("span", { children: [d.value.toLocaleString(), " (", percentage, "%)"] })] }, index));
                                                });
                                            })() : (_jsx("p", { className: "text-gray-500", children: "No data available" })) }), _jsx("div", { children: _jsx(PieChart, { data: data }) })] }), _jsxs(Card, { title: "Farmers Gender Distribution", className: "w-full", children: [_jsx("div", { className: "mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4", children: _jsxs("div", { className: "flex flex-col flex-1 sm:flex-initial", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Barangay" }), _jsxs("select", { value: selectedGenderBarangay, onChange: (e) => setSelectedGenderBarangay(e.target.value), className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "all", className: "dark:text-white", children: "All" }), barangays.map((barangay) => (_jsx("option", { value: barangay.id, className: "dark:text-white", children: barangay.name }, barangay.id)))] })] }) }), genderDistribution && (_jsxs(_Fragment, { children: [_jsxs("h1", { className: "font-semibold text-lg sm:text-xl text-green-600 mb-4", children: ["Total: ", genderDistribution.total.toLocaleString()] }), _jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4", children: _jsxs("ul", { children: [_jsxs("li", { className: "mb-2 flex justify-between dark:text-white", children: [_jsx("span", { children: "Male" }), _jsxs("span", { children: [genderDistribution.male.toLocaleString(), " (", genderDistribution.malePercentage, "%)"] })] }), _jsxs("li", { className: "mb-2 flex justify-between dark:text-white", children: [_jsx("span", { children: "Female" }), _jsxs("span", { children: [genderDistribution.female.toLocaleString(), " (", genderDistribution.femalePercentage, "%)"] })] })] }) }), _jsx("div", { children: _jsx(PieChart, { data: [
                                                            { name: 'Male', value: genderDistribution.male },
                                                            { name: 'Female', value: genderDistribution.female },
                                                        ] }) })] }))] }), _jsx(Card, { title: "Commodity Distribution", className: "w-full capitalize", children: _jsxs("div", { id: "commodities", children: [_jsxs("div", { className: "mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4", children: [_jsxs("div", { className: "flex flex-col flex-1 sm:flex-initial", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Commodity Category" }), _jsx("select", { value: selectedCommodityCategory, onChange: (e) => setSelectedCommodityCategory(e.target.value), className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: commodityCategoryDistribution?.map((category) => (_jsx("option", { value: category.commodity_category_name, className: "dark:text-white capitalize", children: category.commodity_category_name }, category.commodity_category_name))) })] }), _jsxs("div", { className: "flex flex-col flex-1 sm:flex-initial", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Barangay" }), _jsxs("select", { value: selectedBarangay, onChange: (e) => setSelectedBarangay(e.target.value), className: "rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]", children: [_jsx("option", { value: "all", className: "dark:text-white", children: "All" }), barangays.map((barangay) => (_jsx("option", { value: barangay.id, className: "dark:text-white", children: barangay.name }, barangay.id)))] })] })] }), commodityCategoryDistribution && selectedCommodityCategory && (() => {
                                                const selectedCategory = commodityCategoryDistribution.find((cat) => cat.commodity_category_name === selectedCommodityCategory);
                                                if (!selectedCategory)
                                                    return null;
                                                const chartData = selectedCategory.commodities.map((commodity) => ({
                                                    name: commodity.commodity_name,
                                                    value: commodity.commodity_total,
                                                }));
                                                return (_jsxs(_Fragment, { children: [_jsxs("h1", { className: "font-semibold text-lg sm:text-xl text-green-600 mb-4", children: ["Total: ", selectedCategory.commodity_category_total.toLocaleString()] }), _jsxs("div", { children: [_jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4", children: _jsx("ul", { children: selectedCategory.commodities.map((commodity) => {
                                                                            const percentage = selectedCategory.commodity_category_total > 0
                                                                                ? ((commodity.commodity_total / selectedCategory.commodity_category_total) * 100).toFixed(2)
                                                                                : 0;
                                                                            return (_jsxs("li", { className: "mb-2 flex justify-between dark:text-white", children: [_jsx("span", { children: commodity.commodity_name }), _jsxs("span", { children: [commodity.commodity_total.toLocaleString(), " (", percentage, "%)"] })] }, commodity.commodity_name));
                                                                        }) }) }), _jsx("div", { children: _jsx(PieChart, { data: chartData }) })] })] }));
                                            })()] }) })] }) }), _jsx("div", { className: "mb-4", children: _jsxs(Card, { title: "Allocation vs. Damage Alignment", className: "w-full", children: [_jsxs("div", { className: "mb-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsx("p", { className: "mb-2", children: "This chart compares allocation amounts (blue bars) with crop damage percentages (red bars) per barangay." }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "What to look for:" }), " Ideally, the heights of red bars (Damage %) and blue bars (Allocation) should follow a similar pattern. Discrepancies indicate areas where allocation policy might need adjustment."] }), _jsx("p", { className: "text-xs", children: "Hover over each bar to see detailed information and alignment status." })] }), _jsx(AllocationVsDamageChart, { data: allocationVsDamageData })] }) }), _jsx("div", { className: "mb-4", children: _jsx(Card, { title: _jsx(PolicyEffectivenessTitle, {}), className: "w-full", children: _jsx(PolicyEffectivenessChart, { data: policyEffectivenessData }) }) }), _jsx("div", { className: "grid grid-cols-1 mb-4", id: "geospatial", children: _jsx("div", { children: _jsx(Card, { title: "Map of Digos City, Davao del Sur", children: _jsx("div", { children: _jsx(Heatmap, { heatmapData: heatmapData, commodityCategories: commodityCategories, allocationType: allocationType, cropDamageCauses: cropDamageCauses || [] }) }) }) }) }), _jsx("div", { children: _jsx(Card, { title: "Barangay Data Distribution", children: _jsxs("div", { children: [_jsx("div", { className: "p-5", children: _jsxs("select", { onChange: (e) => setDistributionType(e.target.value), className: "rounded-[12px] border-slate-500 w-[170px] dark:text-white mb-5 cursor-pointer dark:border-green-600 dark:bg-[#0D1A25] ", children: [_jsx("option", { value: "allocations", className: "dark:text-white", children: "Allocations" }), _jsx("option", { value: "farmers", className: "dark:text-white", children: "Farmers" }), commodityCategories.map((category) => (_jsx("option", { value: `commodity_categories_${category.name}`, className: "dark:text-white", children: category.name }, category.id)))] }) }), _jsx(GroupedBarChart, { data: heatmapData, distributionType: isValidDistributionType(distributionType)
                                            ? distributionType
                                            : "allocations" })] }) }) })] })] }));
}
