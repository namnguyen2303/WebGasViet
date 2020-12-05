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
    public class ItemBusiness : GenericBusiness
    {
        public ItemBusiness(DEKKOEntities context = null) : base()
        {

        }

        public List<ListItemOutputModel> Search(int Page, string FromDate, string ToDate, string ItemName, string ItemCode)
        {
            try
            {
                List<ListItemOutputModel> listItem = new List<ListItemOutputModel>();
                var query = from i in cnn.Items
                            where i.IsActive.Equals(SystemParam.ACTIVE)
                            select new ListItemOutputModel {
                                ID = i.ID,
                                Code = i.Code,
                                Name = i.Name,
                                Point = i.Point.Value,
                                Brand = i.Brand,
                                MadeIn = i.MadeIn,
                                Warranty = i.Warranty,
                                Price = i.Price,
                                AgentPrice = i.AgentPrice,
                                DiscountPrice = i.DiscountPrice,
                                Description = i.Description,
                                //nguoi tao
                                CreateDate = i.CreateDate,
                                Status = i.Status

                                //ID = i.ID,
                                //Category = cnn.CategoryNews.Where(u =>u.ID.Equals(i.CateID.Value)).FirstOrDefault() != null? cnn.CategoryNews.Where(u => u.ID.Equals(i.CateID.Value)).FirstOrDefault().Name :"Chưa cập nhật",
                                //ItemCode = i.Code,
                                //ItemName = i.Name,
                                //ItemStatus = i.Status,
                                //Price = i.Price,
                                //CreateDate = i.CreateDate
                            };
                
                if(FromDate != null && FromDate != "") {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    query = query.Where(x => x.CreateDate >= fd);
                }
                if(ToDate != null && ToDate != "") {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(x => x.CreateDate <= td);
                }
                if(ItemName != null && ItemName != "") {
                    query = query.Where(x => x.Name.Contains(ItemName));
                }
                if(ItemCode != null && ItemCode != "") {
                    query = query.Where(x => x.Code.Contains(ItemCode));
                }

                if (query != null && query.Count() > 0) 
                    return query.OrderByDescending(x => x.ID).ToList();
                else
                    return new List<ListItemOutputModel>();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ListItemOutputModel>();
            }
        }

        public List<CategoryModel> getListCategory()
        {
            try
            {
                List<CategoryModel> listCategory = new List<CategoryModel>();
                var query = from c in cnn.CategoryNews
                            where c.IsActive == SystemParam.ACTIVE && c.ParentID == SystemParam.CATEGORY_PRODUCT
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


        public List<ItemOutputModel> GetListItem(string searchKey)
        {
            List<ItemOutputModel> data = new List<ItemOutputModel>();
            var query = from i in cnn.Items
                        where i.IsActive.Equals(SystemParam.ACTIVE) && i.Status.Equals(SystemParam.ACTIVE)
                        orderby i.CreateDate descending
                        select new ItemOutputModel
                        {
                            ItemID = i.ID,
                            ImageUrl = i.ImageUrl,
                            Description = i.Description,
                            ItemName = i.Name,
                            OldPrice = i.Price,
                            NewPrice = i.DiscountPrice,
                            Brand  = i.Brand,
                            CateID = i.CateID.Value,
                            MadeIn = i.MadeIn,
                            Warranty = i.Warranty
                        };

            if (query != null && query.Count() > 0)
            {
                foreach (var output in query)
                {
                    if (!output.ImageUrl.ToLower().Contains("http"))
                        output.ImageUrl = "http://" + HttpContext.Current.Request.Url.Authority + "/" + output.ImageUrl;
                    data.Add(output);
                }
            }
            if (!String.IsNullOrEmpty(searchKey))
                data = data.Where(u => u.ItemName.Contains(searchKey)).ToList();
            return data;
        }

        public Boolean CheckExistingItem(string itemCode)
        {
            try
            {
                var item = cnn.Items.Where(u => u.Code.Equals(itemCode) && u.IsActive.Equals(SystemParam.ACTIVE)).ToList();
                if (item != null && item.Count() > 0)
                {
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }


        public int CreateItem(CreateItemInputModel Input)
        {
            try
            {
                if (CheckExistingItem(Input.Code))
                {
                    return SystemParam.EXISTING;
                }
                Item item = new Item();
                item.CateID = Input.CategoryID;
                item.Code = Input.Code.Trim();
                item.Name = Input.Name.Trim();
                item.Point = Convert.ToInt32((Input.Pointstr).ToString().Replace(",", ""));
                item.Brand = Input.Brand.Trim();
                item.MadeIn = Input.MadeIn.Trim();
                item.Warranty = Input.Warranty.Trim();
                item.Price = Convert.ToInt32((Input.Price).ToString().Replace(",", ""));
                item.AgentPrice = Convert.ToInt32((Input.AgentPrice).ToString().Replace(",", ""));
                item.DiscountPrice = Convert.ToInt32((Input.DiscountPrice).ToString().Replace(",", ""));
                item.ImageUrl = Input.ImageUrl.ToString();
                item.Description = Input.Description.Trim();
                item.Status = SystemParam.ACTIVE;
                item.CreateDate = DateTime.Today;
                item.IsActive = SystemParam.ACTIVE;
                cnn.Items.Add(item);
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public CreateItemInputModel LoadItem(int ID)
        {
            try
            {
                var obj = cnn.Items.Find(ID);
                CreateItemInputModel Item = new CreateItemInputModel();
                Item.ID = obj.ID;
                Item.Code = obj.Code;
                Item.Name = obj.Name;
                Item.Point = obj.Point.Value;
                Item.Status = obj.Status;
                Item.Price = obj.Price.ToString();
                Item.AgentPrice = obj.AgentPrice.ToString();
                Item.DiscountPrice = obj.DiscountPrice.ToString();
                Item.ImageUrl = obj.ImageUrl;
                Item.Description = obj.Description;
                Item.Brand = obj.Brand;
                Item.Warranty = obj.Warranty;
                Item.MadeIn = obj.MadeIn;
                return Item;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new CreateItemInputModel();
            }
        }

        public int DeleteItem(int ID)
        {
            try
            {
                var obj = cnn.Items.Find(ID);
                obj.IsActive = SystemParam.ACTIVE_FALSE;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public int SaveEditItem(CreateItemInputModel Input)
        {
            try
            {
                var pointInt = Convert.ToInt32((Input.Pointstr).ToString().Replace(",", ""));
                var obj = cnn.Items.Find(Input.ID);
                if (pointInt != obj.Point)
                {
                    NotifyBusiness notify = new NotifyBusiness();
                    List<int> idAgent = (from c in cnn.Customers
                                         where c.IsActive.Equals(SystemParam.ACTIVE) && c.Role.Equals(SystemParam.ROLE_ADMIN) && c.DeviceID.Length >= 15
                                         select c.ID).ToList();
                    foreach (var id in idAgent)
                    {
                        string contennotify = "Chiết khấu cho sản phẩm " + obj.Name + " được thay đổi là " + pointInt + " điểm, được áp dụng từ thời điểm hiện tại cho đại lý";
                        notify.CreateNoti(id, SystemParam.CHANGE_MINUS_POINT_ITEM, 0, contennotify, contennotify, null);
                    }
                }
                obj.Code = Input.Code;
                obj.Name = Input.Name.Trim();
                obj.Point = pointInt;
                obj.Price = Convert.ToInt32((Input.Price).ToString().Replace(",", ""));
                obj.AgentPrice = Convert.ToInt32((Input.AgentPrice).ToString().Replace(",", ""));
                obj.DiscountPrice = Convert.ToInt32((Input.DiscountPrice).ToString().Replace(",", ""));
                obj.ImageUrl = Input.ImageUrl;
                obj.Description = Input.Description.Trim();
                obj.Brand = Input.Brand.Trim();
                obj.Warranty = Input.Warranty.Trim();
                obj.MadeIn = Input.MadeIn.Trim();
                obj.Status = Input.Status;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public string countItem()
        {
            var listItem = cnn.Items.Where(u => u.IsActive.Equals(SystemParam.ACTIVE));
            int activeItem = listItem.Where(u => u.Status.Equals(1)).Count();
            int countItem = listItem.Count();
            return cnn.Items.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).Count().ToString();
        }
    }
}
