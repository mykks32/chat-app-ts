import axios from "axios";
import { getCookie, removeCookie } from "./session";
import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Get token from zustand store
    const token = await getCookie("chat-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // If the response is successful, return it as is
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear the cookie
      await removeCookie("chat-token");

      // Redirect to login or perform any other action
      const router = useRouter();
      router.push("/login"); // Adjust this to match your login route

      console.error("Token expired or invalid. Redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default api;
