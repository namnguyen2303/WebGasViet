using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Data.Business
{
    public class PointBusiness : GenericBusiness
    {
        public PointBusiness(DEKKOEntities context = null) : base()
        {
        }
        NotifyBusiness notiBus = new NotifyBusiness();
        //// tặng điểm
        //public bool GreateGivePoint(GetGiftPointInputModel item, int cusID)
        //{
        //    try
        //    {
        //        Customer cusRe = cnn.Customers.Where(u => u.Phone.Equals(item.Phone) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
        //        Customer cusGi = cnn.Customers.Find(cusID);
        //        int totalPoint = getTotalPointPerDay(cusID);
        //        if (cusRe != null && cusGi.Point > item.Point + cnn.Configs.Where(u => u.Key.Equals(SystemParam.MIN_POINT)).FirstOrDefault().Value && (totalPoint + item.Point) <= cnn.Configs.Where(u => u.Key.Equals(SystemParam.MAX_POINT_PER_DAY)).FirstOrDefault().Value)
        //        {
        //            // sửa lại tổng điểm
        //            cusGi.Point -= item.Point;
        //            cusRe.Point += item.Point;

        //            cnn.SaveChanges();
        //            // người gửi
        //            CreateHistoryes(cusID, item.Point, SystemParam.TYPE_POINT_GIVE, SystemParam.HISTORY_TYPE_ADD_ANOTHER, Util.RandomString(SystemParam.SIZE_CODE, false), item.Comment, cusRe.ID);
        //            notiBus.CreateNoti(cusID, SystemParam.TYPE_POINT_GIVE, item.Point, cusRe.ID, "", "");
        //            // người nhận
        //            CreateHistoryes(cusRe.ID, item.Point, SystemParam.TYPE_POINT_RECEIVE, SystemParam.HISTORY_TYPE_ADD_ANOTHER, Util.RandomString(SystemParam.SIZE_CODE, false), item.Comment, cusID);

        //            notiBus.CreateNoti(cusRe.ID, SystemParam.TYPE_POINT_RECEIVE, item.Point, cusID, "", "");
        //            return true;
        //        }
        //        else
        //            return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        ex.ToString();
        //        return false;
        //    }
        //}
        // tích điểm
        public int CreateAddPointByWarranty(int PackageID, int cusID ,string TransactionCode)
        {
            var package = cnn.ServicePackages.Find(PackageID);
            if (package == null)
                return 0;

            Customer cus = cnn.Customers.Find(cusID);
            cus.Point += package.Point;
            cus.PointRanking += package.Point;
            cnn.SaveChanges();
            CreateHistoryes(cusID, package.Point, SystemParam.TYPE_POINT_SAVE, TransactionCode, SystemParam.COMMENT_HISTORY_ADD_POINT,0);
            return package.Point;
        }

        public List<HistoryGivePointWebOutputModel> ListHistoty(DateTime? time, int loginID)
        {
            List<HistoryGivePointWebOutputModel> query = new List<HistoryGivePointWebOutputModel>();
            var listHistory = from h in cnn.MembersPointHistories
                              where h.IsActive.Equals(SystemParam.ACTIVE)
                              orderby h.CraeteDate descending
                              select new HistoryGivePointWebOutputModel
                              {
                                  HistoryID = h.ID,
                                  CustomerID = h.CustomerID.Value,
                                  Code = h.AddPointCode,
                                  CreateDate = h.CraeteDate,
                                  CustomerName = h.Customer.Name,
                                  icon = (h.OrderID.HasValue && h.OrderID.Value > 0) ? (h.Order.OrderItems.FirstOrDefault().Item.ImageUrl.ToLower().Contains("http") ? h.Order.OrderItems.FirstOrDefault().Item.ImageUrl : "http://" + HttpContext.Current.Request.Url.Authority + "/" +  h.Order.OrderItems.FirstOrDefault().Item.ImageUrl ): SystemParam.ORDER_FALSE,
                                  Point = h.Point,
                                  Type = h.Type,
                                  Title = h.Title,
                                  Balance = h.Balance.HasValue ? h.Balance.Value : 0,
                              };
            if (listHistory != null && listHistory.Count() > 0)
            {
                query = listHistory.OrderByDescending(x => x.CreateDate).ToList();
            }
            return query;
        }
        // tạo lịch sử 
        public bool CreateHistoryes(int cusID, int point, int type, string code, string comment,int? orderID)
        {
            try
            {
                MembersPointHistory mph = new MembersPointHistory();
                MembersPointHistory mp = cnn.MembersPointHistories.Where(u => u.AddPointCode.Equals(code.Trim())).FirstOrDefault();
                if (mp != null && type == 1)
                    return false;
                Customer cus = cnn.Customers.Find(cusID);
                mph.CustomerID = cusID;
                mph.Point = point;
                mph.Type = type;
                mph.OrderID = orderID;
                mph.AddPointCode = code;
                mph.Balance = cus.Point;
                mph.CraeteDate = DateTime.Now;
                mph.IsActive = SystemParam.ACTIVE;
                switch (type)
                {
                    case 1:
                        mph.Title = "Bạn đã tích được thêm " + point + " điểm từ mã giao dịch: " + code;
                        break;
                    case 2:
                        mph.Title = "Bạn bị trừ " + point + " điểm từ mã đơn hàng " + code;
                        break;
                    case 7:
                        mph.Title = comment;
                        break;
                    case SystemParam.HISPOINT_HE_THONG_CONG_DIEM:
                        mph.Title = "Bạn vừa được cộng " + point + " Từ hệ thống";
                        break;
                }
                mph.Comment = comment;
                cnn.MembersPointHistories.Add(mph);
                cnn.SaveChanges();
                return true;
            }
            catch
            {
                return true;
            }

        }
       

        public List<ListHistoryOutputModel> Search(int Page,int? CusID, string Name, string FromDate, string ToDate)
        {
            try
            {
                List<ListHistoryOutputModel> listHistories = new List<ListHistoryOutputModel>();

                var query = from p in cnn.MembersPointHistories
                            where p.IsActive.Equals(SystemParam.ACTIVE)
                            orderby p.ID descending
                            select new ListHistoryOutputModel
                            {
                                ID = p.ID,
                                AddPointCode = p.AddPointCode,
                                Agent = p.Customer.Name,
                                Point = p.Point,
                                Comment = p.Comment,
                                CraeteDate = p.CraeteDate
                            };
                if(CusID != null)
                {
                    query = query = from p in cnn.MembersPointHistories
                                    where p.IsActive.Equals(SystemParam.ACTIVE) && p.CustomerID == CusID.Value && p.Type.Equals(SystemParam.HISPOINT_HE_THONG_CONG_DIEM)
                                    orderby p.ID descending
                                    select new ListHistoryOutputModel
                                    {
                                        ID = p.ID,
                                        AddPointCode = p.AddPointCode,
                                        Agent = p.Customer.Name,
                                        Point = p.Point,
                                        Comment = p.Comment,
                                        CraeteDate = p.CraeteDate
                                    };
                }
                if (Name != null && Name != "") {
                    query = query.Where(x => x.Agent.Contains(Name));
                }
                if (FromDate != null && FromDate != "")
                {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(u => u.CraeteDate >= fd);
                }
                if (ToDate != null && ToDate != "")
                {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(u => u.CraeteDate <= td);
                }
                if (query != null && query.Count() > 0)
                {
                    listHistories = query.OrderByDescending(x => x.CraeteDate).ToList();
                }
                return listHistories;
            }
            catch (Exception ex)
            {
                return new List<ListHistoryOutputModel>();
            }
        }

        public PointDetailOutputModel GetPointDetail(int ID)
        {
            try
            {
                var query = (from mp in cnn.MembersPointHistories
                             join c in cnn.Customers
                             on mp.CustomerID equals c.ID
                             where mp.ID.Equals(ID) && mp.IsActive.Equals(SystemParam.ACTIVE)
                             select new PointDetailOutputModel
                             {
                                 AddPointCode = mp.AddPointCode,
                                 Type = mp.Type,
                                 Balance = (int)mp.Balance,
                                 CustomerName = c.Name,
                                 Address = c.Address,
                                 Point = mp.Point,
                                 CreatDate = mp.CraeteDate,
                                 Phone = c.Phone
                             }).FirstOrDefault();
                return query;
            }
            catch
            {
                return new PointDetailOutputModel();
            }
        }
    }
}
