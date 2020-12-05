using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ProductOfBatchModel
    {
        public int ProductID { get; set; }
        public int BatchID { get; set; }
        public string ProductCode { set; get; }
        public int Status { set; get; }
    }
}
