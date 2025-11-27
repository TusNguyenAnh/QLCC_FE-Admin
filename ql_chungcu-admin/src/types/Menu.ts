import {
    Building2,
    Home,
    LogOut, type LucideIcon,
    UserCog,
} from "lucide-react";

export interface MenuItem {
    id: number;
    title: string;
    url: string;
    icon: LucideIcon;
    child: MenuItem[];
    permissions?: string[]; // Required permissions (ANY logic)
    requireAll?: boolean; // If true, use ALL logic instead of ANY
}

/**
 * Cấu hình menu items cho sidebar
 * permissions: Danh sách quyền cần có (OR logic mặc định)
 * requireAll: true = Cần tất cả quyền (AND logic)
 */
export const menuItems: MenuItem[] = [
    {
        id: 1,
        title: "Trang chủ",
        url: "/page/dashboard",
        icon: Home,
        child: [],
        // Không cần permissions = ai cũng vào được
    },
    // {
    //   id: 2,
    //   title: "Quản lý cơ cấu tổ chức",
    //   url: "/page/org",
    //   icon: Network,
    //   child: [],
    //   permissions: ["view:organization"],
    // },
    {
        id: 2,
        title: "Quản lý truy cập",
        url: "/page/authori",
        icon: UserCog,
        child: [],
        permissions: ["view:user", "view:role", "view:permission"],
        requireAll: false,
    },

    {
        id: 3,
        title: "Quản lý chung cư",
        url: "/page/complex",
        icon: Building2,
        child: [],
        permissions: ["view:complex", "manage:complex", "review:complex"],
    },


    {
        id: 19999,
        title: "Đăng xuất",
        url: "#",
        icon: LogOut,
        child: []
    }
];
