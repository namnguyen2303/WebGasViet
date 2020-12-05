using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateItemInputModel
    {
        public string Code { set; get; }
        public int ID { set; get; }
        public string Name { set; get; }
        public string Brand { get; set; }
        public string MadeIn { get; set; }
        public string Warranty { get; set; }
        public string Price { set; get; }
        public string AgentPrice { set; get; }
        public string DiscountPrice { set; get; }
        public string ImageUrl { set; get; }
        public string Description { set; get; }
        public string Pointstr { get; set; }
        public int? Point { get; set; }

        public int Status { set; get; }
        public int CategoryID { set; get; }
    }
}
