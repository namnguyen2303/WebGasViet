using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class ShopOutputModel
    {
        public int ShopID { get; set; }
        public string ShopName { get; set; }
        public string ProvinceName { get; set; }
        public string Address { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public double Distance { get; set; }
        public List<string> ListImage { get; set; }
    }
}
