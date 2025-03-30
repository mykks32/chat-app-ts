import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

const useAuthInitialization = () => {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
};

export default useAuthInitialization;
