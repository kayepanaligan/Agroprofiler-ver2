import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import { PageProps } from "@/types";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

interface Commodity {
    id: number;
    name: string;
    desc: string;
}

const Commodities = ({ auth }: PageProps) => {
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", desc: "" });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/commodity-categories-show");
            setCommodities(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                console.log(
                    `PUT request to: /commodities-categories/update/${formData.id}`
                );
                const response = await axios.put(
                    `/commodities-categories/update/${formData.id}`,
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
                    "/commodity-categories/store",
                    formData
                );
                fetchData();
                toast.success(response.data.message, {
                    draggable: true,
                    closeOnClick: true,
                });
                handleClose();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/commodity-categories/destroy/${id}`);
            setCommodities((prevData) =>
                prevData.filter((commodity) => commodity.id !== id)
            );
            fetchData();
            toast.success("Commodity deleted successfully", {
                draggable: true,
                closeOnClick: true,
            });
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 300 },
        {
            field: "actions",
            headerName: "Actions",
            width: 750,
            align: "center",
            renderCell: (params) => (
                <div className="p-2 px-1 flex gap-2">
                    <button
                        className="border rounded-[12px] p-2 hover:bg-green-300"
                        onClick={() => handleOpen(params.row)}
                    >
                        <Pencil color="green" size={20} />
                    </button>
                    <button
                        className="border rounded-[12px] p-2 hover:bg-red-300"
                        onClick={() => handleDelete(params.row.id)}
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
            await axios.post("/api/categorycommodities/delete", {
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
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-[25px] mt-2 font-semibold text-green-600 leading-tight">
                            Category of Commodities Management
                        </h2>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={() => handleOpen()}>
                                <Plus size={24} />
                                Add Commodity
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
            <Head title="Commodities List" />

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
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        rowSelectionModel={selectedIds}
                        pageSizeOptions={[50, 100, 200, 350, 500]}
                        loading={loading}
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
                        className="dark:bg-[#122231]"
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
                        <h2 className="dark:text-green-600 text-lg font-semibold">
                            {isEdit ? "Edit Commodity" : "Add Commodity"}
                        </h2>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            className="dark:text-white"
                            InputProps={{
                                className: "dark:text-white", // Ensure text stays white
                            }}
                            InputLabelProps={{
                                className: "dark:text-white", // Ensure label stays white
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            margin="normal"
                            className="dark:text-white"
                            InputProps={{
                                className: "dark:text-white", // Ensure text stays white
                            }}
                            InputLabelProps={{
                                className: "dark:text-white", // Ensure label stays white
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            style={{ marginTop: 16 }}
                            className="dark:text-white"
                            InputProps={{
                                className: "dark:text-white", // Ensure text stays white
                            }}
                            InputLabelProps={{
                                className: "dark:text-white", // Ensure label stays white
                            }}
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
