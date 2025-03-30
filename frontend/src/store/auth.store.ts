import { create } from "zustand";
import { IUser } from "@/interfaces";
import { devtools } from "zustand/middleware";
import userService from "@/services/auth";
import { getCookie, setCookie, removeCookie } from "@/lib/session";

interface AuthStore {
  user: Omit<IUser, "password"> | null;
  loading: boolean;
  login: (user: Omit<IUser, "password">, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      loading: true,

      login: async (user: Omit<IUser, "password">, token: string) => {
        if (token) {
          await setCookie("chat-token", token);
        }
        set({ user });
      },

      logout: async () => {
        await removeCookie("chat-token");
        set({ user: null });
      },
      
      initialize: async () => {
        const token = await getCookie("chat-token");
        if (!token) {
          set({ user: null, loading: false });
          return;
        }
        try {
          const user = await userService.getCurrentUser();
          if (user) {
            await setCookie("user", JSON.stringify(user));
            set({ user, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          set({ user: null, loading: false });
        }
      }
    })
  )
);