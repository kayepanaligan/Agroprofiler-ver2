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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    capitalize,
} from "@mui/material";
import PrimaryButton from "./PrimaryButton";

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

const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
};

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
    data,
    distributionType,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const handleCategoryChange = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedCategory(event.target.value as string);
    };

    const chartData = Object.keys(data || {}).map((barangay) => {
        const entry = data[barangay];
        const rowData: any = { name: barangay };

        if (distributionType === "allocations" && entry?.allocations) {
            Object.keys(entry.allocations).forEach((allocation) => {
                rowData[allocation] = entry?.allocations[allocation] || 0;
            });
        }

        if (
            distributionType.startsWith("commodity_categories_") &&
            entry?.commodities_categories
        ) {
            const categoryName = distributionType.replace(
                "commodity_categories_",
                ""
            );
            const categoryData =
                entry.commodities_categories[categoryName] || {};

            Object.keys(categoryData).forEach((subcategory) => {
                rowData[subcategory] = categoryData[subcategory] || 0;
            });
        }

        if (distributionType === "farmers" && entry?.farmers) {
            Object.keys(entry.farmers).forEach((farmerType) => {
                rowData[farmerType] = entry?.farmers[farmerType] || 0;
            });
        }

        return rowData;
    });

    const handleOpenModal = () => {
        const tableData = chartData.map((row) => {
            const rowDetails: any = { name: row.name, total: 0 };
            const subcategories: string[] = [];

            console.log(
                "row.commodities_categories:",
                row.commodities_categories
            );

            if (
                distributionType.startsWith("commodity_categories_") &&
                row?.commodities_categories
            ) {
                const categoryName = distributionType.replace(
                    "commodity_categories_",
                    ""
                );

                console.log("Searching for category:", categoryName);

                const categoryData =
                    row.commodities_categories[categoryName] || {};

                console.log(
                    "Category Data for",
                    categoryName,
                    ":",
                    categoryData
                );

                Object.keys(categoryData).forEach((subcategory) => {
                    const count = categoryData[subcategory] || 0;

                    console.log("Subcategory:", subcategory, "Count:", count);

                    rowDetails[subcategory] = count;
                    subcategories.push(subcategory);
                    rowDetails.total += count;
                });
            }

            if (
                distributionType === "farmers" ||
                distributionType === "allocations"
            ) {
                Object.keys(row).forEach((key) => {
                    if (key !== "name" && key !== "total") {
                        rowDetails[key] = row[key];
                        subcategories.push(key);
                        rowDetails.total += row[key];
                    }
                });
            }

            return rowDetails;
        });

        setSelectedData(tableData);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const commodityCategories = Object.keys(data).reduce(
        (categories: string[], barangay) => {
            const entry = data[barangay];
            entry.commodities?.forEach((category) => {
                if (!categories.includes(category.commodities_category_name)) {
                    categories.push(category.commodities_category_name);
                }
            });
            return categories;
        },
        []
    );

    return (
        <div>
            {distributionType === "commodityCategories" && (
                <FormControl fullWidth>
                    <InputLabel>Commodity Categories</InputLabel>
                    <Select
                        value={selectedCategory || ""}
                        onChange={handleCategoryChange}
                        label="Commodity Categories"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {commodityCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* <PrimaryButton className="relative" onClick={handleOpenModal}>
                View Table Report
            </PrimaryButton> */}

            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                    <CartesianGrid stroke="#f5f5f5" />

                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={{ fontSize: 10 }}
                    />

                    <Legend
                        wrapperStyle={{
                            height: 50,
                            marginTop: 200,
                            padding: 10,
                            textTransform: "capitalize",
                            fontSize: "14px",
                            borderRadius: "20px",
                        }}
                    />

                    <YAxis tick={{ fontSize: 14 }} />

                    <Tooltip />

                    {Object.keys(chartData[0]).map((key) => {
                        if (key !== "name") {
                            const randomColor = generateRandomColor();
                            return (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    barSize={10}
                                    fill={randomColor}
                                    radius={[20, 20, 0, 0]}
                                />
                            );
                        }
                    })}
                </ComposedChart>
            </ResponsiveContainer>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="table-report-modal"
                aria-describedby="table-report-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="table-report-modal">
                        Table Report: {distributionType}
                    </h2>
                    <TableContainer
                        component={Paper}
                        sx={{ maxHeight: 1000, overflowY: "auto" }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Barangay</TableCell>
                                    {selectedData.length > 0 &&
                                        Object.keys(selectedData[0])
                                            .filter(
                                                (key) =>
                                                    key !== "name" &&
                                                    key !== "total"
                                            )
                                            .map((key) => (
                                                <TableCell key={key}>
                                                    {key}
                                                </TableCell>
                                            ))}
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.name}</TableCell>
                                        {Object.keys(row).map(
                                            (key) =>
                                                key !== "name" &&
                                                key !== "total" && (
                                                    <TableCell key={key}>
                                                        {row[key]}
                                                    </TableCell>
                                                )
                                        )}
                                        <TableCell>{row.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default GroupedBarChart;
