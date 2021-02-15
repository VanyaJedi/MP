import { UserDto } from "../types/dto";
import { User } from "../types/interfaces";

export const createUser = (data: UserDto): User | null => {
  if (!data) {
    return null;
  }
  return {
    id: data.Id,
    email: data.Email,
    name: data.UserName,
    avatar: data.Image,
  };
};