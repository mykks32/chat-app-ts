"use client";
import * as React from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./_components/user-nav";
import { IUser } from "@/interfaces";

const users = [
    { name: "Olivia Martin", email: "m@example.com", avatar: "/avatars/01.png" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", avatar: "/avatars/03.png" },
    { name: "Emma Wilson", email: "emma@example.com", avatar: "/avatars/05.png" },
    { name: "Jackson Lee", email: "lee@example.com", avatar: "/avatars/02.png" },
    { name: "William Kim", email: "will@email.com", avatar: "/avatars/04.png" },
]

type User = typeof users[0]

export default function SidebarPage({ selectedUser }: { selectedUser: Omit<IUser, "password"> | null }) {

    
    const [messages, setMessages] = React.useState([
        { role: "agent", content: "Hi, how can I help you today?" },
        { role: "user", content: "Hey, I'm having trouble with my account." },
        { role: "agent", content: "What seems to be the problem?" },
        { role: "user", content: "I can't log in." },
    ])
    
    const [input, setInput] = React.useState("")
    const inputLength = input.trim().length
    
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    
    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    // Scroll to bottom when messages change
    React.useEffect(() => {
        scrollToBottom()
    }, [messages])
    
    if (!selectedUser) {
        return <div className="flex justify-center items-center h-full">No user selected</div>
    }
    
    return (
        <div className="flex flex-col h-full">
            {/* User Info (fixed height) */}
            <div className="flex-none p-4 sticky top-0 bg-gray-300">
                <div className="flex justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <SidebarTrigger className="flex-none" />
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="Image" />
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{selectedUser.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                        </div>
                    </div>
                    <UserNav />
                </div>
            </div>

            {/* Chat Messages (fixed height with scrolling) */}
            <div className="flex-auto overflow-y-auto p-4 space-y-2 h-[calc(100vh-200px)]"> {/* Adjust height calculation */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex w-max max-w-[75%] flex-col gap-2 rounded-2xl px-3 py-2 text-sm",
                            message.role === "user"
                                ? "ml-auto bg-violet-700 text-primary-foreground"
                                : "bg-muted"
                        )}
                    >
                        {message.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field (fixed height) */}
            <div className="flex-none p-4 border-t">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (inputLength === 0) return
                        setMessages([...messages, { role: "user", content: input }])
                        setInput("")
                    }}
                    className="flex w-full items-center space-x-2"
                >
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    <Button type="submit" className="bg-violet-800" size="icon" disabled={inputLength === 0}>
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
