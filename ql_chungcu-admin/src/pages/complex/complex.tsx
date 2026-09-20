import FilterCplForm, {
    type FilterCplFormSchema,
} from "@/pages/complex/filter-form-complex.tsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type {PaginationMeta} from "@/types/Pagination.ts";
import {useState} from "react";
import {approveCplAPI, filterComplexAPI, rejectCplAPI} from "@/apis/complexAPI.ts";
import {handleAxiosStatusCode} from "@/utils/request";
import {DataPagination} from "@/layouts/pagination/data-pagination.tsx";
import type {Complex} from "@/types/Complex.ts";
import {getMediaFileAPI} from "@/apis/mediaFileAPI.ts";
import type {listMediaFile} from "@/types/MediaFile.ts";
import ComplexList from "@/pages/complex/complex-list.tsx";
import ComplexDetail from "@/pages/complex/complex-detail.tsx";
import {toast} from "sonner";

function Complex() {
    const [loading, setLoading] = useState(false);
    const [listComplex, setListComplex] = useState<Complex[] | []>([]);
    const [listComplexApproved, setListComplexApproved] = useState<
        Complex[] | []
    >([]);
    const [selectedRequest, setSelectedRequest] = useState<Complex | null>(null);
    const [mediaFiles, setMediaFiles] = useState<listMediaFile | null>(null);
    const [openReqDetail, setOpenReqDetail] = useState(false);
    const [currentType, setCurrentType] = useState<string>("pd");

    // Pagination states for pending requests
    const [pendingMeta, setPendingMeta] = useState<PaginationMeta>({
        page: 1,
        size: 50,
        totalElements: 0,
        totalPages: 0,
    });
    const [pendingPerPage, setPendingPerPage] = useState(50);
    const [pendingFilter, setPendingFilter] = useState<FilterCplFormSchema>({});

    // Pagination states for approved requests
    const [approvedMeta, setApprovedMeta] = useState<PaginationMeta>({
        page: 1,
        size: 50,
        totalElements: 0,
        totalPages: 0,
    });
    const [approvedPerPage, setApprovedPerPage] = useState(50);
    const [approvedFilter, setApprovedFilter] = useState<FilterCplFormSchema>({});

    const getComplex = async (
        status: string,
        filterComplex: FilterCplFormSchema,
        page = 1,
        perPage = 50
    ) => {
        setLoading(true);
        try {
            const response = await filterComplexAPI(
                status,
                filterComplex,
                page,
                perPage
            );
            // Response already has data, page, size, totalElements, totalPages
            // (request interceptor extracts response.data.result)
            const { data, page: pageNum, size, totalElements, totalPages } = response;
            const meta: PaginationMeta = {
                page: pageNum,
                size,
                totalElements,
                totalPages,
            };
            
            if (status === "0") {
                setPendingMeta(meta);
                setListComplex(data);
            } else if (status === "1") {
                setApprovedMeta(meta);
                setListComplexApproved(data);
            }
        } catch (err) {
            handleAxiosStatusCode(err);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 200);
        }
    };

    const getMediaFile = async ($ownerId: string) => {
        try {
            const data = await getMediaFileAPI($ownerId);
            setMediaFiles(data);
        } catch (err) {
            handleAxiosStatusCode(err);
        }
    };

    const onSelectComplex = (complex: Complex, type: string) => {
        setSelectedRequest(complex);
        setCurrentType(type);
        getMediaFile(complex.id);
        setOpenReqDetail(true);
    };

    const handleApprove = async (ids: string[]) => {
        try {
            // TODO: Replace with actual API call
            await approveCplAPI(ids);
            console.log("Approving complexes:", ids);
            toast.success(`Đã phê duyệt ${ids.length} chung cư thành công!`);
            // Refresh the lists
            getComplex("0", pendingFilter, 1, pendingPerPage);
        } catch (err) {
            handleAxiosStatusCode(err);
            toast.error("Phê duyệt thất bại!");
        }
    };

    const handleReject = async (ids: string[], note: string) => {
        try {
            // TODO: Replace with actual API call
            await rejectCplAPI(ids);
            console.log("Rejecting complexes:", ids, note);
            toast.success(`Đã từ chối ${ids.length} chung cư thành công!`);
            // Refresh the lists
            getComplex("0", pendingFilter, 1, pendingPerPage);
        } catch (err) {
            handleAxiosStatusCode(err);
            toast.error("Từ chối thất bại!");
        }
    };

    // 1. Thay đổi trang
    const handlePendingPageChange = (page: number) => {
        const zeroIndexedPage = page - 1; // Convert from 1-indexed to 0-indexed
        getComplex("0", pendingFilter, zeroIndexedPage, pendingPerPage);
    };
    // 2. Thay đổi số bản ghi trên trang
    const handlePendingPerPageChange = (perPage: number) => {
        setPendingPerPage(perPage);
        getComplex("0", pendingFilter, 1, perPage);
    };
    // 3. Áp dụng filter
    const handlePendingFilter = (status: string, filter: FilterCplFormSchema) => {
        setPendingFilter(filter);
        getComplex(status, filter, 1, pendingPerPage);
    };

    // Approved handlers
    const handleApprovedPageChange = (page: number) => {
        const zeroIndexedPage = page - 1; // Convert from 1-indexed to 0-indexed
        getComplex("1", approvedFilter, zeroIndexedPage, approvedPerPage);
    };

    const handleApprovedPerPageChange = (perPage: number) => {
        setApprovedPerPage(perPage);
        getComplex("1", approvedFilter, 1, perPage);
    };

    const handleApprovedFilter = (
        status: string,
        filter: FilterCplFormSchema
    ) => {
        setApprovedFilter(filter);
        getComplex(status, filter, 1, approvedPerPage);
    };

    return (
        <>
            <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                    <TabsList className="mx-6 mt-4 w-fit">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            // onClick={() => {
                            // }}
                        >
                            Yêu cầu cần xét duyệt
                        </TabsTrigger>

                        <TabsTrigger
                            value="approved"
                            // onClick={() => {
                            //     setApprovedFilter({}); // Reset filter về mặc định
                            //     setApprovedPage(1); // Reset về trang 1
                            //     setApprovedFilterKey((prev) => prev + 1); // Force re-render form
                            //     getTaskApproved(orgManage, {}, 1, approvedPerPage);
                            // }}
                        >
                            Đang hoạt động
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="flex-1 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-medium text-slate-600">
                                    Chờ phê duyệt
                                </h3>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">
                                    {pendingMeta.totalElements}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-medium text-slate-600">
                                    Đang hoạt động
                                </h3>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {approvedMeta.totalElements}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-medium text-slate-600">
                                    Tổng cộng
                                </h3>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    {pendingMeta.totalElements + approvedMeta.totalElements}
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="requests" className="flex-1 p-6 flex flex-col">
                        <FilterCplForm onSubmit={handlePendingFilter} type="req"/>
                        <ComplexList
                            requests={listComplex}
                            onSelectRequest={(complex) => onSelectComplex(complex, "pd")}
                            loading={loading}
                            type={"pd"}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onBulkApprove={handleApprove}
                            onBulkReject={handleReject}
                        />
                        {pendingMeta.totalElements > 0 && (
                            <DataPagination
                                meta={pendingMeta}
                                onPageChange={handlePendingPageChange}
                                onPerPageChange={handlePendingPerPageChange}
                            />
                        )}
                        {selectedRequest && currentType === "pd" ? (
                            <ComplexDetail
                                request={selectedRequest}
                                mediaFiles={mediaFiles}
                                open={openReqDetail}
                                setOpen={setOpenReqDetail}
                            />
                        ) : null}
                    </TabsContent>

                    <TabsContent value="approved" className="flex-1 p-6 flex flex-col">
                        <FilterCplForm onSubmit={handleApprovedFilter} type="apd"/>
                        <ComplexList
                            requests={listComplexApproved}
                            onSelectRequest={(complex) => onSelectComplex(complex, "apd")}
                            loading={loading}
                            type={"apd"}
                        />
                        {approvedMeta.totalElements > 0 && (
                            <DataPagination
                                meta={approvedMeta}
                                onPageChange={handleApprovedPageChange}
                                onPerPageChange={handleApprovedPerPageChange}
                            />
                        )}
                        {selectedRequest && currentType === "apd" ? (
                            <ComplexDetail
                                request={selectedRequest}
                                mediaFiles={mediaFiles}
                                open={openReqDetail}
                                setOpen={setOpenReqDetail}
                            />
                        ) : null}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

export default Complex;
