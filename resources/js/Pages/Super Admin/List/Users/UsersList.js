import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState, } from "react";
import "../../../../../css/Table.css";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Box } from "@mui/material";
import { Head, router } from "@inertiajs/react";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { Pencil, Plus, Trash, Trash2 } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultAvatar from "@/Components/DefaultAvatar";
import SecondaryButton from "@/Components/SecondaryButton";
// axios.defaults.headers.common["X-CSRF-TOKEN"] = document
//     .querySelector('meta[name="csrf-token"]')
//     .getAttribute("content");
const UsersList = ({ auth }) => {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setPreview(null);
        setNewUser((prevUser) => ({
            ...prevUser,
            pfp: null,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handlePreviewClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setNewUser((prevUser) => ({ ...prevUser, pfp: file }));
            console.log("File selected:", file);
        }
        if (files && files.length > 0) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setSelectedUser((prevUser) => prevUser ? { ...prevUser, pfp: file } : null);
        }
        else {
            setPreview(null);
            setSelectedUser((prevUser) => prevUser ? { ...prevUser, pfp: null } : null);
        }
    };
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/users/data");
            setUserData(response.data);
            console.log(response.data);
        }
        catch (error) {
            console.error("Error fetching user data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    function changeDateFormat(dateString) {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-UK", options);
    }
    const handleEdit = (userId) => {
        if (!userData) {
            console.error("User data is not available");
            return;
        }
        const user = userData.find((user) => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsEditModalOpen(true);
            console.log("Selected User: ", user);
        }
        else {
            console.error("User not found");
        }
    };
    const handleDelete = async (userData) => {
        console.log(userData);
        if (window.confirm("Are you sure you want to delete this User?")) {
            try {
                await router.delete(`/users/destroy/${userData}`);
                fetchUserData();
                setUserData((prevData = []) => prevData.filter((userData) => userData.id !== userData.id));
                toast.success("User deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            }
            catch (error) {
                toast.error("Failed to delete User");
            }
        }
    };
    const columns = [
        { field: "id", headerName: "#", width: 100 },
        {
            field: "pfp",
            headerName: "PFP",
            renderCell: (params) => (_jsx("img", { src: params.value || "https://via.placeholder.com/50", alt: "Avatar", style: {
                    marginTop: 5,
                    width: 40,
                    height: 40,
                    borderRadius: "15%",
                    objectFit: "cover",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                } })),
        },
        { field: "firstname", headerName: "First name", width: 120 },
        { field: "lastname", headerName: "Last name", width: 120 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "status", headerName: "Status", width: 100 },
        { field: "role", headerName: "Role", width: 100, flex: 1 },
        { field: "section", headerName: "Section", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 220,
            flex: 1,
            renderCell: (params) => (_jsxs("div", { className: "p-2 px-1 flex gap-2", children: [_jsx("button", { className: "border rounded-[12px] p-2 hover:bg-green-300", onClick: () => handleEdit(params.row.id), children: _jsx(Pencil, { size: 20, color: "green" }) }), _jsx("button", { className: "border rounded-[12px] p-2 hover:bg-red-300", onClick: () => handleDelete(params.row.id), children: _jsx(Trash, { size: 20, color: "red" }) })] })),
        },
    ];
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("firstname", String(selectedUser?.firstname || ""));
        formData.append("lastname", String(selectedUser?.lastname || ""));
        formData.append("sex", String(selectedUser?.sex || ""));
        formData.append("email", String(selectedUser?.email || ""));
        formData.append("section", String(selectedUser?.section || ""));
        formData.append("status", String(selectedUser?.status || ""));
        formData.append("role", String(selectedUser?.role || ""));
        if (selectedUser?.password) {
            formData.append("password", String(selectedUser.password));
        }
        if (selectedUser?.pfp instanceof File) {
            formData.append("pfp", selectedUser.pfp);
        }
        try {
            await sendUpdateRequest(formData);
        }
        catch (error) {
            console.error("Error updating user:", error);
        }
    };
    const sendUpdateRequest = async (dataToSend) => {
        try {
            await axios.post(`/users/update/${selectedUser?.id}`, // Use POST, but spoof it as PUT
            dataToSend, {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            });
            fetchUserData();
            setUserData((prevData) => selectedUser
                ? prevData
                    .filter((userData) => userData.id !== selectedUser.id)
                    .concat(selectedUser)
                : prevData);
            toast.success("User updated successfully", {
                draggable: true,
                closeOnClick: true,
            });
            closeEditModal();
        }
        catch (error) {
            console.error("Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 422) {
                    toast.error(`Failed to update user: ${JSON.stringify(error.response.data.errors)}`);
                }
                else {
                    toast.error(`Failed to update user: ${error.response.statusText}`);
                }
            }
            else {
                toast.error("Failed to update user");
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newUser).forEach((key) => {
            const value = newUser[key];
            if (value !== null && value !== undefined) {
                if (key === "pfp" && value instanceof File) {
                    formData.append(key, value);
                }
                else {
                    formData.append(key, value.toString());
                }
            }
        });
        console.log("Selected pfp:", newUser.pfp);
        console.log("FormData entries:", Array.from(formData.entries()));
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            if (!csrfToken) {
                throw new Error("CSRF token not found in meta tags");
            }
            await axios.post("/users/store", formData, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            toast.success("User added successfully");
            fetchUserData();
            setUserData((prevData = []) => prevData.filter((userData) => userData !== userData));
            closeModal();
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding User:", error.response.data);
                toast.error(`Failed to add User: ${error.response.data.message || "Validation error"}`);
            }
            else {
                console.error(error);
                toast.error("Failed to add User");
            }
        }
    };
    const [newUser, setNewUser] = useState({
        pfp: null,
        firstname: "",
        lastname: "",
        email: "",
        role: "",
        section: "",
        sex: "",
        status: "",
        password: "",
        confirm_password: "",
    });
    const handleSelectChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };
    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };
    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : null));
    };
    console.log("selected user: ", selectedUser);
    const defaultAvatarUrl = "/images/default-avatar.png"; // Path in `public`
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
            await axios.post("/api/users/delete", {
                ids: selectedIds,
            });
            setUserData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
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
    return (_jsxs(Authenticated, { user: auth.user, header: _jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full justify-between", children: [_jsx("h2", { className: "text-xl mt-2 font-semibold text-[25px] text-green-600 leading-tight", children: "Users Management" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(PrimaryButton, { onClick: openModal, children: [_jsx(Plus, { size: 24 }), "Add User"] }), _jsxs(SecondaryButton, { onClick: handleMultipleDelete, disabled: selectedIds.length === 0 || loading, style: {
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
                                    ) : (_jsxs("span", { className: "flex gap-2", children: [" ", _jsx(Trash2, { size: 14 }), " Delete"] })), loading ? (_jsxs("span", { className: "flex gap-2", children: [_jsx(Trash2, { size: 14 }), " Deleting"] })) : ("")] })] })] }) }), children: [_jsx(Head, { title: "Users Management" }), _jsx(ToastContainer, {}), _jsx(Box, { sx: { height: "550px" }, children: _jsx(DataGrid, { rows: userData, columns: columns, initialState: {
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }, pageSizeOptions: [50, 100, 200, 350, 500], loading: loading, slots: { toolbar: GridToolbar }, checkboxSelection: true, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedIds, slotProps: {
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }, sx: {
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                        },
                        border: "none",
                    } }) }), selectedUser && (_jsx(Modal, { show: isEditModalOpen, onClose: closeEditModal, children: _jsxs("div", { className: "p-10", children: [_jsx("h2", { className: "text-xl text-green-600 font-semibold mb-4 flex gap-2", children: "Edit User" }), _jsxs("form", { onSubmit: handleUpdate, children: [_jsx("div", { className: "flex gap-5 mt-4", children: _jsxs("div", { children: [_jsx("input", { type: "file", id: "pfp", name: "pfp", accept: "image/*", onChange: handleFileChange, className: "hidden", ref: fileInputRef }), _jsx("div", { className: "w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer", onClick: handlePreviewClick, children: selectedUser.pfp ? (_jsx("img", { src: selectedUser.pfp instanceof
                                                        File
                                                        ? URL.createObjectURL(selectedUser.pfp)
                                                        : selectedUser.pfp ||
                                                            defaultAvatarUrl, alt: "Profile Preview", className: "object-cover w-full h-full" })) : (_jsx(DefaultAvatar, { width: "100%", height: "100%", className: "object-cover w-full h-full" })) })] }) }), _jsxs("div", { className: "flex gap-5 mt-4", children: [_jsx(TextInput, { name: "firstname", value: selectedUser.firstname || "", onChange: handleUpdateInputChange, placeholder: "Firstname", className: "w-full" }), _jsx(TextInput, { name: "lastname", value: selectedUser.lastname || "", onChange: handleUpdateInputChange, placeholder: "Lastname", className: "w-full" })] }), _jsxs("div", { className: "flex gap-5 mt-4", children: [_jsx(TextInput, { name: "email", value: selectedUser.email || "", onChange: handleUpdateInputChange, placeholder: "Email", className: "w-full" }), _jsxs("select", { name: "role", value: selectedUser.role || "", onChange: (e) => setSelectedUser({
                                                ...selectedUser,
                                                role: e.target.value,
                                            }), className: "w-full rounded-xl border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Role" }), _jsx("option", { value: "super admin", children: "Super Admin" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("select", { name: "status", value: selectedUser.status || "", onChange: (e) => setSelectedUser({
                                            ...selectedUser,
                                            status: e.target.value,
                                        }), className: "w-full rounded-lg border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Status" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "rejected", children: "Rejected" })] }) }), _jsx("div", { className: "mt-4", children: _jsxs("select", { name: "section", value: selectedUser.section || "", onChange: (e) => setSelectedUser({
                                            ...selectedUser,
                                            section: e.target.value,
                                        }), className: "w-full rounded-lg border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Section" }), _jsx("option", { value: "rice", children: "Rice" }), _jsx("option", { value: "corn", children: "Corn" }), _jsx("option", { value: "fishery", children: "Fishery" }), _jsx("option", { value: "high value", children: "High Value" })] }) }), _jsx("div", { className: "mt-4", children: _jsxs("select", { name: "sex", value: selectedUser.sex || "", onChange: (e) => setSelectedUser({
                                            ...selectedUser,
                                            sex: e.target.value,
                                        }), className: "w-full rounded-lg border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Sex" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" })] }) }), _jsxs("div", { className: "flex gap-5 mt-4", children: [_jsx(TextInput, { name: "password", value: selectedUser.password || "", onChange: handleUpdateInputChange, placeholder: "Password", type: "password", className: "w-full" }), _jsx(TextInput, { name: "confirm_password", value: selectedUser.confirm_password ||
                                                "", onChange: handleUpdateInputChange, placeholder: "Confirm Password", type: "password", className: "w-full" })] }), _jsx("div", { className: "p-4 mt-4 border-slate-300", children: _jsx(PrimaryButton, { type: "submit", children: "Submit" }) })] })] }) })), _jsx(Modal, { show: isModalOpen, maxWidth: "lg", onClose: closeModal, children: _jsxs("div", { className: "p-10", children: [_jsxs("h2", { className: "text-xl text-green-600 font-semibold flex gap-2 ", children: ["Add New User", " "] }), _jsx("div", { className: "mt-4", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "flex gap-5 mb-2", children: _jsxs("div", { children: [_jsx("input", { type: "file", id: "pfp", name: "pfp", accept: "image/*", onChange: handleFileChange, className: "hidden", ref: fileInputRef }), _jsx("div", { className: "w-24 h-24 rounded-2xl overflow-hidden border-2 ", onClick: handlePreviewClick, children: preview ? (_jsx("img", { src: preview, alt: "Profile Preview", className: "object-cover w-full h-full" })) : (_jsx(DefaultAvatar, { width: "100%", height: "100%", className: "object-cover w-full h-full" })) })] }) }), _jsxs("div", { className: "flex gap-5 mb-2", children: [_jsx(TextInput, { name: "firstname", value: newUser.firstname, onChange: handleInputChange, placeholder: "Firstname", className: "w-full" }), _jsx(TextInput, { name: "lastname", value: newUser.lastname, onChange: handleInputChange, placeholder: "Lastname", className: "w-full" }), _jsx("br", {})] }), _jsx(TextInput, { name: "email", value: newUser.email, onChange: handleInputChange, placeholder: "email", className: "w-full mb-2" }), _jsxs("select", { name: "role", value: newUser.role, onChange: handleSelectChange, className: "w-full rounded-xl border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Role" }), _jsx("option", { value: "super admin", children: "Super Admin" }), _jsx("option", { value: "admin", children: "Admin" })] }), _jsx("br", {}), _jsxs("div", { children: [_jsxs("select", { name: "status", value: newUser.status, onChange: handleSelectChange, className: "mt-3 w-full rounded-lg dark:bg-[#122231] dark:text-white border-gray-300", children: [_jsx("option", { value: "", disabled: true, children: "Status" }), _jsx("option", { className: "dark:text-white", value: "approved", children: "Approved" }), _jsx("option", { className: "dark:text-white", value: "pending", children: "Pending" }), _jsx("option", { className: "dark:text-white", value: "rejected", children: "Reject" })] }), _jsx("br", {})] }), _jsxs("div", { children: [_jsxs("select", { name: "section", value: newUser.section, onChange: handleSelectChange, className: "mt-3 w-full rounded-lg border-gray-300 dark:bg-[#122231] dark:text-white", children: [_jsx("option", { className: "dark:text-white", value: "", disabled: true, children: "Section" }), _jsx("option", { className: "dark:text-white", value: "rice", children: "Rice" }), _jsx("option", { className: "dark:text-white", value: "corn", children: "Corn" }), _jsx("option", { className: "dark:text-white", value: "fishery", children: "Fishery" }), _jsx("option", { className: "dark:text-white", value: "high value", children: "High Value" })] }), _jsx("br", {})] }), _jsxs("div", { children: [_jsxs("select", { name: "sex", value: newUser.sex, onChange: handleSelectChange, className: "mt-3 w-full rounded-lg border-gray-300 dark:bg-[#122231] dark:text-white", children: [_jsx("option", { value: "", disabled: true, children: "Sex" }), _jsx("option", { className: "dark:text-white", value: "male", children: "Male" }), _jsx("option", { className: "dark:text-white", value: "female", children: "Female" })] }), _jsx("br", {})] }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx(TextInput, { name: "password", value: newUser.password, onChange: handleInputChange, placeholder: "password", type: "password", className: "w-full" }), _jsx(TextInput, { name: "confirm_password", value: newUser.confirm_password, onChange: handleInputChange, placeholder: "confirm password", type: "password", className: "w-full" }), _jsx("br", {})] }), _jsx("div", { className: "p-4 mt-4 ", children: _jsx(PrimaryButton, { onClick: handleSubmit, children: "Submit" }) })] }) })] }) })] }));
};
export default UsersList;
