import { jsx as _jsx } from "react/jsx-runtime";
export default function InputError({ message, className = '', ...props }) {
    return message ? (_jsx("p", { ...props, className: 'text-sm text-red-600 ' + className, children: message })) : null;
}
