export interface MessageDto {
  MessageId: number,
  ChatRoomId: number,
  ChatRoomName: string,
  MessageText: string,
  UserId: string,
  UserName: string,
  DateTime: Date
}

export interface ChatDto {
  ChatRoomName: string,
  IsGroup: boolean,
  Users: UserDto[],
  LastMessage:string,
  LastDateTime: Date,
  ChatRoomId: number
} 

export interface UserDto {
  Id: string,
  Email: string,
  UserName: string,
  Image: string
}
