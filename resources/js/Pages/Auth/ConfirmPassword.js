import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Confirm Password" }), _jsx("div", { className: "mb-4 text-sm text-gray-600", children: "This is a secure area of the application. Please confirm your password before continuing." }), _jsxs("form", { onSubmit: submit, children: [_jsxs("div", { className: "mt-4", children: [_jsx(InputLabel, { htmlFor: "password", value: "Password" }), _jsx(TextInput, { id: "password", type: "password", name: "password", value: data.password, className: "mt-1 block w-full", isFocused: true, onChange: (e) => setData('password', e.target.value) }), _jsx(InputError, { message: errors.password, className: "mt-2" })] }), _jsx("div", { className: "flex items-center justify-end mt-4", children: _jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Confirm" }) })] })] }));
}
