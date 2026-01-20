import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, MenuItem, Autocomplete, } from "@mui/material";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Edit2Icon, Plus, Trash2, Trash2Icon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Head } from "@inertiajs/react";
const Farm = ({ auth }) => {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        farmer_id: 0,
        farmer_name: "",
        brgy_id: 0,
        commodity_id: 0,
        ha: 0,
        owner: "yes",
        latitude: null,
        longitude: null,
    });
    useEffect(() => {
        fetchFarms();
    }, []);
    const fetchFarms = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/data/farms");
            setFarms(response.data);
            console.log(farms);
        }
        catch (error) {
            console.error("Error fetching farms:", error);
        }
        setLoading(false);
    };
    const handleSubmit = async () => {
        try {
            if (formData.id) {
                await axios.put(`/farms/update/${formData.id}`, formData);
                toast.success("Successfully Updated");
            }
            else {
                await axios.post("/farms/store", formData);
                toast.success("Successfully Added");
            }
            fetchFarms();
            handleClose();
        }
        catch (error) {
            console.error("Error saving farm:", error);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this farm?")) {
            try {
                await axios.delete(`/farms/destroy/${id}`);
                fetchFarms();
            }
            catch (error) {
                console.error("Error deleting farm:", error);
            }
        }
    };
    const handleOpen = (farm) => {
        if (farm) {
            setFormData(farm);
        }
        else {
            setFormData({
                id: 0,
                name: "",
                farmer_id: 0,
                farmer_name: "",
                brgy_id: 0,
                commodity_id: 0,
                ha: 0,
                owner: "yes",
                latitude: null,
                longitude: null,
            });
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const columns = [
        { field: "id", headerName: "#", width: 100 },
        { field: "name", headerName: "Farm Name", width: 200 },
        {
            field: "farm_id",
            headerName: "Farmer",
            width: 200,
            valueGetter: (value, row) => {
                return `${row?.farmer?.firstname || "Not Assigned"} ${row?.farmer?.lastname || "Not assigned"} `;
            },
        },
        { field: "ha", headerName: "Size (ha)", width: 120 },
        {
            field: "commodity?.name",
            headerName: "Commodity",
            width: 150,
            valueGetter: (value, row) => {
                return `${row?.commodity?.name || "Not Assigned"}  `;
            },
        },
        { field: "owner", headerName: "Owner ?", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 280,
            flex: 1,
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleOpen(params.row), children: _jsx(Edit2Icon, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash2Icon, { size: 20, color: "red" }) })] })),
        },
    ];
    const [file, setFile] = useState(null);
    const handleImportFileChange = (event) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };
    const [selectedIds, setSelectedIds] = useState([]);
    const handleSelectionChange = (selection) => {
        setSelectedIds(selection);
    };
    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post("/farms/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(response.data.message);
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Error uploading file.");
        }
    };
    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("No records selected!");
            return;
        }
        if (!window.confirm("Are you sure you want to delete selected records?")) {
            return;
        }
        try {
            setLoading(true);
            await axios.post("/api/farms/delete", { ids: selectedIds });
            setFarms((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
            setSelectedIds([]);
            toast.success("Data Deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Data Deletion was not Successful!");
        }
        finally {
            setLoading(false); // Stop loading
        }
    };
    useEffect(() => {
        axios
            .get("/list/farmers")
            .then((response) => {
            setFarmers(response.data.map((farmer) => ({
                ...farmer,
                id: Number(farmer.id),
            })));
            console.log(response.data);
        })
            .catch((error) => {
            console.error("Error fetching farmers:", error);
            setFarmers([]);
        });
        axios
            .get("/list/barangays")
            .then((response) => {
            setBarangays(response.data);
        })
            .catch((error) => {
            console.error("Error fetching barangays: ", error);
        });
        axios
            .get("/list/commodities")
            .then((response) => {
            setCommodities(response.data);
        })
            .catch((error) => {
            console.error("Error fetching barangays: ", error);
        });
    }, []);
    const customStyles = (isDarkMode) => ({
        control: (base) => ({
            ...base,
            backgroundColor: "transparent",
            color: isDarkMode ? "white" : "black",
            borderColor: isDarkMode ? "#888" : "#ccc",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "#122231" : "white",
            color: isDarkMode ? "white" : "#122231",
        }),
        singleValue: (base) => ({
            ...base,
            color: isDarkMode ? "white" : "black",
        }),
        placeholder: (base) => ({
            ...base,
            color: isDarkMode ? "#aaa" : "#555",
        }),
        option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused
                ? isDarkMode
                    ? "#121f31"
                    : "#eee"
                : "transparent",
            color: isDarkMode ? "white" : "black",
        }),
    });
    const isDarkMode = document.documentElement.classList.contains("dark");
    const [hoveredFarmer, setHoveredFarmer] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    return (_jsxs(Authenticated, { user: auth.user, header: _jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full justify-between", children: [_jsx("h2", { className: "text-[24px] mt-2 font-semibold text-green-600 leading-tight", children: "Farms Management" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(PrimaryButton, { onClick: () => handleOpen(), children: [_jsx(Plus, { size: 24 }), "Add Data"] }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
                                    background: selectedIds.length > 0 ? "red" : "gray",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: selectedIds.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }, children: [loading ? (_jsx("span", { className: "loader" }) // Add a loading animation here
                                    ) : (_jsxs("span", { className: "flex gap-2", children: [" ", _jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2", children: [_jsx(Trash2, { size: 14 }), " Deleting"] })) : ("")] })] })] }) }), children: [_jsx(Head, { title: "Farms List" }), _jsx(ToastContainer, {}), _jsxs("div", { style: { height: 500, width: "100%" }, children: [_jsx(DataGrid, { rows: farms, columns: columns, loading: loading, checkboxSelection: true, pageSizeOptions: [5, 10, 20], initialState: {
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }, slots: { toolbar: GridToolbar }, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, slotProps: {
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }, sx: {
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f5f5f5",
                            },
                            border: "none",
                        } }), _jsx(Modal, { open: open, onClose: handleClose, children: _jsxs(Box, { sx: {
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                bgcolor: "white",
                                p: 3,
                                borderRadius: 2,
                            }, className: "dark:bg-[#122231]", children: [_jsx("h2", { className: "text-green-600 text-lg font-semibold", children: formData.id ? "Edit Farm" : "Add Farm" }), _jsx(Autocomplete, { options: farmers, getOptionLabel: (option) => `${option.firstname} ${option.lastname}`, onChange: (event, newValue) => {
                                        setFormData({
                                            ...formData,
                                            farmer_id: newValue ? newValue.id : 0,
                                        });
                                    }, value: farmers.find((farmer) => farmer.id === formData.farmer_id) || null, className: "dark:border-green-600", renderInput: (params) => (_jsx(TextField, { ...params, label: "Select Farmer", fullWidth: true, margin: "normal" })), renderOption: (props, option) => (_createElement(Box, { component: "li", ...props, key: option.id, onMouseEnter: (e) => {
                                            setHoveredFarmer(option);
                                            setAnchorEl(e.currentTarget);
                                        }, onMouseLeave: () => {
                                            setHoveredFarmer(null);
                                        }, sx: {
                                            padding: "8px",
                                            cursor: "pointer",
                                            position: "relative",
                                        } },
                                        option.firstname,
                                        " ",
                                        option.lastname)) }), hoveredFarmer && anchorEl && (_jsxs("div", { style: {
                                        position: "absolute",
                                        top: `${position.top}px`,
                                        left: `${position.left}px`,
                                        background: isDarkMode ? "#333" : "#f8f9fa",
                                        color: isDarkMode ? "#fff" : "#333",
                                        border: isDarkMode
                                            ? "1px solid #666"
                                            : "1px solid #ccc",
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                                        padding: "10px",
                                        zIndex: 1000,
                                        width: "220px",
                                        fontSize: "14px",
                                        pointerEvents: "none",
                                        transform: "translateY(-50%)", // Center it vertically relative to the hovered option
                                    }, children: [_jsx("p", { children: _jsxs("strong", { children: [hoveredFarmer.firstname, " ", hoveredFarmer.lastname] }) }), _jsxs("p", { children: ["Age: ", hoveredFarmer.age] }), _jsxs("p", { children: ["Barangay: ", hoveredFarmer.barangay] })] })), _jsx(Autocomplete, { options: barangays, getOptionLabel: (option) => option.name, onChange: (event, newValue) => {
                                        setFormData({
                                            ...formData,
                                            brgy_id: newValue ? newValue.id : 0,
                                        });
                                    }, value: barangays.find((barangay) => barangay.id === formData.brgy_id) || null, renderInput: (params) => (_jsx(TextField, { ...params, label: "Select Barangay", fullWidth: true, margin: "normal" })) }), _jsx(Autocomplete, { options: commodities, getOptionLabel: (option) => option.name, onChange: (event, newValue) => {
                                        setFormData({
                                            ...formData,
                                            commodity_id: newValue ? newValue.id : 0,
                                        });
                                    }, value: commodities.find((commodity) => commodity.id === formData.commodity_id) || null, renderInput: (params) => (_jsx(TextField, { ...params, label: "Select Commodity", fullWidth: true, margin: "normal" })) }), _jsx(TextField, { fullWidth: true, margin: "normal", label: "Farm Name", name: "name", value: formData.name, onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", label: "Size (ha)", name: "ha", type: "number", value: formData.ha, onChange: handleChange }), _jsxs(TextField, { fullWidth: true, margin: "normal", select: true, label: "Owner", name: "owner", value: formData.owner, onChange: handleChange, children: [_jsx(MenuItem, { value: "yes", children: "Yes" }), _jsx(MenuItem, { value: "no", children: "No" })] }), _jsx(Button, { onClick: handleSubmit, variant: "contained", color: "primary", fullWidth: true, children: formData.id ? "Update" : "Create" })] }) })] })] }));
};
export default Farm;
