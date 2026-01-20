import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Guest({ children }) {
    return (_jsx("div", { className: "min-h-screen flex flex-col sm:justify-center items-center sm:pt-0 main-bg", children: _jsxs("div", { className: "grid grid-flow-col grid-cols-2 min-w-full min-h-screen p-2 bg-opacity-90 bg-slate-900", children: [_jsx("div", { className: "w-full p-2 flex justify-center items-center rounded-lg", children: children }), _jsx("div", { className: "w-full bg-green-700 rounded-[15px]", children: _jsx("div", { className: "right-bg object-cover bg-cover bg-center h-[100%] w-full relative" }) })] }) }));
}
