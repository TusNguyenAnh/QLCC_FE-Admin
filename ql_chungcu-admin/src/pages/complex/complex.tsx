import FilterCplForm, {
  type FilterCplFormSchema,
} from "@/pages/complex/filter-form-complex.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type { PaginationMeta } from "@/types/Pagination.ts";
import { useState } from "react";
import {approveCplAPI, filterComplexAPI, rejectCplAPI} from "@/apis/complexAPI.ts";
import { handleAxiosStatusCode } from "@/utils/request";
import { DataPagination } from "@/layouts/pagination/data-pagination.tsx";
import type { Complex } from "@/types/Complex.ts";
import { getMediaFileAPI } from "@/apis/mediaFileAPI.ts";
import type { listMediaFile } from "@/types/MediaFile.ts";
import ComplexList from "@/pages/complex/complex-list.tsx";
import ComplexDetail from "@/pages/complex/complex-detail.tsx";
import { toast } from "sonner";

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
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  });
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPerPage, setPendingPerPage] = useState(50);
  const [pendingFilter, setPendingFilter] = useState<FilterCplFormSchema>({});

  // Pagination states for approved requests
  const [approvedMeta, setApprovedMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  });
  const [approvedPage, setApprovedPage] = useState(1);
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
      if (status === "0") {
        setPendingMeta(response.meta);
        setListComplex(response.data);
      } else if (status === "1") {
        setApprovedMeta(response.meta);
        setListComplexApproved(response.data);
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
      getComplex("0", pendingFilter, pendingPage, pendingPerPage);
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
      getComplex("0", pendingFilter, pendingPage, pendingPerPage);
    } catch (err) {
      handleAxiosStatusCode(err);
      toast.error("Từ chối thất bại!");
    }
  };

  // 1. Thay đổi trang
  const handlePendingPageChange = (page: number) => {
    setPendingPage(page);
    getComplex("0", pendingFilter, page, pendingPerPage);
  };
  // 2. Thay đổi số bản ghi trên trang
  const handlePendingPerPageChange = (perPage: number) => {
    setPendingPerPage(perPage);
    setPendingPage(1);
    getComplex("0", pendingFilter, 1, perPage);
  };
  // 3. Áp dụng filter
  const handlePendingFilter = (status: string, filter: FilterCplFormSchema) => {
    setPendingFilter(filter);
    setPendingPage(1);
    getComplex(status, filter, 1, pendingPerPage);
  };

  // Approved handlers
  const handleApprovedPageChange = (page: number) => {
    setApprovedPage(page);
    getComplex("1", approvedFilter, page, approvedPerPage);
  };

  const handleApprovedPerPageChange = (perPage: number) => {
    setApprovedPerPage(perPage);
    setApprovedPage(1);
    getComplex("1", approvedFilter, 1, perPage);
  };

  const handleApprovedFilter = (
    status: string,
    filter: FilterCplFormSchema
  ) => {
    setApprovedFilter(filter);
    setApprovedPage(1);
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
                  {pendingMeta.total}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-sm font-medium text-slate-600">
                  Đang hoạt động
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {approvedMeta.total}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-sm font-medium text-slate-600">
                  Tổng cộng
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {pendingMeta.total + approvedMeta.total}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="flex-1 p-6 flex flex-col">
            <FilterCplForm onSubmit={handlePendingFilter} type="req" />
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
            {pendingMeta.total > 0 && (
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
            <FilterCplForm onSubmit={handleApprovedFilter} type="apd" />
            <ComplexList
              requests={listComplexApproved}
              onSelectRequest={(complex) => onSelectComplex(complex, "apd")}
              loading={loading}
              type={"apd"}
            />
            {approvedMeta.total > 0 && (
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
