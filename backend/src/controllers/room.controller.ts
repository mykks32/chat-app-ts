import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppDataSource from "@bootstrap/data-source";
import { Message, Room, User } from "@entity";
import { createOrGetRoomMessageSchema } from "@schemas";
import { z } from "zod";

const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
} = StatusCodes;

export const createOrGetRoomMessage = async (req: Request, res: Response) => {
  try {
    createOrGetRoomMessageSchema.parse({
      body: req.body,
    });

    const { userId1, userId2 } = req.body;

    // Get User Repository
    const userRepository = AppDataSource.getRepository(User);

    // Get User 1
    const user1 = await userRepository.findOne({
      where: {
        id: userId1,
      },
    });

    // Get User 2
    const user2 = await userRepository.findOne({
      where: {
        id: userId2,
      },
    });

    // Check if users exist
    if (!user1 || !user2) {
      return res.status(BAD_REQUEST).json({
        message: "User not found",
      });
    }

    const roomId = [user1.id, user2.id].sort().join("-");

    // Check if room already exists
    const roomRepository = AppDataSource.getRepository(Room);
    const room = await roomRepository.findOne({
      where: {
        name: roomId,
      },
    });

    if (!room) {
      // Create Room
      const room = roomRepository.create({
        name: roomId,
      });
      await roomRepository.save(room);
    }

    // Get Room Message for the Room
    // const messageRepository = AppDataSource.getRepository(Message);
    // const limit = parseInt(req.query.limit as string) || 10;
    // const offset = parseInt(req.query.offset as string) || 0;

    // const messages = await messageRepository.find({
    //   where: {
    //     roomId: room.id,
    //   },
    //   relations: ["sender"],
    //   order: {
    //     createdAt: "DESC",
    //   },
    //   skip: offset,
    //   take: limit,
    // });

    // Response
    return res.status(OK).json({
      message: "Room message fetched successfully",
      data: room,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(BAD_REQUEST).json({
        message: error.errors[0].message,
      });
    }
    console.error("Error creating room", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Error creating room",
    });
  }
};
