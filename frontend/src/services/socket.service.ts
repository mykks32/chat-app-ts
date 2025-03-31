import { IMessage } from "@/interfaces";
import { io, Socket } from "socket.io-client";
import { getCookie } from "@/lib/session";

// Create socket as a singleton
let socket: Socket | null = null;

// Initialize socket
const initializeSocket = async () => {
  const token = await getCookie("chat-token");
  socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    autoConnect: false,
    auth: {
      token: token,
    },
  });
};

// Ensure socket is initialized before use
const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    await initializeSocket();
  }
  return socket!;
};

// Handle connect socket
const connectSocket = async () => {
  const s = await getSocket();
  s.connect();
  s.on("connect", () => {
    console.log("Connected to socket server");
  });
};

// Notify user joined room
const notifyUserJoinedRoom = async () => {
  const s = await getSocket();
  s.on("user_joined", ({ userId, roomId }) => {
    console.log(`User ${userId} joined room ${roomId}`);
  });
};

// Handle receive messages
const handleReceiveMessages = async (callback: (roomId: string, messages: IMessage[]) => void) => {
  const s = await getSocket();
  s.on("room_messages", (roomId: string, messages: IMessage[]) => {
    callback(roomId, messages);
  });
};

// Handle send message
const handleSendMessage = async (roomId: string, content: string, senderId: string) => {
  const s = await getSocket();
  s.emit("send-message", { roomId, content, senderId });
};

// Handle new message
const handleNewMessage = async (callback: (message: IMessage) => void) => {
  const s = await getSocket();
  s.on("new-message", (message: IMessage) => {
    callback(message);
  });
};

// Handle typing
const handleTyping = async (roomId: string, userId: string, name: string, isTyping: boolean) => {
  const s = await getSocket();
  s.emit("typing", { roomId, userId, name, isTyping });
};

// Receive typing
const handleReceiveTyping = async (callback: (userId: string, name: string, isTyping: boolean) => void) => {
  const s = await getSocket();
  s.on("typing", ({ userId, name, isTyping }) => {
    callback(userId, name, isTyping);
  });
};

// Handle join room
const handleJoinRoom = async (roomId: string, userId: string) => {
  const s = await getSocket();
  s.emit("join-room", { roomId, userId });
};

// Handle user leaving room
const handleUserLeaveRoom = async (userId: string, roomId: string) => {
  const s = await getSocket();
  s.emit("leave-room", { userId, roomId });
};

// Handle user left room
const handleUserLeftRoom = async (callback: (userId: string, roomId: string) => void) => {
  const s = await getSocket();
  s.on("user_left", ({ userId, roomId }) => {
    callback(userId, roomId);
  });
};

// Handle disconnect socket
const disconnectSocket = async () => {
  const s = await getSocket();
  s.disconnect();
};

// Remove all socket listeners
const removeSocketListeners = async () => {
  const s = await getSocket();
  s.off("connect");
  s.off("disconnect");
  s.off("user_joined");
  s.off("room_messages");
  s.off("new-message");
  s.off("typing");
  s.off("user_left");
};

// Export all functions together
const socketService = {
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
  handleNewMessage,
  removeSocketListeners,
};

export default socketService;