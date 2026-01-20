import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import PrimaryButton from "@/Components/PrimaryButton";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import SecondaryButton from "@/Components/SecondaryButton";

interface Funding {
    id: number;
    name: string;
    desc: string;
}

const FundingList = ({ auth }: PageProps) => {
    const [fundings, setFundings] = useState<Funding[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Funding>({
        id: 0,
        name: "",
        desc: "",
    });
    const [editMode, setEditMode] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchFundings();
    }, []);

    const fetchFundings = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/fundings");
        setFundings(response.data);
    };

    const handleOpen = (funding?: Funding) => {
        if (funding) {
            setEditMode(true);
            setFormData(funding);
        } else {
            setEditMode(false);
            setFormData({ id: 0, name: "", desc: "" });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (editMode) {
            await axios.put(`update/fundings/${formData.id}`, formData);
        } else {
            await axios.post("store/fundings", formData);
        }
        fetchFundings();
        handleClose();
    };

    const handleDelete = async (id: number) => {
        await axios.delete(`destroy/fundings/${id}`);
        fetchFundings();
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 300 },
        {
            field: "actions",
            headerName: "Actions",
            width: 520,
            flex: 1,
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
            await axios.post("/api/fundings/delete", {
                ids: selectedIds,
            });

            setFundings((prev) =>
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
                            Source of Funds Management
                        </h2>

                        <div className="flex gap-2">
                            <PrimaryButton onClick={() => handleOpen()}>
                                <Plus size={24} />
                                Add Source
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
            <Box sx={{ height: "550px" }}>
                <DataGrid
                    rows={fundings}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
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
                />

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle className=" dialog-title text-green-600 font-semibold">
                        {editMode ? "Edit Funding" : "Add Funding"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Name"
                            name="name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            name="desc"
                            fullWidth
                            value={formData.desc}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Authenticated>
    );
};

export default FundingList;
