using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Data.Model.APIWeb;
using Data.Business;
using Data.Utils;
using PagedList.Mvc;
using PagedList;
using APIProject.App_Start;
using System.IO;
using OfficeOpenXml;
using Microsoft.Office.Interop.Excel;
using Data.DB;
using System.Web.Http;

namespace APIProject.Controllers
{
    public class CardController : BaseController
    {
        //CardBusiness cardBusiness = new CardBusiness();
        // GET: Card
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }

        

        [UserAuthenticationFilter]
        public int addCard(CreateCardWebInputModel input)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return cardBusiness.addCard(input, userLogin.UserID);
            }
            catch
            {
                return SystemParam.RETURN_FALSE;
            }

        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string Seri, string FromDate,string ToDate, int? Status)
        {
            if (Seri == null)
            {
                Seri = "";
            }
            ViewBag.Seri = Seri;
            ViewBag.FromDate = FromDate;
            ViewBag.ToDate = ToDate;
            ViewBag.Status = Status;
            try
            {
                List<CardDetailOutputModel> listCard = cardBusiness.Search(Page, Seri, FromDate,ToDate, Status);
                return PartialView("_TableCard", listCard.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }catch
            {
                return PartialView("_List", new List<CardDetailOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult showEditCard(int CardID)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                CreateCardWebInputModel input = cardBusiness.editCard(CardID, userLogin.UserID);
                return PartialView("_EditCard",input);
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw;
            }
        }


        [UserAuthenticationFilter]
        public int DeleteCard(int ID)
        {
            return cardBusiness.DeleteCard(ID);
        }


        [UserAuthenticationFilter]
        public FileResult ExportFormCard()
        {
                FileInfo file = new FileInfo(Server.MapPath(@"/Template/FormCard.xlsx"));
                ExcelPackage pack = new ExcelPackage(file);
                ExcelWorksheet workSheet = pack.Workbook.Worksheets[1];
                return File(pack.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "CardForm.xlsx");
        }

        //Import Data
        [UserAuthenticationFilter]
        public int Import(HttpPostedFileBase ExcelFile)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return cardBusiness.ImportData(ExcelFile, userLogin.UserID);
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw;
            }
        }
    }
}