import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "@/context/AuthContext.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {AlertCircle} from "lucide-react";
import NotFound from "@/layouts/not-found.tsx";

type ComponentProps = {
    children: React.ReactNode;
    permissions?: string[]; // Danh sách permissions được phép truy cập
    requireAll?: boolean; // true: cần tất cả permissions, false: chỉ cần 1 permission
};

export function ProtectedRoute({
                                   children,
                                   permissions = [],
                                   requireAll = false,
                               }: ComponentProps) {
    const {user, hasAnyPermission, hasAllPermissions} = useContext(AuthContext);

    // Chưa đăng nhập -> redirect login
    if (!user) return <Navigate to="/login" replace/>;

    // Không yêu cầu permissions -> cho phép truy cập
    if (permissions.length === 0) return <>{children}</>;

    // Kiểm tra permissions
    const hasAccess = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);

    // Không có quyền -> hiển thị trang Access Denied
    if (!hasAccess) {
        return (
            <NotFound/>
        );
    }

    return <>{children}</>;
}
