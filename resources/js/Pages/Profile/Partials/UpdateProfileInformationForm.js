import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
export default function UpdateProfileInformation({ mustVerifyEmail, status, className = "", }) {
    const { props } = usePage();
    const user = props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        pfp: user.pfp,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
    });
    const getImageUrl = (pfp) => {
        if (!pfp)
            return null;
        if (pfp.startsWith('/') || pfp.startsWith('http')) {
            return pfp;
        }
        return `/storage/${pfp}`;
    };
    const [preview, setPreview] = useState(getImageUrl(user.pfp));
    // Update preview when user data changes (after successful update)
    useEffect(() => {
        const currentUser = props.auth.user;
        // If pfp is currently a File (being uploaded), don't update yet
        if (!(data.pfp instanceof File) && currentUser.pfp) {
            setPreview(getImageUrl(currentUser.pfp));
            // Update form data to reflect the new pfp value
            if (data.pfp !== currentUser.pfp) {
                setData("pfp", currentUser.pfp);
            }
        }
    }, [props.auth.user.pfp]);
    const submit = (e) => {
        e.preventDefault();
        // Always use FormData for consistency (like UsersList does)
        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("firstname", String(data.firstname || ""));
        formData.append("lastname", String(data.lastname || ""));
        formData.append("email", String(data.email || ""));
        // Only append pfp if it's a File (new upload)
        if (data.pfp instanceof File) {
            formData.append("pfp", data.pfp);
        }
        router.post(route("profile.update"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reset pfp to the updated value (not the File object)
                if (data.pfp instanceof File) {
                    // After successful upload, the user.pfp will be updated by Inertia
                    // We'll reset it in the next render via useEffect
                }
            },
        });
    };
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("pfp", file);
            setPreview(URL.createObjectURL(file));
        }
    };
    return (_jsxs("section", { className: className, children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-medium text-green-600", children: "Profile Information" }), _jsx("p", { className: "mt-1 text-sm dark:text-white text-gray-600", children: "Update your account's profile information and email address." })] }), _jsxs("form", { onSubmit: submit, className: "mt-6 space-y-6", children: [_jsxs("div", { className: "relative w-[100px] h-[100px]", children: [_jsx(TextInput, { type: "text", name: "pfp", value: data.pfp
                                    ? data.pfp instanceof File
                                        ? data.pfp.name
                                        : data.pfp
                                    : "", readOnly: true, className: "cursor-pointer text-xs border bottom-0 flex border-gray-300 rounded-md w-full h-full", style: {
                                    backgroundImage: preview
                                        ? `url(${preview})`
                                        : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "8px",
                                } }), _jsx("input", { type: "file", accept: "image/*", className: "absolute inset-0 opacity-0 cursor-pointer", onChange: handleFileChange })] }), _jsxs("div", { className: "flex gap-2 w-full", children: [_jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "firstname", value: "First Name" }), _jsx(TextInput, { id: "firstname", name: "firstname", className: "mt-1 block w-full", value: data.firstname, onChange: (e) => setData("firstname", e.target.value), required: true, isFocused: true, autoComplete: "name" }), _jsx(InputError, { className: "mt-2", message: errors.firstname })] }), _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "lastname", value: "Last Name" }), _jsx(TextInput, { id: "lastname", className: "mt-1 block w-full", value: data.lastname, name: "lastname", onChange: (e) => setData("lastname", e.target.value), required: true, isFocused: true, autoComplete: "lastname" }), _jsx(InputError, { className: "mt-2", message: errors.lastname })] })] }), _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "email", value: "Email" }), _jsx(TextInput, { id: "email", type: "email", name: "email", className: "mt-1 block w-full", value: data.email, onChange: (e) => setData("email", e.target.value), required: true, autoComplete: "username" }), _jsx(InputError, { className: "mt-2", message: errors.email })] }), mustVerifyEmail && user.email_verified_at === null && (_jsxs("div", { children: [_jsxs("p", { className: "text-sm mt-2 text-gray-800", children: ["Your email address is unverified.", _jsx(Link, { href: route("verification.send"), method: "post", as: "button", className: "underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Click here to re-send the verification email." })] }), status === "verification-link-sent" && (_jsx("div", { className: "mt-2 font-medium text-sm text-green-600", children: "A new verification link has been sent to your email address." }))] })), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(PrimaryButton, { disabled: processing, children: "Save" }), _jsx(Transition, { show: recentlySuccessful, enter: "transition ease-in-out", enterFrom: "opacity-0", leave: "transition ease-in-out", leaveTo: "opacity-0", children: _jsx("p", { className: "text-sm text-gray-600", children: "Saved." }) })] })] })] }));
}
