using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb {
    public class OrderOutputModel {
        public int ID { get; set; }
        public string Code { get; set; }
        public long TotalPrice { get; set; }
        public int Status { get; set; }
        public DateTime CreateDate { get; set; }
        public string CustomerName { get; set; }
        public string Phone { get; set; }
        public string ItemName { get; set; }
        public long Point { get; set; }
        public int? CustomerID { get; set; }
        public int CustomerRole { get; set; }
        public int OrderActive { get; set; }
        public int OrderID { get; set; }
        public string AgentName { get; set; }
        public int? AgentID { get; set; }
        public int OrderItemDiscount { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerName { get; set; }
        public string BuyerAddress { get; set; }
        public int QTY { get; set; }
    }
}
