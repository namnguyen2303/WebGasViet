using APIProject.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Data.Model.APIWeb;
using Data.Business;
using PagedList;
using PagedList.Mvc;
using Data.Utils;

namespace APIProject.Controllers
{
    public class ShopController : BaseController
    {
        // GET: Shop
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            ViewBag.lstProvince = shopBusiness.getListProvince();
            return View();
        }

        [UserAuthenticationFilter]
        public PartialViewResult LoadDistrictShop(int ProvinceID)
        {
            ViewBag.listDistrictShop = shopBusiness.loadDistrictShop(ProvinceID);
            return PartialView("_ListDistrictShop");
        }

        [UserAuthenticationFilter]
        public PartialViewResult LoadDistrictShopCreate(int ProvinceID)
        {
            ViewBag.listDistrictShopCreate = shopBusiness.loadDistrictShopCreate(ProvinceID);
            return PartialView("_ListDistrictShopCreate");
        }

        [UserAuthenticationFilter]
        public PartialViewResult LoadDistrictShopUpdate(int ProvinceID, int ID)
        {
            ViewBag.listDistrictShopUpdate = shopBusiness.loadDistrictShopUpdate(ProvinceID);
            return PartialView("_ListDistrictShopUpdate", shopBusiness.loadModalEditShop(ID));
        }


        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string ShopName, int? ProvinceID, int? DistrictID)
        {
            try
            {
                ViewBag.ShopName = ShopName;
                ViewBag.ProvinceID = ProvinceID;
                List<ListShopOutputModel> lstShop = shopBusiness.Search(Page, ShopName, ProvinceID, DistrictID);
                return PartialView("_TableShop", lstShop.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch (Exception ex)
            {
                ex.ToString();
                return PartialView("_TableShop", new List<ListShopOutputModel>().ToPagedList(1, 1));
            }
        }
        [UserAuthenticationFilter]
        public int CreateShop(CreateShopInputModel data)
        {
            try
            {
                return shopBusiness.CreateShop(data);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
        [UserAuthenticationFilter]
        public PartialViewResult loadModalEditShop(int ID)
        {
            try
            {
                ViewBag.lstProvince = shopBusiness.getListProvince();
                ListShopOutputModel obj = shopBusiness.loadModalEditShop(ID);
                //PartialView("_ListDistrictShopCreate", obj);
                return PartialView("_EditShop", obj);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return PartialView("EditShop", new ListShopOutputModel());
            }
        }
        [UserAuthenticationFilter]
        public int DeleteShop(int ID)
        {
            try {
                return shopBusiness.DeleteShop(ID);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
        [UserAuthenticationFilter]
        [HttpPost]
        public int EditShop(CreateShopInputModel data)
        {
            try
            {
                return shopBusiness.EditShop(data);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
    }
}