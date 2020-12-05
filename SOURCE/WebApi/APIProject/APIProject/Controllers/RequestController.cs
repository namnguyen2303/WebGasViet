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
    public class RequestController : BaseController
    {
        // GET: Request
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, int? Status, int? Type, string RequestCode, string FromDate, string ToDate)
        {
            try
            {
                ViewBag.FromDate = FromDate;
                ViewBag.ToDate = ToDate;
                ViewBag.RequestCode = RequestCode;
                ViewBag.Status = Status;
                ViewBag.Type = Type;
                ViewBag.PageCurrent = Page;
                return PartialView("_TableRequest", requestBusiness.Search(Status, Type, RequestCode, FromDate, ToDate).ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch
            {
                return PartialView("_TableRequest", new List<RequestDetailWebOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult GetRequestDetail(int RequestID)
        {
            try
            {
                RequestDetailWebOutputModel requestDetail = requestBusiness.GetRequestDetail(RequestID);
                return PartialView("_RequestDetail", requestDetail);
            }
            catch
            {
                return PartialView("_RequestDetail", new RequestDetailWebOutputModel());
            }
        }

        

        [UserAuthenticationFilter]
        public int AcceptRequest(int StatusRequest, int RequestID, int CustomerID, string RequestGiftName, string Note)
        {
            try
            {
                UserDetailOutputModel userLogin = UserLogins;
                return requestBusiness.AcceptRequest(StatusRequest, RequestID, CustomerID, RequestGiftName, Note, userLogin.UserID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        //[UserAuthenticationFilter]
        //public int DeleteRequest(int RequestID)
        //{
        //    try
        //    {
        //        return requestBusiness.DeleteRequest(RequestID);
        //    }
        //    catch
        //    {
        //        return SystemParam.RETURN_FALSE;
        //    }
        //}

        //Xuất Excel 
        [UserAuthenticationFilter]
        public FileResult ExportRequest(string fromDate, string toDate, int? status, int? typeRequest, string codeOrCusName)
        {
            return File(requestBusiness.ExportExcel(fromDate, toDate, status, typeRequest, codeOrCusName).GetAsByteArray(), "application / vnd.openxmlformats - officedocument.spreadsheetml.sheet", "DS_yeu_cau_doi_qua.xlsx");
        }

        // xuaats 1 yeeu caauf
        public FileResult singleRequestExport(int id)
        {
            try
            {
                return File(requestBusiness.singleRequestExport(id).GetAsByteArray(), "application / vnd.openxmlformats - officedocument.spreadsheetml.sheet", "Yeu_cau_doi_qua.xlsx");
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        // Xuat QR to Excel
        //[UserAuthenticationFilter]
        //public FileResult ExportRequestDetail(int requestID)
        //{
        //    try
        //    {
        //        return File(requestBusiness.ExportRequestDetail(requestID).GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Batch.xlsx");

        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}

    }
}