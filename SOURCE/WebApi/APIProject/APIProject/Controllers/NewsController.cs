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
    public class NewsController : BaseController
    {
        // GET: News


        //[UserAuthenticationFilter]
        public ActionResult CreateNews()
        {
            ViewBag.itemNewsProduct = newsBusiness.getItemNewsProduct();
            return View();
        }

        //[UserAuthenticationFilter]
        public ActionResult UpdateNews(int id)
        {
            ViewBag.itemNewsProduct = newsBusiness.getItemNewsProduct();
            ViewBag.FromDateNews = TempData["FromDateNews"];
            ViewBag.ToDateNews = TempData["ToDateNews"];
            ViewBag.TitleNews = TempData["TitleNews"];
            ViewBag.CreateUserIDNews = TempData["CreateUserIDNews"];
            ViewBag.TypeNews = TempData["TypeNews"];
            ViewBag.StatusNews = TempData["StatusNews"];
            ViewBag.PageCurrentNews = TempData["PageCurrentNews"];
            return View(newsBusiness.GetNewsDetail(id));
        }


        [ValidateInput(false)]
        [HttpPost]
        //[UserAuthenticationFilter]
        public int CreateNewsDekko(string Content, string Title, string Description, int Type, int? TypeSend, string UrlImage, int Status, int Display)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return newsBusiness.CreateNewsDekko(Content, Title, Description, Type, TypeSend, UrlImage, Status, Display, userLogin.UserID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [ValidateInput(false)]
        [HttpPost]
        //[UserAuthenticationFilter]
        public int UpdateNewsDekko(int ID, string Content, string Title, string Description, int Type, int TypeSend, string UrlImage, int Status, int Item, int Display)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return newsBusiness.UpdateNewsDekko(ID, Content, Title, Description, Type, TypeSend, UrlImage, Status, Item, Display);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        //[UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string Title, int? CreateUserID, int? Type, int? Status, string FromDate, string ToDate)
        {
            try
            {
                TempData["FromDateNews"] = FromDate;
                TempData["ToDateNews"] = ToDate;
                TempData["TitleNews"] = Title;
                TempData["CreateUserIDNews"] = CreateUserID;
                TempData["TypeNews"] = Type;
                TempData["StatusNews"] = Status;
                TempData["PageCurrentNews"] = Page;
                ViewBag.FromDateNews = FromDate;
                ViewBag.ToDateNews = ToDate;
                ViewBag.TitleNews = Title;
                ViewBag.CreateUserIDNews = CreateUserID;
                ViewBag.TypeNews = Type;
                ViewBag.StatusNews = Status;
                ViewBag.PageCurrentNews = Page;
                List<ListNewsWebOutputModel> listNews = newsBusiness.Search(Page, Title, CreateUserID, Type, Status, FromDate, ToDate);
                return PartialView("_TableNews", listNews.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch
            {
                return PartialView("_TableNews", new List<ListNewsWebOutputModel>().ToPagedList(1, 1));
            }
        }


        //[UserAuthenticationFilter]
        public ActionResult Index()
        {
            ViewBag.itemNewsProduct = newsBusiness.getItemNewsProduct();
            ViewBag.FromDateNews = TempData["FromDateNews"];
            ViewBag.ToDateNews = TempData["ToDateNews"];
            ViewBag.TitleNews = TempData["TitleNews"];
            ViewBag.CreateUserIDNews = TempData["CreateUserIDNews"];
            ViewBag.TypeNews = TempData["TypeNews"];
            ViewBag.StatusNews = TempData["StatusNews"];
            ViewBag.PageCurrentNews = TempData["PageCurrentNews"];
            List<ListUserWebOutputModel> listAuthor = newsBusiness.GetListAuthor();
            //if (listAuthor != null && listAuthor.Count() > 0)
            //{
            ViewBag.ListAuthor = listAuthor;
            //}
            return View();
        }


        //[UserAuthenticationFilter]
        public int DeleteNews(int ID)
        {
            try
            {
                return newsBusiness.DeleteNews(ID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        //[UserAuthenticationFilter]
        public PartialViewResult GetNewsDetail(int ID)
        {
            try
            {
                ListNewsWebOutputModel newsDetail = newsBusiness.GetNewsDetail(ID);
                return PartialView("_UpdateNews", newsDetail);
            }
            catch
            {
                return PartialView("_UpdateNews", new ListNewsWebOutputModel());
            }
        }

    }
}