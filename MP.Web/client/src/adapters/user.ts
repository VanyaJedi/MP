import { User } from "../types/interfaces";

export const createUser = (data: any): User | null => {
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    name: data.DisplayName,
    avatar: data.image,
  };
};