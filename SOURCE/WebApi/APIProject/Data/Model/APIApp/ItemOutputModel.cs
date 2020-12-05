using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class ItemOutputModel
    {
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string MadeIn { get; set; }
        public string Warranty { get; set; }
        public long OldPrice { get; set; }
        public string ImageUrl { get; set; }
        public int CateID { get; set; }
        public long NewPrice { get; set; }
    }
}
