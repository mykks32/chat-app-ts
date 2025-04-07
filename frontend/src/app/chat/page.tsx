"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import SidebarPage from "./_components/chat-room"
import { IRoom, IUser } from "@/interfaces"
import { useAuthStore } from "@/store/auth.store"

const Page = () => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<Omit<IUser, "password"> | null>(null)
  const [room, setRoom] = useState<IRoom | null>(null)
  
  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

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

export default Page
