import api from "@/lib/api";
import { IUser } from "@/interfaces";
import { useAuthStore } from "@/store/auth.store";

export const registerUser = async (
  formData: Pick<IUser, "name" | "email" | "password">
) => {
  const response = await api.post("/users/register", formData);
  return response.data;
};

export const loginUser = async (
  formData: Pick<IUser, "email" | "password">
) => {
  const response = await api.post("/users/login", formData);

  const { user, token } = response.data;
  useAuthStore.getState().login(user, token);

  return response.data;
};

export const logoutUser = () => {
  useAuthStore.getState().logout();
  window.location.href = "/login";
};

export const getCurrentUser = async (
  userId: string
): Promise<Omit<IUser, "password">> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getAllUsers = async (): Promise<Omit<IUser, "password">[]> => {
  const response = await api.get("/users");
  return response.data;
};
