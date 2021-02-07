import { Message, ReduxEntity, User } from "../types/interfaces";
import { MessageDto } from '../types/dto';
import { MessageStatus } from "../constants";

export const createMessages = (chatId: number, data: MessageDto[]): ReduxEntity<Message> => {
  const result = {
    byId: {} as {[key: number]: Message},
    allIds: [] as unknown as number[]
  };
  if (!data) {
    return result;
  }

  for(let i = 0; i < data.length; i++){
    if(result.allIds.includes(data[i].MessageId)) {
      continue;
    }

    result.byId[data[i].MessageId] = {
      messageId: data[i].MessageId,
      userId: data[i].UserId,
      chatId: chatId,
      content: data[i].MessageText,
      dateTime: data[i].DateTime,
      status: MessageStatus.SUCCESS
    }

    result.allIds.push(data[i].MessageId); 
  }

  

  return result;

}

export const createUsersFromMessages = (data: MessageDto[]): ReduxEntity<User> => {
  const result = {
    byId: {} as {[key: string]: User},
    allIds: [] as unknown as string[]
  };

  if (!data) {
    return result;
  }

  for(let i = 0; i < data.length; i++){
    if(result.allIds.includes(data[i].UserId)) {
      continue;
    }

    result.byId[data[i].UserId] = {
      id: data[i].UserId,
      name: data[i].UserName,
    }
    result.allIds.push(data[i].UserId);
  }

  return result;
}