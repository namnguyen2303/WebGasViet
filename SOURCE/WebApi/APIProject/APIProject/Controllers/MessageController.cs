using APIProject.App_Start;
using Data.Model.APIWeb;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class MessageController : BaseController
    {
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }

        [UserAuthenticationFilter]
        public ActionResult Chat()
        {
            return View();
        }

        

    }
}