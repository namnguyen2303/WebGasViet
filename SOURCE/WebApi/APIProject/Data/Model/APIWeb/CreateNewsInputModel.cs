using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateNewsInputModel
    {
        public string Title { set; get; }
        public int CategoryNewsID { set; get; }
        public string Depcription { set; get; }
        public string Content { set; get; }
        public string UrlImage { set; get; }
    

    }
}
