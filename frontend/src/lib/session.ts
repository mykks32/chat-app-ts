"use server";

import { cookies } from "next/headers";

export const setCookie = async (name: string, value: string, options: any = {}) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const removeCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
