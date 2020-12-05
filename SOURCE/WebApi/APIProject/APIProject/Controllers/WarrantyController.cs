using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using APIProject.App_Start;
using Data.Model.APIWeb;
using Data.Utils;
using Data.DB;
using PagedList;
using OfficeOpenXml;
using System.IO;
using OfficeOpenXml.Table;
using System.Drawing;
using OfficeOpenXml.Style;

namespace APIProject.Controllers
{
    public class WarrantyController : BaseController
    {
        // GET: Warranty
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View(UserLogins);
        }



        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string fromDate, string toDate, int? Status, string WarrantyCardCode)
        {
            try
            {
                ViewBag.fromDate = fromDate;
                ViewBag.toDate = toDate;
                ViewBag.Status = Status;
                ViewBag.WarrantyCardCode = WarrantyCardCode;
                DateTime? startDate = Util.ConvertDate(fromDate);
                DateTime? endDate = Util.ConvertDate(toDate);
                List<WarrantyCardOutput> lstWarrantyCard = warrantyBusiness.Search(Page, startDate, endDate, Status, WarrantyCardCode);
                return PartialView("_TableWarranty", lstWarrantyCard.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB));
            }
            catch
            {
                return PartialView("_TableWarranty", new List<WarrantyCardOutput>().ToPagedList(1, 1));
            }
        }
        [UserAuthenticationFilter]
        public PartialViewResult CreateWarranty(CreateWarrantyWebInputModel input)
        {
            try
            {
                input.CreateUserID = UserLogins.UserID;
                ViewBag.UserName = UserLogins.UserName;
                ViewBag.UserID = UserLogins.UserID;
                ViewBag.Qty = input.Qty;
                ViewBag.Point = input.Point;
                int WarrantyID = warrantyBusiness.CreatWarranty(input);
                ViewBag.WarrantyID = WarrantyID;
                List<WarrantyCardOutput> lstWarrantyCard = warrantyBusiness.GetListWarrantyCard(WarrantyID);
                return PartialView("_QRCodeWarrantyCard", lstWarrantyCard);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return PartialView("_QRCodeWarrantyCard", new List<WarrantyCardOutput>());
            }

        }
        [UserAuthenticationFilter]
        public int DeleteWarrantyCard(int ID)
        {
            try
            {
                return warrantyBusiness.DeleteWarrantyCard(ID);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
        [UserAuthenticationFilter]
        public PartialViewResult getWarrantyDetail(int ID, string WarrantyCodeCard)
        {
            ViewBag.ID = ID;
            ViewBag.WarrantyCodeCard = WarrantyCodeCard;
            return PartialView("_DetailWarrantyCard");
        }

        //Export Excel
        [UserAuthenticationFilter]
        private Stream CreateExcelFile(DateTime? fromDate, DateTime? toDate, int? Status, String warrantyCardCode)
        {
            Stream stream = null;
            var list = warrantyBusiness.GetListWrtCard(fromDate, toDate, Status, warrantyCardCode);
            using (var excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
            {
                // Add Sheet vào file Excel
                excelPackage.Workbook.Worksheets.Add("Danh sách phiếu khuyến mãi");
                // Lấy Sheet bạn vừa mới tạo ra để thao tác 
                var workSheet = excelPackage.Workbook.Worksheets[1];
                // Đổ data vào Excel file
                workSheet.Cells[1, 1].LoadFromCollection(list, true, TableStyles.None);
                BindingFormatForExcel(workSheet, list);
                excelPackage.Save();
                return excelPackage.Stream;
            }
        }

        [UserAuthenticationFilter]
        [HttpGet]
        public ActionResult Export(string fromDate, string toDate, int? Status, string warrantyCardCode)
        {
            DateTime? startDate = Util.ConvertDate(fromDate);
            DateTime? endDate = Util.ConvertDate(toDate);
            // Gọi lại hàm để tạo file excel
            var stream = CreateExcelFile(startDate, endDate, Status, warrantyCardCode);
            // Tạo buffer memory strean để hứng file excel
            var buffer = stream as MemoryStream;
            // Đây là content Type dành cho file excel, còn rất nhiều content-type khác nhưng cái này mình thấy okay nhất
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            // Dòng này rất quan trọng, vì chạy trên firefox hay IE thì dòng này sẽ hiện Save As dialog cho người dùng chọn thư mục để lưu
            // File name của Excel này là ExcelDemo
            Response.AddHeader("Content-Disposition", "attachment; filename=DS_Ma_Khuyen_Mai.xlsx");
            //Response.AddHeader("Content-Disposition", "attachment; filename=ExcelDemo.xlsx");
            // Lưu file excel của chúng ta như 1 mảng byte để trả về response
            Response.BinaryWrite(buffer.ToArray());
            // Send tất cả ouput bytes về phía clients
            Response.Flush();
            Response.End();
            // Redirect về luôn trang index <img draggable="false" class="emoji" alt="😀" src="https://s0.wp.com/wp-content/mu-plugins/wpcom-smileys/twemoji/2/svg/1f600.svg">
            return RedirectToAction("index");
        }

        [UserAuthenticationFilter]
        private void BindingFormatForExcel(ExcelWorksheet worksheet, List<ExcelWarrantyCardOutput> listItems)
        {
            //Set width default for column
            worksheet.DefaultColWidth = 30;
            // Tự động xuống hàng khi text quá dài
            worksheet.Cells.Style.WrapText = true;
            // Tạo header
            worksheet.Cells[1, 1].Value = "STT";
            worksheet.Cells[1, 2].Value = "Mã khuyến mại";
            worksheet.Cells[1, 3].Value = "Trạng thái";
            worksheet.Cells[1, 4].Value = "Ngày tích điểm";
            worksheet.Cells[1, 5].Value = "Ngày tạo";
            // Lấy range vào tạo format cho range đó ở đây là từ A1 tới D1
            using (var range = worksheet.Cells["A1:E1"])
            {
                // Set PatternType
                range.Style.Fill.PatternType = ExcelFillStyle.DarkGray;
                // Set Màu cho Background
                range.Style.Fill.BackgroundColor.SetColor(Color.Yellow);
                // Canh giữa cho các text
                range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                // Set Border
                range.Style.Border.BorderAround(ExcelBorderStyle.Dashed, Color.Black);
            }

            // Đỗ dữ liệu từ list vào 
            int Stt = 0;
            for (int i = 0; i < listItems.Count; i++)
            {
                var item = listItems[i];
                Stt++;
                worksheet.Cells[i + 2, 1].Value = Stt;
                worksheet.Cells[i + 2, 2].Value = item.WarrantyCardCode;
                worksheet.Cells[i + 2, 3].Value = Util.GetNameStatusWarranty(item.Status);
                worksheet.Cells[i + 2, 4].Value = item.ActiveDate.HasValue ? item.ActiveDate.Value.ToString("dd/MM/yyyy") : "";
                worksheet.Cells[i + 2, 5].Value = item.CreateDate.HasValue ? item.CreateDate.Value.ToString("dd/MM/yyyy") : "";
                var range = worksheet.Cells["A" + (i + 2) + ":" + "E" + (i + 2)];
                range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            }
        }

        //Print WarrantyCard in Details
        [UserAuthenticationFilter]
        public FileResult PrintQRCodeWarranty(int ID)
        {
            try
            {
                return File(warrantyBusiness.PrintQRCodeWarranty(ID).GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Ma_Khuyen_Mai.xlsx");

            }
            catch (Exception)
            {
                return null;
            }
        }

        //Print ListQrCode warrantycard after Create Warranty
        [UserAuthenticationFilter]
        public FileResult PrintListQRCodeWarranty(int ID)
        {
            try
            {
                return File(warrantyBusiness.PrintListQRCodeWarranty(ID).GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Ma_Khuyen_Mai.xlsx");
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }
    }
}