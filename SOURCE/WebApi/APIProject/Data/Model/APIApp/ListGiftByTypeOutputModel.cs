using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Model.APIApp
{
    public class GiftByTypeOutputModel
    {
        public int GiftID { set; get; }
        public string GiftName{ get; set; }
        public int Status { set; get; }
        public int Point { set; get; }
        public string Description { get; set; }
        public int Price { set; get; }
        public string UrlImage { set; get; }

    }
}