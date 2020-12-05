using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.DB;
using Data.Utils;
using Data.Model.APIWeb;
using System.Collections;
using System.IO;
using System.Web;
using OfficeOpenXml;
using QRCoder;
using System.Drawing;
using OfficeOpenXml.Drawing;

namespace Data.Business
{
    public class WarrantyBusiness : GenericBusiness
    {
        public WarrantyBusiness(DEKKOEntities context = null) : base()
        {

        }

        public List<WarrantyCardOutput> Search(int Page, DateTime? fromDate, DateTime? toDate, int? Status, string WarrantyCardCode)
        {
            try
            {
                var query = (from w in cnn.WarrantyCards
                             where w.IsActive.Equals(SystemParam.ACTIVE)
                             && (Status.HasValue ? w.Status.Equals(Status.Value) : true)
                             && (!String.IsNullOrEmpty(WarrantyCardCode) ? w.WarrantyCardCode.Contains(WarrantyCardCode) : true)
                             && (fromDate.HasValue ? w.CreateDate >= fromDate.Value : true)
                             && (toDate.HasValue ? w.CreateDate <= toDate.Value : true)
                             orderby w.ID descending
                             select new WarrantyCardOutput
                             {
                                 ID = w.ID,
                                 WarrantyCardCode = w.WarrantyCardCode,
                                 Status = w.Status,
                                 ActiveDate = w.ActiveDate.Value,
                                 Point = w.Warranty.Point,
                                 CreateDate = w.CreateDate
                             }).ToList();
                return query.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<WarrantyCardOutput>();
            }
        }

        public Boolean CheckDuplicateWarrantyCode(string WarrantyCode)
        {
            try
            {
                var obj = cnn.Warranties.Where(u => u.WarrantyCode.Equals(WarrantyCode) && u.IsActive.Equals(SystemParam.ACTIVE)).ToList();
                if (obj != null && obj.Count() > 0)
                {
                    return SystemParam.BOOLEAN_TRUE;
                }
                return SystemParam.BOOLEAN_FALSE;
            }
            catch
            {
                return SystemParam.BOOLEAN_FALSE;
            }
        }

        //Tạo Phiếu khuyến mãi
        public int CreatWarranty(CreateWarrantyWebInputModel input)
        {
            try
            {
                string warrantyCode = "";
                string last_warrantycode = cnn.Warranties.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).OrderByDescending(u => u.ID).Select(u => u.WarrantyCode).First();
                int numberCode = int.Parse(last_warrantycode.Replace("BH", "")) + 1;
                if (numberCode < 10)
                {
                    warrantyCode = "BH000000" + numberCode;
                }
                else if (numberCode < 100)
                {
                    warrantyCode = "BH00000" + numberCode;
                }
                else if (numberCode < 1000)
                {
                    warrantyCode = "BH0000" + numberCode;
                }
                else if (numberCode < 10000)
                {
                    warrantyCode = "BH000" + numberCode;
                }
                else if (numberCode < 100000)
                {
                    warrantyCode = "BH00" + numberCode;
                }
                else if (numberCode < 1000000)
                {
                    warrantyCode = "BH0" + numberCode;
                }
                else if (numberCode < 10000000)
                {
                    warrantyCode = "BH" + numberCode;
                }
                Warranty wrt = new Warranty();
                wrt.CreateUserID = input.CreateUserID;
                wrt.WarrantyCode = warrantyCode;
                wrt.QTY = input.Qty;
                wrt.Point = input.Point;
                wrt.ExpireDate = input.GetExpireDate();
                wrt.CreateDate = DateTime.Today;
                wrt.IsActive = SystemParam.ACTIVE;
                cnn.Warranties.Add(wrt);

                for (int i = 1; i <= input.Qty; i++)
                {
                    WarrantyCard obj = new WarrantyCard();
                    obj.WarrantyCardCode = Util.CreateMD5(warrantyCode + '_' + i).Substring(0, SystemParam.LENGTH_QR_HASH);
                    obj.CreateDate = DateTime.Today;
                    obj.IsActive = SystemParam.ACTIVE;
                    obj.Status = SystemParam.W_STATUS_NO_ACTIVE;
                    wrt.WarrantyCards.Add(obj);
                }
                cnn.SaveChanges();
                int WarrantyID = cnn.Warranties.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.WarrantyCode.Equals(warrantyCode)).Select(u => u.ID).First();
                return WarrantyID;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }


        //Laasy ra List WarrantyCard 
        public List<WarrantyCardOutput> GetListWarrantyCard(int WarrantyID)
        {
            try
            {
                var query = from c in cnn.WarrantyCards
                            where c.WarrantyID == WarrantyID
                            select new WarrantyCardOutput
                            {
                                ID = c.ID,
                                WarrantyCardCode = c.WarrantyCardCode
                            };
                return query.ToList();
            }
            catch
            {
                return new List<WarrantyCardOutput>();
            }
        }

        public int DeleteWarrantyCard(int ID)
        {
            try
            {
                WarrantyCard obj = cnn.WarrantyCards.Find(ID);
                obj.IsActive = SystemParam.NO_ACTIVE_DELETE;
                Warranty warranty = cnn.Warranties.Find(obj.WarrantyID);
                warranty.QTY = warranty.QTY - 1;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public List<ExcelWarrantyCardOutput> GetListWrtCard(DateTime? fromDate, DateTime? toDate, int? Status, string warrantyCardCode)
        {
            try
            {
                var query = from w in cnn.WarrantyCards
                            where w.IsActive.Equals(SystemParam.ACTIVE)
                            && (Status.HasValue ? w.Status.Equals(Status.Value) : true)
                            && (!String.IsNullOrEmpty(warrantyCardCode) ? w.WarrantyCardCode.Contains(warrantyCardCode) : true)
                            && (fromDate.HasValue ? w.CreateDate >= fromDate.Value : true)
                            && (toDate.HasValue ? w.CreateDate <= toDate.Value : true)
                            orderby w.CreateDate descending
                            select new ExcelWarrantyCardOutput
                            {
                                WarrantyCardCode = w.WarrantyCardCode,
                                Status = w.Status,
                                ActiveDate = w.ActiveDate.Value,
                                CreateDate = w.CreateDate
                            };
                return query.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ExcelWarrantyCardOutput>();
            }
        }

        public ExcelPackage PrintQRCodeWarranty(int ID)
        {
            try
            {
                var warrantyCard = cnn.WarrantyCards.Where(u => u.ID.Equals(ID)).Select(u => new { u.WarrantyCardCode, u.Status }).FirstOrDefault();
                if (warrantyCard != null)
                {
                    string WarrantyCardCode = warrantyCard.WarrantyCardCode + "2";
                    string path = HttpContext.Current.Server.MapPath(@"/Template/Ma_Khuyen_Mai.xlsx");
                    FileInfo file = new FileInfo(path);
                    ExcelPackage pack = new ExcelPackage(file);
                    ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                    QRCodeGenerator qrGenerator = new QRCodeGenerator();
                    QRCodeData data = qrGenerator.CreateQrCode(WarrantyCardCode, QRCodeGenerator.ECCLevel.Q);
                    QRCode qr = new QRCode(data);
                    Bitmap bitmapImage = new Bitmap(qr.GetGraphic(50));
                    int row = 3;
                    sheet.Cells[row, 1].Value = WarrantyCardCode;
                    sheet.Cells[row, 2].Value = Util.GetNameStatusWarranty(warrantyCard.Status);
                    ExcelPicture QrImage = sheet.Drawings.AddPicture("QR_CODE" + WarrantyCardCode, bitmapImage);
                    QrImage.From.Column = 2;
                    QrImage.From.Row = row - 1;
                    QrImage.To.Column = 3;
                    QrImage.To.Row = row;
                    QrImage.SetSize(100, 100);
                    QrImage.From.ColumnOff = 19050;
                    QrImage.From.RowOff = 19050;
                    sheet.Cells[row, 1].AutoFitColumns();
                    sheet.Cells[row, 2].AutoFitColumns();
                    sheet.Column(3).Width = 15;
                    sheet.Row(row).Height = 80;
                    return pack;
                }
                return null;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public ExcelPackage PrintListQRCodeWarranty(int ID)
        {
            try
            {
                var query = cnn.WarrantyCards.Where(w => w.WarrantyID == ID && w.IsActive == SystemParam.ACTIVE).ToList();
                string path = HttpContext.Current.Server.MapPath(@"/Template/Ma_Khuyen_Mai.xlsx");
                FileInfo file = new FileInfo(path);
                ExcelPackage pack = new ExcelPackage(file);
                ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                int row = 3;
                foreach (var obj in query)
                {
                    string WarrantyCardCode = obj.WarrantyCardCode + "2";
                    QRCodeGenerator qrGenerator = new QRCodeGenerator();
                    QRCodeData data = qrGenerator.CreateQrCode(WarrantyCardCode, QRCodeGenerator.ECCLevel.Q);
                    QRCode qr = new QRCode(data);
                    Bitmap bitmapImage = new Bitmap(qr.GetGraphic(50));
                    sheet.Cells[row, 1].Value = WarrantyCardCode;
                    sheet.Cells[row, 2].Value = Util.GetNameStatusWarranty(obj.Status);
                    ExcelPicture QrImage = sheet.Drawings.AddPicture("QR_CODE" + WarrantyCardCode, bitmapImage);
                    QrImage.From.Column = 2;
                    QrImage.From.Row = row - 1;
                    QrImage.To.Column = 3;
                    QrImage.To.Row = row;
                    QrImage.SetSize(100, 100);
                    QrImage.From.ColumnOff = 19050;
                    QrImage.From.RowOff = 19050;
                    sheet.Cells[row, 1].AutoFitColumns();
                    sheet.Cells[row, 2].AutoFitColumns();
                    sheet.Column(3).Width = 15;
                    sheet.Row(row).Height = 80;
                    row++;
                }
                return pack;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }
    }
}
