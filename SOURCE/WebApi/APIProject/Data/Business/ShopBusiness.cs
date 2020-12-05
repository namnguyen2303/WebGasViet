using Data.DB;
using Data.Model.APIApp;
using Data.Model.APIWeb;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class ShopBusiness : GenericBusiness
    {
        public ShopBusiness(DEKKOEntities context = null) : base()
        {

        }

        public List<ShopOutputModel> GetListShop(int? provinceID, double mylat, double mylong,int? districtID)
        {
            List<ShopOutputModel> data = new List<ShopOutputModel>();
            var query = from s in cnn.Shops
                        where s.IsActive.Equals(SystemParam.ACTIVE) && (provinceID.HasValue ? s.ProvinceID.Equals(provinceID.Value) : true) && (districtID.HasValue ? s.DistrictID.Value.Equals(districtID.Value) : true)
                        select new ShopOutputModel
                        {
                            ShopID = s.ID,
                            Address = s.Address,
                            ContactName = s.ContactName,
                            ContactPhone = s.ContactPhone,
                            Lat = s.Lati,
                            Long = s.Long,
                            ProvinceName = s.Province.Name,
                            ShopName = s.Name
                        };
            var listimage = cnn.ShopImages.Where(u => u.IsActive.Equals(SystemParam.ACTIVE));
            if (query != null && query.Count() > 0)
            {
                foreach (var output in query)
                {
                    output.Distance = Math.Round(Distance(output.Lat, output.Long, mylat, mylong));
                    output.ListImage = listimage.Where(u => u.ShopID.Equals(output.ShopID)).Select(u => u.Path).ToList();
                    data.Add(output);
                }
                return data.OrderBy(u => u.Distance).ToList();
            }
            else
                return new List<ShopOutputModel>();
        }
        public double Distance(double la1, double lo1, double la2, double lo2)
        {
            double dLat = (la2 - la1) * (Math.PI / 180);
            double dLon = (lo2 - lo1) * (Math.PI / 180);
            double la1ToRad = la1 * (Math.PI / 180);
            double la2ToRad = la2 * (Math.PI / 180);
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Cos(la1ToRad) * Math.Cos(la2ToRad) * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = 6371 * c;
            return Math.Round(d, 3);
        }

        public List<string> GetListImage(int ID)
        {
            try
            {
                var lstImage = from s in cnn.ShopImages
                               where s.IsActive.Equals(SystemParam.ACTIVE) && s.ShopID.Equals(ID)
                               select s.Path;
                return lstImage.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public List<ListShopOutputModel> Search(int Page, string ShopName, int? ProvinceID, int? DistrictID)
        {
            try
            {
                List<ListShopOutputModel> lstShop = new List<ListShopOutputModel>();
                var query = from s in cnn.Shops
                            where s.IsActive.Equals(SystemParam.ACTIVE) && (ProvinceID.HasValue ? s.ProvinceID == ProvinceID.Value : true) && (DistrictID.HasValue ? s.DistrictID == DistrictID.Value : true)
                            orderby s.ID descending
                            select new ListShopOutputModel
                            {
                                ID = s.ID,
                                Name = s.Name,
                                ContactName = s.ContactName,
                                ContactPhone = s.ContactPhone,
                                Province = s.Province.Name,
                                District = s.District.Name,
                                Address = s.Address,
                                CreateDate = s.CraeteDate
                            };
                if (query != null && query.Count() > 0)
                {
                    foreach (var output in query)
                    {
                        output.ImageUrl = GetListImage(output.ID);
                        lstShop.Add(output);
                    }
                    if (!String.IsNullOrEmpty(ShopName))
                        lstShop = lstShop.Where(u => Util.Converts(u.Name.ToLower()).Contains(Util.Converts(ShopName.ToLower())) || u.ContactPhone.Contains(ShopName)).ToList();
                }
                return lstShop;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ListShopOutputModel>();
            }
        }

        //Lấy ra danh sách thành phố
        public List<Province> getListProvince()
        {
            try
            {
                var query = from c in cnn.Provinces
                            orderby c.Name
                            select c;
                return query.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<Province>();
            }
        }

        public List<District> loadDistrictShop(int ProvinceID)
        {
            List<District> listDistrict = new List<District>();
            var query = from d in cnn.Districts
                        where d.ProvinceCode.Equals(ProvinceID)
                        select d;
            if (query != null && query.Count() > 0)
            {
                return query.ToList();
            }
            else
                return new List<District>();
        }


        public List<District> loadDistrictShopCreate(int ProvinceID)
        {
            List<District> listDistrict = new List<District>();
            var query = from d in cnn.Districts
                        where d.ProvinceCode.Equals(ProvinceID)
                        select d;
            if (query != null && query.Count() > 0)
            {
                return query.ToList();
            }
            else
                return new List<District>();
        }

        public List<District> loadDistrictShopUpdate(int ProvinceID)
        {
            List<District> listDistrict = new List<District>();
            var query = from d in cnn.Districts
                        where d.ProvinceCode.Equals(ProvinceID)
                        select d;
            if (query != null && query.Count() > 0)
            {
                return query.ToList();
            }
            else
                return new List<District>();
        }

        public int CreateShop(CreateShopInputModel data)
        {
            try
            {
                var checkLatLong = cnn.Shops.Where(i => i.IsActive.Equals(SystemParam.ACTIVE) && i.Lati.Equals(data.Lati) && i.Long.Equals(data.Long));
                if (checkLatLong.Count() > 0)
                {
                    return SystemParam.EXISTING;
                }
                Shop obj = new Shop();
                obj.Name = data.Name;
                obj.ProvinceID = data.ProvinceID;
                obj.DistrictID = data.DistrictID;
                obj.Address = data.Address;
                obj.PlusCode = data.PlusCode;
                obj.Lati = data.Lati;
                obj.Long = data.Long;
                obj.ContactName = data.ContactName;
                obj.ContactPhone = data.ContactPhone;
                obj.CraeteDate = DateTime.Now;
                obj.IsActive = SystemParam.ACTIVE;

                //int k = obj.PlusCode.Length; 

                if (data.ListUrl != null && data.ListUrl.Count() > 0)
                {
                    obj.ShopImages = new List<ShopImage>();
                    foreach (var img in data.ListUrl)
                    {
                        if (img != "")
                        {
                            ShopImage objImg = new ShopImage();
                            objImg.Path = img;
                            objImg.IsActive = SystemParam.ACTIVE;
                            objImg.CraeteDate = DateTime.Now;
                            obj.ShopImages.Add(objImg);
                        }
                    }
                }
                cnn.Shops.Add(obj);
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        //loadModalEditShop 
        public ListShopOutputModel loadModalEditShop(int ID)
        {
            try
            {
                var query = from s in cnn.Shops
                            where s.IsActive.Equals(SystemParam.ACTIVE) && s.ID.Equals(ID)
                            select new ListShopOutputModel
                            {
                                ID = s.ID,
                                Name = s.Name,
                                ProvinceID = s.ProvinceID,
                                DistrictID = s.DistrictID.Value,
                                Address = s.Address,
                                PlusCode = s.PlusCode,
                                Lati = s.Lati,
                                Long = s.Long,
                                ContactName = s.ContactName,
                                ContactPhone = s.ContactPhone,
                            };
                if (query != null && query.Count() > 0)
                {
                    var shop = query.Single();
                    var ListImage = GetListImage(ID);
                    if (ListImage != null && ListImage.Count() > 0)
                    {
                        shop.ImageUrl = new List<string>();
                        foreach (var url in ListImage)
                        {
                            shop.ImageUrl.Add(url);
                        }
                    }
                    else
                    {
                        shop.ImageUrl = new List<string>();
                    }
                    return shop;

                }
                else
                {
                    return new ListShopOutputModel();
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new ListShopOutputModel();
            }
        }

        public int DeleteShop(int ID)
        {
            try
            {
                var obj = cnn.Shops.Find(ID);
                obj.IsActive = SystemParam.ACTIVE_FALSE;
                var lstImage = cnn.ShopImages.Where(u => u.ShopID.Equals(ID)).ToList();
                foreach (var o in lstImage)
                {
                    o.IsActive = SystemParam.ACTIVE_FALSE;
                }
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }


        public int EditShop(CreateShopInputModel data)
        {
            try
            {
                var obj = cnn.Shops.Find(data.ID);
                obj.Name = data.Name;
                obj.ProvinceID = data.ProvinceID;
                obj.DistrictID = data.DistrictID;
                obj.ContactName = data.ContactName;
                obj.ContactPhone = data.ContactPhone;
                obj.Address = data.Address;
                obj.PlusCode = data.PlusCode;
                obj.Lati = data.Lati;
                obj.Long = data.Long;
                List<ShopImage> lstImg = cnn.ShopImages.Where(u => u.ShopID.Equals(data.ID)).ToList();
                foreach (var i in lstImg)
                {
                    cnn.ShopImages.Remove(i);
                }
                obj.ShopImages = new List<ShopImage>();
                if (data.ListUrl != null && data.ListUrl.Count() > 0)
                {
                    foreach (var img in data.ListUrl)
                    {
                        if (img != "")
                        {
                            ShopImage objImg = new ShopImage();
                            objImg.Path = img;
                            objImg.IsActive = SystemParam.ACTIVE;
                            objImg.CraeteDate = DateTime.Now;
                            obj.ShopImages.Add(objImg);

                        }
                    }
                }
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }
    }
}
