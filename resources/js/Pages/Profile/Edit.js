import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import Card from "@/Components/Card";
export default function Edit({ auth, mustVerifyEmail, status, }) {
    return (_jsxs(AuthenticatedLayout, { user: auth.user, header: _jsx("h2", { className: "font-semibold text-[25px] text-green-600 leading-tight", children: "Profile Information" }), children: [_jsx(Head, { title: "Profile" }), _jsx("div", { className: "py-2", children: _jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6", children: [_jsx(Card, { title: "", className: "", children: _jsx(UpdateProfileInformationForm, { mustVerifyEmail: mustVerifyEmail, status: status, className: "max-w-xl" }) }), _jsx(Card, { title: "", className: "", children: _jsx(UpdatePasswordForm, { className: "max-w-xl" }) }), _jsx(Card, { title: "", className: "", children: _jsx(DeleteUserForm, { className: "max-w-xl" }) })] }) })] }));
}
