import React from "react";
import Heatmap from "./Heatmap";

// Example data for categories (e.g., PWDs, 4Ps, Senior Citizens) and allocation types (Cash Assistance, Pesticides, Seeds)
const data = [
    { category: "PWDs", cashAssistance: 100, pesticides: 50, seeds: 30 },
    { category: "4Ps", cashAssistance: 200, pesticides: 80, seeds: 40 },
    {
        category: "Senior Citizens",
        cashAssistance: 150,
        pesticides: 60,
        seeds: 20,
    },
];

// Example categories and allocation types
const categories = ["PWDs", "4Ps", "Senior Citizens"];
const allocationTypes = ["cashAssistance", "pesticides", "seeds"];

// Function to determine color intensity based on the value
const colorScale = (value: number) => {
    if (value > 150) return "#ff0000"; // High intensity (red)
    if (value > 75) return "#ff9900"; // Medium intensity (orange)
    return "#ffff00"; // Low intensity (yellow)
};

const App = () => {
    return (
        <div className="w-full p-4">
            <Heatmap
                data={data}
                categories={categories}
                allocationTypes={allocationTypes}
                colorScale={colorScale}
            />
        </div>
    );
};

export default App;
