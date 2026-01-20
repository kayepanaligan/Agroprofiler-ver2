import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridToolbarContainer } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { ChevronDown, Download, PlusIcon } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import Dropdown from "@/Components/Dropdown";
import PrimaryButton from "./PrimaryButton";
const EditToolbar = ({ onAdd }) => (_jsxs(GridToolbarContainer, { sx: {
        marginBottom: "10px",
        display: "flex",
        gap: "10px",
        justifyContent: "space-between",
    }, children: [_jsx(Tooltip, { title: "Add New Data", children: _jsx(Button, { onClick: onAdd, sx: {
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "white",
                }, className: "rounded-[12px] text-sm border hover:border-slate-200 focus:outline-none  focus:ring-2 focus:ring-green-2", children: _jsx(PlusIcon, { size: 18, className: "text-slate-500" }) }) }), _jsxs("div", { className: "flex gap-5", children: [_jsx("input", { type: "search", placeholder: "search", className: "p-4 py-2 w-500 h-10 rounded-[0.9rem] focus:border-green-800 border border-slate-200 focus:outline-none" }), _jsxs(Dropdown, { children: [_jsx(Dropdown.Trigger, { children: _jsxs("button", { className: "rounded-[12px] text-sm border border-slate-200 p-2 flex", children: ["Month", _jsx(ChevronDown, { size: 15, className: "mt-1 ml-3" })] }) }), _jsxs(Dropdown.Content, { align: "right", children: [_jsx(Dropdown.Link, { href: "/link1", children: "All" }), _jsx(Dropdown.Link, { href: "/link2", children: "Allocation" }), _jsx(Dropdown.Link, { href: "/link3", children: "Commodity" })] })] }), _jsxs(Dropdown, { children: [_jsx(Dropdown.Trigger, { children: _jsxs("button", { className: "rounded-[12px] text-sm border border-slate-200 p-2 flex", children: ["Year", _jsx(ChevronDown, { size: 15, className: "mt-1 ml-3" })] }) }), _jsxs(Dropdown.Content, { align: "right", children: [_jsx(Dropdown.Link, { href: "/link1", children: "All" }), _jsx(Dropdown.Link, { href: "/link2", children: "Allocation" }), _jsx(Dropdown.Link, { href: "/link3", children: "Commodity" })] })] })] }), _jsx(PrimaryButton, { className: "rounded-[0.5rem] p-2 px-2 bg-none border border-slate-300", children: _jsx(Download, { size: 17 }) })] }));
export default EditToolbar;
