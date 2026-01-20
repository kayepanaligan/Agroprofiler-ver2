import React, { useState, useEffect } from "react";
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Button,
    Modal,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";

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

interface GroupedBarChartProps {
    data: HeatmapData;
    distributionType:
        | "allocations"
        | "commodityCategories"
        | "farmers"
        | "highValue";
}

const generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
    data,
    distributionType,
}) => {
    const [colorConfig, setColorConfig] = useState<{ [key: string]: string }>(
        {}
    );
    const [openColorModal, setOpenColorModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("#000000");

    useEffect(() => {
        const savedColors = localStorage.getItem("barColors");
        if (savedColors) {
            setColorConfig(JSON.parse(savedColors));
        }
    }, []);

    const saveColors = (updatedColors: { [key: string]: string }) => {
        localStorage.setItem("barColors", JSON.stringify(updatedColors));
        setColorConfig(updatedColors);
    };

    const chartData = Object.keys(data || {}).map((barangay) => {
        const entry = data[barangay];
        const rowData: any = { name: barangay };

        if (distributionType === "allocations" && entry?.allocations) {
            Object.keys(entry.allocations).forEach((allocation) => {
                rowData[allocation] = entry?.allocations[allocation] || 0;
            });
        }

        if (distributionType === "farmers" && entry?.farmers) {
            Object.keys(entry.farmers).forEach((farmerType) => {
                rowData[farmerType] = entry?.farmers[farmerType] || 0;
            });
        }

        return rowData;
    });

    const handleOpenColorModal = (category: string) => {
        setEditingCategory(category);
        setSelectedColor(colorConfig[category] || generateRandomColor());
        setOpenColorModal(true);
    };

    const handleSaveColor = () => {
        if (editingCategory) {
            const updatedColors = {
                ...colorConfig,
                [editingCategory]: selectedColor,
            };
            saveColors(updatedColors);
        }
        setOpenColorModal(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenColorModal(true)}
            >
                Customize Colors
            </Button>

            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Legend />
                    <Tooltip />

                    {Object.keys(chartData[0] || {}).map((key) => {
                        if (key !== "name") {
                            return (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    barSize={10}
                                    fill={
                                        colorConfig[key] ||
                                        generateRandomColor()
                                    }
                                    radius={[20, 20, 0, 0]}
                                    onClick={() => handleOpenColorModal(key)}
                                />
                            );
                        }
                    })}
                </ComposedChart>
            </ResponsiveContainer>

            {/* Color Picker Modal */}
            <Modal
                open={openColorModal}
                onClose={() => setOpenColorModal(false)}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        p: 4,
                        boxShadow: 24,
                        borderRadius: "8px",
                    }}
                >
                    <h3>Select Color for {editingCategory}</h3>
                    <TextField
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        fullWidth
                    />
                    <Button
                        onClick={handleSaveColor}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Save Color
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default GroupedBarChart;
