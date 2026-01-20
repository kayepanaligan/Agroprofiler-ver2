import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Forgot Password" }), _jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one." }), status && _jsx("div", { className: "mb-4 font-medium text-sm text-green-600", children: status }), _jsxs("form", { onSubmit: submit, children: [_jsx(TextInput, { id: "email", type: "email", name: "email", value: data.email, className: "mt-1 block w-full", isFocused: true, onChange: (e) => setData('email', e.target.value) }), _jsx(InputError, { message: errors.email, className: "mt-2" }), _jsx("div", { className: "flex items-center justify-end mt-4", children: _jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Email Password Reset Link" }) })] })] }));
}
