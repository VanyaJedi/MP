import { Message, ChatMessages } from "../types/interfaces";

export const createChatMessages = (chatId: number, data: any): ChatMessages | null => {
  if (!data) {
    return null;
  }
  let chatName;
  if (data.length) {
    chatName = data[0].ChatRoomName;
  }

  const messages: Message[] = data.map((item: any) => ({
    user: {
      id: item.UserId,
      name: item.UserName
    },
    content: item.MessageText,
    dateTime: item.DateTime

  }));

  return {
    chatId,
    chatName,
    messages
  };
};


export const CreateContactsFromMessages = (data: any): any => {
  if (!data) {
    return null;
  }

  const result = {
    byId: {},
    allIds: [] as string
  };

  for(let i = 0; i < data.length; i++){
    if(result.allIds.includes(data[i].UserId)) {
      continue;
    }

  }
}