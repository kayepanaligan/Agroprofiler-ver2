import React, { useState } from "react";
import { Users, Tractor, AlertTriangle, Package, UserCheck, UserX, Heart, UsersRound, Gift } from "lucide-react";

interface KPICardProps {
    title: string;
    mainValue: string | number;
    mainLabel?: string;
    subheading?: React.ReactNode;
    tooltip?: string;
    icon?: React.ReactNode;
    className?: string;
    color?: 'green' | 'yellow' | 'red' | 'blue';
}

export default function KPICard({
    title,
    mainValue,
    mainLabel,
    subheading,
    tooltip,
    icon,
    className = "",
    color = 'green',
}: KPICardProps) {
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

    return (
        <div
            className={`bg-white dark:bg-[#161616] border-[2px] ${colors.border} rounded-[1rem] p-4 sm:p-6 shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400">{title}</h3>
                {icon && <div className={`${colors.iconColor} scale-90 sm:scale-100`}>{icon}</div>}
            </div>
            <div className="mb-3 sm:mb-4">
                <div
                    className={`text-2xl sm:text-3xl font-bold ${colors.text} inline-block relative`}
                    onMouseEnter={() => tooltip && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {mainValue}
                    {mainLabel && <span className="text-base sm:text-lg ml-1 sm:ml-2">{mainLabel}</span>}
                    {tooltip && showTooltip && (
                        <div className="absolute z-10 mt-2 p-3 bg-gray-800 text-white text-xs font-normal rounded-lg shadow-lg max-w-xs">
                            {tooltip}
                        </div>
                    )}
                </div>
            </div>
            {subheading && <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">{subheading}</div>}
        </div>
    );
}

interface FarmerKPICardProps {
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
}

export function FarmerKPICard({ total, percentages, counts }: FarmerKPICardProps) {
    const farmerStats = [
        {
            label: "Registered",
            percentage: percentages.registered,
            count: counts.registered,
            icon: <UserCheck size={16} />,
            tooltip: "Percentage of farmers who are registered in the system",
        },
        {
            label: "Unregistered",
            percentage: percentages.unregistered,
            count: counts.unregistered,
            icon: <UserX size={16} />,
            tooltip: "Percentage of farmers who are not yet registered",
        },
        {
            label: "PWD",
            percentage: percentages.pwd,
            count: counts.pwd,
            icon: <Heart size={16} />,
            tooltip: "Percentage of farmers who are Persons with Disabilities",
        },
        {
            label: "IP",
            percentage: percentages.ip,
            count: counts.ip,
            icon: <UsersRound size={16} />,
            tooltip: "Percentage of farmers who are Indigenous People",
        },
        {
            label: "4Ps",
            percentage: percentages["4ps"],
            count: counts["4ps"],
            icon: <Gift size={16} />,
            tooltip: "Percentage of farmers who are 4Ps (Pantawid Pamilyang Pilipino Program) beneficiaries",
        },
    ];

    return (
        <KPICard
            title="Total Farmers"
            mainValue={total.toLocaleString()}
            icon={<Users size={24} />}
            color="green"
            subheading={
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-3">
                    {farmerStats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 sm:gap-2 group relative"
                            title={stat.tooltip}
                        >
                            <div className="text-green-600 dark:text-green-400 scale-75 sm:scale-100">{stat.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</span>
                                <span className="text-[10px] sm:text-xs font-semibold dark:text-white">
                                    {stat.percentage}% ({stat.count})
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            }
        />
    );
}

interface FarmsKPICardProps {
    total: number;
    topCommodity: string;
    avgFarmSize: number;
    avgFarmsPerBarangay: number;
    avgFarmsPerFarmer: number;
}

export function FarmsKPICard({ total, topCommodity, avgFarmSize, avgFarmsPerBarangay, avgFarmsPerFarmer }: FarmsKPICardProps) {
    return (
        <KPICard
            title="Total Farms"
            mainValue={total.toLocaleString()}
            icon={<Tractor size={24} />}
            color="yellow"
            subheading={
                <div className="space-y-2 mt-3">
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Top Commodity: </span>
                        <span className="text-xs font-semibold dark:text-white">{topCommodity}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Avg Farm Size: </span>
                        <span className="text-xs font-semibold dark:text-white">{avgFarmSize} ha</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Avg Farms per Barangay: </span>
                        <span className="text-xs font-semibold dark:text-white">{avgFarmsPerBarangay}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Avg Farms per Farmer: </span>
                        <span className="text-xs font-semibold dark:text-white">{avgFarmsPerFarmer}</span>
                    </div>
                </div>
            }
        />
    );
}

interface CropDamageKPICardProps {
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
}

export function CropDamageKPICard({
    percentage,
    intensityPercentages,
    mostAffectedCommodity,
    mostImpactedGroup,
    topCropDamageCause,
    mostAffectedBarangay,
}: CropDamageKPICardProps) {
    const [hoveredIntensity, setHoveredIntensity] = useState<string | null>(null);

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

    return (
        <KPICard
            title="Farmers Affected by Crop Damage"
            mainValue={percentage}
            mainLabel="%"
            tooltip="Percentage of farmers who have experienced crop damage"
            icon={<AlertTriangle size={24} />}
            color="red"
            subheading={
                <div className="space-y-2 mt-3">
                    {/* Intensity indicators */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        {intensityData.map((intensity) => (
                            <div
                                key={intensity.level}
                                className="flex items-center gap-1 sm:gap-2 relative group"
                                onMouseEnter={() => setHoveredIntensity(intensity.level)}
                                onMouseLeave={() => setHoveredIntensity(null)}
                            >
                                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${intensity.color}`}></div>
                                <span className="text-[10px] sm:text-xs font-semibold dark:text-white">
                                    {intensity.percentage}%
                                </span>
                                {hoveredIntensity === intensity.level && (
                                    <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-[10px] font-normal rounded-lg shadow-lg whitespace-nowrap">
                                        {intensity.tooltip}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                            <div className="border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Most Affected Commodity: </span>
                        <span className="text-xs font-semibold dark:text-white">{mostAffectedCommodity}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Most Impacted Group: </span>
                        <span className="text-xs font-semibold dark:text-white">{mostImpactedGroup}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Top Crop Damage Cause: </span>
                        <span className="text-xs font-semibold dark:text-white">{topCropDamageCause}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Most Affected Barangay: </span>
                        <span className="text-xs font-semibold dark:text-white">{mostAffectedBarangay}</span>
                    </div>
                </div>
            }
        />
    );
}

interface AllocationCoverageKPICardProps {
    percentage: number;
    totalPlanned: number;
    totalDelivered: number;
    topAllocatedCommodity: string;
    avgAllocationPerFarm: number;
    topAllocatedBarangays: string[];
    topAllocationSource: string;
}

export function AllocationCoverageKPICard({
    percentage,
    totalPlanned,
    totalDelivered,
    topAllocatedCommodity,
    avgAllocationPerFarm,
    topAllocatedBarangays,
    topAllocationSource,
}: AllocationCoverageKPICardProps) {
    return (
        <KPICard
            title="Allocation Distribution Coverage"
            mainValue={percentage}
            mainLabel="%"
            tooltip={`This represents the percentage of planned allocations (₱${totalPlanned.toLocaleString()}) that have been successfully delivered (₱${totalDelivered.toLocaleString()}) to farmers.`}
            icon={<Package size={24} />}
            color="blue"
            subheading={
                <div className="space-y-2 mt-3">
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Top Allocation Source: </span>
                        <span className="text-xs font-semibold dark:text-white">{topAllocationSource}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Top Allocated Commodity: </span>
                        <span className="text-xs font-semibold dark:text-white">{topAllocatedCommodity}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Avg Allocation per Farm: </span>
                        <span className="text-xs font-semibold dark:text-white">₱{avgAllocationPerFarm.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Top Barangay(s): </span>
                        <span className="text-xs font-semibold dark:text-white">
                            {topAllocatedBarangays.length > 0 ? topAllocatedBarangays.join(", ") : "N/A"}
                        </span>
                    </div>
                </div>
            }
        />
    );
}

