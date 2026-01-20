import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridRenderCellParams,
    GridToolbar,
    GridColDef,
} from "@mui/x-data-grid";
import {
    Box,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Popper,
    Paper,
    Breadcrumbs,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import Card from "@/Components/Card";
import PrimaryButton from "@/Components/PrimaryButton";
import AdminLayout from "@/Layouts/AdminLayout";

interface GridCellExpandProps {
    value: string;
    width: number;
}
interface AllocationType {
    id: string;
    name: string;
}
interface Recommendation {
    id: string;
    farmerName: string;
    commodity: string;
    allocationType: string;
    cropDamageCause: string;
    reasons: string[];
    score: number;
}
interface FarmerDetails {
    id: string;
    name: string;
    age: number;
    barangay: string;
    eligibilityStatus: string;
    commodities: string[];
    recentAllocations: string[];
}
interface AllocationDetails {
    allocation_type: string;
    commodities: string[];
    elligibilities: string[];
    barangays: string[];
    crop_damage_causes: string[];
    alocationDetails: string;
}
interface RecommendationProps extends PageProps {
    allocationDetails: AllocationDetails[];
}

const Recommendation: React.FC<RecommendationProps> = ({
    auth,
    allocationDetails,
}) => {
    const [allocationInfo, setAllocationInfo] = useState("");
    const [allocationTypes, setAllocationTypes] = useState<AllocationType[]>(
        []
    );
    const [selectedAllocationTypeId, setSelectedAllocationTypeId] =
        useState("");
    const [selectedAllocationDetails, setSelectedAllocationDetails] =
        useState<AllocationDetails | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<FarmerDetails | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    function isOverflown(element: Element): boolean {
        return (
            element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth
        );
    }

    const GridCellExpand = React.memo(function GridCellExpand(
        props: GridCellExpandProps
    ) {
        const { width, value } = props;
        const wrapper = React.useRef<HTMLDivElement | null>(null);
        const cellDiv = React.useRef(null);
        const cellValue = React.useRef(null);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
        );
        const [showFullCell, setShowFullCell] = React.useState(false);
        const [showPopper, setShowPopper] = React.useState(false);

        const handleMouseEnter = () => {
            const isCurrentlyOverflown = isOverflown(cellValue.current!);
            setShowPopper(isCurrentlyOverflown);
            setAnchorEl(cellDiv.current);
            setShowFullCell(true);
        };

        const handleMouseLeave = () => {
            setShowFullCell(false);
        };

        React.useEffect(() => {
            if (!showFullCell) {
                return undefined;
            }

            function handleKeyDown(nativeEvent: KeyboardEvent) {
                if (nativeEvent.key === "Escape") {
                    setShowFullCell(false);
                }
            }

            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }, [setShowFullCell, showFullCell]);

        return (
            <Box
                ref={wrapper}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    alignItems: "center",
                    lineHeight: "24px",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                }}
            >
                <Box
                    ref={cellDiv}
                    sx={{
                        height: "100%",
                        width,
                        display: "block",
                        position: "absolute",
                        top: 0,
                    }}
                />
                <Box
                    ref={cellValue}
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {value}
                </Box>
                {showPopper && (
                    <Popper
                        open={showFullCell && anchorEl !== null}
                        anchorEl={anchorEl}
                        style={{ width, marginLeft: -17 }}
                    >
                        <Paper
                            elevation={1}
                            style={{
                                minHeight: wrapper.current!.offsetHeight - 3,
                            }}
                        >
                            <Typography variant="body2" style={{ padding: 8 }}>
                                {value}
                            </Typography>
                        </Paper>
                    </Popper>
                )}
            </Box>
        );
    });

    function renderCellExpand(params: GridRenderCellParams<any, string>) {
        return (
            <GridCellExpand
                value={params.value || ""}
                width={params.colDef.computedWidth}
            />
        );
    }

    useEffect(() => {
        const fetchAllocationTypes = async () => {
            try {
                const response = await axios.get("/allocation-types");
                setAllocationTypes(response.data);
            } catch (error) {
                console.error("Error fetching allocation types:", error);
            }
        };
        fetchAllocationTypes();
    }, []);

    const handleAllocationChange = (event: SelectChangeEvent<string>) => {
        const allocationTypeId = event.target.value as string;
        setSelectedAllocationTypeId(allocationTypeId);

        if (!allocationDetails || allocationDetails.length === 0) {
            console.error("No allocation details available");
            return;
        }

        const selectedDetails = allocationDetails.find(
            (allocation) => allocation.allocation_type === allocationTypeId
        );
        setSelectedAllocationDetails(selectedDetails || null);
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            if (!selectedAllocationTypeId) {
                console.error("No allocation type selected");
                return;
            }
            const response = await axios.post("/admin/recommend-allocations", {
                allocation_type_id: selectedAllocationTypeId,
            });
            setRecommendations(response.data.farmers || []);
            console.log(recommendations);
            setAllocationInfo(response.data.allocationDetails);
            console.log("Allocation detailsss: ", allocationInfo);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (params: any) => {
        const farmerId = params.row.id;
        try {
            const response = await axios.get(`/admin/farmers/${farmerId}`);
            setSelectedFarmer(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching farmer details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFarmer(null);
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "rsbsaRefNo",
            headerName: "RSBSBA REF NO",
            width: 150,

            renderCell: renderCellExpand,
        },
        {
            field: "score",
            headerName: "Score",
            width: 80,
            renderCell: renderCellExpand,
        },
        {
            field: "farmerName",
            headerName: "Farmer Name",
            width: 150,
            renderCell: renderCellExpand,
        },
        {
            field: "commodity",
            headerName: "Commodity",
            width: 150,

            renderCell: renderCellExpand,
        },
        {
            field: "barangay",
            headerName: "Barangay",
            width: 150,
            renderCell: renderCellExpand,
        },
        {
            field: "allocationType",
            headerName: "Allocation Type",
            width: 130,
            renderCell: renderCellExpand,
        },
        {
            field: "reasons",
            headerName: "Reasons",
            flex: 1,
            renderCell: renderCellExpand,
        },
    ];

    useEffect(() => {
        console.log("Allocation Details:", allocationDetails);
    }, [allocationDetails]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Box sx={{ flexGrow: 1 }} />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-green-600 font-semibold leading-tight">
                    Generate Allocation Recommendations
                </h2>
            }
            breadcrumbs={
                <div className="ml-[2rem]">
                    <Breadcrumbs aria-label="breakdown">
                        <Link href="/dashboard">
                            <span className="text-xs dark:text-white hover:text-green-700">
                                Dashboard
                            </span>
                        </Link>
                        <Link href="#">
                            <span className="text-xs dark:text-white hover:text-green-700">
                                Recommendations
                            </span>
                        </Link>
                    </Breadcrumbs>
                </div>
            }
        >
            <Head title="Recommendation Generation" />

            <Box sx={{ borderRadius: "20px" }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Allocation Type</InputLabel>
                    <Select
                        value={selectedAllocationTypeId}
                        onChange={handleAllocationChange}
                        className="border-slate-400 rounded-xl cursor-pointer focus:border-green-500"
                    >
                        {allocationTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <PrimaryButton
                    onClick={fetchRecommendations}
                    disabled={!selectedAllocationTypeId}
                >
                    Get Recommendations
                </PrimaryButton>
                <br />
                {allocationInfo && (
                    <div className="mt-5 dark:bg-[#0D1A25]">
                        <Card
                            title="Allocation Details"
                            className="dark:text-white text-[13px]"
                        >
                            <div>{allocationInfo}</div>
                        </Card>
                    </div>
                )}
                <Box
                    sx={{
                        height: 400,
                        width: "100%",
                        mt: 3,
                        borderRadius: "2rem",
                    }}
                >
                    <DataGrid
                        rows={recommendations}
                        columns={columns}
                        loading={loading}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }}
                        pageSizeOptions={[50, 100, 200, 350, 500]}
                        onRowClick={handleRowClick}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f5f5f5",
                            },
                            padding: "10px",
                            borderRadius: "1.5rem",
                        }}
                    />
                </Box>
            </Box>
        </AdminLayout>
    );
};

export default Recommendation;
