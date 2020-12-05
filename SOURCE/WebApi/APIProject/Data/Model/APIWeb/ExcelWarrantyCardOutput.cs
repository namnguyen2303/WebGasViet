using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ExcelWarrantyCardOutput
    {
        public string WarrantyCardCode { set; get; }
        public int Status { set; get; }
        public DateTime? ActiveDate { set; get; }
        public DateTime? CreateDate { set; get; }
    }
}
