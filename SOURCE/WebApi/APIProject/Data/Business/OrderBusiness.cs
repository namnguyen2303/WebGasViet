using Data.DB;
using Data.Model;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using static Data.Model.APIWeb.OrderDetailEditOutput;

namespace Data.Business
{
    public class OrderBusiness : GenericBusiness
    {
        public OrderBusiness(DEKKOEntities context = null) : base()
        {

        }
        MembersPointHistory hisPoint = new MembersPointHistory();
        PointBusiness pointBus = new PointBusiness();
        PackageBusiness packageBus = new PackageBusiness();
        ShopBusiness shopBus = new ShopBusiness();
        NotifyBusiness notiBus = new NotifyBusiness();

        // tìm kiếm đơn hàng
        public List<Model.APIWeb.OrderOutputModel> Search(int? Agent, int? Customer, int? Status, string FromDate, string ToDate, string Code)
        {
            try
            {
                var customer = cnn.Customers;
                var query = from oi in cnn.OrderItems
                            where oi.Order.IsActive.Equals(SystemParam.ACTIVE)
                            select new Model.APIWeb.OrderOutputModel
                            {
                                ID = oi.ID,
                                CustomerID = oi.Order.Customer.ID,
                                Code = oi.Order.Code,
                                BuyerName = oi.Order.BuyerName,
                                BuyerPhone = oi.Order.BuyerPhone,
                                BuyerAddress = oi.Order.BuyerAddress,
                                CustomerName = oi.Order.CustomerID.HasValue ? oi.Order.Customer.Name : "",
                                CustomerRole = oi.Order.CustomerID.HasValue ? oi.Order.Customer.Role : 0,
                                Phone = oi.Order.CustomerID.HasValue ? oi.Order.Customer.Phone : "",
                                ItemName = oi.Item.Name,
                                Point = oi.Discount,
                                TotalPrice = oi.Order.TotalPrice,
                                Status = oi.Order.Status,
                                CreateDate = oi.Order.CreateDate,
                                OrderActive = oi.Order.IsActive,
                                OrderID = oi.Order.ID,
                                AgentID = oi.Order.Agent_id,
                                AgentName = oi.Order.Agent_id.HasValue ? oi.Order.Customer1.Name : "",
                                QTY = oi.QTY,
                            };
                if (Status != null)
                {
                    query = query.Where(x => x.Status.Equals(Status.Value));
                }
                if (Code != "" && Code != null)
                {
                    query = query.Where(x => x.Code.Contains(Code) || x.BuyerName.Contains(Code));
                }
                if (Agent != null)
                {
                    query = query.Where(x => x.AgentID == Agent);
                }
                if (Customer != null)
                {
                    query = query.Where(x => x.CustomerID == Customer);
                }
                if (FromDate != "" && FromDate != null)
                {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(x => x.CreateDate >= fd);
                }
                if (ToDate != "" && ToDate != null)
                {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(x => x.CreateDate <= td);
                }

                if (query != null && query.Count() > 0)
                {
                    query.Where(x => x.OrderActive == 1);
                    return query.OrderByDescending(x => x.OrderID).ToList();
                }
                else
                    return new List<Model.APIWeb.OrderOutputModel>();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<Model.APIWeb.OrderOutputModel>();
            }
        }
        //Search cusName autocomplete
        public Array SearchCusName(string Name)
        {
            string[] cusName = (from c in cnn.Orders.Where(c => c.BuyerName.Contains(Name))
                                where c.IsActive.Equals(SystemParam.ACTIVE)
                                select c.BuyerName).ToArray();
            return cusName;
        }
        public OrderDetailOutputModel GetOrderDetail(int orderID, int? cusID)
        {
            Order order = cnn.Orders.Find(orderID);
            Customer cus = null;
            if (cusID.HasValue)
                cus = cnn.Customers.Find(cusID.Value);
            double Distance = 0;
            if (cus != null && cus.Role == SystemParam.ROLE_ADMIN)
                Distance = shopBus.Distance(cus.Shop.Lati, cus.Shop.Long, (!order.lat.HasValue ? SystemParam.LAT_DEFAUL : order.lat.Value), (!order.lon.HasValue ? SystemParam.LON_DEFAUL : order.lon.Value));
            OrderDetailOutputModel data = (from o in cnn.Orders
                                           where o.IsActive.Equals(SystemParam.ACTIVE) && o.ID.Equals(orderID)
                                           select new OrderDetailOutputModel
                                           {
                                               OrderID = o.ID,
                                               TotalPrice = o.TotalPrice,
                                               Status = o.Status,
                                               lon = o.lon.HasValue ? o.lon.Value : SystemParam.LON_DEFAUL,
                                               lat = o.lat.HasValue ? o.lat.Value : SystemParam.LAT_DEFAUL,
                                               Qty = o.OrderItems.Count() > 0 ? o.OrderItems.Select(u => u.QTY).ToList().Sum() : 0,
                                               Code = o.Code,
                                               CreateDate = o.CreateDate,
                                               CompleteDate = o.CompletionDate,
                                               ConfirmDate = o.ConfirmDate,
                                               Discount = o.Discount,
                                               DeviceID = String.IsNullOrEmpty(o.DeviceID) ? "" : o.DeviceID,
                                               Distance = Distance,
                                               CustomerID = o.CustomerID.HasValue ? o.CustomerID.Value : 0,
                                               AgentID = o.Agent_id,
                                               BuyerName = String.IsNullOrEmpty(o.BuyerName) ? o.Customer.Name : o.BuyerName,
                                               BuyerPhone = String.IsNullOrEmpty(o.BuyerPhone) ? o.Customer.Phone : o.BuyerPhone,
                                               BuyerAddress = String.IsNullOrEmpty(o.BuyerAddress) && o.BuyerAddress.Length > 0 ? (!String.IsNullOrEmpty(o.Customer.Address) ? (o.Customer.Address + " , " + o.Customer.District.Name + " , " + o.Customer.Province.Name) : (o.Customer.District.Name + " , " + o.Customer.Province.Name)) : o.BuyerAddress,
                                               ShopName = o.Customer1.Name,
                                               ShopPhone = o.Customer1.Phone,
                                               ShopAddress = !String.IsNullOrEmpty(o.Customer1.Address) && o.Customer1.Address.Length > 0 ? (o.Customer1.Address + " , " + o.Customer1.District.Name + " , " + o.Customer1.Province.Name) : (o.Customer1.District.Name + " , " + o.Customer1.Province.Name),
                                               Note = o.Note,
                                               listOrderItem = o.OrderItems.Select(oi => new OrderDetailModel
                                               {
                                                   ItemID = oi.ItemID,
                                                   ItemName = oi.Item.Name,
                                                   ItemPrice = oi.SumPrice,
                                                   Qty = oi.QTY,
                                                   AgentPrice = oi.Item.Price,
                                                   Uri = oi.Item.ImageUrl,
                                                   Brand = oi.Item.Brand,
                                                   MadeIn = oi.Item.MadeIn,
                                                   Warranty = oi.Item.Warranty
                                               }).ToList(),
                                               Uri = o.OrderItems.Select(oi => oi.Item.ImageUrl).FirstOrDefault(),
                                           }).OrderByDescending(u => u.OrderID).FirstOrDefault();

            return data;
        }

        public Model.APIApp.OrderOutputModel CreateOrder(List<OrderDetailModel> lsOrderItem, int? cusID, OrderDetailOutputModel item)
        {

            Order od = new Order();

            List<OrderItem> listOI = CreateOrderItem(lsOrderItem);
            double lon = item.lon.HasValue ? item.lon.Value : SystemParam.LON_DEFAUL;
            double lat = item.lat.HasValue ? item.lat.Value : SystemParam.LAT_DEFAUL;
            od.Code = Util.CreateMD5(DateTime.Now.ToString()).Substring(0, 6);
            od.Status = 0;
            od.IsActive = SystemParam.ACTIVE;
            od.CreateDate = DateTime.Now;
            if (cusID != null)
            {
                od.CustomerID = cusID;
                Customer cuss = cnn.Customers.Find(cusID.Value);
                cuss.longitude = lon;
                cuss.latitude = lat;
            }
            od.DeviceID = item.DeviceID;
            od.TotalPrice = listOI.Select(u => u.SumPrice).Sum();
            od.PointAdd = listOI.Select(u => u.Discount).Sum();
            od.Discount = listOI.Select(u => u.Discount).Sum();
            od.OrderItems = listOI;
            od.BuyerName = item.BuyerName;
            od.BuyerPhone = item.BuyerPhone;
            od.BuyerAddress = item.BuyerAddress;
            od.Note = item.Note;
            od.lon = item.lon;
            od.lat = item.lat;
            List<Customer> listCus = cnn.Customers.Where(u => u.Role.Equals(SystemParam.ROLE_ADMIN) && u.ShopID.HasValue && u.Point >= od.Discount && u.IsActive.Equals(SystemParam.ACTIVE) && !u.ID.Equals(SystemParam.CUSTOMER_DEFAULT) && u.DeviceID.Length > 0).ToList();
            List<AgentModel> lsAgent = listCus.Select(u => new AgentModel
            {
                deviceID = u.DeviceID,
                distance = shopBus.Distance(u.Shop.Lati, u.Shop.Long, lat, lon),
                ID = u.ID
            }).Where(u => u.distance <= cnn.Configsses.Where(c => c.NameConst.Equals("Distance")).Select(c => c.ValueConst).FirstOrDefault()).OrderBy(u => u.distance).ToList();
            string list = "";
            foreach (var agent in lsAgent)
            {
                list += (agent.ID.ToString() + ",");
            }
            od.listCustomer = list;
            od.LastPushAt = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            cnn.Orders.Add(od);
            cnn.SaveChanges();
            int id = cnn.Orders.OrderByDescending(u => u.ID).FirstOrDefault().ID;
            SendRequest(id);
            return GetOrderDetail(id, cusID);

        }

        public void FindListOrderWaitting()
        {
            int timeStame = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds - (cnn.Configsses.Where(u => u.NameConst.Equals("TimeWaiting")).Select(u => u.ValueConst).FirstOrDefault() / 1000);
            List<int> listOrderID = cnn.Orders.Where(u => u.Status.Equals(0) && u.LastPushAt <= timeStame).Select(u => u.ID).ToList();
            foreach (int orderID in listOrderID)
            {
                SendRequest(orderID);
            }
        }
        public List<OrderItem> CreateOrderItem(List<OrderDetailModel> lsOrderItem)
        {
            List<OrderItem> lsOI = new List<OrderItem>();
            foreach (var orderItem in lsOrderItem)
            {
                Item item = cnn.Items.Find(orderItem.ItemID);
                if (item != null && item.Status.Equals(SystemParam.ACTIVE))
                {
                    OrderItem oi = new OrderItem();
                    oi.ItemID = orderItem.ItemID;
                    oi.QTY = orderItem.Qty;
                    oi.SumPrice = item.DiscountPrice * orderItem.Qty;
                    oi.Discount = item.Point.HasValue ?  item.Point.Value * orderItem.Qty : 0;
                    oi.Status = SystemParam.ACTIVE;
                    oi.IsActive = SystemParam.ACTIVE;
                    oi.CreateDate = DateTime.Now;
                    lsOI.Add(oi);
                }
            }
            return lsOI;
        }

        public void SenotiForAllCustomer()
        {
            if (DateTime.Now.Hour == 8 && DateTime.Now.Minute == 0)
            {
                var listCustomer = cnn.Customers.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.ID != SystemParam.CUSTOMER_DEFAULT && u.Point <= SystemParam.MIN_MONEY_SENNOTI && u.Role.Equals(SystemParam.ROLE_ADMIN)).ToList();
                listCustomer = listCustomer.Where(u => u.ExpireTocken.AddDays(3).Date < DateTime.Today).ToList();
                foreach (Customer cus in listCustomer)
                {
                    DataOnesignal datta = new DataOnesignal();
                    datta.type = SystemParam.HAVE_A_NEW_NOTI;
                    datta.deviceID = cus.DeviceID;
                    string value = StartPushNoti(datta, cus.DeviceID, "Tài khoản của quý khách dưới " + SystemParam.MIN_MONEY_SENNOTI + " để tiếp tục sử dụng dịch vụ vui lòng nạp thêm tiền vào tài khoản", cus.Role);
                    PushOneSignal(value);
                    cus.ExpireTocken = DateTime.Now;
                }
                cnn.SaveChanges();
            }
        }
        public string StartPushNoti(object obj, string deviceID, string contents,int role)
        {
            OneSignalInputs input = new OneSignalInputs();
            TextInput header = new TextInput();
            header.en = "Bạn có thông báo mới";
            TextInput content = new TextInput();
            content.en = String.IsNullOrEmpty(contents) ? "Bạn vừa có một đơn hàng mới" : contents;
            input.app_id = SystemParam.APP_ID;
            input.data = obj;
            input.headings = header;
            input.contents = content;
            input.android_channel_id = role == SystemParam.ROLL_CUSTOMER ? SystemParam.ANDROID_CHANNEL_ID_DEFAULTS  : SystemParam.ANDROID_CHANNEL_IDS;
            string a = deviceID;
            List<string> lsString = new List<string>();
            lsString.Add(a);
            input.include_player_ids = lsString;
            return JsonConvert.SerializeObject(input);
        }

        public int CreatePackageHistory(AddPointIntPutModel item, int custID)
        {
            BuyPackageHistory bph = new BuyPackageHistory();
            ServicePackage service = cnn.ServicePackages.Find(item.PackageID);
            bph.CustomerID = custID;
            bph.PackageID = item.PackageID;
            bph.Price = service.Price;
            bph.Status = 0;
            bph.CreateDate = DateTime.Now;
            cnn.BuyPackageHistories.Add(bph);
            cnn.SaveChanges();
            return cnn.BuyPackageHistories.OrderByDescending(u => u.ID).FirstOrDefault().ID;

        }

        public void SendRequest(int orderID)
        {
            Order order = cnn.Orders.Find(orderID);
            string[] words = order.listCustomer.Split(',');
            if (words.Count() > 0 && order.listCustomer.Length > 0)
            {
                Customer cus = cnn.Customers.Find(int.Parse(words[0]));
                string list = "";
                for (int index = 1; index < words.Count(); index++)
                {
                    if (words[index].Length > 0)
                        list += (words[index] + ",");
                }
                order.listCustomer = list;
                order.LastPushAt = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                cnn.SaveChanges();
                if (cus != null)
                {
                    DataOnesignal datta = new DataOnesignal();
                    datta.type = SystemParam.HAVE_A_NEW_ORDER;
                    datta.orderID = order.ID;
                    datta.deviceID = cus.DeviceID;
                    datta.timeWait = cnn.Configsses.Where(u => u.NameConst.Equals("TimeWaiting")).Select(u => u.ValueConst).FirstOrDefault() / 1000;
                    string value = StartPushNoti(datta, cus.DeviceID, null,cus.Role);
                    PushOneSignal(value);
                }
            }
            else
            {
                Customer cus = cnn.Customers.Find(SystemParam.CUSTOMER_DEFAULT);
                order.Status = SystemParam.STATUS_REQUEST_SUCCESS;
                order.Agent_id = SystemParam.CUSTOMER_DEFAULT;
                order.ConfirmDate = DateTime.Now;
                cnn.SaveChanges();
                if (order.CustomerID != null)
                    notiBus.CreateNoti(order.CustomerID.Value, SystemParam.TYPE_NOTI_CONFIRM_ORDER, orderID, "", "", null);
                else
                    notiBus.PushNotify(orderID, "", 1, null);
                notiBus.CreateNoti(order.Agent_id.Value, SystemParam.AGENT_DEFAULT_TYPE, orderID, "", "", null);
            }
        }
        public void PushOneSignal(string value)
        {

            string url = SystemParam.URL_ONESIGNAL;

            var request = HttpWebRequest.Create(string.Format(url));

            request.Headers["Authorization"] = SystemParam.Authorization;
            request.Headers["https"] = SystemParam.URL_BASE_https;
            var byteData = Encoding.UTF8.GetBytes(value);
            request.ContentType = "application/json";
            request.Method = "POST";
            try
            {
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteData, 0, byteData.Length);
                }
                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            }
            catch (WebException e)
            {
            }
        }
        public List<OrderDetailOutputModel> GetListOrderByStatus(int? status, int cusID)
        {
            List<OrderDetailOutputModel> listOutput = new List<OrderDetailOutputModel>();
            List<OrderDetailOutputModel> query = (from o in cnn.Orders
                                                  where o.IsActive.Equals(SystemParam.ACTIVE) && (status.HasValue ? (status.Value == SystemParam.TYPE_NOTI_NEW_ORDER ? (o.Status.Equals(SystemParam.TYPE_NOTI_NEW_ORDER) || o.Status.Equals(SystemParam.TYPE_NOTI_ORDER_ADMIN)) : o.Status.Equals(status.Value)) : true)
                                                  select new OrderDetailOutputModel
                                                  {
                                                      OrderID = o.ID,
                                                      TotalPrice = o.TotalPrice,
                                                      Status = o.Status,
                                                      lon = o.lon.HasValue ? o.lon.Value : SystemParam.LON_DEFAUL,
                                                      lat = o.lat.HasValue ? o.lat.Value : SystemParam.LAT_DEFAUL,
                                                      Qty = o.OrderItems.Count() > 0 ? o.OrderItems.Select(u => u.QTY).ToList().Sum() : 0,
                                                      Code = o.Code,
                                                      CreateDate = o.CreateDate,
                                                      CompleteDate = o.CompletionDate,
                                                      ConfirmDate = o.ConfirmDate,
                                                      Discount = o.Discount,
                                                      DeviceID = String.IsNullOrEmpty(o.DeviceID) ? "" : o.DeviceID,
                                                      Distance = o.Distance.HasValue ? o.Distance.Value : 0,
                                                      CustomerID = o.CustomerID.HasValue ? o.CustomerID.Value : 0,
                                                      AgentID = o.Agent_id,
                                                      BuyerName = String.IsNullOrEmpty(o.BuyerName) ? o.Customer.Name : o.BuyerName,
                                                      BuyerPhone = String.IsNullOrEmpty(o.BuyerPhone) ? o.Customer.Phone : o.BuyerPhone,
                                                      BuyerAddress = String.IsNullOrEmpty(o.BuyerAddress) && o.BuyerAddress.Length > 0 ? (!String.IsNullOrEmpty(o.Customer.Address) ? (o.Customer.Address + " , " + o.Customer.District.Name + " , " + o.Customer.Province.Name) : (o.Customer.District.Name + " , " + o.Customer.Province.Name)) : o.BuyerAddress,
                                                      ShopName = o.Customer1.Name,
                                                      ShopPhone = o.Customer1.Phone,
                                                      ShopAddress = !String.IsNullOrEmpty(o.Customer1.Address) && o.Customer1.Address.Length > 0 ? (o.Customer1.Address + " , " + o.Customer1.District.Name + " , " + o.Customer1.Province.Name) : (o.Customer1.District.Name + " , " + o.Customer1.Province.Name),
                                                      Note = o.Note,
                                                      listOrderItem = o.OrderItems.Select(oi => new OrderDetailModel
                                                      {
                                                          ItemID = oi.ItemID,
                                                          ItemName = oi.Item.Name,
                                                          ItemPrice = oi.SumPrice,
                                                          Qty = oi.QTY,
                                                          AgentPrice = oi.Item.Price,
                                                          Uri = oi.Item.ImageUrl,
                                                          Brand = oi.Item.Brand,
                                                          MadeIn = oi.Item.MadeIn,
                                                          Warranty = oi.Item.Warranty
                                                      }).ToList(),
                                                      Uri = o.OrderItems.Select(oi => oi.Item.ImageUrl).FirstOrDefault(),
                                                  }).OrderByDescending(u => u.OrderID).ToList();
            if (query != null && query.Count() > 0)
            {
                Customer cus = cnn.Customers.Find(cusID);
                if (cus.Role == SystemParam.ROLL_CUSTOMER)
                    listOutput = query.Where(u => u.CustomerID.Equals(cusID)).ToList();
                else
                    listOutput = query.Where(u => u.AgentID.HasValue && u.AgentID.Value.Equals(cusID)).ToList();
                if (status.HasValue)
                {
                    switch (status.Value)
                    {
                        case SystemParam.TYPE_NOTI_CONFIRM_ORDER:
                            {
                                listOutput = listOutput.OrderByDescending(u => u.ConfirmDate).ToList();
                                break;
                            }
                        case SystemParam.TYPE_NOTI_ORDER_CUSSCESS:
                            {
                                listOutput = listOutput.OrderByDescending(u => u.CompleteDate).ToList();
                                break;
                            }

                    }

                }

                return listOutput;
            }
            else
                return new List<OrderDetailOutputModel>();

        }
        public OrderDetailEditOutput ItemEdit(int ID)
        {
            try
            {
                var order = cnn.Orders.Find(ID);
                var customer = cnn.Customers;
                OrderDetailEditOutput edit = new OrderDetailEditOutput();

                edit.order = order;
                edit.OrderStatus = order.Status;
                edit.BuyerName = order.BuyerName;
                edit.BuyerAddress = order.BuyerAddress;
                edit.BuyerPhone = order.BuyerPhone;
                edit.AgentAddress = customer.Find(order.Agent_id).Address;
                edit.AgentName = customer.Find(order.Agent_id).Name;
                edit.AgentPhone = customer.Find(order.Agent_id).Phone;


                string codeOrder = order.Code;
                var queryFindPoint = cnn.MembersPointHistories.Where(x => x.AddPointCode.Equals(codeOrder));
                if (queryFindPoint != null && queryFindPoint.Count() > 0)
                {
                    edit.addPoint = queryFindPoint.ToList().LastOrDefault().Point;
                }

                //edit.OrderID = query.ID;
                //edit.Code = query.Code;
                //edit.CusName = query.Customer.Name;
                //edit.Phone = query.Customer.Phone;
                //edit.CreateDate = query.CreateDate;
                ////edit.AgentCode = query.Customer.AgentCode;
                //edit.Status = query.Status;
                //edit.TotalPrice = query.TotalPrice + query.Discount;
                //edit.Discount = query.Discount * 100 / (query.TotalPrice + query.Discount);
                //edit.BuyerName = query.BuyerName;
                //edit.BuyerPhone = query.BuyerPhone;
                //edit.BuyerAddress = query.BuyerAddress;

                edit.ListItem = (from oi in cnn.OrderItems
                                 where oi.IsActive.Equals(SystemParam.ACTIVE) && oi.OrderID.Equals(ID)
                                 select new OrderItemEdit
                                 {
                                     ItemID = oi.ItemID,
                                     ItemName = oi.Item.Name,
                                     ItemCode = oi.Item.Code,
                                     ItemQTY = oi.QTY,
                                     ItemPrice = cnn.Items.Where(u => u.ID.Equals(oi.ItemID)).FirstOrDefault().Price,
                                     ItemTotalPrice = oi.SumPrice,
                                 }).ToList();
                return edit;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new OrderDetailEditOutput();
            }
        }
        //public int SaveEdit(int ID, int Status, int? AddPoint, string BuyerName, string BuyerPhone, string BuyerAddress, long TotalPrice, int Discount)
        //{
        //    try
        //    {
        //        NotifyBusiness notifyBusiness = new NotifyBusiness();
        //        var itemEdit = cnn.Orders.Find(ID);
        //        if (Status == SystemParam.STATUS_GIFT_CANCEL && itemEdit.Status != Status)
        //        {
        //            notifyBusiness.CreateNoti(itemEdit.CustomerID, SystemParam.TYPE_ORDER_NOTIFY, 0, 0, "Đơn hàng " + itemEdit.Code + " đã bị hủy", "");
        //        }
        //        else if (Status == SystemParam.ORDER_STATUS_PROCESS && itemEdit.Status != Status)
        //        {
        //            notifyBusiness.CreateNoti(itemEdit.CustomerID, SystemParam.TYPE_ORDER_NOTIFY, 0, 0, "Đơn hàng "+ itemEdit .Code+ " đã được xác nhận", "");
        //        }
        //        else if (Status == SystemParam.ORDER_STATUS_REFUSE && itemEdit.Status != Status)
        //        {
        //            notifyBusiness.CreateNoti(itemEdit.CustomerID, SystemParam.TYPE_ORDER_NOTIFY, 0, 0, "Đơn hàng " + itemEdit.Code + " đã được thanh toán", "");
        //        }
        //        if (AddPoint != null && AddPoint.Value >= 0 && AddPoint.Value != itemEdit.PointAdd )
        //        {
        //            int point = AddPoint.Value - itemEdit.PointAdd.Value;
        //            itemEdit.Customer.Point += point;
        //            itemEdit.PointAdd = AddPoint;
        //            notifyBusiness.CreateNoti(itemEdit.CustomerID, SystemParam.TYPE_POINT_SAVE, point, 0, "", "");
        //            //pointBus.CreateHistoryes(itemEdit.CustomerID, AddPoint.Value, SystemParam.HISPOINT_HE_THONG_CONG_DIEM, SystemParam.HISTORY_TYPE_ADD_PRODUCT, itemEdit.Code, "Tích Điểm", 0);
        //        }
        //        //if (itemEdit.Discount * 100 / (itemEdit.TotalPrice + itemEdit.Discount) != Discount)
        //        //{
        //        //    long totalPriceStart = itemEdit.TotalPrice;   
        //        //    itemEdit.TotalPrice = itemEdit.TotalPrice - (Discount * itemEdit.TotalPrice / 100) + itemEdit.Discount;
        //        //    itemEdit.Discount = Discount * totalPriceStart / 100;
        //        //}
        //        itemEdit.TotalPrice = TotalPrice;
        //        itemEdit.Discount = Discount;
        //        itemEdit.BuyerName = BuyerName;
        //        itemEdit.BuyerPhone = BuyerPhone;
        //        itemEdit.BuyerAddress = BuyerAddress;
        //        itemEdit.Status = Status;
        //        cnn.SaveChanges();
        //        return SystemParam.RETURN_TRUE;
        //    }
        //    catch (Exception ex)
        //    {
        //        ex.ToString();
        //        return SystemParam.RETURN_FALSE;
        //    }
        //}
        public int DeleteOrder(int ID)
        {
            try
            {
                var ItemDel = cnn.Orders.Find(ID);
                ItemDel.IsActive = SystemParam.NO_ACTIVE_DELETE;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public string countOrder()
        {
            int isDone = cnn.Orders.Count(x => x.Status == 0 && x.IsActive == 1);
            int orderCount = cnn.Orders.Where(x => x.IsActive == 1).Count();
            return cnn.Orders.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).Count().ToString();
        }

        // xuất Excel
        //public ExcelPackage ExportBill(int ID, string userName)
        //{
        //    try
        //    {
        //        OrderDetailEditOutput Bill = ItemEdit(ID);
        //        string path = HttpContext.Current.Server.MapPath(@"/Template/BillForm.xlsx");
        //        FileInfo file = new FileInfo(path);
        //        ExcelPackage pack = new ExcelPackage(file);
        //        ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
        //        sheet.Cells[3, 3].Value = Bill.Code;
        //        sheet.Cells[4, 3].Value = Bill.CreateDate.ToString("dd/MM/yyyy hh:mm");
        //        sheet.Cells[5, 3].Value = userName;
        //        sheet.Cells[7, 3].Value = Bill.BuyerName;
        //        sheet.Cells[8, 3].Value = Bill.BuyerPhone;
        //        sheet.Cells[9, 3].Value = Bill.BuyerAddress;

        //        if (Bill.AgentCode != null)
        //            sheet.Cells[10, 3].Value = Bill.AgentCode;

        //        if (Bill.Status == SystemParam.ORDER_STATUS_REFUSE)
        //        {
        //            sheet.Cells[11, 3].Value = "Đã Thanh Toán";
        //        }
        //        else
        //        {
        //            sheet.Cells[11, 3].Value = "Xác Nhận";
        //        }

        //        int row = 14;
        //        int stt = 1;
        //        foreach (var item in Bill.ListItem)
        //        {
        //            sheet.Cells[row, 1].Value = stt.ToString();
        //            sheet.Cells[row, 1].AutoFitColumns();
        //            sheet.Cells[row, 2].Value = item.ItemCode;
        //            sheet.Cells[row, 2].AutoFitColumns();
        //            sheet.Cells[row, 3].Value = item.ItemName;
        //            sheet.Cells[row, 3].AutoFitColumns();
        //            sheet.Cells[row, 4].Value = item.ItemQTY.ToString();
        //            sheet.Cells[row, 4].AutoFitColumns();
        //            sheet.Cells[row, 5].Value = @String.Format("{0:0,0}", item.ItemPrice);
        //            sheet.Cells[row, 5].AutoFitColumns();
        //            sheet.Cells[row, 6].Value = @String.Format("{0:0,0}", item.ItemTotalPrice);
        //            sheet.Cells[row, 6].AutoFitColumns();
        //            row++;
        //            stt++;
        //        }
        //        sheet.Cells[13, 2].AutoFitColumns();
        //        sheet.Cells[row + 1, 5].Value = "Tổng Tiền:";
        //        sheet.Cells[row + 1, 6].Value = @String.Format("{0:0,0}", Bill.TotalPrice);
        //        sheet.Cells[row + 2, 5].Value = "Chiết Khấu:";
        //        sheet.Cells[row + 2, 6].Value = @String.Format("{0:0,0}", Bill.Discount * Bill.TotalPrice / 100);
        //        sheet.Cells[row + 3, 5].Value = "Tiền Thanh Toán:";
        //        sheet.Cells[row + 3, 6].Value = @String.Format("{0:0,0}", Bill.TotalPrice - (Bill.Discount * Bill.TotalPrice / 100));

        //        if (Bill.Status == 2)
        //        {
        //            sheet.Cells[row + 4, 5].Value = "Điểm Tích:";
        //            sheet.Cells[row + 4, 5].AutoFitColumns();
        //            sheet.Cells[row + 4, 6].Value = @String.Format("{0:0,0}", Bill.addPoint.Value);
        //        }
        //        int rangeLast = row + 4;
        //        sheet.Cells["E" + row + ":F" + rangeLast].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["E" + row + ":F" + rangeLast].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["E" + row + ":F" + rangeLast].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["E" + row + ":F" + rangeLast].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

        //        row -= 1;
        //        sheet.Cells["A1:F" + row].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["A1:F" + row].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["A1:F" + row].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells["A1:F" + row].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        //        sheet.Cells[row + 3, 5].AutoFitColumns();
        //        return pack;
        //    }
        //    catch (Exception e)
        //    {
        //        e.ToString();
        //        return null;
        //    }
        //}
    }
}
