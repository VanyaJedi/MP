using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Identity;
using MP.Core.Domain;
using MP.Data;
using MP.Application.Models;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MP.Application.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;
using MP.Application.Models.UserModels;
using MP.Application.Services.User.Registration;
using MP.Application.Services.EmailSender;
using System.Security.Policy;
using MP.Core.Domain;

namespace MP.Application.User.Registration
{
    public class RegistrationService: IRegistrationService
    {
        private readonly UserManager<Core.Domain.AppUser> _userManager;
        private readonly DataContext _context;

        public RegistrationService(DataContext context, UserManager<Core.Domain.AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<AppUser> Handle(string Email, string UserName, string Password)
        {
            if (await _context.Users.Where(x => x.Email == Email).AnyAsync())
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exist" });
            }

            if (await _context.Users.Where(x => x.UserName == UserName).AnyAsync())
            {
                throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exist" });
            }
            
            var user = new Core.Domain.AppUser
            {
                DisplayName = UserName,
                Email = Email,
                UserName = UserName
            };

            var result = await _userManager.CreateAsync(user, Password);
            if (result.Succeeded)
            {
                return user;
            }

            throw new Exception("Client creation failed");

        }
 
    }
}
