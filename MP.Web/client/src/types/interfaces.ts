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
  messageId?: number,
  userId: string,
  chatId: number,
  content: string,
  dateTime?: Date,
  status?: string,
  tempId?: number
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


export type EnitytIdType = string | number

export type ActiveChat = EnitytIdType | null;

export interface ReduxEntity<T> {
  byId: {
    [id in EnitytIdType]: T
  },
  allIds: EnitytIdType[]
}



