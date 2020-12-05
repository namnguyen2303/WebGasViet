using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Utils;
namespace Data.Model.APIWeb
{
    public class ListItemOutputModel
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? Point { get; set; }
        public string Brand { get; set; }
        public string MadeIn { get; set; }
        public string Warranty { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public long AgentPrice { get; set; }
        public long DiscountPrice { get; set; }
        public string ImageUrl { get; set; }
        public Nullable<int> CateID { get; set; }
        public int Status { get; set; }
        public System.DateTime CreateDate { get; set; }
        public int IsActive { get; set; }

        //public string GetStringCreateDate
        //{
        //    get
        //    {
        //        return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
        //    }
        //}
        //public string GetNameStatus
        //{
        //    get
        //    {
        //        return ItemStatus.Equals(SystemParam.ACTIVE_FALSE) ? "Ngừng hoạt động" : "Đang hoạt động";
        //    }
        //}
    }
}
