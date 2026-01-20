import React, { useState, ReactNode } from "react";

interface TabProps {
    label: string;
    children: ReactNode;
}

interface TabsProps {
    children: React.ReactElement<TabProps>[];
}

const Tab: React.FC<TabProps> = ({ children }) => {
    return <div>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="tabs">
            <div className="tab-labels flex justify-around border rounded-[12px] p-2">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 transition-all duration-300 hover:text-green-600 ${
                            index === activeIndex
                                ? "border-b-2 border-green-700 text-green-700 "
                                : "text-gray-600"
                        }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.props.label}asd
                    </button>
                ))}
            </div>

            <div className="tab-content mt-4">{children[activeIndex]}</div>
        </div>
    );
};

export { Tabs, Tab };
