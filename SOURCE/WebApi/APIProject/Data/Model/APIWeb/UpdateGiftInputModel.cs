using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
   public class UpdateGiftInputModel
    {
        public int GiftID { get; set; }
        public string GiftName { get; set; }
        public int Point { get; set; }
        public int Price { get; set; }
        public string UrlIamge { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
    }
}
