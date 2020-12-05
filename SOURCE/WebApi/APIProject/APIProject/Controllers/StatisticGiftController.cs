using APIProject.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using PagedList.Mvc;
using Data.Utils;

namespace APIProject.Controllers
{
    public class StatisticGiftController : BaseController
    {
        // GET: StatisticGift
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }

        [UserAuthenticationFilter]
        public PartialViewResult SearchRequestForGift(int Page,string CusName, int? GiftType, string FromDate, string ToDate)
        {
            ViewBag.CusName = CusName;
            ViewBag.GiftType = GiftType;
            ViewBag.FromDate = FromDate;
            ViewBag.ToDate = ToDate;
            return PartialView("_ListGift", requestBusiness.SearchStatisticGift(CusName, GiftType, FromDate, ToDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
        }
    }
}