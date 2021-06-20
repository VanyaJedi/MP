using System;
using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using MP.Application.Services.Messages.ChatManager;
using MP.Data.Interfaces;
using MP.Core.Domain;
using Newtonsoft.Json;

namespace MP.Web.ChatHub
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static Hashtable _ChatRommConnectionId = new Hashtable();
        private IChatManager _chatManager;
        private readonly IRepository<ChatRoom> _chatRoomRepositary;
        public ChatHub(IChatManager chatManager, IRepository<ChatRoom> chatRoomRepositary)
        {
            _chatManager = chatManager;
            _chatRoomRepositary = chatRoomRepositary;
        }
        
        public async Task<string> Send(string message, int chatRoomId)
        {
            string chatRoom = Convert.ToString(chatRoomId);
            string userName = Context.User.Identity.Name;
            var messageItem = _chatManager.AddMessageToPool(message, userName, chatRoomId);
            var response = JsonConvert.SerializeObject(messageItem);
            await Clients.OthersInGroup(chatRoom).SendAsync("Send", response);
            return response;
        }

        public async Task NoticeUser(string users)
        {
            //await Clients.User(userName).SendAsync("NoticeUser");
            await Clients.Users(users).SendAsync("NoticeUser");
        }

        public async Task JoinGroup(string chatRoomId)
        {
            if (_ChatRommConnectionId.ContainsKey(Context.ConnectionId))
                _ChatRommConnectionId.Remove(Context.ConnectionId);
            _ChatRommConnectionId.Add(Context.ConnectionId, chatRoomId);
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId);
        }

        public override async Task OnConnectedAsync()
        {
            // await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            // Удаляем соединения из таблицы FChatRommConnectionId
            if (_ChatRommConnectionId.ContainsKey(Context.ConnectionId))
                _ChatRommConnectionId.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
