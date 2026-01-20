import { jsx as _jsx } from "react/jsx-runtime";
export default function PrimaryButton({ className = "", disabled, children, ...props }) {
    return (_jsx("button", { ...props, className: `inline-flex items-center px-4 py-2 bg-green-700 border border-transparent rounded-[0.6rem] font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-600 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && "opacity-25"} ` + className, disabled: disabled, children: children }));
}
