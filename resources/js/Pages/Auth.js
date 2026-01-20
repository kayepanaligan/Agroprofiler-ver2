import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Guest from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
export default function Auth({ children }) {
    return (_jsxs(_Fragment, { children: [_jsx(Head, { title: "Authenticate" }), _jsx(Guest, { children: _jsxs("div", { className: "flex gap-5", children: [_jsx("div", { className: "login", children: "login" }), _jsx("div", { className: "register", children: "register" })] }) })] }));
}
