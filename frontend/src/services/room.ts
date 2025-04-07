import api from "@/lib/api";

export const createOrGetRoomMessage = async (userId1: string, userId2: string) => {
    const response = await api.post("/rooms", { userId1, userId2 });
    return response.data;
}

export default {
    createOrGetRoomMessage,
}