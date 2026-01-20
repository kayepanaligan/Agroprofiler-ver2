import Authenticated from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";
import React, {
    ReactNode,
    useState,
    useEffect,
    FormEventHandler,
    Suspense,
    lazy,
} from "react";
import { PageProps } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import List from "@/Components/List";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "@/Components/Search";
import { EyeIcon, Pencil, PlusIcon, Trash } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";

import InputLabel from "@/Components/InputLabel";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Button } from "@headlessui/react";

interface Barangay {
    id: number;
    name: string;
}

interface Farmer {
    id: number;
    rsbsa_ref_no: string;
    firstname: string;
    lastname: string;
    age: number;
    sex: string;
    status: string;
    coop: string;
    pwd: string;
    barangay: {
        id: number;
        name: string;
    };
    "4ps"?: string;
    dob: Date;
    brgy_id: number;
}
export interface PaginatedFarmers {
    data: Farmer[];
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface FarmerProps extends PageProps {
    farmers: PaginatedFarmers;
    barangays: Barangay[];
}

export default function FarmerList({
    auth,
    farmers,
    barangays = [],
}: FarmerProps) {
    // const farmerData = farmers?.data || [];
    const [farmersData, setFarmersData] = useState<FarmerProps[]>();
    const [loading, setLoading] = useState(false);
    const [barangayData, setBarangayData] = useState<Barangay[]>();
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const fetchFarmerData = () => {
        setLoading(true);

        axios
            .get("/farmers/data")

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
            .get("/barangays/data")
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

    const getBarangayName = (barangayId: number) => {
        const barangay = barangays.find((b) => b.id === barangayId);
        return barangay ? barangay.name : "Not Assigned";
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "#", width: 50 },
        {
            field: "rsbsa_ref_no",
            headerName: "RSBSA_REF_#",
            width: 200,
        },
        { field: "firstname", headerName: "First name", width: 120 },
        { field: "lastname", headerName: "Last name", width: 120 },
        { field: "age", headerName: "Age", width: 90 },
        {
            field: "brgy_id",
            headerName: "Barangay",
            width: 100,
            valueGetter: (value, row) => {
                return row?.barangay?.name || "Not Assigned";
            },
        },
        { field: "status", headerName: "Status", width: 100 },
        { field: "sex", headerName: "Sex", width: 70 },
        { field: "4ps", headerName: "4ps", width: 50 },

        {
            field: "actions",
            headerName: "Actions",
            width: 90,
            renderCell: (params) => (
                <div>
                    <button
                        style={{ marginRight: 5 }}
                        onClick={() => handleEdit(params.row.id)}
                    >
                        <Pencil size={20} color="green" />
                    </button>
                    <button onClick={() => handleDelete(params.row.id)}>
                        <Trash size={20} color="red" />
                    </button>
                </div>
            ),
        },
        {
            field: "",
            headerName: "",
            width: 120,
            align: "center",
            renderCell: (params) => (
                <div className="p-2 py-2  rounded-xl top-0">
                    <Button
                        style={{ marginRight: 5 }}
                        onClick={() => handleView(params.row.id)}
                        className="px-2 text-xs rounded-full py-2 bg-green-300 mb-4"
                    >
                        View Profile
                    </Button>
                </div>
            ),
        },
    ];

    // const [filteredRows, setFilteredRows] = useState<Farmer[]>(farmersData|| []);

    // const handleSearch = (query: string) => {
    //     const lowerCaseQuery = query.toLowerCase();
    //     if (!farmersData) return;

    //     const filteredData = farmers.filter((farmersData) =>
    //         Object.values(farmersData).some((value) =>
    //             String(value).toLowerCase().includes(lowerCaseQuery)
    //         )
    //     );
    //     setFarmersData(filteredData);
    // };

    const closeEditModal = () => setIsEditModalOpen(false);

    const sex = [
        { label: "female", value: "female" },
        { label: "male", value: "male" },
    ];

    // const [sexSelectValue, setSexSelectValue] = useState([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // const handleSexSelectChange = (newValue: any) => {
    //     setSexSelectValue(newValue);
    // };

    // const [currentPage, setCurrentPage] = useState(1);
    const totalItems = farmers?.total || 0;

    // const itemsPerPage = 20;

    const handleView = (farmersData: Farmer) => {
        console.log(`/farmprofile/${farmersData}`);
        router.visit(`/farmprofile/${farmersData}`);
    };

    const handleEdit = (farmerId: number) => {
        if (!farmersData) {
            console.error("User data is not available");
            return;
        }

        const farmer = farmersData.find((farmer) => farmer.id === farmerId);

        if (farmer) {
            setSelectedFarmer(farmer);
            setIsEditModalOpen(true); // Open the modal
            console.log("Selected farmer: ", farmer); // Log the selected farmer data
        } else {
            console.error("farmer not found");
        }
    };

    const handleDelete = async (farmersData: Farmer) => {
        if (window.confirm("Are you sure you want to delete this farmer?")) {
            try {
                await router.delete(`/farmers/destroy/${farmersData}`);
                fetchFarmerData();
                setFarmersData((prevData = []) =>
                    prevData.filter(
                        (farmersData) => farmersData !== farmersData
                    )
                );
                toast.success("Farmer deleted successfully", {
                    draggable: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error("Failed to delete farmer");
            }
        }
    };

    const handleUpdate: FormEventHandler = async (e) => {
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
            await axios.post(`/farmers/update/${formattedFarmer.id}`, {
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
            console.log(`/farmers/update/${formattedFarmer.id}`);
            console.log(
                "RSBSA REF NUMBER in Payload:",
                formattedFarmer.rsbsa_ref_no
            );

            fetchFarmerData();
            setFarmersData((prevData = []) =>
                prevData.filter((farmersData) => farmersData !== farmersData)
            );
            toast.success("Farmer updated successfully", {
                draggable: true,
                closeOnClick: true,
            });
            closeEditModal();
        } catch (error) {
            console.error("Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(
                    `Failed to update farmer: ${error.response.statusText}`
                );
            } else {
                toast.error("Failed to update farmer");
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFarmer({
            ...newFarmer,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewFarmer({
            ...newFarmer,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!newFarmer.dob) {
            toast.error("Date of Birth is required.");
            return;
        }
        const formattedFarmer = {
            ...newFarmer,
            dob: newFarmer.dob ? newFarmer.dob : null,
        };
        const formData = new FormData();

        (
            Object.keys(formattedFarmer) as (keyof typeof formattedFarmer)[]
        ).forEach((key) => {
            const value = formattedFarmer[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        try {
            await axios.post("/farmers/store", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchFarmerData();
            setFarmersData((prevData = []) =>
                prevData.filter((farmersData) => farmersData !== farmersData)
            );
            toast.success("Farmer added successfully", {
                draggable: true,
                closeOnClick: true,
            });
            closeModal();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error adding farmer:", error.response.data);
                toast.error(
                    `Failed to add farmer: ${
                        error.response.data.message || "Validation error"
                    }`
                );
            } else {
                toast.error("Failed to add farmer");
            }
        }
    };

    const handleUpdateInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!selectedFarmer) return;
        setSelectedFarmer({
            ...selectedFarmer,
            [e.target.name]: e.target.value,
        } as Farmer);
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
            await axios.post("/api/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Import successful");
        } catch (error) {
            alert("Import failed");
        }
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <>
                    <div className="flex w-full justify-between">
                        <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                            Farmers Management
                        </h2>
                        <div>
                            <TextInput
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx,.csv"
                            />
                            <button onClick={handleImport}>Import</button>
                        </div>
                        <PrimaryButton
                            className="text-sm justify-center align-content-center rounded-lg text-white"
                            onClick={openModal}
                        >
                            <span className="flex gap-2">
                                <PlusIcon size={18} />
                                Add new
                            </span>
                        </PrimaryButton>
                    </div>
                </>
            }
        >
            <Head title="Farmers Management" />
            <ToastContainer />

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-8 h-[600px] overflow-auto">
                    <div className="p-2 border-b-[1px] border-slate-300 mb-2">
                        <h2 className="text-lg">Add New Farmer</h2>
                    </div>

                    <div className="mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-5 w-full mb-2">
                                <TextInput
                                    name="rsbsa_ref_no"
                                    value={newFarmer.rsbsa_ref_no}
                                    onChange={handleInputChange}
                                    placeholder="RSSBA_REF_NO"
                                    className="w-full"
                                />
                            </div>

                            <TextInput
                                name="firstname"
                                value={newFarmer.firstname}
                                onChange={handleInputChange}
                                placeholder="Firstname "
                                className="w-full mb-2"
                            />
                            <TextInput
                                name="lastname"
                                value={newFarmer.lastname}
                                onChange={handleInputChange}
                                placeholder="Lastname"
                                className="w-full mb-2"
                            />

                            <br />

                            <TextInput
                                type="number"
                                name="age"
                                value={newFarmer.age}
                                onChange={handleInputChange}
                                placeholder="Age"
                                className="w-full mb-2"
                            />
                            <select
                                name="sex"
                                value={newFarmer.sex}
                                onChange={handleSelectChange}
                                className="rounded-lg w-full mb-2 border-gray-300"
                            >
                                <option value="" disabled>
                                    Select Sex
                                </option>
                                {sex.map((sexOption) => (
                                    <option
                                        key={sexOption.value}
                                        value={sexOption.value}
                                    >
                                        {sexOption.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="brgy_id"
                                value={newFarmer.brgy_id}
                                onChange={handleSelectChange}
                                className="w-full rounded-lg border-gray-300 mb-2"
                            >
                                <option value="">Barangay</option>
                                {barangays.map((barangay) => (
                                    <option
                                        key={barangay.id}
                                        value={barangay.id}
                                    >
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="4ps"
                                value={newFarmer["4ps"]}
                                onChange={handleSelectChange}
                                className=" w-full rounded-lg border-gray-300 mb-2"
                            >
                                <option value="">Is 4Ps?</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>

                            <select
                                name="pwd"
                                value={newFarmer.pwd}
                                onChange={handleSelectChange}
                                className="w-full rounded-lg border-gray-300 mb-2"
                            >
                                <option value="" disabled>
                                    Is PWD?
                                </option>

                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>

                            <br />
                            <div>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    value={newFarmer.dob}
                                    onChange={(e) =>
                                        setNewFarmer({
                                            ...newFarmer,
                                            dob: "1990-01-01",
                                        })
                                    }
                                    className="w-full border-gray-300 rounded-lg shadow-sm mb-2"
                                    required
                                />

                                <select
                                    name="status"
                                    value={newFarmer.status}
                                    onChange={handleSelectChange}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="" disabled>
                                        Status
                                    </option>
                                    <option value="registered">
                                        Registered
                                    </option>
                                    <option value="unregistered">
                                        Unregistered
                                    </option>
                                </select>
                                <br />
                                <input
                                    type="text"
                                    id="coop"
                                    name="coop"
                                    placeholder="Cooperative"
                                    value={newFarmer.coop}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>

                            <div className="mt-4 border-t border-slate-300">
                                <PrimaryButton onClick={handleSubmit}>
                                    Submit
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            <Box sx={{ height: "520px", padding: "2px", border: "none" }}>
                <DataGrid
                    rows={farmersData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 50 },
                        },
                    }}
                    pageSizeOptions={[50, 100, 200, 350, 500]}
                    loading={loading}
                    checkboxSelection
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
                        padding: "5px",
                        border: "none",
                    }}
                />
            </Box>

            {selectedFarmer && (
                <Modal show={isEditModalOpen} onClose={closeEditModal}>
                    <div className="p-5">
                        <div className="p-2 border-b-[1px] border-slate-300 mb-4">
                            <h2 className="text-lg mb-2">Edit Farmer</h2>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div className="px-4">
                                <InputLabel
                                    value="RSBSA REF NUMBER"
                                    htmlFor="rsbsa_ref_no"
                                    className="mb-2"
                                />
                                <TextInput
                                    name="rsbsa_ref_no"
                                    value={selectedFarmer?.rsbsa_ref_no || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="rsbsa_ref_no"
                                    className="w-full mb-4"
                                />
                            </div>
                            <div className="grid grid-flow-col gap-2">
                                <div className="px-4">
                                    <InputLabel
                                        value="First Name"
                                        htmlFor="firstName"
                                        className="mb-2"
                                    />
                                    <TextInput
                                        name="firstname"
                                        value={selectedFarmer.firstname}
                                        onChange={handleUpdateInputChange}
                                        placeholder="Firstname"
                                    />
                                </div>

                                <div className="px-4 mb-4">
                                    <InputLabel
                                        value="Last Name"
                                        htmlFor="lastName"
                                        className="mb-2"
                                    />
                                    <TextInput
                                        name="lastname"
                                        value={selectedFarmer.lastname}
                                        onChange={handleUpdateInputChange}
                                        placeholder="Lastname"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-flow-col gap-2">
                                <div className="px-4">
                                    <InputLabel value="Age" htmlFor="age" />
                                    <TextInput
                                        name="age"
                                        value={selectedFarmer.age}
                                        onChange={handleUpdateInputChange}
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="px-4">
                                    <InputLabel
                                        value="Cooperative"
                                        htmlFor="coop"
                                    />
                                    <TextInput
                                        type="text"
                                        id="coop"
                                        name="coop"
                                        placeholder="coop"
                                        value={selectedFarmer.coop}
                                        onChange={handleUpdateInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-flow-col gap-2 mt-4">
                                <div className="px-4">
                                    <InputLabel value="Sex" htmlFor="sex" />
                                    <select
                                        name="sex"
                                        className="w-[200px] rounded-lg border-gray-300"
                                        value={selectedFarmer.sex}
                                        onChange={(e) =>
                                            setSelectedFarmer({
                                                ...selectedFarmer,
                                                sex: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select Sex</option>
                                        {sex.map((sexOption) => (
                                            <option
                                                key={sexOption.value}
                                                value={sexOption.value}
                                            >
                                                {sexOption.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="px-4">
                                    <InputLabel
                                        value="Barangay"
                                        htmlFor="barangay"
                                    />
                                    <select
                                        name="brgy_id"
                                        value={
                                            selectedFarmer.barangay?.id || ""
                                        }
                                        onChange={(e) => {
                                            const barangayId = Number(
                                                e.target.value
                                            );
                                            const selectedBarangay =
                                                barangays.find(
                                                    (b) => b.id === barangayId
                                                );
                                            setSelectedFarmer({
                                                ...selectedFarmer,
                                                barangay: selectedBarangay || {
                                                    id: 0,
                                                    name: "Unknown",
                                                },
                                                brgy_id: barangayId,
                                            });
                                        }}
                                        className="w-full rounded-lg border-gray-300"
                                    >
                                        <option value="" disabled>
                                            Barangay
                                        </option>
                                        {barangays.map((barangay) => (
                                            <option
                                                key={barangay.id}
                                                value={barangay.id}
                                            >
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-flow-col gap-2 mt-4">
                                <div className="px-4">
                                    <InputLabel value="Is 4ps?" htmlFor="4ps" />
                                    <select
                                        name="4ps"
                                        value={selectedFarmer["4ps"]}
                                        onChange={(e) =>
                                            setSelectedFarmer({
                                                ...selectedFarmer,
                                                "4ps": e.target.value,
                                            })
                                        }
                                        className="mt-3 w-full rounded-lg border-gray-300"
                                    >
                                        <option value="" disabled>
                                            Is 4Ps?
                                        </option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div className="px-4">
                                    <InputLabel value="Is PWD?" htmlFor="pwd" />
                                    <select
                                        name="pwd"
                                        value={selectedFarmer.pwd}
                                        onChange={(e) =>
                                            setSelectedFarmer({
                                                ...selectedFarmer,
                                                pwd: e.target.value,
                                            })
                                        }
                                        className="mt-3 w-full rounded-lg border-gray-300"
                                    >
                                        <option value="" disabled>
                                            Is PWD?
                                        </option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-flow-col gap-2 mt-4">
                                <div className="px-4">
                                    <InputLabel
                                        value="Birthdate"
                                        htmlFor="dob"
                                    />
                                    <TextInput
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        value={
                                            selectedFarmer.dob
                                                ? format(
                                                      new Date(
                                                          selectedFarmer.dob
                                                      ),
                                                      "yyyy-MM-dd"
                                                  )
                                                : ""
                                        }
                                        onChange={handleUpdateInputChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="px-4">
                                    <InputLabel value="status" htmlFor="dob" />
                                    <select
                                        name="status"
                                        value={
                                            selectedFarmer.status ||
                                            (selectedFarmer?.rsbsa_ref_no
                                                ? "registered"
                                                : "unregistered")
                                        }
                                        onChange={(e) =>
                                            setSelectedFarmer({
                                                ...selectedFarmer,
                                                status: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                    >
                                        <option value="">Status</option>
                                        <option value="registered">
                                            registered
                                        </option>
                                        <option value="unregistered">
                                            unregistered
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 mt-4 border-t border-slate-300">
                                <PrimaryButton type="submit">
                                    Update
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </Authenticated>
    );
}
