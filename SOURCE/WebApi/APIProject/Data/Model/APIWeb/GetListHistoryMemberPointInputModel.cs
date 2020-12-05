using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class GetListHistoryMemberPointInputModel
    {
        public int HistoryID { set; get; }
        public string AddPointCode { get; set; }
        public int Point { set; get; }
        public string Comment { get; set; }
        public DateTime? CreateDate { set; get; }
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
