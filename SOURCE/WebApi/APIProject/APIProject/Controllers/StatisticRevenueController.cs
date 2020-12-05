using APIProject.App_Start;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class StatisticRevenueController : BaseController
    {
        // GET: StatisticRevenue
        [UserAuthenticationFilter]
        public ActionResult Index(int? CusId)
        {
            ViewBag.listAgent = statisticBus.getListAgent();
            ViewBag.Revenue = statisticBus.Revenue(null,null,null);
            ViewBag.Point = statisticBus.RevenuePoint(null,null,null);
            return View();
        }
      
        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, int? AgentID, string FromDate, string ToDate)
        { 
            ViewBag.fd = FromDate;
            ViewBag.td = ToDate;
            ViewBag.agentId = AgentID;
            ViewBag.Revenue = statisticBus.Revenue(AgentID,FromDate,ToDate);
            ViewBag.Point = statisticBus.RevenuePoint(AgentID,FromDate,ToDate);

            return PartialView("_List", statisticBus.Search(Page, AgentID, FromDate, ToDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
        }
    }
}