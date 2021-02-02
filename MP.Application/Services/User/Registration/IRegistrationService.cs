using MP.Application.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MP.Core.Domain;

namespace MP.Application.Services.User.Registration
{
    public interface IRegistrationService
    {
        public Task<AppUser> Handle(string Email, string UserName, string Password);
    }
}
