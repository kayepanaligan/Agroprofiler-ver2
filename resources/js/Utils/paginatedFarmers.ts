export interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
    dob: string; // Adjust type according to your DB structure
    age: number;
    sex: string;
    status: string;
    coop: string;
    pwd: boolean;
    fourPs: boolean;
    brgy: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedFarmers {
    data: Farmer[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}
