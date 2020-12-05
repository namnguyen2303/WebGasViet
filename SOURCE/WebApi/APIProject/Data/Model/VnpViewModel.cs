using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model
{
    public class VnpViewModel
    {
        public void getVnpModel(string TxnRef, string money, string time, string type)
        {
            vnp_TxnRef = TxnRef;
            vnp_money = money;
            vnp_time = time;
            vnp_type = type;

        }
        public string vnp_TxnRef { get; set; }
        public string vnp_money { get; set; }
        public string vnp_time { get; set; }
        public string vnp_type { get; set; }
    }
}
