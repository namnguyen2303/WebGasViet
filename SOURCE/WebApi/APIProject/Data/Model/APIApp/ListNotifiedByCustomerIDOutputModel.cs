using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Model.APIApp
{
    public class NotifiedByCustomerIDOutputModel
    {
        public int NotifyID { set; get; }
        public string Content { set; get; }
        public int Viewed { set; get; }
        public int Type { get; set; }
        public DateTime? CreatedDate { set; get; }
        public string CreatedDateStr
        {
            set { }
            get
            {
                return CreatedDate.HasValue ? CreatedDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
        public string Title { get; set; }
        public string icon { get; set; }
        public string Uri { get; set; }
    }
}