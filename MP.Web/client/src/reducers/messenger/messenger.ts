import { extend } from '../../utils/common';
import { ActiveChat, Chat, ChatMessages } from '../../types/interfaces';
import { AnyAction, Dispatch, Reducer } from 'redux';
import { AxiosInstance } from 'axios';
import { createChat } from '../../adapters/chats';
import { createChatMessages } from '../../adapters/messages';
import { RootState } from '../reducer';


interface State {
  isFetchingUsers: boolean,
  isFetchingMessages: boolean,
  chats: Chat[],
  messages: ChatMessages[],
  activeChatId: ActiveChat
}

const initialState: State = {
  isFetchingUsers: false,
  isFetchingMessages: false,
  chats: [],
  messages: [],
  activeChatId: null
};


const ActionType = {
  SET_FETCHING_USERS_STATUS: `SET_FETCHING_USERS_STATUS`,
  SET_FETCHING_MESSAGES_STATUS: `SET_FETCHING_MESSAGES_STATUS`,
  MODIFY_CHATS: `MODIFY_CHATS`,
  MODIFY_MESSAGES_LIST: `MODIFY_MESSAGES_LIST`,
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT_USER'
};


const Operation = { 
  getChats: () => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreator.setFetchingUsersStatus(true));
    return api.get(`/messenger/contacts`)
      .then((res) => {
        const data = res.data;
        const chats = data.map((chat: any) => createChat(chat));
        dispatch(ActionCreator.modifyChats(chats));

        if(chats.length) {
          dispatch(ActionCreator.setActiveChat(chats[0].id));
        }
        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(ActionCreator.setFetchingUsersStatus(false));
      })
  },

  updateMessages: (chatRoomId: number) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreator.setFetchingMessagesStatus(true));
    return api.post('/messenger/messages', {
      chatRoomId
    }).then((res) => {
      const data = res.data;
      const chatMessage = createChatMessages(chatRoomId, data);
      const currentMessages = getState().MESSENGER.messages;
      if(chatMessage) {
        currentMessages.push(chatMessage);
      }
      dispatch(ActionCreator.modifyMessagesList(currentMessages));
    })
    .finally(() => {
      dispatch(ActionCreator.setFetchingMessagesStatus(false));
    })
  }
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
  modifyChats: (chats: Chat[]) => ({
    type: ActionType.MODIFY_CHATS,
    payload: chats
  }),
  modifyMessagesList: (messages: ChatMessages[]) => ({
    type: ActionType.MODIFY_MESSAGES_LIST,
    payload: messages
  }),
  setActiveChat: (activeChatId: ActiveChat) => ({
    type: ActionType.SET_ACTIVE_CHAT,
    payload: activeChatId
  }),

};

const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.SET_FETCHING_USERS_STATUS:
    return extend(state, {isFetchingUsers: action.payload});
  case ActionType.SET_FETCHING_MESSAGES_STATUS:
    return extend(state, {isFetchingMessages: action.payload});
  case ActionType.MODIFY_CHATS:
    return extend(state, {chats: action.payload});
  case ActionType.SET_ACTIVE_CHAT:
    return extend(state, {activeChatId: action.payload}); 
  default:
    return state;
  }
};


export {reducer, ActionType, ActionCreator, Operation};