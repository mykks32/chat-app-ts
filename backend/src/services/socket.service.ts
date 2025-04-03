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

const socketService = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    const handleJoinRoom = (socket: Socket) => {
      socket.on(
        "joinRoom",
        async (data: { roomId: string; userId: string }) => {
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
            }

            // Get all messages of the room
            const messageRepository = AppDataSource.getRepository(Message);
            const messages = await messageRepository.find({
              where: { roomId },
              relations: ["sender"],
              order: { createdAt: "DESC" },
              take: 20,
            });

            // Send recent messages to client
            socket.emit("room_messages", {
              roomId,
              messages: messages.reverse(),
            });
            console.log(`User ${userId} joined room ${roomId}`);
          } catch (error) {
            console.error("Error joining room", error);
            socket.emit("error", {
              message: "Error joining room",
            });
          }
        }
      );
    };

    const handleSendMessage = (socket: Socket) => {
      socket.on(
        "sendMessage",
        async (data: { roomId: string; content: string; senderId: string }) => {
          try {
            const { roomId, content, senderId } = data;

            // Create message
            const messageRepository = AppDataSource.getRepository(Message);
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
            io.to(roomId).emit("new_message", message);

            console.log(`Message sent to room ${roomId}`);
          } catch (error) {
            console.error("Error sending message", error);
            socket.emit("error", {
              message: "Error sending message",
            });
          }
        }
      );
    };

    const handleDisconnect = (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
      });
    };

    handleJoinRoom(socket);
    handleSendMessage(socket);
    handleDisconnect(socket);
  });
};

export default socketService;
