using System;
using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using MP.Application.Services.Messages.ChatManager;
using MP.Data.Interfaces;
using MP.Core.Domain;
using System.Linq;
using MP.Application.Models.Messages;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

namespace MP.Web.ChatHub
{
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
        [Authorize]
        public async Task<MessageItem> Send(string message, int chatRoomId)
        {
            string roomName = _chatRoomRepositary.Table.FirstOrDefault(cr => cr.Id == chatRoomId).ChatRoomName;
            string xConnectionId = Context.ConnectionId;
            string xLogin = Context.User.Identity.Name;
            await this.Clients.OthersInGroup(roomName).SendAsync("Send", message, xLogin);
            var messageItem = _chatManager.AddMessageToPool(message, xLogin, chatRoomId);
            return messageItem;
        }

        public async Task JoinGroup(string roomName)
        {
            if (_ChatRommConnectionId.ContainsKey(Context.ConnectionId))
                _ChatRommConnectionId.Remove(Context.ConnectionId);
            _ChatRommConnectionId.Add(Context.ConnectionId, roomName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
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
