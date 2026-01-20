import React from "react";

interface TimelineItemProps {
    title: string;
    description: string;
    timestamp: string;
}

interface TimelineProps {
    items: TimelineItemProps[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({
    title,
    description,
    timestamp,
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
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600">{description}</p>
                <p className="text-sm text-gray-400">{timestamp}</p>
            </div>
        </div>
    );
};

const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div className="timeline">
            {items.map((item, index) => (
                <TimelineItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    timestamp={item.timestamp}
                />
            ))}
        </div>
    );
};

export default Timeline;
