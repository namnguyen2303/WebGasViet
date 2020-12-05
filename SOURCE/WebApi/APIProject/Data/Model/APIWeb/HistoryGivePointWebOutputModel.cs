using Data.Model.APIApp;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class HistoryGivePointWebOutputModel
    {
        public int HistoryID { set; get; }
        public int CustomerID { get; set; }
        public string CustomerName { set; get; }
        public int Point { set; get; }
        public string Code { get; set; }
        public DateTime? CreateDate { set; get; }
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }

        public int Type { set; get; }
        public string Title { set; get; }
        public int Balance { set; get; }
        public string icon { set; get; }
    }
}
