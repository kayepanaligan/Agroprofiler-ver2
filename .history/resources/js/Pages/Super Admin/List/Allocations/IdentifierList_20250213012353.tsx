import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
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
import { ToastContainer } from "react-toastify";
import PrimaryButton from "@/Components/PrimaryButton";
import { Pencil, Plus, Trash } from "lucide-react";

interface Identifier {
    id: number;
    title: string;
    desc: string;
}

const IdentifierList = ({ auth }: PageProps) => {
    const [identifer, setidentifer] = useState<Identifier[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Identifier>({
        id: 0,
        title: "",
        desc: "",
    });
    const [editMode, setEditMode] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchidentifer();
    }, []);

    const fetchidentifer = async () => {
        const response = await axios.get("/api/identifier");
        setidentifer(response.data);
    };

    const handleOpen = (funding?: Identifier) => {
        if (funding) {
            setEditMode(true);
            setFormData(funding);
        } else {
            setEditMode(false);
            setFormData({ id: 0, title: "", desc: "" });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (editMode) {
            await axios.put(`/update/identifier/${formData.id}`, formData);
        } else {
            await axios.post("/store/identifier", formData);
        }
        fetchidentifer();
        handleClose();
    };

    const handleDelete = async (id: number) => {
        await axios.delete(`/destroy/identifier/${id}`);
        fetchidentifer();
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "title", headerName: "Name", width: 200 },
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

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-xl mt-2 font-medium text-green-800 leading-tight">
                            Allocation Identifier Management
                        </h2>

                        <PrimaryButton onClick={() => handleOpen()}>
                            <Plus size={24} />
                            Add Allocation Identifier
                        </PrimaryButton>
                    </div>
                </>
            }
        >
            <Head title="Commodities List" />
            <ToastContainer />
            <Box p={3} sx={{ height: "550px" }}>
                <DataGrid
                    rows={identifer}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    slots={{ toolbar: GridToolbar }}
                    checkboxSelection
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

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        {editMode ? "Edit Identifier" : "Add Identifier"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Name"
                            name="title"
                            fullWidth
                            value={formData.title}
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

export default IdentifierList;
