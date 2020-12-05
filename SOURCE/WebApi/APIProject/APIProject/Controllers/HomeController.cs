using Data.Model.APIWeb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Data.Business;
using Data.Utils;
using APIProject.App_Start;
using Newtonsoft.Json;

namespace APIProject.Controllers
{
    public class HomeController : BaseController
    {

        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            //ViewBag.Count = cardBusiness.CountCard();
            //ViewBag.CountReq = requestBusiness.CountRequest();
            //ViewBag.CountCus = cusBusiness.countCustomer();
            //ViewBag.CountBatch = batchBusiness.CountBatch();
            ViewBag.countItem = itemBusiness.countItem();
            ViewBag.countOrder = orderBus.countOrder();
            return View();
        }

        //lưu lại thông tin đối tượng vừa đăng nhập
        //[UserAuthenticationFilter]
        public JsonResult GetUserLogin()
        {
            try
            {
                if(Session[Sessions.LOGIN] != null)
                {
                    UserDetailOutputModel userLogin = (UserDetailOutputModel) Session[Sessions.LOGIN];
                    return Json(userLogin, JsonRequestBehavior.AllowGet);
                }
                return Json(new UserDetailOutputModel(), JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new UserDetailOutputModel(), JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Login()
        {
            ViewBag.Title = "Login Page";
            return View();
        }

        //đăng nhập web
        public int UserLogin(string phone, string password)
        {
            try
            {
                UserDetailOutputModel userLogin = loginBusiness.CheckLoginWeb(phone, password);
                if (userLogin != null && userLogin.UserID > 0)
                {
                    Session[Sessions.LOGIN] = userLogin;
                    return SystemParam.SUCCESS;
                }
                else
                {
                    return SystemParam.FAIL_LOGIN;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        //đăng xuất
        public int Logout()
        {
            try
            {
                Session[Sessions.LOGIN] = null;
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

    }
}
