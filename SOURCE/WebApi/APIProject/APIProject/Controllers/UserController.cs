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
    public class UserController : BaseController
    {
        // GET: User
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            UserDetailOutputModel userLogin = UserLogins;
            if (UserLogins.Role != SystemParam.ROLE_ADMIN)
            {
                Session[Sessions.LOGIN] = null;
                return RedirectToAction("Login", "Home");
            }
            return View();
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string Phone, string FromDate, string ToDate)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                if (UserLogins.Role != SystemParam.ROLE_ADMIN)
                {
                    Session[Sessions.LOGIN] = null;
                }
                ViewBag.FromDate = FromDate;
                ViewBag.ToDate = ToDate;
                ViewBag.Phone = Phone;
                ViewBag.PageCurrent = Page;
                return PartialView("_TableUser", userBusiness.Search(Page, Phone, FromDate, ToDate));
            }
            catch
            {
                return PartialView("_TableUser", new List<UserDetailOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public int CreateUser(string Phone, string UserName, string Password)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                if (UserLogins.Role != SystemParam.ROLE_ADMIN)
                {
                    Session[Sessions.LOGIN] = null;
                    return SystemParam.NOT_ADMIN;
                }
                else
                    return userBusiness.CreateUser(Phone, UserName, Password);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public int ChangePassword(string CurrentPassword, string NewPassword)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return userBusiness.ChangePassword(userLogin.UserID, CurrentPassword, NewPassword);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult GetUserDetail(int ID)
        {
            try
            {
                UserDetailOutputModel userDetail = userBusiness.GetUserDetail(ID);
                return PartialView("_UserDetail", userDetail);
            }
            catch
            {
                return PartialView("_UserDetail", new UserDetailOutputModel());
            }
        }

        [UserAuthenticationFilter]
        public int UpdateRole(int ID, string Phone, string UserName)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                if (UserLogins.Role != SystemParam.ROLE_ADMIN)
                {
                    Session[Sessions.LOGIN] = null;
                    return SystemParam.ERROR;
                }
                return userBusiness.UpdateRole(ID, Phone, UserName);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public int DeleteUser(int ID)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                if (UserLogins.Role != SystemParam.ROLE_ADMIN)
                {
                    Session[Sessions.LOGIN] = null;
                    return SystemParam.ERROR;
                }
                return userBusiness.DeleteUser(ID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        public int ResetPassword(int ID) {
            return userBusiness.ResetPasswrod(ID);
        }
    }
}