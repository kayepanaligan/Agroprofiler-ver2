import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Plus, Trash, ChevronLeft, TrashIcon, EditIcon, Cake, House, Phone, Accessibility, HandCoins, Pencil, } from "lucide-react";
import Modal from "@/Components/Modal";
import { Head, Link } from "@inertiajs/react";
import Select from "react-select";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tab, Tabs } from "@/Components/Tabs";
import Timeline from "@/Components/Timeline";
import { Button } from "@headlessui/react";
import AdminLayout from "@/Layouts/AdminLayout";
export default function FarmProfile({ auth, farmer }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [allocations, setAllocations] = useState([]);
    const [cropDamages, setCropDamages] = useState([]);
    const [cropActivities, setCropActivities] = useState([]);
    const [farms, setFarms] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [cropDamageCause, setCropDamageCause] = useState([]);
    const [allocationType, setAllocationType] = useState([]);
    const [loadingCommodities, setLoadingCommodities] = useState(true);
    const [barangays, setBarangays] = useState([]);
    const [loadingBarangays, setLoadingBarangays] = useState(true);
    const [loadingFarms, setLoadingFarms] = useState(true);
    const [loadingCropDamageCause, setLoadingCropDamageCause] = useState(true);
    const [loadingAllocationType, setLoadingAllocationType] = useState(true);
    const [data, setData] = useState([]);
    const [processing, setProcessing] = useState(false);
    const handleOpenModal = (type, data) => {
        console.log("Opening modal with data:", data);
        console.log("Opening modal with data:", type);
        console.log("File Path in data:", data?.file_path);
        console.log("Image Preview Set to:", data?.file_path ? `${data.file_path}` : "");
        setModalType(type);
        setFormData({
            ...data,
            allocation_type_id: data?.allocation_type_id || "",
            commodity_id: data?.commodity_id || "",
            received: data?.received || "",
            date_received: data?.date_received || "",
            title: data?.title || "",
            desc: data?.desc || "",
            date: data?.date || "",
            file_path: "", // ✅ Keep empty because file input cannot be prefilled
            imagePreview: data?.file_path
                ? `${window.location.origin}${data.file_path}` // ✅ Ensure full image URL
                : "",
        });
        setModalOpen(true);
    };
    useEffect(() => {
        fetchData();
        fetchOptions();
    }, []);
    const fetchOptions = async () => {
        try {
            const [commoditiesData, allocationTypeData, cropDamageCauseData, barangaysData,] = await Promise.all([
                axios.get("/admin/data/commodity"),
                axios.get("/admin/data/allocationtype"),
                axios.get("/admin/data/cropDamageCause"),
                axios.get("/admin/data/barangay"),
                axios.get(`/admin/data/farms?farmer_id=${farmer.id}`),
            ]);
            setCommodities(commoditiesData.data.map((commodity) => ({
                label: commodity.name,
                value: commodity.id,
            })));
            setBarangays(barangaysData.data.map((barangay) => ({
                label: barangay.name,
                value: barangay.id,
            })));
            setAllocationType(allocationTypeData.data.map((allocationType) => ({
                label: allocationType.name,
                value: allocationType.id,
                funding: allocationType.funding,
                identifier: allocationType.identifier,
                amount: allocationType.amount,
                barangays: allocationType.barangays,
                commodities: allocationType.commodities,
            })));
            setCropDamageCause(cropDamageCauseData.data.map((cropDamageCause) => ({
                label: cropDamageCause.name,
                value: cropDamageCause.id,
            })));
            setLoadingCommodities(false);
            setLoadingAllocationType(false);
            setLoadingBarangays(false);
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
    const handleSelectChange = (selectedOption, field) => {
        setFormData({
            ...formData,
            [field]: selectedOption ? selectedOption.value : "",
        });
    };
    useEffect(() => {
        console.log("Updated farms:", farms);
    }, [farms]);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/admin/data/farmprofile/${farmer.id}`);
            setAllocations(response.data.allocations);
            setCropDamages(response.data.damages);
            setFarms(response.data.farmer.farms);
            setCropActivities(response.data.farmer.crop_activities);
            console.log("damages: ", response.data.damages);
            console.log("crop damages: ", cropDamages);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const deleteData = async (id) => {
        setLoading(true);
        let route = "";
        switch (modalType) {
            case "allocation":
                route = `/admin/allocations/destroy/${id}`;
                break;
            case "damage":
                route = `/admin/cropdamages/destroy/${id}`;
                break;
            case "farm":
                route = `/admin/farms/destroy/${id}`;
                break;
            case "cropActivity":
                route = `/admin/cropactivity/destroy/${id}`;
                break;
            default:
                return;
        }
        try {
            await axios.post(route, { _method: "DELETE" });
            toast.success(`${modalType} deleted successfully!`);
            // 🔥 Remove the deleted item from the state BEFORE fetching fresh data
            setCropActivities((prev) => prev.filter((activity) => activity.id !== id));
            await fetchData();
        }
        catch (error) {
            console.error("Error deleting data:", error);
            toast.error(`Failed to delete ${modalType}!`);
        }
        finally {
            setLoading(false);
        }
    };
    const farmColumns = [
        { field: "id", headerName: "#", width: 90 },
        { field: "commodity", headerName: "Commodity", width: 200 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "barangay", headerName: "Barangay", width: 200 },
        { field: "ha", headerName: "Hectares", width: 150 },
        { field: "owner", headerName: "Owner", width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleOpenModal("farm", params.row), children: _jsx(Pencil, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => deleteData(params.row.id), children: _jsx(Trash, { size: 20, color: "red" }) })] })),
        },
    ];
    const handleSaveAllocation = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("farmer_id", farmer.id.toString());
            dataToSend.append("brgy_id", farmer.barangay.id.toString());
            dataToSend.append("allocation_type_id", formData.allocation_type_id);
            dataToSend.append("commodity_id", formData.commodity_id);
            dataToSend.append("funding_id", formData.funding_id);
            dataToSend.append("identifier_id", formData.identifier_id);
            dataToSend.append("received", formData.received);
            dataToSend.append("amount", formData.amount);
            if (formData.date_received) {
                dataToSend.append("date_received", formData.date_received);
            }
            else {
                dataToSend.append("date_received", "");
            }
            console.log("Data to send for Allocation:", dataToSend);
            const response = await axios.post("/admin/allocations/store", dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProcessing(false);
            console.log("API response for Allocation:", response.data);
            toast.success("Successfully added the allocation!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error saving Allocation:", error);
            toast.error("Error saving allocation!");
        }
        finally {
            setLoading(false);
            setProcessing(false);
        }
    };
    const handleUpdateAllocation = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = {
                _method: "PUT",
                farmer_id: farmer.id,
                brgy_id: farmer.barangay.id,
                allocation_type_id: formData.allocation_type_id,
                commodity_id: formData.commodity_id,
                funding_id: formData.funding_id,
                identifier_id: formData.identifier_id,
                amount: formData.amount,
                received: formData.received,
                date_received: formData.date_received,
            };
            console.log("Data to send for Allocation update with method spoofing:", dataToSend);
            const response = await axios.post(`/admin/allocations/update/${formData.id}`, dataToSend, { headers: { "Content-Type": "application/json" } });
            setProcessing(false);
            console.log("API response for Allocation update:", response.data);
            toast.success("Successfully updated the allocation!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error updating Allocation:", error.response?.data || error);
            toast.error(`Error updating allocation: ${error.response?.data?.message || "Unknown error"}`);
        }
        finally {
            setProcessing(false);
            setLoading(false);
        }
    };
    const handleSaveCropActivity = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("farmer_id", farmer.id.toString()); // Ensure farmer_id is correct
            dataToSend.append("title", formData.title);
            dataToSend.append("desc", formData.desc);
            if (formData.date) {
                dataToSend.append("date", formData.date);
            }
            else {
                dataToSend.append("date", "");
            }
            if (formData.file_path) {
                dataToSend.append("file_path", formData.file_path);
            }
            console.log("Data to send for Crop Activity:", dataToSend);
            const response = await axios.post("/admin/cropactivity/store", dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("API response for Crop Activity:", response.data);
            setProcessing(false);
            toast.success("Successfully added the crop activity!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error saving Crop Activity:", error);
            toast.error("Error saving Crop Activity!");
        }
        finally {
            setProcessing(false);
            setLoading(false);
        }
    };
    const handleUpdateCropActivity = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("title", formData.title);
            dataToSend.append("desc", formData.desc);
            dataToSend.append("date", formData.date || "");
            if (formData.file_path) {
                dataToSend.append("file_path", formData.file_path);
            }
            dataToSend.append("_method", "PUT"); // Required for Laravel PATCH requests
            const response = await axios.post(`/admin/cropactivity/update/${formData.id}`, // Adjusted route
            dataToSend, { headers: { "Content-Type": "multipart/form-data" } });
            setProcessing(false);
            toast.success(response.data.message);
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error updating Crop Activity:", error);
            toast.error("Error updating crop activity!");
        }
        finally {
            setProcessing(false);
            setLoading(false);
        }
    };
    const handleSaveCropDamage = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("farmer_id", farmer.id.toString());
            dataToSend.append("brgy_id", farmer.barangay.id.toString());
            dataToSend.append("commodity_id", formData.commodity_id);
            dataToSend.append("crop_damage_cause_id", formData.crop_damage_cause_id);
            dataToSend.append("farm_id", formData.farm_id);
            dataToSend.append("total_damaged_area", formData.total_damaged_area);
            dataToSend.append("partially_damaged_area", formData.partially_damaged_area);
            dataToSend.append("area_affected", formData.area_affected);
            dataToSend.append("severity", formData.severity);
            // If image (proof) is selected, add it to the form data
            if (formData.proof) {
                dataToSend.append("proof", formData.proof);
            }
            console.log("Data to send for Crop Damage:", dataToSend);
            const response = await axios.post("/admin/store/cropdamages", dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("API response for Crop Damage:", response.data);
            setProcessing(false);
            toast.success("Successfully added the crop damage!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error saving Crop Damage:", error);
            toast.error("Error saving crop damage!");
        }
        finally {
            setProcessing(false);
            setLoading(false);
        }
    };
    const handleUpdateCropDamage = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("farmer_id", farmer.id.toString());
            dataToSend.append("brgy_id", farmer.barangay.id.toString());
            dataToSend.append("commodity_id", formData.commodity_id);
            dataToSend.append("crop_damage_cause_id", formData.crop_damage_cause_id);
            dataToSend.append("total_damaged_area", formData.total_damaged_area);
            dataToSend.append("partially_damaged_area", formData.partially_damaged_area);
            dataToSend.append("area_affected", formData.area_affected);
            dataToSend.append("severity", formData.severity);
            if (formData.proof) {
                dataToSend.append("proof", formData.proof);
            }
            const response = await axios.post(`/admin/cropdamages/update/${formData.id}`, dataToSend, { headers: { "Content-Type": "multipart/form-data" } });
            setProcessing(false);
            toast.success("Successfully updated the crop damage!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            console.error("Error updating Crop Damage:", error);
            toast.error("Error updating crop damage!");
        }
        finally {
            setProcessing(false);
            setLoading(false);
        }
    };
    const handleSaveFarm = async () => {
        setProcessing(true);
        console.time("Farm Save API Time"); // Start Timer
        try {
            const dataToSend = new FormData();
            dataToSend.append("farmer_id", farmer.id.toString());
            dataToSend.append("brgy_id", formData.brgy_id.toString());
            dataToSend.append("commodity_id", formData.commodity_id);
            dataToSend.append("ha", formData.ha);
            dataToSend.append("owner", formData.owner);
            dataToSend.append("name", formData.name);
            console.log("Data to send for Farm:", dataToSend);
            const response = await axios.post("/admin/farms/store", dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.timeEnd("Farm Save API Time"); // End Timer
            console.log("API response for Farm:", response.data);
            setProcessing(false);
            toast.success("Successfully added the farm!");
            setModalOpen(false);
            fetchData();
        }
        catch (error) {
            setProcessing(false);
            console.error("Error saving Farm:", error);
            toast.error("Error saving farm!");
        }
        finally {
            setProcessing(false); // Reset processing
        }
    };
    const handleUpdateFarm = async () => {
        setLoading(true);
        setProcessing(true);
        try {
            const dataToSend = {
                farmer_id: farmer.id,
                brgy_id: formData.brgy_id,
                commodity_id: formData.commodity_id,
                ha: formData.ha,
                owner: formData.owner,
            };
            console.log("Data to send for Farm update:", dataToSend);
            const response = await axios.put(`/admin/farms/update/${formData.id}`, dataToSend, { headers: { "Content-Type": "application/json" } });
            console.log("API response for Farm update:", response.data);
            setProcessing(false);
            toast.success("Successfully updated the farm!");
            fetchData();
            setModalOpen(false);
        }
        catch (error) {
            setProcessing(false);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message ||
                    "Unknown error";
                console.error("Error updating Farm:", error.response?.data || error.message);
                toast.error(`Error updating farm: ${errorMessage}`);
            }
            else {
                setProcessing(false);
                console.error("Non-Axios error:", error);
                toast.error("An unexpected error occurred.");
            }
        }
        finally {
            setProcessing(false);
            setLoading(true);
            setProcessing(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const handleAllocationTypeChange = (selectedOption) => {
        setFormData({
            ...formData,
            allocation_type_id: selectedOption.value,
            funding_id: selectedOption.funding.id, // Auto-fill funding
            identifier_id: selectedOption.identifier.id, // Auto-fill identifier
            amount: selectedOption.amount, // Set total amount
        });
        setBarangays(selectedOption.barangays.map((barangay) => ({
            label: barangay.name,
            value: barangay.id,
        })));
        setCommodities(selectedOption.commodities.map((commodity) => ({
            label: commodity.name,
            value: commodity.id,
        })));
    };
    const handleSelectFarm = (selectedOption) => {
        setFormData({
            ...formData,
            farm_id: selectedOption.value,
            commodity_id: selectedOption.commodity_id,
            brgy_id: selectedOption.brgy_id,
            farm_ha: selectedOption.ha,
        });
    };
    const [remainingAmount, setRemainingAmount] = useState(0);
    useEffect(() => {
        if (formData.amount && formData.allocation_type_id) {
            const totalAmount = allocationType.find((type) => type.value === formData.allocation_type_id)?.amount || 0;
            setRemainingAmount(totalAmount - formData.amount);
        }
    }, [formData.amount, formData.allocation_type_id]);
    const customStyles = (isDarkMode) => ({
        control: (base) => ({
            ...base,
            backgroundColor: "transparent",
            color: isDarkMode ? "white" : "black",
            borderColor: isDarkMode ? "#888" : "#ccc",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "#122231" : "white",
            color: isDarkMode ? "white" : "#122231",
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
                    ? "#121f31"
                    : "#eee"
                : "transparent",
            color: isDarkMode ? "white" : "black",
        }),
    });
    const isDarkMode = document.documentElement.classList.contains("dark");
    return (_jsxs(AdminLayout, { user: auth.user, children: [_jsx(Head, { title: `${farmer.firstname} ${farmer.lastname} ` }), _jsx(ToastContainer, {}), _jsxs("div", { className: "grid grid-cols-4 h-full gap-0 p-[0.5rem]", children: [_jsxs("div", { className: "relative left-0 h-full border-r px-4 py-2 border-slate-200 ", children: [_jsx("div", { children: _jsx("h2", { className: "text-xl mt-2 text-gray-800 leading-tight", children: _jsx(_Fragment, { children: _jsx("div", { className: "flex justify-between mb-4 dark:text-white", children: _jsxs(Link, { href: "/farmers", children: [_jsxs("span", { className: "flex mb-4", children: [_jsx(ChevronLeft, { size: 24 }), " Back"] }), " "] }) }) }) }) }), _jsxs("div", { className: "flex ml-2 dark:text-green-600 mt-10 font-semibold text-[24px] flex-wrap ", children: [farmer.firstname, " ", _jsx("br", {}), " ", farmer.lastname] }), _jsx("div", { className: "flex ml-2 mt-1", children: farmer.status === "registered" ? (_jsx(_Fragment, { children: _jsx("div", { className: "text-slate-600 p-1 rounded-2xl text-xs", children: farmer.rsbsa_ref_no }) })) : (_jsx(_Fragment, { children: _jsx("div", { className: "bg-red-600 p-1 px-2 text-white rounded-lg text-[10px]", children: "unregistered" }) })) }), _jsxs("div", { className: "mt-1", children: [_jsxs("div", { className: "mt-4", children: [_jsx("span", { className: "text-slate-400 text-sm ml-3 mt-4", children: "Info" }), " "] }), _jsxs("div", { className: "pl-3", children: [_jsx("div", { className: "mt-2 flex gap-1", children: _jsxs("span", { className: "flex gap-2 dark:text-white text-slate-700 text-sm", children: [_jsx(House, { size: 18 }), farmer.barangay?.name, ", Davao del Sur"] }) }), _jsx("div", { className: "mt-2", children: _jsxs("span", { className: "flex gap-2 dark:text-white text-slate-700 text-sm", children: [_jsx(Cake, { size: 18 }), farmer.dob] }) }), _jsx("div", { className: "mt-2", children: _jsxs("span", { className: "flex gap-2 dark:text-white text-slate-700 text-sm", children: [_jsx(Phone, { size: 18 }), "09676979568"] }) }), farmer["4ps"] === "yes" ? (_jsx(_Fragment, { children: _jsx("div", { className: "mt-2", children: _jsxs("span", { className: "flex gap-2 dark:text-white text-slate-700 text-sm", children: [_jsx(HandCoins, { size: 20 }), "4ps Beneficiary"] }) }) })) : (""), farmer.pwd === "yes" ? (_jsx(_Fragment, { children: _jsx("div", { className: "mt-2", children: _jsxs("span", { className: "flex gap-2 dark:text-white text-slate-700 text-sm", children: [_jsx(Accessibility, { size: 20 }), "Person with disabilty"] }) }) })) : ("")] })] })] }), _jsxs("div", { className: "relative col-span-3 right-0 h-full px-6 py-4", children: [_jsx("span", { className: "text-lg text-[30px] dark:text-green-600 text-slate-700 font-semibold", children: "Data History" }), _jsx("div", { className: "w-full h-full mt-4", children: _jsxs(Tabs, { children: [_jsxs(Tab, { label: "Allocation", children: [_jsxs("div", { className: "flex justify-between px-4", children: [_jsx("h1", { className: "text-green-600 text-[18px] font-semibold px-4 py-5", children: "Allocation History" }), _jsx(Button, { className: "bg-green-800 text-white mb-4 p-2 px-2 rounded-lg hover:bg-green-900 hover:shadow-md ", onClick: () => handleOpenModal("allocation"), children: _jsxs("span", { className: "text-sm flex gap-2", children: [_jsx(Plus, { size: 18 }), "Add Allocation"] }) })] }), _jsx(Timeline, { items: allocations.map((allocation, index) => ({
                                                        id: allocation.id,
                                                        fields: {
                                                            allocation: allocation.allocation_type
                                                                ?.name,
                                                            dateReceived: formatDate(allocation.date_received),
                                                            amount: `${allocation.amount} ${allocation.identifier?.title}`,
                                                            received: allocation.received,
                                                            // commodity:
                                                            //     allocation.commodity
                                                            //         ?.commodity_name ||
                                                            //     "nothing to show",
                                                            funding: allocation.funding?.name,
                                                        },
                                                        actions: [
                                                            {
                                                                icon: (_jsx(EditIcon, { size: 20, color: "green" })),
                                                                onClick: () => handleOpenModal("allocation", allocation),
                                                            },
                                                            {
                                                                icon: (_jsx(TrashIcon, { size: 20, color: "red" })),
                                                                onClick: () => deleteData(allocation.id),
                                                            },
                                                        ],
                                                        hasNext: index < allocations.length - 1,
                                                    })), fieldConfig: [
                                                        {
                                                            key: "allocation",
                                                            label: "Allocation",
                                                        },
                                                        {
                                                            key: "commodity",
                                                            label: "Commodity",
                                                        },
                                                        { key: "received", label: "Received" },
                                                        { key: "funding", label: "Source" },
                                                        { key: "amount", label: "Amount" },
                                                        {
                                                            key: "dateReceived",
                                                            label: "Date Received",
                                                        },
                                                    ] })] }), _jsxs(Tab, { label: "Crop Damages", children: [_jsxs("div", { className: "flex justify-between px-4", children: [_jsx("h1", { className: "text-green-600 text-[18px] font-semibold px-4 py-5", children: "Crop Damage History" }), _jsx(Button, { className: "bg-green-800 text-white mb-4 p-2 rounded", onClick: () => handleOpenModal("damage"), children: _jsxs("span", { className: "text-sm flex gap-2", children: [_jsx(Plus, { size: 18 }), "Add Crop Damage"] }) })] }), _jsx("div", { children: _jsx(Timeline, { items: cropDamages.map((damage, index) => ({
                                                            id: damage.id,
                                                            fields: {
                                                                cause: damage
                                                                    .crop_damage_cause.name,
                                                                img: damage.proof,
                                                                farm: `${damage.farm?.name} (${damage.farm?.ha} ha)`,
                                                                severity: damage.severity,
                                                                partiallyDamagedArea: `${damage.partially_damaged_area} ha`,
                                                                totalDamagedArea: `${damage.total_damaged_area} ha`,
                                                            },
                                                            actions: [
                                                                {
                                                                    icon: (_jsx(EditIcon, { size: 24, color: "green", className: "border p-1 rounded-md" })),
                                                                    onClick: () => handleOpenModal("damage", damage),
                                                                },
                                                                {
                                                                    icon: (_jsx(TrashIcon, { size: 24, color: "red", className: "border p-1 rounded-md" })),
                                                                    onClick: () => deleteData(damage.id),
                                                                },
                                                            ],
                                                            hasNext: index <
                                                                cropDamages.length - 1,
                                                        })), fieldConfig: [
                                                            { key: "cause", label: "Cause" },
                                                            { key: "img", label: "Proof" },
                                                            { key: "farm", label: "Farm" },
                                                            {
                                                                key: "partiallyDamagedArea",
                                                                label: "Partially Damaged Area",
                                                            },
                                                            {
                                                                key: "totalDamagedArea",
                                                                label: "Total Damaged Area",
                                                            },
                                                            {
                                                                key: "severity",
                                                                label: "Severity",
                                                            },
                                                        ] }) })] }), _jsxs(Tab, { label: "Farms", children: [_jsxs("div", { className: "flex justify-between px-4", children: [_jsx("h1", { className: "text-green-600 text-[18px] font-semibold px-4 py-5", children: "List of Farms" }), _jsx(Button, { className: "bg-green-800 text-white mb-4 p-2 rounded", onClick: () => handleOpenModal("farm"), children: _jsxs("span", { className: "text-sm flex gap-2", children: [_jsx(Plus, { size: 18 }), "Add Farm"] }) })] }), _jsx("div", { children: _jsx(DataGrid, { rows: farms.map((farm, index) => ({
                                                            id: farm.id,
                                                            commodity: farm.commodity.name,
                                                            barangay: farm.barangay.name,
                                                            name: farm.name,
                                                            ha: farm.ha,
                                                            owner: farm.owner,
                                                        })), columns: farmColumns, loading: loading, sx: {
                                                            padding: "20px",
                                                            borderRadius: "10px",
                                                            height: "380px",
                                                        } }) })] }), _jsxs(Tab, { label: "Crop Activities", children: [_jsxs("div", { className: "flex justify-between px-4", children: [_jsx("h1", { className: "text-green-600 text-[18px] font-semibold px-4 py-5", children: "Crop Activity Timeline" }), _jsx(Button, { className: "bg-green-800 text-white mb-4 p-2 rounded", onClick: () => handleOpenModal("cropActivity"), children: _jsxs("span", { className: "text-sm flex gap-2", children: [_jsx(Plus, { size: 18 }), "Add Crop Activity"] }) })] }), _jsx(Timeline, { items: cropActivities.map((cropActivity, index) => ({
                                                        id: cropActivity.id,
                                                        fields: {
                                                            title: cropActivity.title,
                                                            desc: cropActivity.desc,
                                                            date: cropActivity.date,
                                                            img: cropActivity.file_path,
                                                        },
                                                        actions: [
                                                            {
                                                                icon: (_jsx(EditIcon, { size: 20, color: "green" })),
                                                                onClick: () => handleOpenModal("cropActivity", cropActivity),
                                                            },
                                                            {
                                                                icon: (_jsx(TrashIcon, { size: 20, color: "red" })),
                                                                onClick: () => deleteData(cropActivity.id),
                                                            },
                                                        ],
                                                        hasNext: index <
                                                            cropActivities.length - 1,
                                                    })), fieldConfig: [
                                                        { key: "title", label: "Title" },
                                                        { key: "desc", label: "Description" },
                                                        { key: "img", label: "File" },
                                                        { key: "date", label: "Date" },
                                                    ] })] })] }) })] }), _jsxs(Modal, { show: modalOpen, onClose: () => setModalOpen(false), children: [modalType === "allocation" && (_jsxs("div", { className: "p-10 h-50", children: [_jsx("h2", { className: "font-semibold mb-2 text-[20px] dark:text-green-600 text-green-800", children: formData.id
                                            ? "Edit Allocation"
                                            : "Add Allocation" }), _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            if (modalType === "allocation") {
                                                formData.id
                                                    ? handleUpdateAllocation()
                                                    : handleSaveAllocation();
                                            }
                                        }, children: [_jsxs("div", { className: "p-4", children: [_jsx(Select, { options: allocationType, isLoading: loadingAllocationType, value: allocationType.find((option) => option.value ===
                                                            formData.allocation_type_id), onChange: handleAllocationTypeChange, placeholder: "Select Allocation Type", className: "mb-4 dark:text-white", styles: customStyles(isDarkMode) }), _jsx(TextInput, { type: "text", value: allocationType.find((type) => type.value ===
                                                            formData.allocation_type_id)?.funding.name || "", placeholder: "Source of Funds (Auto Generated)", disabled: true, className: "mb-4 w-full rounded-md bg-slate-200" }), _jsx(TextInput, { type: "text", value: allocationType.find((type) => type.value ===
                                                            formData.allocation_type_id)?.identifier.title || "", placeholder: "Identifier (Auto Generated)", disabled: true, className: "mb-4 w-full rounded-md bg-slate-200" }), _jsx(Select, { options: commodities, isLoading: loadingCommodities, value: commodities.find((commodity) => commodity.value ===
                                                            formData.commodity_id), onChange: (selectedOption) => handleSelectChange(selectedOption, "commodity_id"), placeholder: "Select Commodity", className: " mb-4", styles: customStyles(isDarkMode) }), _jsx(Select, { options: barangays, isLoading: loadingBarangays, value: barangays.find((barangay) => barangay.value ===
                                                            formData.barangay_id), onChange: (selectedOption) => handleSelectChange(selectedOption, "barangay_id"), placeholder: "Select Barangay", className: "rounded-2xl mb-4", styles: customStyles(isDarkMode) }), _jsx(TextInput, { type: "number", name: "amount", value: formData.amount || "", onChange: (e) => setFormData({
                                                            ...formData,
                                                            amount: parseFloat(e.target.value) || 0,
                                                        }), placeholder: "Amount", className: "w-full rounded-md" }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-white px-4", children: ["Remaining Balance: ", remainingAmount] }), _jsx("label", { className: "block mt-4 dark:text-white font-semibold px-4 text-[15px]", children: "Was the Allocation Received?" }), _jsxs("select", { value: formData.received, onChange: (e) => setFormData({
                                                            ...formData,
                                                            received: e.target.value,
                                                            date_received: e.target.value === "Yes"
                                                                ? formData.date_received
                                                                : "",
                                                        }), className: "w-full border rounded-md p-2 border-slate-400\n                                                    bg-white text-black dark:bg-[#122231] dark:text-white\n                                                    dark:border-gray-600", children: [_jsx("option", { value: "", className: "dark:bg-[#122231] dark:text-white", children: "Select Value" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "no", children: "No" }), _jsx("option", { className: "dark:bg-[#122231] dark:text-white", value: "yes", children: "Yes" })] }), _jsx("label", { className: "block mt-4 dark:text-white font-semibold px-4 text-[15px]", children: "If yes, when was the allocation received?" }), _jsx("input", { type: "date", value: formData.date_received, onChange: (e) => setFormData({
                                                            ...formData,
                                                            date_received: e.target.value,
                                                        }), disabled: formData.received !== "yes", className: "w-full border rounded-lg p-2 disabled:bg-gray-200 dark:bg-transparent dark:text-white" })] }), _jsx("br", {}), _jsxs(PrimaryButton, { type: "submit", disabled: processing, children: [processing
                                                        ? "Processing..."
                                                        : formData.id
                                                            ? "Update Allocation"
                                                            : "Add Allocation", " "] })] })] })), modalType === "cropActivity" && (_jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "font-semibold text-xl mb-4 text-green-700 dark:text-green-600", children: formData.id
                                            ? "Edit Crop Activity"
                                            : "Add Crop Activity" }), _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            if (modalType === "cropActivity") {
                                                formData.id
                                                    ? handleUpdateCropActivity()
                                                    : handleSaveCropActivity();
                                            }
                                        }, children: [_jsx(TextInput, { type: "text", name: "title", value: formData.title || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    title: e.target.value,
                                                }), placeholder: "Title", className: "w-full mb-4" }), _jsx(TextInput, { type: "text", name: "desc", value: formData.desc || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    desc: e.target.value,
                                                }), placeholder: "desc", className: "w-full mb-4" }), _jsx(TextInput, { type: "date", name: "date", value: formData.date || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    date: e.target.value,
                                                }), placeholder: "Date", className: "w-full mt-4 mb-4" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "file_path", className: "block mb-2 dark:text-white", children: "Upload Image:" }), _jsx(TextInput, { type: "file", id: "file_path", name: "file_path", accept: "image/*", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const previewURL = URL.createObjectURL(file);
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    file_path: file,
                                                                    imagePreview: previewURL,
                                                                }));
                                                            }
                                                        }, className: "w-full" })] }), formData.imagePreview && (_jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block mb-2 dark:text-white", children: "Image Preview:" }), _jsx("img", { src: formData.imagePreview, alt: "Preview", className: "rounded border", style: {
                                                            maxWidth: "100px",
                                                            height: "100px",
                                                            objectFit: "cover",
                                                            borderRadius: "10px",
                                                        } })] })), _jsxs(PrimaryButton, { type: "submit", disabled: processing, children: [processing
                                                        ? "Processing..."
                                                        : formData.id
                                                            ? "Update Crop Activity"
                                                            : "Add Crop Activity", " "] })] })] })), modalType === "damage" && (_jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "font-semibold text-xl mb-4 dark:text-green-600 text-green-700", children: formData.id
                                            ? "Edit Crop Damage"
                                            : "Add Crop Damage" }), _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            if (modalType === "damage") {
                                                formData.id
                                                    ? handleUpdateCropDamage()
                                                    : handleSaveCropDamage();
                                            }
                                        }, children: [formData.farm_id && (_jsxs("div", { className: "mb-2 text-gray-700 font-medium", children: ["Farm Size:", " ", farms.find((farm) => farm.id === formData.farm_id)?.ha || "N/A", " ", "ha"] })), _jsx(Select, { options: farms.map((farm) => ({
                                                    value: farm.id,
                                                    label: farm.name,
                                                })), isLoading: loadingFarms, value: formData.farm_id
                                                    ? {
                                                        value: formData.farm_id,
                                                        label: farms.find((farm) => farm.id ===
                                                            formData.farm_id)?.name || "Select Farm",
                                                    }
                                                    : null, onChange: (selectedOption) => {
                                                    const selectedFarm = farms.find((farm) => farm.id ===
                                                        selectedOption?.value);
                                                    setFormData({
                                                        ...formData,
                                                        farm_id: selectedOption?.value,
                                                        commodity_id: selectedFarm?.commodity?.id ||
                                                            "",
                                                        brgy_id: selectedFarm?.barangay?.id ||
                                                            "",
                                                    });
                                                }, placeholder: "Select Farm", className: "rounded-2xl mb-4 dark:bg-transparent dark:text-white", styles: customStyles(isDarkMode) }), _jsx(Select, { options: commodities, isLoading: loadingCommodities, value: commodities.find((commodity) => commodity.value ===
                                                    formData.commodity_id), isDisabled: true, placeholder: "Commodity (Auto-filled)", className: "rounded-2xl mb-4 dark:bg-transparent dark:text-white", styles: customStyles(isDarkMode) }), _jsx(Select, { options: barangays, isLoading: loadingBarangays, value: barangays.find((barangay) => barangay.value === formData.brgy_id), isDisabled: true, placeholder: "Barangay (Auto-filled)", className: "rounded-2xl mb-4 dark:bg-transparent dark:text-white", styles: customStyles(isDarkMode) }), _jsx(Select, { options: cropDamageCause, isLoading: loadingCropDamageCause, value: cropDamageCause.find((cause) => cause.value ===
                                                    formData.cropDamageCause_id), onChange: (selectedOption) => handleSelectChange(selectedOption, "crop_damage_cause_id"), placeholder: "Select Cause Type", className: "rounded-2xl mb-4 dark:bg-transparent dark:text-white", styles: customStyles(isDarkMode) }), _jsx(TextInput, { type: "number", name: "total_damaged_area", value: formData.total_damaged_area || "", onChange: (e) => {
                                                    const totalDamagedArea = Number(e.target.value);
                                                    const selectedFarm = farms.find((farm) => farm.id === formData.farm_id);
                                                    const farmArea = selectedFarm?.ha ?? 1;
                                                    let severity = "low";
                                                    const damagePercentage = (totalDamagedArea / farmArea) * 100;
                                                    if (damagePercentage > 50)
                                                        severity = "high";
                                                    else if (damagePercentage > 20)
                                                        severity = "medium";
                                                    setFormData({
                                                        ...formData,
                                                        total_damaged_area: totalDamagedArea,
                                                        severity,
                                                    });
                                                }, placeholder: "Total Damaged Area", className: "w-full mb-4 dark:bg-transparent dark:text-white" }), _jsx(TextInput, { type: "number", name: "partially_damaged_area", value: formData.partially_damaged_area || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    partially_damaged_area: e.target.value,
                                                }), placeholder: "Partially Damaged Area", className: "w-full mb-4" }), _jsx(TextInput, { type: "number", name: "area_affected", value: formData.area_affected || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    area_affected: e.target.value,
                                                }), placeholder: "Area Affected", className: "w-full mb-4" }), _jsx(TextInput, { type: "text", name: "severity", value: formData.severity, readOnly: true, placeholder: "Severity (Auto-filled)", className: "w-full mb-4 bg-gray-200 cursor-not-allowed" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "proof", className: "block mb-2 font-semibold text-[15px] dark:text-white", children: "Upload Image Proof:" }), _jsx(TextInput, { type: "file", id: "proof", name: "proof", accept: "image/*", onChange: (e) => {
                                                            const files = e.target.files;
                                                            if (files && files.length > 0) {
                                                                const file = files[0];
                                                                const previewURL = URL.createObjectURL(file);
                                                                setFormData({
                                                                    ...formData,
                                                                    proof: file, // Store the new file
                                                                    imagePreview: previewURL, // Update preview
                                                                });
                                                            }
                                                        }, className: "w-full" })] }), formData.imagePreview && (_jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block dark:text-white mb-2 font-semibold text-[15px]", children: "Image Preview:" }), _jsx("img", { src: formData.imagePreview, alt: "Preview", className: "rounded border", style: {
                                                            maxWidth: "100px",
                                                            height: "100px",
                                                            objectFit: "cover",
                                                            borderRadius: "10px",
                                                        } })] })), _jsxs(PrimaryButton, { type: "submit", disabled: processing, children: [processing
                                                        ? "Processing..."
                                                        : formData.id
                                                            ? "Update Crop Damage"
                                                            : "Add Crop Damage", " "] })] })] })), modalType === "farm" && (_jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "font-semibold text-xl mb-4 dark:text-green-600 text-green-700", children: formData.id ? "Edit Farm" : "Add Farm" }), _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            if (modalType === "farm") {
                                                formData.id
                                                    ? handleUpdateFarm()
                                                    : handleSaveFarm();
                                            }
                                        }, children: [_jsx(Select, { options: commodities, isLoading: loadingCommodities, value: commodities.find((commodity) => commodity.value ===
                                                    formData.commodity_id), onChange: (selectedOption) => handleSelectChange(selectedOption, "commodity_id"), placeholder: "Select Commodity", className: "rounded-2xl mb-4 dark:text-white", styles: customStyles(isDarkMode) }), _jsx(Select, { options: barangays, isLoading: loadingBarangays, value: barangays.find((barangay) => barangay.value === formData.brgy_id), onChange: (selectedOption) => handleSelectChange(selectedOption, "brgy_id"), placeholder: "Select Barangay", className: "rounded-2xl mb-4 dark:text-white", styles: customStyles(isDarkMode) }), _jsx(TextInput, { type: "text", name: "name", value: formData.name || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                }), placeholder: "Farm Name", className: "w-full mb-4 dark:bg-transparent dark:text-white" }), _jsx(TextInput, { type: "number", name: "ha", value: formData.ha || "", onChange: (e) => setFormData({
                                                    ...formData,
                                                    ha: e.target.value,
                                                }), placeholder: "Farm Area (ha)", className: "w-full mb-4 dark:bg-transparent dark:text-white" }), _jsx(Select, { options: [
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },
                                                ], value: formData.owner
                                                    ? {
                                                        value: formData.owner,
                                                        label: formData.owner === "yes"
                                                            ? "Yes"
                                                            : "No",
                                                    }
                                                    : null, onChange: (selectedOption) => setFormData({
                                                    ...formData,
                                                    owner: selectedOption?.value || "",
                                                }), placeholder: "Is the Person Owner?", className: "w-full mb-4 dark:text-white", styles: customStyles(isDarkMode) }), _jsxs(PrimaryButton, { type: "submit", disabled: processing, children: [processing
                                                        ? "Processing..."
                                                        : formData.id
                                                            ? "Update  Farm"
                                                            : "Add  Farm", " "] })] })] }))] })] })] }));
}
