"use client";
import * as React from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./_components/user-nav";
import { IRoom, IUser, IMessage } from "@/interfaces";
import socketService from "@/services/socket.service";

export default function SidebarPage({ selectedUser, room }: { selectedUser: Omit<IUser, "password"> | null, room: IRoom | null }) {

    console.log(" in sidebar page", selectedUser, room)
    const [messages, setMessages] = React.useState<IMessage[]>([])

    const [input, setInput] = React.useState("")
    const inputLength = input.trim().length

    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    const { connectSocket,
        notifyUserJoinedRoom,
        handleReceiveMessages,
        handleSendMessage,
        handleTyping,
        handleReceiveTyping,
        handleJoinRoom,
        handleUserLeaveRoom,
        handleUserLeftRoom,
        disconnectSocket } = socketService

    React.useEffect(() => {
        connectSocket();
        if (room && selectedUser) {
            handleJoinRoom(room.id, selectedUser.id);
            handleReceiveMessages((roomId, messages) => {
                if (roomId === room.id) {
                    setMessages(messages);
                }
            });
        }
    }, [selectedUser, room])

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Scroll to bottom when messages change
    React.useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = () => {
        if (!input.trim() || !room || !selectedUser) return;
        
        handleSendMessage(room.id, input.trim(), selectedUser.id);
        setInput("");
    };

    if (!selectedUser || !room) {
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
                            message.senderId === selectedUser?.id
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
                        // setMessages([...messages, { senderId: selectedUser?.id, content: input }])
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
