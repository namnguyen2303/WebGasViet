using Data.DB;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class UserBusiness : GenericBusiness
    {
        public UserBusiness(DEKKOEntities context = null) : base()
        {

        }

        public IPagedList<UserDetailOutputModel> Search(int Page, string Phone, string FromDate, string ToDate)
        {
            try
            {
                DateTime? startdate = Util.ConvertDate(FromDate);
                DateTime? endDate = Util.ConvertDate(ToDate);

                var query = from u in cnn.Users
                            where u.IsActive.Equals(SystemParam.ACTIVE)
                            //&& (!String.IsNullOrEmpty(Phone) ? u.Phone.Contains(Phone) : true)
                            && (startdate.HasValue ? u.CreateDate >= startdate.Value : true)
                            && (endDate.HasValue ? u.CreateDate <= endDate.Value : true)
                            orderby u.UserID descending
                            select new UserDetailOutputModel
                            {
                                UserID = u.UserID,
                                Role = u.Role,
                                UserName = u.UserName,
                                Phone = u.Phone,
                                CreateDate = u.CreateDate
                            };
                if (query != null && query.Count() > 0)
                {
                    //IPagedList<UserDetailOutputModel> list = query.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
                    //return list;
                    List<UserDetailOutputModel> list = query.ToList();
                    if (!String.IsNullOrEmpty(Phone))
                        list = list.Where(u => Util.Converts(u.Phone.ToLower()).Contains(Util.Converts(Phone.ToLower()))).ToList();
                    return list.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
                }
                else
                {
                    return new List<UserDetailOutputModel>().ToPagedList(1, 1);
                }
            }
            catch
            {
                return new List<UserDetailOutputModel>().ToPagedList(1, 1);
            }
        }

        public int ChangePassword(int ID, string CurrentPassword, string NewPassword)
        {
            try
            {
                string hashPassword = Util.CreateMD5(CurrentPassword);
                var currentUser = cnn.Users.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.UserID.Equals(ID) && u.PassWord.Equals(hashPassword));
                if (currentUser == null || currentUser.Count() <= 0)
                {
                    return SystemParam.WRONG_PASSWORD;
                }

                User user = cnn.Users.Find(ID);
                user.PassWord = Util.CreateMD5(NewPassword);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        public int CreateUser(string Phone, string UserName, string Password)
        {
            try
            {
                var currentUser = cnn.Users.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.Phone.Equals(Phone));
                if (currentUser != null && currentUser.Count() > 0)
                {
                    return SystemParam.EXISTING;
                }

                User user = new User();
                user.Phone = Phone;
                user.UserName = UserName;
                user.Role = SystemParam.ROLE_ADMIN;
                user.PassWord = Util.CreateMD5(Password);
                user.IsActive = SystemParam.ACTIVE;
                user.CreateDate = DateTime.Today;
                cnn.Users.Add(user);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        public UserDetailOutputModel GetUserDetail(int ID)
        {
            try
            {
                UserDetailOutputModel userDetail = new UserDetailOutputModel();

                var query = (from u in cnn.Users
                             where u.IsActive.Equals(SystemParam.ACTIVE) && u.UserID.Equals(ID)
                             select new UserDetailOutputModel
                             {
                                 UserID = u.UserID,
                                 Role = u.Role,
                                 UserName = u.UserName,
                                 Phone = u.Phone
                             }).FirstOrDefault();
                if (query != null && query.UserID > 0)
                {
                    return userDetail = query;
                }
                return userDetail;
            }
            catch
            {
                return new UserDetailOutputModel();
            }
        }

        public int UpdateRole(int ID, string Phone, string UserName)
        {
            try
            {
                User user = cnn.Users.Find(ID);
                user.Phone = Phone;
                user.UserName = UserName;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        public int DeleteUser(int ID)
        {
            try
            {
                User user = cnn.Users.Find(ID);
                user.IsActive = SystemParam.NO_ACTIVE_DELETE;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        public int ResetPasswrod(int ID) {
            try {
                var DefaultPassword = "123456";
                User user = cnn.Users.Find(ID);
                user.PassWord = Util.CreateMD5(DefaultPassword);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            } catch(Exception ex) {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

    }
}
