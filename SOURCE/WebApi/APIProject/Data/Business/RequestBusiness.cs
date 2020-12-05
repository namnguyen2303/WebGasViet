using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using OfficeOpenXml;
using PagedList;
using PagedList.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Data.Business
{
    public class RequestBusiness : GenericBusiness
    {
        public RequestBusiness(DEKKOEntities context = null) : base()
        {
        }
        PointBusiness pBus = new PointBusiness();
        NotifyBusiness notiBus = new NotifyBusiness();
        public string CreateRequest(Gift gift, int cusID)
        {
            if (gift != null)
            {
                //Customer cus = cnn.Customers.Find(cusID);
                //int totalPointPerDay = pBus.getTotalPointPerDay(cusID);

                //if (cus.Point >= (gift.Point + 0) && (totalPointPerDay + gift.Point) <= cnn.Configs.Where(u => u.Key.Equals(SystemParam.MAX_POINT_PER_DAY)).FirstOrDefault().Value)
                //{
                //    // tạo mới request
                //    Request rq = new Request();
                //    string code = Util.RandomString(SystemParam.SIZE_CODE, false);
                //    rq.GiftID = gift.ID;
                //    rq.Point = gift.Point;
                //    rq.Type = gift.Type;
                //    rq.CreateDate = DateTime.Now;
                //    rq.IsActive = SystemParam.ACTIVE;
                //    rq.CustomerID = cusID;
                //    rq.Code = code;
                //    rq.Status = SystemParam.STATUS_REQUEST_WAITING;
                //    cnn.Requests.Add(rq);
                //    // sửa lại điểm của khách hàng
                //    cus.Point -= gift.Point;
                //    cnn.SaveChanges();
                //    pBus.CreateHistoryes(cusID, gift.Point, SystemParam.TYPE_POINT_RECEIVE_GIFT, SystemParam.HISTORY_TYPE_ADD_ANOTHER, code, "", 0);
                //    return "Yêu cầu đã được gửi vui lòng chờ đợi phản hồi từ hệ thống";
                //}
                //else
                return "";
            }
            else
                return "";
        }
        public CardOutputModel RequestCard(Gift gift, int cusID)
        {
            Customer cus = cnn.Customers.Find(cusID);

            //if (cus.Point >= (gift.Point + 0) && (totalPointPerDay + gift.Point) <= cnn.Configs.Where(u => u.Key.Equals(SystemParam.MAX_POINT_PER_DAY)).FirstOrDefault().Value)
            //{
            //    //CardOutputModel output = new CardOutputModel();
            //    //output.name = gift.Name;
            //    //output.price = gift.Price;
            //    //var lscard = cnn.Cards.Where(u => u.TelecomType.Equals(gift.TelecomType.Value) && u.CardType.Equals(gift.Price) && u.Status.Equals(SystemParam.NO_ACTIVE));
            //    //if (lscard != null && lscard.Count() > 0)
            //    //{
            //    //    List<Card> lsc = lscard.ToList();
            //    //    cus.Point -= gift.Point;
            //    //    Card card = lscard.FirstOrDefault();
            //    //    output.seri = card.Seri;
            //    //    output.code = Util.EnCode(card.Code.ToString());
            //    //    string content = output.name + "/" + output.price + "/" + output.seri + "/" + output.code;
            //    //    card.Status = SystemParam.ACTIVE;
            //    //    card.CustomerActiveID = cusID;
            //    //    card.ActiveDate = DateTime.Now;
            //    //    cnn.SaveChanges();
            //    //    pBus.CreateHistoryes(cusID, gift.Point, SystemParam.TYPE_CARD, SystemParam.HISTORY_TYPE_ADD_ANOTHER, content, "", 0);
            //    //    return output;
            //    //}
            //    //else
            //    return null;
            //}
            //else
                return null;
        }


        // tìm kiếm
        public List<RequestDetailWebOutputModel> Search(int? Status, int? Type, string RequestCode, string FromDate, string ToDate)
        {
            try
            {
                DateTime? startdate = Util.ConvertDate(FromDate);
                DateTime? endDate = Util.ConvertDate(ToDate);

                var query = from r in cnn.Requests
                            where r.IsActive.Equals(SystemParam.ACTIVE)
                            //&& (!String.IsNullOrEmpty(RequestCode) ? r.Code.Contains(RequestCode) : true)
                            && (Status.HasValue ? r.Status == Status.Value : true)
                            && (Type.HasValue ? r.Type == Type.Value : true)
                            && (startdate.HasValue ? r.CreateDate >= startdate.Value : true)
                            orderby r.ID descending
                            select new RequestDetailWebOutputModel
                            {
                                ID = r.ID,
                                TypeGift = r.Type,
                                RequestCode = r.Code,
                                CustomerName = r.Customer.Name,
                                Status = r.Status,
                                CreateDate = r.CreateDate
                            };
                int count = query.Count();
                if (endDate.HasValue)
                {
                    query = query.Where(u => u.CreateDate.Value.Day <= endDate.Value.Day && u.CreateDate.Value.Month <= endDate.Value.Month && u.CreateDate.Value.Year <= endDate.Value.Year);
                }
                if (query != null && query.Count() > 0)
                {
                    List<RequestDetailWebOutputModel> list = query.ToList();
                    if (!String.IsNullOrEmpty(RequestCode))
                        list = list.Where(u => Util.Converts(u.CustomerName.ToLower()).Contains(Util.Converts(RequestCode.ToLower())) || (u.RequestCode.ToLower()).Contains(RequestCode.ToLower())).ToList();
                    return list;

                }
                else
                {
                    return new List<RequestDetailWebOutputModel>();
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<RequestDetailWebOutputModel>();
            }
        }
        // Lấy thông tin chi tiết 1 yêu cầu đổi quà
        public RequestDetailWebOutputModel GetRequestDetail(int RequestID)
        {
            try
            {
                RequestDetailWebOutputModel requestDetail = new RequestDetailWebOutputModel();

                var query = (from r in cnn.Requests
                             join c in cnn.Customers on r.CustomerID equals c.ID
                             join g in cnn.Gifts on r.GiftID equals g.ID
                             where r.IsActive.Equals(SystemParam.ACTIVE) && r.ID.Equals(RequestID)
                             select new RequestDetailWebOutputModel
                             {
                                 ID = r.ID,
                                 RequestCode = r.Code,
                                 TypeGift = r.Type,
                                 GiftName = g.Name,
                                 Point = r.Point,
                                 CustomerID = r.CustomerID,
                                 CustomerName = c.Name,
                                 CustomerPhone = c.Phone,
                                 CustomerAddress = c.Address,
                                 Note = r.Note,
                                 Status = r.Status,
                                 CreateDate = r.CreateDate
                             }).FirstOrDefault();
                if (query != null && query.ID > 0)
                {
                    return requestDetail = query;
                }
                return requestDetail;
            }
            catch
            {
                return new RequestDetailWebOutputModel();
            }
        }

        // chấp nhận yêu cầu đổi quà
        public int AcceptRequest(int StatusRequest, int RequestID, int CustomerID, string RequestGiftName, string Note, int UserModifiedID)
        {
            try
            {
                //Request request = cnn.Requests.Find(RequestID);
                ////xác nhận yêu cầu đổi quà
                //if (StatusRequest == SystemParam.STATUS_REQUEST_ACCEPTED)
                //{
                //    // gửi thông báo cho khách hàng: truyền ID và type đổi quà là 4 thôi.
                //    NotifyBusiness notifyBusiness = new NotifyBusiness();
                //    notifyBusiness.CreateNoti(CustomerID, SystemParam.TYPE_REQUEST_NOTIFY, 0, 0, Note, "Yêu cầu đổi " + RequestGiftName + " của bạn đã được đồng ý.");

                //    request.UserModifiedID = UserModifiedID;
                //    request.Note = Note;
                //    request.Status = SystemParam.STATUS_REQUEST_ACCEPTED;
                //}
                //else
                //    //hủy yêu cầu đổi quà, hoàn lại điểm cho khách hàng
                //    if (StatusRequest == SystemParam.STATUS_REQUEST_CANCEL)
                //{
                //    // gửi thông báo cho khách hàng: truyền ID và type đổi quà là 4 thôi.
                //    NotifyBusiness notifyBusiness = new NotifyBusiness();
                //    notifyBusiness.CreateNoti(CustomerID, SystemParam.TYPE_REQUEST_NOTIFY, 0, 0, Note, "Yêu cầu đổi " + RequestGiftName + " của bạn đã bị hủy.");

                //    RequestDetailWebOutputModel data = cnn.Requests.Where(u =>
                //    u.IsActive.Equals(SystemParam.ACTIVE) &&
                //    u.ID.Equals(RequestID)).Select(u => new RequestDetailWebOutputModel { RequestCode = u.Code, Point = u.Point }).FirstOrDefault();

                //    request.UserModifiedID = UserModifiedID;
                //    request.Note = Note;
                //    request.Status = SystemParam.STATUS_REQUEST_CANCEL;

                //    //khi hủy, cộng lại số điểm khách hàng đã yêu cầu đổi quà trước đó
                //    Customer customer = cnn.Customers.Find(CustomerID);
                //    customer.Point += request.Point;
                //}
                //cnn.SaveChanges();
                //if (StatusRequest == SystemParam.STATUS_REQUEST_CANCEL)
                //{
                //    PointBusiness pointBusiness = new PointBusiness();
                //    pointBusiness.CreateHistoryes(CustomerID, request.Point, SystemParam.HISTORY_POINT_CANCEL_REQUEST, SystemParam.HISTORY_TYPE_ADD_ANOTHER, request.Code, "Yêu cầu đổi " + RequestGiftName + " của bạn bị hủy.", 0);
                //}
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        //public int DeleteRequest(int RequestID)
        //{
        //    try
        //    {
        //        Request request = cnn.Requests.Find(RequestID);
        //        if (request.Status == SystemParam.STATUS_REQUEST_PENDING)
        //        {
        //            request.IsActive = SystemParam.NO_ACTIVE_DELETE;
        //            cnn.SaveChanges();
        //            return SystemParam.SUCCESS;
        //        }
        //        else
        //        {
        //            return SystemParam.DELETE_REQUEST_FAIL;
        //        }

        //    }
        //    catch
        //    {
        //        return SystemParam.ERROR;
        //    }
        //}

        // thống kê đổi quà
        public List<ListStaticGiftModel> SearchStatisticGift(string CusName, int? GiftType, string FromDate, string ToDate)
        {
            try
            {
                List<ListStaticGiftModel> query = new List<ListStaticGiftModel>();
                var listRequest = from r in cnn.Requests
                                  where r.IsActive.Equals(SystemParam.ACTIVE) && r.Status.Equals(SystemParam.STATUS_REQUEST_ACCEPTED)
                                  orderby r.ID descending
                                  select new ListStaticGiftModel
                                  {
                                      CusName = r.Customer.Name,
                                      Type = r.Type,
                                      GiftName = r.Gift.Name,
                                      Point = r.Point,
                                      Price = r.Gift.Price,
                                      CreateDate = r.CreateDate
                                  };

                //if (CusName != null)
                //    listRequest = listRequest.Where(x => x.CusName.Contains(CusName));

                if (GiftType != null)
                {
                    listRequest = listRequest.Where(x => x.Type == GiftType);
                }
                if (FromDate != null && FromDate != "")
                {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    listRequest = listRequest.Where(x => x.CreateDate >= fd);
                }
                if (ToDate != null && ToDate != "")
                {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    listRequest = listRequest.Where(x => x.CreateDate <= td);
                }
                if (listRequest != null && listRequest.Count() > 0)
                {
                    query = listRequest.ToList();
                    if (!String.IsNullOrEmpty(CusName))
                        query = query.Where(u => Util.Converts(u.CusName.ToLower()).Contains(Util.Converts(CusName.ToLower()))).ToList();
                }
                return query;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ListStaticGiftModel>();
            }
        }

        //public string CountRequest()
        //{
        //    var lsRequest = cnn.Requests.Where(u => u.IsActive.Equals(SystemParam.ACTIVE));
        //    //int totalRequest = lsRequest.Count();
        //    int requestSuccess = lsRequest.Where(u => u.Status.Equals(SystemParam.STATUS_REQUEST_PENDING)).Count();
        //    //return requestSuccess + " / " + totalRequest;
        //}


        // xuất excel
        public ExcelPackage ExportExcel(string fromDate, string toDate, int? status, int? typeRequest, string codeOrCusName)
        {
            try
            {
                FileInfo file = new FileInfo(HttpContext.Current.Server.MapPath(@"/Template/DS_yeu_cau_doi_qua.xlsx"));
                ExcelPackage pack = new ExcelPackage(file);
                ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                int row = 2;
                int stt = 1;

                var list = Search(status, typeRequest, codeOrCusName, fromDate, toDate);
                /*if (fromDate != null && fromDate != "")
                {
                    DateTime? fd = Util.ConvertDate(fromDate);
                    list = list.Where(r => r.CreateDate >= fd.Value);
                }

                if(toDate != null && toDate != "")
                {
                    DateTime? td = Util.ConvertDate(toDate);
                    list = list.Where(r => r.CreateDate <= td.Value);
                }

                if(status != null)
                {
                    list = list.Where(r => r.Status == status);
                }

                if(typeRequest != null)
                {
                    list = list.Where(r => r.Type == typeRequest);
                }

                if(codeOrCusName != null && codeOrCusName != "")
                {
                    list = list.Where(r => r.Code.ToLower().Equals(codeOrCusName.ToLower()) || Util.Converts(r.))
                }*/

                foreach (var item in list)
                {
                    sheet.Cells[row, 1].Value = stt;
                    sheet.Cells[row, 2].Value = item.RequestCode;
                    if (item.TypeGift == SystemParam.TYPE_GIFT_GIFT)
                    {
                        sheet.Cells[row, 3].Value = "Quà tặng";
                    }
                    else if (item.TypeGift == SystemParam.TYPE_GIFT_VOUCHER)
                    {
                        sheet.Cells[row, 3].Value = "Voucher";
                    }
                    else if (item.TypeGift == SystemParam.TYPE_GIFT_CARD)
                    {
                        sheet.Cells[row, 3].Value = "Thẻ cào";
                    }
                    sheet.Cells[row, 4].Value = item.CustomerName;
                    if (item.Status == SystemParam.STATUS_REQUEST_PENDING)
                    {
                        sheet.Cells[row, 5].Value = "Chờ xác nhận";
                    }
                    else if (item.Status == SystemParam.STATUS_REQUEST_ACCEPTED)
                    {
                        sheet.Cells[row, 5].Value = "Đã xác nhận";
                    }
                    else if (item.Status == SystemParam.STATUS_REQUEST_CANCEL)
                    {
                        sheet.Cells[row, 5].Value = "Hủy";
                    }

                    sheet.Cells[row, 6].Value = item.CreateDate.Value.ToString("dd/MM/yyyy");
                    row++;
                    stt++;
                }
                return pack;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new ExcelPackage();
            }
        }

        public ExcelPackage singleRequestExport(int id)
        {
            try
            {
                var itemExport = GetRequestDetail(id);
                FileInfo file = new FileInfo(HttpContext.Current.Server.MapPath(@"/Template/Yeu_cau_doi_qua.xlsx"));
                ExcelPackage pack = new ExcelPackage(file);
                ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                sheet.Cells[2, 3].Value = itemExport.CustomerName;
                sheet.Cells[2, 7].Value = itemExport.CustomerPhone;
                sheet.Cells[3, 3].Value = itemExport.CustomerAddress;
                sheet.Cells[3, 7].Value = itemExport.CreateDate.Value.ToString("dd/MM/yyyy");
                sheet.Cells[5, 3].Value = itemExport.RequestCode;
                if (itemExport.TypeGift == SystemParam.TYPE_REQUEST_GIFT)
                    sheet.Cells[5, 7].Value = "Quà tặng";
                else if (itemExport.TypeGift == SystemParam.TYPE_REQUEST_VOUCHER)
                    sheet.Cells[5, 7].Value = "Voucher";
                sheet.Cells[6, 3].Value = @String.Format("{0:0,0}", itemExport.Point);
                sheet.Cells[6, 7].Value = itemExport.GiftName;
                switch (itemExport.Status)
                {
                    case SystemParam.STATUS_REQUEST_PENDING:
                        sheet.Cells[7, 3].Value = "Chờ";
                        break;
                    case SystemParam.STATUS_REQUEST_ACCEPTED:
                        sheet.Cells[7, 3].Value = "Đã xác nhận";
                        break;
                    case SystemParam.STATUS_REQUEST_CANCEL:
                        sheet.Cells[7, 3].Value = "Hủy";
                        break;
                }
                sheet.Cells[7, 7].Value = itemExport.Note;
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
