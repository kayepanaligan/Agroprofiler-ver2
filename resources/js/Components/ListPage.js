import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ListPage({ list, header }) {
    return (_jsxs("div", { className: "p-4 border shadow-sm rounded-[0.9rem]", children: [_jsx("div", { children: header }), _jsx("div", { children: list })] }));
}
