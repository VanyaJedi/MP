using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using MP.Application.Services.Messages.ChatManager;
using MP.Web.Models.Messenger;

namespace MP.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessengerController : ControllerBase
    {
        private IChatManager _chatManager;
        public MessengerController(IChatManager chatManager)
        {
            _chatManager = chatManager;
        }

        [Authorize]
        [HttpGet]
        [Route("Contacts/")]
         public IActionResult Contacts()
         {
            try
            {
                var userName = User.Identity.Name;
                if (userName == null)
                {
                    return Unauthorized();
                }
                var contacts = _chatManager.BuildContactList(userName);
                var response = JsonConvert.SerializeObject(contacts);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

         }

        [Authorize]
        [HttpPost]
        [Route("Messages/")]
        public IActionResult Messages(ChatRoomQuery chatRoomQuery)
        {
            try
            {
                var messages = _chatManager.RecieveMessages(User.Identity.Name, chatRoomQuery.ChatRoomId);
                var response = JsonConvert.SerializeObject(messages);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }

       /* // Текущая информация при загрузке страницы
        [Authorize]
        [HttpGet]
        [Route("InitialData/")]
        public string InitialData()
        {
            return JsonConvert.SerializeObject(_chatManager.GetInitialData(User.Identity.Name));
        }*/
    }
}
