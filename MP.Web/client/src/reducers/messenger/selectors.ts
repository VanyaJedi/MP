import { createSelector } from 'reselect'; 
import { Chat, ChatMessages, ActiveChat } from '../../types/interfaces';
import { RootState } from '../reducer';

import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.MESSENGER;

export const getChats = (state: RootState): Chat[] => {
  return state[NAME_SPACE].chats;
};

export const getMessages = (state: RootState): ChatMessages[] => {
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
  (messages, activeChatId) => messages.find((item) => item.chatId === activeChatId)
);
