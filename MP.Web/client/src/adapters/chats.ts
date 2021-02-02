import { Chat } from "../types/interfaces";

export const createChat = (data: any): Chat | null => {
  if (!data) {
    return null;
  }
  return {
    id: parseInt(data.ChatRoomId),
    name: data.UserName,
    lastMessageText: data.LastMessage,
    lastMessageDateTime: data.LastDateTime
  };
};