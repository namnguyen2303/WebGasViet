using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListStaticGiftModel
    {
        public string CusName { get; set; }
        public int Type { get; set; }
        public string GiftName { get; set; }
        public int Price { get; set; }
        public int Point { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
    }
}
