import { jsx as _jsx } from "react/jsx-runtime";
export default function ListHeader({ children }) {
    return (_jsx("div", { className: "flex gap-5 flex-wrap", children: _jsx("div", { children: children }) }));
}
