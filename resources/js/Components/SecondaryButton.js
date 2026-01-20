import { jsx as _jsx } from "react/jsx-runtime";
export default function SecondaryButton({ type = "button", className = "", disabled, children, ...props }) {
    return (_jsx("button", { ...props, type: type, className: `inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ${disabled && "opacity-25"} ` + className, disabled: disabled, children: children }));
}
