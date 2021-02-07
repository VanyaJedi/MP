using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using MP.Core.Domain;
using MP.Data;
using MP.Application.Services.User.Login;
using MP.Application.Services.User.Registration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using MP.Application.Services.EmailSender;
using System.Web;
using MP.Web.Models.UserModels;
using MP.Application.Exceptions;

namespace MP.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILoginService _loginService;
        private readonly IRegistrationService _registrationService;
        private readonly IEmailSenderService _emailSenderService;

        // Constructor
        public UserController(
            DataContext context,
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ILoginService loginService,
            IRegistrationService registrationService, 
            IEmailSenderService emailSenderService
            ) 
        {

            _userManager = userManager;
            _signInManager = signInManager;
            _loginService = loginService;
            _registrationService = registrationService;
            _emailSenderService = emailSenderService;
        }


        private string EncodePasswordToBase64(string password)
        {
            try
            {
                byte[] encData_byte = new byte[password.Length];
                encData_byte = System.Text.Encoding.UTF8.GetBytes(password);
                string encodedData = Convert.ToBase64String(encData_byte);
                return encodedData;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in base64Encode" + ex.Message);
            }
        }

        private string DecodeFrom64(string encodedData)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encodedData);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            string result = new String(decoded_char);
            return result;
        }


        [HttpGet]
        [Route("Jwt")]
        public string GetJwt()
        {
            return Request.Cookies["X-Access-Token"];
        }

        [HttpGet]
        [Authorize]
        [Route("GetUser")]
        public IActionResult GetUser()
        {
            var userName = User.Identity.Name;

            if (userName == null)
            {
                return Unauthorized();
            }
            var userResult = _loginService.GetUser(userName);
            if (userResult.Result == null)
            {
                return Unauthorized();
            }

            var response = JsonSerializer.Serialize(userResult.Result);
            return Ok(response);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginQuery query)
        {
            try
            {
                string Email = query.Email;
                string Password = query.Password;
                bool Remember = Convert.ToBoolean(query.RememberMe);
                var userModel = _loginService.Handle(Email, Password, Remember);
                var user = await _userManager.FindByIdAsync(userModel.Result.id);
                Response.Cookies.Append("X-Access-Token", userModel.Result.Token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
                var response = JsonSerializer.Serialize(userModel.Result);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message);
            }
        }

        [HttpPost]
        [Route("Registration")]
        public  async Task<IActionResult> Registration(RegisterQuery query)
        {
            var userModel = _registrationService.Handle(query.Email, query.UserName, query.Password);

            AppUser user = userModel.Result;

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            string codeHtmlVersion = HttpUtility.UrlEncode(code);

            var callbackUrl = Url.Action(
                "ConfirmEmail",
                "User",
                new { username = user.UserName, code = codeHtmlVersion },
                protocol: HttpContext.Request.Scheme);

             _emailSenderService.Send(user.Email, "Confirm your account", $"Подтвердите регистрацию, перейдя по ссылке: <a href='{callbackUrl}'>link</a>");

            return Ok(JsonSerializer.Serialize(userModel.Result));
        }

        [HttpGet]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string username, string code)
        {
            if (username == null || code == null)
            {
                return BadRequest("Error with confirmation, please try again");
            }
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest("Error");
            }

            var codeHtmlDecoded = HttpUtility.UrlDecode(code);

            var result = await _userManager.ConfirmEmailAsync(user, codeHtmlDecoded);
            if (result.Succeeded)
                return RedirectToAction("Index", "Auth");
            else
                return BadRequest("Error");
        }

        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ResetQuery query)
        {
            string email = query.Email;
            string password = query.Password;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                return BadRequest("User with that email doen't exist");
            }
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedPassword = EncodePasswordToBase64(password);
            var callbackUrl = Url.Action("ResetPassword", "User", new { userId = user.Id, code = code, pass = encodedPassword }, protocol: HttpContext.Request.Scheme);
            _emailSenderService.Send(email, "Reset Password", $"Для сброса пароля пройдите по ссылке: <a href='{callbackUrl}'>link</a>");
            return Ok("Reset link has been sent");
        }

        [HttpGet]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword(string userId, string code, string pass)
        {
            if (userId == null || code == null || pass == null)
            {
                return BadRequest("Error");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("Error");
            }
            var decryptedPassword = DecodeFrom64(pass);
            var result = await _userManager.ResetPasswordAsync(user, code, decryptedPassword);

            if (result.Succeeded)
                return RedirectToAction("Index", "Auth");
            else
                return BadRequest("Error");
        }

        [HttpGet]
        [Route("Logout")]
        public void Logout()
        {
            _signInManager.SignOutAsync();
            Response.Cookies.Delete("X-Access-Token");
        }
    }
}
