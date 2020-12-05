using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateBatchInputModel
    {
        public int ID { set; get; }
        public string BatchCode { get; set; }
        public string BatchName { set; get; }
        public string Price { set; get; }
        public int QTY { get; set; }
        public string Point { get; set; }
        public string Note { set; get; }
        public int CreateUserID { set; get; }

    }
}
