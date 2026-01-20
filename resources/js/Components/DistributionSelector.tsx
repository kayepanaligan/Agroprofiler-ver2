import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";

interface DataPoint {
    barangay: string;
    value: number;
}

interface LineData {
    name: string;
    color: string;
    data: DataPoint[];
}

interface Distribution {
    name: string;
    types: { type: string; color: string }[];
}

interface DistributionSelectorProps {
    distributions: Distribution[];
    getDataForDistribution: (
        distributionName: string,
        barangayData: any
    ) => LineData[];
    barangayData: any;
}

const DistributionSelector: React.FC<DistributionSelectorProps> = ({
    distributions,
    getDataForDistribution,
    barangayData = {},
}) => {
    const [selectedDistribution, setSelectedDistribution] =
        useState<Distribution | null>(null);
    const [lineChartData, setLineChartData] = useState<LineData[]>([]);

    useEffect(() => {
        // Check if the selectedDistribution is already set or the data hasn't changed
        if (selectedDistribution === null && distributions.length > 0) {
            const defaultDistribution = distributions.find(
                (d) => d.name === "Commodity Distribution"
            );
            if (defaultDistribution) {
                setSelectedDistribution(defaultDistribution);
                const data = getDataForDistribution(
                    defaultDistribution.name,
                    barangayData
                );
                setLineChartData(data);
            }
        }
    }, [
        distributions,
        barangayData,
        selectedDistribution,
        getDataForDistribution,
    ]);

    const handleDistributionChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const distributionName = event.target.value;
        const distribution = distributions.find(
            (d) => d.name === distributionName
        );

        if (distribution && distribution !== selectedDistribution) {
            const data = getDataForDistribution(distributionName, barangayData);
            setLineChartData(data);
            setSelectedDistribution(distribution);
        }
    };

    return (
        <div className="w-full">
            <select
                onChange={handleDistributionChange}
                value={selectedDistribution?.name || "Commodity Distribution"}
                className="border-slate-300 rounded-lg"
            >
                <option value="" disabled>
                    -- Select Distribution --
                </option>
                {distributions.map((dist) => (
                    <option key={dist.name} value={dist.name}>
                        {dist.name}
                    </option>
                ))}
            </select>

            {selectedDistribution && (
                <>
                    <LineChart data={lineChartData} width={950} height={400} />
                    <div>
                        <h4>Legend</h4>
                        <ul>
                            {selectedDistribution.types.map((type) => (
                                <li
                                    key={type.type}
                                    style={{ color: type.color }}
                                >
                                    {type.type}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default DistributionSelector;
