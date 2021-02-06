import { extend } from '../../utils/common';
import { ActiveChat, Chat, ReduxEntity, User, Message, EnitytIdType } from '../../types/interfaces';
import { AnyAction, Dispatch, Reducer } from 'redux';
import { AxiosInstance } from 'axios';
import { createChats } from '../../adapters/chats';
import { createMessages, createUsersFromMessages } from '../../adapters/messages';
import { RootState } from '../reducer';
import { MessageStatus } from '../../constants';


interface State {
  isFetchingUsers: boolean,
  isFetchingMessages: boolean,
  activeChatId: ActiveChat

  //entities
  chats: ReduxEntity<Chat>,
  messages: ReduxEntity<Message>,
  users: ReduxEntity<User>,
}

const initialState: State = {
  isFetchingUsers: false,
  isFetchingMessages: false,
  chats: {
    byId: {},
    allIds: [] as unknown as number[],
  },
  messages: {
    byId: {},
    allIds: [] as unknown as number[],
  },
  users: {
    byId: {},
    allIds: [] as unknown as string[],
  },
  activeChatId: null
};


const ActionType = {
  SET_FETCHING_USERS_STATUS: `SET_FETCHING_USERS_STATUS`,
  SET_FETCHING_MESSAGES_STATUS: `SET_FETCHING_MESSAGES_STATUS`,
  SET_CHATS: `SET_CHATS`,
  SET_MESSAGES: `SET_MESSAGES`,
  SET_USERS: `SET_USERS`,
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT_USER',
  ADD_MESSAGE: 'ADD_MESSAGE'
};


const Operation = { 
  getChats: () => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreator.setFetchingUsersStatus(true));
    return api.get(`/messenger/contacts`)
      .then((res) => {
        const data = res.data;
        const chats = createChats(data);
        dispatch(ActionCreator.setChats(chats));

        if(chats.allIds.length) {
          dispatch(ActionCreator.setActiveChat(chats.allIds[0]));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(ActionCreator.setFetchingUsersStatus(false));
      })
  },

  getMessages: (chatRoomId: number) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreator.setFetchingMessagesStatus(true));
    return api.post('/messenger/messages', {
      chatRoomId
    }).then((res) => {
      const data = res.data;
      const messages = createMessages(chatRoomId, data);
      console.log(messages);
      const users = createUsersFromMessages(data);

      dispatch(ActionCreator.setUsers(users));
      dispatch(ActionCreator.setMessages(messages));
    })
    .finally(() => {
      dispatch(ActionCreator.setFetchingMessagesStatus(false));
    })
  },
}

const ActionCreator = {
  setFetchingMessagesStatus: (state: boolean) => ({
    type: ActionType.SET_FETCHING_MESSAGES_STATUS,
    payload: state
  }),
  setFetchingUsersStatus: (state: boolean) => ({
    type: ActionType.SET_FETCHING_USERS_STATUS,
    payload: state
  }),
  setChats: (chats: ReduxEntity<Chat>) => ({
    type: ActionType.SET_CHATS,
    payload: chats
  }),
  setMessages: (messages: ReduxEntity<Message>) => ({
    type: ActionType.SET_MESSAGES,
    payload: messages
  }),
  setActiveChat: (activeChatId: EnitytIdType) => ({
    type: ActionType.SET_ACTIVE_CHAT,
    payload: activeChatId
  }),
  setUsers: (users: ReduxEntity<User>) => ({
    type: ActionType.SET_USERS,
    payload: users
  }),

  addMessage: (message: string, chatRoomId: EnitytIdType, userId: string) => ({
    type: ActionType.ADD_MESSAGE,
    payload: {
      chatRoomId,
      message,
      userId
    }
  }),

};

const addMessage = (state: State, action: AnyAction) => {
  const allIds =  state.messages.allIds.slice();
  const byId = extend({}, state.messages.byId) as {
    [id in EnitytIdType]: Message
  };

  const id = allIds.length ? +allIds[allIds.length - 1] + 1: 1;
  const message = {
    messageId: id,
    userId: action.payload.userId,
    chatId:  action.payload.chatRoomId,
    content: action.payload.message,
    dateTime: new Date(),
    status: MessageStatus.SENDING
   }

  byId[id] = message;
  allIds.push(id);

  const newState = extend(state, {
    messages: {
      allIds,
      byId
    }  
  }) as State;

  return newState;
}

const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.SET_FETCHING_USERS_STATUS:
    return extend(state, {isFetchingUsers: action.payload});
  case ActionType.SET_FETCHING_MESSAGES_STATUS:
    return extend(state, {isFetchingMessages: action.payload});
  case ActionType.SET_CHATS:
    return extend(state, {chats: action.payload});
  case ActionType.SET_ACTIVE_CHAT:
    return extend(state, {activeChatId: action.payload});
  case ActionType.SET_USERS:
    return extend(state, {users: action.payload}); 
  case ActionType.SET_MESSAGES:
    return extend(state, {messages: action.payload}); 
  case ActionType.ADD_MESSAGE:
    return addMessage(state, action); 
  default:
    return state;
  }
};


export {reducer, ActionType, ActionCreator, Operation};