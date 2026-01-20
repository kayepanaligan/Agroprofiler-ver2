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

    const openModal = () => {
        setIsModalOpen(true);
        setTitle("");
        setDesc("");
        setImageFile(null);
        setImagePreview(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTitle("");
        setDesc("");
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("desc", desc);
        formData.append("image", imageFile);
        formData.append("crop_activity_id", cropActivityId.toString());

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (!csrfToken) {
            toast.error("Failed to upload image due to CSRF token issue.");
            return;
        }

        try {
            const response = await fetch("/cropactivity/images/store", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.image) {
                    setImages((prevImages) => [...prevImages, data.image]);
                    toast.success("Image uploaded successfully!");
                    closeModal();
                } else {
                    toast.error("Unexpected response format.");
                }
            } else {
                toast.error("Failed to upload image: Server error.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
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
                    onClick={openModal}
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
                                onClick={() => handleDelete(image.id)}
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
                        Upload New Image
                    </h2>
                    <form onSubmit={handleImageUpload}>
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
                                required
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
                                <div className="mt-2 w-full h-[150px] border border-dashed border-gray-300 flex items-center justify-center rounded-md">
                                    <span className="text-gray-500">
                                        Select Pic to Preview
                                    </span>
                                </div>
                            )}
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
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </Authenticated>
    );
}
