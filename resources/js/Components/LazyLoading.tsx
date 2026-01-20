import React from "react";

const LazyComponent: React.FC = () => {
    return (
        <div>
            <h2>This is a Lazy Loaded Component!</h2>
            <p>
                Lazy loading helps improve performance by loading components
                only when they are needed.
            </p>
        </div>
    );
};

export default LazyComponent;
