using System;
using System.Collections.Generic;
using System.Linq;
using MP.Data;
using MP.Core.Domain;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using Microsoft.EntityFrameworkCore;
using MP.Application.Models.Messages;
using MP.Data.Interfaces;
using MP.Application.Models.UserModels;

namespace MP.Application.Services.Messages.ChatManager
{
    public class ChatManager: IChatManager
    {
        private readonly IRepository<AppUser> _usersRepository;
        private readonly IRepository<Message> _messagesRepository;
        private readonly IRepository<ChatRoom> _chatRoomRepositary;
        public ChatManager(
            IRepository<AppUser> usersRepository, 
            IRepository<Message> messagesRepository,
            IRepository<ChatRoom> chatRoomRepositary
        )
        {
            _usersRepository = usersRepository;
            _messagesRepository = messagesRepository;
            _chatRoomRepositary = chatRoomRepositary;
        }

        public  List<ContactItem> BuildContactList(string userName)
        {
            List<ContactItem> сontactList = new List<ContactItem>();
            var сontacts = _usersRepository.Table
                .Include(c => c.ChatRoomUser)
                .ThenInclude(sc => sc.ChatRoom)
                .ToList();

            var user = сontacts.FirstOrDefault(t => userName == t.UserName);
            if (user == null)
                return сontactList;

            var chatRooms = user.ChatRoomUser.Select(sc => sc.ChatRoom).ToList();

            foreach (ChatRoom cru in chatRooms)
            {
                if (cru.UserNumber <= 2)
                    foreach (ChatRoomUser x in cru.ChatRoomUser)
                    {                     
                        if (x.User.UserName != userName)
                        {
                            ContactItem contactItem = new ContactItem();
                            contactItem.ChatRoomName = x.User.UserName;
                            contactItem.Users = cru.ChatRoomUser
                                .Where(cr => cr.User.UserName != userName)
                                .Select(cr => new UserDto() { 
                                    Id = cr.User.Id,
                                    UserName = cr.User.UserName,
                                    Email = cr.User.Email,
                                    Image = cr.User.Photo
                                });
                            contactItem.IsGroup = false;
                            contactItem.LastMessage = GetLatest(cru.Id, out contactItem.LastDateTime);
                            contactItem.ChatRoomId = cru.Id;
                            contactItem.Photo = x.User.Photo;
                            сontactList.Add(contactItem);
                            break;
                        }
                    }
                else
                {
                    ContactItem contactItem = new ContactItem();
                    contactItem.ChatRoomName = cru.ChatRoomName;
                    contactItem.Users = cru.ChatRoomUser
                        .Select(cr => new UserDto()
                            {
                                Id = cr.User.Id,
                                UserName = cr.User.UserName,
                            });
                    contactItem.IsGroup = true;
                    contactItem.LastMessage = "";
                    contactItem.Photo = null;
                    сontactList.Add(contactItem);
                }
             }

            return сontactList;
        }


        public  List<MessageItem> RecieveMessages(int chatRoomId)
        {
            List<MessageItem> result = new List<MessageItem>();

            var messagesTable = this._messagesRepository.Table.OrderBy(p => p.MessageId);

            List<Message> messageList = messagesTable
                .Include(m => m.ChatRoom)
                .Include(m => m.User)
                .Where(m => m.ChatRoomId == chatRoomId)
                .ToList();


            if (messageList != null)
            {
                int messageCountToShow = (messageList.Count > 25) ? messageList.Count - 25 : 0;
       
                for (int i = messageCountToShow; i < messageList.Count; i++)
                {
                    MessageItem xMessageItem = new MessageItem();
                    xMessageItem.MessageId = messageList[i].MessageId;
                    xMessageItem.ChatRoomName = messageList[i].ChatRoom.ChatRoomName;
                    xMessageItem.MessageText = messageList[i].MessageText;
                    xMessageItem.UserId = messageList[i].UserId;
                    xMessageItem.UserName = messageList[i].User.UserName;
                    xMessageItem.DateTime = messageList[i].SendTime; 
                    result.Add(xMessageItem);
                }
            }

            return result;
        }

        public string GetLatest(int chatRoomId, out DateTime sendDateTime)
        {
            List<Message> messageList = (from message in _messagesRepository.Table
                                             where message.ChatRoomId == chatRoomId
                                             select message).ToList();
            if (messageList.Count > 0)
            {
                sendDateTime = messageList[messageList.Count - 1].SendTime;
                string xVal = messageList[messageList.Count - 1].MessageText;
                return xVal;
            }
            else
            {
                sendDateTime = new DateTime(1, 1, 1, 0, 0, 0);
                return "";
            }
        }

        public ContactItem AddUserToContacts(string login, string newUser)
        {
            bool isAlreadyContact = false;
            var contacts = _usersRepository.Table
                .Include(c => c.ChatRoomUser)
                .ThenInclude(sc => sc.ChatRoom)
                .ToList();

            if (contacts.Count == 0) return new ContactItem();
            var u = contacts.FirstOrDefault(t => login == t.UserName);
            if (u == null) return new ContactItem();

            var cr = u.ChatRoomUser.Select(sc => sc.ChatRoom).ToList();

            // Есть ли уже такой контакт?
            foreach (ChatRoom cru in cr)
            { 
                foreach (ChatRoomUser x in cru.ChatRoomUser)
                    if (x.User.UserName == newUser)
                    {
                        isAlreadyContact = true;
                        break;
                    }
                if (isAlreadyContact)
                    break;
            }
            if (!isAlreadyContact)
            {  
                var targetContact = _usersRepository.Table
                    .Where(p => p.UserName == newUser)
                    .Include(c => c.ChatRoomUser)
                    .ThenInclude(sc => sc.ChatRoom)
                    .ToList();

                if (targetContact.Count > 0)
                {
                    ChatRoom chatRoom = new ChatRoom { ChatRoomName = login + "_" + newUser, UserNumber = 2 };
                    _chatRoomRepositary.AddToContext(chatRoom);
                    chatRoom.ChatRoomUser.Add(new ChatRoomUser { UserId = u.Id, ChatRoomId = chatRoom.Id });
                    chatRoom.ChatRoomUser.Add(new ChatRoomUser { UserId = targetContact[0].Id, ChatRoomId = chatRoom.Id });
                    _chatRoomRepositary.SaveContext();

                    ContactItem contactItem = new ContactItem();
                    contactItem.ChatRoomName = newUser;
                    contactItem.Users = chatRoom.ChatRoomUser
                        .Where(cr => cr.User.UserName != login)
                        .Select(cr => new UserDto()
                        {
                            Id = cr.User.Id,
                            UserName = cr.User.UserName,
                            Email = cr.User.Email,
                            Image = cr.User.Photo
                        });
                    contactItem.IsGroup = false;
                    contactItem.LastMessage = GetLatest(chatRoom.Id, out contactItem.LastDateTime);
                    contactItem.ChatRoomId = chatRoom.Id;
                    contactItem.Photo = targetContact[0].Photo;
                    return contactItem;
                }
                else
                    return new ContactItem();
            }
            else
               return new ContactItem();
        }

        public MessageItem AddMessageToPool(string message, string userName, int chatRoomId)
        {
            Message messageTable = new Message();

            var userId = this._usersRepository.Table.FirstOrDefault(u => u.UserName == userName).Id;

            messageTable.MessageText = message;
            messageTable.UserId = userId;
            messageTable.ChatRoomId = chatRoomId;
            messageTable.SendTime = DateTime.Now;
            _messagesRepository.AddToContext(messageTable);
            _messagesRepository.SaveContext();

            int id = messageTable.MessageId;
            MessageItem messageItem = new MessageItem()
            {
                MessageId = id,
                ChatRoomId = chatRoomId,
                UserId = userId,
                MessageText = message,
                DateTime = DateTime.Now
            };

            return messageItem;
        }
    }
}
