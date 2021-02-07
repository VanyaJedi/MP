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
  UserName: string,
  LastMessage:string,
  LastDateTime: Date,
  ChatRoomId: number
} 