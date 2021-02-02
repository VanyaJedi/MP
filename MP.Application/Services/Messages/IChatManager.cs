using MP.Application.Models.Messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Services.Messages.ChatManager
{
    public interface IChatManager
    {
        List<ContactItem> BuildContactList(string ALogin);
        List<MessageItem> RecieveMessages(string AMyLogin, int AChatRoom);
        string GetLatest(int AChatRoom, out DateTime ASendDateTime);
        bool AddUserToContacts(string ALogin, string ANewUser);
        bool AddMessageToPool(string message, string user, int chatRoom);
        //InitialDataItem GetInitialData(string ALogin);
        byte[] CroppedPicture(string AFileName, int AX, int AY, int AW, int AH);
        void SaveBytes(Byte[] AIn, string AFileName);
    }
}
