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

  // Query parameters for limit and offset
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val > 0,
        "Limit must be a positive number"
      ),
    offset: z
      .string()
      .optional()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val >= 0,
        "Offset must be a non-negative number"
      ),
  }),
});
