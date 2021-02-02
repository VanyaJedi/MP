using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Models.Messages
{
    public class ContactItem
    {
        public string UserName;
        public string LastMessage;
        public DateTime LastDateTime;
        public int ChatRoomId;
        public byte[] Photo;
    }
}
