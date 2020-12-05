using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model
{
    public class VNPayOutputModel
    {
        public string Message { get; set; }
        //public string OrderId { get; set; }
        //public string VNPAY_TranId { get; set; }
        //public string InputData { get; set; }
        public string RspCode { get; set; }
        public VNPayOutputModel GetPayOutputModel(string Message, string OrderId, string VNPAY_TranId, string InputData, string ResponseCode)
        {
            VNPayOutputModel vnp = new VNPayOutputModel();
            vnp.Message = Message;
            //vnp.OrderId = OrderId;
            //vnp.VNPAY_TranId = VNPAY_TranId;
            //vnp.InputData = InputData;
            vnp.RspCode = ResponseCode;
            return vnp;
        }

    }
}
