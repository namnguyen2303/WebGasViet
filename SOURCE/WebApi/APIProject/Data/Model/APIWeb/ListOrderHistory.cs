using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb {

    public class ListOrderHistory {
        public Order order { get; set; }
        public Customer customer { get; set; }
        public Item item { get; set; }
        public Customer agent { get; set; }
    }
}
