using Data.DB;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListHistoryOutputModel
    {
        public int ID { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public int Point { get; set; }
        public int Type { get; set; }
        public string AddPointCode { get; set; }
        public System.DateTime CraeteDate { get; set; }
        public int IsActive { get; set; }
        public string Comment { get; set; }
        public string Title { get; set; }
        public Nullable<int> Balance { get; set; }
        public string Agent { get; set; }
    }
}
