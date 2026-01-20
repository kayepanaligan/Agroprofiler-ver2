import React, { ReactNode } from "react";

interface Prop {
    children: React.ReactNode;
}

export default function ListHeader({ children }: Prop) {
    return (
        <div className="flex gap-5 flex-wrap">
            <div>{children}</div>
        </div>
    );
}
