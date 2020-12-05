using Data.DB;
using Data.Model.APIWeb;
using Data.Utils;
using PagedList;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class ConfigBusiness : GenericBusiness
    {
        public ConfigBusiness(DEKKOEntities context = null) : base()
        {

        }

        public List<Configss> showElement() {
            return cnn.Configsses.ToList();
        }

        public IPagedList<ListGiftWebOutputModel> SearchConfigCard(int Page)
        {
            try
            {
                var query = from g in cnn.Gifts
                            where g.IsActive.Equals(SystemParam.ACTIVE) && g.Type.Equals(SystemParam.TYPE_GIFT_CARD)
                            orderby g.ID descending
                            select new ListGiftWebOutputModel
                            {
                                ID = g.ID,
                                Name = g.Name,
                                Point = g.Point,
                                Price = g.Price,
                                Description = g.Description,
                                Status = g.Status,
                                CreateDate = g.CreateDate
                            };
                int count = query.Count();
                if (query != null && query.Count() > 0)
                {
                    List<ListGiftWebOutputModel> list = query.OrderByDescending(x => x.CreateDate).ToList();
                    return list.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
                }
                else
                {
                    return new List<ListGiftWebOutputModel>().ToPagedList(1, 1);
                }
            }
            catch
            {
                return new List<ListGiftWebOutputModel>().ToPagedList(1, 1);
            }
        }

        // tìm kiếm
        public IPagedList<ListGiftWebOutputModel> SearchConfigGift(int Page)
        {
            try
            {
                var query = from g in cnn.Gifts
                            where g.IsActive.Equals(SystemParam.ACTIVE) && (g.Type.Equals(SystemParam.TYPE_GIFT_GIFT) || g.Type.Equals(SystemParam.TYPE_GIFT_VOUCHER))
                            orderby g.ID descending
                            select new ListGiftWebOutputModel
                            {
                                ID = g.ID,
                                Name = g.Name,
                                Point = g.Point,
                                Price = g.Price,
                                Description = g.Description,
                                Status = g.Status,
                                CreateDate = g.CreateDate
                            };
                int count = query.Count();
                if (query != null && query.Count() > 0)
                {
                    List<ListGiftWebOutputModel> list = query.ToList();
                    return list.ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
                }
                else
                {
                    return new List<ListGiftWebOutputModel>().ToPagedList(1, 1);
                }
            }
            catch
            {
                return new List<ListGiftWebOutputModel>().ToPagedList(1, 1);
            }
        }

        public int DeleteConfigGift(int ID)
        {
            try
            {
                Gift gift = cnn.Gifts.Find(ID);
                gift.IsActive = SystemParam.NO_ACTIVE_DELETE;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }


        public int DeleteConfigCard(int ID)
        {
            try
            {
                Gift gift = cnn.Gifts.Find(ID);
                gift.IsActive = SystemParam.NO_ACTIVE_DELETE;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        // tạo thiết lập điểm với quà, voucher
        public int CreateConfigGift(int CreateUserID, string Name, int Price, int Point, string UrlImage, string Description, int Type, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                Gift gift = new Gift();
                gift.CreateUserID = CreateUserID;
                gift.Name = Name;
                gift.Price = Price;
                gift.Point = Point;
                gift.UrlImage = UrlImage;
                gift.Description = Description;
                gift.Type = Type;
                gift.FromDate = FromDate;
                gift.ToDate = ToDate;
                gift.TelecomType = SystemParam.TELECOM_TYPE_GIFT;
                gift.Status = SystemParam.STATUS_GIFT_ACTIVE;
                gift.IsActive = SystemParam.ACTIVE;
                gift.CreateDate = DateTime.Now;
                cnn.Gifts.Add(gift);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }


        public int UpdateConfigGift(int ID, string Name, int Price, int Point, string UrlImage, string Description, int Type, DateTime? FromDate, DateTime? ToDate, int Status)
        {
            try
            {
                Gift gift = cnn.Gifts.Find(ID);
                gift.Name = Name;
                gift.Price = Price;
                gift.Point = Point;
                gift.UrlImage = UrlImage;
                gift.Description = Description;
                gift.Type = Type;
                gift.FromDate = FromDate;
                gift.ToDate = ToDate;
                gift.Status = Status;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }


        // tạo thiết lập điểm với thẻ cào
        public int CreateConfigCard(int CreateUserID, int Price, int Point, string Description, int Type, int TelecomType)
        {
            try
            {
                var configCardCurrent = cnn.Gifts.Where(u => u.IsActive.Equals(SystemParam.ACTIVE) && u.TelecomType.Value.Equals(TelecomType) && u.Price.Equals(Price)).ToList();

                //var configCardCurrent = from g in cnn.Gifts
                //                        where g.IsActive.Equals(SystemParam.ACTIVE) && g.TelecomType.Value.Equals(TelecomType) && g.Price.Equals(Price)
                //                        select new ListGiftWebOutputModel
                //                        {
                //                            ID = g.ID
                //                        };

                if (configCardCurrent != null && configCardCurrent.Count() > 0)
                {
                    return SystemParam.EXISTING;
                }

                string Name = "";
                switch (TelecomType)
                {
                    case SystemParam.TYPE_VIETTEL:
                        Name = "Thẻ " + SystemParam.TYPE_VIETTEL_STRING + " " + Price;
                        break;
                    case SystemParam.TYPE_MOBIPHONE:
                        Name = "Thẻ " + SystemParam.TYPE_MOBIPHONE_STRING + " " + Price;
                        break;
                    case SystemParam.TYPE_VINAPHONE:
                        Name = "Thẻ " + SystemParam.TYPE_VINAPHONE_STRING + " " + Price;
                        break;
                    case SystemParam.TYPE_VIETNAMMOBILE:
                        Name = "Thẻ " + SystemParam.TYPE_VIETNAMMOBILE_STRING + " " + Price;
                        break;
                    default:
                        break;
                }

                Gift gift = new Gift();
                gift.CreateUserID = CreateUserID;
                gift.Name = Name;
                gift.Price = Price;
                gift.Point = Point;
                gift.Description = Description;
                gift.Type = Type;
                gift.TelecomType = TelecomType;
                gift.Status = SystemParam.STATUS_GIFT_ACTIVE;
                gift.IsActive = SystemParam.ACTIVE;
                gift.CreateDate = DateTime.Now;
                cnn.Gifts.Add(gift);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch (Exception e)
            {
                e.ToString();
                return SystemParam.ERROR;
            }
        }

        public int UpdateConfigCard(int ID, int Point, string Description)
        {
            try
            {
                Gift gift = cnn.Gifts.Find(ID);
                gift.Point = Point;
                gift.Description = Description;
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            }
            catch (Exception e)
            {
                e.ToString();
                return SystemParam.ERROR;
            }
        }


        public ListGiftWebOutputModel GetConfigGiftDetail(int ID)
        {
            try
            {
                ListGiftWebOutputModel configGiftDetail = new ListGiftWebOutputModel();

                var query = (from g in cnn.Gifts
                             where g.IsActive.Equals(SystemParam.ACTIVE) && g.ID.Equals(ID)
                             select new ListGiftWebOutputModel
                             {
                                 ID = g.ID,
                                 Type = g.Type,
                                 Name = g.Name,
                                 Point = g.Point,
                                 Price = g.Price,
                                 FromDate = g.FromDate,
                                 ToDate = g.ToDate,
                                 Status = g.Status,
                                 Description = g.Description,
                                 TelecomType = g.TelecomType,
                                 UrlImage = g.UrlImage
                             }).FirstOrDefault();
                if (query != null && query.ID > 0)
                {
                    return configGiftDetail = query;
                }
                return configGiftDetail;
            }
            catch
            {
                return new ListGiftWebOutputModel();
            }
        }

        public ListGiftWebOutputModel GetConfigCardDetail(int ID)
        {
            try
            {
                ListGiftWebOutputModel configCardDetail = new ListGiftWebOutputModel();

                var query = (from g in cnn.Gifts
                             where g.IsActive.Equals(SystemParam.ACTIVE) && g.ID.Equals(ID)
                             select new ListGiftWebOutputModel
                             {
                                 ID = g.ID,
                                 Name = g.Name,
                                 Point = g.Point,
                                 Price = g.Price,
                                 Description = g.Description,
                                 TelecomType = g.TelecomType,
                             }).FirstOrDefault();
                if (query != null && query.ID > 0)
                {
                    return configCardDetail = query;
                }
                return configCardDetail;
            }
            catch
            {
                return new ListGiftWebOutputModel();
            }
        }

        public int SaveConfig(int Distance, int TimeWaiting, int PointAddFirst) {
            try {
                var distance = cnn.Configsses.Where(x => x.NameConst.Contains("Distance")).FirstOrDefault();
                var timewaiting = cnn.Configsses.Where(x => x.NameConst.Contains("TimeWaiting")).FirstOrDefault();
                var pointaddfirst = cnn.Configsses.Where(x => x.NameConst.Contains("PointAddFirst")).FirstOrDefault();

                distance.ValueConst = Distance;
                timewaiting.ValueConst = TimeWaiting * 1000;
                pointaddfirst.ValueConst = PointAddFirst;

                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.FAIL;
            }
        }
    }
}
