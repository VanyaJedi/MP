export interface Action<T> {
  type: string;
  payload: T;
}

export interface User {
  id: string,
  name: string,
  email?: string,
  avatar?: string
}

export interface Message {
  user: User | null,
  content: string,
  dateTime: Date,
  isMine?: boolean
}

export interface Chat {
  id: number,
  name: string,
  lastMessageText: string,
  lastMessageDateTime: Date
}

export interface ChatMessages {
  chatId: number,
  chatName: string,
  messages: Message[],
}

export type ActiveChat = number | null;

export interface State {
  'APP': {
    isProfileMenuOpen: boolean,
    isMobileMessagesAreaOpen: boolean
  },

  'USER': {
    user: User | null;
  },

  'MESSENGER': {
    chats: Chat[],
    messages: ChatMessages[],
    activeChatId: ActiveChat
  }
}

export interface AuthData {
  email: string,
  username?: string,
  password: string,
  rememberMe?: string
}

export interface regData {
  email: string,
  username: string,
  password: string
}

type id = string | number;
export interface ReduxEntity<T> {
  contactsById: {
    [key in id]: T
  },
  allIds: id[]
}

