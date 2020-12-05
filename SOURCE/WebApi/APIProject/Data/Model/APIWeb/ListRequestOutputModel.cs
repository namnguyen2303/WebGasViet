using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListRequestOutputModel
    {
        public int RequestID {set; get;}
        public int Type {set; get;}
        public int Point { get; set; }
        public int Price { get; set; }
        public int Status {set; get;}
        public DateTime? CreateDate {set; get;}
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
    }
}
