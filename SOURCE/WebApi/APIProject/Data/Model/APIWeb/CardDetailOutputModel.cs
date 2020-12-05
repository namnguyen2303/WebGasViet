using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CardDetailOutputModel
    {
        public int CardID { get; set; }
        public string CardCode { get; set; }
        public string SeriNumber { get; set; }
        public int CardTypeStr { set; get; }
        public int TelecomTypeStr { set; get; }
        public int Status { set; get; }
        public string CustomerActiveName { set; get; }
        public DateTime? CreateDate { set; get; }
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
