import React from "react";
import Modal from "@/Components/Modal";
import { TriangleAlert } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const WarningModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => (
    <Modal show={isOpen} maxWidth="sm" onClose={onClose}>
        <div className="p-6 grid grid-rows-4 place-items-center">
            <TriangleAlert
                size={45}
                className="p-1 text-white bg-red-600 rounded-full"
            />
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-600">{message}</p>
            <div className="flex space-between gap-5">
                <button
                    onClick={onConfirm}
                    className="mt-4 px-2 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    Delete
                </button>
                <button
                    onClick={onClose}
                    className="mt-4 px-2 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:border "
                >
                    Cancel
                </button>
            </div>
        </div>
    </Modal>
);

export default WarningModal;
