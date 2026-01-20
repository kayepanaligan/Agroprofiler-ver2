import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Sidebar from "@/Components/Sidebar";
import { ThemeProvider } from "@/Context/ThemeContext";
export default function Authenticated({ user, header, breadcrumbs, children, }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [expanded, setExpanded] = useState(() => JSON.parse(localStorage.getItem("sidebarExpanded") || "false"));
    return (_jsx(ThemeProvider, { children: _jsx("div", { className: "mb-10", children: _jsxs("div", { className: "grid grid-flow-col gap-4 mt-4 transition-all duration-300", children: [_jsx(Sidebar, { user: user, expanded: expanded, setExpanded: setExpanded }), _jsxs("main", { className: `flex flex-col pb-5 rounded-[1rem] row-span-3 bg-white dark:bg-[#0d1a25] h-[96%] overflow-x-auto scrollbar-none shadow-sm transition-all-ease duration-7000 fixed ${expanded
                            ? "ml-[290px] w-[calc(100%-310px)]"
                            : "ml-[120px] w-[calc(100%-130px)]"}`, children: [header && (_jsx("header", { children: _jsx("div", { className: "relative top-[2rem] max-w-10xl mx-auto py-3 px-3 sm:px-6 lg:px-8", children: header }) })), _jsx("div", { className: "relative", children: _jsx("div", { children: _jsx("span", { className: "text-xs text-slate-400 ml-8", children: breadcrumbs }) }) }), _jsx("div", { className: "mt-6 mb-6 ml-4 h-[10%] py-4 w-[100%] mx-auto sm:px-6 lg:px-8 ", children: children })] })] }) }) }));
}
