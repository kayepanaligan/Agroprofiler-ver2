import React, { useState, ReactNode } from "react";

interface TabProps {
    label: string;
    children: ReactNode;
}

interface TabsProps {
    children: React.ReactElement<TabProps>[]; // Array of Tab components
}

const Tab: React.FC<TabProps> = ({ children }) => {
    return <div>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="tabs">
            {/* Tab Labels */}
            <div className="tab-labels flex border-b">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 ${
                            index === activeIndex
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.props.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content mt-4">{children[activeIndex]}</div>
        </div>
    );
};

export { Tabs, Tab };
