import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import TextInput from "./TextInput";
const TimelineItem = ({ id, fields, actions, hasNext, }) => {
    return (_jsxs("div", { className: "flex items-start gap-4", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-4 h-4 bg-green-700 shadow-md rounded-full" }), hasNext && (_jsx("div", { className: "w-[2px] bg-slate-200 dark:bg-green-900", style: { height: "220px" } }))] }), _jsxs("div", { className: "mb-6 bg-white dark:bg-transparent dark:border-green-600 p-4 w-[800px] rounded-md border-[2px] flex gap-4", children: [Object.keys(fields).map((key) => {
                        const value = fields[key];
                        if (typeof value === "string" &&
                            value.match(/\.(jpeg|jpg|gif|png)$/)) {
                            return (_jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: value, alt: key, className: "w-40 h-40 object-cover rounded-md border" }) }, key));
                        }
                        return null;
                    }), _jsxs("div", { className: "flex-1", children: [Object.keys(fields).map((key) => typeof fields[key] !== "string" ||
                                !fields[key].match(/\.(jpeg|jpg|gif|png)$/) ? (_jsxs("p", { className: "text-[14px] text-gray-600 text-ellipsis font-semibold dark:text-white", children: [_jsxs("span", { className: " dark:text-slate-400 ", children: [key, ":"] }), " ", fields[key]] }, key)) : null), actions && (_jsx("div", { className: "mt-2 flex gap-4", children: actions.map((action, index) => (_jsx("div", { onClick: () => action.onClick(id), className: "cursor-pointer border p-2 rounded-md", children: action.icon }, index))) }))] })] })] }));
};
const Timeline = ({ items, fieldConfig }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const filteredItems = items.filter((item) => fieldConfig.some((field) => String(item.fields[field.key] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())));
    return (_jsxs("div", { className: "timeline-container", children: [_jsx("div", { className: "mb-4 ml-12", children: _jsx(TextInput, { type: "text", placeholder: "Search...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-[430px] px-4 py-2 border border-gray-300 dark:bg-transparent dark:text-white dark:border-green-400 rounded-md shadow-sm" }) }), _jsxs("div", { className: "timeline mt-4 overflow-auto w-full p-4 h-[350px]", children: [filteredItems.map((item, index) => (_jsx(TimelineItem, { id: item.id, fields: fieldConfig.reduce((acc, field) => {
                            acc[field.label] = field.render
                                ? field.render(item.fields[field.key])
                                : item.fields[field.key];
                            return acc;
                        }, {}), actions: item.actions, hasNext: index < filteredItems.length - 1 }, item.id))), filteredItems.length === 0 && (_jsx("p", { className: "text-gray-500 text-center dark:text-white", children: "No results found." }))] })] }));
};
export default Timeline;
