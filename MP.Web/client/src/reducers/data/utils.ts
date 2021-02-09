import { ActiveChat, Chat, ReduxEntity, User, Message, EnitytIdType } from '../../types/interfaces';
import { AnyAction} from 'redux';
import { extend } from '../../utils/common';


export interface State {
  activeChatId: ActiveChat
  chats: ReduxEntity<Chat>,
  messages: ReduxEntity<Message>,
  users: ReduxEntity<User>,
}


export const addUser = (state: State, action: AnyAction, isSingle = false) => {
  let allIds =  state.users.allIds.slice();
  const byId = extend({}, state.users.byId) as {
    [id in EnitytIdType]: User
  };

  if (isSingle) {
    const user = action.payload;
    if (allIds.includes(user.id)) {
      return state;
    }

    allIds.push(user.id);
    byId[user.id] = user
  } else {
    const usersIdsToAdd: string[] = [];
    const users = action.payload;
    users.allIds.forEach((item: string) => {
      if(!allIds.includes(item)) {
        usersIdsToAdd.push(item)
      }
    });

    allIds = allIds.concat(usersIdsToAdd);
    
    usersIdsToAdd.forEach((item: string) => {
      byId[item] = users.byId[item]
    })
  }
 
  const newState = extend(state, {
    users: {
      allIds,
      byId
    }  
  }) as State;

  return newState;
}


export const addMessage = (state: State, action: AnyAction) => {
  const allIds =  state.messages.allIds.slice();
  const byId = extend({}, state.messages.byId) as {
    [id in EnitytIdType]: Message
  };

  const message = action.payload;
  const messageId = message.messageId ? message.messageId : message.tempId;

  byId[messageId] = message;
  allIds.push(messageId);

  const newState = extend(state, {
    messages: {
      allIds,
      byId
    }  
  }) as State;

  return newState;
}

export const modifyMessage = (state: State, action: AnyAction) => {
  const allIds =  state.messages.allIds.slice();
  const byId = extend({}, state.messages.byId) as {
    [id in EnitytIdType]: Message
  };

  const { id, message } = action.payload;
  const messageId = message.messageId ? message.messageId : message.tempId;

  if (allIds.includes(id)) {
    const index = allIds.indexOf(id);
    allIds[index] = messageId;

    delete byId[action.payload.id];
    byId[messageId] = message;
  }

  const newState = extend(state, {
    messages: {
      allIds,
      byId
    }  
  }) as State;

  return newState;

}