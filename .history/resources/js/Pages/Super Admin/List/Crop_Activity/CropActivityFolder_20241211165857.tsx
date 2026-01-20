import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "@/Components/Search";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import { Pencil, PencilIcon, PlusIcon, Trash } from "lucide-react";
import { PageProps } from "@/types";

interface CropActivityFolder {
    id: number;
    title: string;
    date: string;
}

interface FarmerProps {
    auth: any;
}

interface CropActivityResponse extends PageProps {
    initialFolders: CropActivityFolder[];
    folder: CropActivityFolder;
}

export default function CropActivityFolder({ auth }: FarmerProps) {
    const { props } = usePage<CropActivityResponse>();
    const initialFolders: CropActivityFolder[] = props.initialFolders ?? [];

    const [folders, setFolders] =
        useState<CropActivityFolder[]>(initialFolders);
    const [filteredFolders, setFilteredFolders] =
        useState<CropActivityFolder[]>(initialFolders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [editingFolderId, setEditingFolderId] = useState<number | null>(null);

    useEffect(() => {
        setFilteredFolders(folders);
    }, [folders]);

    const openModal = (folder?: CropActivityFolder) => {
        setIsModalOpen(true);
        if (folder) {
            setEditingFolderId(folder.id);
            setTitle(folder.title || "");
            setDate(folder.date || "");
        } else {
            setEditingFolderId(null);
            setTitle("");
            setDate("");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFolderId(null);
        setTitle("");
        setDate("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedDate = date
            ? new Date(date).toISOString().split("T")[0]
            : null;
        const payload = { title, date: formattedDate };

        if (editingFolderId) {
            // Update existing folder
            router.patch(`/cropactivity/update/${editingFolderId}`, payload, {
                onSuccess: (response: { folder: CropActivityFolder }) => {
                    toast.success("Folder updated successfully!");

                    window.location.reload();
                },
                onError: () => {
                    toast.error("Failed to update folder.");
                },
            });
        } else {
            // Add new folder
            router.post("/cropactivity/store", payload, {
                onSuccess: (response: { folder: CropActivityFolder }) => {
                    toast.success("Folder added successfully!");

                    window.location.reload();
                },
                onError: () => {
                    toast.error("Failed to add folder.");
                },
            });
        }
    };

    const handleView = (id: number) => {
        router.visit(`/cropactivity/images/${id}`);
        console.log("folder id:", id);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this folder?")) {
            router.delete(`/cropactivity/destroy/${id}`, {
                onSuccess: () => {
                    setFolders(folders.filter((folder) => folder.id !== id));
                    toast.success("Folder deleted successfully!");
                },
                onError: () => {
                    toast.error("Failed to delete folder.");
                },
            });
        }
    };

    const handleSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        setFilteredFolders(
            folders.filter((folder) =>
                folder.title.toLowerCase().includes(lowerCaseQuery)
            )
        );
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Crop Activity Management
                </h2>
            }
        >
            <Head title="Crop Activity Management" />
            <ToastContainer />
            <div className="flex justify-between mb-3">
                <Search onSearch={handleSearch} />
                <PrimaryButton
                    className="text-sm justify-center align-content-center rounded-lg text-white"
                    onClick={() => openModal()}
                >
                    <span className="flex gap-2">
                        <PlusIcon size={18} />
                        Add new
                    </span>
                </PrimaryButton>
            </div>

            <span className="mt-5 text-sm text-slate-400">
                Total: {filteredFolders.length}
            </span>
            <div className="flex flex-wrap gap-5 mt-2">
                {filteredFolders.map((folder) =>
                    folder ? (
                        <div
                            key={folder.id}
                            className="flex justify-between border border-slate-300 w-[300px] h-[45px] rounded-2xl p-3 cursor-pointer"
                            onClick={() => handleView(folder.id)}
                        >
                            <div className="border-b border-slate-300 mb-2">
                                <p className="text-sm font-semibold text-slate-600">
                                    {folder.title}
                                </p>
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                                <span>
                                    {folder.date
                                        ? new Date(
                                              folder.date
                                          ).toLocaleDateString()
                                        : "No date provided"}
                                </span>
                            </div>
                            <div className="b-0 flex gap-3">
                                <button
                                    className="text-xs text-red-500 mt-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(folder.id);
                                    }}
                                >
                                    <Trash size={20} />
                                </button>
                                <button
                                    className="text-xs text-green-500 mt-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(folder);
                                    }}
                                >
                                    <PencilIcon size={20} />
                                </button>
                            </div>
                        </div>
                    ) : null
                )}
            </div>

            <Modal
                show={isModalOpen}
                maxWidth="lg"
                closeable={true}
                onClose={closeModal}
            >
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingFolderId
                            ? "Edit Crop Activity"
                            : "Add New Crop Activity"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {editingFolderId ? "Update" : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </Authenticated>
    );
}
