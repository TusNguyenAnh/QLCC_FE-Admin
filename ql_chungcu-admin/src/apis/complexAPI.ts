import request from "@/utils/request.ts";
import type {PaginatedResult} from "@/types/Pagination.ts";
import type {FilterCplFormSchema} from "@/pages/complex/filter-form-complex.tsx";
import type {Complex} from "@/types/Complex.ts";

export const filterComplexAPI = async (
    status: string,
    filterComplex: FilterCplFormSchema,
    page = 1,
    perPage = 50
): Promise<PaginatedResult<Complex>> => {
    // Gửi request với page 0-indexed
    // Request interceptor will return response.data.result (PaginatedResult)
    return await request.post(
        `/complex/filter/${status}`,{
            ...filterComplex,
            pageNumber: page,
            pageSize: perPage
        },
    );
};


export const approveCplAPI = async (listCpl: string[]) => {
    const res = await request.post('/complex/approve', {ids: listCpl});
    return res.data;
}

export const rejectCplAPI = async (listCpl: string[]) => {
    const res = await request.post('/complex/reject', {ids: listCpl});
    return res.data;
}