using APIProject.App_Start;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList.Mvc;
using Data.DB;

namespace APIProject.Controllers
{
    public class ConfigController : BaseController
    {
        // GET: Config
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            List<Configss> config = configBusiness.showElement();
            ViewBag.Distance = config.Where(x => x.NameConst.Contains("Distance")).FirstOrDefault().ValueConst;
            ViewBag.TimeWaiting = config.Where(x => x.NameConst.Contains("TimeWaiting")).FirstOrDefault().ValueConst / 1000;
            ViewBag.PointAddFirst = config.Where(x => x.NameConst.Contains("PointAddFirst")).FirstOrDefault().ValueConst;
            return View();
        }


        [UserAuthenticationFilter]
        public PartialViewResult LoadRank(int Page, int? ID)
        {
            IPagedList<Ranking> list = rankBusiness.LoadRank().ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            return PartialView("_ListRank", list);
        }

        //[UserAuthenticationFilter]
        /*public int AddRank(int Level, string RankName, string Descriptions, int MinPoint, int MaxPoint)
        {
            return rankBusiness.AddRank(Level, RankName, Descriptions, MinPoint, MaxPoint);
        }*/

        [UserAuthenticationFilter]
        public PartialViewResult ShowEditRank(int ID)
        {
            ViewBag.RankID = ID;
            Ranking r = rankBusiness.ShowEditRank(ID);
            ViewBag.MinPoint = r.MinPoint;
            ViewBag.MaxPoint = r.MaxPoint;
            ViewBag.Des = r.Descriptions;
            return PartialView("_EditRank");
        }

        public int EditRank(int ID, string Descripton, int? MaxPoint, int? MinPoint)
        {
            //ViewBag.RankID = ID;
            return rankBusiness.EditRank(ID, Descripton, MaxPoint, MinPoint);
        }

        [UserAuthenticationFilter]
        public PartialViewResult GetConfigGiftDetail(int ID)
        {
            try
            {
                ListGiftWebOutputModel configGiftDetail = configBusiness.GetConfigGiftDetail(ID);
                return PartialView("_UpdateConfigGift", configGiftDetail);
            }
            catch
            {
                return PartialView("_UpdateConfigGift", new ListGiftWebOutputModel());
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult GetConfigCardDetail(int ID)
        {
            try
            {
                ListGiftWebOutputModel configCardDetail = configBusiness.GetConfigCardDetail(ID);
                return PartialView("_UpdateConfigCard", configCardDetail);
            }
            catch
            {
                return PartialView("_UpdateConfigCard", new ListGiftWebOutputModel());
            }
        }


        [UserAuthenticationFilter]
        public int CreateConfigGift(string Name, int Price, int Point, string UrlImage, string Description, int Type, string FromDate, string ToDate)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return configBusiness.CreateConfigGift(userLogin.UserID, Name, Price, Point, UrlImage, Description, Type, Util.ConvertDate(FromDate).Value , Util.ConvertDate(ToDate).Value);
            }
            catch
            {
                return SystemParam.RETURN_FALSE;
            }
        }


        [UserAuthenticationFilter]
        public int UpdateConfigGift(int ID, string Name, int Price, int Point, string UrlImage, string Description, int Type, string FromDate, string ToDate, int Status)
        {
            try
            {
                return configBusiness.UpdateConfigGift(ID, Name, Price, Point, UrlImage, Description, Type, Util.ConvertDate(FromDate).Value, Util.ConvertDate(ToDate).Value, Status);
            }
            catch(Exception e)
            {
                e.ToString();
                return SystemParam.ERROR;
            }
        }


        [UserAuthenticationFilter]
        public int CreateConfigCard(int Price, int Point, string Description, int Type, int TelecomType)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return configBusiness.CreateConfigCard(userLogin.UserID, Price, Point, Description, Type, TelecomType);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }


        [UserAuthenticationFilter]
        public int UpdateConfigCard(int ID, int Point, string Description)
        {
            try
            {
                return configBusiness.UpdateConfigCard(ID, Point, Description);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }


        [UserAuthenticationFilter]
        public PartialViewResult SearchConfigGift(int Page)
        {
            try
            {
                ViewBag.PageCurrent = Page;
                return PartialView("_TableConfigGift", configBusiness.SearchConfigGift(Page));
            }
            catch
            {
                return PartialView("_TableConfigGift", new List<ListGiftWebOutputModel>().ToPagedList(1, 1));
            }

        }

        [UserAuthenticationFilter]
        public int DeleteConfigGift(int ID)
        {
            try
            {
                return configBusiness.DeleteConfigGift(ID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public int DeleteConfigCard(int ID)
        {
            try
            {
                return configBusiness.DeleteConfigCard(ID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult SearchConfigCard(int Page)
        {
            try
            {
                ViewBag.PageCurrentCard = Page;
                return PartialView("_TableConfigCard", configBusiness.SearchConfigCard(Page));
            }
            catch
            {
                return PartialView("_TableConfigCard", new List<ListGiftWebOutputModel>().ToPagedList(1, 1));
            }

        }

        public int SaveConfig(int Distance, int TimeWaiting, int PointAddFirst) {
            return configBusiness.SaveConfig(Distance, TimeWaiting, PointAddFirst);
        }
    }
}