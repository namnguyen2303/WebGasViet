using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class LoginBusiness : GenericBusiness
    {
        public LoginBusiness(DEKKOEntities context = null) : base()
        {

        }
        PointBusiness pBus = new PointBusiness();
        RequestAPIBusiness apiBus = new RequestAPIBusiness();

        public string Register(string phone, string passWord)
        {
            try
            {
                var cus = cnn.Customers.Where(u => u.Email.Equals(phone) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
                if (cus != null)
                    return "Tài khoản đã tồn tại";
                if (passWord.Length < 6)
                    return "Mật khẩu phải có ít nhất 6 ký tự";
                if (!phone.Contains("@"))
                    return "Vui lòng nhập đúng email";
                else
                {
                    string token = Util.CreateMD5(DateTime.Now.ToString());
                    CreateCustomer("", phone, SystemParam.TYPE_LOGIN_PHONE, token, "", phone, passWord);
                    return token;
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
        /// <summary>
        /// đăng nhập vào app
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public string CheckLoginApp(string value, int typeLogin, string name, string url, string email, string passWord)
        {
            var lscus = cnn.Customers.Where(u => u.IsActive.Equals(SystemParam.ACTIVE));
            // đăng nhập bămg sdt
            if (typeLogin == SystemParam.TYPE_LOGIN_PHONE)
            {
                string token = Util.CreateMD5(DateTime.Now.ToString());
                var cus = lscus.Where(u => u.Phone.Equals(value)).FirstOrDefault();
                if (cus != null)
                {
                    cus.Token = token;
                    cnn.SaveChanges();
                    return token;
                }
                   else
                {
                    CreateCustomer(value, name, typeLogin, token, url, email, "");
                }
                return token;

            }
            // đăng nhập bằng Facebook hoặc Google
            else
            {
                var cus = lscus.Where(u => u.Code.Equals(value));
                // sinh ra token mới
                string token = Util.CreateMD5(DateTime.Now.ToString());
                if (cus != null && cus.Count() > 0)
                {
                    Customer cust = cus.FirstOrDefault();
                    cust.Token = token;
                    cust.Type = typeLogin;
                    cnn.SaveChanges();
                }
                else
                {
                    CreateCustomer(value, name, typeLogin, token, url, email, "");
                }
                return token;
            }
        }
        public bool ConFirmCode(string code, int cusID)
        {
            Customer cus = cnn.Customers.Find(cusID);
            if (cus.ConfirmCode.Equals(code))
                return true;
            else
                return false;
        }
        public UserInforOutputModel GetuserInfor(int cusID)
        {

            UserInforOutputModel query = new UserInforOutputModel();
            Customer cus = cnn.Customers.Find(cusID);
            query.Code = Util.CheckNullString(cus.Code);
            Province pr = cnn.Provinces.Find(cus.ProvinceCode);
            District dt = cnn.Districts.Find(cus.DistrictCode);
            if (pr != null)
            {
                query.ProvinceID = cus.ProvinceCode;
                query.ProvinceName = pr.Name;
            }
            else
            {
                query.ProvinceID = cus.ProvinceCode;
                query.ProvinceName = "";
            }
            if (dt != null)
            {
                query.DistrictID = cus.DistrictCode;
                query.DistrictName = dt.Name;
            }
            else
            {
                query.DistrictID = cus.DistrictCode;
                query.DistrictName = "";
            }
            if (cus.ShopID != null)
            {
                var shop = cnn.Shops.Find(cus.ShopID.Value);
                if (shop != null)
                    query.AgentName = shop.Name;
            }
            query.UserID = cusID;
            query.Address = cus.Address;
            query.DOB = cus.DOB;
            query.DOBStr = cus.DOB.ToString(SystemParam.CONVERT_DATETIME);
            query.Email = cus.Email;
            query.TypeLogin = cus.Type;
            query.CustomerName = cus.Name;
            query.Phone = cus.Phone;
            query.Role = cus.Role;
            query.Sex = cus.Sex;
            query.Point = cus.Point;
            //query.IsAgent = String.IsNullOrEmpty(cus.AgentCode) ? 0 : 1;
            int p = cus.PointRanking.Value;
            query.PointRanking = p;
            //Ranking rank = cnn.Rankings.Where(u => u.MinPoint.Value <= p && u.MaxPoint.Value >= p).FirstOrDefault();
            //if (rank != null)
            //{
            //    Ranking nextRank = cnn.Rankings.Where(u => u.Level.Value.Equals(rank.Level.Value + 1) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
            //    query.RankName = rank.RankName;
            //    //if (!String.IsNullOrEmpty(cus.AgentCode))
            //    //{
            //    //    query.Description = "";
            //    //    query.NoteNextLevel = "";
            //    //}
            //    //else
            //    //{
            //    //    query.Description = rank.Descriptions;
            //    //    if (nextRank != null)
            //    //    {
            //    //        query.NoteNextLevel = "Bạn bạn cần tích thêm " + (rank.MaxPoint.Value + 1 - p).ToString() + " để lên hạng " + nextRank.RankName;
            //    //    }
            //    //    else
            //    //        query.NoteNextLevel = "Bạn đang ở hạng Bạch Kim";
            //    //}
            //    //query.RankLevel = rank.Level.Value;
            //}
            query.UrlAvatar = cus.AvatarUrl;
            query.Token = cus.Token;
            if (cus.Phone.Length > 0 && cus.Name.Length > 0 && cus.Email.Length > 0)
                query.IsNeedUpdate = SystemParam.NO_NEED_UPDATE;
            else
                query.IsNeedUpdate = SystemParam.NEED_UPDATE;
            return query;
        }
        /// <summary>
        /// Tạo Khách hàng mới
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public void CreateCustomer(string value, string name, int type, string token, string url, string email, string pass)
        {
            try
            {
                Customer cus = new Customer();
                if (type == SystemParam.TYPE_LOGIN_PHONE)
                {
                    cus.Phone = value;
                    cus.Code = "";
                    cus.IsActive = SystemParam.ACTIVE;
                    cus.PassWord =String.IsNullOrEmpty(pass)?"" : Util.CreateMD5(pass);

                }
                else
                {
                    cus.Code = value;
                    cus.Phone = "";
                    cus.IsActive = SystemParam.ACTIVE;
                }
                cus.Token = token;
                cus.Address = "";
                cus.DOB = DateTime.Now;

                if (type == SystemParam.TYPE_LOGIN_GOOGLE)
                {
                    cus.Name = name.Split('@').FirstOrDefault();
                }
                else
                {
                    cus.Name = name;
                }
                cus.Email = email;
                cus.ProvinceCode = 1;
                cus.DistrictCode = 1;
                cus.Sex = 0;
                cus.Role = SystemParam.ROLL_CUSTOMER;
                cus.PointRanking = 0;
                if (url.Length == 0)
                {
                    cus.AvatarUrl = "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg";
                }
                else
                    cus.AvatarUrl = url;
                cus.Point = SystemParam.POINT_START;
                cus.LastLoginDate = DateTime.Now;
                cus.ExpireTocken = DateTime.Now;
                cus.DeviceID = "";
                cus.Type = type;
                cus.Status = SystemParam.ACTIVE;
                cus.CraeteDate = DateTime.Now;
                cnn.Customers.Add(cus);
                cnn.SaveChanges();
                int cusID = cnn.Customers.OrderByDescending(u => u.ID).Select(u => u.ID).FirstOrDefault();
                //pBus.CreateHistoryes(cusID, SystemParam.POINT_ADD_FIRST, SystemParam.TYPE_ADD_POINT, SystemParam.HISTORY_TYPE_ADD_ANOTHER, Util.CreateMD5(DateTime.Now.ToString()), SystemParam.COMMENT_HISTORY_ADD_POINT);

            }
            catch (Exception ex)
            {
                string a = ex.ToString();
            }
        }
        /// <summary>
        /// Tạo Khách hàng mới
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public bool UpdateCustomer(UserInforOutputModel item, int CusID)
        {
            try
            {
                string phone = Util.ConvertPhone(item.Phone);
                Customer cus = cnn.Customers.Find(CusID);
                cus.Name = item.CustomerName;
                cus.Address = item.Address;
                try
                {
                    cus.DOB = DateTime.ParseExact(item.DOBStr, SystemParam.CONVERT_DATETIME, null);
                }
                catch { }
                cus.Email = item.Email;
                cus.ProvinceCode = item.ProvinceID;
                cus.DistrictCode = item.DistrictID;
                cus.Sex = item.Sex;
                cus.Phone = item.Phone;
                cus.LastLoginDate = DateTime.Now;
                cus.ExpireTocken = DateTime.Now.AddYears(1);
                cus.CraeteDate = DateTime.Now;
                cus.IsActive = SystemParam.ACTIVE;
                cnn.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                string a = ex.ToString();
                return false;
            }
        }
        // public bool UpdateCustomer ()
        public UserDetailOutputModel CheckLoginWeb(string phone, string password)
        {
            UserDetailOutputModel query = new UserDetailOutputModel();
            string newpass = Util.CreateMD5(password);
            var cus = cnn.Users.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.Phone.Equals(phone) && u.PassWord.Equals(newpass)).Select(u => new UserDetailOutputModel { UserID = u.UserID, UserName = u.UserName, Role = u.Role, Phone = u.Phone });
            if (cus != null && cus.Count() > 0)
            {
                query = cus.FirstOrDefault();
            }
            else
            {
                query = null;
            }
            return query;
        }

        public CustomerDetailOutputModel CusDetail(int cusID)
        {
            Customer cus = cnn.Customers.Find(cusID);
            CustomerDetailOutputModel query = new CustomerDetailOutputModel();
            query.Code = Util.CheckNullString(cus.Code);
            query.DistrictName = cus.District.Name;
            query.ProvinceName = cus.Province.Name;
            query.ProvinceID = cus.ProvinceCode;
            query.DistrictID = cus.DistrictCode;
            query.Address = cus.Address;
            query.DOB = cus.DOB;
            query.DOBStr = cus.DOB.ToString(SystemParam.CONVERT_DATETIME);
            query.Email = cus.Email;
            query.TypeLogin = cus.Type;
            query.CustomerName = cus.Name;
            query.Phone = cus.Phone;
            query.Sex = cus.Sex;
            query.Point = cus.Point;
            query.UrlAvatar = cus.AvatarUrl;
            return query;

        }

        public UserInforOutputModel ActiveAgent(int cusID, int agentID)
        {
            Agent agent = cnn.Agents.Find(agentID);
            Customer cus = cnn.Customers.Find(cusID);
            //cus.AgentCode = agent.Code;
            cus.Role = SystemParam.ROLE_USER;
            agent.CustomerActiveID = cusID;
            agent.ActiveDate = DateTime.Now;
            cnn.SaveChanges();
            return GetuserInfor(cusID);
        }
    }
}
