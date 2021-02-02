using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using MP.Application.Models;
using System.Threading.Tasks;
using MP.Core.Domain;
using MP.Data;
using MP.Application.Services.User.Login;
using MP.Application.Models.UserModels;
using MP.Application.Services.User.JWT;
using System.Security.Claims;

namespace MP.Application.User.Login
{
    public class LoginService: ILoginService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly SignInManager<AppUser> _signInManager;

        public LoginService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
        }
         public async Task<UserModel> Handle(string Email, string Password, bool RememberMe)
         {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user == null) throw new Exception("Email or password is incorrect");


            var result = await _signInManager.PasswordSignInAsync(user, Password, RememberMe, false);
            if (result.Succeeded)
            {
      
                return new UserModel
                {
                    id = user.Id,
                    email = user.Email,
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = null
                };

            }
            else
                throw new Exception("Email or password is incorrect");
        }

        public async Task<UserModel> GetUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null) 
            { 
                return null;
            }
                

            return new UserModel
            {
                id = user.Id,
                email = user.Email,
                DisplayName = user.DisplayName,
                Image = null
            };
        }
    }
}
