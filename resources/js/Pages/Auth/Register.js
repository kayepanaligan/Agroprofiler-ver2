import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { toast, ToastContainer } from "react-toastify";
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        pfp: null,
        firstname: "",
        lastname: "",
        email: "",
        section: "",
        sex: "",
        password: "",
        password_confirmation: "",
    });
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const handlePreviewClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setData("pfp", file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
        else {
            setData("pfp", null);
            setPreview(null);
        }
    };
    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (data.pfp)
            formData.append("pfp", data.pfp);
        formData.append("firstname", data.firstname);
        formData.append("lastname", data.lastname);
        formData.append("email", data.email);
        formData.append("section", data.section);
        formData.append("sex", data.sex);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        post(route("register"), {
            data: formData,
            onFinish: () => reset("email", "password", "password_confirmation"),
            onError: (errors) => {
                console.error("Registration errors:", errors);
                const errorMessages = Array.isArray(errors)
                    ? errors
                    : Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error(errorMessages.join(", "));
                }
                else {
                    toast.error("Registration failed. Please check your details and try again.");
                }
            },
        });
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Register" }), _jsx(ToastContainer, {}), _jsx("form", { onSubmit: submit, children: _jsxs("div", { className: "p-4 h-[500px] overflow-auto", children: [_jsx("br", {}), _jsx("h1", { className: "text-center text-bolder text-[25px] font-semibold text-green-600", children: "Create an account" }), _jsx("br", {}), _jsxs("div", { className: "mt-4 ", children: [_jsx("div", { className: "flex gap-5", children: _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "pfp", value: "Profile Picture", className: "text-white" }), _jsx("input", { type: "file", id: "pfp", name: "pfp", accept: "image/*", onChange: handleFileChange, className: "hidden", ref: fileInputRef }), _jsxs("div", { className: "w-24 h-24 rounded-lg overflow-hidden border-2 cursor-pointer", onClick: handlePreviewClick, children: [preview ? (_jsx("img", { src: preview, alt: "Profile Preview", className: "object-cover w-full h-full" })) : (_jsx(DefaultAvatar, { width: "100%", height: "100%", className: "object-cover w-full h-full" })), _jsx(InputError, { message: errors.pfp, className: "mt-2" })] })] }) }), _jsx("div", { className: "mt-3 ", children: _jsxs("div", { className: "mt-3 flex gap-4", children: [_jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "firstname", value: "First name", className: "text-white" }), _jsx(TextInput, { id: "firstname", name: "firstname", value: data.firstname, className: "mt-1 block w-full", autoComplete: "firstname", isFocused: true, onChange: (e) => setData("firstname", e.target.value), required: true }), _jsx(InputError, { message: errors.firstname, className: "mt-2" })] }), _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "lastname", value: "Last name", className: "text-white" }), _jsx(TextInput, { id: "lastname", name: "lastname", value: data.lastname, className: "mt-1 block w-full", autoComplete: "lastname", onChange: (e) => setData("lastname", e.target.value), required: true }), _jsx(InputError, { message: errors.lastname, className: "mt-2" })] })] }) }), _jsxs("div", { className: "flex gap-5", children: [_jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "email", value: "Email", className: "text-white" }), _jsx(TextInput, { id: "email", type: "email", name: "email", value: data.email, className: "mt-1 block w-full", autoComplete: "username", onChange: (e) => setData("email", e.target.value), required: true }), _jsx(InputError, { message: errors.email, className: "mt-2" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "section", value: "Section", className: "text-white" }), _jsx(TextInput, { id: "section", name: "section", value: data.section, className: "mt-1 block w-full", autoComplete: "section", onChange: (e) => setData("section", e.target.value), required: true }), _jsx(InputError, { message: errors.section, className: "mt-2" })] })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "sex", value: "Sex", className: "text-white" }), _jsxs("select", { id: "sex", name: "sex", value: data.sex, className: "mt-1 block w-full border-slate-300 rounded-xl ", onChange: (e) => setData("sex", e.target.value), required: true, children: [_jsx("option", { value: "", disabled: true, children: "Sex" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] }), _jsx(InputError, { message: errors.sex, className: "mt-2" })] }) }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password", value: "Password", className: "text-white" }), _jsx(TextInput, { id: "password", type: "password", name: "password", value: data.password, className: "mt-1 block w-full", autoComplete: "new-password", onChange: (e) => setData("password", e.target.value), required: true }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password", className: "text-white" }), _jsx(TextInput, { id: "password_confirmation", type: "password", name: "password_confirmation", value: data.password_confirmation, className: "mt-1 block w-full", autoComplete: "new-password", onChange: (e) => setData("password_confirmation", e.target.value), required: true }), _jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })] }), _jsx("div", { className: "flex items-center justify-center mt-4", children: _jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: processing ? "Processing..." : "Register" }) }), _jsx("div", { className: "flex items-center justify-center mt-4", children: _jsx(Link, { href: route("login"), className: " text-sm text-white hover:text-green-700 rounded-md ", children: "Already Registered?" }) })] }) })] }));
}
