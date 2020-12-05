using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Data.Business
{
    public class NewsBusiness : GenericBusiness
    {
        public NewsBusiness(DEKKOEntities context = null) : base()
        {
        }

        public List<NewsAppOutputModel> GetListNews(int type, int? CateID)
        {
            int typeSend = SystemParam.TYPE_SEND_ALL;
            //if (string.IsNullOrEmpty(cus.AgentCode))
            //    typeSend = SystemParam.TYPE_SEND_CUSTOMER;
            //else
            //    typeSend = SystemParam.TYPE_SEND_AGENCY;

            List<NewsAppOutputModel> query = new List<NewsAppOutputModel>();
            var ListNews = from n in cnn.News
                           where n.Type.Equals(type) && n.IsActive.Equals(SystemParam.ACTIVE) && n.Status.Equals(SystemParam.ACTIVE) && ((type == 4 && CateID != null) ? n.CategoryID.Equals(CateID.Value) : true)
                           orderby n.DisplayOrder
                           select new NewsAppOutputModel
                           {
                               NewsID = n.ID,
                               Content = n.Content,
                               CreateDate = n.CreateDate,
                               Title = n.Title,
                               Type = n.Type,
                               UrlImage = n.UrlImage,
                               Description = n.Description
                           };
            if (ListNews != null && ListNews.Count() > 0)
            {
                foreach (var news in ListNews)
                {
                    NewsAppOutputModel output = new NewsAppOutputModel();
                    output = news;
                    output.UrlImage = output.UrlImage.ToLower().Contains("http") ? output.UrlImage : "http://" + HttpContext.Current.Request.Url.Authority + "/" + output.UrlImage;
                    query.Add(output);
                }
            }
            return query;
        }
        public NewsAppOutputModel GetNews(int newID)
        {
            List<NewsAppOutputModel> query = new List<NewsAppOutputModel>();
            var ListNews = from n in cnn.News
                           where n.IsActive.Equals(SystemParam.ACTIVE) && n.Status.Equals(SystemParam.ACTIVE) && n.ID.Equals(newID)
                           orderby n.DisplayOrder
                           select new NewsAppOutputModel
                           {
                               NewsID = n.ID,
                               Content = n.Content,
                               CreateDate = n.CreateDate,
                               Title = n.Title,
                               Type = n.Type,
                               UrlImage = n.UrlImage.ToLower().Contains("http") ? n.UrlImage : "http://" + HttpContext.Current.Request.Url.Authority + "/" + n.UrlImage,
                               Description = n.Description
                           };
            return ListNews.FirstOrDefault();
        }

        // tạo lô bài viết tin tức
        public int CreateNewsDekko(string Content, string Title, string Description, int Type, int? TypeSend, string UrlImage, int Status, int Display, int CreateUserID)
        {
            try
            {
                News news = new News();
                NotifyBusiness notify = new NotifyBusiness();
                PackageBusiness package = new PackageBusiness();
                news.CreateUserID = CreateUserID;
                news.CategoryID = 1;
                news.Title = Title;
                news.Description = Description;
                news.Content = Content;
                news.Type = Type;
                news.DisplayOrder = Display;
                if (TypeSend == null)
                {
                    news.TypeSend = 8;
                }
                else
                {
                    news.TypeSend = TypeSend.Value;
                }

                news.Status = Status;
                news.UrlImage = UrlImage;
                news.CreateDate = DateTime.Today;
                news.IsActive = SystemParam.ACTIVE;
                cnn.News.Add(news);
                cnn.SaveChanges();
                if (TypeSend != null && Status == 1)
                {
                    int newsID = cnn.News.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).OrderByDescending(u => u.ID).FirstOrDefault().ID;
                    List<int> deviceID = cnn.Customers.Where(c => c.IsActive.Equals(1) && !String.IsNullOrEmpty(c.DeviceID) && c.DeviceID.Length > 15 && c.Role.Equals(SystemParam.ROLL_CUSTOMER)).Select(c => c.ID).ToList();
                    foreach (var cus in deviceID)
                    {
                        notify.CreateNoti(cus, 6, 0, Title, Title, newsID);
                    }
                }
                return SystemParam.SUCCESS;
            }
            catch (Exception e)
            {
                e.ToString();
                return SystemParam.ERROR;
            }
        }

        public CategoryNew GetCategoryByName(int Type)
        {
            try
            {
                string categoryName = "";
                switch (Type)
                {
                    case SystemParam.TYPE_ADS:
                        categoryName = SystemParam.TYPE_ADS_STRING;
                        break;
                    case SystemParam.TYPE_EVENT:
                        categoryName = SystemParam.TYPE_EVENT_STRING;
                        break;
                    case SystemParam.TYPE_NEWS:
                        categoryName = SystemParam.TYPE_NEWS_STRING;
                        break;
                    case SystemParam.TYPE_PRODUCT:
                        categoryName = SystemParam.TYPE_PRODUCT_STRING;
                        break;
                    case SystemParam.TYPE_PROMOTION:
                        categoryName = SystemParam.TYPE_PROMOTION_STRING;
                        break;
                    case SystemParam.TYPE_PRICE_QUOTE:
                        categoryName = SystemParam.TYPE_PRICE_QUOTE_STRING;
                        break;
                    default:
                        break;
                }
                var categoryNews = cnn.CategoryNews.Where(u => u.Name.Equals(categoryName)).FirstOrDefault();
                return categoryNews;
            }
            catch
            {
                return new CategoryNew();
            }
        }

        //chỉnh sửa bài viết
        public int UpdateNewsDekko(int ID, string Content, string Title, string Description, int Type, int TypeSend, string UrlImage, int Status, int Item, int Display)
        {
            try
            {
                News news = cnn.News.Find(ID);
                news.CategoryID = Type == SystemParam.TYPE_PRODUCT ? Item : GetCategoryByName(Type).ID;
                news.Title = Title;
                news.Description = Description;
                news.Content = Content;
                news.Type = Type;
                news.DisplayOrder = Display;
                news.TypeSend = TypeSend;
                if (Status == SystemParam.UPDATE_NEWS_POST)
                {
                    news.Status = SystemParam.STATUS_NEWS_ACTIVE;
                }
                news.UrlImage = UrlImage;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        //xóa bài viết
        public int DeleteNews(int ID)
        {
            try
            {
                News news = cnn.News.Find(ID);
                news.IsActive = SystemParam.NO_ACTIVE_DELETE;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        // tìm kiếm
        public List<ListNewsWebOutputModel> Search(int Page, string Title, int? CreateUserID, int? Type, int? Status, string FromDate, string ToDate)
        {
            try
            {
                List<ListNewsWebOutputModel> listNews = new List<ListNewsWebOutputModel>();
                DateTime? startdate = Util.ConvertDate(FromDate);
                DateTime? endDate = Util.ConvertDate(ToDate);

                var query = from n in cnn.News
                            where n.IsActive.Equals(SystemParam.ACTIVE)
                            //&& (!String.IsNullOrEmpty(Title) ? n.Title.Contains(Title) : true)
                            && (CreateUserID.HasValue ? n.CreateUserID == CreateUserID.Value : true)
                            && (Type.HasValue ? n.Type == Type.Value : true)
                            && (Status.HasValue ? n.Status == Status.Value : true)
                            && (startdate.HasValue ? n.CreateDate >= startdate.Value : true)
                            && (endDate.HasValue ? n.CreateDate <= endDate.Value : true)
                            orderby n.ID descending
                            select new ListNewsWebOutputModel
                            {
                                ID = n.ID,
                                CategoryName = n.CategoryNew.Name,
                                Title = n.Title,
                                Status = n.Status,
                                Type = n.Type,
                                Display = n.DisplayOrder.Value,
                                CreateUserID = n.User.UserID,
                                CreateUserName = n.User.UserName,
                                CreateDate = n.CreateDate
                            };
                if (query != null && query.Count() > 0)
                {
                    listNews = query.ToList();
                    if (!String.IsNullOrEmpty(Title))
                        listNews = listNews.Where(u => Util.Converts(u.Title.ToLower()).Contains(Util.Converts(Title.ToLower())) || Util.Converts(u.CreateUserName.ToLower()).Contains(Util.Converts(Title.ToLower()))).ToList();
                }
                return listNews;
            }
            catch
            {
                return new List<ListNewsWebOutputModel>();
            }
        }


        //danh sách các sản phầm con cho bài viết vê  danh mục sản phẩm
        public List<CategoryModel> getItemNewsProduct()
        {
            try
            {
                List<CategoryModel> listCategory = new List<CategoryModel>();
                var query = from c in cnn.CategoryNews
                            where c.IsActive == SystemParam.ACTIVE && c.ParentID == SystemParam.PARENT_NEWS_PRODUCT
                            select new CategoryModel
                            {
                                CategoryID = c.ID,
                                Name = c.Name,
                                ParentID = c.ParentID
                            };

                if (query != null && query.Count() > 0)
                {
                    listCategory = query.ToList();
                    return listCategory;
                }
                else
                    return listCategory;
            }
            catch (Exception)
            {
                return new List<CategoryModel>();
            }

        }


        //lấy danh sách tácc giả
        public List<ListUserWebOutputModel> GetListAuthor()
        {
            try
            {
                var ListUser = from news in cnn.News
                               join user in cnn.Users on news.CreateUserID equals user.UserID
                               where news.IsActive == SystemParam.ACTIVE
                               select new ListUserWebOutputModel()
                               {
                                   ID = user.UserID,
                                   Name = user.UserName,
                                   CreateDate = user.CreateDate
                               };
                if (ListUser != null && ListUser.Count() > 0)
                {
                    ListUser = ListUser.Distinct();
                    return ListUser.ToList();

                }
                else
                {
                    return new List<ListUserWebOutputModel>();
                }

            }
            catch
            {
                return new List<ListUserWebOutputModel>();
            }
        }

        //lấy thông tin chi tiết 1 bài viết
        public ListNewsWebOutputModel GetNewsDetail(int ID)
        {
            try
            {
                ListNewsWebOutputModel newsDetail = new ListNewsWebOutputModel();

                var query = (from n in cnn.News
                             join u in cnn.Users on n.CreateUserID equals u.UserID
                             where n.IsActive.Equals(SystemParam.ACTIVE) && n.ID.Equals(ID)
                             select new ListNewsWebOutputModel
                             {
                                 ID = n.ID,
                                 Type = n.Type,
                                 CategoryID = n.CategoryID,
                                 Display = n.DisplayOrder.Value,
                                 TypeSend = n.TypeSend,
                                 Status = n.Status,
                                 Title = n.Title,
                                 Depcription = n.Description,
                                 Content = n.Content,
                                 UrlImage = n.UrlImage,
                                 CreateUserID = n.CreateUserID,
                                 CreateUserName = u.UserName
                             }).FirstOrDefault();
                if (query != null && query.ID > 0)
                {
                    return newsDetail = query;
                }
                return newsDetail;
            }
            catch
            {
                return new ListNewsWebOutputModel();
            }
        }

    }
}
