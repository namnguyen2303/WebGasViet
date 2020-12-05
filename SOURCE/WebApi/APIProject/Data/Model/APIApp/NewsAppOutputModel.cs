using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class NewsAppOutputModel
    {
        public int NewsID { get; set; }
        public string Content { get; set; }
        public DateTime CreateDate { get; set; }
        public string Title { get; set; }
        public int Type { get; set; }
        public string UrlImage { get; set; }
        public string Description { get; set; }
    }
}
