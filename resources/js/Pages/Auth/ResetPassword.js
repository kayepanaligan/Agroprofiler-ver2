import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Reset Password" }), _jsxs("form", { onSubmit: submit, children: [_jsxs("div", { children: [_jsx(InputLabel, { htmlFor: "email", value: "Email" }), _jsx(TextInput, { id: "email", type: "email", name: "email", value: data.email, className: "mt-1 block w-full", autoComplete: "username", onChange: (e) => setData('email', e.target.value) }), _jsx(InputError, { message: errors.email, className: "mt-2" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password", value: "Password" }), _jsx(TextInput, { id: "password", type: "password", name: "password", value: data.password, className: "mt-1 block w-full", autoComplete: "new-password", isFocused: true, onChange: (e) => setData('password', e.target.value) }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password" }), _jsx(TextInput, { type: "password", name: "password_confirmation", value: data.password_confirmation, className: "mt-1 block w-full", autoComplete: "new-password", onChange: (e) => setData('password_confirmation', e.target.value) }), _jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })] }), _jsx("div", { className: "flex items-center justify-end mt-4", children: _jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Reset Password" }) })] })] }));
}
