import { create } from "zustand";
import { IUser } from "@/interfaces";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AuthStore {
    user: IUser | null;
    token: string | null;
    login: (user: IUser, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    devtools(
      persist(
        (set) => ({
          user: null,
          token: null,
  
          login: (user: IUser, token: string) => set({ user, token }),
  
          logout: () => set({ user: null, token: null }),
        }),
        {
          name: "auth-storage",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );