import request from "@/utils/request.ts";
import type {PaginatedResponse} from "@/types/Pagination.ts";
import type {FilterCplFormSchema} from "@/pages/complex/filter-form-complex.tsx";
import type {Complex} from "@/types/Complex.ts";

export const filterComplexAPI = async (
    status: string,
    filterComplex: FilterCplFormSchema,
    page = 1,
    perPage = 50
): Promise<PaginatedResponse<Complex>> => {
    // Trả về toàn bộ response với message, data, meta, links
    return await request.post(
        `/complex/filterComplex/${status}?page=${page}&perPage=${perPage}`,
        filterComplex
    );
};


export const approveCplAPI = async (listCpl:string[]) => {
    const res = await request.post('/complex/approveComplex', {ids: listCpl});
    return res.data;
}

export const rejectCplAPI = async (listCpl:string[]) => {
    const res = await request.post('/complex/rejectComplex', {ids: listCpl});
    return res.data;
}