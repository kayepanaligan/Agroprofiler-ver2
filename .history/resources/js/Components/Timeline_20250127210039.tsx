import React, { useState } from "react";
import { Edit as EditIcon, Trash as TrashIcon } from "lucide-react";

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
                <div className="w-4 h-4 bg-green-500 shadow-md rounded-full"></div>
                {hasNext && (
                    <div
                        className="w-[2px] bg-gray-300"
                        style={{ height: "150px" }}
                    ></div>
                )}
            </div>
            <div className="mb-6 bg-slate-100 p-4 w-[400px] rounded-md shadow-[2px_0px_10px_0px_#00000024]">
                {Object.keys(fields).map((key) => (
                    <p key={key} className="text-sm text-gray-600">
                        <span className="font-semibold">{key}:</span>{" "}
                        {fields[key]}
                    </p>
                ))}
                {actions && (
                    <div className="mt-2 flex gap-4">
                        {actions.map((action, index) => (
                            <div
                                key={index}
                                onClick={() => action.onClick(id)}
                                className="cursor-pointer"
                            >
                                {action.icon}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Timeline: React.FC<TimelineProps> = ({ items, fieldConfig }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter items based on the search query
    const filteredItems = items.filter((item) =>
        fieldConfig.some((field) =>
            String(item.fields[field.key] || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="timeline-container">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[350px] px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>

            {/* Timeline Items */}
            <div className="timeline">
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
