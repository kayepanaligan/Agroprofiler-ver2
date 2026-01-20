import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Card({ title, children, className = "" }) {
    return (_jsxs("div", { className: "w-full sm:max-w-10xl px-4 py-4 border-[2px] bg-white dark:bg-[#161616] dark:border-green-600 border-1 overflow-hidden sm:rounded-[1rem] " +
            className, children: [_jsx("div", { className: "text-sm text-slate-500 mb-3 ", children: title }), children] }));
}
