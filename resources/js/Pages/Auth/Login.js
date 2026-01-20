import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
export default function Login({ status, canResetPassword, }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Log in" }), status && (_jsxs("div", { className: "mb-4 font-medium text-sm text-green-600", children: [status, " hello"] })), _jsxs("div", { className: "p-4 ", children: [_jsx("br", {}), _jsx("h1", { className: "text-bolder text-center text-[30px] font-semibold text-green-600", children: "Welcome Back" }), _jsx("br", {}), _jsxs("form", { onSubmit: submit, children: [_jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "email", value: "Email", className: "text-white" }), _jsx(TextInput, { id: "email", type: "email", name: "email", value: data.email, className: "mt-1 dark:text-white block w-full", autoComplete: "username", isFocused: true, onChange: (e) => setData("email", e.target.value) }), _jsx(InputError, { message: errors.email, className: "mt-2" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password", value: "Password", className: "text-white" }), _jsx(TextInput, { id: "password", type: "password", name: "password", value: data.password, className: "mt-1 block w-full", autoComplete: "current-password", onChange: (e) => setData("password", e.target.value) }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsx("div", { className: "block mt-4", children: _jsx("div", { className: "flex items-center ", children: canResetPassword && (_jsx(Link, { href: route("password.request"), className: "underline text-xs text-white hover:text-green-700 ", children: "Forgot your password?" })) }) }), _jsx("br", {}), _jsx("div", { className: "flex justify-center ", children: _jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: processing ? "Logging you in..." : "Log In" }) }), _jsx("br", {}), _jsx("div", { className: "mt-1 text-center", children: _jsxs("span", { className: "text-xs text-center text-white", children: ["Don't have account yet?", " ", _jsx(Link, { href: "register", children: _jsx("span", { className: "hover:underline text-green-500", children: "Register" }) })] }) })] })] })] }));
}
