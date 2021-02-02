using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MP.Core.Domain
{
    // Таблица сообщений 
    public class Message
    {
        [Key]
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public DateTime SendTime { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
    }
}
