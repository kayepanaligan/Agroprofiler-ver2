import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Tab = ({ children }) => {
    return _jsx("div", { children: children });
};
const Tabs = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (_jsxs("div", { className: "tabs", children: [_jsx("div", { className: "tab-labels flex justify-around border rounded-[12px] p-2", children: children.map((tab, index) => (_jsx("button", { className: `px-4 py-2 transition-all duration-300 hover:text-green-600 ${index === activeIndex
                        ? "border-b-2 border-green-700 text-green-700 "
                        : "text-gray-600"}`, onClick: () => setActiveIndex(index), children: tab.props.label }, index))) }), _jsx("div", { className: "tab-content mt-4 h-[20rem]", children: children[activeIndex] })] }));
};
export { Tabs, Tab };
