import request from "@/utils/request.ts";
import type {OrgFormSchema} from "@/pages/organization/action-form-org.tsx";

export const getAllOrgAPI = async () => {
    const res = await request.get('/organizations');
    return res.data;
}

export const findByIdAPI = async (orgId: string) => {
    const res = await request.get(`/organizations/${orgId}`);
    return res.data;
}

export const getBdIdByOrgIdAPI = async (complexId: string, parentId:string) => {
    const res = await request.get(`organizations/getBdIdByOrgId/${complexId}/${parentId}`);
    return res.data;
}


export const getAllOrgWithoutChildAPI = async (orgId: string, complexId:string) => {
    const res = await request.get(`/organizations/getAllWithoutChild/${orgId}/${complexId}`);
    return res.data;
}

export const getTopLevelOrg = async (complexId: string) => {
    const res = await request.get(`/organizations/getTopLevel/${complexId}`);
    return res.data;
}


export const createOrgAPI = async (newOrg: OrgFormSchema) => {
    const res = await request.post('/organizations/create', newOrg);
    return res.data;
}

export const updateOrgAPI = async (updateOrg: OrgFormSchema, orgId: string) => {
    const res = await request.post(`/organizations/update/${orgId}`, updateOrg);
    return res.data;
}

export const deleteOrgAPI = async (listOrg:string[]) => {
    const res = await request.post('/organizations/delete', {listOrg: listOrg});
    return res;
}