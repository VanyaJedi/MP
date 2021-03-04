using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Models.UserModels
{
    public class UserModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
    }

}
