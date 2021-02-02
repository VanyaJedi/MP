using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MP.Core.Domain
{    
    // Таблица ChatRoom
    public class ChatRoom
    {
        [Key]
        public int Id { get; set; }
        public string ChatRoomName { get; set; }
        public int UserNumber { get; set; }
        public bool IsLock { get; set; }
        public List<ChatRoomUser> ChatRoomUser { get; set; }

        public ChatRoom()
        {
            ChatRoomUser = new List<ChatRoomUser>();
        }

    }
}
