using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Web.Models.UserModels
{
    public class LoginQuery
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string RememberMe { get; set; }
    }
}
