import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import type { Complex } from "@/types/Complex";
import type { listMediaFile } from "@/types/MediaFile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ComponentProps = {
  request: Complex;
  mediaFiles: listMediaFile | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ComplexDetail({
  request,
  mediaFiles,
  open,
  setOpen,
}: ComponentProps) {
  const hasMediaFiles =
    mediaFiles &&
    (mediaFiles.image.length > 0 ||
      mediaFiles.video.length > 0 ||
      (mediaFiles.application && mediaFiles.application.length > 0));

  const getFileInfo = (url: string) => {
    const fileName = url.split("/").pop() || "document";
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return { fileName, extension };
  };

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "txt":
        return "📃";
      default:
        return "📎";
    }
  };

  return (
    <>
      {/* Media Files Dialog */}
      {hasMediaFiles && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Tài liệu đính kèm - {request.complex_name}
              </DialogTitle>
              <DialogDescription>
                Xem các tài liệu hình ảnh, video và file đính kèm
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="images"
                    disabled={mediaFiles.image.length === 0}
                  >
                    Hình ảnh ({mediaFiles.image.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    disabled={mediaFiles.video.length === 0}
                  >
                    Video ({mediaFiles.video.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    disabled={
                      !mediaFiles.application ||
                      mediaFiles.application.length === 0
                    }
                  >
                    Tài liệu ({mediaFiles.application?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="mt-4">
                  {mediaFiles.image.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mediaFiles.image.map((imageUrl, index) => (
                        <div
                          key={`image-${index}`}
                          className="border rounded-lg p-2 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-48 object-cover rounded cursor-pointer"
                            onClick={() => window.open(imageUrl, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Không có hình ảnh
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="mt-4">
                  {mediaFiles.video.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mediaFiles.video.map((videoUrl, index) => (
                        <div
                          key={`video-${index}`}
                          className="border rounded-lg p-2 hover:shadow-md transition-shadow"
                        >
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-64 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Không có video
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  {mediaFiles.application &&
                  mediaFiles.application.length > 0 ? (
                    <div className="space-y-3">
                      {mediaFiles.application.map((docUrl, index) => {
                        const { fileName, extension } = getFileInfo(docUrl);
                        return (
                          <div
                            key={`doc-${index}`}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">
                                {getFileIcon(extension)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate">
                                  {fileName}
                                </p>
                                <p className="text-xs text-slate-500 uppercase">
                                  {extension} file
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {extension === "pdf" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(docUrl, "_blank")}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Xem
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const a = document.createElement("a");
                                  a.href = docUrl;
                                  a.download = fileName;
                                  a.click();
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Tải về
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Không có tài liệu
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
