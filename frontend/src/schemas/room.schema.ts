import { z } from "zod";

// Validation schema for creating or fetching room messages
export const createOrGetRoomMessageSchema = z.object({
  // Body schema for userId1 and userId2
  body: z.object({
    userId1: z
      .string()
      .uuid("Invalid userId1 format")
      .min(1, "userId1 is required"),
    userId2: z
      .string()
      .uuid("Invalid userId2 format")
      .min(1, "userId2 is required"),
  }),
})