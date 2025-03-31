"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { IRoom, IUser } from "@/interfaces"
import { useState } from "react"
import SidebarPage from "./page"

export default function Layout({ children }: { children: React.ReactNode }) {

  const [selectedUser, setSelectedUser] = useState<Omit<IUser, "password"> | null>(null)
  const [room, setRoom] = useState<IRoom | null>(null)
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar setSelectedUser={setSelectedUser} setRoom={setRoom} />
        
        {/* Main content area */}
        <main className="flex flex-col gap-4 w-full">
          <SidebarPage selectedUser={selectedUser} room={room} />
        </main>
      </div>
    </SidebarProvider>
  )
}
