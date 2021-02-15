import { Chat, ReduxEntity, User } from '../types/interfaces';
import { ChatDto, UserDto } from '../types/dto';

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
      name: data[i].ChatRoomName,
      isGroup: data[i].IsGroup,
      lastMessageText: data[i].LastMessage,
      lastMessageDateTime: data[i].LastDateTime,
      users: data[i].Users.map((item: UserDto) =>({
        id: item.Id,
        name: item.UserName
      }))
    }

    result.allIds.push(data[i].ChatRoomId);
  }

  return result;
}

export const createUsersFromChats = (data: ChatDto[]): ReduxEntity<User> => {
  const result = {
    byId: {} as {[key: string]: User},
    allIds: [] as unknown as string[]
  };

  if (!data) {
    return result;
  }

  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < data[i].Users.length; j++) {
      const id = data[i].Users[j].Id;

      if(result.allIds.includes(id)) {
        continue;
      }

      result.byId[id] = {
        id: data[i].Users[j].Id,
        name: data[i].Users[j].UserName,
      }
      result.allIds.push(id);
    }
  }

  return result;
}