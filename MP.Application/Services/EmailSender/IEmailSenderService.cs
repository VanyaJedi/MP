using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Services.EmailSender
{
    public interface IEmailSenderService
    {
        void Send(string toAddress, string subject, string body, bool sendAsync = true);
    }
}
