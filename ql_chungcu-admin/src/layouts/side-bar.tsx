"use client"

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../components/ui/collapsible"
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem, SidebarProvider, SidebarTrigger
} from "../components/ui/sidebar.tsx";
import {
    ChevronRight, LogOut, Network,
    UserCog,
} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {logoutUser} from "@/apis/authAPI.ts";
import {handleAxiosStatusCode} from "@/utils/request.ts";
import {AuthContext} from "@/context/AuthContext.tsx";

const items = [
    {
        id: 1,
        title: "Quản lý cơ cấu tổ chức",
        url: "/page/org",
        icon: Network,
        child: []
    },
    {
        id: 2,
        title: "Quản lý truy cập",
        url: "/page/authori",
        icon: UserCog,
        child: []
    },

    {
        id: 19999,
        title: "Đăng xuất",
        url: "#",
        icon: LogOut,
        child: []
    }
]

export default function SidebarCus() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logoutUser();
            // toast.success("Đăng nhập thành công!");
            setUser(null);
            navigate("/login");
        } catch (err) {
            handleAxiosStatusCode(err);
        }
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <div className="flex items-center justify-between">
                            <SidebarGroupLabel hidden={open}>MBS
                            </SidebarGroupLabel>
                            <SidebarTrigger className="p-4" onClick={() => setOpen(prev => !prev)}>
                            </SidebarTrigger>
                        </div>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <Collapsible className="group/collapsible grp" key={item.id}>
                                        <SidebarMenuItem className="mb-1.5">
                                            <CollapsibleTrigger asChild>
                                                {item.title === "Đăng xuất" ?
                                                    (
                                                        <SidebarMenuButton
                                                            className="flex justify-between cursor-pointer"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleLogout();
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <item.icon className="size-4 mr-1.5"/>
                                                                <span
                                                                    className={open ? "hidden" : "fadeIn block opacity-1"}>{item.title}</span>
                                                            </div>
                                                        </SidebarMenuButton>
                                                    ) : (
                                                        <Link to={item.url}>
                                                            <SidebarMenuButton className="flex justify-between">
                                                                <div className={"flex items-center"}>
                                                                    <item.icon className="size-4 mr-1.5"/>
                                                                    <span
                                                                        className={open ? "hidden" : "fadeIn block opacity-1"}>{item.title}</span>
                                                                </div>

                                                                {item.child.length > 0 && (
                                                                    <ChevronRight className="chevron-rotate"/>)}
                                                            </SidebarMenuButton>
                                                        </Link>
                                                    )}
                                            </CollapsibleTrigger>
                                            {item.child.length > 0 && (
                                                <CollapsibleContent className="CollapsibleContent">
                                                    <SidebarMenuSub>
                                                        {item.child.map((itemChild) => (
                                                            <SidebarMenuSubItem className="mt-1" key={itemChild.id}>
                                                                <Link to={itemChild.url}>
                                                                    <SidebarMenuButton
                                                                        className="flex justify-between">
                                                                        <div className="flex items-center">
                                                                            <itemChild.icon className="size-4 mr-1.5"/>
                                                                            <span
                                                                                className={open ? "hidden" : "fadeIn block opacity-1"}>{itemChild.title}</span>
                                                                        </div>
                                                                    </SidebarMenuButton>
                                                                </Link>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            )}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}


