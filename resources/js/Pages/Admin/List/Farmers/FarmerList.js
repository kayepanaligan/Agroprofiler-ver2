import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { format } from "date-fns";
import React, { useState, useEffect, } from "react";
import { Head, router } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, Import, Pencil, PlusIcon, Trash, Trash2 } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import SecondaryButton from "@/Components/SecondaryButton";
import AdminLayout from "@/Layouts/AdminLayout";
export default function FarmerList({ auth, farmers, barangays = [], }) {
    const [farmersData, setFarmersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [barangayData, setBarangayData] = useState();
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [existingFarmers, setExistingFarmers] = useState([]);
    const fetchFarmerData = () => {
        setLoading(true);
        axios
            .get("/admin/farmers/data")
            .then((response) => {
            const data = response.data;
            setFarmersData(data);
            console.log("Farmersss data: ", farmersData);
        })
            .catch((error) => {
            console.error("error: ", error);
        })
            .finally(() => {
            setLoading(false);
        });
    };
    const fetchBarangayData = () => {
        axios
            .get("/admin/barangays/data")
            .then((response) => {
            const data = response.data;
            setBarangayData(data);
        })
            .catch((error) => {
            console.error("error: ", error);
        });
    };
    useEffect(() => {
        fetchFarmerData();
        fetchBarangayData();
    }, []);
    const getBarangayName = (barangayId) => {
        const barangay = barangays.find((b) => b.id === barangayId);
        return barangay ? barangay.name : "Not Assigned";
    };
    const columns = [
        { field: "id", headerName: "#", width: 50 },
        {
            field: "rsbsa_ref_no",
            headerName: "RSBSA_REF_#",
            width: 250,
        },
        { field: "firstname", headerName: "First name", width: 120 },
        { field: "lastname", headerName: "Last name", width: 120 },
        { field: "age", headerName: "Age", width: 90 },
        {
            field: "brgy_id",
            headerName: "Barangay",
            width: 150,
            valueGetter: (value, row) => {
                return row?.barangay?.name || "Not Assigned";
            },
        },
        { field: "status", headerName: "Status", width: 140 },
        { field: "dob", headerName: "DOB", width: 120 },
        { field: "sex", headerName: "Sex", width: 70 },
        { field: "4ps", headerName: "4ps", width: 50 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            // flex: 1,
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleEdit(params.row.id), children: _jsx(Pencil, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash, { size: 20, color: "red" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-blue-300", onClick: () => handleView(params.row.id), children: _jsx(EyeIcon, { size: 20, color: "blue" }) })] })),
        },
    ];
    const closeEditModal = () => setIsEditModalOpen(false);
    const sex = [
        { label: "female", value: "female" },
        { label: "male", value: "male" },
    ];
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const totalItems = farmers?.total || 0;
    const handleView = (farmersData) => {
        console.log(`/admin/farmprofile/${farmersData}`);
        router.visit(`/admin/farmprofile/${farmersData}`);
    };
    const handleEdit = (farmerId) => {
        if (!farmersData) {
            console.error("User data is not available");
            return;
        }
        const farmer = farmersData.find((farmer) => farmer.id === farmerId);
        if (farmer) {
            setSelectedFarmer(farmer);
            setIsEditModalOpen(true);
            console.log("Selected farmer: ", farmer);
        }
        else {
            console.error("farmer not found");
        }
    };
    const handleDelete = async (farmersData) => {
        if (window.confirm("Are you sure you want to delete this farmer?")) {
            try {
                await router.delete(`/admin/farmers/destroy/${farmersData}`);
                fetchFarmerData();
                setFarmersData((prevData = []) => prevData.filter((farmersData) => farmersData !== farmersData));
                toast.success("Farmer deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            }
            catch (error) {
                toast.error("Failed to delete farmer");
            }
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedFarmer?.dob) {
            toast.error("Date of Birth is required.");
            return;
        }
        const formattedFarmer = {
            ...selectedFarmer,
            dob: selectedFarmer.dob ? selectedFarmer.dob : null,
            brgy_id: selectedFarmer.brgy_id,
        };
        console.log("Formatted Farmer ID:", formattedFarmer.id);
        console.log(formattedFarmer);
        try {
            await axios.post(`/admin/farmers/update/${formattedFarmer.id}`, {
                _method: "PUT",
                rsbsa_ref_no: formattedFarmer.rsbsa_ref_no,
                firstname: formattedFarmer.firstname,
                lastname: formattedFarmer.lastname,
                dob: formattedFarmer.dob,
                age: formattedFarmer.age,
                sex: formattedFarmer.sex,
                status: formattedFarmer.status,
                coop: formattedFarmer.coop,
                pwd: formattedFarmer.pwd,
                "4ps": formattedFarmer["4ps"],
                brgy_id: formattedFarmer.brgy_id,
            });
            console.log(`/admin/farmers/update/${formattedFarmer.id}`);
            console.log("RSBSA REF NUMBER in Payload:", formattedFarmer.rsbsa_ref_no);
            fetchFarmerData();
            setFarmersData((prevData = []) => prevData.filter((farmersData) => farmersData !== farmersData));
            toast.success("Farmer updated successfully", {
                draggable: true,
                closeOnClick: true,
            });
            closeEditModal();
        }
        catch (error) {
            console.error("Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(`Failed to update farmer: ${error.response.statusText}`);
            }
            else {
                toast.error("Failed to update farmer");
            }
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFarmer, setNewFarmer] = useState({
        rsbsa_ref_no: "",
        firstname: "",
        lastname: "",
        age: "",
        sex: "",
        brgy_id: "",
        status: "",
        coop: "",
        pwd: "",
        "4ps": "",
        dob: "",
    });
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleSelectChange = (e) => {
        setNewFarmer({
            ...newFarmer,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newFarmer.dob) {
            toast.error("Date of Birth is required.");
            return;
        }
        // Ensure `formattedFarmer` matches the `Farmer` type
        const formattedFarmer = {
            id: Date.now(), // Temporary ID until backend assigns a real ID
            rsbsa_ref_no: newFarmer.rsbsa_ref_no || "",
            firstname: newFarmer.firstname || "",
            lastname: newFarmer.lastname || "",
            age: Number(newFarmer.age) || 0, // Ensure age is a number
            sex: newFarmer.sex || "",
            brgy_id: Number(newFarmer.brgy_id) || 0, // Ensure it's a number
            status: newFarmer.status || "",
            coop: newFarmer.coop || "",
            pwd: newFarmer.pwd || "",
            "4ps": newFarmer["4ps"] || "",
            dob: newFarmer.dob ? new Date(newFarmer.dob) : new Date(), // Ensure dob is a Date type
            // Ensure it's a date
            barangay: {
                id: Number(newFarmer.brgy_id) || 0, // Provide valid `barangay.id`
                name: "Unknown", // Placeholder for barangay name
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        // Prepare FormData for API request
        const formData = new FormData();
        Object.entries(formattedFarmer).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });
        try {
            setFarmersData((prevFarmers = []) => [
                ...prevFarmers,
                formattedFarmer,
            ]);
            const response = await axios.post("/admin/farmers/store", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Refresh data after successful submission
            fetchFarmerData();
            toast.success("Farmer added successfully", {
                draggable: true,
                closeOnClick: true,
            });
            closeModal();
        }
        catch (error) {
            setFarmersData((prevFarmers = []) => prevFarmers.filter((farmer) => farmer.id !== formattedFarmer.id));
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding farmer:", error.response.data);
                toast.error(`Failed to add farmer: ${error.response.data.message || "Validation error"}`);
            }
            else {
                toast.error("Failed to add farmer");
            }
        }
    };
    const handleUpdateInputChange = (e) => {
        if (!selectedFarmer)
            return;
        setSelectedFarmer({
            ...selectedFarmer,
            [e.target.name]: e.target.value,
        });
    };
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
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
            fetchFarmerData();
            toast.success("Data successully imported ! ", {
                draggable: true,
                closeOnClick: true,
            });
        }
        catch (error) {
            toast.error("Data unsuccessully imported !", {
                draggable: true,
                closeOnClick: true,
            });
        }
    };
    const [rsbsaExists, setRsbsaExists] = useState(false);
    const [selectedExistingFarmer, setSelectedExistingFarmer] = useState(null);
    const [farmerDetailModal, setFarmerDetailModal] = useState(false);
    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setNewFarmer({ ...newFarmer, [name]: value });
        if (name === "rsbsa_ref_no" && value.length >= 5) {
            try {
                const response = await axios.get(`/admin/api/check-farmer?rsbsa_ref_no=${value}`);
                setRsbsaExists(response.data.exists);
            }
            catch (error) {
                console.error("Error checking RSBSA:", error);
            }
        }
        if (name === "firstname" || name === "lastname") {
            try {
                const { firstname, lastname } = newFarmer;
                if (firstname.trim() !== "" && lastname.trim() !== "") {
                    const response = await axios.get(`/admin/api/check-farmer?firstname=${firstname}&lastname=${lastname}`);
                    setExistingFarmers(response.data.farmers);
                }
            }
            catch (error) {
                console.error("Error fetching farmer names:", error);
            }
        }
    };
    const [selectedIds, setSelectedIds] = useState([]);
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
            await axios.post("/admin/api/farmers/delete", { ids: selectedIds });
            setFarmersData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
            setSelectedIds([]);
            toast.success("Farmers Deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Farmers Deletion was not Successful!");
        }
        finally {
            setLoading(false);
        }
    };
    const [pinnedColumns, setPinnedColumns] = React.useState({
        left: ["name"],
    });
    const handlePinnedColumnsChange = React.useCallback((updatedPinnedColumns) => {
        setPinnedColumns(updatedPinnedColumns);
    }, []);
    const customStyles = (isDarkMode) => ({
        control: (base) => ({
            ...base,
            backgroundColor: "transparent",
            color: isDarkMode ? "white" : "black",
            borderColor: isDarkMode ? "#888" : "#ccc",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "white",
            color: isDarkMode ? "white" : "black",
        }),
        singleValue: (base) => ({
            ...base,
            color: isDarkMode ? "white" : "black",
        }),
        placeholder: (base) => ({
            ...base,
            color: isDarkMode ? "#aaa" : "#555",
        }),
        option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused
                ? isDarkMode
                    ? "#444"
                    : "#eee"
                : "transparent",
            color: isDarkMode ? "white" : "black",
        }),
    });
    return (_jsxs(AdminLayout, { user: auth.user, header: _jsx(_Fragment, { children: _jsx("div", { className: "flex w-full justify-between", children: _jsx("h2", { className: "text-[24px]  mt-2 font-semibold text-green-600 leading-tight", children: "Farmers Management" }) }) }), children: [_jsx(Head, { title: "Farmers Management" }), _jsx(ToastContainer, {}), _jsxs("div", { className: "flex w-full gap-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(TextInput, { type: "file", onChange: handleFileChange, accept: ".xlsx,.csv", className: "rounded-md border p-1" }), _jsxs(PrimaryButton, { className: "flex gap-2 rounded-md", onClick: handleImport, children: [_jsx(Import, { size: 16 }), "Import"] })] }), _jsx(PrimaryButton, { className: "text-sm justify-center align-content-center rounded-lg text-white", onClick: openModal, children: _jsxs("span", { className: "flex gap-2", children: [_jsx(PlusIcon, { size: 18 }), "Add new"] }) }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
                            background: selectedIds.length > 0 ? "red" : "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: selectedIds.length > 0 ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }, children: [loading ? (_jsx("span", { className: "loader" }) // Add a loading animation here
                            ) : (_jsxs("span", { className: "flex gap-2 justify-center align-center", children: [_jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2 justify-center align-center", children: [" ", _jsx(Trash2, { size: 14 }), " Deleting..."] })) : ("")] })] }), _jsx(Modal, { show: isModalOpen, onClose: closeModal, children: _jsxs("div", { className: "p-8 h-[600px] overflow-auto", children: [_jsx("div", { className: "p-2", children: _jsx("h2", { className: "text-lg text-green-600 font-semibold", children: "Add New Farmer" }) }), _jsx("div", { className: "mt-4", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "block gap-5 w-full mb-2", children: [_jsx(TextInput, { name: "rsbsa_ref_no", value: newFarmer.rsbsa_ref_no, onChange: handleInputChange, placeholder: "RSSBA_REF_NO", className: `w-full ${rsbsaExists ? "border-red-500" : ""}` }), rsbsaExists && (_jsx("p", { className: "text-red-500 text-sm", children: "This RSBSA number is already taken." }))] }), _jsx(TextInput, { name: "firstname", value: newFarmer.firstname, onChange: handleInputChange, placeholder: "Firstname ", className: "w-full mb-2" }), _jsx(TextInput, { name: "firstname", value: newFarmer.firstname, onChange: handleInputChange, placeholder: "Firstname", className: "w-full mb-2" }), _jsx(TextInput, { name: "lastname", value: newFarmer.lastname, onChange: handleInputChange, placeholder: "Lastname", className: "w-full mb-2" }), _jsx("br", {}), _jsx(TextInput, { type: "number", name: "age", value: newFarmer.age, onChange: handleInputChange, placeholder: "Age", className: "w-full mb-2" }), _jsxs("select", { name: "sex", value: newFarmer.sex, onChange: handleSelectChange, className: "rounded-lg w-full mb-2 border-gray-300 text-slate-500", children: [_jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "", disabled: true, children: "Gender" }), sex.map((sexOption) => (_jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: sexOption.value, children: sexOption.label }, sexOption.value)))] }), _jsxs("select", { name: "brgy_id", value: newFarmer.brgy_id, onChange: handleSelectChange, className: "w-full rounded-lg border-gray-300 mb-2 text-slate-500 dark:bg-[#122231] dark:text-white", children: [_jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "", children: "Barangay" }), barangays.map((barangay) => (_jsx("option", { value: barangay.id, className: "dark:bg-[#122231] dark:text-white", children: barangay.name }, barangay.id)))] }), _jsxs("select", { name: "4ps", value: newFarmer["4ps"], onChange: handleSelectChange, className: " w-full rounded-lg border-gray-300 mb-2 text-slate-500 dark:bg-[#122231] dark:text-white", children: [_jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "", children: "Is 4Ps?" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "yes", children: "Yes" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "no", children: "No" })] }), _jsxs("select", { name: "pwd", value: newFarmer.pwd, onChange: handleSelectChange, className: "w-full rounded-lg border-gray-300 mb-2 text-slate-500 dark:bg-[#122231] dark:text-white", children: [_jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "", disabled: true, children: "Is PWD?" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "yes", children: "Yes" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "no", children: "No" })] }), _jsx("br", {}), _jsxs("div", { children: [_jsx("input", { type: "date", id: "dob", name: "dob", value: newFarmer.dob, onChange: (e) => setNewFarmer({
                                                    ...newFarmer,
                                                    dob: "1990-01-01",
                                                }), className: "w-full border-gray-300 rounded-lg shadow-sm mb-2 text-slate-500 dark:bg-[#122231]", required: true }), _jsxs("select", { name: "status", value: newFarmer.status, onChange: handleSelectChange, className: "w-full rounded-lg border-gray-300 text-slate-500", children: [_jsx("option", { value: "", disabled: true, children: "Status" }), _jsx("option", { value: "registered", children: "Registered" }), _jsx("option", { value: "unregistered", children: "Unregistered" })] }), _jsx("br", {}), _jsx("input", { type: "text", id: "coop", name: "coop", placeholder: "Cooperative", value: newFarmer.coop, onChange: handleInputChange, className: "mt-1 w-full border-gray-300 rounded-lg shadow-sm dark:bg-[#122231]" })] }), _jsx("div", { className: "mt-4 p-4 ", children: _jsx(PrimaryButton, { onClick: handleSubmit, children: "Submit" }) })] }) })] }) }), _jsx(Box, { sx: {
                    height: "520px",
                    padding: "0px",
                    maxWidth: "100%",
                    border: "none",
                    overflowX: "auto",
                    backgroundColor: "transparent",
                }, children: _jsx(DataGrid, { rows: farmersData, columns: columns, initialState: {
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }, pageSizeOptions: [50, 100, 200, 350, 500], loading: loading, checkboxSelection: true, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, slots: { toolbar: GridToolbar }, slotProps: {
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }, sx: {
                        border: "none",
                        background: "transparent",
                    } }) }), selectedFarmer && (_jsx(Modal, { show: isEditModalOpen, onClose: closeEditModal, children: _jsxs("div", { className: "p-5", children: [_jsx("div", { className: "p-2 ", children: _jsx("h2", { className: "text-[20px] mb-2 text-green-600 font-semibold", children: "Edit Farmer" }) }), _jsx("div", { children: _jsxs("form", { onSubmit: handleUpdate, children: [_jsxs("div", { className: "px-6 py-4 h-[500px] overflow-auto mb-11", children: [_jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "RSBSA REF NUMBER", htmlFor: "rsbsa_ref_no", className: "mb-2" }), _jsx(TextInput, { name: "rsbsa_ref_no", value: selectedFarmer?.rsbsa_ref_no ||
                                                            "", onChange: handleUpdateInputChange, placeholder: "RSBSA Reference Number (Optional)", className: "w-full mb-4" })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "First Name", htmlFor: "firstName", className: "mb-2" }), _jsx(TextInput, { name: "firstname", value: selectedFarmer.firstname, onChange: handleUpdateInputChange, placeholder: "Firstname", className: "w-full mb-4" })] }), _jsxs("div", { className: "px-4 ", children: [_jsx(InputLabel, { value: "Last Name", htmlFor: "lastName", className: "mb-2" }), _jsx(TextInput, { name: "lastname", value: selectedFarmer.lastname, onChange: handleUpdateInputChange, placeholder: "Lastname", className: "w-full mb-4" })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Age", htmlFor: "age" }), _jsx(TextInput, { name: "age", value: selectedFarmer.age, onChange: handleUpdateInputChange, placeholder: "Age", className: "w-full mb-4" })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Cooperative", htmlFor: "coop" }), _jsx(TextInput, { type: "text", id: "coop", name: "coop", placeholder: "coop", value: selectedFarmer.coop, onChange: handleUpdateInputChange, className: "w-full mb-4" })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Sex", htmlFor: "sex" }), _jsxs("select", { name: "sex", className: "rounded-lg border-gray-300 w-full mb-4", value: selectedFarmer.sex, onChange: (e) => setSelectedFarmer({
                                                            ...selectedFarmer,
                                                            sex: e.target.value,
                                                        }), children: [_jsx("option", { value: "", children: "Select Sex" }), sex.map((sexOption) => (_jsx("option", { value: sexOption.value, children: sexOption.label }, sexOption.value)))] })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Barangay", htmlFor: "barangay" }), _jsxs("select", { name: "brgy_id", value: selectedFarmer.barangay?.id ||
                                                            "", onChange: (e) => {
                                                            const barangayId = Number(e.target.value);
                                                            const selectedBarangay = barangays.find((b) => b.id === barangayId);
                                                            setSelectedFarmer({
                                                                ...selectedFarmer,
                                                                barangay: selectedBarangay || {
                                                                    id: 0,
                                                                    name: "Unknown",
                                                                },
                                                                brgy_id: barangayId,
                                                            });
                                                        }, className: "w-full rounded-lg border-gray-300 mb-4 dark:[#122231]", children: [_jsx("option", { className: "dark:[#122231]", value: "", disabled: true, children: "Barangay" }), barangays.map((barangay) => (_jsx("option", { value: barangay.id, className: "dark:[#122231]", children: barangay.name }, barangay.id)))] })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Is the farmer a 4ps Beneficiary?", htmlFor: "4ps" }), _jsxs("select", { name: "4ps", value: selectedFarmer["4ps"], onChange: (e) => setSelectedFarmer({
                                                            ...selectedFarmer,
                                                            "4ps": e.target.value,
                                                        }), className: "w-full rounded-lg border-gray-300 mb-4", children: [_jsx("option", { value: "", disabled: true, children: "Is 4Ps?" }), _jsx("option", { value: "yes", children: "Yes" }), _jsx("option", { value: "no", children: "No" })] })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Is the Farmer a PWD?", htmlFor: "pwd" }), _jsxs("select", { name: "pwd", value: selectedFarmer.pwd, onChange: (e) => setSelectedFarmer({
                                                            ...selectedFarmer,
                                                            pwd: e.target.value,
                                                        }), className: "mb-4 w-full rounded-lg border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Is PWD?" }), _jsx("option", { value: "yes", children: "Yes" }), _jsx("option", { value: "no", children: "No" })] })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Birthdate", htmlFor: "dob" }), _jsx(TextInput, { type: "date", id: "dob", name: "dob", value: selectedFarmer.dob
                                                            ? format(new Date(selectedFarmer.dob), "yyyy-MM-dd")
                                                            : "", onChange: handleUpdateInputChange, className: "w-full mb-4 border-gray-300 rounded-lg shadow-sm", required: true })] }), _jsxs("div", { className: "px-4", children: [_jsx(InputLabel, { value: "Registration Status", htmlFor: "dob" }), _jsxs("select", { name: "status", value: selectedFarmer.status ||
                                                            (selectedFarmer?.rsbsa_ref_no
                                                                ? "registered"
                                                                : "unregistered"), onChange: (e) => setSelectedFarmer({
                                                            ...selectedFarmer,
                                                            status: e.target.value,
                                                        }), className: "w-full rounded-lg border-gray-300", children: [_jsx("option", { value: "", children: "Status" }), _jsx("option", { value: "registered", children: "registered" }), _jsx("option", { value: "unregistered", children: "unregistered" })] })] })] }), _jsx("div", { className: "fixed bottom-0 bg-white dark:bg-transparent w-full py-4  px-6", children: _jsx(PrimaryButton, { type: "submit", children: "Update" }) })] }) })] }) }))] }));
}
