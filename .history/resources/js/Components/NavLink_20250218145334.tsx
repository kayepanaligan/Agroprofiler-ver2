import { Link, InertiaLinkProps } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                "inline-flex p-2 items-center text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none mx-auto" +
                (active
                    ? " text-green-600 dark:hover:text-green-500 border-l-[3px] border-green-600 shadow-sm focus:bg-slate-500 "
                    : "border-transparent text-black hover:text-green-600 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300") +
                className
            }
        >
            {children}
        </Link>
    );
}
