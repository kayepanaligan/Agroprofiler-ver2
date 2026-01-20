import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };
    return (_jsxs(GuestLayout, { children: [_jsx(Head, { title: "Email Verification" }), _jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another." }), status === 'verification-link-sent' && (_jsx("div", { className: "mb-4 font-medium text-sm text-green-600", children: "A new verification link has been sent to the email address you provided during registration." })), _jsx("form", { onSubmit: submit, children: _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx(PrimaryButton, { disabled: processing, children: "Resend Verification Email" }), _jsx(Link, { href: route('logout'), method: "post", as: "button", className: "underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Log Out" })] }) })] }));
}
