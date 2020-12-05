using APIProject.App_Start;
using Data.Business;
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
    public class BatchController : BaseController
    {

        // GET: Batch
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }



        [UserAuthenticationFilter]
        public int CreateBatch(CreateBatchInputModel input)
        {
            try
            {

                UserDetailOutputModel userLogin = UserLogins;
                return batchBusiness.CreateBatch(input, userLogin.UserID);
            }
            catch
            {
                return SystemParam.RETURN_FALSE;
            }
        }

        [UserAuthenticationFilter]
        public int DeleteBatch(int ID)
        {
            try
            {
                return batchBusiness.DeleteBatch(ID);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string BatchCode, string FromDate, string ToDate)
        {
            try
            {
                ViewBag.FromDate = FromDate;
                ViewBag.ToDate = ToDate;
                ViewBag.BatchCode = BatchCode;
                ViewBag.PageCurrent = Page;
                return PartialView("_TableBatch", batchBusiness.Search(Page, BatchCode, FromDate, ToDate));
            }
            catch
            {
                return PartialView("_TableBatch", new List<ListBatchOutputModel>().ToPagedList(1, 1));
            }
        }

        [UserAuthenticationFilter]
        public PartialViewResult GetBatchDetail(int BatchID)
        {
            try
            {
                BatchDetailOutputModel batchDetail = batchBusiness.GetBatchDetail(BatchID);
                return PartialView("_BatchDetail", batchDetail);
            }
            catch
            {
                return PartialView("_BatchDetail", new BatchDetailOutputModel());
            }
        }

        // Xuat QR to Excel
        [UserAuthenticationFilter]
        public FileResult ExportQR(int batchID)
        {
            try
            {
                return File(batchBusiness.ExportQR(batchID).GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Batch.xlsx");

            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}