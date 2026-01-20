import React, { useEffect, useState } from "react";
import axios from "axios";
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
    MenuItem,
    Autocomplete,
    Avatar,
} from "@mui/material";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Edit2Icon, Plus, Trash2, Trash2Icon } from "lucide-react";
import { PageProps } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Head } from "@inertiajs/react";

interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
    age: string;
    sex: string;
}

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

    const [barangays, setBarangays] = useState([]);
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [commodities, setCommodities] = useState([]);
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
                await axios.put(`/farms/update/${formData.id}`, formData);
                toast.success("Successfully Updated");
            } else {
                await axios.post("/farms/store", formData);
                toast.success("Successfully Added");
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
                await axios.delete(`/farms/destroy/${id}`);
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
        { field: "id", headerName: "#", width: 100 },
        { field: "name", headerName: "Farm Name", width: 200 },
        {
            field: "farm_id",
            headerName: "Farmer",
            width: 200,
            valueGetter: (value, row) => {
                return `${row?.farmer?.firstname || "Not Assigned"} ${
                    row?.farmer?.lastname || "Not assigned"
                } `;
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
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Error uploading file."
            );
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
            await axios.post("/api/farms/delete", { ids: selectedIds });

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

    useEffect(() => {
        axios
            .get("/list/farmers")
            .then((response) => {
                setFarmers(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching farmers:", error);
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

    const customStyles = (isDarkMode: boolean) => ({
        control: (base: any) => ({
            ...base,
            backgroundColor: "transparent",
            color: isDarkMode ? "white" : "black",
            borderColor: isDarkMode ? "#888" : "#ccc",
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: isDarkMode ? "#122231" : "white",
            color: isDarkMode ? "white" : "#122231",
        }),
        singleValue: (base: any) => ({
            ...base,
            color: isDarkMode ? "white" : "black",
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDarkMode ? "#aaa" : "#555",
        }),
        option: (base: any, { isFocused }: any) => ({
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
    // const [isDarkMode, setIsDarkMode] = useState(false);
    //  useEffect(() => {
    //      const darkModeEnabled =
    //          document.documentElement.classList.contains("dark");
    //      setIsDarkMode(darkModeEnabled);
    //  }, []);

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-[24px] mt-2 font-semibold text-green-600 leading-tight">
                            Farms Management
                        </h2>
                    </div>
                </>
            }
        >
            <Head title="Farms List" />

            <ToastContainer />
            <div className="flex gap-4">
                <div className="flex gap-2">
                    <TextInput
                        type="file"
                        accept=".csv"
                        onChange={handleImportFileChange}
                        className="rounded-md border p-1"
                    />
                    <PrimaryButton onClick={handleUpload}>Import</PrimaryButton>
                </div>
                <PrimaryButton onClick={() => handleOpen()}>
                    <Plus size={24} />
                    Add Data
                </PrimaryButton>
                <SecondaryButton
                    onClick={handleMultipleDelete}
                    disabled={selectedIds.length === 0 || loading}
                    style={{
                        background: selectedIds.length > 0 ? "red" : "gray",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        cursor:
                            selectedIds.length > 0 ? "pointer" : "not-allowed",
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
                        className="dark:bg-[#122231]"
                    >
                        <h2 className="text-green-600 text-lg font-semibold">
                            {formData.id ? "Edit Farm" : "Add Farm"}
                        </h2>
                        {/* <Autocomplete
                            options={farmers}
                            getOptionLabel={(option) =>
                                `${option.firstname} ${option.lastname}`
                            }
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    farmer_id: newValue ? newValue.id : "",
                                });
                            }}
                            value={
                                farmers.find(
                                    (farmer) => farmer.id === formData.farmer_id
                                ) || null
                            }
                            className="dark:border-green-600"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Farmer"
                                    fullWidth
                                    margin="normal"
                                    className="dark:border-green-600"
                                />
                            )}
                        /> */}

                        <Autocomplete
                            options={farmers}
                            getOptionLabel={(option) =>
                                `${option.firstname} ${option.lastname}`
                            }
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    farmer_id: newValue ? newValue.id : "",
                                });
                            }}
                            value={
                                farmers.find(
                                    (farmer) => farmer.id === formData.farmer_id
                                ) || null
                            }
                            className="dark:border-green-600"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Farmer"
                                    fullWidth
                                    margin="normal"
                                    className="dark:border-green-600"
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    {...props}
                                    key={option.id}
                                    onMouseEnter={(e) => {
                                        setHoveredFarmer(option);
                                        setAnchorEl(e.currentTarget);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredFarmer(null);
                                    }}
                                    sx={{
                                        padding: "8px",
                                        cursor: "pointer",
                                        position: "relative",
                                    }}
                                >
                                    {option.firstname} {option.lastname}
                                </Box>
                            )}
                        />

                        {hoveredFarmer && anchorEl && (
                            <div
                                style={{
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
                                }}
                            >
                                <p>
                                    <strong>
                                        {hoveredFarmer.firstname}{" "}
                                        {hoveredFarmer.lastname}
                                    </strong>
                                </p>
                                <p>Age: {hoveredFarmer.age}</p>
                                <p>Barangay: {hoveredFarmer.barangay}</p>
                            </div>
                        )}

                        <Autocomplete
                            options={barangays}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    brgy_id: newValue ? newValue.id : "",
                                });
                            }}
                            value={
                                barangays.find(
                                    (barangay) =>
                                        barangay.id === formData.brgy_id
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Barangay"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Autocomplete
                            options={commodities}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    commodity_id: newValue ? newValue.id : "",
                                });
                            }}
                            value={
                                commodities.find(
                                    (commodity) =>
                                        commodity.id === formData.commodity_id
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Commodity"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

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
