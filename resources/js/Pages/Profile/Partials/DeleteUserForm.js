import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
export default function DeleteUserForm({ className = "", }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);
    const { data, setData, delete: destroy, processing, reset, errors, } = useForm({
        password: "",
    });
    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };
    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };
    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };
    return (_jsxs("section", { className: `space-y-6 ${className}`, children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-medium text-red-600", children: "Delete Account" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-white", children: "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain." })] }), _jsx(DangerButton, { onClick: confirmUserDeletion, children: "Delete Account" }), _jsx(Modal, { show: confirmingUserDeletion, onClose: closeModal, children: _jsxs("form", { onSubmit: deleteUser, className: "p-6", children: [_jsx("h2", { className: "text-lg font-medium text-red-500", children: "Are you sure you want to delete your account?" }), _jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-white", children: "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account." }), _jsxs("div", { className: "mt-6", children: [_jsx(InputLabel, { htmlFor: "password", value: "Password", className: "sr-only" }), _jsx(TextInput, { id: "password", type: "password", name: "password", ref: passwordInput, value: data.password, onChange: (e) => setData("password", e.target.value), className: "mt-1 block w-3/4", isFocused: true, placeholder: "Password" }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsxs("div", { className: "mt-6 flex justify-end", children: [_jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }), _jsx(DangerButton, { className: "ms-3", disabled: processing, children: "Delete Account" })] })] }) })] }));
}
