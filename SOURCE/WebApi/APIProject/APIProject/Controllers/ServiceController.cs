using APIProject.Models;
using Data.Business;
using Data.DB;
using Data.Model;
using Data.Model.APIApp;
using Data.Model.APIWeb;
//using APIProject.Models.APIApp;
using Data.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PagedList;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace APIProject.Controllers
{
    public class ServiceController : BaseAPIController
    {
        // Khai báo các hàm business

        DEKKOEntities cnn = new DEKKOEntities();
        // API App


        /// <summary>
        /// 1.Login
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel Login(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                LoginAppInputModel item = JsonConvert.DeserializeObject<LoginAppInputModel>(input.ToString());
                string json, name = "", id = "", output = "Có lỗi sảy ra", avatar = "", email = "";

                if (item.Type == SystemParam.TYPE_LOGIN_FACE)
                {
                    try
                    {
                        json = apiBus.GetJson(SystemParam.LINK_URL_FACEBOOK + item.Value);
                        FacebookOutputModel face = JsonConvert.DeserializeObject<FacebookOutputModel>(json);
                        name = face.name;
                        id = face.id;
                        avatar = SystemParam.URL_FIRST + id + SystemParam.URL_LAST;
                    }
                    catch { }
                }
                else if (item.Type == SystemParam.TYPE_LOGIN_GOOGLE)
                {
                    try
                    {
                        string JsonID = apiBus.GetJson("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + item.Value);
                        GoogleOutputModel googleID = JsonConvert.DeserializeObject<GoogleOutputModel>(JsonID);
                        name = googleID.name;
                        id = googleID.id;
                        email = googleID.email;
                        avatar = googleID.picture;
                    }
                    catch
                    {
                    }
                }
                else if (item.Type == SystemParam.TYPE_LOGIN_PHONE)
                {
                    id = Util.ConvertPhone(item.Value);
                    name = id;
                }
                if (id.Length > 0)
                {
                    output = lgBus.CheckLoginApp(id, item.Type, name, avatar, email, item.PassWord);
                    var cus = cnn.Customers.Where(u => u.Token.Equals(output) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
                    if (cus != null)
                    {
                        if (!String.IsNullOrEmpty(item.deviceID) && item.deviceID.Length > 10 && !item.deviceID.Equals("undefined"))
                        {
                            cus.DeviceID = item.deviceID;
                            cnn.SaveChanges();
                        }
                        result.Result = lgBus.GetuserInfor(cus.ID);
                        result.Message = "Đăng nhập thành công";
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Status = SystemParam.SUCCESS;
                    }
                    else
                    {
                        result.Message = output;
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Status = SystemParam.ERROR;
                    }
                }
                else
                {
                    result.Message = "Có lỗi sảy ra khi đăng nhập";
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Status = SystemParam.ERROR;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.ToString(); ;
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 15. Đổi avatars
        /// </summar
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel ChangePass(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
            if (Util.checkTokenApp(token) != null)
            {

                Customer cus = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                ChangePass item = JsonConvert.DeserializeObject<ChangePass>(input.ToString());
                if (Util.CreateMD5(item.OldPass).Equals(cus.PassWord))
                {
                    if (item.newPass.Length < 6)
                    {
                        result.Message = "Mật khẩu phải có ít nhất 6 ký tự";
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Status = SystemParam.ERROR;
                    }
                    else
                    {
                        cus.PassWord = Util.CreateMD5(item.newPass);
                        cnn.SaveChanges();
                        result.Status = SystemParam.SUCCESS;
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Message = "Cập nhật thành công";
                        result.Result = lgBus.GetuserInfor(cus.ID);
                    }
                }
                else
                {
                    result.Message = "Sai mật khẩu";
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Status = SystemParam.ERROR;
                }
            }
            else
            {

                result.Message = "Lỗi đăng nhập API";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.ERROR_PASS_API;
            }
            return result;
        }

        /// <summary>
        /// 15. Đổi avatars
        /// </summar
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel CheckPass(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
            if (Util.checkTokenApp(token) != null)
            {

                Customer cus = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                LoginAppInputModel item = JsonConvert.DeserializeObject<LoginAppInputModel>(input.ToString());
                if (Util.CreateMD5(item.PassWord).Equals(cus.PassWord))
                {
                    if (item.PassWord.Length < 6)
                    {
                        result.Message = "Mật khẩu phải có ít nhất 6 ký tự";
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Status = SystemParam.ERROR;
                    }
                    else
                    {
                        if (cus.PassWord == Util.CreateMD5(item.PassWord))
                        {

                            result.Status = SystemParam.SUCCESS;
                            result.Code = SystemParam.SUCCESS_CODE;
                            result.Message = "Cập nhật thành công";
                            result.Result = lgBus.GetuserInfor(cus.ID);
                        }
                        else
                        {
                            result.Message = "Sai mật khẩu";
                            result.Code = SystemParam.PROCESS_ERROR;
                            result.Status = SystemParam.ERROR;
                        }
                    }
                }
                else
                {
                    result.Message = "Sai mật khẩu";
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Status = SystemParam.ERROR;
                }
            }
            else
            {

                result.Message = "Lỗi đăng nhập API";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.ERROR_PASS_API;
            }
            return result;
        }

        /// <summary>
        /// 1.Login
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel Register(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                LoginAppInputModel item = JsonConvert.DeserializeObject<LoginAppInputModel>(input.ToString());
                string output = lgBus.Register(item.Value, item.PassWord);
                var cus = cnn.Customers.Where(u => u.Token.Equals(output) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
                if (cus != null)
                {
                    result.Result = lgBus.GetuserInfor(cus.ID);
                    result.Message = "Đăng nhập thành công";
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Status = SystemParam.SUCCESS;
                }
                else
                {
                    result.Message = output;
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Status = SystemParam.ERROR;
                }

            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì! vui lòng chọn phương thức đăng nhập khác";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 2.Lấy ra danh sách tin tức
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetNews(int type, int? cateID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {

                List<NewsAppOutputModel> query = new List<NewsAppOutputModel>();
                query = newsBus.GetListNews(type, cateID);
                result.Message = query.Count > 0 ? "" : "Danh sách trống";
                result.Code = SystemParam.SUCCESS_CODE;
                result.Status = SystemParam.SUCCESS;
                result.Result = query;
            }
            catch (Exception ex)
            {
                result.Message = ex.ToString();
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        [HttpGet]
        public JsonResultModel GetNewsDetail(int newID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                NewsAppOutputModel query = new NewsAppOutputModel();

                query = newsBus.GetNews(newID);
                result.Message = query != null ? "" : "Bài viết không tồn tại";
                result.Code = query != null ? SystemParam.SUCCESS_CODE : SystemParam.PROCESS_ERROR;
                result.Status = query != null ? SystemParam.SUCCESS : SystemParam.ERROR;
                result.Result = query;

            }
            catch (Exception ex)
            {
                result.Message = ex.ToString();
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        /// <summary>
        /// 2.Lấy ra danh sách tin tức
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetNews(int type)
        {
            return GetNews(type, null);
        }


        /// <summary>
        /// 3. Lấy ra thông tin đăng nhập
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetUserInfor()
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? cusID = Util.checkTokenApp(token);
                UserInforOutputModel query = new UserInforOutputModel();
                if (cusID != null)
                {
                    result.Result = lgBus.GetuserInfor(cusID.Value);
                    result.Message = "";
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 3. Lấy ra thông tin đăng nhập
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetUserInfor(string DeviceID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? cusID = Util.checkTokenApp(token);
                UserInforOutputModel query = new UserInforOutputModel();
                if (cusID != null)
                {
                    result.Result = lgBus.GetuserInfor(cusID.Value);
                    result.Message = "";
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        /// <summary>
        /// 3. Lấy ra thông tin đăng nhập
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetCategoryItem()
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? cusID = Util.checkTokenApp(token);
                if (cusID != null)
                {
                    var listcate = from c in cnn.CategoryNews
                                   where (c.IsActive.Equals(SystemParam.ACTIVE) && c.ParentID > 0)
                                   select new
                                   {
                                       CateID = c.ID,
                                       c.Name
                                   };
                    result.Result = listcate.ToList();
                    result.Message = "";
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 4.Lấy danh sách notify
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetNotify()
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                List<NotifiedByCustomerIDOutputModel> query = new List<NotifiedByCustomerIDOutputModel>();
                int? cusID = Util.checkTokenApp(token);

                if (Util.checkTokenApp(token) != null)
                {
                    query = notiBus.GetListNotify(cusID.Value);
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Status = SystemParam.SUCCESS;
                    result.Result = query;
                    result.Message = query.Count > 0 ? "" : "Danh sách trống";
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }


        /// <summary>
        /// 10.Gửi tin nhắn từ khách hàng
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetHomeScreen(string deviceID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                HomeScreenOutPutModel query = new HomeScreenOutPutModel();
                int? id = Util.checkTokenApp(token);

                CustomerLogin cusl = new CustomerLogin();
                if (id != null)
                {
                    var cus = lgBus.CusDetail(id.Value);
                    Customer cust = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                    cusl.CustomerName = cus.CustomerName;
                    cusl.Phone = cus.Phone;
                    cusl.Point = cus.Point;
                    if (cusl.Phone.Length > 0 && cusl.CustomerName.Length > 0)
                        cusl.IsNeeđUpate = 0;
                    else
                        cusl.IsNeeđUpate = 1;
                    query.customerDetail = cusl;
                }
                query.listNews = newsBus.GetListNews(SystemParam.NEWS_TYPE_NEWS, null).ToList();
                query.listProduct = itemBus.GetListItem(null).ToList();
                result.Code = SystemParam.SUCCESS_CODE;
                result.Status = SystemParam.SUCCESS;
                result.Result = query;
                result.Message = "";
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        [HttpGet]
        public JsonResultModel SaveConfig(int Distance, int TimeWaiting)
        {
            JsonResultModel result = new JsonResultModel();

            try
            {
                var distance = cnn.Configsses.Where(x => x.NameConst.Contains("Distance")).FirstOrDefault();
                var timewaiting = cnn.Configsses.Where(x => x.NameConst.Contains("TimeWaiting")).FirstOrDefault();

                distance.ValueConst = Distance;
                timewaiting.ValueConst = TimeWaiting;

                //cnn.Configs.Add(distance);
                //cnn.Configs.Add(timewaiting);
                cnn.SaveChanges();
                result.Result = distance;
            }
            catch (Exception ex)
            {
                result.Result = ex.ToString();
            }
            return result;
        }

        /// <summary>
        /// 2.ListServicePackage
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel ListServicePackage(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                List<PackageModel> query = cnn.ServicePackages.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).OrderBy(u => u.Point).Select(u => new PackageModel
                {
                    PackageID = u.ID,
                    Point = u.Point,
                    Price = u.Price
                }).ToList();
                result.Result = query;
                result.Message = "Đăng nhập thành công";
                result.Code = SystemParam.SUCCESS_CODE;
                result.Status = SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì! vui lòng chọn phương thức đăng nhập khác";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 2.BuyPackage
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel BuyPackage(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                AddPointIntPutModel item = JsonConvert.DeserializeObject<AddPointIntPutModel>(input.ToString());
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? ID = Util.checkTokenApp(token);
                if (ID != null)
                {
                    ServicePackage pack = cnn.ServicePackages.Find(item.PackageID);
                    if (pack != null)
                    {
                        int orderID = orderBus.CreatePackageHistory(item, ID.Value);
                        string linkVNPAY = vnPay.GetUrl(orderID);
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Status = SystemParam.SUCCESS;
                        result.Result = linkVNPAY;
                        result.Message = "";
                    }
                    else
                    {
                        result.Message = "Lỗi đăng nhập API";
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.PROCESS_ERROR;
                    }
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.ToString();
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 11.Lịch sử tích điểm
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetPointHistory(string FromDate)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();

                List<HistoryGivePointWebOutputModel> query = new List<HistoryGivePointWebOutputModel>();
                DateTime? time;
                try
                {
                    time = DateTime.ParseExact(FromDate, SystemParam.CONVERT_DATETIME, null);
                }
                catch
                {
                    time = null;
                }

                if (Util.checkTokenApp(token) != null)
                {
                    query = pBus.ListHistoty(time, Util.checkTokenApp(token).Value);
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Status = SystemParam.SUCCESS;
                    result.Result = query;
                    result.Message = query.Count > 0 ? "" : "Danh sách trống";
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        /// <summary>
        /// 13. Update Customer
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel UpdateCustomer(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                UserInforOutputModel item = JsonConvert.DeserializeObject<UserInforOutputModel>(input.ToString());
                if (Util.checkTokenApp(token) != null)
                {
                    if (item.Phone.Length > 0 && item.ProvinceID > 0 && item.CustomerName.Length > 0 && item.DistrictID > 0)
                    {
                        int checkphone = 0, checkmail = 0;
                        string newphone = Util.ConvertPhone(item.Phone);
                        int cusID = Util.checkTokenApp(token).Value;
                        Customer cus = cnn.Customers.Find(cusID);
                        if (!item.Email.Contains("@") && item.Email.Length > 0)
                        {
                            result.Result = new object();
                            result.Message = "Email không đúng định dạng";
                            result.Code = SystemParam.PROCESS_ERROR;
                            result.Status = SystemParam.ERROR;
                            return result;
                        }
                        if (cus.Phone == newphone || item.Phone.Length == 0)
                            checkphone = 1;
                        else
                        {
                            var listcus = cnn.Customers.Where(u => u.Phone.Equals(newphone) && u.IsActive.Equals(SystemParam.ACTIVE));
                            if (listcus == null || listcus.Count() == 0)
                                checkphone = 1;
                        }
                        if (cus.Email == item.Email || item.Email.Length == 0)
                            checkmail = 1;
                        else
                        {
                            var listcus = cnn.Customers.Where(u => u.Email.Equals(item.Email) && u.IsActive.Equals(SystemParam.ACTIVE));
                            if (listcus == null || listcus.Count() == 0)
                                checkmail = 1;
                        }
                        if (checkphone == 1 && checkmail == 1)
                        {
                            if (lgBus.UpdateCustomer(item, cusID))
                            {
                                result.Result = lgBus.CusDetail(cusID);
                                result.Message = "Cập nhật thành công";
                                result.Code = SystemParam.SUCCESS_CODE;
                                result.Status = SystemParam.SUCCESS;
                            }
                            else
                            {
                                result.Result = new object();
                                result.Message = "Thât bại ";
                                result.Code = SystemParam.PROCESS_ERROR;
                                result.Status = SystemParam.ERROR;
                            }
                        }
                        else if (checkphone == 0)
                        {
                            result.Result = new object();
                            result.Message = "Số điện thoại đã được sử dụng ";
                            result.Code = SystemParam.PROCESS_ERROR;
                            result.Status = SystemParam.ERROR;
                        }
                        else
                        {
                            result.Result = new object();
                            result.Message = "Email đã được sử dụng ";
                            result.Code = SystemParam.PROCESS_ERROR;
                            result.Status = SystemParam.ERROR;
                        }
                    }
                    else
                    {
                        result.Result = new object();
                        result.Message = "Vui lòng nhập đầy đủ thông tin";
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Status = SystemParam.ERROR;
                    }
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }

            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 15.Province and distric
        /// </summary>
        /// <param name="proID"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetProvinceAndDistric(int? proID)
        {

            JsonResultModel result = new JsonResultModel();
            try
            {
                ProvinceAndDistrictModel query = new ProvinceAndDistrictModel();
                var listProvice = from p in cnn.Provinces
                                  select new
                                  {
                                      ProvinceID = p.Code,
                                      ProvinceName = p.Name,
                                      ProvinceType = p.Type
                                  };
                var listDistrict = from d in cnn.Districts
                                   orderby d.ProvinceCode
                                   select new
                                   {
                                       DistrictID = d.Code,
                                       DistrictName = d.Name,
                                       DistrictType = d.Type,
                                       ProvinceID = d.ProvinceCode
                                   };
                if (proID == null)
                {
                    query.province = listProvice.ToList();
                    query.listDistrict = listDistrict.ToList();
                }
                else
                {
                    var Province = listProvice.Where(u => u.ProvinceID.Equals(proID.Value)).FirstOrDefault();
                    if (Province != null)
                        query.province = Province;
                    else
                        query.province = new object();
                    query.listDistrict = listDistrict.Where(u => u.ProvinceID.Equals(proID.Value));
                }
                result.Message = "";
                result.Result = query;
                result.Status = SystemParam.SUCCESS;
                result.Code = SystemParam.SUCCESS_CODE;
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }

        /// <summary>
        /// 15. Đổi avatars
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel ChangeAvatar()
        {
            JsonResultModel result = new JsonResultModel();
            string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
            if (Util.checkTokenApp(token) != null)
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    string rootFolder = HttpContext.Current.Server.MapPath(@"\Uploads\");
                    Customer cus = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                    var docfiles = new List<string>();
                    string urlFile = "";
                    string[] str = cus.AvatarUrl.Split('/');
                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        string name = DateTime.Now.ToString("HHmmssddMMyyyy") + ".jpg";
                        var filePath = HttpContext.Current.Server.MapPath(@"\Uploads\" + name);
                        urlFile = "http://" + HttpContext.Current.Request.Url.Authority + "/Uploads/" + name;
                        postedFile.SaveAs(filePath);
                        docfiles.Add(urlFile);
                    }

                    // xóa file cũ
                    string[] files = Directory.GetFiles(rootFolder);
                    foreach (string file in files)
                    {
                        string fileName = rootFolder + str[str.Length - 1];
                        if (file.Equals(fileName))
                        {
                            File.Delete(file);
                            Console.WriteLine($"{file} is deleted.");
                        }
                    }
                    cus.AvatarUrl = urlFile;
                    cnn.SaveChanges();
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Message = "Cập nhật thành công";
                    result.Result = urlFile;
                }
                else
                {
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Message = "Đã có lỗi sảy ra";
                    result.Result = "";
                }
            }
            else
            {

                result.Message = "Lỗi đăng nhập API";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.ERROR_PASS_API;
            }
            return result;
        }



        /// <summary>
        /// 16.APi push notify
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public string PushNotify()
        {
            try
            {
                Notification noti = cnn.Notifications.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).OrderByDescending(u => u.ID).FirstOrDefault();
                DataOnesignal datta = new DataOnesignal();
                datta.type = SystemParam.HAVE_A_NEW_NOTI;
                var lsnoti = cnn.Notifications.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.CustomerID.Value.Equals(noti.CustomerID.Value) && u.Viewed.Equals(0));
                string value = packBus.StartPushNoti(datta, noti.Customer.DeviceID, noti.Content, noti.Customer.Role);
                string a = packBus.PushOneSignals(value);
                var b = JsonConvert.DeserializeObject(a);
                return a;
                //PushNotify push = new PushNotify();
                //push.to = noti.Customer.DeviceID;
                //push.channelId = "reminder";
                //push.title = "Thông báo";
                //push.body = noti.Content;
                //push.data = notidetail;
                //push.badge = 0;
                //string value = JsonConvert.SerializeObject(push);
                //apiBus.Post(SystemParam.EXPO_NOTI, value);
            }
            catch (Exception ex)
            {
                return "Hệ thống đang bảo trì";
            }
        }

        [HttpGet]
        public string PushNotify(string DeviceID, string content, int role)
        {
            try
            {
                string value = packBus.StartPushNoti(new object(), DeviceID, content, role);
                string a = packBus.PushOneSignals(value);
                return a;
            }
            catch (Exception ex)
            {
                return "Hệ thông đang bảo trì";
            }
        }
        /// <summary>
        /// PushNotiByUser
        /// </summary>
        /// <param name="DeviceID"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        [HttpGet]
        public string PushNotifyByPhone(string Phone, string Content)
        {
            try
            {
                var c = cusBus.getCustomerByPhone(Phone);
                if (c != null)
                {
                    string DeviceID = c.DeviceID;
                    PushNotify push = new PushNotify();
                    push.to = DeviceID;
                    push.channelId = "reminder";
                    push.title = "CSKH Dekko";
                    push.body = Content;
                    push.data = new object();
                    push.badge = 0;
                    string value = JsonConvert.SerializeObject(push);
                    string a = apiBus.Post(SystemParam.EXPO_NOTI, value);
                }
                else
                {
                    return "Không có khách hàng!";
                }

                return "thanh cong";
            }
            catch (Exception ex)
            {
                return "Hệ thông đang bảo trì";
            }
        }

        /// <summary>
        /// 17.Chi tiết thẻ
        /// </summary>
        /// <param name="notiID"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel ChangeViewed(int notiID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                if (Util.checkTokenApp(token) != null)
                {
                    Notification noti = cnn.Notifications.Find(notiID);
                    if (noti != null && noti.IsActive.Equals(SystemParam.ACTIVE))
                    {
                        noti.Viewed = 1;
                        cnn.SaveChanges();
                        NotifiedByCustomerIDOutputModel notidetail = new NotifiedByCustomerIDOutputModel();
                        notidetail.NotifyID = noti.ID;
                        notidetail.Content = noti.Content;
                        notidetail.CreatedDate = noti.CreateDate;
                        notidetail.Viewed = 1;
                        notidetail.Title = noti.Title;
                        notidetail.Type = noti.Type.Value;

                        result.Status = SystemParam.SUCCESS;
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Message = "Thành công";
                        result.Result = notidetail;
                    }
                    else
                    {
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Message = "Thông báo không tồn tại";
                        result.Result = new object();
                    }
                }
                else
                {

                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }
            }
            catch (Exception ex)
            {
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }



        /// <summary>
        /// 18.Logout
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel Logout()
        {
            JsonResultModel result = new JsonResultModel();
            string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
            if (Util.checkTokenApp(token) != null)
            {
                Customer cust = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                cust.Token = Util.CreateMD5(DateTime.Now.ToString());
                cust.DeviceID = "";
                cnn.SaveChanges();
                result.Message = "Đăng xuất thành công";
                result.Status = SystemParam.SUCCESS;
                result.Code = SystemParam.SUCCESS_CODE;
                result.Result = new object();
            }
            else
            {
                result.Message = "Lỗi đăng nhập API";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.ERROR_PASS_API;
            }
            return result;
        }

        /// <summary>
        /// 18.Logout
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel ForgotPassWold(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                LoginAppInputModel item = JsonConvert.DeserializeObject<LoginAppInputModel>(input.ToString());

                result.Message = "Mật khẩu đã được gửi vào Email đăng ký của bạn";
                result.Code = SystemParam.SUCCESS_CODE;
                result.Status = SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                result.Message = "Hệ thống đang bảo trì! vui lòng chọn phương thức đăng nhập khác";
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
            }
            return result;
        }
        /// <summary>
        /// 19.Lấy ra danh sách Đơn hàng theo khách hàng và trạng thái
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetListOrder(int? status, int page)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? id = Util.checkTokenApp(token);
                var lsOrder = new List<OrderDetailOutputModel>();
                if (id != null)
                    lsOrder = orderBus.GetListOrderByStatus(status, Util.checkTokenApp(token).Value);
                OrderOutput output = new OrderOutput();
                output.page = page;
                output.lastPage = lsOrder.Count() / SystemParam.MAX_ROW_IN_LIST + 1;
                output.ListOrder = lsOrder.ToPagedList(page, SystemParam.MAX_ROW_IN_LIST);
                result.Status = SystemParam.SUCCESS;
                result.Code = SystemParam.SUCCESS_CODE;
                result.Message = "";
                result.Result = output;
            }
            catch (Exception ex)
            {
                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Message = ex.ToString();
                result.Result = new object();
            }
            return result;
        }

        /// <summary>
        /// 20.Chi Tiết đơn hàng
        /// </summary>
        /// <param name="orderID"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetOrderDetail(int orderID)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? cusid = Util.checkTokenApp(token);
                var query = orderBus.GetOrderDetail(orderID, cusid);
                result.Status = query != null ? SystemParam.SUCCESS : SystemParam.ERROR;
                result.Code = query != null ? SystemParam.SUCCESS_CODE : SystemParam.PROCESS_ERROR;
                result.Message = query != null ? "" : "Đơn hàng không tồn tại";
                result.Result = query;

            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }

        /// <summary>
        /// 21. Tạo mới đơn hàng
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel CreateOrder(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                OrderDetailOutputModel item = JsonConvert.DeserializeObject<OrderDetailOutputModel>(input.ToString());
                {
                    var query = orderBus.CreateOrder(item.listOrderItem, Util.checkTokenApp(token), item);
                    if (query != null)
                    {

                        result.Status = SystemParam.SUCCESS;
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Message = "";
                        result.Result = query;
                    }
                    else
                    {
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Message = "Có lỗi sảy ra";
                    }

                }


            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = ex.ToString();
                result.Result = new object();
            }
            return result;
        }

        /// <summary>
        /// 22. Danh sách các cửa hàng
        /// </summary>
        /// <param name="provinceID"></param>
        /// <param name="lat"></param>
        /// <param name="lon"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetListShop(int? provinceID, double lat, double lon)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                if (Util.checkTokenApp(token) != null)
                {
                    var query = shopBus.GetListShop(provinceID, lat, lon, null);
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Message = query.Count > 0 ? "" : "Đơn hàng không tồn tại";
                    result.Result = query;
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }

            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }
        [HttpGet]
        public JsonResultModel GetListRanking()
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                if (Util.checkTokenApp(token) != null)
                {
                    int point = cnn.Customers.Find(Util.checkTokenApp(token).Value).PointRanking.Value;
                    List<Ranking> listRanking = cnn.Rankings.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).OrderBy(u => u.Level.Value).ToList();
                    string name = listRanking.Where(u => u.MinPoint.Value <= point && u.MaxPoint.Value >= point).FirstOrDefault().RankName;
                    var query = listRanking.Select(u => new
                    {
                        u.ID,
                        u.RankName,
                        MinPoint = u.MinPoint.Value,
                        MaxPoint = u.MaxPoint.Value,
                        u.Descriptions,
                        Content = u.MinPoint.Value > point ? ("Bạn cần tích thêm " + (u.MinPoint.Value - point) + " để lên bậc " + u.RankName) : "Bạn đang ở bậc " + name
                    }).ToList();
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Message = "";
                    result.Result = query;
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }

            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }

        [HttpGet]
        public JsonResultModel GetListShop(int? provinceID, int? districtID, double lat, double lon)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                if (Util.checkTokenApp(token) != null)
                {
                    var query = shopBus.GetListShop(provinceID, lat, lon, districtID);
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;
                    result.Message = query.Count > 0 ? "" : "Đơn hàng không tồn tại";
                    result.Result = query;
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }

            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }

        /// <summary>
        /// 23. Danh sách các sản phẩm
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel GetListItem(string searchKey)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                var query = itemBus.GetListItem(null);
                result.Status = SystemParam.SUCCESS;
                result.Code = SystemParam.SUCCESS_CODE;
                result.Message = query.Count > 0 ? "" : "Đơn hàng không tồn tại";
                result.Result = query;
            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                //result.Message = ex.ToString();
                result.Result = new object();
            }
            return result;
        }


        /// <summary>
        /// 23. Danh sách các sản phẩm
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel ActiveAgent(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                ActiveAgentCodeModel item = JsonConvert.DeserializeObject<ActiveAgentCodeModel>(input.ToString());
                if (Util.checkTokenApp(token) != null)
                {
                    var listagent = cnn.Agents.Where(u => u.Code.Equals(item.AgentCode) && u.IsActive.Equals(SystemParam.ACTIVE));
                    if (listagent != null && listagent.Count() > 0)
                    {
                        Agent agent = listagent.FirstOrDefault();
                        if (agent.CustomerActiveID == null)
                        {
                            var query = lgBus.ActiveAgent(Util.checkTokenApp(token).Value, agent.ID);
                            result.Status = SystemParam.SUCCESS;
                            result.Code = SystemParam.SUCCESS_CODE;
                            result.Message = "Khích hoạt mã đại lý thành công";
                            result.Result = query;
                        }
                        else
                        {
                            result.Message = "Mã đã được kich hoạt hoặc không tồn tại";
                            result.Status = SystemParam.ERROR;
                            result.Code = SystemParam.PROCESS_ERROR;
                        }
                    }
                    else
                    {
                        result.Message = "Mã đã được kich hoạt hoặc không tồn tại";
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.PROCESS_ERROR;
                    }
                }
                else
                {
                    result.Message = "Lỗi đăng nhập API";
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.ERROR_PASS_API;
                }

            }
            catch (Exception ex)
            {

                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }
        /// <summary>
        /// 23. Danh sách các sản phẩm
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResultModel ForgotPassWord(JObject input)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                UserInforOutputModel item = JsonConvert.DeserializeObject<UserInforOutputModel>(input.ToString());
                if (item.Email.Contains('@') && item.Email.Length > 6)
                {
                    Customer cus = cnn.Customers.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.Email.Equals(item.Email)).FirstOrDefault();
                    if (cus != null)
                    {
                        EmailBussines email = new EmailBussines();
                        email.configClient(item.Email, SystemParam.PASS_DEFAUL);
                        cus.DeviceID = "";
                        cus.PassWord = Util.CreateMD5(SystemParam.PASS_DEFAUL);
                        cus.Token = "";
                        cnn.SaveChanges();
                        result.Status = SystemParam.SUCCESS;
                        result.Code = SystemParam.SUCCESS_CODE;
                        result.Message = "Mật khẩu đã dược gửi về email của bạn";
                        result.Result = new object();
                    }
                    else
                    {
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.PROCESS_ERROR;
                        result.Message = "Tài khoản chưa được đăng ký";
                        result.Result = new object();
                    }
                }
                else
                {
                    result.Status = SystemParam.ERROR;
                    result.Code = SystemParam.PROCESS_ERROR;
                    result.Message = "Sai định dạng email";
                    result.Result = new object();

                }
            }
            catch (Exception ex)
            {
                result.Status = SystemParam.ERROR;
                result.Code = SystemParam.PROCESS_ERROR;
                result.Message = ex.ToString();
                result.Result = new object();
            }
            return result;
        }

        /// <summary>
        /// 24.Hủy đơn hàng
        /// </summary>
        /// <param name="orderID"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResultModel ChangeStatus(int orderID, int status)
        {
            JsonResultModel result = new JsonResultModel();
            try
            {
                string token = Request.Headers.GetValues("token").FirstOrDefault().ToString();
                int? cusID = Util.checkTokenApp(token);
                Order order = cnn.Orders.Find(orderID);
                if (order.Status == SystemParam.TYPE_NOTI_ORDER_CANCEL)
                {
                    result.Code = SystemParam.STATUS_CHANGED;
                    result.Status = SystemParam.SUCCESS;
                    result.Message = "Đơn hàng đã bị hủy";
                    result.Result = new object();
                    return result;
                }
                if (cusID != null)
                {
                    Customer cus = cnn.Customers.Find(Util.checkTokenApp(token).Value);
                    if (order != null)
                    {
                        if ((cus.Role == SystemParam.ROLE_ADMIN && order.Status != SystemParam.TYPE_NOTI_ORDER_CANCEL) && status != SystemParam.TYPE_NOTI_ORDER_CANCEL)
                        {
                            order.Status = status;
                            order.Agent_id = cusID.Value;
                        }
                        else if (cus.Role == SystemParam.ROLL_CUSTOMER && order.Status == SystemParam.TYPE_NOTI_NEW_ORDER)
                        {
                            order.Status = status;
                        }
                    }
                    if (status == SystemParam.TYPE_NOTI_CONFIRM_ORDER)
                    {
                        order.ConfirmDate = DateTime.Now;
                        order.Distance = shopBus.Distance(cus.Shop.Lati, cus.Shop.Long, (!order.lat.HasValue ? SystemParam.LAT_DEFAUL : order.lat.Value), (!order.lon.HasValue ? SystemParam.LON_DEFAUL : order.lon.Value));
                        cus.Point -= (int)order.Discount;
                        string code = order.Code;
                        pBus.CreateHistoryes(Util.checkTokenApp(token).Value, (int)order.Discount, 2, code, "", orderID);
                    }
                    else if (status == SystemParam.TYPE_NOTI_ORDER_CUSSCESS)
                    {
                        order.CompletionDate = DateTime.Now;
                    }
                    else if (status == SystemParam.TYPE_NOTI_ORDER_CANCEL && cus.Role == SystemParam.ROLE_ADMIN)
                        orderBus.SendRequest(orderID);
                    cnn.SaveChanges();
                    if (status != SystemParam.TYPE_NOTI_ORDER_CANCEL)
                    {
                        if (order.CustomerID != null)
                            notiBus.CreateNoti(order.CustomerID.Value, status, orderID, "", "", null);
                        else
                            notiBus.PushNotify(orderID, "", status, null);
                    }
                    var query = orderBus.GetOrderDetail(orderID, cusID);
                    result.Result = query;
                    result.Message = "Chuyển trạng thái đơn hàng thành công";
                    result.Status = SystemParam.SUCCESS;
                    result.Code = SystemParam.SUCCESS_CODE;

                }
                else
                {
                    if (status == SystemParam.TYPE_NOTI_ORDER_CANCEL)
                    {
                        var query = orderBus.GetOrderDetail(orderID, cusID);
                        result.Result = query;
                        result.Message = "Chuyển trạng thái đơn hàng thành công";
                        result.Status = SystemParam.SUCCESS;
                        result.Code = SystemParam.SUCCESS_CODE;
                    }
                    else
                    {
                        result.Message = "Lỗi đăng nhập API";
                        result.Status = SystemParam.ERROR;
                        result.Code = SystemParam.ERROR_PASS_API;
                    }
                }

            }
            catch (Exception ex)
            {
                result.Code = SystemParam.PROCESS_ERROR;
                result.Status = SystemParam.ERROR;
                result.Message = "Hệ thống đang bảo trì";
                result.Result = new object();
            }
            return result;
        }
    }

}