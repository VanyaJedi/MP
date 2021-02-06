import { Chat, ReduxEntity } from '../types/interfaces';
import { ChatDto } from '../types/dto';

export const  createChats = (data: ChatDto[]): ReduxEntity<Chat> => {
  const result = {
    byId: {} as {[key: number]: Chat},
    allIds: [] as unknown as number[]
  };
  if (!data) {
    return result;
  }

  for(let i = 0; i < data.length; i++){
    if(result.allIds.includes(data[i].ChatRoomId)) {
      continue;
    }

    result.byId[data[i].ChatRoomId] = {
      id: data[i].ChatRoomId,
      name: data[i].UserName,
      lastMessageText: data[i].LastMessage,
      lastMessageDateTime: data[i].LastDateTime,
    }

    result.allIds.push(data[i].ChatRoomId);
  }

  return result;
}