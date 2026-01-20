import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Select from "react-select";
import SecondaryButton from "@/Components/SecondaryButton";
import AdminLayout from "@/Layouts/AdminLayout";
const customStyles = (isDarkMode) => ({
    control: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? "#122231" : "white",
        color: isDarkMode ? "white" : "black",
        borderColor: isDarkMode ? "#888" : "#ccc",
        "&:hover": {
            borderColor: isDarkMode ? "#aaa" : "#888",
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? "#122231" : "white",
        border: `1px solid ${isDarkMode ? "#888" : "#ccc"}`,
    }),
    menuList: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? "#122231" : "white",
    }),
    singleValue: (base) => ({
        ...base,
        color: isDarkMode ? "white" : "black",
    }),
    placeholder: (base) => ({
        ...base,
        color: isDarkMode ? "#aaa" : "#555",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: isDarkMode ? "white" : "black",
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? isDarkMode
                ? "#0d1a26"
                : "#d1d1d1"
            : isFocused
                ? isDarkMode
                    ? "#1a2b3c"
                    : "#e0e0e0"
                : isDarkMode
                    ? "#122231"
                    : "white",
        color: isDarkMode ? "white" : "black",
        "&:hover": {
            backgroundColor: isDarkMode ? "#1a2b3c" : "#e0e0e0",
        },
    }),
});
const isDarkMode = document.documentElement.classList.contains("dark");
export default function AllocationList({ auth, allocation = {
    data: [],
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    next_page_url: null,
    prev_page_url: null,
}, barangays = [], commodities = [], farmers = [], }) {
    const allocationData = allocation?.data || [];
    const [formData, setFormData] = useState({});
    const [farmerss, setFarmers] = useState([]);
    const [allocations, setAllocations] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingAllocationType, setLoadingAllocationType] = useState(true);
    const [loadingFarmers, setLoadingFarmers] = useState(true);
    const [allocationType, setAllocationType] = useState([]);
    const [commodity, setCommodities] = useState([]);
    const [loadingCommodities, setLoadingCommodities] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [remainingBalance, setRemainingBalance] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [filteredFundings, setFilteredFundings] = useState([]);
    const [selectedIdentifier, setSelectedIdentifier] = useState();
    const [filteredBarangays, setFilteredBarangays] = useState([]);
    const [filteredCommodities, setFilteredCommodities] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [file, setFile] = useState(null);
    const [newAllocation, setNewAllocation] = useState({
        allocation_type_id: "",
        brgy_id: "",
        identifier_id: "",
        amount: 0,
        commodity_id: 0,
        date_received: "",
        farmer_id: null,
        received: "",
        allocation_type: " ",
        funding_id: "",
    });
    useEffect(() => {
        fetchRemainingBalance(newAllocation.allocation_type_id);
    }, [newAllocation.allocation_type_id]);
    const fetchRemainingBalance = async (allocationTypeId) => {
        if (!allocationTypeId) {
            setRemainingBalance(null);
            return;
        }
        setLoadingBalance(true);
        try {
            const response = await axios.get(`/admin/api/allocations/remaining-balance/${allocationTypeId}`);
            setRemainingBalance(response.data.remainingBalance);
        }
        catch (error) {
            console.error("Error fetching remaining balance:", error);
            setRemainingBalance(null);
        }
        finally {
            setLoadingBalance(false);
        }
    };
    const fetchAllocationData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/admin/allocations/data");
            setAllocations(response.data);
            return response.data; // Return the fetched data
        }
        catch (error) {
            console.error("error: ", error);
            return []; // Return an empty array in case of error
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllocationData();
        fetchOptions();
        // const interval = setInterval(fetchAllocationData, 5000);
        // return () => clearInterval(interval);
    }, []);
    const columns = [
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
                return `${row?.farmer?.firstname || "Not Assigned"} ${row?.farmer?.lastname || "Not assigned"} `;
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
                return params.value ? (new Date(params.value).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                })) : (_jsx("span", { className: "text-red-600 text-[15px]", children: "Not Received Yet" }));
            },
            filterOperators: [
                {
                    label: "Received",
                    value: "received",
                    getApplyFilterFn: (filterItem) => {
                        if (!filterItem.value)
                            return null;
                        return (value, row) => row.date_received !== null &&
                            row.date_received !== undefined;
                    },
                },
                {
                    label: "Not Received",
                    value: "not_received",
                    getApplyFilterFn: (filterItem) => {
                        if (!filterItem.value)
                            return null;
                        return (value, row) => row.date_received === null ||
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
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleEdit(params.row.id), children: _jsx(Pencil, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash, { size: 20, color: "red" }) })] })),
        },
    ];
    const fetchOptions = async () => {
        try {
            const [commoditiesData, allocationTypeData, cropDamageCauseData, barangaysData, farmersData,] = await Promise.all([
                axios.get("/admin/data/commodity"),
                axios.get("/admin/data/allocationtype"),
                axios.get("/admin/data/cropDamageCause"),
                axios.get("/admin/data/barangay"),
                axios.get("/admin/data/farmers"),
            ]);
            setFarmers(farmersData.data.map((farmer) => ({
                label: `${farmer.firstname || ""} ${farmer.lastname}`,
                value: farmer.id,
            })));
            setCommodities(commoditiesData.data.map((commodity) => ({
                label: commodity.name,
                value: commodity.id,
            })));
            setAllocationType(allocationTypeData.data.map((allocationType) => ({
                label: allocationType.name,
                value: allocationType.id,
            })));
            setLoadingCommodities(false);
            setLoadingFarmers(false);
            setLoadingAllocationType(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching options:", error.response?.data || error.message);
            }
            else {
                console.error("An unknown error occurred:", error);
            }
        }
    };
    const handleEdit = (allocationID) => {
        if (!allocationData) {
            toast.error("Allocation Data not Found");
            console.error("User data is not available");
            return;
        }
        const allocation = allocationData.find((allocation) => String(allocation.id) === String(allocationID));
        if (allocation) {
            setSelectedAllocation({
                ...allocation,
                farmer_id: allocation.farmer?.id || null,
                commodity_id: allocation.commodity?.id || null,
                brgy_id: allocation.barangay?.id || null,
            });
            setIsUpdateModalOpen(true);
        }
        else {
            console.error("Allocation not found");
        }
    };
    useEffect(() => {
        if (isUpdateModalOpen && selectedAllocation) {
            setSelectedAllocation({
                ...selectedAllocation,
                farmer_id: selectedAllocation.farmer?.id || null,
                commodity_id: selectedAllocation.commodity?.id ?? null,
                brgy_id: selectedAllocation.barangay?.id || null,
            });
        }
    }, [isUpdateModalOpen]);
    const handleDelete = async (allocations) => {
        console.log("select");
        if (window.confirm("Are you sure you want to delete this allocation record?")) {
            try {
                await router.delete(`/admin/allocations/destroy/${allocations}`);
                toast.success("allocation deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
                fetchAllocationData();
                setAllocations((prevData = []) => prevData.filter((setAllocations) => setAllocations !== setAllocations));
            }
            catch (error) {
                toast.error("Failed to delete allocation");
            }
        }
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setIsUpdateModalOpen(false);
        setSelectedAllocation(null);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAllocation((prevAllocation) => {
            if (!prevAllocation)
                return prevAllocation;
            let updatedValue = value;
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
    const handleSelectChange = (selectedOption, field) => {
        setNewAllocation((prev) => {
            if (!prev)
                return prev;
            if (field === "farmer_id") {
                return {
                    ...prev,
                    farmer_id: selectedOption ? selectedOption.value : null, // Store only the ID
                };
            }
            return {
                ...prev,
                [field]: selectedOption ? selectedOption.value : null,
            };
        });
    };
    const handleUpdateSelectChange = (selectedOption, name) => {
        setSelectedAllocation((prevAllocation) => {
            if (!prevAllocation)
                return prevAllocation;
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newAllocation.allocation_type_id ||
            !newAllocation.received ||
            !newAllocation.brgy_id ||
            !newAllocation.identifier_id ||
            !newAllocation.funding_id) {
            toast.error("Please fill in all required fields.");
            return;
        }
        const formData = new FormData();
        console.log("Submitting allocation data:", newAllocation);
        formData.append("identifier_id", String(newAllocation.identifier_id));
        formData.append("funding_id", String(newAllocation.funding_id));
        Object.keys(newAllocation).forEach((key) => {
            const value = newAllocation[key];
            if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });
        try {
            await axios.post("/admin/allocations/store", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Allocation added successfully");
            fetchAllocationData();
            setAllocations([]);
            closeModal();
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding allocation:", error.response.data);
                toast.error(`Failed to add allocation: ${error.response.data.message || "Validation error"}`);
            }
            else {
                toast.error("Failed to add allocation");
            }
        }
    };
    const farmerOptions = farmers.map((farmer) => ({
        label: `${farmer.firstname} ${farmer.lastname}`,
        value: farmer.id.toString(),
    }));
    const [selectedAllocation, setSelectedAllocation] = useState(null);
    const handleFarmerSelect = (farmer) => {
        setNewAllocation((prev) => ({
            ...prev,
            farmer_id: farmer.id,
        }));
    };
    useEffect(() => {
        if (selectedAllocation) {
            console.log("Selected Allocation:", selectedAllocation);
        }
    }, [selectedAllocation]);
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedAllocation) {
            toast.error("No allocation selected");
            return;
        }
        const updates = {
            allocation_type_id: selectedAllocation.allocation_type_id,
            farmer_id: selectedAllocation.farmer_id || "",
            commodity_id: selectedAllocation.commodity_id || "",
            brgy_id: selectedAllocation.brgy_id || "",
            received: selectedAllocation.received,
            amount: selectedAllocation.amount,
            funding_id: selectedAllocation.funding_id || "",
            identifier_id: selectedAllocation.identifier_id || "",
            date_received: selectedAllocation.date_received || "",
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
            const response = await axios.put(`/admin/allocations/update/${selectedAllocation.id}`, updates, { headers: { "X-CSRF-TOKEN": csrfToken } });
            if (response.status === 200) {
                toast.success("Allocation updated successfully!");
                setIsUpdateModalOpen(false);
                const updatedAllocations = await fetchAllocationData();
                const updatedAllocation = updatedAllocations.find((alloc) => alloc.id === selectedAllocation.id);
                if (updatedAllocation) {
                    setSelectedAllocation(updatedAllocation);
                }
            }
            else {
                toast.error("Failed to update allocation.");
            }
        }
        catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Unexpected error occurred.");
        }
    };
    useEffect(() => {
        if (selectedAllocation?.allocation_type_id) {
            axios
                .get(`/admin/api/allocation-type/${selectedAllocation.allocation_type_id}/dependencies`)
                .then((res) => {
                setFilteredBarangays(res.data.barangays);
                setFilteredCommodities(res.data.commodities);
                setSelectedAllocation((prev) => prev
                    ? {
                        ...prev,
                        identifier_id: res.data.identifier_id,
                        identifier_name: res.data.identifier_name || "",
                        funding_id: res.data.funding_id,
                        funding_name: res.data.funding_name || "",
                    }
                    : prev);
            })
                .catch((error) => console.error("Error fetching dependencies:", error));
        }
        else {
            setFilteredBarangays([]);
            setFilteredCommodities([]);
            setSelectedAllocation((prev) => prev ? { ...prev, identifier_id: "", funding_id: "" } : prev);
        }
    }, [selectedAllocation?.allocation_type_id]);
    useEffect(() => {
        if (selectedAllocation?.allocation_type_id) {
            axios
                .get(`/admin/api/allocation-type/${selectedAllocation.allocation_type_id}/dependencies`)
                .then((res) => {
                setFilteredBarangays(res.data.barangays);
                setFilteredCommodities(res.data.commodities);
                setSelectedAllocation((prev) => ({
                    ...prev,
                    identifier_id: res.data.identifier_id,
                    identifier_name: res.data.identifier_name || "",
                    funding_id: res.data.funding_id,
                    funding_name: res.data.funding_name || "",
                }));
            })
                .catch((error) => console.error("Error fetching dependencies:", error));
        }
        else {
            setFilteredBarangays([]);
            setFilteredCommodities([]);
            setSelectedAllocation((prev) => ({
                ...prev,
                identifier_id: "",
                funding_id: "",
            }));
        }
    }, [selectedAllocation?.allocation_type_id]);
    useEffect(() => {
        if (newAllocation.allocation_type_id) {
            axios
                .get(`/admin/api/allocation-type/${newAllocation.allocation_type_id}/dependencies`)
                .then((res) => {
                setFilteredBarangays(res.data.barangays);
                setFilteredCommodities(res.data.commodities);
                setNewAllocation((prev) => ({
                    ...prev,
                    identifier_id: res.data.identifier_id,
                    identifier_name: res.data.identifier_name || "",
                    funding_id: res.data.funding_id,
                    funding_name: res.data.funding_name || "",
                }));
            })
                .catch((error) => console.error("Error fetching dependencies:", error));
        }
        else {
            setFilteredBarangays([]);
            setFilteredCommodities([]);
            setNewAllocation((prev) => ({
                ...prev,
                identifier_id: "",
                funding_id: "",
            }));
        }
    }, [newAllocation.allocation_type_id]);
    const handleFileChange = (event) => {
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
            await axios.post("/admin/import-allocations", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchAllocationData();
            toast.success("Allocation Data imported successfully!");
        }
        catch (error) {
            alert("Error importing file.");
            console.error(error);
        }
    };
    const handleSelectionChange = (selection) => {
        setSelectedIds(selection);
    };
    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("No records selected!");
            return;
        }
        if (!window.confirm("Are you sure you want to delete selected records?")) {
            return;
        }
        try {
            setLoading(true);
            await axios.post("/admin/api/allocations/delete", {
                ids: selectedIds,
            });
            setAllocations((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
            setSelectedIds([]);
            toast.success("Allocation Deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Allocation Deletion was not Successful!");
        }
        finally {
            setLoading(false); // Stop loading
        }
    };
    const handleFarmerSelected = (farmer) => {
        console.log("Selected Farmer:", farmer);
    };
    return (_jsxs(AdminLayout, { user: auth.user, header: _jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full justify-between", children: [_jsx("h2", { className: "text-[25px] mt-2 font-semibold text-green-600 leading-tight", children: "Allocation Management" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(PrimaryButton, { onClick: openModal, children: [_jsx(Plus, { size: 24 }), "Add Allocation"] }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
                                    background: selectedIds.length > 0 ? "red" : "gray",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: selectedIds.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }, children: [loading ? (_jsx("span", { className: "loader" }) // Add a loading animation here
                                    ) : (_jsxs("span", { className: "flex gap-2", children: [" ", _jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2", children: [_jsx(Trash2, { size: 14 }), " Deleting"] })) : ("")] })] })] }) }), children: [_jsx(Head, { title: "Allocation Management" }), _jsx(ToastContainer, {}), _jsx(Modal, { show: isModalOpen, onClose: closeModal, children: _jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "text-xl mb-2 text-green-700 font-semibold", children: "Add New Allocation" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("select", { name: "allocation_type_id", value: newAllocation.allocation_type_id, onChange: (e) => {
                                        const selectedAllocationType = allocationType.find((type) => String(type.value) ===
                                            e.target.value);
                                        setNewAllocation((prev) => ({
                                            ...prev,
                                            allocation_type_id: e.target.value,
                                            identifier_id: selectedAllocationType
                                                ? selectedAllocationType.identifier_id
                                                : "",
                                            identifier_name: selectedAllocationType
                                                ? selectedAllocationType.identifier_name
                                                : "",
                                            funding_id: selectedAllocationType
                                                ? selectedAllocationType.funding_id
                                                : "",
                                            funding_name: selectedAllocationType
                                                ? selectedAllocationType.funding_name
                                                : "",
                                        }));
                                    }, className: "mb-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Allocation Type" }), allocationType.map((allocationType) => (_jsx("option", { value: allocationType.value, className: "dark:text-white dark:bg-[#122231]", children: allocationType.label }, allocationType.value)))] }), _jsx(Select, { options: farmerss, isLoading: loadingFarmers, value: newAllocation.farmer_id
                                        ? farmerss.find((farmer) => farmer.value ===
                                            newAllocation.farmer_id) || null
                                        : null, onChange: (selectedOption) => handleSelectChange(selectedOption, "farmer_id"), placeholder: "Select Farmer", styles: customStyles(isDarkMode) }), _jsxs("select", { name: "received", value: newAllocation.received, onChange: (e) => setNewAllocation((prev) => ({
                                        ...prev,
                                        received: e.target.value,
                                        date_received: e.target.value === "no"
                                            ? ""
                                            : prev.date_received,
                                    })), className: "mt-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", disabled: true, children: "Received?" }), _jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "yes", children: "Yes" }), _jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "no", children: "No" })] }), loadingBalance ? (_jsx("p", { className: "text-gray-500", children: "Checking remaining balance..." })) : remainingBalance !== null ? (_jsxs("p", { className: `mt-2 ${remainingBalance > 0
                                        ? "text-green-500"
                                        : "text-red-500"}`, children: ["Remaining Balance: ", remainingBalance] })) : null, _jsx(TextInput, { type: "number", name: "amount", value: newAllocation.amount, placeholder: "Enter Amount", onChange: (e) => {
                                        const value = Number(e.target.value);
                                        if (value > remainingBalance) {
                                            alert("Amount exceeds remaining balance!");
                                            return;
                                        }
                                        setNewAllocation((prev) => ({
                                            ...prev,
                                            amount: value,
                                        }));
                                    }, className: "mt-1 w-full border-gray-300 rounded-lg shadow-sm", disabled: remainingBalance === 0 }), remainingBalance === 0 && (_jsx("p", { className: "text-red-500 mt-2", children: "There is no more remaining balance." })), _jsx(TextInput, { name: "identifier_id", value: newAllocation.identifier_name, placeholder: "Identifier Name", className: "mt-3 w-full rounded-lg border-gray-300", disabled: true }), _jsxs("select", { name: "brgy_id", value: newAllocation.brgy_id, onChange: (e) => setNewAllocation((prev) => ({
                                        ...prev,
                                        brgy_id: e.target.value,
                                    })), className: "mt-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Select Barangay" }), filteredBarangays.map((barangay) => (_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: barangay.id, children: barangay.name }, barangay.id)))] }), _jsxs("select", { name: "commodity_id", value: newAllocation.commodity_id, onChange: (e) => setNewAllocation((prev) => ({
                                        ...prev,
                                        commodity_id: Number(e.target.value),
                                    })), className: "mt-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Select Commodity" }), filteredCommodities.map((commodity) => (_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: commodity.id, children: commodity.name }, commodity.id)))] }), _jsx(TextInput, { name: "funding_id", value: newAllocation.funding_name, placeholder: "Funding Name", className: "mt-3 w-full rounded-lg border-gray-300", disabled: true }), _jsx(TextInput, { type: "date", name: "date_received", value: newAllocation.date_received, onChange: (e) => setNewAllocation((prev) => ({
                                        ...prev,
                                        date_received: e.target.value,
                                    })), className: "mt-1 w-full border-gray-300 rounded-lg shadow-sm", disabled: newAllocation.received !== "yes", required: newAllocation.received === "yes" }), _jsx(PrimaryButton, { type: "submit", className: "mt-4", children: "Submit" })] })] }) }), _jsx(Box, { sx: { height: "550px" }, children: _jsx(DataGrid, { rows: allocations, columns: columns, initialState: {
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, pageSizeOptions: [50, 100, 200, 350, 500], loading: loading, slots: { toolbar: GridToolbar }, checkboxSelection: true, slotProps: {
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }, sx: {
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                        },
                        border: "none",
                    } }) }), _jsx(Modal, { show: isUpdateModalOpen, onClose: () => setIsUpdateModalOpen(false), children: selectedAllocation ? (_jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "text-xl mb-2 text-green-700 font-semibold", children: "Update Allocation" }), _jsxs("form", { onSubmit: handleUpdate, children: [_jsxs("select", { name: "allocation_type_id", value: selectedAllocation.allocation_type_id || "", onChange: (e) => {
                                        const selectedAllocationType = allocationType.find((type) => String(type.value) ===
                                            e.target.value);
                                        setSelectedAllocation((prev) => ({
                                            ...prev,
                                            allocation_type_id: e.target.value,
                                            identifier_id: selectedAllocationType?.identifier_id ||
                                                "",
                                            identifier_name: selectedAllocationType?.identifier_name ||
                                                "",
                                            funding_id: selectedAllocationType?.funding_id ||
                                                "",
                                            funding_name: selectedAllocationType?.funding_name ||
                                                "",
                                        }));
                                    }, className: "mb-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Allocation Type" }), allocationType.map((allocationType) => (_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: allocationType.value, children: allocationType.label }, allocationType.value)))] }), _jsx(Select, { options: farmerss, isLoading: loadingFarmers, value: selectedAllocation?.farmer_id
                                        ? farmerss.find((farmer) => farmer.value ===
                                            selectedAllocation?.farmer_id) || null
                                        : null, onChange: (selectedOption) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        farmer_id: selectedOption
                                            ? selectedOption.value
                                            : null,
                                    })), placeholder: "Select Farmer", styles: customStyles(isDarkMode) }), _jsxs("select", { name: "received", value: selectedAllocation.received || "", onChange: (e) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        received: e.target.value,
                                        date_received: e.target.value === "no"
                                            ? ""
                                            : prev.date_received,
                                    })), className: "mt-3 w-full rounded-lg dark:text-white dark:bg-[#122231] border-gray-300", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", disabled: true, children: "Received?" }), _jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "yes", children: "Yes" }), _jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "no", children: "No" })] }), _jsx(TextInput, { type: "number", name: "amount", value: selectedAllocation.amount || "", onChange: (e) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        amount: Number(e.target.value),
                                    })), className: "mt-1 w-full border-gray-300 rounded-lg shadow-sm" }), _jsx(TextInput, { name: "identifier_id", value: selectedAllocation.identifier_name || "", className: "mt-3 w-full rounded-lg border-gray-300", disabled: true }), _jsxs("select", { name: "brgy_id", value: selectedAllocation.brgy_id || "", onChange: (e) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        brgy_id: Number(e.target.value),
                                    })), className: "mt-3 w-full rounded-lg border-gray-300 dark:text-white dark:bg-[#122231]", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Select Barangay" }), filteredBarangays.map((barangay) => (_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: barangay.id, children: barangay.name }, barangay.id)))] }), _jsxs("select", { name: "commodity_id", value: selectedAllocation.commodity_id || "", onChange: (e) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        commodity_id: Number(e.target.value),
                                    })), className: "mt-3 w-full rounded-lg border-gray-300", children: [_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: "", children: "Select Commodity" }), filteredCommodities.map((commodity) => (_jsx("option", { className: "dark:text-white dark:bg-[#122231]", value: commodity.id, children: commodity.name }, commodity.id)))] }), _jsx(TextInput, { name: "funding_id", value: selectedAllocation.funding_name || "", className: "mt-3 w-full rounded-lg border-gray-300", disabled: true }), _jsx(TextInput, { type: "date", name: "date_received", value: selectedAllocation.date_received instanceof
                                        Date
                                        ? selectedAllocation.date_received
                                            .toISOString()
                                            .split("T")[0] // Convert Date to "YYYY-MM-DD"
                                        : selectedAllocation.date_received || "", onChange: (e) => setSelectedAllocation((prev) => ({
                                        ...prev,
                                        date_received: e.target.value, // Always a string
                                    })), className: "mt-1 w-full border-gray-300 rounded-lg shadow-sm", disabled: selectedAllocation.received !== "yes", required: selectedAllocation.received === "yes" }), _jsx(PrimaryButton, { type: "submit", className: "mt-4", children: "Update" })] })] })) : (_jsx("div", { children: "Loading..." })) })] }));
}
