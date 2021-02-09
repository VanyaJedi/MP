import { extend } from '../../utils/common';
import { Chat, ReduxEntity, User, Message, EnitytIdType } from '../../types/interfaces';
import { AnyAction, Dispatch, Reducer } from 'redux';
import { AxiosInstance } from 'axios';
import { createChats, createUsersFromChats } from '../../adapters/chats';
import { createMessages, createUsersFromMessages } from '../../adapters/messages';
import { ActionCreator as ActionCreatorFetching } from '../fetching/fetching';
import { RootState } from '../reducer';
import { createUser } from '../../adapters/user';
import { State, addUser, addMessage, modifyMessage } from './utils';

const initialState: State = {
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
  SET_CHATS: `SET_CHATS`,
  SET_MESSAGES: `SET_MESSAGES`,
  SET_USERS: `SET_USERS`,
  ADD_USER: `ADD_USER`,
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT_USER',
  ADD_MESSAGE: 'ADD_MESSAGE',
  MODIFY_MESSAGE: 'MODIFY_MESSAGE'
};


const Operation = { 
  getChats: () => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreatorFetching.setChatUsersFetching(true));
    return api.get(`/messenger/contacts`)
      .then((res) => {
        const data = res.data;
        const chats = createChats(data);
        const users = createUsersFromChats(data);

        dispatch(ActionCreator.setChats(chats));
        dispatch(ActionCreator.setUsers(users));

        if(chats.allIds.length) {
          dispatch(ActionCreator.setActiveChat(chats.allIds[0]));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(ActionCreatorFetching.setChatUsersFetching(false));
      })
  },

  getMessages: (chatRoomId: number) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreatorFetching.setMessagesFetching(true));
    return api.post('/messenger/messages', {
      chatRoomId
    }).then((res) => {
      const data = res.data;
      const messages = createMessages(chatRoomId, data);
      const users = createUsersFromMessages(data);

      dispatch(ActionCreator.setUsers(users));
      dispatch(ActionCreator.setMessages(messages));
    })
    .finally(() => {
      dispatch(ActionCreatorFetching.setMessagesFetching(false));
    })
  },

  getUserById: (id: string) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    return api.post('/user/getUser', {id})
      .then((res) => {
        const user = createUser(res.data);
        console.log(user);
        if(user) {
          dispatch(ActionCreator.addUser(user));
        }
      })
  },
}

const ActionCreator = {
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
  addUser: (user: User) => ({
    type: ActionType.ADD_USER,
    payload: user
  }),

  addMessage: (message: Message) => ({
    type: ActionType.ADD_MESSAGE,
    payload: message
  }),

  modifyMessage: (id: number, message: Message) => ({
    type: ActionType.MODIFY_MESSAGE,
    payload: {
      id,
      message
    }
  }),

};



const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.SET_CHATS:
    return extend(state, {chats: action.payload});
  case ActionType.SET_ACTIVE_CHAT:
    return extend(state, {activeChatId: action.payload});
  case ActionType.SET_USERS:
    return addUser(state, action)
  case ActionType.ADD_USER:
    return addUser(state, action, true)
  case ActionType.SET_MESSAGES:
    return extend(state, {messages: action.payload}); 
  case ActionType.ADD_MESSAGE:
    return addMessage(state, action);
  case ActionType.MODIFY_MESSAGE:
    return modifyMessage(state, action); 
  default:
    return state;
  }
};


export {reducer, ActionType, ActionCreator, Operation};