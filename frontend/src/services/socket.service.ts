import { IMessage } from "@/interfaces";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  autoConnect: false,
});


// handle connect socket
export const connectSocket = () => {
    socket.connect();
    socket.on("connect", ()=> {
        console.log("Connected to socket server");
    })
}

// Notify user joined room
export const notifyUserJoinedRoom = (): void => {
    socket.on("user_joined", ({userId, roomId}) => {
        console.log(`User ${userId} joined room ${roomId}`);
    })
}

// Handle receive messages
export const handleReceiveMessages = (callback: (roomId: string, messages: IMessage[]) => void) => {
    socket.on("room_messages", (roomId: string, messages: IMessage[]) => {
        callback(roomId, messages);
    })
}

// Handle send message
export const handleSendMessage = (roomId: string, content: string, senderId: string): void => {
    socket.emit("send-message", { roomId, content, senderId });
}

// Handle typing
export const handleTyping = (roomId: string, userId: string, name: string, isTyping: boolean): void => {
    socket.emit("typing", { roomId, userId, name, isTyping });
}

// Receive typing
export const handleReceiveTyping = (callback: (userId: string, name: string, isTyping: boolean) => void) => {
    socket.on("typing", ({userId, name, isTyping}) => {
        callback(userId, name, isTyping);
    })
}

// handle join room
export const handleJoinRoom = (roomId: string, userId: string): void => {
    socket.emit("join-room", { roomId, userId });
}

// Handle user leaving room
export const handleUserLeaveRoom = (userId: string, roomId: string): void => {
    socket.emit("leave-room", { userId, roomId });
}

// Handle user left room
export const handleUserLeftRoom = (callback: (userId: string, roomId: string)=> void) => {
    socket.on("user_left", ({userId, roomId}) => {
        callback(userId, roomId);
    })
}


// handle disconnect socket
export const disconnectSocket = (): void => {
    socket.disconnect();
    socket.on("disconnect", ()=> {
        console.log("Disconnected from socket server");
    })
}

export default {
    connectSocket,
    notifyUserJoinedRoom,
    handleReceiveMessages,
    handleSendMessage,
    handleTyping,
    handleReceiveTyping,
    handleJoinRoom,
    handleUserLeaveRoom,
    handleUserLeftRoom,
    disconnectSocket,
};
