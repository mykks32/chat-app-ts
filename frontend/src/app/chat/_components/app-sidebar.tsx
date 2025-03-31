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
import { useMutation, useQuery } from "@tanstack/react-query"
import userService from "@/services/auth"
import roomService from "@/services/room"
import { IRoom, IUser } from "@/interfaces"
import { useAuthStore } from "@/store/auth.store"


export function AppSidebar({ setSelectedUser, setRoom }: { setSelectedUser: (user: Omit<IUser, "password">) => void, setRoom: (room: IRoom) => void }) {
  const { user: currentUser } = useAuthStore.getState()
  const {data: users} = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  })

  const mutate = useMutation({
    mutationFn: (userId: string) => {
      if (!currentUser) throw new Error("User not authenticated");
      return roomService.createOrGetRoomMessage(currentUser.id, userId);
    },
    onSuccess: (data) => {
      setRoom(data.data)
    },
  })

  const [activeItem, setActiveItem] = useState<Omit<IUser, "password"> | null>(null)

  const handleUserClick = (user: Omit<IUser, "password">) => {
    setSelectedUser(user)
    setActiveItem(user)
    mutate.mutate(user.id)
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
                        <AvatarFallback className="text-black">
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
