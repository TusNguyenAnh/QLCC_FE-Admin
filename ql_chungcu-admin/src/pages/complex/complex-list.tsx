import { Card } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Complex } from "@/types/Complex";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type ComponentProps = {
  requests: Complex[];
  onSelectRequest: (request: Complex) => void;
  loading: boolean;
  type: string;
  onApprove?: (ids: string[]) => void;
  onReject?: (ids: string[], note: string) => void;
  onBulkApprove?: (ids: string[]) => void;
  onBulkReject?: (ids: string[], note: string) => void;
};

export default function ComplexList({
  requests,
  onSelectRequest,
  loading,
  type,
  onApprove,
  onReject,
  onBulkApprove,
  onBulkReject,
}: ComponentProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedComplex, setSelectedComplex] = useState<Complex | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkApproveDialog, setShowBulkApproveDialog] = useState(false);
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [bulkRejectNote, setBulkRejectNote] = useState("");

  const handleApproveClick = (e: React.MouseEvent, complex: Complex) => {
    e.stopPropagation();
    setSelectedComplex(complex);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (e: React.MouseEvent, complex: Complex) => {
    e.stopPropagation();
    setSelectedComplex(complex);
    setShowRejectDialog(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedComplex && onApprove) {
      setSubmitting(true);
      try {
        await onApprove([selectedComplex.id]);
        setShowApproveDialog(false);
        setSelectedComplex(null);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedComplex && onReject && rejectNote.trim()) {
      setSubmitting(true);
      try {
        await onReject([selectedComplex.id], rejectNote);
        setShowRejectDialog(false);
        setSelectedComplex(null);
        setRejectNote("");
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApproveClick = () => {
    if (selectedIds.length > 0) {
      setShowBulkApproveDialog(true);
    }
  };

  const handleBulkRejectClick = () => {
    if (selectedIds.length > 0) {
      setShowBulkRejectDialog(true);
    }
  };

  const handleConfirmBulkApprove = async () => {
    if (onBulkApprove && selectedIds.length > 0) {
      setSubmitting(true);
      try {
        await onBulkApprove(selectedIds);
        setShowBulkApproveDialog(false);
        setSelectedIds([]);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleConfirmBulkReject = async () => {
    if (onBulkReject && selectedIds.length > 0 && bulkRejectNote.trim()) {
      setSubmitting(true);
      try {
        await onBulkReject(selectedIds, bulkRejectNote);
        setShowBulkRejectDialog(false);
        setSelectedIds([]);
        setBulkRejectNote("");
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            Không có dữ liệu
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {type === "pd"
              ? "Không có yêu cầu nào cần xét duyệt"
              : "Không có chung cư nào đang hoạt động"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Toolbar */}
      {type === "pd" &&
        onBulkApprove &&
        onBulkReject &&
        requests.length > 0 && (
          <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={
                  selectedIds.length === requests.length && requests.length > 0
                }
                onCheckedChange={toggleSelectAll}
                aria-label="Chọn tất cả"
              />
              <span className="text-sm font-medium text-slate-700">
                {selectedIds.length > 0
                  ? `Đã chọn ${selectedIds.length} chung cư`
                  : "Chọn tất cả"}
              </span>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkApproveClick}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Phê duyệt ({selectedIds.length})
                </Button>
                <Button
                  onClick={handleBulkRejectClick}
                  size="sm"
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Từ chối ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        )}

      <div className="flex-1 overflow-y-auto space-y-3 mb-6">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="p-4 hover:shadow-md transition-shadow border-slate-200"
          >
            <div className="flex items-start gap-4">
              {/* Checkbox for bulk selection */}
              {type === "pd" && onBulkApprove && onBulkReject && (
                <div className="pt-1">
                  <Checkbox
                    checked={selectedIds.includes(request.id)}
                    onCheckedChange={() => toggleSelectOne(request.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chọn ${request.complex_name}`}
                  />
                </div>
              )}
              {/* Left Section - Main Info */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectRequest(request)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <h3 className="text-base font-semibold text-slate-900">
                        {request.complex_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="h-3 w-3" />
                      <span>{request.address}</span>
                    </div>
                  </div>
                  {type === "pd" && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                      Chờ duyệt
                    </span>
                  )}
                  {type === "apd" && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                      Hoạt động
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>
                      <strong>{request.total_building}</strong> tòa
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    <span>
                      <strong>{request.total_apartment}</strong> căn
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{request.name_contact}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{request.phone_contact}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{request.email_contact}</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons (only for pending) */}
              {type === "pd" && onApprove && onReject && (
                <div className="flex flex-col gap-2 ml-auto">
                  <Button
                    onClick={(e) => handleApproveClick(e, request)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 h-8 px-3"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Duyệt
                  </Button>
                  <Button
                    onClick={(e) => handleRejectClick(e, request)}
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận phê duyệt</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn phê duyệt chung cư{" "}
              <strong>{selectedComplex?.complex_name}</strong> không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setSelectedComplex(null);
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận phê duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận từ chối</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối chung cư{" "}
              <strong>{selectedComplex?.complex_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reject-note">
                Lý do từ chối <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reject-note"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setSelectedComplex(null);
                setRejectNote("");
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={submitting || !rejectNote.trim()}
              variant="destructive"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approve Confirmation Dialog */}
      <Dialog
        open={showBulkApproveDialog}
        onOpenChange={setShowBulkApproveDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận phê duyệt hàng loạt</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn phê duyệt{" "}
              <strong>{selectedIds.length}</strong> chung cư đã chọn không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkApproveDialog(false);
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmBulkApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting
                ? "Đang xử lý..."
                : `Phê duyệt ${selectedIds.length} chung cư`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Confirmation Dialog */}
      <Dialog
        open={showBulkRejectDialog}
        onOpenChange={setShowBulkRejectDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận từ chối hàng loạt</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối cho{" "}
              <strong>{selectedIds.length}</strong> chung cư đã chọn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="bulk-reject-note">
                Lý do từ chối <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bulk-reject-note"
                value={bulkRejectNote}
                onChange={(e) => setBulkRejectNote(e.target.value)}
                placeholder="Nhập lý do từ chối chung..."
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkRejectDialog(false);
                setBulkRejectNote("");
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmBulkReject}
              disabled={submitting || !bulkRejectNote.trim()}
              variant="destructive"
            >
              {submitting
                ? "Đang xử lý..."
                : `Từ chối ${selectedIds.length} chung cư`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
