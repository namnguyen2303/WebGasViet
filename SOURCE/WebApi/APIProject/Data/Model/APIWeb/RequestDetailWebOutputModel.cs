using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class RequestDetailWebOutputModel
    {
        public int ID { set; get; }
        public string RequestCode { set; get; }
        public int? TypeGift { set; get; }
        public string GiftName { set; get; }
        public int Point { set; get; }
        public int CustomerID { set; get; }
        public string CustomerName { set; get; }
        public string CustomerPhone { set; get; }
        public string CustomerAddress { set; get; }
        public string Note { set; get; }
        public int? Status { set; get; }
        public DateTime? CreateDate { set; get; }
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
        public string UserActiveName { set; get; }

    }
}
