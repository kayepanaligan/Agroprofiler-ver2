import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
const Commodities = ({ auth }) => {
    const [commodities, setCommodities] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", desc: "" });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/commodity-categories-show");
            setCommodities(response.data);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleOpen = (data = { id: null, name: "", desc: "" }) => {
        console.log(data.id);
        setIsEdit(!!data.id);
        setFormData(data);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        try {
            if (isEdit) {
                console.log(`PUT request to: /commodities-categories/update/${formData.id}`);
                const response = await axios.put(`/commodities-categories/update/${formData.id}`, formData);
                fetchData();
                toast.success(response.data.message, {
                    draggable: true,
                    closeOnClick: true,
                });
                handleClose();
            }
            else {
                const response = await axios.post("/commodity-categories/store", formData);
                fetchData();
                toast.success(response.data.message, {
                    draggable: true,
                    closeOnClick: true,
                });
                handleClose();
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
            }
            else {
                console.error("Unexpected error:", error);
            }
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/commodity-categories/destroy/${id}`);
            setCommodities((prevData) => prevData.filter((commodity) => commodity.id !== id));
            fetchData();
            toast.success("Commodity deleted successfully", {
                draggable: true,
                closeOnClick: true,
            });
        }
        catch (error) {
            console.error("Error deleting data:", error);
        }
    };
    const columns = [
        { field: "id", headerName: "#", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 400 },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            flex: 1,
            align: "center",
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleOpen(params.row), children: _jsx(Pencil, { color: "green", size: 20 }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash, { color: "red", size: 20 }) })] })),
        },
    ];
    const [selectedIds, setSelectedIds] = useState([]);
    const handleSelectionChange = (selection) => {
        setSelectedIds(selection);
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
            await axios.post("/api/categorycommodities/delete", {
                ids: selectedIds,
            });
            setCommodities((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
            setSelectedIds([]);
            toast.success("Data Deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Data Deletion was not Successful!");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Authenticated, { user: auth.user, header: _jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full justify-between", children: [_jsx("h2", { className: "text-[25px] mt-2 font-semibold text-green-600 leading-tight", children: "Category of Commodities Management" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(PrimaryButton, { onClick: () => handleOpen(), children: [_jsx(Plus, { size: 24 }), "Add Commodity"] }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
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
                                    ) : (_jsxs("span", { className: "flex gap-2", children: [" ", _jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2", children: [_jsx(Trash2, { size: 14 }), " Deleting"] })) : ("")] })] })] }) }), children: [_jsx(Head, { title: "Commodities List" }), _jsx(ToastContainer, {}), _jsxs("div", { children: [_jsx(Box, { sx: {
                            height: "550px",
                        }, children: _jsx(DataGrid, { rows: commodities, columns: columns, initialState: {
                                pagination: {
                                    paginationModel: { pageSize: 50 },
                                },
                            }, checkboxSelection: true, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, pageSizeOptions: [50, 100, 200, 350, 500], loading: loading, slots: { toolbar: GridToolbar }, slotProps: {
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }, sx: {
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#f5f5f5",
                                },
                                border: "none",
                            } }) }), _jsx(Modal, { open: open, onClose: handleClose, children: _jsxs(Box, { className: "dark:bg-[#122231]", sx: {
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }, children: [_jsx("h2", { className: "dark:text-green-600 text-lg font-semibold", children: isEdit ? "Edit Commodity" : "Add Commodity" }), _jsx(TextField, { fullWidth: true, label: "Name", name: "name", value: formData.name, onChange: handleChange, margin: "normal", className: "dark:text-white", InputProps: {
                                        className: "dark:text-white", // Ensure text stays white
                                    }, InputLabelProps: {
                                        className: "dark:text-white", // Ensure label stays white
                                    } }), _jsx(TextField, { fullWidth: true, label: "Description", name: "desc", value: formData.desc, onChange: handleChange, margin: "normal", className: "dark:text-white", InputProps: {
                                        className: "dark:text-white", // Ensure text stays white
                                    }, InputLabelProps: {
                                        className: "dark:text-white", // Ensure label stays white
                                    } }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleSave, style: { marginTop: 16 }, className: "dark:text-white", children: "Save" })] }) })] })] }));
};
export default Commodities;
