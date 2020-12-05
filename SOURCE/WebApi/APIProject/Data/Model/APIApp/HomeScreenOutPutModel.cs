using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class HomeScreenOutPutModel
    {
        public CustomerLogin customerDetail { get; set; }
        public List<NewsAppOutputModel> listNews { get; set; }
        public List<ItemOutputModel> listProduct { get; set; }
    }
    public class CustomerLogin {

        public string CustomerName { get; set; }
        public string Phone { get; set; }
        public int Point { get; set; }
        public int IsNeeđUpate { get; set; }
    }
}
