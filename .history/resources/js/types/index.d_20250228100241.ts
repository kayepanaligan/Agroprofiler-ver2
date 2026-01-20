export interface User {
    id: number;
    pfp: File | string;
    firstname: string;
    lastname: string;
    status: string;
    section: string;
    email: string;
    email_verified_at?: string;
    role: "admin" | "super admin";
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        role: User;
        user: User;
    };
};
