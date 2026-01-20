import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import Search from "@/Components/Search";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Delete, Edit2Icon, PlusIcon, Trash } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Image {
    id: number;
    title: string;
    desc: string;
    file_path: string;
}

export default function Images({
    auth,
    images: initialImages,
    cropActivityId,
}: PageProps & { cropActivityId: number; images: Image[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Tracks if editing or adding
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null); // Tracks the ID of the image being edited
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [images, setImages] = useState<Image[]>(initialImages);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setIsModalOpen(true);
        setTitle("");
        setDesc("");
        setImageFile(null);
        setImagePreview(null);
        setSelectedImageId(null);
    };

    const openEditModal = (id: number) => {
        const selectedImage = images.find((image) => image.id === id);
        if (selectedImage) {
            setIsEditing(true);
            setIsModalOpen(true);
            setSelectedImageId(id);
            setTitle(selectedImage.title);
            setDesc(selectedImage.desc);
            setImagePreview(selectedImage.file_path);
            setImageFile(null); // Reset file input to prevent overwriting unless a new file is selected
        } else {
            toast.error("Image not found for editing.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTitle("");
        setDesc("");
        setImageFile(null);
        setImagePreview(null);
        setSelectedImageId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditing && !imageFile) {
            toast.error("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("desc", desc);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        formData.append("crop_activity_id", cropActivityId.toString());

        const url = isEditing
            ? `/cropactivity/image/update/${selectedImageId}`
            : "/cropactivity/images/store";

        const method = isEditing ? "PUT" : "POST";

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            if (!csrfToken) {
                toast.error("CSRF token not found.");
                return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Updated image:", data.image);
                if (isEditing) {
                    setImages((prevImages) =>
                        prevImages.map((img) =>
                            img.id === selectedImageId ? data.image : img
                        )
                    );
                    toast.success("Image updated successfully!");
                } else {
                    setImages((prevImages) => [...prevImages, data.image]);
                    toast.success("Image uploaded successfully!");
                }
                closeModal();
            } else {
                toast.error("Failed to save image.");
            }
        } catch (error) {
            console.error("Error saving image:", error);
            toast.error("Failed to save image.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this image?")) {
            try {
                await fetch(`/images/${id}`, {
                    method: "DELETE",
                });

                setImages((prev) => prev.filter((img) => img.id !== id));
                toast.success("Image deleted successfully!");
            } catch (error) {
                console.error("Error deleting image:", error);
                toast.error("Failed to delete image.");
            }
        }
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Images Management
                </h2>
            }
        >
            <Head title="Images Management" />
            <ToastContainer />
            <div className="flex justify-between mb-3">
                <Search onSearch={() => {}} />
                <PrimaryButton
                    className="text-sm justify-center align-content-center rounded-lg text-white"
                    onClick={openAddModal}
                >
                    <span className="flex gap-2">
                        <PlusIcon size={18} />
                        Add new
                    </span>
                </PrimaryButton>
            </div>

            <div className="flex flex-wrap gap-5 mt-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative border border-slate-300 w-[200px] h-[100] rounded-2xl p-3"
                    >
                        <div className="w-50 h-40">
                            <img
                                src={image.file_path}
                                alt={image.title}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>

                        <div className="p-2">
                            <span className="text-xs">{image.title}</span>
                            <br />
                            <span className="text-xs">{image.desc}</span>
                        </div>

                        <div className="flex gap-4 ">
                            <button
                                className=" text-red-500"
                                onClick={() => handleDelete(image.id)}
                            >
                                <Trash size={20} />
                            </button>
                            <button
                                className=" text-green-500"
                                onClick={() => openEditModal(image.id)}
                            >
                                <Edit2Icon size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                show={isModalOpen}
                maxWidth="lg"
                closeable={true}
                onClose={closeModal}
            >
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? "Edit Image" : "Upload New Image"}
                    </h2>
                    <form onSubmit={handleFormSubmit}>
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
                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Description
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full"
                                onChange={handleFileChange}
                                required={!isEditing}
                            />
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700">
                                Preview:
                            </h3>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    className="mt-2 w-full h-[150px] object-cover rounded-md border border-gray-300"
                                />
                            ) : (
                                <div className="mt-2 w-full h-[150px] bg-gray-100 flex items-center justify-center rounded-md border border-gray-300">
                                    <span className="text-gray-400">
                                        No preview available
                                    </span>
                                </div>
                            )}
                        </div>

                        <PrimaryButton
                            className="rounded-lg text-white"
                            type="submit"
                        >
                            {isEditing ? "Update Image" : "Upload Image"}
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>
        </Authenticated>
    );
}
