import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
