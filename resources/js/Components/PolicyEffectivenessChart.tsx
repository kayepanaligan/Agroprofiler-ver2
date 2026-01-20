import React, { useEffect, useState } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
    LabelList,
} from "recharts";

interface PolicyEffectivenessData {
    barangay: string;
    allocationAmount: number;
    damagePercentage: number;
    totalFarms: number;
    damagedFarms: number;
}

interface PolicyEffectivenessChartProps {
    data: PolicyEffectivenessData[];
}

const PolicyEffectivenessChart: React.FC<PolicyEffectivenessChartProps> = ({
    data = [],
}) => {
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Calculate trend line (linear regression)
    const calculateTrendLine = () => {
        if (data.length === 0) return null;

        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;

        data.forEach((item) => {
            const x = item.damagePercentage;
            const y = item.allocationAmount;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Get min and max damage percentages for line endpoints
        const minDamage = Math.min(...data.map(d => d.damagePercentage));
        const maxDamage = Math.max(...data.map(d => d.damagePercentage));

        return {
            slope,
            intercept,
            minX: minDamage,
            maxX: maxDamage,
            minY: slope * minDamage + intercept,
            maxY: slope * maxDamage + intercept,
        };
    };

    const trendLine = calculateTrendLine();

    // Calculate distance from trend line for each point to identify outliers
    const dataWithDistance = data.map((item) => {
        if (!trendLine) return { ...item, distance: 0, isOutlier: false };
        
        const expectedY = trendLine.slope * item.damagePercentage + trendLine.intercept;
        const actualY = item.allocationAmount;
        const distance = actualY - expectedY;
        
        // Calculate standard deviation of distances
        const distances = data.map(d => {
            const expY = trendLine.slope * d.damagePercentage + trendLine.intercept;
            return d.allocationAmount - expY;
        });
        const meanDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - meanDistance, 2), 0) / distances.length;
        const stdDev = Math.sqrt(variance);
        
        // Mark as outlier if distance is more than 1.5 standard deviations
        const isOutlier = Math.abs(distance) > 1.5 * stdDev;
        
        return {
            ...item,
            distance,
            isOutlier,
            expectedAllocation: expectedY,
        };
    });

    const scatterData = dataWithDistance.map((item) => ({
        x: item.damagePercentage,
        y: item.allocationAmount,
        barangay: item.barangay,
        totalFarms: item.totalFarms,
        damagedFarms: item.damagedFarms,
        distance: item.distance,
        isOutlier: item.isOutlier,
        expectedAllocation: item.expectedAllocation,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;
            const barangay = point.barangay;
            const damagePercentage = point.x;
            const allocationAmount = point.y;
            const expectedAllocation = point.expectedAllocation || 0;
            const deviation = point.distance || 0;
            const isOutlier = point.isOutlier;
            const totalFarms = point.totalFarms;
            const damagedFarms = point.damagedFarms;

            // Determine position relative to trend line
            let positionStatus = '';
            let positionColor = '';
            if (deviation > 0) {
                positionStatus = 'Above trend line - Receiving more funding than expected';
                positionColor = '#3b82f6';
            } else if (deviation < 0) {
                positionStatus = 'Below trend line - May be under-resourced';
                positionColor = '#ef4444';
            } else {
                positionStatus = 'On trend line - Allocation aligns with damage';
                positionColor = '#10b981';
            }

            return (
                <div
                    style={{
                        backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                        color: isDarkMode ? "white" : "black",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: isDarkMode
                            ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
                            : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        minWidth: "280px",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            marginBottom: "8px",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                    >
                        {barangay}
                    </p>
                    <p style={{ margin: 0, marginBottom: "4px", fontSize: "12px" }}>
                        <strong>Damage:</strong> {damagePercentage.toFixed(2)}% ({damagedFarms} / {totalFarms} farms)
                    </p>
                    <p style={{ margin: 0, marginBottom: "4px", fontSize: "12px" }}>
                        <strong>Allocation:</strong> ₱{allocationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: 0, marginBottom: "4px", fontSize: "12px" }}>
                        <strong>Expected (Trend):</strong> ₱{expectedAllocation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: 0, marginBottom: "4px", fontSize: "12px" }}>
                        <strong>Deviation:</strong> ₱{Math.abs(deviation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {deviation > 0 ? 'above' : 'below'} expected
                    </p>
                    {isOutlier && (
                        <p style={{ margin: 0, marginTop: "4px", fontSize: "11px", color: "#f59e0b", fontWeight: "600" }}>
                            ⚠️ Significant outlier detected
                        </p>
                    )}
                    <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}` }}>
                        <p style={{ margin: 0, fontSize: "11px", color: positionColor, fontWeight: "600" }}>
                            {positionStatus}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No data available
            </div>
        );
    }

    // Create trend line data points for ReferenceLine
    const trendLinePoints = trendLine ? [
        { x: trendLine.minX, y: trendLine.minY },
        { x: trendLine.maxX, y: trendLine.maxY },
    ] : [];

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={500}>
                <ScatterChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Damage Percentage"
                        unit="%"
                        label={{
                            value: 'Damage Percentage (%)',
                            position: 'insideBottom',
                            offset: -5,
                            style: { textAnchor: 'middle', fill: isDarkMode ? '#9ca3af' : '#374151' }
                        }}
                        tick={{
                            fontSize: 12,
                            fill: isDarkMode ? "#9ca3af" : "#374151",
                        }}
                        domain={[0, 'dataMax + 5']}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Allocation Amount"
                        unit="₱"
                        label={{
                            value: 'Allocation Amount (₱)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: isDarkMode ? '#9ca3af' : '#374151' }
                        }}
                        tick={{
                            fontSize: 12,
                            fill: isDarkMode ? "#9ca3af" : "#374151",
                        }}
                        domain={[0, 'dataMax + dataMax * 0.1']}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Legend
                        wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "12px",
                        }}
                    />
                    {/* Trend Line */}
                    {trendLine && (
                        <ReferenceLine
                            segment={[
                                { x: trendLine.minX, y: trendLine.minY },
                                { x: trendLine.maxX, y: trendLine.maxY },
                            ]}
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{ value: "Ideal Allocation Strategy", position: "top", fill: "#10b981", fontSize: 12 }}
                        />
                    )}
                    <Scatter
                        name="Barangay"
                        data={scatterData}
                        fill="#3b82f6"
                    >
                        <LabelList
                            dataKey="barangay"
                            formatter={(value: string) => value}
                            style={{
                                fontSize: 10,
                                fill: isDarkMode ? "#9ca3af" : "#374151",
                            }}
                            position="top"
                        />
                        {scatterData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isOutlier ? "#f59e0b" : "#3b82f6"}
                                r={entry.isOutlier ? 8 : 6}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <strong>Blue dots:</strong> Barangays with normal allocation relative to damage
                </p>
                <p>
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    <strong>Orange dots:</strong> Significant outliers (more than 1.5 standard deviations from trend)
                </p>
                <p>
                    <span className="inline-block w-3 h-3 border-2 border-green-500 mr-2"></span>
                    <strong>Green dashed line:</strong> Ideal allocation strategy (funding increases linearly with damage)
                </p>
                <p className="mt-2 text-xs italic">
                    <strong>Interpretation:</strong> Points above the line receive more funding than their damage suggests. 
                    Points below the line may be under-resourced relative to their damage level.
                </p>
            </div>
        </div>
    );
};

export default PolicyEffectivenessChart;

