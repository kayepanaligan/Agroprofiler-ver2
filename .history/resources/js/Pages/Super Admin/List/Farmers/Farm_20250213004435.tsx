import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, MenuItem } from "@mui/material";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Edit2Icon, Plus, Trash2, Trash2Icon } from "lucide-react";
import { PageProps } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Head } from "@inertiajs/react";

interface Farm {
    id: number;
    name: string;
    farmer_id: number;
    farmer_name: string;
    brgy_id: number;
    commodity_id: number;
    ha: number;
    owner: string;
    latitude: number | null;
    longitude: number | null;
}

const Farm = ({ auth }: PageProps) => {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Farm>({
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
        } catch (error) {
            console.error("Error fetching farms:", error);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        try {
            if (formData.id) {
                await axios.put(`/farms/${formData.id}`, formData);
            } else {
                await axios.post("/farms", formData);
            }
            fetchFarms();
            handleClose();
        } catch (error) {
            console.error("Error saving farm:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this farm?")) {
            try {
                await axios.delete(`/api/farms/${id}`);
                fetchFarms();
            } catch (error) {
                console.error("Error deleting farm:", error);
            }
        }
    };

    const handleOpen = (farm?: Farm) => {
        if (farm) {
            setFormData(farm);
        } else {
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 70 },
        { field: "name", headerName: "Farm Name", width: 190 },
        {
            field: "farm_id",
            headerName: "Farmer",
            width: 190,
            valueGetter: (value, row) => {
                return `${row?.farmer?.firstname || "Not Assigned"} ${
                    row?.farmer?.lastname || "Not assigned"
                } `;
            },
        },
        { field: "ha", headerName: "Size (ha)", width: 120 },
        { field: "owner", headerName: "Owner ?", width: 100 },
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
                        <Edit2Icon size={20} color="green" />
                    </button>
                    <button
                        className="border rounded-[12px] p-2 hover:bg-red-300"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <Trash2Icon size={20} color="red" />
                    </button>
                </div>
            ),
        },
    ];

    const [file, setFile] = useState<File | null>(null);
    const handleImportFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);

    const handleSelectionChange = (selection: GridRowSelectionModel) => {
        setSelectedIds(selection);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("/import-crop-damages", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Crop damages imported successfully!");
        } catch (error) {
            alert("Error importing file.");
            console.error(error);
        }
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
            await axios.post("/api/cropdamages/delete", { ids: selectedIds });

            setFarms((prev) =>
                prev.filter((row) => !selectedIds.includes(row.id))
            );
            setSelectedIds([]);
            toast.success("Data Deleted successfully!");
        } catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Data Deletion was not Successful!");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-xl mt-2 font-medium text-green-800 leading-tight">
                            Farms Management
                        </h2>
                        <div className="flex gap-2">
                            <TextInput
                                type="file"
                                accept=".csv"
                                onChange={handleImportFileChange}
                                className="rounded-md border p-2"
                            />
                            <PrimaryButton onClick={handleUpload}>
                                Import
                            </PrimaryButton>
                        </div>
                        <PrimaryButton onClick={() => handleOpen()}>
                            <Plus size={24} />
                            Add Data
                        </PrimaryButton>
                        <SecondaryButton
                            onClick={handleMultipleDelete}
                            disabled={selectedIds.length === 0 || loading}
                            style={{
                                background:
                                    selectedIds.length > 0 ? "red" : "gray",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                cursor:
                                    selectedIds.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            {loading ? (
                                <span className="loader"></span> // Add a loading animation here
                            ) : (
                                <span className="flex gap-2">
                                    {" "}
                                    <Trash2 size={14} /> Delete
                                </span>
                            )}
                            {loading ? (
                                <span className="flex gap-2">
                                    <Trash2 size={14} /> Deleting
                                </span>
                            ) : (
                                ""
                            )}
                        </SecondaryButton>
                    </div>
                </>
            }
        >
            <Head title="Damages List" />

            <ToastContainer />
            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={farms}
                    columns={columns}
                    loading={loading}
                    checkboxSelection
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    onRowSelectionModelChange={handleSelectionChange}
                    rowSelectionModel={selectedIds}
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
                />

                {/* Modal for Adding/Editing */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "white",
                            p: 3,
                            borderRadius: 2,
                        }}
                    >
                        <h2>{formData.id ? "Edit Farm" : "Add Farm"}</h2>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Farm Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Size (ha)"
                            name="ha"
                            type="number"
                            value={formData.ha}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            select
                            label="Owner"
                            name="owner"
                            value={formData.owner}
                            onChange={handleChange}
                        >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Latitude"
                            name="latitude"
                            type="number"
                            value={formData.latitude || ""}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={formData.longitude || ""}
                            onChange={handleChange}
                        />
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            {formData.id ? "Update" : "Create"}
                        </Button>
                    </Box>
                </Modal>
            </div>
        </Authenticated>
    );
};

export default Farm;
