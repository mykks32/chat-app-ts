// Layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content area */}
        <main className="flex flex-col gap-4 w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
