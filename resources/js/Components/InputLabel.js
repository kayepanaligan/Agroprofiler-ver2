import { jsx as _jsx } from "react/jsx-runtime";
export default function InputLabel({ value, className = "", children, ...props }) {
    return (_jsx("label", { ...props, className: `block font-medium text-sm dark:text-white text-gray-700 ` +
            className, children: value ? value : children }));
}
