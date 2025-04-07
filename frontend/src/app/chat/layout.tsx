"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { IRoom, IUser } from "@/interfaces"
import { useState } from "react"
import SidebarPage from "./page"
import withAuth from "@/hoc/withAuth"

const Layout = () => {

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

export default withAuth(Layout);