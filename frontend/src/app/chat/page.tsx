"use client";
import * as React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./_components/user-nav";
import { IRoom, IUser, IMessage } from "@/interfaces";
import socketService from "@/services/socket.service";
import { Socket } from "socket.io-client";

export default function ChatRoom({ selectedUser, room }: { 
  selectedUser: Omit<IUser, "password"> | null, 
  room: IRoom | null 
}) {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const {
    connectSocket,
    joinRoom,
    onRoomMessages,
    sendMessage,
    onNewMessage,
    disconnectSocket,
    removeAllListeners,
  } = socketService;

  // Connect to socket and setup listeners
  React.useEffect(() => {
    const initSocket = async () => {
      const socket = await connectSocket();
      setSocket(socket);
    };
    initSocket();
  }, [selectedUser, room, connectSocket]);

  React.useEffect(() => {
    if (socket && room && selectedUser) {
      joinRoom(room?.id, selectedUser?.id);
    }
  }, [socket, room, selectedUser, joinRoom]);

  React.useEffect(() => {
    if (socket) {
      onRoomMessages((data) => {
        console.log("new messages received of the room", data);
        if (data.roomId === room?.id) {
          setMessages(data.messages);
        }
      });
    }
  }, [socket, onRoomMessages, room?.id]);

  React.useEffect(() => {
    if (socket) {
      onNewMessage((message) => {
        console.log("new message received", message);
        if (message.roomId === room?.id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, [socket, onNewMessage, room?.id]);

  React.useEffect(() => {
    return () => {
      removeAllListeners();
      disconnectSocket();
    };
  }, [removeAllListeners, disconnectSocket]);
  

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && room?.id && selectedUser?.id) {
      console.log("Sending message:", {
        roomId: room.id,
        content: input,
        senderId: selectedUser.id,
      });
      sendMessage({
        roomId: room.id,
        content: input,
        senderId: selectedUser.id,
      });
      setInput("");
    }
  };

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (!selectedUser || !room) {
    return (
      <div className="flex justify-center items-center h-full">
        No user selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* User Info Header */}
      <div className="flex-none p-4 sticky top-0 bg-gray-300">
        <div className="flex justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="flex-none" />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {selectedUser.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>
          </div>
          <UserNav />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-auto overflow-y-auto p-4 space-y-2 h-[calc(100vh-200px)]">
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`}
            className={cn(
              "flex w-max max-w-[75%] flex-col gap-2 rounded-2xl px-3 py-2 text-sm",
              message.senderId === selectedUser.id
                ? "ml-auto bg-violet-700 text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-none p-4 border-t">
        <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit" 
            className="bg-violet-800" 
            size="icon" 
            disabled={!input.trim()}
          >
            <Send />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}