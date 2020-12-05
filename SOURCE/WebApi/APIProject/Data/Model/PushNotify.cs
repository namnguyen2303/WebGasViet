using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model
{
    public class PushNotify
    {
        public string to { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        public string channelId { get; set; }
        public string sound
        {
            get
            {
                return "default";
            }
            set { }
        }
        public string priority
        {
            get
            {
                return "high";
            }
            set { }
        }
        public int badge { get; set; }
        public object data { get; set; }
    }
    public class DataOutput
    {
        public string TypeChat { get; set; }
    }
}
