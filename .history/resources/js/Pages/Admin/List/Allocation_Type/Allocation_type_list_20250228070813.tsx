import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Edit,
    Edit2Icon,
    Pencil,
    Plus,
    Trash,
    Trash2,
    Trash2Icon,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import AdminLayout from "@/Layouts/AdminLayout";

interface AllocationTypeRow {
    id: number;
    name: string;
    desc: string;
    amount: number;
    identifier_id: string;
    funding_id: string;
    funding_name: string;
    identifier_title: string;
    allocation_type_id: number;
    allocation_type_commodities: {
        commodity_id: number;
        commodity_name: string;
    }[];

    allocation_type_barangays: { barangay_id: number; barangay_name: string }[];
    allocation_type_elligibilities: {
        elligibility_id: number;
        elligibility_type: string;
    }[];
    allocation_type_crop_damage_causes: {
        crop_damage_cause_id: number;
        crop_damage_cause_name: string;
    }[];
}

interface Commodity {
    id: number;
    name: string;
}

interface Barangay {
    id: number;
    name: string;
}

interface Identifier {
    id: number;
    title: string;
    desc: string;
}

interface Funding {
    id: number;
    name: string;
    desc: string;
}

interface CropDamage {
    id: number;
    name: string;
}

interface Eligibility {
    id: number;
    name: string;
}

export default function AllocationTypeList({ auth }: PageProps) {
    const [allocationTypes, setAllocationTypes] = useState<AllocationTypeRow[]>(
        []
    );
    const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [formData, setFormData] = useState<{
        id?: number;
        name: string;
        desc: string;
        amount: number;
        funding_id: number;
        identifier_id: number;
        commodityIds: number[];
        barangayIds: number[];
        cropDamageCauseIds: number[];
        eligibilityIds: number[];
    }>({
        name: "",
        desc: "",
        amount: 0,
        funding_id: 0,
        identifier_id: 0,
        commodityIds: [],
        barangayIds: [],
        cropDamageCauseIds: [],
        eligibilityIds: [],
    });
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [cropDamages, setCropDamages] = useState<CropDamage[]>([]);
    const [identifier, setIdentifier] = useState<Identifier[]>([]);
    const [funding, setFunding] = useState<Funding[]>([]);
    const [eligibilities, setEligibilities] = useState<Eligibility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const allocationTypesResponse = await axios.get<
                AllocationTypeRow[]
            >("/admin/allocation-types-list");
            if (
                allocationTypesResponse.status === 200 &&
                Array.isArray(allocationTypesResponse.data)
            ) {
                console.log(allocationTypesResponse.data);
                setAllocationTypes(allocationTypesResponse.data);
                console.log(allocationTypes);
            } else {
                console.error(
                    "Invalid response data: ",
                    allocationTypesResponse.data
                );
            }
            const commoditiesResponse = await axios.get<Commodity[]>(
                "/admin/commodities"
            );
            const barangaysResponse = await axios.get<Barangay[]>(
                "/admin/barangays"
            );
            const cropDamagesResponse = await axios.get<CropDamage[]>(
                "/admin/crop-damages-causes"
            );
            const eligibilitiesResponse = await axios.get<Eligibility[]>(
                "/admin/eligibilities"
            );
            const identifierResponse = await axios.get<Identifier[]>(
                "/admin/api/identifier"
            );
            const fundingResponse = await axios.get<Funding[]>(
                "/admin/api/fundings"
            );

            setIdentifier(identifierResponse.data);
            setFunding(fundingResponse.data);
            setCommodities(commoditiesResponse.data);
            setBarangays(barangaysResponse.data);
            setCropDamages(cropDamagesResponse.data);
            setEligibilities(eligibilitiesResponse.data);
        } catch (error) {
            console.error("Failed to fetch data: ", error);
            toast.error("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (
        event: SelectChangeEvent<number[]>,
        key: string
    ) => {
        const value = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            [key]: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const initialFormData = {
        id: null,
        name: "",
        desc: "",
        amount: 0,
        funding_id: 0,
        identifier_id: 0,
        commodityIds: [],
        barangayIds: [],
        cropDamageCauseIds: [],
        eligibilityIds: [],
    };

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async () => {
        console.log("FormData being sent: ", formData);
        try {
            await axios.post("/admin/allocation/store", formData);
            console.log("FormData being sent: ", formData);
            toast.success("Allocation type added successfully!");
            setModalOpen(false);
            resetFormData();
            fetchData();
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            toast.error("Failed to add allocation type.");
        }
    };

    const rows: AllocationTypeRow[] = (allocationTypes || []).map(
        (type, index) => ({
            id: Number(type.allocation_type_id) || index,
            name: type.name,
            desc: type.desc || "No description available",
            amount: type.amount,

            // ✅ Ensure identifier_id and funding_id are present
            identifier_id: type.identifier_id || "No Identifier ID",
            funding_id: type.funding_id || "No Funding ID",
            funding_name: type.funding_name || "No Funding Name",
            identifier_title: type.identifier_title || "No Identifier",
            allocation_type_id: Number(type.allocation_type_id) || index,

            // ✅ Keep them as arrays (for data structure compliance)
            allocation_type_commodities: Array.isArray(
                type.allocation_type_commodities
            )
                ? type.allocation_type_commodities
                : [],

            allocation_type_barangays: Array.isArray(
                type.allocation_type_barangays
            )
                ? type.allocation_type_barangays
                : [],

            allocation_type_crop_damage_causes: Array.isArray(
                type.allocation_type_crop_damage_causes
            )
                ? type.allocation_type_crop_damage_causes
                : [],

            allocation_type_elligibilities: Array.isArray(
                type.allocation_type_elligibilities
            )
                ? type.allocation_type_elligibilities
                : [],
        })
    );

    const handleEdit = (allocationId: number) => {
        console.log("Selected Allocation ID:", allocationId);
        const allocation = allocationTypes.find(
            (item) => item.allocation_type_id === allocationId
        );
        if (allocation) {
            console.log("Selected Allocation Details:", allocation);
            setSelectedAllocation(allocation);
            setFormData({
                id: Number(allocation.allocation_type_id),
                name: allocation.name || "",
                desc: allocation.desc || "",
                amount: allocation.amount,
                funding_id: Number(allocation.funding_id),
                identifier_id: Number(allocation.identifier_id),
                commodityIds:
                    allocation.allocation_type_commodities?.map(
                        (c) => c.commodity_id
                    ) || [],
                barangayIds:
                    allocation.allocation_type_barangays?.map(
                        (b) => b.barangay_id
                    ) || [],
                cropDamageCauseIds:
                    allocation.allocation_type_crop_damage_causes?.map(
                        (d) => d.crop_damage_cause_id
                    ) || [],
                eligibilityIds:
                    allocation.allocation_type_elligibilities?.map(
                        (e) => e.elligibility_id
                    ) || [],
            });

            setUpdateModalOpen(true);
        } else {
            console.log("Allocation not found.");
        }
    };

    const handleDelete = async (allocationTypeId: number) => {
        try {
            const response = await axios.delete(
                `/admin/allocation/destroy/${allocationTypeId}`
            );
            toast.success("Allocation type deleted successfully!");
            fetchData();
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data || error.message);
            } else {
                console.error(error);
            }
            toast.error("Failed to delete allocation type.");
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", flex: 2 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "desc", headerName: "Description", width: 160 },
        { field: "amount", headerName: "Amount", width: 160 },
        { field: "identifier_title", headerName: "Identifier", width: 160 },
        { field: "funding_name", headerName: "Source", width: 160 },
        {
            field: "commodities",
            headerName: "Commodities",
            width: 160,
            valueGetter: (params, row) =>
                row.allocation_type_commodities
                    .map((c) => c.commodity_name)
                    .join(", ") || "Not Commodity Specific",
        },

        { field: "barangays", headerName: "Barangays", width: 160 },
        {
            field: "allocation_type_crop_damage_causes",
            headerName: "Crop Damage Causes",
            width: 160,
        },
        { field: "elligibilities", headerName: "Eligibilities", width: 160 },
        {
            field: "actions",
            headerName: "Actions",
            align: "center",
            width: 200,
            renderCell: (params) => (
                <div className="p-2 px-1 flex gap-2">
                    <button
                        className="border rounded-[12px] p-2 hover:bg-green-300"
                        onClick={() => handleEdit(params.row.id)}
                    >
                        <Pencil size={20} color="green" />
                    </button>

                    <button
                        className="border rounded-[12px] p-2 hover:bg-green-300"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <Trash2Icon size={20} color="red" />
                    </button>
                </div>
            ),
        },
    ];

    const handleUpdateSubmit = async () => {
        const payload = {
            id: formData.id,
            name: formData.name,
            desc: formData.desc,
            amount: formData.amount,
            identifier_id: formData.identifier_id,
            funding_id: formData.funding_id,
            commodityIds: formData.commodityIds,
            barangayIds: formData.barangayIds,
            cropDamageCauseIds: formData.cropDamageCauseIds,
            eligibilityIds: formData.eligibilityIds,
        };

        try {
            const response = await axios.put(
                `/admin/allocationtypes/update/${formData.id}`,
                payload
            );
            fetchData();
            toast.success("Allocation updated successfully!");

            setUpdateModalOpen(false);
        } catch (error) {
            toast.error("Update failed. Please try again.");
            console.error("Update failed:", error);
        }
    };

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("/admin/api/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Import successful");
        } catch (error) {
            alert("Import failed");
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
            await axios.post("/admin/api/allocationtypes/delete", {
                ids: selectedIds,
            });

            setAllocationTypes((prev) =>
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
        <AdminLayout
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-[24px] mt-2 font-semibold text-green-600 leading-tight">
                            Types of Allocation Management
                        </h2>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={() => setModalOpen(true)}>
                                <Plus size={24} />
                                Add Allocation Type
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
            <Head title="Allocation Type Management" />
            <ToastContainer />

            <div className=" ">
                <div
                    style={{
                        height: "540px",
                        width: "100%",
                    }}
                    className="mt-4"
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        loading={loading}
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
                            padding: "5px",
                            border: "none",
                        }}
                    />
                </div>
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10 dark:bg-[#122231]">
                    <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-600">
                        Add Allocation Type
                    </h3>
                    <div className="h-[500px] overflow-auto">
                        <div>
                            <TextField
                                label="Allocation Type Name"
                                name="name"
                                fullWidth
                                onChange={handleInputChange}
                                className="mb-4"
                            />
                        </div>

                        <br />

                        <div>
                            <TextField
                                label="Description"
                                name="desc"
                                fullWidth
                                multiline
                                rows={3}
                                onChange={handleInputChange}
                                className="mb-4"
                            />
                        </div>

                        <br />
                        <div>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                fullWidth
                                onChange={handleInputChange}
                                className="mb-4"
                            />
                        </div>
                        <br />
                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>Select Funding</InputLabel>
                                <Select
                                    value={formData.funding_id}
                                    onChange={(e) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            funding_id: Number(e.target.value),
                                        }))
                                    }
                                >
                                    {funding.map((f) => (
                                        <MenuItem key={f.id} value={f.id}>
                                            {f.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <br />

                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>Select Identifier</InputLabel>
                                <Select
                                    value={formData.identifier_id}
                                    onChange={(e) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            identifier_id: Number(
                                                e.target.value
                                            ),
                                        }))
                                    }
                                >
                                    {identifier.map((i) => (
                                        <MenuItem key={i.id} value={i.id}>
                                            {i.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <br />
                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>
                                    Select Eligible Commodities
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.commodityIds}
                                    onChange={(e) =>
                                        handleSelectChange(e, "commodityIds")
                                    }
                                    renderValue={(selected) =>
                                        (selected as number[])
                                            .map(
                                                (id) =>
                                                    commodities.find(
                                                        (item) => item.id === id
                                                    )?.name
                                            )
                                            .join(", ")
                                    }
                                >
                                    <MenuItem value="all">
                                        <Checkbox
                                            checked={
                                                formData.commodityIds.length ===
                                                commodities.length
                                            }
                                            onChange={() => {
                                                const isAllSelected =
                                                    formData.commodityIds
                                                        .length ===
                                                    commodities.length;
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    commodityIds: isAllSelected
                                                        ? []
                                                        : commodities.map(
                                                              (c) => c.id
                                                          ),
                                                }));
                                            }}
                                        />
                                        <ListItemText primary="All" />
                                    </MenuItem>

                                    {commodities.map((commodity) => (
                                        <MenuItem
                                            key={commodity.id}
                                            value={commodity.id}
                                        >
                                            <Checkbox
                                                checked={formData.commodityIds.includes(
                                                    commodity.id
                                                )}
                                                onChange={(e) => {
                                                    const selectedIds = [
                                                        ...formData.commodityIds,
                                                    ];
                                                    if (e.target.checked) {
                                                        selectedIds.push(
                                                            commodity.id
                                                        );
                                                    } else {
                                                        const index =
                                                            selectedIds.indexOf(
                                                                commodity.id
                                                            );
                                                        if (index > -1) {
                                                            selectedIds.splice(
                                                                index,
                                                                1
                                                            );
                                                        }
                                                    }
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            commodityIds:
                                                                selectedIds,
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText
                                                primary={commodity.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <br />
                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>
                                    Select Eligible Barangays
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.barangayIds}
                                    onChange={(e) =>
                                        handleSelectChange(e, "barangayIds")
                                    }
                                    renderValue={(selected) =>
                                        (selected as number[])
                                            .map(
                                                (id) =>
                                                    barangays.find(
                                                        (item) => item.id === id
                                                    )?.name
                                            )
                                            .join(", ")
                                    }
                                >
                                    <MenuItem value="all">
                                        <Checkbox
                                            checked={
                                                formData.barangayIds.length ===
                                                barangays.length
                                            }
                                            onChange={() => {
                                                const isAllSelected =
                                                    formData.barangayIds
                                                        .length ===
                                                    barangays.length;
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    barangayIds: isAllSelected
                                                        ? []
                                                        : barangays.map(
                                                              (b) => b.id
                                                          ),
                                                }));
                                            }}
                                        />
                                        <ListItemText primary="All" />
                                    </MenuItem>

                                    {barangays.map((barangay) => (
                                        <MenuItem
                                            key={barangay.id}
                                            value={barangay.id}
                                        >
                                            <Checkbox
                                                checked={formData.barangayIds.includes(
                                                    barangay.id
                                                )}
                                                onChange={(e) => {
                                                    const selectedIds = [
                                                        ...formData.barangayIds,
                                                    ];
                                                    if (e.target.checked) {
                                                        selectedIds.push(
                                                            barangay.id
                                                        );
                                                    } else {
                                                        const index =
                                                            selectedIds.indexOf(
                                                                barangay.id
                                                            );
                                                        if (index > -1) {
                                                            selectedIds.splice(
                                                                index,
                                                                1
                                                            );
                                                        }
                                                    }
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            barangayIds:
                                                                selectedIds,
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText
                                                primary={barangay.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <br />
                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>
                                    Select Eligible Crop Damage Cause
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.cropDamageCauseIds}
                                    onChange={(e) =>
                                        handleSelectChange(
                                            e,
                                            "cropDamageCauseIds"
                                        )
                                    }
                                    renderValue={(selected) =>
                                        (selected as number[])
                                            .map(
                                                (id) =>
                                                    cropDamages.find(
                                                        (item) => item.id === id
                                                    )?.name
                                            )
                                            .join(", ")
                                    }
                                >
                                    <MenuItem value="all">
                                        <Checkbox
                                            checked={
                                                formData.cropDamageCauseIds
                                                    .length ===
                                                cropDamages.length
                                            }
                                            onChange={() => {
                                                const isAllSelected =
                                                    formData.cropDamageCauseIds
                                                        .length ===
                                                    cropDamages.length;
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    cropDamageCauseIds:
                                                        isAllSelected
                                                            ? []
                                                            : cropDamages.map(
                                                                  (c) => c.id
                                                              ),
                                                }));
                                            }}
                                        />
                                        <ListItemText primary="All" />
                                    </MenuItem>

                                    {cropDamages.map((damage) => (
                                        <MenuItem
                                            key={damage.id}
                                            value={damage.id}
                                        >
                                            <Checkbox
                                                checked={formData.cropDamageCauseIds.includes(
                                                    damage.id
                                                )}
                                                onChange={(e) => {
                                                    const selectedIds = [
                                                        ...formData.cropDamageCauseIds,
                                                    ];
                                                    if (e.target.checked) {
                                                        selectedIds.push(
                                                            damage.id
                                                        );
                                                    } else {
                                                        const index =
                                                            selectedIds.indexOf(
                                                                damage.id
                                                            );
                                                        if (index > -1) {
                                                            selectedIds.splice(
                                                                index,
                                                                1
                                                            );
                                                        }
                                                    }
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            cropDamageCauseIds:
                                                                selectedIds,
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText
                                                primary={damage.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <br />

                        <div>
                            <FormControl fullWidth className="mb-4">
                                <InputLabel>Select Eligible Farmers</InputLabel>
                                <Select
                                    multiple
                                    value={formData.eligibilityIds}
                                    onChange={(e) =>
                                        handleSelectChange(e, "eligibilityIds")
                                    }
                                    renderValue={(selected) =>
                                        (selected as number[])
                                            .map(
                                                (id) =>
                                                    eligibilities.find(
                                                        (item) => item.id === id
                                                    )?.name
                                            )
                                            .join(", ")
                                    }
                                >
                                    <MenuItem value="all">
                                        <Checkbox
                                            checked={
                                                formData.eligibilityIds
                                                    .length ===
                                                eligibilities.length
                                            }
                                            onChange={() => {
                                                // Check if "All" is currently selected
                                                const isAllSelected =
                                                    formData.eligibilityIds
                                                        .length ===
                                                    eligibilities.length;
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    eligibilityIds:
                                                        isAllSelected
                                                            ? []
                                                            : eligibilities.map(
                                                                  (e) => e.id
                                                              ),
                                                }));
                                            }}
                                        />
                                        <ListItemText primary="All" />
                                    </MenuItem>

                                    {eligibilities.map((eligibility) => (
                                        <MenuItem
                                            key={eligibility.id}
                                            value={eligibility.id}
                                        >
                                            <Checkbox
                                                checked={formData.eligibilityIds.includes(
                                                    eligibility.id
                                                )}
                                                onChange={(e) => {
                                                    const selectedIds = [
                                                        ...formData.eligibilityIds,
                                                    ];
                                                    if (e.target.checked) {
                                                        selectedIds.push(
                                                            eligibility.id
                                                        );
                                                    } else {
                                                        const index =
                                                            selectedIds.indexOf(
                                                                eligibility.id
                                                            );
                                                        if (index > -1) {
                                                            selectedIds.splice(
                                                                index,
                                                                1
                                                            );
                                                        }
                                                    }
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            eligibilityIds:
                                                                selectedIds,
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText
                                                primary={eligibility.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <br />
                        <div>
                            <PrimaryButton onClick={handleSubmit}>
                                Save
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
            {selectedAllocation && (
                <Modal
                    open={updateModalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10 dark:bg-[#122231]">
                        <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-600">
                            Edit Allocation Type
                        </h3>
                        <div className="h-[500px] overflow-auto">
                            <br />
                            <div>
                                <TextField
                                    label="Allocation Type Name"
                                    name="name"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mb-4"
                                />
                            </div>

                            <br />

                            <div>
                                <TextField
                                    label="Description"
                                    name="desc"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={formData.desc}
                                    onChange={handleInputChange}
                                    className="mb-4"
                                />
                            </div>

                            <br />
                            <div>
                                <TextField
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    fullWidth
                                    onChange={handleInputChange}
                                    value={formData.amount}
                                    className="mb-4"
                                />
                            </div>
                            <br />
                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>Select Funding</InputLabel>
                                    <Select
                                        value={formData.funding_id}
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                funding_id: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                    >
                                        {funding.map((f) => (
                                            <MenuItem key={f.id} value={f.id}>
                                                {f.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <br />

                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>Select Identifier</InputLabel>
                                    <Select
                                        value={formData.identifier_id}
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                identifier_id: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                    >
                                        {identifier.map((i) => (
                                            <MenuItem key={i.id} value={i.id}>
                                                {i.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <br />
                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>
                                        Select Eligible Commodities
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={formData.commodityIds} // Preloaded data
                                        onChange={(e) =>
                                            handleSelectChange(
                                                e,
                                                "commodityIds"
                                            )
                                        }
                                        renderValue={(selected) =>
                                            (selected as number[])
                                                .map(
                                                    (id) =>
                                                        commodities.find(
                                                            (item) =>
                                                                item.id === id
                                                        )?.name
                                                )
                                                .join(", ")
                                        }
                                    >
                                        <MenuItem value="all">
                                            <Checkbox
                                                checked={
                                                    formData.commodityIds
                                                        .length ===
                                                    commodities.length
                                                }
                                                onChange={() => {
                                                    const isAllSelected =
                                                        formData.commodityIds
                                                            .length ===
                                                        commodities.length;
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            commodityIds:
                                                                isAllSelected
                                                                    ? []
                                                                    : commodities.map(
                                                                          (c) =>
                                                                              c.id
                                                                      ),
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText primary="All" />
                                        </MenuItem>

                                        {commodities.map((commodity) => {
                                            const isChecked =
                                                formData.commodityIds.includes(
                                                    commodity.id
                                                );
                                            console.log(
                                                "Commodity ID:",
                                                commodity.id,
                                                "IsChecked:",
                                                isChecked
                                            );

                                            return (
                                                <MenuItem
                                                    key={commodity.id}
                                                    value={commodity.id}
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            const selectedIds =
                                                                [
                                                                    ...formData.commodityIds,
                                                                ];
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                selectedIds.push(
                                                                    commodity.id
                                                                ); // Use commodity.commodity_id here
                                                            } else {
                                                                const index =
                                                                    selectedIds.indexOf(
                                                                        commodity.id
                                                                    );
                                                                if (
                                                                    index > -1
                                                                ) {
                                                                    selectedIds.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                }
                                                            }
                                                            setFormData(
                                                                (
                                                                    prevState
                                                                ) => ({
                                                                    ...prevState,
                                                                    commodityIds:
                                                                        selectedIds,
                                                                })
                                                            );
                                                        }}
                                                    />
                                                    <ListItemText
                                                        primary={commodity.name}
                                                    />
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </div>

                            <br />

                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>
                                        Select Eligible Barangays
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={formData.barangayIds}
                                        onChange={(e) =>
                                            handleSelectChange(e, "barangayIds")
                                        }
                                        renderValue={(selected) =>
                                            (selected as number[])
                                                .map(
                                                    (id) =>
                                                        barangays.find(
                                                            (item) =>
                                                                item.id === id
                                                        )?.name
                                                )
                                                .join(", ")
                                        }
                                    >
                                        <MenuItem value="all">
                                            <Checkbox
                                                checked={
                                                    formData.barangayIds
                                                        .length ===
                                                    barangays.length
                                                }
                                                onChange={() => {
                                                    const isAllSelected =
                                                        formData.barangayIds
                                                            .length ===
                                                        barangays.length;
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            barangayIds:
                                                                isAllSelected
                                                                    ? []
                                                                    : barangays.map(
                                                                          (b) =>
                                                                              b.id
                                                                      ),
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText primary="All" />
                                        </MenuItem>

                                        {barangays.map((barangay) => (
                                            <MenuItem
                                                key={barangay.id}
                                                value={barangay.id}
                                            >
                                                <Checkbox
                                                    checked={formData.barangayIds.includes(
                                                        barangay.id
                                                    )}
                                                    onChange={(e) => {
                                                        const selectedIds = [
                                                            ...formData.barangayIds,
                                                        ];
                                                        if (e.target.checked) {
                                                            selectedIds.push(
                                                                barangay.id
                                                            );
                                                        } else {
                                                            const index =
                                                                selectedIds.indexOf(
                                                                    barangay.id
                                                                );
                                                            if (index > -1) {
                                                                selectedIds.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                        setFormData(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                barangayIds:
                                                                    selectedIds,
                                                            })
                                                        );
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={barangay.name}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <br />

                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>
                                        Select Eligible Crop Damage Cause
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={formData.cropDamageCauseIds}
                                        onChange={(e) =>
                                            handleSelectChange(
                                                e,
                                                "cropDamageCauseIds"
                                            )
                                        }
                                        renderValue={(selected) =>
                                            (selected as number[])
                                                .map(
                                                    (id) =>
                                                        cropDamages.find(
                                                            (item) =>
                                                                item.id === id
                                                        )?.name
                                                )
                                                .join(", ")
                                        }
                                    >
                                        <MenuItem value="all">
                                            <Checkbox
                                                checked={
                                                    formData.cropDamageCauseIds
                                                        .length ===
                                                    cropDamages.length
                                                }
                                                onChange={() => {
                                                    const isAllSelected =
                                                        formData
                                                            .cropDamageCauseIds
                                                            .length ===
                                                        cropDamages.length;
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            cropDamageCauseIds:
                                                                isAllSelected
                                                                    ? []
                                                                    : cropDamages.map(
                                                                          (c) =>
                                                                              c.id
                                                                      ),
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText primary="All" />
                                        </MenuItem>

                                        {cropDamages.map((damage) => (
                                            <MenuItem
                                                key={damage.id}
                                                value={damage.id}
                                            >
                                                <Checkbox
                                                    checked={formData.cropDamageCauseIds.includes(
                                                        damage.id
                                                    )}
                                                    onChange={(e) => {
                                                        const selectedIds = [
                                                            ...formData.cropDamageCauseIds,
                                                        ];
                                                        if (e.target.checked) {
                                                            selectedIds.push(
                                                                damage.id
                                                            );
                                                        } else {
                                                            const index =
                                                                selectedIds.indexOf(
                                                                    damage.id
                                                                );
                                                            if (index > -1) {
                                                                selectedIds.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                        setFormData(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                cropDamageCauseIds:
                                                                    selectedIds,
                                                            })
                                                        );
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={damage.name}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <br />

                            <div>
                                <FormControl fullWidth className="mb-4">
                                    <InputLabel>
                                        Select Eligible Farmers
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={formData.eligibilityIds}
                                        onChange={(e) =>
                                            handleSelectChange(
                                                e,
                                                "eligibilityIds"
                                            )
                                        }
                                        renderValue={(selected) =>
                                            (selected as number[])
                                                .map(
                                                    (id) =>
                                                        eligibilities.find(
                                                            (item) =>
                                                                item.id === id
                                                        )?.name
                                                )
                                                .join(", ")
                                        }
                                    >
                                        <MenuItem value="all">
                                            <Checkbox
                                                checked={
                                                    formData.eligibilityIds
                                                        .length ===
                                                    eligibilities.length
                                                }
                                                onChange={() => {
                                                    // Check if "All" is currently selected
                                                    const isAllSelected =
                                                        formData.eligibilityIds
                                                            .length ===
                                                        eligibilities.length;
                                                    setFormData(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            eligibilityIds:
                                                                isAllSelected
                                                                    ? []
                                                                    : eligibilities.map(
                                                                          (e) =>
                                                                              e.id
                                                                      ),
                                                        })
                                                    );
                                                }}
                                            />
                                            <ListItemText primary="All" />
                                        </MenuItem>

                                        {eligibilities.map((eligibility) => (
                                            <MenuItem
                                                key={eligibility.id}
                                                value={eligibility.id}
                                            >
                                                <Checkbox
                                                    checked={formData.eligibilityIds.includes(
                                                        eligibility.id
                                                    )}
                                                    onChange={(e) => {
                                                        const selectedIds = [
                                                            ...formData.eligibilityIds,
                                                        ];
                                                        if (e.target.checked) {
                                                            selectedIds.push(
                                                                eligibility.id
                                                            );
                                                        } else {
                                                            const index =
                                                                selectedIds.indexOf(
                                                                    eligibility.id
                                                                );
                                                            if (index > -1) {
                                                                selectedIds.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                        setFormData(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                eligibilityIds:
                                                                    selectedIds,
                                                            })
                                                        );
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={eligibility.name}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <br />
                            <div>
                                <PrimaryButton onClick={handleUpdateSubmit}>
                                    Update
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}
