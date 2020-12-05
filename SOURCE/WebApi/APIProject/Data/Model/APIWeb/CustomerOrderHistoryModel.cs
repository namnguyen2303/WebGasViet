using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb {
    public class CustomerOrderHistoryModel {
        public class Order1 {
            public int ID { get; set; }
            public string Code { get; set; }
            public int CustomerID { get; set; }
            public long Discount { get; set; }
            public long TotalPrice { get; set; }
            public int Status { get; set; }
            public System.DateTime CreateDate { get; set; }
            public int IsActive { get; set; }
            public string BuyerName { get; set; }
            public string BuyerPhone { get; set; }
            public string BuyerAddress { get; set; }
            public string Note { get; set; }
            public Nullable<int> PointAdd { get; set; }
            public Nullable<int> Agent_id { get; set; }
            public Nullable<System.DateTime> ConfirmDate { get; set; }
            public Nullable<System.DateTime> CompletionDate { get; set; }
            public Nullable<double> lon { get; set; }
            public Nullable<double> lat { get; set; }
            public string listCustomer { get; set; }
            public Nullable<int> LastPushAt { get; set; }
        }

        public List<Order1> Order { get; set; }
        public Customer Customer { get; set; }
        public Item Item { get; set; }
    }
}
