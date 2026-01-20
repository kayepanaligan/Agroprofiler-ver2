import React from "react";
import { Edit as EditIcon, Trash as TrashIcon } from "lucide-react";

interface TimelineItemProps {
    id: number;
    allocation: string;
    dateReceived: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

interface TimelineProps {
    items: TimelineItemProps[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({
    id,
    allocation,
    dateReceived,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex items-start gap-4">
            {/* Timeline Circle */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-px bg-gray-300 flex-1"></div>
            </div>

            {/* Timeline Content */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold">{allocation}</h3>
                <p className="text-gray-400 text-sm">
                    Received on: {dateReceived}
                </p>
                <div className="mt-2 flex gap-4">
                    <EditIcon
                        size={20}
                        color="green"
                        onClick={() => onEdit(id)}
                        className="cursor-pointer"
                    />
                    <TrashIcon
                        size={20}
                        color="red"
                        onClick={() => onDelete(id)}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div className="timeline">
            {items.map((item) => (
                <TimelineItem
                    key={item.id}
                    id={item.id}
                    allocation={item.allocation}
                    dateReceived={item.dateReceived}
                    onEdit={item.onEdit}
                    onDelete={item.onDelete}
                />
            ))}
        </div>
    );
};

export default Timeline;
