using System;
using Data.Utils;
using Data.Business;
using Data.Model.APIWeb;
using PagedList;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using APIProject.App_Start;

namespace APIProject.Controllers
{
    public class PointController : BaseController
    {
        // GET: Point
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }
        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, int? CusID, string Name, string FromDate, string ToDate)
        {
            try
            {
                ViewBag.fromDate = FromDate;
                ViewBag.toDate = ToDate;
                ViewBag.Name = Name;
                ViewBag.CusID = CusID;
                List<ListHistoryOutputModel> lstPoint = pointBusiness.Search(Page,CusID, Name, FromDate, ToDate);
                return PartialView("_TablePoint", lstPoint.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch
            {
                return PartialView("TablePoint", new List<ListHistoryOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public ActionResult GetPointDetail(int ID)
        {
            try
            {
                PointDetailOutputModel obj = pointBusiness.GetPointDetail(ID);
                return PartialView("_PointDetail", obj);
            }
            catch
            {
                return PartialView("_PointDetail", new PointDetailOutputModel());
            }
        }
    }
}