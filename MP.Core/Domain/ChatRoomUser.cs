using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MP.Core.Domain
{

    // Связующая сущность для реализации отношения многие-ко-многим
    public class ChatRoomUser
    {
        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }


    }
}
