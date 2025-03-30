import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { socketService } from "@services";

let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Setup socket controllers
  socketService(io);

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
