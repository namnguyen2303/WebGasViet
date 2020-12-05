using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;

namespace APIProject.Controllers
{
    public class ProductsController : BaseController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }
    }
}