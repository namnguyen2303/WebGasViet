using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListHistoryMessageOutputModel
    {
        public int CustomerID { set; get; }
        public string CustomerName { set; get; }
        public string UrlAvatar{ set; get; }
        public string LastContent { set; get; }
        public string Timestr { set; get; }

}
}
