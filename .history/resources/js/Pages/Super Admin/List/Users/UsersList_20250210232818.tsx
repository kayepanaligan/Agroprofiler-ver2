import React, {
    ChangeEvent,
    ChangeEventHandler,
    FormEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";
import "../../../../../css/Table.css";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Box, Breadcrumbs, Link } from "@mui/material";
import { Head, router } from "@inertiajs/react";
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridToolbar,
} from "@mui/x-data-grid";
import { Pencil, Plus, Trash, User } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputError from "@/Components/InputError";
import DefaultAvatar from "@/Components/DefaultAvatar";
interface User {
    id: number;
    pfp: File | string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    section: string;
    sex: string;
    status: string;
    created_at: string;
    password: string;
    confirm_password: string;
}
interface UserProps extends PageProps {
    user: User[];
}

axios.defaults.headers.common["X-CSRF-TOKEN"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

const UsersList = ({ auth }: UserProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [userData, setUserData] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const closeEditModal = () => setIsEditModalOpen(false);

    const handlePreviewClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);

            setPreview(previewUrl); // Set preview URL for image preview

            // Store the file in `newUser` for form submission
            setNewUser((prevUser) => ({
                ...prevUser,
                pfp: file, // Save the actual file object here
            }));
        } else {
            setPreview(null);
            setNewUser((prevUser) => ({
                ...prevUser,
                pfp: null,
            }));
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get<UserProps[]>("/users/data");
            setUserData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    function changeDateFormat(dateString: string | number | Date) {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        } as Intl.DateTimeFormatOptions;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-UK", options);
    }

    const handleEdit = (userId: number) => {
        if (!userData) {
            console.error("User data is not available");
            return;
        }

        const user = userData.find((user) => user.id === userId);

        if (user) {
            setSelectedUser(user);
            setIsEditModalOpen(true);
            console.log("Selected User: ", user);
        } else {
            console.error("User not found");
        }
    };

    const handleDelete = async (userData: UserProps) => {
        console.log(userData);
        if (window.confirm("Are you sure you want to delete this User?")) {
            try {
                await router.delete(`/users/destroy/${userData}`);
                fetchUserData();
                setUserData((prevData = []) =>
                    prevData.filter((userData) => userData.id !== userData.id)
                );
                toast.success("User deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error("Failed to delete User");
            }
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 100 },
        {
            field: "pfp",
            headerName: "PFP",
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
        { field: "firstname", headerName: "First name", width: 120 },
        { field: "lastname", headerName: "Last name", width: 120 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "status", headerName: "Status", width: 100 },
        { field: "section", headerName: "section", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 220,
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

    const handleUpdate: FormEventHandler = async (e) => {
        e.preventDefault();

        // Prepare the payload data
        const dataToSend: any = {
            _method: "PUT",
            firstname: selectedUser?.firstname,
            lastname: selectedUser?.lastname,
            sex: selectedUser?.sex,
            email: selectedUser?.email,
            section: selectedUser?.section,
            status: selectedUser?.status,
            role: selectedUser?.role,
            password: selectedUser?.password,
        };

        // Check if a new profile picture is selected and convert it to base64 if it's a file
        if (selectedUser?.pfp instanceof File) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const profilePictureBase64 = reader.result as string; // Base64 string of the image
                dataToSend.pfp = profilePictureBase64; // Add base64 image data to the payload

                await sendUpdateRequest(dataToSend);
            };
            reader.readAsDataURL(selectedUser.pfp); // Convert the file to base64 string
        } else {
            // If no new profile picture, just send the existing one or an empty string
            dataToSend.pfp = selectedUser?.pfp || ""; // Send the existing image URL or empty if none
            await sendUpdateRequest(dataToSend);
        }
    };

    const sendUpdateRequest = async (dataToSend: any) => {
        try {
            await axios.post(
                `/users/update/${selectedUser?.id}`, // Use POST, but spoof it as PUT
                dataToSend,
                {
                    headers: {
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                    },
                }
            );

            // Update the user data and state
            fetchUserData();
            setUserData((prevData) =>
                selectedUser
                    ? prevData
                          .filter((userData) => userData.id !== selectedUser.id)
                          .concat(selectedUser)
                    : prevData
            );

            toast.success("User updated successfully", {
                draggable: true,
                closeOnClick: true,
            });

            closeEditModal();
        } catch (error) {
            console.error("Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 422) {
                    toast.error(
                        `Failed to update user: ${JSON.stringify(
                            error.response.data.errors
                        )}`
                    );
                } else {
                    toast.error(
                        `Failed to update user: ${error.response.statusText}`
                    );
                }
            } else {
                toast.error("Failed to update user");
            }
        }
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        (Object.keys(newUser) as (keyof typeof newUser)[]).forEach((key) => {
            const value = newUser[key];
            if (value !== null && value !== undefined) {
                if (key === "pfp" && value instanceof File) {
                    formData.append(key, value); // Append the file
                } else {
                    formData.append(key, value.toString()); // Append other form fields as strings
                }
            }
        });

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
                    // "Content-Type": "multipart/form-data",
                },
            });

            toast.success("User added successfully");
            fetchUserData();

            setUserData((prevData = []) =>
                prevData.filter((userData) => userData !== userData)
            );

            closeModal();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding User:", error.response.data);
                toast.error(
                    `Failed to add User: ${
                        error.response.data.message || "Validation error"
                    }`
                );
            } else {
                console.error(error); // Log other types of errors for debugging
                toast.error("Failed to add User");
            }
        }
    };

    const [newUser, setNewUser] = useState({
        pfp: "",
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

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    console.log("selected user: ", selectedUser);

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                            Users Management
                        </h2>

                        <PrimaryButton onClick={openModal}>
                            <Plus size={24} />
                            Add User
                        </PrimaryButton>
                    </div>
                </>
            }
            // breadcrumbs={
            //     <div className="ml-[2rem]">
            //         <Breadcrumbs aria-label="breakdown">
            //             <Link href="/dashboard">
            //                 <span className="text-xs text-green-500 hover:text-green-700">
            //                     Dashboard
            //                 </span>
            //             </Link>
            //             <Link href="#">
            //                 <span className="text-xs text-green-500 hover:text-green-700">
            //                     Users
            //                 </span>
            //             </Link>
            //         </Breadcrumbs>
            //     </div>
            // }
        >
            <Head title="Users Management" />
            <ToastContainer />

            <Box sx={{ height: "550px" }}>
                <DataGrid
                    rows={userData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }}
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

            {selectedUser && (
                <Modal show={isEditModalOpen} onClose={closeEditModal}>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex gap-2">
                            Edit User
                        </h2>

                        <form onSubmit={handleUpdate}>
                            {/* Profile Picture Upload */}
                            <div className="flex gap-5 mt-4">
                                <div>
                                    <input
                                        type="file"
                                        id="pfp"
                                        name="pfp"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                    <div
                                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer"
                                        onClick={handlePreviewClick}
                                    >
                                        {selectedUser.pfp ? (
                                            <img
                                                src={
                                                    selectedUser.pfp ||
                                                    DefaultAvatar
                                                }
                                                alt="Profile Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <DefaultAvatar
                                                width="100%"
                                                height="100%"
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex gap-5 mt-4">
                                <TextInput
                                    name="firstname"
                                    value={selectedUser.firstname || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Firstname"
                                    className="w-full"
                                />
                                <TextInput
                                    name="lastname"
                                    value={selectedUser.lastname || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Lastname"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex gap-5 mt-4">
                                <TextInput
                                    name="email"
                                    value={selectedUser.email || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Email"
                                    className="w-full"
                                />
                                <select
                                    name="role"
                                    value={selectedUser.role || ""}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            role: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border-gray-300"
                                >
                                    <option value="" disabled>
                                        Role
                                    </option>
                                    <option value="super admin">
                                        Super Admin
                                    </option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-4">
                                <select
                                    name="status"
                                    value={selectedUser.status || ""}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Status
                                    </option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <select
                                    name="section"
                                    value={selectedUser.section || ""}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            section: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Section
                                    </option>
                                    <option value="rice">Rice</option>
                                    <option value="corn">Corn</option>
                                    <option value="fishery">Fishery</option>
                                    <option value="high value">
                                        High Value
                                    </option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <select
                                    name="sex"
                                    value={selectedUser.sex || ""}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            sex: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Sex
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="flex gap-5 mt-4">
                                <TextInput
                                    name="password"
                                    value={selectedUser.password || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Password"
                                    type="password"
                                    className="w-full"
                                />
                                <TextInput
                                    name="confirm_password"
                                    value={selectedUser.confirm_password || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="w-full"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="p-4 mt-4 border-t border-slate-300">
                                <PrimaryButton type="submit">
                                    Submit
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            <Modal show={isModalOpen} maxWidth="lg" onClose={closeModal}>
                <div className="p-10">
                    <h2 className="text-xl font-medium flex gap-2 border-b border-2-solid">
                        Add New User{" "}
                    </h2>

                    <div className="mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-5 mb-2">
                                <div>
                                    <input
                                        type="file"
                                        id="pfp"
                                        name="pfp"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                    <div
                                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 "
                                        onClick={handlePreviewClick}
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Profile Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <DefaultAvatar
                                                width="100%"
                                                height="100%"
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5 mb-2">
                                <TextInput
                                    name="firstname"
                                    value={newUser.firstname}
                                    onChange={handleInputChange}
                                    placeholder="Firstname"
                                    className="w-full"
                                />
                                <TextInput
                                    name="lastname"
                                    value={newUser.lastname}
                                    onChange={handleInputChange}
                                    placeholder="Lastname"
                                    className="w-full"
                                />
                                <br />
                            </div>

                            <TextInput
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                placeholder="email"
                                className="w-full mb-2"
                            />

                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleSelectChange}
                                className="w-full rounded-xl border-gray-300"
                            >
                                <option value="" disabled>
                                    Role
                                </option>
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>

                            <br />

                            <div>
                                <select
                                    name="status"
                                    value={newUser.status}
                                    onChange={handleSelectChange}
                                    className="mt-3 w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Status
                                    </option>
                                    <option value="approved">approved</option>
                                    <option value="pending">pending</option>
                                    <option value="rejected">reject</option>
                                </select>
                                <br />
                            </div>
                            <div>
                                <select
                                    name="section"
                                    value={newUser.section}
                                    onChange={handleSelectChange}
                                    className="mt-3 w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Section
                                    </option>
                                    <option value="rice">rice</option>
                                    <option value="corn">corn</option>
                                    <option value="fishery">fishery</option>
                                    <option value="high value">
                                        high value
                                    </option>
                                </select>
                                <br />
                            </div>

                            <div>
                                <select
                                    name="sex"
                                    value={newUser.sex}
                                    onChange={handleSelectChange}
                                    className="mt-3 w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Sex
                                    </option>
                                    <option value="male">male</option>
                                    <option value="female">female</option>
                                </select>
                                <br />
                            </div>

                            <br />

                            <div className="flex gap-2">
                                <TextInput
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    placeholder="password"
                                    type="password"
                                    className="w-full"
                                />
                                <TextInput
                                    name="confirm_password"
                                    value={newUser.confirm_password}
                                    onChange={handleInputChange}
                                    placeholder="confirm password"
                                    type="password"
                                    className="w-full"
                                />
                                <br />
                            </div>

                            <div className="p-4 mt-4 border-t border-slate-300">
                                <PrimaryButton onClick={handleSubmit}>
                                    Submit
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
};

export default UsersList;
