using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class OrderDetailOutputModel : OrderOutputModel
    {
        public long BasePrice { get { return listOrderItem.Select(u => u.ItemPrice).Sum(); } set { } }
        public double? lon { get; set; }
        public double? lat { get; set; }
        public string Uri { get; set; }
        public string DeviceID { get; set; }
        public List<OrderDetailModel> listOrderItem { get; set; }
    }
    public class OrderDetailModel
    {
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public string Brand { get; set; }
        public string MadeIn { get; set; }
        public string Warranty { get; set; }
        public long AgentPrice { get; set; }
        public long ItemPrice { get; set; }
        public int Qty { get; set; }
        public string Uri { get; set; }
    }
    public class OrderOutputModel
    {
        public int OrderID { get; set; }
        public string Code { get; set; }

        public long TotalPrice { get; set; }
        public long AgentPrice
        {
            get
            {
                return TotalPrice + Discount;
            }
            set { }
        }
        public int Status { get; set; }
        public int Qty { get; set; }

        public string Hour
        {
            get
            {
                return CreateDate.ToString("HH:mm");
            }
            set { }
        }
        public string Date
        {
            get
            {
                return CreateDate.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR);
            }
            set { }
        }
        public string CompletionHour
        {
            get
            {
                return CompleteDate.HasValue ? CompleteDate.Value.ToString("HH:mm") : "";
            }
            set { }
        }
        public string CompletionDateStr
        {
            get
            {
                return CompleteDate.HasValue ? CompleteDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
            set { }
        }
        public string ConfirmHour
        {
            get
            {
                return ConfirmDate.HasValue ? ConfirmDate.Value.ToString("HH:mm") : "";
            }
            set { }
        }
        public string ConfirmDateStr
        {
            get
            {
                return ConfirmDate.HasValue ? ConfirmDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
            set { }
        }
        public DateTime CreateDate { get; set; }
        public DateTime? ConfirmDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public string BuyerName { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerAddress { get; set; }
        public string ShopName { get; set; }
        public string ShopPhone { get; set; }
        public string ShopAddress { get; set; }
        public string Note { get; set; }
        public long Discount { get; set; }
        public double Distance { get; set; }
        public int CustomerID { get; set; }
        public int? AgentID { get; set; }

    }

    public class OrderOutput
    {
        public int page { get; set; }
        public int lastPage { get; set; }
        public object ListOrder { get; set; }
    }

}
