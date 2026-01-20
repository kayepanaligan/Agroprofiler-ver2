import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
export default function UpdatePasswordForm({ className = "", }) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);
    const { data, setData, errors, put, reset, processing, recentlySuccessful, } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const updatePassword = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };
    return (_jsxs("section", { className: className, children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-medium text-green-600", children: "Update Password" }), _jsx("p", { className: "mt-1 text-sm dark:text-white text-gray-600", children: "Ensure your account is using a long, random password to stay secure." })] }), _jsxs("form", { onSubmit: updatePassword, className: "mt-6 space-y-6", children: [_jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "current_password", value: "Current Password" }), _jsx(TextInput, { id: "current_password", ref: currentPasswordInput, value: data.current_password, onChange: (e) => setData("current_password", e.target.value), type: "password", className: "mt-1 block w-full", autoComplete: "current-password" }), _jsx(InputError, { message: errors.current_password, className: "mt-2" })] }), _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "password", value: "New Password" }), _jsx(TextInput, { id: "password", ref: passwordInput, value: data.password, onChange: (e) => setData("password", e.target.value), type: "password", className: "mt-1 block w-full", autoComplete: "new-password" }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password" }), _jsx(TextInput, { id: "password_confirmation", value: data.password_confirmation, onChange: (e) => setData("password_confirmation", e.target.value), type: "password", className: "mt-1 block w-full", autoComplete: "new-password" }), _jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(PrimaryButton, { disabled: processing, children: "Save" }), _jsx(Transition, { show: recentlySuccessful, enter: "transition ease-in-out", enterFrom: "opacity-0", leave: "transition ease-in-out", leaveTo: "opacity-0", children: _jsx("p", { className: "text-sm text-gray-600", children: "Saved." }) })] })] })] }));
}
