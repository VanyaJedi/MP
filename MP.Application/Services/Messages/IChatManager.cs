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
        bool AddUserToContacts(string ALogin, string ANewUser);
        MessageItem AddMessageToPool(string message, string user, int chatRoom);
        //InitialDataItem GetInitialData(string ALogin);
        byte[] CroppedPicture(string AFileName, int AX, int AY, int AW, int AH);
        void SaveBytes(Byte[] AIn, string AFileName);
    }
}
