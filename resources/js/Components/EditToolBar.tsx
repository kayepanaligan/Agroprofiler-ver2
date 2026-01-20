import React from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { ChevronDown, Download, PlusIcon } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import Dropdown from "@/Components/Dropdown";
import PrimaryButton from "./PrimaryButton";

interface EditToolbarProps {
    onAdd: () => void;
}

const EditToolbar: React.FC<EditToolbarProps> = ({ onAdd }) => (
    <GridToolbarContainer
        sx={{
            marginBottom: "10px",
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
        }}
    >
        <Tooltip title="Add New Data">
            <Button
                onClick={onAdd}
                sx={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "white",
                }}
                className="rounded-[12px] text-sm border hover:border-slate-200 focus:outline-none  focus:ring-2 focus:ring-green-2"
            >
                <PlusIcon size={18} className="text-slate-500" />
            </Button>
        </Tooltip>

        <div className="flex gap-5">
            <input
                type="search"
                placeholder="search"
                className="p-4 py-2 w-500 h-10 rounded-[0.9rem] focus:border-green-800 border border-slate-200 focus:outline-none"
            />

            <Dropdown>
                <Dropdown.Trigger>
                    <button className="rounded-[12px] text-sm border border-slate-200 p-2 flex">
                        Month
                        <ChevronDown size={15} className="mt-1 ml-3" />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content align="right">
                    <Dropdown.Link href="/link1">All</Dropdown.Link>
                    <Dropdown.Link href="/link2">Allocation</Dropdown.Link>
                    <Dropdown.Link href="/link3">Commodity</Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>

            <Dropdown>
                <Dropdown.Trigger>
                    <button className="rounded-[12px] text-sm border border-slate-200 p-2 flex">
                        Year
                        <ChevronDown size={15} className="mt-1 ml-3" />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content align="right">
                    <Dropdown.Link href="/link1">All</Dropdown.Link>
                    <Dropdown.Link href="/link2">Allocation</Dropdown.Link>
                    <Dropdown.Link href="/link3">Commodity</Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>

        <PrimaryButton className="rounded-[0.5rem] p-2 px-2 bg-none border border-slate-300">
            <Download size={17} />
        </PrimaryButton>
    </GridToolbarContainer>
);

export default EditToolbar;
