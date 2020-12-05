using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class GetListNewsWebInputModel
    {
        public string SearchKey { get; set; }
        public int CategoryNewsID { get; set; }
        public DateTime? DateTime { get; set; }
        public string DateTimeStr
        {
            set { }
            get
            {
                return DateTime.HasValue ? DateTime.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
        

    }
}
