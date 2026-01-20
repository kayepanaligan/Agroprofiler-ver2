import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import {
    Box,
    Button,
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
import { Edit2Icon, Trash2Icon } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";

interface CropDamage {
    id: number;
    proof: File | string;
    farmer_id: number;
    farm_id: number;
    commodity_id: number;
    brgy_id: number;
    crop_damage_cause_id: number;
    total_damaged_area: number;
    partially_damaged_area: number;
    area_affected: number;
    remarks: string;
    severity: string;
}

interface Option {
    label: string;
    value: number;
    firstname: string;
    lastname: string;
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
        commodity_id: 0,
        brgy_id: 0,
        crop_damage_cause_id: 0,
        total_damaged_area: 0,
        partially_damaged_area: 0,
        area_affected: 0,
        remarks: "",
        severity: "",
        proof: "",
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
    const [farms, setFarms] = useState([]);
    const [loadingFarms, setLoadingFarms] = useState(false);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
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
            valueGetter: (value, row) => row.farmer.firstname,
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
                <>
                    <Button onClick={() => handleEdit(params.row)}>
                        <Edit2Icon size={24} color="green" />
                    </Button>
                    <Button onClick={() => handleDelete(params.row.id)}>
                        <Trash2Icon size={24} color="red" />
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        fetchCropDamages();
        fetchOptions();
    }, []);

    const fetchCropDamages = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/cropdamages/data");
            setCropDamages(response.data);
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

    const handleFarmerChange = async (selectedOption) => {
        setFormData({
            ...formData,
            farmer_id: selectedOption.value,
            farm_id: 0,
        }); // Reset farm selection
        setLoadingFarms(true);

        try {
            const response = await axios.get(`/farms/${selectedOption.value}`); // Fetch farms of selected farmer
            setFarms(
                response.data.map((farm) => ({
                    value: farm.id,
                    label: `Farm ${farm.id} - ${farm.name}`, // Assuming farms have a 'name' field
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
        if (window.confirm("Are you sure you want to delete this farmer?")) {
            try {
                await router.delete(`/cropdamages/destroy/${data}`);
                fetchCropDamages();
                setCropDamages((prevData = []) =>
                    prevData.filter((data) => data !== data)
                );
                toast.success("Damage deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error("Failed to delete Damage");
            }
        }
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = {
            ...formData,
            [event.target.name]: event.target.value,
        };
        updatedFormData.severity = calculateSeverity(
            updatedFormData.total_damaged_area
        );
        setFormData(updatedFormData);
    };

    const handleSelectChange = (selectedOption: any, field: string) => {
        setFormData({
            ...formData,
            [field]: selectedOption ? selectedOption.value : 0,
        });
    };

    const calculateSeverity = (totalDamagedArea: number) => {
        if (totalDamagedArea >= 60) {
            return "high";
        } else if (totalDamagedArea >= 30) {
            return "medium";
        } else {
            return "low";
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate fields
        if (!formData.crop_damage_cause_id) {
            console.error("crop_damage_cause_id is required");
            toast.error("Crop damage cause is required.");
            return;
        } else {
            console.log(
                "crop damage cause id: ",
                formData.crop_damage_cause_id
            );
        }

        if (!formData.commodity_id) {
            console.error("commodity_id is required");
            toast.error("Commodity is required.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("farmer_id", formData.farmer_id.toString());
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
                console.log("Appending proof file:", proofFile);
                formDataToSend.append("proof", proofFile);
            }

            const url = formData.id
                ? `/cropdamages/update/${formData.id}`
                : "/store/cropdamages";

            const headers = {
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            };

            const response = await axios.post(url, formDataToSend, { headers });

            console.log("Response Data:", response.data);

            if (response.data.message) {
                toast.success(response.data.message, {
                    draggable: false,
                    closeOnClick: false,
                });
            } else {
                toast.error("Unexpected response format", {
                    draggable: false,
                    closeOnClick: false,
                });
            }

            fetchCropDamages();
            setFormData({
                id: 0,
                farmer_id: 0,
                commodity_id: 0,
                brgy_id: 0,
                total_damaged_area: 0,
                partially_damaged_area: 0,
                area_affected: 0,
                remarks: "",
                severity: "low",
                proof: "",
                crop_damage_cause_id: 0,
            });
            setOpenDialog(false);
        } catch (error) {
            console.error("Error submitting crop damage data", error);
            toast.error(error.response?.data?.message || "An error occurred", {
                draggable: false,
                closeOnClick: false,
            });
        }
    };

    const selectedFarmer = farmers.find(
        (farmer) => farmer.value === formData.farmer_id
    );

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Crop Damage Management
                </h2>
            }
        >
            <Head title="Damages List" />

            <ToastContainer />
            <div>
                <div className="flex justify-between">
                    <div></div>
                    <PrimaryButton onClick={() => setOpenDialog(true)}>
                        Add New Crop Damage
                    </PrimaryButton>
                </div>

                <Box
                    sx={{
                        height: "450px",
                        padding: "10px",
                        borderRadius: "10px",
                    }}
                >
                    <DataGrid
                        rows={cropDamages}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50 },
                            },
                        }}
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
                            padding: "10px",
                            borderRadius: "1.5rem",
                        }}
                    />
                </Box>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>
                        {formData.id ? "Edit" : "Add"} Crop Damage
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
                        <br />
                        {/* <Select
                            options={farmers}
                            isLoading={loadingFarmers}
                            value={selectedFarmer || null}
                            onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, "farmer_id")
                            }
                            placeholder="Select Farmer"
                        /> */}
                        <select
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
                        </select>
                        <br />
                        <select
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={formData.farm_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    farm_id: Number(e.target.value),
                                })
                            }
                            disabled={loadingFarms || farms.length === 0}
                        >
                            <option value="">Select a Farm</option>
                            {farms.map((farm) => (
                                <option key={farm.value} value={farm.value}>
                                    {farm.label}
                                </option>
                            ))}
                        </select>
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
                            options={farms}
                            isLoading={loadingFarms}
                            value={farms.find(
                                (farm) => farm.value === formData.farm_id
                            )}
                            onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, "farm_id")
                            }
                            placeholder="Select Farm"
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
                        <Button onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
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
