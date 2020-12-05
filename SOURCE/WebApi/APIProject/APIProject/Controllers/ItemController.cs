using APIProject.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using PagedList.Mvc;

namespace APIProject.Controllers
{
    public class ItemController : BaseController
    {
        // GET: Products
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            ViewBag.listCategory = itemBusiness.getListCategory();
            ViewBag.Name = UserLogins.UserName;
            return View();
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string FromDate, string ToDate, string ItemName, string ItemCode)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                ViewBag.fromDate = FromDate;
                ViewBag.toDate = ToDate;
                ViewBag.ItemName = ItemName;
                ViewBag.ItemCode = ItemCode;

                //DateTime? startDate = Util.ConvertDate(fromDate);
                //DateTime? endDate = Util.ConvertDate(toDate);
                List<ListItemOutputModel> lstProduct = itemBusiness.Search(Page, FromDate, ToDate, ItemName, ItemCode);
                return PartialView("_TableItem", lstProduct.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch (Exception ex)
            {
                ex.ToString();
                return PartialView("TableItem", new List<ListItemOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public int CreateItem(CreateItemInputModel Input)
        {
            try
            {
                return itemBusiness.CreateItem(Input);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult LoadItem(int ID)
        {
            try
            {
                //ViewBag.listCategory = itemBusiness.getListCategory();
                var Item = itemBusiness.LoadItem(ID);
                return PartialView("_EditItem", Item);
            }
            catch
            {
                return PartialView("_EditItem", new CreateItemInputModel());
            }
        }

        [UserAuthenticationFilter]
        public int SaveEditItem(CreateItemInputModel Input)
        {
            try
            {
                return itemBusiness.SaveEditItem(Input);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public int DeleteItem(int ID)
        {
            try
            {
                return itemBusiness.DeleteItem(ID);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }
    }
}