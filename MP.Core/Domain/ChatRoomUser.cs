using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MP.Core.Domain
{
    public class ChatRoomUser
    {
        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }


    }
}
