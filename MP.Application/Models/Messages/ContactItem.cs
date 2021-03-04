using MP.Application.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Models.Messages
{
    public class ContactItem
    {
        public string ChatRoomName;
        public IEnumerable<UserDto> Users;
        public bool IsGroup;
        public string LastMessage;
        public DateTime LastDateTime;
        public int ChatRoomId;
        public string Photo;
    }
}
