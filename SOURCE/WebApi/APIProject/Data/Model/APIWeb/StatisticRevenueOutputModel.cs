using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb {
    public class StatisticRevenueOutputModel {
        public Customer customer { get; set; }
        public Order order { get; set; }
        public Item item { get; set; }
        public string AgentName { get; set; }
        public string CustomerName { get; set; }
        public long Revenue { get; set; }
    }
}
