using Data.DB;
using Data.Model;
using Data.Model.APIApp;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Data.Business
{
    public class NotifyBusiness : GenericBusiness
    {
        public NotifyBusiness(DEKKOEntities context = null) : base()
        {
        }
        public List<NotifiedByCustomerIDOutputModel> GetListNotify(int CusID)
        {
            List<NotifiedByCustomerIDOutputModel> query = new List<NotifiedByCustomerIDOutputModel>();
            var listnotify = from n in cnn.Notifications
                             where n.CustomerID.HasValue ? n.CustomerID.Value.Equals(CusID) : true && n.IsActive.Equals(SystemParam.ACTIVE)
                             orderby n.CreateDate descending
                             select new NotifiedByCustomerIDOutputModel
                             {
                                 NotifyID = n.ID,
                                 Content = n.Content,
                                 CreatedDate = n.CreateDate,
                                 icon = (n.orderID.HasValue && n.orderID.Value > 0)
                                 ? (n.Order.OrderItems.FirstOrDefault().Item.ImageUrl.ToLower().Contains("http") ? n.Order.OrderItems.FirstOrDefault().Item.ImageUrl : "http://" + HttpContext.Current.Request.Url.Authority + "/" + n.Order.OrderItems.FirstOrDefault().Item.ImageUrl)
                                 : (n.newID.HasValue && n.newID.Value > 0)
                                 ? (n.News.UrlImage.ToLower().Contains("http") ? n.News.UrlImage : "http://" + HttpContext.Current.Request.Url.Authority + "/" + n.News.UrlImage)
                                 : SystemParam.ORDER_FALSE,
                                 Viewed = n.Viewed,
                                 Title = n.Title,
                                 Type = n.Type.Value,
                                 Uri = n.News.UrlImage == null ? "" : n.News.UrlImage
                             };
            if (listnotify != null && listnotify.Count() > 0)
            {
                query = listnotify.ToList();
            }
            return query;
        }

        RequestAPIBusiness apiBus = new RequestAPIBusiness();
        public void CreateNoti(int cusID, int type, int orderID, string content, string title, int? newsID)
        {
            Notification noti = new Notification();
            //Create client
            Order order = cnn.Orders.Find(orderID);
            if (orderID == 0)
            {
                noti.orderID = null;
            }
            else
            {
                noti.orderID = orderID;
            }
            noti.CustomerID = cusID;
            noti.Viewed = 0;
            noti.CreateDate = DateTime.Now;
            noti.IsActive = SystemParam.ACTIVE;
            noti.Type = type;

            if (newsID != null)
            {
                News news = cnn.News.Find(newsID.Value);
                if (news != null)
                {
                    noti.newID = newsID.Value;
                }
            }
            switch (type)
            {
                case SystemParam.TYPE_NOTI_NEW_ORDER:
                    noti.Title = "Bạn vừa có một đơn hàng mới";
                    noti.Content = "Bạn vừa có một đơn hàng mới mã đơn hàng của bạn là: " + order.Code;
                    break;
                case SystemParam.TYPE_NOTI_CONFIRM_ORDER:
                    noti.Title = "Đơn hàng " + order.Code + " đã được xác nhận bởi " + order.Customer1.Name;
                    noti.Content = "Đơn hàng " + order.Code + " đã được xác nhận";
                    break;
                case SystemParam.TYPE_NOTI_ORDER_CUSSCESS:
                    noti.Title = "Đơn hàng " + order.Code + " đã hoàn thành";
                    noti.Content = "Đơn hàng " + order.Code + " đã hoàn thành";
                    break;
                case SystemParam.TYPE_NOTI_ORDER_CANCEL:
                    noti.Title = "Đơn hàng " + order.Code + " đã bị hủy";
                    noti.Content = "Đơn hàng " + order.Code + " đã bị hủy";
                    break;
                case SystemParam.AGENT_DEFAULT_TYPE:
                    noti.Title = "Bạn vừa có một đơn hàng mới";
                    noti.Content = "Bạn vừa có một đơn hàng mới mã đơn hàng của bạn là: " + order.Code;
                    break;
                case SystemParam.HISPOINT_HE_THONG_CONG_DIEM:
                    noti.Title = title;
                    noti.Content = title;
                    orderID = 0;
                    break;
                case SystemParam.HAVE_A_NEWS:
                    noti.Title = title;
                    noti.Content = content;
                    break;
                case SystemParam.CHANGE_MINUS_POINT_ITEM:
                    noti.Title = title;
                    noti.Content = content;
                    break;
            }
            cnn.Notifications.Add(noti);
            cnn.SaveChanges();
            if (newsID != null)
            {
                string a = PushNotify(newsID.Value, noti.Title, type, cusID);
            }
            else if (type != SystemParam.TYPE_NOTI_ORDER_CANCEL)
            {
                string a = PushNotify(orderID, noti.Title, type, cusID);
            }

        }

        public void CreateNotiWhenBuyPackage(int cusID, string content, string title)
        {
            Notification noti = new Notification();
            //Create client
            noti.CustomerID = cusID;
            noti.Viewed = 0;
            noti.CreateDate = DateTime.Now;
            noti.IsActive = SystemParam.ACTIVE;
            noti.Type = 6;
            noti.Title = title;
            noti.Content = content;
            cnn.Notifications.Add(noti);
            cnn.SaveChanges();
            cnn.Notifications.Add(noti);
            cnn.SaveChanges();
            string a = PushNotify(0, content, 6, null);
        }
        PackageBusiness packBus = new PackageBusiness();
        public string PushNotify(int orderID, string content, int type, int? customerID)
        {
            try
            {
                Order od = cnn.Orders.Find(orderID);
                Customer cus = cnn.Customers.Find(customerID.Value);

                string deviceID = "";
                string ct = content;

                if (od != null && type <= SystemParam.TYPE_NOTI_ORDER_CANCEL)
                {
                    deviceID = od.DeviceID;
                    if (od.CustomerID != null)
                    {
                        cus = cnn.Customers.Find(od.CustomerID.Value);
                        deviceID = cus.DeviceID;
                    }
                }
                else
                {
                    deviceID = cus.DeviceID;
                }
                switch (type)
                {

                    case SystemParam.TYPE_NOTI_CONFIRM_ORDER:
                        content = "Đơn hàng " + od.Code + " đã được xác nhận bởi " + od.Customer1.Name;
                        break;
                    case SystemParam.TYPE_NOTI_ORDER_CUSSCESS:
                        content = "Đơn hàng " + od.Code + " đã hoàn thành";
                        break;
                    case SystemParam.TYPE_NOTI_ORDER_CANCEL:
                        content = "Đơn hàng " + od.Code + " đã bị hủy";
                        break;
                }

                DataOnesignal datta = new DataOnesignal();
                datta.orderID = orderID;
                datta.type = SystemParam.HAVE_A_NEW_NOTI;
                if (type == SystemParam.AGENT_DEFAULT_TYPE || type == SystemParam.HAVE_A_NEWS || type == SystemParam.HISPOINT_HE_THONG_CONG_DIEM || type == SystemParam.CHANGE_MINUS_POINT_ITEM)
                {
                    if (type == SystemParam.AGENT_DEFAULT_TYPE)
                        deviceID = od.Customer1.DeviceID;
                    datta.type = type;
                }
                string value = packBus.StartPushNotiNewS(datta, deviceID, content, cus.Role);
                if (type <= SystemParam.TYPE_NOTI_ORDER_CANCEL)
                    value = packBus.StartPushNoti(datta, deviceID, content, cus.Role);
                string a = packBus.PushOneSignals(value);
                 return a;
            }
            catch (Exception ex)
            {
                return "Hệ thống đang bảo trì";
            }
        }

    }
}
