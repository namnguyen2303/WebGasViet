using Data.Model.APIWeb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;
using System.Web.Routing;

namespace APIProject.App_Start
{
    public class UserAuthenticationFilter : ActionFilterAttribute, IAuthenticationFilter
    {
        public void OnAuthentication(AuthenticationContext filterContext)
        {
            if (filterContext.HttpContext.Session[Data.Utils.Sessions.LOGIN] != null)
            {
                //Lay ra contronller hien tai
                string ControllerName = filterContext.Controller.ToString();
                UserDetailOutputModel userLogin = (UserDetailOutputModel)filterContext.HttpContext.Session["Login"];
                //Kiem tra xem List Action cua User co Controller hien tai khong
                //Co thi cho dung// khong co nghi de quay ve home
            }
            else
            {
                //Chuyen ve trang dang nhap
                var routeValues = new RouteValueDictionary();
                routeValues["controller"] = "Home";
                routeValues["action"] = "Login";
                filterContext.Result = new RedirectToRouteResult(routeValues);
            }
        }

        //Runs after the OnAuthentication method  
        //------------//
        //OnAuthenticationChallenge:- if Method gets called when Authentication or Authorization is 
        //failed and this method is called after
        //Execution of Action Method but before rendering of View
        //------------//
        public void OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
        {
            //We are checking Result is null or Result is HttpUnauthorizedResult 
            // if yes then we are Redirect to Error View
            if (filterContext.Result == null || filterContext.Result is HttpUnauthorizedResult)
            {
                filterContext.Result = new ViewResult
                {
                    ViewName = "Error"
                };
            }
        }
    }
}