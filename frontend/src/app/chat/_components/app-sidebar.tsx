"use client"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import userService from "@/services/auth"
import { IUser } from "@/interfaces"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar({ setSelectedUser }: { setSelectedUser: (user: Omit<IUser, "password">) => void }) {

  const {data: users} = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  })

  
  console.log(users)

  const [activeItem, setActiveItem] = useState<Omit<IUser, "password"> | null>(null)

  const handleUserClick = (user: Omit<IUser, "password">) => {
    setSelectedUser(user)
    setActiveItem(user)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <div className="text-2xl font-bold sticky top-0 text-muted-foreground p-3 bg-muted z-10">
          Chats
        </div>
        <SidebarGroup className="h-full"> 
          <SidebarGroupContent className="h-full overflow-y-auto">
            <SidebarMenu>
              {users?.map((user) => (
                <SidebarMenuItem key={user.id}>
                  <SidebarMenuButton className={`hover:bg-gray-200 py-8 ${activeItem === user ? 'bg-gray-200' : ''}`} onClick={() => handleUserClick(user)}>
                    <div className="flex items-center space-x-4">
                      <Avatar className="size-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Image" />
                        <AvatarFallback className="text-gray-300 text-black">
                          {user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-normal leading-none">{user.name}</p>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
