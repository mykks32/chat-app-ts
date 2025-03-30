"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthInitialization from "@/hooks/use-auth-initalize";
const queryClient = new QueryClient();

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInitialization();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
