import { io, Socket } from "socket.io-client";
import { getCookie } from "@/lib/session";

const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
let socket: Socket;

export const connectSocket = async () => {
  const token = await getCookie("chat-token");
  socket = io(SOCKET_URL!, {
    autoConnect: true,
    auth: { token },
  });

  socket.connect();
  socket.on("connect", () => console.log("Connected to socket server"));

  return socket;
};

export { socket }; 

export const joinRoom = (roomId: string, userId: string) => {
  if (socket) {
    socket.emit("joinRoom", { roomId, userId });
  }
};

export const onRoomMessages = (
  callback: (data: { roomId: string; messages: any[] }) => void
) => {
  if (socket) {
    socket.on("room_messages", callback);
  }
};

export const sendMessage = (data: {
  roomId: string;
  content: string;
  senderId: string;
}) => {
  if (socket) {
    socket.emit("sendMessage", data);
  }
};

export const onNewMessage = (callback: (message: any) => void) => {
  if (socket) {
    socket.on("new_message", callback);
  }
};

export const onError = (callback: (error: { message: string }) => void) => {
  if (socket) {
    socket.on("error", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const removeAllListeners = () => {
  if (socket) {
    socket.off("room_messages");
    socket.off("new_message");
    socket.off("error");
  }
};

export default {
  connectSocket,
  joinRoom,
  onRoomMessages,
  sendMessage,
  onNewMessage,
  onError,
  disconnectSocket,
  removeAllListeners,
};
