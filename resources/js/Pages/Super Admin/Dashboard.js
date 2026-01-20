import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Card from "@/Components/Card";
import { useEffect, useState } from "react";
import PieChart from "@/Components/PieChart";
import Heatmap from "@/Components/Heatmap";
import axios from "axios";
import GroupedBarChart from "@/Components/GroupedBarChart";
import Histogram from "@/Components/Histogram";
import { FarmerKPICard, FarmsKPICard, CropDamageKPICard, AllocationCoverageKPICard, } from "@/Components/KPICard";
export default function Dashboard({ auth, children, totalAllocations, commoditiesDistribution, registeredFarmers, unregisteredFarmers, totalFarmers, farmersPerCommodity = [], commodityCounts, allocationType, data, dateFrom: dateFromProp = '', dateTo: dateToProp = '', barangayData, heatmapData, highValueCounts, commodityCategories, kpiData, ageGroupData = [], }) {
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/commoditycategorycounts");
                const data = await response.json();
                setCommodityCategoryDistribution(data);
                console.log("commodity categories distribution: ", commodityCategoryDistribution);
            }
            catch (error) {
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
                        }, className: "rounded-[12px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-[15px] h-[42px] whitespace-nowrap", children: "Clear Filter" }))] }), _jsxs("div", { className: "", children: [kpiData && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsx(FarmerKPICard, { total: kpiData.farmers.total, percentages: kpiData.farmers.percentages, counts: kpiData.farmers.counts }), _jsx(FarmsKPICard, { total: kpiData.farms.total, topCommodity: kpiData.farms.topCommodity, avgFarmSize: kpiData.farms.avgFarmSize, avgFarmsPerBarangay: kpiData.farms.avgFarmsPerBarangay, avgFarmsPerFarmer: kpiData.farms.avgFarmsPerFarmer }), _jsx(CropDamageKPICard, { percentage: kpiData.cropDamage.percentage, intensityPercentages: kpiData.cropDamage.intensityPercentages, mostAffectedCommodity: kpiData.cropDamage.mostAffectedCommodity, mostImpactedGroup: kpiData.cropDamage.mostImpactedGroup, topCropDamageCause: kpiData.cropDamage.topCropDamageCause, mostAffectedBarangay: kpiData.cropDamage.mostAffectedBarangay }), _jsx(AllocationCoverageKPICard, { percentage: kpiData.allocationCoverage.percentage, totalPlanned: kpiData.allocationCoverage.totalPlanned, totalDelivered: kpiData.allocationCoverage.totalDelivered, topAllocationSource: kpiData.allocationCoverage.topAllocationSource, topAllocatedCommodity: kpiData.allocationCoverage.topAllocatedCommodity, avgAllocationPerFarm: kpiData.allocationCoverage.avgAllocationPerFarm, topAllocatedBarangays: kpiData.allocationCoverage.topAllocatedBarangays })] })), _jsx("div", { className: "mb-4", id: "farmer", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(Card, { title: "Farmers per Commodity Distribution", className: "w-full", children: _jsxs("div", { children: [_jsxs("div", { children: [_jsxs("h1", { className: "font-semibold text-xl sm:text-2xl text-green-700", children: ["Total: ", totalFarmers.toLocaleString()] }), _jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto", children: farmerCount.length > 0 ? (farmerCount.slice(0, 5).map((item, index) => (_jsxs("span", { className: "flex justify-between text-sm dark:text-white mb-2", children: [_jsx("span", { children: item.name }), _jsx("span", { children: item.value.toLocaleString() })] }, index)))) : (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex justify-between text-sm dark:text-white", children: [_jsx("span", { children: "Registered" }), _jsx("span", { children: registeredFarmers.toLocaleString() })] }), _jsxs("span", { className: "flex justify-between text-sm dark:text-white", children: [_jsx("span", { children: "Unregistered" }), _jsx("span", { children: unregisteredFarmers.toLocaleString() })] })] })) })] }), _jsx("br", {}), _jsx("div", { children: _jsx(PieChart, { data: farmerCount }) })] }) }), _jsxs(Card, { title: "Allocations Distribution", className: "w-full", children: [_jsxs("h1", { className: "font-semibold text-xl sm:text-2xl text-green-700", children: ["Total: ", totalAllocations.toLocaleString()] }), _jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4 dark:text-white", children: Array.isArray(data) && data.length > 0 ? (data.map((d, index) => (_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { children: d.name }), _jsx("span", { children: d.value })] }, index)))) : (_jsx("p", { className: "text-gray-500", children: "No data available" })) }), _jsx("div", { children: _jsx(PieChart, { data: data }) })] }), _jsx(Card, { title: "Age Group Distribution", className: "w-full", children: _jsx(Histogram, { data: ageGroupData, title: "Farmers by Age Group", color: "#10b981" }) })] }) }), _jsx("div", { className: "mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4", id: "commodities", children: commodityCategoryDistribution?.map((category) => {
                            const chartData = category.commodities.map((commodity) => ({
                                name: commodity.commodity_name,
                                value: commodity.commodity_total,
                            }));
                            return (_jsxs(Card, { title: `${category.commodity_category_name} Distribution`, className: "mb-1 capitalize", children: [_jsxs("h1", { className: "font-semibold text-lg sm:text-xl text-green-600", children: ["Total:", " ", category.commodity_category_total.toLocaleString()] }), _jsxs("div", { children: [_jsx("div", { className: "p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-medium h-auto mb-4", children: _jsx("ul", { children: category.commodities.map((commodity) => (_jsxs("li", { className: "mb-2 flex justify-between dark:text-white", children: [_jsx("span", { className: "", children: commodity.commodity_name }), _jsx("span", { children: commodity.commodity_total.toLocaleString() })] }, commodity.commodity_name))) }) }), _jsx("div", { children: _jsx(PieChart, { data: chartData }) })] })] }, category.commodity_category_name));
                        }) }), _jsx("div", { className: "grid grid-cols-1 mb-4", id: "geospatial", children: _jsx("div", { children: _jsx(Card, { title: "Map of Digos City, Davao del Sur", children: _jsx("div", { children: _jsx(Heatmap, { heatmapData: heatmapData, commodityCategories: commodityCategories, allocationType: allocationType }) }) }) }) }), _jsx("div", { children: _jsx(Card, { title: "Barangay Data Distribution", children: _jsxs("div", { children: [_jsx("div", { className: "p-5", children: _jsxs("select", { onChange: (e) => setDistributionType(e.target.value), className: "rounded-[12px] border-slate-500 w-[170px] dark:text-white mb-5 cursor-pointer dark:border-green-600 dark:bg-[#0D1A25] ", children: [_jsx("option", { value: "allocations", className: "dark:text-white", children: "Allocations" }), _jsx("option", { value: "farmers", className: "dark:text-white", children: "Farmers" }), commodityCategories.map((category) => (_jsx("option", { value: `commodity_categories_${category.name}`, className: "dark:text-white", children: category.name }, category.id)))] }) }), _jsx(GroupedBarChart, { data: heatmapData, distributionType: isValidDistributionType(distributionType)
                                            ? distributionType
                                            : "allocations" })] }) }) })] })] }));
}
