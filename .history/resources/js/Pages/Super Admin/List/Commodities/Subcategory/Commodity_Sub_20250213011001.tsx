import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import axios from "axios";
import { Pencil, Plus, Trash } from "lucide-react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PageProps } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import PrimaryButton from "@/Components/PrimaryButton";

interface Commodity {
    id: number;
    name: string;
    desc: string;
    commodity_category_id: number;
    commodity: {
        id: number;
        name: string;
        desc: string;
    };
}

const Commodities = ({ auth }: PageProps) => {
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [categories, setCategories] = useState<Commodity[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Commodity>({
        id: 0,
        name: "",
        desc: "",
        commodity_category_id: 0,
        commodity: { id: 0, name: "", desc: "" },
    });
    const [isEdit, setIsEdit] = useState(false);

    const fetchCommodities = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/commodities/show");
            setCommodities(response.data);
            console.log("fetch commodities: ", commodities);
        } catch (error) {
            console.error("Error fetching commodities:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/commodity-categories-show");
            setCategories(response.data);
            console.log(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCommodities();
        fetchCategories();
    }, []);

    const handleOpen = (
        data: Commodity = {
            id: 0,
            name: "",
            desc: "",
            commodity_category_id: 0,
            commodity: { id: 0, name: "", desc: "" },
        }
    ) => {
        setIsEdit(!!data.id);
        setFormData(data);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.desc) {
            toast.error("Name and Description are required!");
            return;
        }

        try {
            let response;
            const requestData = {
                ...formData,
                _method: isEdit ? "PUT" : "POST", // Method spoofing for update
            };

            if (isEdit) {
                response = await axios.post(
                    `/commodities/update/${formData.id}`, // Still using POST for update
                    requestData
                );
            } else {
                response = await axios.post("/commodities/store", formData);
            }

            if (response.data.errors) {
                if (response.data.errors.name) {
                    toast.error(response.data.errors.name[0]);
                }
                if (response.data.errors.desc) {
                    toast.error(response.data.errors.desc[0]);
                }
            } else {
                toast.success(
                    response.data.message ||
                        (isEdit
                            ? "Commodity updated successfully!"
                            : "Commodity added successfully!"),
                    {
                        draggable: true,
                        closeOnClick: true,
                    }
                );

                fetchCommodities();
                handleClose();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
            toast.error("An unexpected error occurred!");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            // Use POST with method spoofing for DELETE
            await axios.post(`/commodities/destroy/${id}`, {
                _method: "DELETE", // Method spoofing for DELETE
            });

            // Update local state after deletion
            setCommodities((prevData) =>
                prevData.filter((commodity) => commodity.id !== id)
            );

            // Refresh commodity list after successful deletion
            fetchCommodities();

            // Display success toast
            toast.success("Commodity deleted successfully", {
                draggable: true,
                closeOnClick: true,
            });
        } catch (error) {
            // Display error toast if deletion fails
            toast.error("Commodity deleted unsuccessfully", {
                draggable: true,
                closeOnClick: true,
            });
            console.error("Error deleting data:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 300 },
        {
            field: "commodity_category_id",
            headerName: "Category",
            width: 200,
            valueGetter: (value, row) => {
                return row?.category?.name || "Not Assigned";
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <div className="p-2 px-1 flex gap-2">
                    <button
                        className="border rounded-[12px] p-2 hover:bg-green-300"
                        onClick={() => handleOpen(params.row)}
                    >
                        <Pencil color="green" size={20} />
                    </button>
                    <button
                        onClick={() => handleDelete(params.row.id)}
                        className="border rounded-[12px] p-2 hover:bg-red-300"
                    >
                        <Trash color="red" size={20} />
                    </button>
                </div>
            ),
        },
    ];

    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);

    const handleSelectionChange = (selection: GridRowSelectionModel) => {
        setSelectedIds(selection);
    };

    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("No records selected!");
            return;
        }
        if (
            !window.confirm("Are you sure you want to delete selected records?")
        ) {
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/commodities/delete", {
                ids: selectedIds,
            });

            setCommodities((prev) =>
                prev.filter((row) => !selectedIds.includes(row.id))
            );
            setSelectedIds([]);
            toast.success("Data Deleted successfully!");
        } catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Data Deletion was not Successful!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <div className="flex w-full justify-between">
                    <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                        Commodities Management
                    </h2>

                    <PrimaryButton onClick={() => handleOpen()}>
                        <Plus size={24} />
                        Add Commodity
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Commodity Management" />
            <ToastContainer />
            <div>
                <Box
                    sx={{
                        height: "550px",
                    }}
                >
                    <DataGrid
                        rows={commodities}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }}
                        pageSizeOptions={[50, 100, 200, 350, 500]}
                        loading={loading}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        rowSelectionModel={selectedIds}
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
                            border: "none",
                        }}
                        getRowId={(row) => row.id}
                    />
                </Box>

                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <h2>{isEdit ? "Edit Commodity" : "Add Commodity"}</h2>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleTextFieldChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="desc"
                            value={formData.desc}
                            onChange={handleTextFieldChange}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="commodity_category_id"
                                value={formData.commodity_category_id || ""}
                                onChange={handleSelectChange}
                                displayEmpty // Ensures the placeholder can be shown if the value is empty
                            >
                                <MenuItem value="" disabled>
                                    Select a category
                                </MenuItem>
                                {categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            style={{ marginTop: 16 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Modal>
            </div>
        </Authenticated>
    );
};

export default Commodities;
