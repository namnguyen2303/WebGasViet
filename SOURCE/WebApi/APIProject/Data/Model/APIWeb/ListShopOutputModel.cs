using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Utils;
namespace Data.Model.APIWeb
{
    public class ListShopOutputModel
    {
        public int ID { set; get; }
        public string Name { set; get; }
        public int ProvinceID { set; get; }
        public string Province { set; get; }
        public int DistrictID { set; get; }
        public string District { set; get; }
        public string Address { set; get; }
        public double Lati { set; get; }
        public double Long { set; get; }
        public string PlusCode { set; get; }
        public string ContactName { set; get; }
        public string ContactPhone { set; get; }
        public DateTime? CreateDate { set; get; }
        public List<string> ImageUrl { set; get; }
        public string GetStringCreateDate
        {
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
    }
}
