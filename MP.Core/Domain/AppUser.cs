using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace MP.Core.Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Photo { get; set; }
        public List<ChatRoomUser> ChatRoomUser { get; set; }

        public AppUser()
        {
            ChatRoomUser = new List<ChatRoomUser>();
        }
    }


}

