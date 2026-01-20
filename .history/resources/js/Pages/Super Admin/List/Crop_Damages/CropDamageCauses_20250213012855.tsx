import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { PageProps } from "@/types";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

const CropDamageCauses = ({ auth }: PageProps) => {
    const [cropDamageCauses, setCropDamageCauses] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", desc: "" });
    const [isEdit, setIsEdit] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get("/crop-damage-causes");
            setCropDamageCauses(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (data = { id: null, name: "", desc: "" }) => {
        setIsEdit(!!data.id);
        setFormData(data);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                const response = await axios.put(
                    `/crop-damage-causes/update/${formData.id}`,
                    formData
                );
                fetchData();
                toast.success(response.data.message, {
                    draggable: true,
                    closeOnClick: true,
                });
                handleClose();
            } else {
                const response = await axios.post(
                    "/crop-damage-causes/store",
                    formData
                );
                fetchData();
                toast.success(response.data.message, {
                    draggable: true,
                    closeOnClick: true,
                });
                handleClose();
            }
            fetchData();
            handleClose();
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(
                `/crop-damage-causes/destroy/${id}`
            );
            fetchData();
            toast.success(response.data.message, {
                draggable: true,
                closeOnClick: true,
            });
            handleClose();
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 300 },
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
                        <Pencil size={20} color="green" />
                    </button>

                    <button
                        className="border rounded-[12px] p-2 hover:bg-red-300"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <Trash size={20} color="red" />
                    </button>
                </div>
            ),
        },
    ];

    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);
    const [loading, setLoading] = useState(false);

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
            await axios.post("/api/cropdamagecauses/delete", {
                ids: selectedIds,
            });

            setCropDamageCauses((prev) =>
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
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-xl mt-2 font-medium text-green-800 leading-tight">
                            Crop Damage Cause Management
                        </h2>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={() => handleOpen()}>
                                <Plus size={24} />
                                Add Crop Damage Cause
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
                    </div>
                </>
            }
        >
            <Head title="Crop Damage causes List" />
            <ToastContainer />
            <div>
                <Box
                    sx={{
                        height: "550px",
                    }}
                >
                    <DataGrid
                        rows={cropDamageCauses}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }}
                        pageSizeOptions={[50, 100, 200, 350, 500]}
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
                        <h2>{isEdit ? "Edit Cause" : "Add Cause"}</h2>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            margin="normal"
                        />
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

export default CropDamageCauses;
