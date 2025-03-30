import AppDataSource from "@bootstrap/data-source";
import { Message, Room, User } from "@entity";
import { Socket, Server } from "socket.io";
import { StatusCodes } from "http-status-codes";

const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
} = StatusCodes;

class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public setup() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected");

      this.handleJoinRoom(socket);
      this.handleSendMessage(socket);
      this.handleTyping(socket);
      this.handleLeaveRoom(socket);
      this.handleDisconnect(socket);
    });
  }

  // Handle join room
  private handleJoinRoom(socket: Socket) {
    socket.on("join-room", async (data: { roomId: string; userId: string }) => {
      try {
        const { roomId, userId } = data;

        // Join room
        socket.join(roomId);

        // Get room
        const roomRepository = AppDataSource.getRepository(Room);
        let room = await roomRepository.findOne({
          where: { id: roomId },
        });

        // Check if room exists
        if (!room) {
          // Create room
          room = roomRepository.create({
            id: roomId,
            name: `Room ${roomId}`,
          });
          await roomRepository.save(room);
        }

        // Get recent messages
        const messageRepository = AppDataSource.getRepository(Message);
        const recentMessages = await messageRepository.find({
          where: { roomId },
          relations: ["sender"],
          order: { createdAt: "DESC" },
          take: 20,
        });

        // Send recent messages to client
        socket.emit("room_messages", {
          roomId,
          messages: recentMessages.reverse(),
        });

        // Notify clients in room
        socket.to(roomId).emit("user_joined", {
          userId,
          roomId,
        });

        console.log(`User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room", error);
        socket.emit("error", {
          message: "Error joining room",
        });
      }
    });
  }

  // Handle send message
  private handleSendMessage(socket: Socket) {
    socket.on(
      "send-message",
      async (data: { roomId: string; content: string; senderId: string }) => {
        try {
          const { roomId, content, senderId } = data;

          // get User and Message
          const userRepository = AppDataSource.getRepository(User);
          const messageRepository = AppDataSource.getRepository(Message);

          // Check if user exists
          const user = await userRepository.findOne({
            where: { id: senderId },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Create message
          const newMessage = messageRepository.create({
            roomId,
            content,
            senderId,
          });

          // Save message
          await messageRepository.save(newMessage);

          // Get Message with relations
          const message = await messageRepository.findOne({
            where: { id: newMessage.id },
            relations: ["sender"],
          });

          // Send message to room
          socket.to(roomId).emit("new_message", message);
        } catch (error) {
          console.error("Error sending message", error);
          socket.emit("error", {
            message: "Error sending message",
          });
        }
      }
    );
  }

  // Handle typing
  private handleTyping(socket: Socket) {
    socket.on(
      "typing",
      async (data: {
        roomId: string;
        userId: string;
        name: string;
        isTyping: boolean;
      }) => {
        try {
          const { roomId, userId, name, isTyping } = data;

          // Broadcast typing event to room
          socket.to(roomId).emit("typing", {
            userId,
            name,
            isTyping,
          });
        } catch (error) {
          console.error("Error sending typing indicator", error);
          socket.emit("error", {
            message: "Error sending typing indicator",
          });
        }
      }
    );
  }

  // Handle leave room
  private handleLeaveRoom(socket: Socket) {
    socket.on(
      "leave-room",
      async (data: { userId: string; roomId: string }) => {
        try {
          const { userId, roomId } = data;

          // leave room
          socket.leave(roomId);

          // Notify clients in room
          socket.to(roomId).emit("user_left", {
            userId,
            roomId,
          });

          console.log(`User ${userId} left room ${roomId}`);
        } catch (error) {
          console.error("Error leaving room", error);
          socket.emit("error", {
            message: "Error leaving room",
          });
        }
      }
    );
  }

  // Handle disconnect
  private handleDisconnect(socket: Socket) {
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  }
}

export const socketService = (io: Server) => {
  const service = new SocketService(io);
  service.setup();
};
