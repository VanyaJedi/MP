using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MP.Application.Models.UserModels;

namespace MP.Application.Services.User.Login
{
    public interface ILoginService
    {
        public Task<UserModel> Handle(string Email, string Password, bool RememberMe);
        public Task<UserModel> GetUser(string userName);

    }
}
