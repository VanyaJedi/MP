import { createSelector } from 'reselect'; 
import { Chat, ActiveChat, ReduxEntity, Message } from '../../types/interfaces';
import { RootState } from '../reducer';

import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.MESSENGER;

export const getChats = (state: RootState): ReduxEntity<Chat> => {
  return state[NAME_SPACE].chats;
};

export const getMessages = (state: RootState): ReduxEntity<Message> => {
  return state[NAME_SPACE].messages;
};

export const getActiveChatId = (state: RootState): ActiveChat => {
  return state[NAME_SPACE].activeChatId;
};

export const getUsersFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isFetchingUsers;
};

export const getMessagesFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isFetchingMessages;
};


export const getActiveChatMessages = createSelector(
  [getMessages, getActiveChatId], 
  (messageEntity, activeChatId) => {
    const messageIds = [];
    const messages = messageEntity.byId;
    for(let [key, value] of Object.entries(messages)) {
      if (value.chatId === activeChatId) {
        messageIds.push(parseInt(key));
      }
    }
    return messageIds;
  }
);
