import api from "@/lib/api";
import { createOrGetRoomMessageSchema } from "@/schemas";

export const createOrGetRoomMessage = async (userId1: string, userId2: string) => {
    const response = await api.post("/chat", { userId1, userId2 });
    return response.data;
}