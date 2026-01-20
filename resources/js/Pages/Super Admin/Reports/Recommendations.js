import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbar, } from "@mui/x-data-grid";
import { Box, Select, MenuItem, InputLabel, FormControl, Typography, Popper, Paper, Breadcrumbs, } from "@mui/material";
import Card from "@/Components/Card";
import PrimaryButton from "@/Components/PrimaryButton";
const Recommendation = ({ auth, allocationDetails, }) => {
    const [allocationInfo, setAllocationInfo] = useState("");
    const [allocationTypes, setAllocationTypes] = useState([]);
    const [selectedAllocationTypeId, setSelectedAllocationTypeId] = useState("");
    const [selectedAllocationDetails, setSelectedAllocationDetails] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    function isOverflown(element) {
        return (element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth);
    }
    const GridCellExpand = React.memo(function GridCellExpand(props) {
        const { width, value } = props;
        const wrapper = React.useRef(null);
        const cellDiv = React.useRef(null);
        const cellValue = React.useRef(null);
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [showFullCell, setShowFullCell] = React.useState(false);
        const [showPopper, setShowPopper] = React.useState(false);
        const handleMouseEnter = () => {
            const isCurrentlyOverflown = isOverflown(cellValue.current);
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
            function handleKeyDown(nativeEvent) {
                if (nativeEvent.key === "Escape") {
                    setShowFullCell(false);
                }
            }
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }, [setShowFullCell, showFullCell]);
        return (_jsxs(Box, { ref: wrapper, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, sx: {
                alignItems: "center",
                lineHeight: "24px",
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
            }, children: [_jsx(Box, { ref: cellDiv, sx: {
                        height: "100%",
                        width,
                        display: "block",
                        position: "absolute",
                        top: 0,
                    } }), _jsx(Box, { ref: cellValue, sx: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }, children: value }), showPopper && (_jsx(Popper, { open: showFullCell && anchorEl !== null, anchorEl: anchorEl, style: { width, marginLeft: -17 }, children: _jsx(Paper, { elevation: 1, style: {
                            minHeight: wrapper.current.offsetHeight - 3,
                        }, children: _jsx(Typography, { variant: "body2", style: { padding: 8 }, children: value }) }) }))] }));
    });
    function renderCellExpand(params) {
        return (_jsx(GridCellExpand, { value: params.value || "", width: params.colDef.computedWidth }));
    }
    useEffect(() => {
        const fetchAllocationTypes = async () => {
            try {
                const response = await axios.get("/allocation-types");
                setAllocationTypes(response.data);
            }
            catch (error) {
                console.error("Error fetching allocation types:", error);
            }
        };
        fetchAllocationTypes();
    }, []);
    const handleAllocationChange = (event) => {
        const allocationTypeId = event.target.value;
        setSelectedAllocationTypeId(allocationTypeId);
        if (!allocationDetails || allocationDetails.length === 0) {
            console.error("No allocation details available");
            return;
        }
        const selectedDetails = allocationDetails.find((allocation) => allocation.allocation_type === allocationTypeId);
        setSelectedAllocationDetails(selectedDetails || null);
    };
    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            if (!selectedAllocationTypeId) {
                console.error("No allocation type selected");
                return;
            }
            const response = await axios.post("/recommend-allocations", {
                allocation_type_id: selectedAllocationTypeId,
            });
            setRecommendations(response.data.farmers || []);
            console.log(recommendations);
            setAllocationInfo(response.data.allocationDetails);
            console.log("Allocation detailsss: ", allocationInfo);
        }
        catch (error) {
            console.error("Error fetching recommendations:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleRowClick = async (params) => {
        const farmerId = params.row.id;
        try {
            const response = await axios.get(`/farmers/${farmerId}`);
            setSelectedFarmer(response.data);
            setIsModalOpen(true);
        }
        catch (error) {
            console.error("Error fetching farmer details:", error);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFarmer(null);
    };
    const columns = [
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
        return (_jsxs(GridToolbarContainer, { children: [_jsx(GridToolbarColumnsButton, {}), _jsx(GridToolbarFilterButton, {}), _jsx(GridToolbarDensitySelector, {}), _jsx(Box, { sx: { flexGrow: 1 } }), _jsx(GridToolbarExport, {})] }));
    }
    return (_jsxs(Authenticated, { user: auth.user, header: _jsx("h2", { className: "text-xl mt-2 text-green-600 font-semibold leading-tight", children: "Generate Allocation Recommendations" }), breadcrumbs: _jsx("div", { className: "ml-[2rem]", children: _jsxs(Breadcrumbs, { "aria-label": "breakdown", children: [_jsx(Link, { href: "/dashboard", children: _jsx("span", { className: "text-xs dark:text-white hover:text-green-700", children: "Dashboard" }) }), _jsx(Link, { href: "#", children: _jsx("span", { className: "text-xs dark:text-white hover:text-green-700", children: "Recommendations" }) })] }) }), children: [_jsx(Head, { title: "Recommendation Generation" }), _jsxs(Box, { sx: { borderRadius: "20px" }, children: [_jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "Select Allocation Type" }), _jsx(Select, { value: selectedAllocationTypeId, onChange: handleAllocationChange, className: "border-slate-400 rounded-xl cursor-pointer focus:border-green-500", children: allocationTypes.map((type) => (_jsx(MenuItem, { value: type.id, children: type.name }, type.id))) })] }), _jsx(PrimaryButton, { onClick: fetchRecommendations, disabled: !selectedAllocationTypeId, children: "Get Recommendations" }), _jsx("br", {}), allocationInfo && (_jsx("div", { className: "mt-5 dark:bg-[#0D1A25]", children: _jsx(Card, { title: "Allocation Details", className: "dark:text-white text-[13px]", children: _jsx("div", { children: allocationInfo }) }) })), _jsx(Box, { sx: {
                            height: 400,
                            width: "100%",
                            mt: 3,
                            borderRadius: "2rem",
                        }, children: _jsx(DataGrid, { rows: recommendations, columns: columns, loading: loading, initialState: {
                                pagination: {
                                    paginationModel: { pageSize: 50 },
                                },
                            }, pageSizeOptions: [50, 100, 200, 350, 500], onRowClick: handleRowClick, slots: { toolbar: GridToolbar }, slotProps: {
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }, sx: {
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#f5f5f5",
                                },
                                padding: "10px",
                                borderRadius: "1.5rem",
                            } }) })] })] }));
};
export default Recommendation;
