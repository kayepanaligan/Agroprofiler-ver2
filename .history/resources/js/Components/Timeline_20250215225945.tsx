import React, { useState } from "react";
import { Edit as EditIcon, Trash as TrashIcon } from "lucide-react";
import TextInput from "./TextInput";

interface TimelineField {
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
}

interface TimelineAction {
    icon: React.ReactNode;
    onClick: (id: number) => void;
}

interface TimelineItemProps {
    id: number;
    fields: { [key: string]: any };
    actions?: TimelineAction[];
    hasNext: boolean;
}

interface TimelineProps {
    items: TimelineItemProps[];
    fieldConfig: TimelineField[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({
    id,
    fields,
    actions,
    hasNext,
}) => {
    return (
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-700 shadow-md rounded-full"></div>
                {hasNext && (
                    <div
                        className="w-[2px] bg-slate-200"
                        style={{ height: "170px" }}
                    ></div>
                )}
            </div>
            <div className="mb-6 bg-white p-4 w-[800px] rounded-md border-[2px] flex gap-4">
                {Object.keys(fields).map((key) => {
                    const value = fields[key];
                    if (
                        typeof value === "string" &&
                        value.match(/\.(jpeg|jpg|gif|png)$/)
                    ) {
                        return (
                            <div key={key} className="flex-shrink-0">
                                <img
                                    src={value}
                                    alt={key}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                            </div>
                        );
                    }
                    return null;
                })}
                <div className="flex-1">
                    {Object.keys(fields).map((key) =>
                        typeof fields[key] !== "string" ||
                        !fields[key].match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <p key={key} className="text-sm text-gray-600">
                                <span className="font-semibold">{key}asd:</span>{" "}
                                {fields[key]}
                            </p>
                        ) : null
                    )}
                    {actions && (
                        <div className="mt-2 flex gap-4">
                            {actions.map((action, index) => (
                                <div
                                    key={index}
                                    onClick={() => action.onClick(id)}
                                    className="cursor-pointer border p-2 rounded-md"
                                >
                                    {action.icon}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Timeline: React.FC<TimelineProps> = ({ items, fieldConfig }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item) =>
        fieldConfig.some((field) =>
            String(item.fields[field.key] || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="timeline-container">
            <div className="mb-4 ml-12">
                <TextInput
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[430px] px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="timeline mt-4 overflow-auto w-full p-4 h-[350px]">
                {filteredItems.map((item, index) => (
                    <TimelineItem
                        key={item.id}
                        id={item.id}
                        fields={fieldConfig.reduce((acc, field) => {
                            acc[field.label] = field.render
                                ? field.render(item.fields[field.key])
                                : item.fields[field.key];
                            return acc;
                        }, {} as { [key: string]: any })}
                        actions={item.actions}
                        hasNext={index < filteredItems.length - 1}
                    />
                ))}
                {filteredItems.length === 0 && (
                    <p className="text-gray-500 text-center">
                        No results found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Timeline;
