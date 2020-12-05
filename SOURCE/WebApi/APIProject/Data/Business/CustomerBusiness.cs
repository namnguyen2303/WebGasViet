using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Data.Business
{
    public class CustomerBusiness : GenericBusiness {
        PointBusiness pointBus = new PointBusiness();
        NotifyBusiness notiBus = new NotifyBusiness();
        public CustomerBusiness(DEKKOEntities context = null) : base() {
        }
        //public List<CustomerTopOutputModel> GetCustomerTop()
        //{
        //    List<CustomerTopOutputModel> query = new List<CustomerTopOutputModel>();
        //    var listCus = from c in cnn.Customers
        //                  where c.IsActive.Equals(SystemParam.ACTIVE) && c.Status.Equals(SystemParam.STATUS_RUNNING)
        //                  orderby c.Point descending
        //                  select new CustomerTopOutputModel
        //                  {
        //                      CustomerName = c.Name,
        //                      Point = c.Point,
        //                      UrlImage = c.AvatarUrl
        //                  };
        //    if (listCus != null && listCus.Count() > 0) {
        //        query = listCus.ToList();
        //    }
        //    return query;
        //}
        public List<Province> LoadCityCustomer() {
            List<Province> listCity = new List<Province>();
            var query = from p in cnn.Provinces
                        orderby p.Name
                        select p;

            if (query != null && query.Count() > 0) {
                listCity = query.ToList();
                return listCity;
            } else
                return new List<Province>();
        }

        public List<District> loadDistrict(int ProvinceID) {
            List<District> listDistrict = new List<District>();
            var query = from d in cnn.Districts
                        where d.ProvinceCode.Equals(ProvinceID)
                        select d;
            if (query != null && query.Count() > 0) {
                //listDistrict = query.ToList();
                return query.ToList();
            } else
                return new List<District>();
        }
        public List<ListCustomerOutputModel> Search(string FromDate, string ToDate, int? City, int? District, string Phone, int? Role, String Address) {
            List<ListCustomerOutputModel> listCustomer = new List<ListCustomerOutputModel>();
            var query = from cus in cnn.Customers
                        where cus.IsActive.Equals(SystemParam.ACTIVE) && cus.Role.Equals(0)
                        orderby cus.Name ascending
                        select new ListCustomerOutputModel {
                            CustomerID = cus.ID,
                            CustomerName = cus.Name,
                            PhoneNumber = cus.Phone,
                            Role = cus.Role,
                            Status = cus.Status,
                            DOB = cus.DOB,
                            Email = cus.Email,
                            ProvinceCode = cus.ProvinceCode,
                            DistrictCode = cus.DistrictCode,
                            TypeLogin = cus.Type,
                            Point = cus.Point,
                            CreateDate = cus.CraeteDate,
                            Sex = cus.Sex,
                            Address = cus.Address
                        };

            if (FromDate != "" && FromDate != null) {
                try {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(p => p.CreateDate.Value >= fd);
                } catch (Exception ex) {
                    ex.ToString();
                }
            }
            if (ToDate != "" && ToDate != null) {
                try {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(p => p.CreateDate.Value <= td);
                } catch (Exception ex) {
                    ex.ToString();
                }
            }

            if (Role != null)
                query = query.Where(p => p.Role == Role);

            //if (Status != null)
            //    query = query.Where(p => p.Status == Status);

            if (City != null)
                query = query.Where(p => p.ProvinceCode == City);

            if (District != null)
                query = query.Where(p => p.DistrictCode == District);


            if (query != null && query.Count() > 0) {
                listCustomer = query.ToList();
                if (!String.IsNullOrEmpty(Phone))
                    listCustomer = listCustomer.Where(u => Util.Converts(u.CustomerName.ToLower()).Contains(Util.Converts(Phone.ToLower())) || u.PhoneNumber.Contains(Phone)).ToList();

            }
            return listCustomer;
        }

        public int addPoint(string Phone, int Point, string Note) {
            try {
                //var query = cnn.Customers.Where(p => p.Phone.CompareTo(Phone) == 0);
                //Customer Cus = query.SingleOrDefault();
                //if (Cus == null || Cus.ID < 0)
                //{
                //    return 3;
                //}
                ////if (Cus.Status == 0)
                ////{
                ////    return 2;
                ////}
                //Cus.Point += Point;
                //cnn.SaveChanges();
                //notiBus.CreateNoti(Cus.ID, SystemParam.TYPE_ADD_POINT, Point, 0, "", "");
                //pointBus.CreateHistoryes(Cus.ID, Point, SystemParam.HISPOINT_HE_THONG_CONG_DIEM, SystemParam.HISTORY_TYPE_ADD_PRODUCT, Util.CreateMD5(Cus.Phone), Note);             
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public List<ListOrderHistory> searchOrderHistory(int cusID, string fromDate, string toDate) {
            try {
                var Customer = cnn.Customers;
                var query = from oi in cnn.OrderItems
                            where (oi.Order.IsActive == SystemParam.ACTIVE && oi.Order.CustomerID == cusID)
                            select new ListOrderHistory {
                                customer = oi.Order.Customer,
                                order = oi.Order,
                                item = oi.Item,
                                agent = Customer.Where(x => x.ID == oi.Order.Agent_id).FirstOrDefault()
                            };

                if (fromDate != "" && fromDate != null) {
                    DateTime? fd = Util.ConvertDate(fromDate);
                    query = query.Where(x => x.order.CreateDate >= fd);
                }
                if (toDate != "" && toDate != null) {
                    DateTime? td = Util.ConvertDate(toDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(x => x.order.CreateDate <= td);
                }
                if (query != null && query.Count() >= 0) {
                    return query.OrderByDescending(x => x.order.CreateDate).ToList();
                } else {
                    return new List<ListOrderHistory>();
                }
            } catch (Exception ex) {
                ex.ToString();
                return new List<ListOrderHistory>();
            }
            //try
            //{
            //    var query = cnn.Orders.Where(o => o.IsActive == SystemParam.ACTIVE && o.CustomerID == cusID);
            //    if (fromDate != "" && fromDate != null)
            //    {
            //        DateTime? fd = Util.ConvertDate(fromDate);
            //        query = query.Where(x => x.CreateDate >= fd);
            //    }
            //    if (toDate != "" && toDate != null)
            //    {
            //        DateTime? td = Util.ConvertDate(toDate);
            //        td = td.Value.AddDays(1);
            //        query = query.Where(x => x.CreateDate <= td);
            //    }
            //    if (query != null && query.Count() >= 0)
            //    {
            //        return query.OrderByDescending(x => x.CreateDate).ToList();
            //    }
            //    else
            //    {
            //        return new List<Order>();
            //    }

            //}
            //catch (Exception ex)
            //{
            //    ex.ToString();
            //    return new List<Order>();
            //}
        }

        // cộng điểm nhiều khách hàng

        public int addPointAll(string listID, string listCusPhone, int Point, string Note) {
            try {
                //if (listCusPhone != null && listCusPhone != "")
                //{
                //    List<string> arrListPhone = listCusPhone.Split(',').ToList<string>();
                //    foreach (string strPhone in arrListPhone)
                //    {
                //        var query = cnn.Customers.Where(p => p.IsActive.Equals(SystemParam.ACTIVE) && p.Phone.Equals(strPhone));
                //        if (query == null || query.Count() <= 0)
                //        {
                //            return 3;
                //        }
                //        Customer Cus = query.FirstOrDefault();
                //        Cus.Point += Point;
                //        cnn.SaveChanges();
                //        notiBus.CreateNoti(Cus.ID, SystemParam.TYPE_ADD_POINT, Point, 0, "", "");
                //        pointBus.CreateHistoryes(Cus.ID, Point, SystemParam.HISPOINT_HE_THONG_CONG_DIEM, SystemParam.HISTORY_TYPE_ADD_PRODUCT, Util.CreateMD5(DateTime.Now.ToString()), Note, 0);
                //    }
                //}
                //if(listID != null && listID != "")
                //{
                //    List<string> arrListID = listID.Split(',').ToList<string>();
                //    foreach (string strid in arrListID)
                //    {
                //        int id = int.Parse(strid);
                //        var query = cnn.Customers.Where(p => p.IsActive.Equals(SystemParam.ACTIVE) && p.ID.Equals(id));
                //        Customer Cus = query.SingleOrDefault();
                //        Cus.Point += Point;
                //        cnn.SaveChanges();
                //        notiBus.CreateNoti(Cus.ID, SystemParam.TYPE_ADD_POINT, Point, 0, "", "");
                //        pointBus.CreateHistoryes(Cus.ID, Point, SystemParam.HISPOINT_HE_THONG_CONG_DIEM, SystemParam.HISTORY_TYPE_ADD_PRODUCT, Util.CreateMD5(DateTime.Now.ToString()), Note, 0);
                //    }
                //    cnn.SaveChanges();
                //}
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public Customer getCustomerByPhone(string Phone) {
            try {
                Customer cusDetail = cnn.Customers.Where(p => p.Phone.Equals(Phone)).SingleOrDefault();
                return cusDetail;
            } catch (Exception ex) {
                ex.ToString();
                return new Customer();
            }
        }

        public Customer cusDetail(int? ID) {
            try {
                Customer cusDetail = cnn.Customers.Where(p => p.ID == ID).SingleOrDefault();
                cusDetail.latitude = cusDetail.Shop.Lati;
                cusDetail.longitude = cusDetail.Shop.Long;
                return cusDetail;
            } catch (Exception ex) {
                ex.ToString();
                return new Customer();
            }
        }
        public int SaveEditCustomer(string Name, string Phone, string Email, int Sex, string BirthDay, string Address, int ID) {
            try {
                Customer cus = cnn.Customers.Find(ID);
                cus.Name = Name;
                cus.Phone = Phone;
                cus.Email = Email;
                cus.Sex = Sex;
                //cus.Status = Status;
                cus.DOB = Util.ConvertDate(BirthDay).Value;
                cus.Address = Address;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
        public List<GetListHistoryMemberPointInputModel> SearchHistoryPoint(int cusID, string FromDate, string ToDate) {
            try {
                var query = from MBH in cnn.MembersPointHistories
                            where MBH.IsActive.Equals(SystemParam.ACTIVE)
                            && MBH.CustomerID == cusID
                            select new GetListHistoryMemberPointInputModel {
                                HistoryID = MBH.ID,
                                AddPointCode = MBH.AddPointCode,
                                Point = MBH.Point,
                                Comment = MBH.Comment,
                                CreateDate = MBH.CraeteDate
                            };
                if (FromDate != null && FromDate != "") {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(p => p.CreateDate >= fd);
                }
                if (ToDate != null && ToDate != "") {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(p => p.CreateDate <= td);
                }
                if (query != null && query.Count() > 0)
                    return query.OrderByDescending(x => x.CreateDate).ToList();
                else
                    return new List<GetListHistoryMemberPointInputModel>();
            } catch (Exception ex) {
                ex.ToString();
                return new List<GetListHistoryMemberPointInputModel>();
            }
        }

        public List<ListRequestOutputModel> SearchReQuest(int cusID, string FromDate, string ToDate) {
            try {
                var query = from RQ in cnn.Requests
                            where RQ.IsActive.Equals(SystemParam.ACTIVE)
                            && RQ.CustomerID == cusID
                            select new ListRequestOutputModel {
                                RequestID = RQ.ID,
                                Type = RQ.Type,
                                Point = RQ.Point,
                                Price = RQ.Gift.Price,
                                Status = RQ.Status,
                                CreateDate = RQ.CreateDate
                            };
                if (FromDate != null && FromDate != "") {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(p => p.CreateDate >= fd);
                }
                if (ToDate != null && ToDate != "") {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(p => p.CreateDate <= td);
                }
                if (query != null && query.Count() > 0)
                    return query.OrderByDescending(r => r.CreateDate).ToList();
                else
                    return new List<ListRequestOutputModel>();
            } catch (Exception ex) {
                ex.ToString();
                return new List<ListRequestOutputModel>();
                throw;
            }
        }

        //Save edit infor agent GasViett
        public int SaveEditInforAgent(int ID, string Name, string Phone, string Address, string DOB, string Email, int Sex,float Lati,float Long) {
            try {
                AgentBusiness agentBusiness = new AgentBusiness();
                DateTime? BirthDay = Util.ConvertDate(DOB);
                Customer cus = cnn.Customers.Find(ID);
                List<string> check = (from c in cnn.Customers
                             where c.IsActive.Equals(SystemParam.ACTIVE) && c.Phone.Length >= 10
                             select c.Phone).ToList();
                if(check.Contains(Phone) && Phone != cus.Phone)
                {
                    return SystemParam.EXISTING;
                }
                cus.Name = Name;
                cus.Phone = Phone;
                cus.Address = Address;
                cus.Email = Email;
                cus.Sex = Sex;
                cus.DOB = BirthDay.Value;

                Shop shop = cnn.Shops.Find(cus.ShopID);
                shop.Name = Name;
                shop.Lati = Lati;
                shop.Long = Long;
                shop.PlusCode = Address;
                shop.Address = Address;
                shop.ContactName = Name;
                shop.ContactPhone = Phone;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            } catch {
                return SystemParam.ERROR;
            }
        }
        public int DeleteCustomer(int ID) {
            try {
                var cusDelete = cnn.Customers.Find(ID);
                //if (cusDelete.Status == 1)
                //{
                //    return 2;
                //}
                cusDelete.IsActive = SystemParam.ACTIVE_FALSE;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public List<Customer> TopPoint() {
            return cnn.Customers.Where(x => x.IsActive.Equals(SystemParam.ACTIVE)).OrderByDescending(x => x.Point).Take(10).ToList();
        }
        //public string countCustomer() {

        //    return cnn.Customers.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).Count().ToString();
        //}
        //Select all name customer
        public Array LoadCusName(string Name) {
            string[] cusName = (from c in cnn.Customers.Where(c => c.Name.Contains(Name))
                                where c.IsActive.Equals(SystemParam.ACTIVE)
                                select c.Name).ToArray();

            return cusName;
        }
        //select all agent name
        public Array SearchAgentName(string Name) {
            string[] agentName = (from c in cnn.Customers.Where(c => c.Name.Contains(Name))
                                  where c.IsActive.Equals(SystemParam.ACTIVE) && c.Role.Equals(1)
                                  select c.Name).ToArray();
            return agentName;
        }

        public double getLat(String PlusCode) {
            int partition = 0;
            Regex reg = new Regex("/@([0-9]*.?[0-9]*),([0-9]*.?[0-9]*),");

            Match regResult = reg.Match(PlusCode);
            String regResultString = regResult.ToString();
            regResultString = regResultString.Substring(2, regResultString.Length - 2);

            for (int i = 0; i <= regResultString.Length - 2; i++) {
                if (regResultString[i] == ',') {
                    partition = i;
                }
            }

            String lat = regResultString.Substring(0, partition);
            String longg = regResultString.Substring(partition + 1, regResultString.Length - 1 - partition - 1);

            return double.Parse(lat, CultureInfo.InvariantCulture);
        }

        public double getLong(String PlusCode) {
            int partition = 0;
            Regex reg = new Regex("/@([0-9]*.?[0-9]*),([0-9]*.?[0-9]*),");

            Match regResult = reg.Match(PlusCode);
            String regResultString = regResult.ToString();
            regResultString = regResultString.Substring(2, regResultString.Length - 2);

            for (int i = 0; i <= regResultString.Length - 2; i++) {
                if (regResultString[i] == ',') {
                    partition = i;
                }
            }

            String lat = regResultString.Substring(0, partition);
            String longg = regResultString.Substring(partition + 1, regResultString.Length - 1 - partition - 1);

            return double.Parse(longg, CultureInfo.InvariantCulture);
        }
    }
}
