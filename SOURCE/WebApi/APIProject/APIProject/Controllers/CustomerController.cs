using APIProject.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList.Mvc;
using PagedList;
using Data.Utils;
using Data.Model;
using Data.Model.APIWeb;
using Data.DB;

namespace APIProject.Controllers
{
    public class CustomerController : BaseController
    {

        // GET: Customer
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            ViewBag.listCity = cusBusiness.LoadCityCustomer();
            return View();
            
        }
        [UserAuthenticationFilter]
        public ActionResult SearchCusName(string Name)
        {
            return Json(cusBusiness.LoadCusName(Name), JsonRequestBehavior.AllowGet);
        }
        [UserAuthenticationFilter]
        public PartialViewResult LoadDistrict(int ProvinceID)
        {
            ViewBag.listDistrict = cusBusiness.loadDistrict(ProvinceID);
            return PartialView("_ListDistrict");
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string FromDate, string ToDate, int? City, int? District, string Phone, int? Role,string Addrees)
        {
            ViewBag.FromDateCus = FromDate;
            ViewBag.ToDateCus = ToDate;
            ViewBag.PhoneSearch = Phone;
            ViewBag.City = City;
            ViewBag.District = District;
            ViewBag.Role = Role;
            ViewBag.Address = Addrees;
            ViewBag.Page = Page;
          //  var a = GoHome();
            //ViewBag.Status = Status;
            IPagedList<ListCustomerOutputModel> list = cusBusiness.Search(FromDate, ToDate, City, District, Phone, Role,Addrees).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            //ViewBag.listCustomer = cusBusiness.Search(FromDate, ToDate, City, District, Phone).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            return PartialView("_ListCustomer",list);
        }
        [UserAuthenticationFilter]
        public int AddPoint(string Phone, int Point, string Note)
        {
            return cusBusiness.addPoint(Phone, Point, Note);
          
        }
        [UserAuthenticationFilter]
        public int addPointAll(string listID,string listCusPhone, int Point, string Note)
        {
            return cusBusiness.addPointAll(listID, listCusPhone, Point, Note);
        }

        [UserAuthenticationFilter]
        public PartialViewResult CustomerDetail(int? ID,int? Page)
        {
            ViewBag.CusDetail = cusBusiness.cusDetail(ID);
            ViewBag.MemberRank = rankBusiness.getRankByLever(1);
            ViewBag.SliverRank = rankBusiness.getRankByLever(2);
            ViewBag.GoldRank = rankBusiness.getRankByLever(3);
            ViewBag.PlatinumRank = rankBusiness.getRankByLever(4);
            ViewBag.PageBefore = Page;
            return PartialView("_CustomerDetail");
        }

        [UserAuthenticationFilter]
        public int SaveEditCustomer(string Name, string Phone, string Email, int Sex, string BirthDay, string Address, int ID, float Lati, float Long)
        {
            try
            {
                return cusBusiness.SaveEditCustomer(Name, Phone, Email, Sex, BirthDay, Address, ID);
            }
            catch (Exception  ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult SearchHistoryPoint(int Page,int cusID, string FromDate, string ToDate)
        {
            ViewBag.cusID = cusID;
            ViewBag.FromDateHis = FromDate;
            ViewBag.ToDateHis = ToDate;
            IPagedList<GetListHistoryMemberPointInputModel> list = cusBusiness.SearchHistoryPoint(cusID, FromDate, ToDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            return PartialView("_ListHistoryPoint", list);
        }

        [UserAuthenticationFilter]
        public PartialViewResult SearchReQuest(int Page,int cusID, string FromDate, string ToDate)
        {
            ViewBag.cusID = cusID;
            ViewBag.FromDateRQ = FromDate;
            ViewBag.ToDateRQ = ToDate;
            IPagedList<ListRequestOutputModel> list = cusBusiness.SearchReQuest(cusID, FromDate, ToDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            return PartialView("_ListRequest", list);
        }

        [UserAuthenticationFilter]
        public int DeleteCustomer(int ID)
        {
            return cusBusiness.DeleteCustomer(ID);
        }

        [UserAuthenticationFilter]
        public PartialViewResult searchOrderHistory(int Page,int cusID, string fromDate, string toDate)
        {
            ViewBag.cusID = cusID;
            ViewBag.FromDateOH = fromDate;
            ViewBag.ToDateOH = toDate;
            IPagedList<ListOrderHistory> list = cusBusiness.searchOrderHistory(cusID, fromDate, toDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
            return PartialView("_ListOrderHistory", list);
        }

        public ActionResult GoHome()
        {
            return Json(Url.Action("Index", "Customer"));
        }
    }
}