using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class ListTelecom {
        public int typeTelecom { get; set; }
        public string UrlTelecom { get; set; }
        public List<GiftByTypeOutputModel> listGift { get; set; }
    }
}
