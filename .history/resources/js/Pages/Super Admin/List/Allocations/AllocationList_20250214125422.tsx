import CheckBoxDropDown from "@/Components/CheckBoxDropDown";
import List from "@/Components/List";
import DropdownSelect from "@/Components/Listbox";
import PrimaryButton from "@/Components/PrimaryButton";
import Search from "@/Components/Search";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import {
    Download,
    EyeIcon,
    Import,
    Pencil,
    Plus,
    PlusIcon,
    Trash,
    Trash2,
} from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FarmerSearch from "@/Components/Listbox";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Select from "react-select";
import SecondaryButton from "@/Components/SecondaryButton";

interface Barangay {
    id: number;
    name: string;
}

interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
}

interface Commodity {
    id: number;
    name: string;
}

interface AllocationType {
    id: number;
    name: string;
}

interface NewAllocation {
    allocation_type_id: string;
    allocation_type: string;
    brgy_id: string;
    commodity_id: string;
    date_received: string;
    farmer_id: number | null;
    received: string;
}

interface Allocation {
    id: number;
    allocation_type_id: string;
    allocation_type: string;
    farmer?: {
        id: number;
        firstname: string;
        lastname: string;
    };
    received: string;
    funding?: {
        id: number;
        name: string;
    };
    identifier?: {
        id: number;
        title: string;
    };
    date_received: Date | string;
    allocations?: {
        id: number;
        name: string;
        funding_name: string;
    };
    commodity?: {
        id: number;
        name: string;
    };
    barangay?: {
        id: number;
    };
}

type PaginatedAllocation = {
    data: Allocation[];
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

interface AllocationProps extends PageProps {
    allocation: PaginatedAllocation;
    barangays: Barangay[];
    commodities: Commodity[];
    farmers: Farmer[];
    allocationTypes: AllocationType[];
}

interface Option {
    id: number;
    label: string;
    value: number;
    firstname: string;
    lastname: string;
}

export default function AllocationList({
    auth,
    allocation = {
        data: [],
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        next_page_url: null,
        prev_page_url: null,
    },
    barangays = [],
    commodities = [],
    farmers = [],
}: AllocationProps) {
    const allocationData = allocation?.data || [];
    const [formData, setFormData] = useState<any>({});
    const [farmerss, setFarmers] = useState<Option[]>([]);
    const [allocations, setAllocations] = useState<AllocationProps[]>();
    const [loading, setLoading] = useState(false);
    const [loadingAllocationType, setLoadingAllocationType] = useState(true);
    const [loadingFarmers, setLoadingFarmers] = useState(true);
    const [allocationType, setAllocationType] = useState<Option[]>([]);
    const [commodity, setCommodities] = useState<Option[]>([]);
    const [loadingCommodities, setLoadingCommodities] = useState(true);

    const fetchAllocationData = () => {
        setLoading(true);

        axios
            .get("/allocations/data")

            .then((response) => {
                const data = response.data;
                setAllocations(data);
                console.log("Allocations data: ", allocations);
            })
            .catch((error) => {
                console.error("error: ", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAllocationData();
        fetchOptions();
    }, []);

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 70 },
        {
            field: "allocation_type_id",
            headerName: "Type",
            width: 210,
            valueGetter: (value, row) => row.allocation_type.name,
        },
        {
            field: "farmer_id",
            headerName: "Receiver",
            width: 220,
            valueGetter: (value, row) => {
                return `${row?.farmer?.firstname || "Not Assigned"} ${
                    row?.farmer?.lastname || "Not assigned"
                } `;
            },
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 130,
            valueGetter: (value, row) => row.amount,
        },
        {
            field: "identifier",
            headerName: "Identifier",
            width: 130,
            valueGetter: (value, row) => {
                return row.allocation_type?.identifier?.title || "N/A";
            },
        },
        {
            field: "funding",
            headerName: "Source",
            width: 130,
            valueGetter: (value, row) => {
                return row.allocation_type?.funding?.name || "N/A";
            },
        },

        {
            field: "brgy_id",
            headerName: "Barangay",
            width: 150,
            valueGetter: (value, row) => {
                return row?.barangay?.name || "Not Assigned";
            },
        },

        {
            field: "commodity_id",
            headerName: "Commodity",
            width: 150,
            valueGetter: (value, row) => {
                return row?.commodity?.name || "Not Assigned";
            },
        },

        {
            field: "received",
            headerName: "Received",
            width: 100,
        },
        {
            field: "date_received",
            headerName: "Date Received",
            width: 200,
            renderCell: (params) => {
                return params.value ? (
                    new Date(params.value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                    })
                ) : (
                    <span className="text-red-600 text-[15px]">
                        Not Received Yet
                    </span>
                );
            },
            filterOperators: [
                {
                    label: "Received",
                    value: "received",
                    getApplyFilterFn: (filterItem) => {
                        if (!filterItem.value) return null;
                        return (value, row) =>
                            row.date_received !== null &&
                            row.date_received !== undefined;
                    },
                },
                {
                    label: "Not Received",
                    value: "not_received",
                    getApplyFilterFn: (filterItem) => {
                        if (!filterItem.value) return null;
                        return (value, row) =>
                            row.date_received === null ||
                            row.date_received === undefined;
                    },
                },
            ],
        },

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
                        className="border rounded-[12px] p-2 hover:bg-red-300"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <Trash size={20} color="red" />
                    </button>
                </div>
            ),
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAllocation, setNewAllocation] = useState<NewAllocation>({
        allocation_type_id: "",
        brgy_id: "",
        commodity_id: "",
        date_received: "",
        farmer_id: null,
        received: "",
        allocation_type: " ",
    });

    const fetchOptions = async () => {
        try {
            const [
                commoditiesData,
                allocationTypeData,
                cropDamageCauseData,
                barangaysData,
                farmersData,
            ] = await Promise.all([
                axios.get("/data/commodity"),
                axios.get("/data/allocationtype"),
                axios.get("/data/cropDamageCause"),
                axios.get("/data/barangay"),
                axios.get("/data/farmers"),
            ]);

            setFarmers(
                farmersData.data.map((farmer: any) => ({
                    label: `${farmer.firstname || ""} ${farmer.lastname}`,
                    value: farmer.id,
                }))
            );

            setCommodities(
                commoditiesData.data.map((commodity: any) => ({
                    label: commodity.name,
                    value: commodity.id,
                }))
            );

            setAllocationType(
                allocationTypeData.data.map((allocationType: any) => ({
                    label: allocationType.name,
                    value: allocationType.id,
                }))
            );

            setLoadingCommodities(false);
            setLoadingFarmers(false);
            setLoadingAllocationType(false);
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

    const handleEdit = (allocationID: number) => {
        if (!allocationData) {
            console.error("User data is not available");
            return;
        }
        const allocation = allocationData.find(
            (allocation) => allocation.id === allocationID
        );

        if (allocation) {
            setSelectedAllocation(allocation);
            console.log(allocation);
            setIsUpdateModalOpen(true);
            console.log("Selected farmer: ", allocation);
        } else {
            console.error("farmer not found");
        }
    };

    const handleDelete = async (allocations: Allocation) => {
        console.log("select");
        if (
            window.confirm(
                "Are you sure you want to delete this allocation record?"
            )
        ) {
            try {
                await router.delete(`/allocations/destroy/${allocations}`);
                toast.success("allocation deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
                fetchAllocationData();
                setAllocations((prevData = []) =>
                    prevData.filter(
                        (setAllocations) => setAllocations !== setAllocations
                    )
                );
            } catch (error) {
                toast.error("Failed to delete allocation");
            }
        }
    };

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setSelectedAllocation((prevAllocation) => {
            if (!prevAllocation) return prevAllocation;

            let updatedValue: string | number | null = value;

            if (name === "date_received" && value) {
                updatedValue = new Date(value).toISOString().split("T")[0]; // Convert to ISO date string (YYYY-MM-DD)
            }

            if (name === "brgy_id" || name === "commodity_id") {
                updatedValue = value ? parseInt(value, 10) : null; // Parse to number or set to null
            }

            return {
                ...prevAllocation,
                [name]: updatedValue,
            };
        });
    };

    const handleSelectChange = (
        selectedOption: { value: number; label: string } | null,
        field: string
    ) => {
        setNewAllocation((prev) => ({
            ...prev,
            [field]: selectedOption ? selectedOption.value : 0,
        }));
    };

    const handleUpdateSelectChange = (selectedOption: any, name: string) => {
        setSelectedAllocation((prevAllocation) => {
            if (!prevAllocation) return prevAllocation;

            // Handle nested objects
            if (name === "farmer_id") {
                return {
                    ...prevAllocation,
                    farmer: selectedOption
                        ? {
                              id: selectedOption.value,
                              firstname: selectedOption.label.split(" ")[0],
                              lastname: selectedOption.label.split(" ")[1],
                          }
                        : null,
                };
            }

            if (name === "brgy_id") {
                return {
                    ...prevAllocation,
                    barangay: selectedOption
                        ? {
                              id: selectedOption.value,
                              name: selectedOption.label,
                          }
                        : null,
                };
            }

            if (name === "commodity_id") {
                return {
                    ...prevAllocation,
                    commodity: selectedOption
                        ? {
                              id: selectedOption.value,
                              name: selectedOption.label,
                          }
                        : null,
                };
            }

            // For other cases
            return {
                ...prevAllocation,
                [name]: selectedOption ? selectedOption.value : null,
            };
        });
    };

    const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAllocation((prev) => ({
            ...prev,
            commodity_id: e.target.value,
        }));
    };

    const handleBrgyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAllocation((prev) => ({
            ...prev,
            brgy_id: e.target.value,
        }));
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (
            !newAllocation.farmer_id ||
            !newAllocation.allocation_type_id ||
            !newAllocation.received ||
            !newAllocation.brgy_id
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();

        console.log("Submitting damage data:", newAllocation);
        (Object.keys(newAllocation) as (keyof typeof newAllocation)[]).forEach(
            (key) => {
                const value = newAllocation[key];
                if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            }
        );

        console.log("new allocation", newAllocation);

        try {
            await axios.post("/allocations/store", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Allocation added successfully");

            fetchAllocationData();
            setAllocations((prevData = []) =>
                prevData.filter(
                    (setAllocations) => setAllocations !== setAllocations
                )
            );
            closeModal();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding damage:", error.response.data);
                toast.error(
                    `Failed to add damage: ${
                        error.response.data.message || "Validation error"
                    }`
                );
            } else {
                toast.error("Failed to add damage");
            }
        }
    };

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [selectedFarmer, setSelectedFarmer] = useState(null);

    const farmerOptions = farmers.map((farmer) => ({
        label: `${farmer.firstname} ${farmer.lastname}`,
        value: farmer.id.toString(),
    }));

    const [selectedAllocation, setSelectedAllocation] =
        useState<Allocation | null>({
            id: 0,
            allocation_type_id: "",
            allocation_type: "",
            farmer: {
                id: 0,
                firstname: "",
                lastname: "",
            },
            received: "",
            date_received: "",
            commodity: { id: 0, name: "" },
            barangay: { id: 0, name: "" },
        });

    const handleView = (allocation: Allocation) => {
        setSelectedAllocation(allocation);
        openModal();
    };

    const handleFarmerSelect = (farmer: Farmer) => {
        setNewAllocation((prev) => ({
            ...prev,
            farmer_id: farmer.id,
        }));
    };

    useEffect(() => {
        if (selectedAllocation) {
            console.log("Selected Allocation:", selectedAllocation); // Log whenever selectedAllocation changes
        }
    }, [selectedAllocation]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAllocation) {
            console.error("No allocation selected");
            toast.error("No allocation selected");
            return;
        }

        const updates = {
            allocation_type_id: selectedAllocation.allocation_type_id,
            farmer_id: selectedAllocation.farmer?.id,
            received: selectedAllocation.received,
            date_received: selectedAllocation.date_received,
            commodity_id: selectedAllocation.commodity?.id,
            brgy_id: selectedAllocation.barangay?.id || "",
            _method: "PUT",
        };

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            if (!csrfToken) {
                toast.error("CSRF token not found.");
                return;
            }

            const response = await axios.post(
                `/allocations/update/${selectedAllocation.id}`, // Use POST here, not PUT
                updates,
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                    },
                }
            );

            if (response.status === 200) {
                fetchAllocationData();
                console.log("Allocation updated successfully:", response.data);
                toast.success("Allocation updated successfully!");
                setIsUpdateModalOpen(false);
            } else {
                console.error("Error updating allocation:", response);
                toast.error("Failed to update allocation.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Unexpected error occurred.");
        }
    };

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const [filteredBarangays, setFilteredBarangays] = useState([]);
    const [filteredCommodities, setFilteredCommodities] = useState([]);

    useEffect(() => {
        if (newAllocation.allocation_type_id) {
            axios
                .get(
                    `/api/allocation-type/${newAllocation.allocation_type_id}/dependencies`
                )
                .then((res) => {
                    setFilteredBarangays(res.data.barangays);
                    setFilteredCommodities(res.data.commodities);
                })
                .catch((error) =>
                    console.error("Error fetching dependencies:", error)
                );
        } else {
            setFilteredBarangays([]);
            setFilteredCommodities([]);
        }
    }, [newAllocation.allocation_type_id]);

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            await axios.post("/import-allocations", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchAllocationData();
            toast.success("Allocation Data imported successfully!");
        } catch (error) {
            alert("Error importing file.");
            console.error(error);
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
            setLoading(true); // Start loading
            await axios.post("/api/allocations/delete", { ids: selectedIds });

            setAllocations((prev) =>
                prev.filter((row) => !selectedIds.includes(row.id))
            );
            setSelectedIds([]);
            toast.success("Allocation Deleted successfully!");
        } catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Allocation Deletion was not Successful!");
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
                            Allocation Management
                        </h2>
                        <div className="flex gap-2">
                            <TextInput
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx,.csv"
                                className="rounded-md border p-2"
                            />
                            <PrimaryButton
                                className="flex gap-2 rounded-md"
                                onClick={handleUpload}
                            >
                                <Import size={16} />
                                Import
                            </PrimaryButton>
                        </div>
                        <PrimaryButton onClick={openModal}>
                            <Plus size={24} />
                            Add Allocation
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
            <Head title="Allocation Management" />
            <ToastContainer />
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-10">
                    <h2 className="text-xl mb-2">Add New Allocation</h2>
                    <form onSubmit={handleSubmit}>
                        <select
                            name="allocation_type_id"
                            value={newAllocation.allocation_type_id}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    allocation_type_id: e.target.value,
                                }))
                            }
                            className="mb-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="">Allocation Type</option>
                            {allocationType.map((allocationType) => (
                                <option
                                    key={allocationType.value}
                                    value={allocationType.value}
                                >
                                    {allocationType.label}
                                </option>
                            ))}
                        </select>

                        <FarmerSearch
                            farmers={farmers}
                            onFarmerSelect={handleFarmerSelect}
                        />

                        <select
                            name="received"
                            value={newAllocation.received}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    received: e.target.value,
                                    date_received:
                                        e.target.value === "no"
                                            ? ""
                                            : prev.date_received,
                                }))
                            }
                            className="mt-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="" disabled>
                                Received?
                            </option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>

                        <TextInput
                            type="number"
                            name="amount"
                            value={newAllocation.amount}
                            placeholder="Enter Amount"
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                }))
                            }
                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                        />

                        <select
                            name="identifier_id"
                            value={newAllocation.identifier_id}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    identifier_id: e.target.value,
                                }))
                            }
                            className="mt-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Identifier</option>
                            {filteredCommodities.map((identifier) => (
                                <option
                                    key={identifier.id}
                                    value={identifier.id}
                                >
                                    {identifier.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="brgy_id"
                            value={newAllocation.brgy_id}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    brgy_id: e.target.value,
                                }))
                            }
                            className="mt-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Barangay</option>
                            {filteredBarangays.map((barangay) => (
                                <option key={barangay.id} value={barangay.id}>
                                    {barangay.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="commodity_id"
                            value={newAllocation.commodity_id}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    commodity_id: e.target.value,
                                }))
                            }
                            className="mt-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Commodity</option>
                            {filteredCommodities.map((commodity) => (
                                <option key={commodity.id} value={commodity.id}>
                                    {commodity.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="funding_id"
                            value={newAllocation.funding_id}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    commodity_id: e.target.value,
                                }))
                            }
                            className="mt-3 w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Source of Funds</option>
                            {filteredCommodities.map((funding) => (
                                <option key={funding.id} value={funding.id}>
                                    {funding.name}
                                </option>
                            ))}
                        </select>

                        <TextInput
                            type="date"
                            name="date_received"
                            value={newAllocation.date_received}
                            onChange={(e) =>
                                setNewAllocation((prev) => ({
                                    ...prev,
                                    date_received: e.target.value,
                                }))
                            }
                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                            disabled={newAllocation.received !== "yes"}
                            required={newAllocation.received === "yes"}
                        />

                        {/* Submit Button */}
                        <PrimaryButton type="submit" className="mt-4">
                            Submit
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>
            <Box sx={{ height: "550px" }}>
                <DataGrid
                    rows={allocations}
                    columns={columns}
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
            <Modal
                show={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
            >
                {selectedAllocation ? (
                    <div className="p-10">
                        <h2 className="text-xl mb-2">Update Allocation</h2>
                        <form onSubmit={handleUpdate}>
                            {/* Allocation Type */}
                            <select
                                name="allocation_type_id"
                                value={
                                    selectedAllocation.allocation_type_id || ""
                                }
                                onChange={(e) =>
                                    handleUpdateSelectChange(
                                        {
                                            value: parseInt(e.target.value),
                                            label: e.target.options[
                                                e.target.selectedIndex
                                            ].text,
                                        },
                                        "allocation_type_id"
                                    )
                                }
                                className="mb-3 w-full rounded-lg border-gray-300"
                            >
                                <option value="">Select Allocation Type</option>
                                {allocationType.map((allocation) => (
                                    <option
                                        key={allocation.value}
                                        value={allocation.value}
                                    >
                                        {allocation.label}
                                    </option>
                                ))}
                            </select>

                            {/* Select Farmer */}
                            <Select
                                options={farmerss}
                                isLoading={loadingFarmers}
                                value={
                                    selectedAllocation.farmer
                                        ? {
                                              value: selectedAllocation.farmer
                                                  .id,
                                              label: `${selectedAllocation.farmer.firstname} ${selectedAllocation.farmer.lastname}`,
                                          }
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    handleUpdateSelectChange(
                                        selectedOption,
                                        "farmer_id"
                                    )
                                }
                                placeholder="Select Farmer"
                            />

                            {/* Received */}
                            <select
                                name="received"
                                value={selectedAllocation.received || ""}
                                onChange={handleInputChange}
                                className="mt-3 w-full rounded-lg border-gray-300"
                            >
                                <option value="" disabled>
                                    Received?
                                </option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>

                            {/* Barangay */}
                            <select
                                name="brgy_id"
                                value={selectedAllocation?.barangay?.id || ""}
                                onChange={(e) =>
                                    handleUpdateSelectChange(
                                        {
                                            value: parseInt(e.target.value),
                                            label: e.target.options[
                                                e.target.selectedIndex
                                            ].text,
                                        },
                                        "brgy_id"
                                    )
                                }
                                className="mt-3 w-full rounded-lg border-gray-300"
                            >
                                <option value="">Select Barangay</option>
                                {barangays.map((barangay) => (
                                    <option
                                        key={barangay.id}
                                        value={barangay.id}
                                    >
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>

                            {/* Commodity */}
                            <select
                                name="commodity_id"
                                value={selectedAllocation.commodity?.id || ""}
                                onChange={(e) =>
                                    handleUpdateSelectChange(
                                        {
                                            value: parseInt(e.target.value),
                                            label: e.target.options[
                                                e.target.selectedIndex
                                            ].text,
                                        },
                                        "commodity_id"
                                    )
                                }
                                className="mt-3 w-full rounded-lg border-gray-300"
                            >
                                <option value="">Select Commodity</option>
                                {commodities.map((commodity) => (
                                    <option
                                        key={commodity.id}
                                        value={commodity.id}
                                    >
                                        {commodity.name}
                                    </option>
                                ))}
                            </select>

                            {/* Date Received */}
                            <input
                                type="date"
                                name="date_received"
                                value={
                                    selectedAllocation?.date_received
                                        ? selectedAllocation.date_received
                                              .toString()
                                              .split("T")[0]
                                        : ""
                                } // Ensure empty string if date is null
                                onChange={handleInputChange}
                                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                            />

                            <PrimaryButton type="submit" className="mt-4">
                                Update
                            </PrimaryButton>
                        </form>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </Modal>
        </Authenticated>
    );
}
