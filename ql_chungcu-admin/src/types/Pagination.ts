export type PaginationMeta = {
    page: number; // 0-indexed
    size: number;
    totalElements: number;
    totalPages: number;
};

export type PaginatedResult<T> = {
    data: T[];
    page: number; // 0-indexed
    size: number;
    totalElements: number;
    totalPages: number;
};

export type PaginatedResponse<T> = {
    code: number;
    message: string;
    result: PaginatedResult<T>;
};