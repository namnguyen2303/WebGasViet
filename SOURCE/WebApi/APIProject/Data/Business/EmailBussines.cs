using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class EmailBussines
    {
        public void configClient(string mail , string pass)
        {
            var fromAddress = new MailAddress(SystemParam.EMAIL_CONFIG);
            var toAddress = new MailAddress(mail);
            string fromPassword = SystemParam.PASS_CONFIG;
            string subject = "Thay đổi mật khẩu";
            string body = "Mật khẩu của bạn đã được thay đổi. Mật khẩu mới của bạn là :" + pass;

            var smtp = new SmtpClient
            {
                Host = SystemParam.HOST_DEFAUL,
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
            }
        }
    }
}
