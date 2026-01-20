import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Users, Tractor, AlertTriangle, Package, UserCheck, UserX, Heart, UsersRound, Gift } from "lucide-react";
export default function KPICard({ title, mainValue, mainLabel, subheading, tooltip, icon, className = "", color = 'green', }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const colorClasses = {
        green: {
            border: 'dark:border-green-600 border-green-600',
            icon: 'text-green-600',
            text: 'text-green-700 dark:text-green-500',
            iconColor: 'text-green-600',
        },
        yellow: {
            border: 'dark:border-yellow-500 border-yellow-500',
            icon: 'text-yellow-500',
            text: 'text-yellow-600 dark:text-yellow-400',
            iconColor: 'text-yellow-500',
        },
        red: {
            border: 'dark:border-red-500 border-red-500',
            icon: 'text-red-500',
            text: 'text-red-600 dark:text-red-400',
            iconColor: 'text-red-500',
        },
        blue: {
            border: 'dark:border-blue-500 border-blue-500',
            icon: 'text-blue-500',
            text: 'text-blue-600 dark:text-blue-400',
            iconColor: 'text-blue-500',
        },
    };
    const colors = colorClasses[color];
    return (_jsxs("div", { className: `bg-white dark:bg-[#161616] border-[2px] ${colors.border} rounded-[1rem] p-4 sm:p-6 shadow-sm ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("h3", { className: "text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400", children: title }), icon && _jsx("div", { className: `${colors.iconColor} scale-90 sm:scale-100`, children: icon })] }), _jsx("div", { className: "mb-3 sm:mb-4", children: _jsxs("div", { className: `text-2xl sm:text-3xl font-bold ${colors.text} inline-block relative`, onMouseEnter: () => tooltip && setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [mainValue, mainLabel && _jsx("span", { className: "text-base sm:text-lg ml-1 sm:ml-2", children: mainLabel }), tooltip && showTooltip && (_jsx("div", { className: "absolute z-10 mt-2 p-3 bg-gray-800 text-white text-xs font-normal rounded-lg shadow-lg max-w-xs", children: tooltip }))] }) }), subheading && _jsx("div", { className: "text-[10px] sm:text-xs text-gray-600 dark:text-gray-300", children: subheading })] }));
}
export function FarmerKPICard({ total, percentages, counts }) {
    const farmerStats = [
        {
            label: "Registered",
            percentage: percentages.registered,
            count: counts.registered,
            icon: _jsx(UserCheck, { size: 16 }),
            tooltip: "Percentage of farmers who are registered in the system",
        },
        {
            label: "Unregistered",
            percentage: percentages.unregistered,
            count: counts.unregistered,
            icon: _jsx(UserX, { size: 16 }),
            tooltip: "Percentage of farmers who are not yet registered",
        },
        {
            label: "PWD",
            percentage: percentages.pwd,
            count: counts.pwd,
            icon: _jsx(Heart, { size: 16 }),
            tooltip: "Percentage of farmers who are Persons with Disabilities",
        },
        {
            label: "IP",
            percentage: percentages.ip,
            count: counts.ip,
            icon: _jsx(UsersRound, { size: 16 }),
            tooltip: "Percentage of farmers who are Indigenous People",
        },
        {
            label: "4Ps",
            percentage: percentages["4ps"],
            count: counts["4ps"],
            icon: _jsx(Gift, { size: 16 }),
            tooltip: "Percentage of farmers who are 4Ps (Pantawid Pamilyang Pilipino Program) beneficiaries",
        },
    ];
    return (_jsx(KPICard, { title: "Total Farmers", mainValue: total.toLocaleString(), icon: _jsx(Users, { size: 24 }), color: "green", subheading: _jsx("div", { className: "flex flex-wrap gap-2 sm:gap-4 mt-3", children: farmerStats.map((stat, index) => (_jsxs("div", { className: "flex items-center gap-1 sm:gap-2 group relative", title: stat.tooltip, children: [_jsx("div", { className: "text-green-600 dark:text-green-400 scale-75 sm:scale-100", children: stat.icon }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400", children: stat.label }), _jsxs("span", { className: "text-[10px] sm:text-xs font-semibold dark:text-white", children: [stat.percentage, "% (", stat.count, ")"] })] })] }, index))) }) }));
}
export function FarmsKPICard({ total, topCommodity, avgFarmSize, avgFarmsPerBarangay, avgFarmsPerFarmer }) {
    return (_jsx(KPICard, { title: "Total Farms", mainValue: total.toLocaleString(), icon: _jsx(Tractor, { size: 24 }), color: "yellow", subheading: _jsxs("div", { className: "space-y-2 mt-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Top Commodity: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: topCommodity })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Avg Farm Size: " }), _jsxs("span", { className: "text-xs font-semibold dark:text-white", children: [avgFarmSize, " ha"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Avg Farms per Barangay: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: avgFarmsPerBarangay })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Avg Farms per Farmer: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: avgFarmsPerFarmer })] })] }) }));
}
export function CropDamageKPICard({ percentage, intensityPercentages, mostAffectedCommodity, mostImpactedGroup, topCropDamageCause, mostAffectedBarangay, }) {
    const [hoveredIntensity, setHoveredIntensity] = useState(null);
    const intensityData = [
        {
            level: 'high',
            percentage: intensityPercentages?.high ?? 0,
            color: 'bg-red-500',
            tooltip: 'High Intensity: Crop damage affecting more than 50% of the farm area',
        },
        {
            level: 'medium',
            percentage: intensityPercentages?.medium ?? 0,
            color: 'bg-orange-500',
            tooltip: 'Medium Intensity: Crop damage affecting 20-50% of the farm area',
        },
        {
            level: 'low',
            percentage: intensityPercentages?.low ?? 0,
            color: 'bg-yellow-500',
            tooltip: 'Low Intensity: Crop damage affecting less than 20% of the farm area',
        },
    ];
    return (_jsx(KPICard, { title: "Farmers Affected by Crop Damage", mainValue: percentage, mainLabel: "%", tooltip: "Percentage of farmers who have experienced crop damage", icon: _jsx(AlertTriangle, { size: 24 }), color: "red", subheading: _jsxs("div", { className: "space-y-2 mt-3", children: [_jsx("div", { className: "flex items-center gap-2 sm:gap-4 flex-wrap", children: intensityData.map((intensity) => (_jsxs("div", { className: "flex items-center gap-1 sm:gap-2 relative group", onMouseEnter: () => setHoveredIntensity(intensity.level), onMouseLeave: () => setHoveredIntensity(null), children: [_jsx("div", { className: `w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${intensity.color}` }), _jsxs("span", { className: "text-[10px] sm:text-xs font-semibold dark:text-white", children: [intensity.percentage, "%"] }), hoveredIntensity === intensity.level && (_jsxs("div", { className: "absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-[10px] font-normal rounded-lg shadow-lg whitespace-nowrap", children: [intensity.tooltip, _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1", children: _jsx("div", { className: "border-4 border-transparent border-t-gray-800" }) })] }))] }, intensity.level))) }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Most Affected Commodity: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: mostAffectedCommodity })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Most Impacted Group: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: mostImpactedGroup })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Top Crop Damage Cause: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: topCropDamageCause })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Most Affected Barangay: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: mostAffectedBarangay })] })] }) }));
}
export function AllocationCoverageKPICard({ percentage, totalPlanned, totalDelivered, topAllocatedCommodity, avgAllocationPerFarm, topAllocatedBarangays, topAllocationSource, }) {
    return (_jsx(KPICard, { title: "Allocation Distribution Coverage", mainValue: percentage, mainLabel: "%", tooltip: `This represents the percentage of planned allocations (₱${totalPlanned.toLocaleString()}) that have been successfully delivered (₱${totalDelivered.toLocaleString()}) to farmers.`, icon: _jsx(Package, { size: 24 }), color: "blue", subheading: _jsxs("div", { className: "space-y-2 mt-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Top Allocation Source: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: topAllocationSource })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Top Allocated Commodity: " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: topAllocatedCommodity })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Avg Allocation per Farm: " }), _jsxs("span", { className: "text-xs font-semibold dark:text-white", children: ["\u20B1", avgAllocationPerFarm.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "Top Barangay(s): " }), _jsx("span", { className: "text-xs font-semibold dark:text-white", children: topAllocatedBarangays.length > 0 ? topAllocatedBarangays.join(", ") : "N/A" })] })] }) }));
}
