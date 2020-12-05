using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Model.APIApp
{
    public class GetGiftPointInputModel
    {
        public string Phone { get; set; }
        public int Point { get; set; }
        public string Comment { get; set; }
    }
}