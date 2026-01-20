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
    image?: string; // Optional image source
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
    image,
    actions,
    hasNext,
}) => {
    return (
        <div className="flex items-start gap-4">
            {/* Connector Line */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 shadow-md rounded-full"></div>
                {hasNext && (
                    <div
                        className="w-[2px] bg-gray-300"
                        style={{ height: "150px" }}
                    ></div>
                )}
            </div>

            {/* Timeline Content */}
            <div className="flex items-start mb-6 bg-slate-50 p-4 w-[800px] rounded-md border">
                {/* Image Section */}
                {image && (
                    <div className="w-[120px] h-[120px] flex-shrink-0 mr-4">
                        <img
                            src={image}
                            alt="Timeline"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                )}

                {/* Fields Section */}
                <div className="flex-1">
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
        </div>
    );
};

const TimelineItem: React.FC<TimelineItemProps> = ({
    id,
    fields,
    actions,
    hasNext,
}) => {
    return (
        <div className="flex items-start gap-4">
            {/* Connector */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 shadow-md rounded-full"></div>
                {hasNext && (
                    <div
                        className="w-[2px] bg-gray-300"
                        style={{ height: "150px" }}
                    ></div>
                )}
            </div>

            {/* Item Content */}
            <div className="mb-6 bg-slate-50 p-4 w-[800px] rounded-md border flex gap-4">
                {/* Left Section: Image */}
                {fields.image && fields.image.proof && (
                    <div className="w-32 h-32">
                        <img
                            src={fields.image.proof}
                            alt="Proof"
                            className="w-full h-full object-cover rounded-md shadow-md"
                        />
                    </div>
                )}

                {/* Right Section: Fields */}
                <div className="flex-1">
                    {Object.keys(fields).map((key) => {
                        if (key === "image") return null; // Skip rendering image data as text
                        return (
                            <p key={key} className="text-sm text-gray-600">
                                <span className="font-semibold">{key}:</span>{" "}
                                {fields[key]}
                            </p>
                        );
                    })}
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
        </div>
    );
};
