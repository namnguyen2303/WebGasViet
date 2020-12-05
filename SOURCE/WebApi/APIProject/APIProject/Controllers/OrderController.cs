using APIProject.App_Start;
using Data.Model.APIWeb;
using Data.Utils;
using OfficeOpenXml;
using PagedList;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class OrderController : BaseController
    {
        // GET: Order
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            ViewBag.ListAgent = agentBusiness.LoadAgent();
            ViewBag.ListCustomer = agentBusiness.LoadCustomer();
            return View();
        }
        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, int? Agent, int? Customer, int? Status, string FromDate, string ToDate, string Code)
        {
            UserDetailOutputModel userLogin = UserLogins;
            ViewBag.Role = UserLogins.Role;
            ViewBag.Agent = Agent;
            ViewBag.Customer = Customer;
            ViewBag.Tus = Status;
            ViewBag.fd = FromDate;
            ViewBag.td = ToDate;
            return PartialView("_List", orderBus.Search(Agent, Customer, Status, FromDate, ToDate, Code).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
        }

        [UserAuthenticationFilter]
        //Search autocomplete cusName
        public ActionResult SearchCusName(string Name)
        {
            return Json(orderBus.SearchCusName(Name), JsonRequestBehavior.AllowGet);
        }
        // ShowEdit
        public PartialViewResult ShowEditOrder(int ID)
        {
            //UserDetailOutputModel userLogin = UserLogins;
            //if (UserLogins.Role == SystemParam.ROLE_USER)
            //{
            //    Session[Sessions.LOGIN] = null;
            //    return PartialView("_EditForm", new OrderDetailEditOutput());
            //}
            //else
            return PartialView("_EditForm", orderBus.ItemEdit(ID));
        }

        //Save Edit
        [UserAuthenticationFilter]
        public int SaveEditOrder(int ID, int Status, int? AddPoint, string BuyerName, string BuyerPhone, string BuyerAddress, long TotalPrice, int Discount)
        {
            //try
            //{
            //    UserDetailOutputModel userLogin = UserLogins;
            //    if (UserLogins.Role == SystemParam.ROLE_USER)
            //    {
            //        Session[Sessions.LOGIN] = null;
            //        return SystemParam.ERROR;
            //    }
            //    return orderBus.SaveEdit(ID, Status, AddPoint, BuyerName, BuyerPhone, BuyerAddress, TotalPrice, Discount);
            //}
            //catch (Exception ex)
            //{
            //    ex.ToString();
            //}

            return SystemParam.RETURN_FALSE;
        }

        // Delete Order
        [UserAuthenticationFilter]
        public int DeleteOrder(int ID)
        {
            try {
                return orderBus.DeleteOrder(ID);
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.ERROR;
            }

            //UserDetailOutputModel userLogin = UserLogins;
            //if (UserLogins.Role == SystemParam.ROLE_USER)
            //{
            //    Session[Sessions.LOGIN] = null;
            //    return SystemParam.ERROR;
            //}
            //return orderBus.DeleteOrder(ID);
        }

        //[UserAuthenticationFilter]
        //public FileResult ExportBill(int ID)
        //{
        //    try
        //    {
        //        UserDetailOutputModel userLogin = UserLogins;
        //        return File(orderBus.ExportBill(ID, userLogin.UserName).GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "BillForm.xlsx");

        //    }
        //    catch (Exception ex)
        //    {
        //        ex.ToString();
        //        return null;
        //    }
        //}
    }
}