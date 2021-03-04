using MP.Application.Models.Messages;
using MP.Core.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Services.Messages.ChatManager
{
    public interface IChatManager
    {
        List<ContactItem> BuildContactList(string ALogin);
        List<MessageItem> RecieveMessages(int AChatRoom);
        string GetLatest(int AChatRoom, out DateTime ASendDateTime);
        ContactItem AddUserToContacts(string ALogin, string ANewUser);
        MessageItem AddMessageToPool(string message, string user, int chatRoom);
    }
}
