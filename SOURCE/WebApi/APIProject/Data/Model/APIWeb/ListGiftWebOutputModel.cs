using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListGiftWebOutputModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Point { get; set; }
        public int Price { get; set; }
        public string UrlImage { get; set; }
        public string Description { get; set; }
        public int Type { get; set; }
        public int Status { get; set; }
        public int CreateUserID { get; set; }
        public int? TelecomType { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
        public string FromDateStr
        {
            set { }
            get
            {
                return FromDate.HasValue ? FromDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
        public string ToDateStr
        {
            set { }
            get
            {
                return ToDate.HasValue ? ToDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }

    }
}
