using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class GetListBatchInputModel
    {
        public string SearchKey { get; set; }
        public DateTime? FromDate { set; get; }
        public string FromDateStr
        {
            set { }
            get
            {
                return FromDate.HasValue ? FromDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
        public DateTime? ToDate { set; get; }
        public string ToDateStr
        {
            set { }
            get
            {
                return ToDate.HasValue ? ToDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
    }
}
