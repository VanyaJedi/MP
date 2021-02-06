using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Models.Messages
{
    public class MessageItem
    {
        public int MessageId;
        public string ChatRoomName;
        public int ChatRoomId;
        public string MessageText;
        public string UserId;
        public string UserName;
        public DateTime DateTime;
    }
}
