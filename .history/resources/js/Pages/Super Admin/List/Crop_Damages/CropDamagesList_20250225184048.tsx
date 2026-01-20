import React, { useState, useEffect, useCallback } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    debounce,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import Select from "react-select";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PageProps } from "@/types";
import { Edit2Icon, Import, Plus, Trash2, Trash2Icon } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import ImageInputPreview from "@/Components/ImageInputReview";
// import { debounce } from "lodash";

interface CropDamage {
    id: number;
    proof: File | string;
    farmer_id: number;
    farm_id: number;
    farm_name: string;
    farm_size: number;
    commodity_id: number;
    brgy_id: number;
    crop_damage_cause_id: number;
    total_damaged_area: number;
    partially_damaged_area: number;
    area_affected: number;
    remarks: string;
    severity: string;
    ha: number;
}

interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
}

interface Option {
    label?: string;
    value: number | string;
    firstname: string;
    lastname: string;
    name: string;
    ha: number;
}

interface Farm {
    label?: string;
    value: number | string;
    firstname: string;
    lastname: string;
    ha: number;
    farm_id: number;
    farm_name: string;
    farm_size: number;
    name?: string;
}

const CropDamages = ({ auth }: PageProps) => {
    axios.defaults.headers.common["X-CSRF-TOKEN"] =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "";
    const [cropDamages, setCropDamages] = useState<CropDamage[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<CropDamage>({
        id: 0,
        farmer_id: 0,
        farm_id: 0,
        farm_name: "",
        farm_size: 0,
        commodity_id: 0,
        brgy_id: 0,
        crop_damage_cause_id: 0,
        total_damaged_area: 0,
        partially_damaged_area: 0,
        area_affected: 0,
        remarks: "",
        severity: "",
        proof: "",
        ha: 0,
    });
    const [farmers, setFarmers] = useState<Option[]>([]);
    const [barangays, setBarangays] = useState<Option[]>([]);
    const [commodities, setCommodities] = useState<Option[]>([]);
    const [CropDamageCause, setCropDamageCause] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingFarmers, setLoadingFarmers] = useState(true);
    const [loadingBarangays, setLoadingBarangays] = useState(true);
    const [loadingCommodities, setLoadingCommodities] = useState(true);
    const [loadingCropDamageCause, setLoadingCropDamageCause] = useState(true);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loadingFarms, setLoadingFarms] = useState(false);

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 90 },
        {
            field: "proof",
            headerName: "Proof",
            renderCell: (params) => (
                <img
                    src={params.value || "https://via.placeholder.com/50"}
                    alt="Avatar"
                    style={{
                        marginTop: 5,
                        width: 40,
                        height: 40,
                        borderRadius: "15%",
                        objectFit: "cover",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                />
            ),
        },
        {
            field: "farmer_id",
            headerName: "Farmer",
            width: 150,
            valueGetter: (value, row) => {
                return `${row?.farmer?.firstname || "Not Assigned"} ${
                    row?.farmer?.lastname || "Not assigned"
                } `;
            },
        },
        {
            field: "commodity_id",
            headerName: "Commodity",
            width: 150,
            valueGetter: (value, row) => row.commodity.name,
        },
        {
            field: "crop_damage_cause_id",
            headerName: "Cause",
            width: 150,
            valueGetter: (value, row) => row.crop_damage_cause.name,
        },
        {
            field: "farm_id",
            headerName: "Farm Affected",
            width: 150,
            valueGetter: (value, row) => row.farm?.name || "No Farm Listed",
        },
        {
            field: "total_damaged_area",
            headerName: "Total Damaged Area",
            width: 180,
        },
        {
            field: "partially_damaged_area",
            headerName: "Partial Damaged Area",
            width: 180,
        },
        {
            field: "area_affected",
            headerName: "Affected Area",
            width: 180,
        },
        { field: "remarks", headerName: "Remarks", width: 180 },
        { field: "severity", headerName: "Severity", width: 150 },
        {
            field: "action",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <div className="p-2 px-1 flex gap-2">
                    <button
                        className="border rounded-[12px] p-2 hover:bg-green-300"
                        onClick={() => handleEdit(params.row)}
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

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCropDamages();
        fetchOptions();
    }, []);

    const fetchCropDamages = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/cropdamages/data");
            setCropDamages(response.data);
            console.log("crop damages", cropDamages);
        } catch (error) {
            console.error("Error fetching crop damages", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [
                farmersData,
                barangaysData,
                commoditiesData,
                cropDamageCauseData,
            ] = await Promise.all([
                axios.get("/data/farmers"),
                axios.get("/data/barangay"),
                axios.get("/data/commodity"),
                axios.get("/data/cropDamageCause"),
            ]);

            setFarmers(
                farmersData.data.map((farmer: any) => ({
                    label: `${farmer.firstname || ""} ${farmer.lastname}`,
                    value: farmer.id,
                }))
            );
            setBarangays(
                barangaysData.data.map((barangay: any) => ({
                    label: barangay.name,
                    value: barangay.id,
                }))
            );
            setCommodities(
                commoditiesData.data.map((commodity: any) => ({
                    label: commodity.name,
                    value: commodity.id,
                }))
            );
            setCropDamageCause(
                cropDamageCauseData.data.map((cause: any) => ({
                    label: cause.name,
                    value: cause.id,
                }))
            );

            setLoadingBarangays(false);
            setLoadingCommodities(false);
            setLoadingCropDamageCause(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Error fetching options:",
                    error.response?.data || error.message
                );
            } else {
                console.error("An unknown error occurred:", error);
            }
        }
    };

    const fetchFarmers = useCallback(
        debounce(async (query: string) => {
            setLoadingFarmers(true);
            try {
                const response = await axios.get(`/data/farmers?q=${query}`);
                const formattedFarmers = response.data.map(
                    (farmer: Farmer) => ({
                        value: farmer.id,
                        label: `${farmer.firstname} ${farmer.lastname}`,
                    })
                );
                setFarmers(formattedFarmers);
            } catch (error) {
                console.error("Error fetching farmers", error);
            } finally {
                setLoadingFarmers(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (searchQuery.length > 2) {
            fetchFarmers(searchQuery);
        } else {
            setFarmers([]);
        }
    }, [searchQuery, fetchFarmers]);

    const handleFarmerChange = async (selectedOption: any) => {
        setFormData({
            ...formData,
            farmer_id: selectedOption.value,
            farm_id: 0,
            farm_name: "",
        });
        setLoadingFarms(true);

        try {
            const response = await axios.get(`/farms/${selectedOption.value}`);
            setFarms(
                response.data.map((farm: any) => ({
                    value: farm.id,
                    label: `${farm.name} (${farm.ha} ha)  `,
                }))
            );
        } catch (error) {
            console.error("Error fetching farms:", error);
        } finally {
            setLoadingFarms(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setProofFile(event.target.files[0]);
        }
    };

    const handleEdit = (data: CropDamage) => {
        setFormData(data);
        setOpenDialog(true);
    };

    const handleDelete = async (data: CropDamage) => {
        console.log("selected row: ", data);
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await router.delete(`/cropdamages/destroy/${data}`);
                fetchCropDamages();
                setCropDamages((prevData) =>
                    prevData.filter((data) => data !== data)
                );
                // setCropDamages((prevData = []) =>
                //     prevData.filter((data) => data !== data)
                // );

                toast.success("Damage deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error("Failed to delete Damage");
            }
        }
    };

    // const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const updatedFormData = {
    //         ...formData,
    //         [event.target.name]: event.target.value,
    //     };

    //     if (formData.farm_size) {
    //         updatedFormData.severity = calculateSeverity(
    //             parseFloat(updatedFormData.total_damaged_area || 0),
    //             formData.farm_size
    //         );
    //     }

    //     setFormData(updatedFormData);
    // };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Ensure newValue is a number
        const newValue =
            name === "total_damaged_area" ? parseFloat(value) || 0 : value;

        setFormData((prevData) => {
            console.log("🛠️ Updating", name, "to", newValue);
            console.log("🛠️ Current Farm Size:", prevData.farm_size);

            const newSeverity =
                name === "total_damaged_area"
                    ? calculateSeverity(
                          Number(newValue),
                          Number(prevData.farm_size)
                      ) // Ensure both are numbers
                    : prevData.severity;

            console.log("⚠️ New Severity After Change:", newSeverity);

            return {
                ...prevData,
                [name]: newValue,
                severity: newSeverity,
            };
        });
    };

    const handleSelectChange = (
        selectedOption: Option | null,
        field: string
    ) => {
        if (field === "farm_id" && selectedOption) {
            const selectedFarm: Farm | undefined = farms.find(
                (farm: Farm) => farm.value === selectedOption.value
            );

            let farmSize = 0;
            if (selectedFarm) {
                const match = selectedFarm.name.match(/\(([\d.]+)\s*ha\)/);
                farmSize = match ? parseFloat(match[1]) : 0;
            }

            setFormData((prevData) => ({
                ...prevData,
                farm_id: Number(selectedOption.value),
                farm_size: farmSize,
                severity: calculateSeverity(
                    prevData.total_damaged_area,
                    farmSize
                ),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [field]: selectedOption ? Number(selectedOption.value) : 0,
            }));
        }
    };

    const [selectedFarm, setSelectedFarm] = useState(null);

    const calculateSeverity = (totalDamagedArea: number, farmSize: number) => {
        if (!farmSize || farmSize === 0) return "low";

        const damagePercentage = (totalDamagedArea / farmSize) * 100;

        if (damagePercentage > 50) {
            return "high";
        } else if (damagePercentage >= 20) {
            return "medium";
        } else {
            return "low";
        }
    };

    const fetchFarms = async (farmerId: Farmer) => {
        if (!farmerId) {
            setFarms([]); // Reset farms if no farmer selected
            return;
        }

        setLoadingFarms(true);
        try {
            const response = await axios.get(
                `/search/data/farms?farmer_id=${farmerId}`
            );
            setFarms(
                response.data.map((farm: Option) => ({
                    value: farm.value,
                    label: `${farm.name} (${farm.ha} ha)`,
                }))
            );
        } catch (error) {
            console.error("Error fetching farms", error);
        } finally {
            setLoadingFarms(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.crop_damage_cause_id) {
            toast.error("Crop damage cause is required.");
            return;
        }

        if (!formData.commodity_id) {
            toast.error("Commodity is required.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("farmer_id", formData.farmer_id.toString());
            formDataToSend.append("farm_id", formData.farm_id.toString());
            formDataToSend.append(
                "commodity_id",
                formData.commodity_id.toString()
            );
            formDataToSend.append(
                "crop_damage_cause_id",
                formData.crop_damage_cause_id.toString()
            );
            formDataToSend.append("brgy_id", formData.brgy_id.toString());
            formDataToSend.append(
                "total_damaged_area",
                formData.total_damaged_area.toString()
            );
            formDataToSend.append(
                "partially_damaged_area",
                formData.partially_damaged_area.toString()
            );
            formDataToSend.append(
                "area_affected",
                formData.area_affected.toString()
            );
            formDataToSend.append("remarks", formData.remarks);
            formDataToSend.append("severity", formData.severity);

            if (proofFile) {
                formDataToSend.append("proof", proofFile);
            }

            const url = formData.id
                ? `/cropdamages/update/${formData.id}`
                : "/store/cropdamages";

            const response = await axios.post(url, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            if (response.data.message) {
                toast.success(response.data.message);

                setCropDamages((prevData) => {
                    if (formData.id) {
                        // **Replace existing entry with the updated response**
                        return prevData.map((item) =>
                            item.id === formData.id
                                ? response.data.updatedData
                                : item
                        );
                    } else {
                        // **Add new entry using server response**
                        return [...prevData, response.data.newData];
                    }
                });
            } else {
                toast.error("Unexpected response format");
            }

            setFormData({
                id: 0,
                farmer_id: 0,
                farm_id: 0,
                commodity_id: 0,
                brgy_id: 0,
                total_damaged_area: 0,
                partially_damaged_area: 0,
                area_affected: 0,
                remarks: "",
                severity: "low",
                proof: "",
                crop_damage_cause_id: 0,
                farm_name: "",
                farm_size: 0,
                ha: 0,
            });

            setOpenDialog(false);
        } catch (error) {
            console.error("Error submitting crop damage data", error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleFarmChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedFarmId = Number(event.target.value);

        if (!selectedFarmId) return;

        try {
            const response = await axios.get(
                `/farms/details/${selectedFarmId}`
            );
            console.log("API Response:", response.data);

            setFormData((prevData) => ({
                ...prevData,
                farm_id: selectedFarmId,
                farm_name: response.data.name,
                farm_size: response.data.ha,
                severity: "low",
            }));
        } catch (error) {
            console.error("Error fetching farm details:", error);
        }
    };

    const selectedFarmer = farmers.find(
        (farmer) => farmer.value === formData.farmer_id
    );

    const [file, setFile] = useState<File | null>(null);

    const handleImportFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
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

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("proof", file);

        try {
            const response = await axios.post("/upload-proof", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data.path;
        } catch (error) {
            console.error("Error uploading proof:", error);
            return null;
        }
    };

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
            await axios.post("/api/cropdamages/delete", { ids: selectedIds });

            setCropDamages((prev) =>
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
        if (formData.farm_id && formData.total_damaged_area) {
            const selectedFarm = farms.find(
                (farm) => farm.value === formData.farm_id
            );

            let farmSize = 0;
            if (selectedFarm) {
                const match = selectedFarm.label.match(/\(([\d.]+)\s*ha\)/);
                farmSize = match ? parseFloat(match[1]) : 0;
            }

            console.log("🔍 useEffect - Extracted Farm Size:", farmSize);
            console.log(
                "🔍 useEffect - Total Damaged Area:",
                formData.total_damaged_area
            );

            const newSeverity = calculateSeverity(
                formData.total_damaged_area,
                farmSize
            );

            console.log("⚠️ New Severity Calculated:", newSeverity);

            setFormData((prevData) => ({
                ...prevData,
                severity: newSeverity,
            }));
        }
    }, [formData.farm_id, formData.total_damaged_area]);

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-[24px] mt-2 font-semibold text-green-600 leading-tight">
                            Crop Damages Management
                        </h2>
                    </div>
                </>
            }
        >
            <Head title="Damages List" />
            <div className="flex gap-4">
                <div className="flex gap-2">
                    <TextInput
                        type="file"
                        accept=".csv"
                        onChange={handleImportFileChange}
                        className="rounded-md border p-1"
                    />
                    <PrimaryButton
                        onClick={handleUpload}
                        className="flex gap-2"
                    >
                        <Import size={20} /> Import
                    </PrimaryButton>
                </div>
                <PrimaryButton onClick={() => setOpenDialog(true)}>
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
            <ToastContainer />
            <div>
                <Box
                    sx={{
                        height: "520px",
                    }}
                >
                    <DataGrid
                        rows={cropDamages} // ✅ Now dynamically updates when modified
                        columns={columns}
                        getRowId={(row) => row.id}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }}
                        onRowSelectionModelChange={handleSelectionChange}
                        rowSelectionModel={selectedIds}
                        pageSizeOptions={[50, 100, 200, 350, 500]}
                        loading={loading}
                        slots={{ toolbar: GridToolbar }}
                        checkboxSelection
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
                <Dialog
                    className="p-6"
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>
                        <span className="text-green-600 font-semibold p-4 px-4">
                            {formData.id ? "Edit" : "Add"} Crop Damage
                        </span>
                    </DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Proof (Image)"
                            type="file"
                            name="proof"
                            fullWidth
                            margin="normal"
                            onChange={handleFileChange}
                        />
                        {proofFile && (
                            <Box mt={2}>
                                <img
                                    src={URL.createObjectURL(proofFile)}
                                    alt="Proof Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                        display: "flex",
                                        borderRadius: "15px",
                                    }}
                                />
                            </Box>
                        )}
                        {/* <ImageInputPreview /> */}
                        <br />
                        <br />
                        {/* <select
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={formData.farmer_id}
                            onChange={(e) =>
                                handleFarmerChange(
                                    farmers.find(
                                        (farmer) =>
                                            farmer.value ===
                                            Number(e.target.value)
                                    )
                                )
                            }
                        >
                            <option value="">Select a Farmer</option>
                            {farmers.map((farmer) => (
                                <option key={farmer.value} value={farmer.value}>
                                    {farmer.label}
                                </option>
                            ))}
                        </select> */}
                        <Autocomplete
                            options={farmers}
                            getOptionLabel={(option) => option.label ?? ""} // ✅ Ensures a string is always returned
                            loading={loadingFarmers}
                            onInputChange={(event, newInputValue) =>
                                setSearchQuery(newInputValue)
                            }
                            onChange={(event, newValue) => {
                                handleSelectChange(newValue, "farmer_id");
                                fetchFarms(newValue?.value);
                            }}
                            filterOptions={(options) => options}
                            renderOption={(props, option) => (
                                <li {...props} key={option.value}>
                                    {option.label ?? "Unknown"}{" "}
                                    {/* ✅ Handles undefined cases */}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Farmer"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />

                        <br />
                        <br />
                        <Autocomplete
                            options={farms}
                            getOptionLabel={(option) => option.label} // Show farm name + hectares
                            loading={loadingFarms}
                            onChange={(event, newValue) =>
                                handleSelectChange(newValue, "farm_id")
                            }
                            filterOptions={(options, state) =>
                                options.filter((option) =>
                                    option.label
                                        .toLowerCase()
                                        .includes(
                                            state.inputValue.toLowerCase()
                                        )
                                )
                            }
                            renderOption={(props, option) => (
                                <li {...props} key={option.value}>
                                    {option.label}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Farm"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingFarms ? (
                                                    <CircularProgress
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <br />
                        <br />
                        <Select
                            options={CropDamageCause}
                            value={CropDamageCause.find(
                                (option) =>
                                    option.value ===
                                    formData.crop_damage_cause_id
                            )}
                            onChange={(selectedOption) =>
                                handleSelectChange(
                                    selectedOption,
                                    "crop_damage_cause_id"
                                )
                            }
                            placeholder="Select Crop Damage Cause"
                        />
                        <br />
                        <Select
                            options={barangays}
                            isLoading={loadingBarangays}
                            value={barangays.find(
                                (barangay) =>
                                    barangay.value === formData.brgy_id
                            )}
                            onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, "brgy_id")
                            }
                            placeholder="Select Barangay"
                        />
                        <br />
                        <Select
                            options={commodities}
                            isLoading={loadingCommodities}
                            value={commodities.find(
                                (commodity) =>
                                    commodity.value === formData.commodity_id
                            )}
                            onChange={(selectedOption) =>
                                handleSelectChange(
                                    selectedOption,
                                    "commodity_id"
                                )
                            }
                            placeholder="Select Commodity"
                        />
                        <TextField
                            label="Total Damaged Area"
                            name="total_damaged_area"
                            value={formData.total_damaged_area}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Partially Damaged Area"
                            name="partially_damaged_area"
                            value={formData.partially_damaged_area}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Area Affected"
                            name="area_affected"
                            value={formData.area_affected}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Severity"
                            name="severity"
                            value={formData.severity}
                            disabled
                            fullWidth
                            margin="normal"
                            className="dark:text-white"
                        />
                        <TextField
                            label="Remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleFormChange}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <SecondaryButton
                            className="text-red-500"
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" onClick={handleSubmit}>
                            Submit
                        </PrimaryButton>
                    </DialogActions>
                </Dialog>
            </div>
        </Authenticated>
    );
};

export default CropDamages;
