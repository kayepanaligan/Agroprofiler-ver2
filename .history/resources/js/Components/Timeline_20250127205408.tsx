import React from "react";
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
                {/* Timeline Circle */}
                <div className="w-4 h-4 bg-green-500 shadow-md rounded-full"></div>

                {hasNext && (
                    <div
                        className="w-[2px] bg-gray-300"
                        style={{ height: "50px" }} // Set the height for the line
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
    return (
        <div className="timeline">
            {items.map((item, index) => (
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
                    hasNext={index < items.length - 1}
                />
            ))}
        </div>
    );
};

export default Timeline;
