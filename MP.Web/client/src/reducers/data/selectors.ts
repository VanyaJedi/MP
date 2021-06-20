import { createSelector } from 'reselect'; 
import { Chat, ActiveChat, ReduxEntity, Message, User, UserObj } from '../../types/interfaces';
import { getUser } from '../user/selectors';
import { RootState } from '../reducer';

import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.DATA;

export const getChats = (state: RootState): ReduxEntity<Chat> => {
  return state[NAME_SPACE].chats;
};

export const getMessages = (state: RootState): ReduxEntity<Message> => {
  return state[NAME_SPACE].messages;
};

export const getActiveChatId = (state: RootState): ActiveChat => {
  return state[NAME_SPACE].activeChatId;
};

export const getUsers = (state: RootState): ReduxEntity<User> => {
  return state[NAME_SPACE].users;
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

export const getUsersInActiveChat = createSelector(
  [getChats, getActiveChatId], 
  (chats: ReduxEntity<Chat>, activeChatId: ActiveChat) => {
    if (chats.allIds.length && activeChatId) {
      return chats.byId[activeChatId].users;
    }
  }
);
