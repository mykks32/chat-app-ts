import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use((config) => {
    // Get token from zustand store
    const { token } = useAuthStore.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;