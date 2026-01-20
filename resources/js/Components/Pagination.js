import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisiblePages = 5; // Show 5 pages at a time
    const getVisiblePages = () => {
        const pages = [];
        if (totalPages <= maxVisiblePages) {
            // If the total pages are fewer than maxVisiblePages, display all
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Calculate visible range
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            // Adjust start and end pages if they overflow limits
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            // Add pages to display
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            // Add ellipsis if there are more pages
            if (startPage > 1) {
                pages.unshift("...");
                pages.unshift(1); // Always show the first page
            }
            if (endPage < totalPages) {
                pages.push("...");
                pages.push(totalPages); // Always show the last page
            }
        }
        return pages;
    };
    const visiblePages = getVisiblePages();
    return (_jsxs("div", { className: "flex items-center justify-center mt-4", children: [_jsx("button", { disabled: currentPage === 1, onClick: () => onPageChange(currentPage - 1), className: "px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50", children: "Previous" }), visiblePages.map((page, index) => (_jsx("button", { onClick: () => typeof page === "number" && onPageChange(page), disabled: page === currentPage || page === "...", className: `px-3 py-1 mx-1 text-sm rounded ${page === currentPage
                    ? "bg-blue-500 text-white"
                    : page === "..."
                        ? "text-gray-500"
                        : "bg-gray-200"}`, children: page }, index))), _jsx("button", { disabled: currentPage === totalPages, onClick: () => onPageChange(currentPage + 1), className: "px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50", children: "Next" })] }));
}
