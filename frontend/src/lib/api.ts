import axios from "axios";

const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use((config) => {
    // TODO: Add token to request header form zustand store
    return config;
});

export default api;