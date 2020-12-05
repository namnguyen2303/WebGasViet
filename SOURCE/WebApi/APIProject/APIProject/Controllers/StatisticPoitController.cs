using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class StatisticPoitController : BaseController
    {
        // GET: StatisticPoit
        public ActionResult Index()
        {
            return View(cusBusiness.TopPoint());
        }
    }
}