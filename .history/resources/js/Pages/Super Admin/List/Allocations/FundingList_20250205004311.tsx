import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

    // Open Modal
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

    // Close Modal
    const handleClose = () => setOpen(false);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add or Update Funding
    const handleSubmit = async () => {
        if (editMode) {
            await axios.put(
                `http://127.0.0.1:8000/update/fundings/${formData.id}`,
                formData
            );
        } else {
            await axios.post("http://127.0.0.1:8000/store/fundings", formData);
        }
        fetchFundings();
        handleClose();
    };

    // Delete Funding
    const handleDelete = async (id: number) => {
        await axios.delete(`http://127.0.0.1:8000/api/fundings/${id}`);
        fetchFundings();
    };

    // Data Grid Columns
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 300 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <>
                    <Button size="small" onClick={() => handleOpen(params.row)}>
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Allocation Management
                </h2>
            }
        >
            <Head title="Commodities List" />
            <ToastContainer />
            <Box p={3}>
                <Button
                    variant="contained"
                    onClick={() => handleOpen()}
                    sx={{ mb: 2 }}
                >
                    Add Funding
                </Button>
                <DataGrid
                    rows={fundings}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    autoHeight
                />

                {/* Modal */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
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
