import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Modal, TextField, Select, MenuItem, Checkbox, ListItemText, InputLabel, FormControl, } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Pencil, Plus, Trash2, Trash2Icon, } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
export default function AllocationTypeList({ auth }) {
    const [allocationTypes, setAllocationTypes] = useState([]);
    const [selectedAllocation, setSelectedAllocation] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
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
    const [commodities, setCommodities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [cropDamages, setCropDamages] = useState([]);
    const [identifier, setIdentifier] = useState([]);
    const [funding, setFunding] = useState([]);
    const [eligibilities, setEligibilities] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        try {
            const allocationTypesResponse = await axios.get("/allocation-types-list");
            if (allocationTypesResponse.status === 200 &&
                Array.isArray(allocationTypesResponse.data)) {
                console.log(allocationTypesResponse.data);
                setAllocationTypes(allocationTypesResponse.data);
                console.log(allocationTypes);
            }
            else {
                console.error("Invalid response data: ", allocationTypesResponse.data);
            }
            const commoditiesResponse = await axios.get("/commodities");
            const barangaysResponse = await axios.get("/barangays");
            const cropDamagesResponse = await axios.get("/crop-damages-causes");
            const eligibilitiesResponse = await axios.get("/eligibilities");
            const identifierResponse = await axios.get("/api/identifier");
            const fundingResponse = await axios.get("/api/fundings");
            setIdentifier(identifierResponse.data);
            setFunding(fundingResponse.data);
            setCommodities(commoditiesResponse.data);
            setBarangays(barangaysResponse.data);
            setCropDamages(cropDamagesResponse.data);
            setEligibilities(eligibilitiesResponse.data);
        }
        catch (error) {
            console.error("Failed to fetch data: ", error);
            toast.error("Failed to fetch data.");
        }
        finally {
            setLoading(false);
        }
    };
    const rows = (allocationTypes || []).map((type, index) => ({
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
        allocation_type_commodities: Array.isArray(type.allocation_type_commodities)
            ? type.allocation_type_commodities
            : [],
        allocation_type_barangays: Array.isArray(type.allocation_type_barangays)
            ? type.allocation_type_barangays
            : [],
        allocation_type_crop_damage_causes: Array.isArray(type.allocation_type_crop_damage_causes)
            ? type.allocation_type_crop_damage_causes
            : [],
        allocation_type_elligibilities: Array.isArray(type.allocation_type_elligibilities)
            ? type.allocation_type_elligibilities
            : [],
    }));
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (event, key) => {
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
            await axios.post("/allocation/store", formData);
            console.log("FormData being sent: ", formData);
            toast.success("Allocation type added successfully!");
            setModalOpen(false);
            resetFormData();
            fetchData();
        }
        catch (error) {
            console.error(error.response?.data || error.message);
            toast.error("Failed to add allocation type.");
        }
    };
    const handleEdit = (allocationId) => {
        console.log("Selected Allocation ID:", allocationId);
        const allocation = allocationTypes.find((item) => Number(item.allocation_type_id) === allocationId);
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
                commodityIds: allocation.allocation_type_commodities?.map((c) => c.commodity_id) || [],
                barangayIds: allocation.allocation_type_barangays?.map((b) => b.barangay_id) || [],
                cropDamageCauseIds: allocation.allocation_type_crop_damage_causes?.map((d) => d.crop_damage_cause_id) || [],
                eligibilityIds: allocation.allocation_type_elligibilities?.map((e) => e.elligibility_id) || [],
            });
            setUpdateModalOpen(true);
        }
        else {
            console.log("Allocation not found.");
        }
    };
    const handleDelete = async (allocationTypeId) => {
        try {
            const response = await axios.delete(`/allocation/destroy/${allocationTypeId}`);
            toast.success("Allocation type deleted successfully!");
            fetchData();
        }
        catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data || error.message);
            }
            else {
                console.error(error);
            }
            toast.error("Failed to delete allocation type.");
        }
    };
    const columns = [
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
            valueGetter: (params, row) => row.allocation_type_commodities
                .map((c) => c.commodity_name)
                .join(", ") || "Not Commodity Specific",
        },
        {
            field: "barangays",
            headerName: "Barangays",
            width: 160,
            valueGetter: (params, row) => row.allocation_type_barangays
                .map((b) => b.barangay_name)
                .join(", ") || "Not Barangay Specific",
        },
        {
            field: "allocation_type_crop_damage_causes",
            headerName: "Crop Damage Causes",
            width: 160,
            valueGetter: (params, row) => row.allocation_type_crop_damage_causes
                .map((d) => d.crop_damage_cause_name)
                .join(", ") || "Not Crop Damage Cause Specific",
        },
        {
            field: "elligibilities",
            headerName: "Eligibilities",
            width: 160,
            valueGetter: (params, row) => row.allocation_type_elligibilities
                .map((e) => e.elligibility_type)
                .join(", ") || "No eligibility specified",
        },
        {
            field: "actions",
            headerName: "Actions",
            align: "center",
            width: 200,
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleEdit(params.row.id), children: _jsx(Pencil, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash2Icon, { size: 20, color: "red" }) })] })),
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
            const response = await axios.put(`/allocationtypes/update/${formData.id}`, payload);
            fetchData();
            toast.success("Allocation updated successfully!");
            setUpdateModalOpen(false);
        }
        catch (error) {
            toast.error("Update failed. Please try again.");
            console.error("Update failed:", error);
        }
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
            await axios.post("/api/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Import successful");
        }
        catch (error) {
            alert("Import failed");
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
            await axios.post("/api/allocationtypes/delete", {
                ids: selectedIds,
            });
            setAllocationTypes((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
            setSelectedIds([]);
            toast.success("Data Deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting records:", error);
            toast.error("Data Deletion was not Successful!");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Authenticated, { user: auth.user, header: _jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full justify-between", children: [_jsx("h2", { className: "text-[24px] mt-2 font-semibold text-green-600 leading-tight", children: "Types of Allocation Management" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(PrimaryButton, { onClick: () => setModalOpen(true), children: [_jsx(Plus, { size: 24 }), "Add Allocation Type"] }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
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
                                    ) : (_jsxs("span", { className: "flex gap-2", children: [" ", _jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2", children: [_jsx(Trash2, { size: 14 }), " Deleting"] })) : ("")] })] })] }) }), children: [_jsx(Head, { title: "Allocation Type Management" }), _jsx(ToastContainer, {}), _jsx("div", { className: " ", children: _jsx("div", { style: {
                        height: "540px",
                        width: "100%",
                    }, className: "mt-4", children: _jsx(DataGrid, { rows: rows, columns: columns, initialState: {
                            pagination: { paginationModel: { pageSize: 10 } },
                        }, pageSizeOptions: [5, 10, 20], disableRowSelectionOnClick: true, loading: loading, slots: { toolbar: GridToolbar }, checkboxSelection: true, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, slotProps: {
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }, sx: {
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f5f5f5",
                            },
                            padding: "5px",
                            border: "none",
                        } }) }) }), _jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10 dark:bg-[#122231]", children: [_jsx("h3", { className: "text-lg font-bold mb-4 text-green-700 dark:text-green-600", children: "Add Allocation Type" }), _jsxs("div", { className: "h-[500px] overflow-auto", children: [_jsx("div", { children: _jsx(TextField, { label: "Allocation Type Name", name: "name", fullWidth: true, onChange: handleInputChange, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsx(TextField, { label: "Description", name: "desc", fullWidth: true, multiline: true, rows: 3, onChange: handleInputChange, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsx(TextField, { label: "Amount", name: "amount", type: "number", fullWidth: true, onChange: handleInputChange, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Funding" }), _jsx(Select, { value: formData.funding_id, onChange: (e) => setFormData((prevState) => ({
                                                    ...prevState,
                                                    funding_id: Number(e.target.value),
                                                })), children: funding.map((f) => (_jsx(MenuItem, { value: f.id, children: f.name }, f.id))) })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Identifier" }), _jsx(Select, { value: formData.identifier_id, onChange: (e) => setFormData((prevState) => ({
                                                    ...prevState,
                                                    identifier_id: Number(e.target.value),
                                                })), children: identifier.map((i) => (_jsx(MenuItem, { value: i.id, children: i.title }, i.id))) })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Commodities" }), _jsxs(Select, { multiple: true, value: formData.commodityIds, onChange: (e) => handleSelectChange(e, "commodityIds"), renderValue: (selected) => selected
                                                    .map((id) => commodities.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.commodityIds.length ===
                                                                    commodities.length, onChange: () => {
                                                                    const isAllSelected = formData.commodityIds
                                                                        .length ===
                                                                        commodities.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        commodityIds: isAllSelected
                                                                            ? []
                                                                            : commodities.map((c) => c.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), commodities.map((commodity) => (_jsxs(MenuItem, { value: commodity.id, children: [_jsx(Checkbox, { checked: formData.commodityIds.includes(commodity.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.commodityIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(commodity.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(commodity.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        commodityIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: commodity.name })] }, commodity.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Barangays" }), _jsxs(Select, { multiple: true, value: formData.barangayIds, onChange: (e) => handleSelectChange(e, "barangayIds"), renderValue: (selected) => selected
                                                    .map((id) => barangays.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.barangayIds.length ===
                                                                    barangays.length, onChange: () => {
                                                                    const isAllSelected = formData.barangayIds
                                                                        .length ===
                                                                        barangays.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        barangayIds: isAllSelected
                                                                            ? []
                                                                            : barangays.map((b) => b.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), barangays.map((barangay) => (_jsxs(MenuItem, { value: barangay.id, children: [_jsx(Checkbox, { checked: formData.barangayIds.includes(barangay.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.barangayIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(barangay.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(barangay.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        barangayIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: barangay.name })] }, barangay.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Crop Damage Cause" }), _jsxs(Select, { multiple: true, value: formData.cropDamageCauseIds, onChange: (e) => handleSelectChange(e, "cropDamageCauseIds"), renderValue: (selected) => selected
                                                    .map((id) => cropDamages.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.cropDamageCauseIds
                                                                    .length ===
                                                                    cropDamages.length, onChange: () => {
                                                                    const isAllSelected = formData.cropDamageCauseIds
                                                                        .length ===
                                                                        cropDamages.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        cropDamageCauseIds: isAllSelected
                                                                            ? []
                                                                            : cropDamages.map((c) => c.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), cropDamages.map((damage) => (_jsxs(MenuItem, { value: damage.id, children: [_jsx(Checkbox, { checked: formData.cropDamageCauseIds.includes(damage.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.cropDamageCauseIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(damage.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(damage.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        cropDamageCauseIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: damage.name })] }, damage.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Farmers" }), _jsxs(Select, { multiple: true, value: formData.eligibilityIds, onChange: (e) => handleSelectChange(e, "eligibilityIds"), renderValue: (selected) => selected
                                                    .map((id) => eligibilities.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.eligibilityIds
                                                                    .length ===
                                                                    eligibilities.length, onChange: () => {
                                                                    // Check if "All" is currently selected
                                                                    const isAllSelected = formData.eligibilityIds
                                                                        .length ===
                                                                        eligibilities.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        eligibilityIds: isAllSelected
                                                                            ? []
                                                                            : eligibilities.map((e) => e.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), eligibilities.map((eligibility) => (_jsxs(MenuItem, { value: eligibility.id, children: [_jsx(Checkbox, { checked: formData.eligibilityIds.includes(eligibility.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.eligibilityIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(eligibility.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(eligibility.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        eligibilityIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: eligibility.name })] }, eligibility.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsx(PrimaryButton, { onClick: handleSubmit, children: "Save" }) })] })] }) }), selectedAllocation && (_jsx(Modal, { open: updateModalOpen, onClose: () => setModalOpen(false), children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10 dark:bg-[#122231]", children: [_jsx("h3", { className: "text-lg font-bold mb-4 text-green-700 dark:text-green-600", children: "Edit Allocation Type" }), _jsxs("div", { className: "h-[500px] overflow-auto", children: [_jsx("br", {}), _jsx("div", { children: _jsx(TextField, { label: "Allocation Type Name", name: "name", fullWidth: true, value: formData.name, onChange: handleInputChange, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsx(TextField, { label: "Description", name: "desc", fullWidth: true, multiline: true, rows: 3, value: formData.desc, onChange: handleInputChange, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsx(TextField, { label: "Amount", name: "amount", type: "number", fullWidth: true, onChange: handleInputChange, value: formData.amount, className: "mb-4" }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Funding" }), _jsx(Select, { value: formData.funding_id, onChange: (e) => setFormData((prevState) => ({
                                                    ...prevState,
                                                    funding_id: Number(e.target.value),
                                                })), children: funding.map((f) => (_jsx(MenuItem, { value: f.id, children: f.name }, f.id))) })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Identifier" }), _jsx(Select, { value: formData.identifier_id, onChange: (e) => setFormData((prevState) => ({
                                                    ...prevState,
                                                    identifier_id: Number(e.target.value),
                                                })), children: identifier.map((i) => (_jsx(MenuItem, { value: i.id, children: i.title }, i.id))) })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Commodities" }), _jsxs(Select, { multiple: true, value: formData.commodityIds, onChange: (e) => handleSelectChange(e, "commodityIds"), renderValue: (selected) => selected
                                                    .map((id) => commodities.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.commodityIds
                                                                    .length ===
                                                                    commodities.length, onChange: () => {
                                                                    const isAllSelected = formData.commodityIds
                                                                        .length ===
                                                                        commodities.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        commodityIds: isAllSelected
                                                                            ? []
                                                                            : commodities.map((c) => c.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), commodities.map((commodity) => {
                                                        const isChecked = formData.commodityIds.includes(commodity.id);
                                                        console.log("Commodity ID:", commodity.id, "IsChecked:", isChecked);
                                                        return (_jsxs(MenuItem, { value: commodity.id, children: [_jsx(Checkbox, { checked: isChecked, onChange: (e) => {
                                                                        const selectedIds = [
                                                                            ...formData.commodityIds,
                                                                        ];
                                                                        if (e.target.checked) {
                                                                            selectedIds.push(commodity.id); // Use commodity.commodity_id here
                                                                        }
                                                                        else {
                                                                            const index = selectedIds.indexOf(commodity.id);
                                                                            if (index > -1) {
                                                                                selectedIds.splice(index, 1);
                                                                            }
                                                                        }
                                                                        setFormData((prevState) => ({
                                                                            ...prevState,
                                                                            commodityIds: selectedIds,
                                                                        }));
                                                                    } }), _jsx(ListItemText, { primary: commodity.name })] }, commodity.id));
                                                    })] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Barangays" }), _jsxs(Select, { multiple: true, value: formData.barangayIds, onChange: (e) => handleSelectChange(e, "barangayIds"), renderValue: (selected) => selected
                                                    .map((id) => barangays.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.barangayIds
                                                                    .length ===
                                                                    barangays.length, onChange: () => {
                                                                    const isAllSelected = formData.barangayIds
                                                                        .length ===
                                                                        barangays.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        barangayIds: isAllSelected
                                                                            ? []
                                                                            : barangays.map((b) => b.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), barangays.map((barangay) => (_jsxs(MenuItem, { value: barangay.id, children: [_jsx(Checkbox, { checked: formData.barangayIds.includes(barangay.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.barangayIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(barangay.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(barangay.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        barangayIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: barangay.name })] }, barangay.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Crop Damage Cause" }), _jsxs(Select, { multiple: true, value: formData.cropDamageCauseIds, onChange: (e) => handleSelectChange(e, "cropDamageCauseIds"), renderValue: (selected) => selected
                                                    .map((id) => cropDamages.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.cropDamageCauseIds
                                                                    .length ===
                                                                    cropDamages.length, onChange: () => {
                                                                    const isAllSelected = formData
                                                                        .cropDamageCauseIds
                                                                        .length ===
                                                                        cropDamages.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        cropDamageCauseIds: isAllSelected
                                                                            ? []
                                                                            : cropDamages.map((c) => c.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), cropDamages.map((damage) => (_jsxs(MenuItem, { value: damage.id, children: [_jsx(Checkbox, { checked: formData.cropDamageCauseIds.includes(damage.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.cropDamageCauseIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(damage.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(damage.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        cropDamageCauseIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: damage.name })] }, damage.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsxs(FormControl, { fullWidth: true, className: "mb-4", children: [_jsx(InputLabel, { children: "Select Eligible Farmers" }), _jsxs(Select, { multiple: true, value: formData.eligibilityIds, onChange: (e) => handleSelectChange(e, "eligibilityIds"), renderValue: (selected) => selected
                                                    .map((id) => eligibilities.find((item) => item.id === id)?.name)
                                                    .join(", "), children: [_jsxs(MenuItem, { value: "all", children: [_jsx(Checkbox, { checked: formData.eligibilityIds
                                                                    .length ===
                                                                    eligibilities.length, onChange: () => {
                                                                    // Check if "All" is currently selected
                                                                    const isAllSelected = formData.eligibilityIds
                                                                        .length ===
                                                                        eligibilities.length;
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        eligibilityIds: isAllSelected
                                                                            ? []
                                                                            : eligibilities.map((e) => e.id),
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: "All" })] }), eligibilities.map((eligibility) => (_jsxs(MenuItem, { value: eligibility.id, children: [_jsx(Checkbox, { checked: formData.eligibilityIds.includes(eligibility.id), onChange: (e) => {
                                                                    const selectedIds = [
                                                                        ...formData.eligibilityIds,
                                                                    ];
                                                                    if (e.target.checked) {
                                                                        selectedIds.push(eligibility.id);
                                                                    }
                                                                    else {
                                                                        const index = selectedIds.indexOf(eligibility.id);
                                                                        if (index > -1) {
                                                                            selectedIds.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setFormData((prevState) => ({
                                                                        ...prevState,
                                                                        eligibilityIds: selectedIds,
                                                                    }));
                                                                } }), _jsx(ListItemText, { primary: eligibility.name })] }, eligibility.id)))] })] }) }), _jsx("br", {}), _jsx("div", { children: _jsx(PrimaryButton, { onClick: handleUpdateSubmit, children: "Update" }) })] })] }) }))] }));
}
