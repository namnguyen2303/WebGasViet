using Data.Business;
using Data.DB;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model
{
    public class OneSignalModel
    {

    }
    public class OneSignalInputs
    {
        public string app_id { get; set; }
        public object data { get; set; }
        public object headings { get; set; }
        public object contents { get; set; }
        public string android_channel_id { get; set; }
        public string ios_sound
        {
            get
            {
                return android_channel_id == SystemParam.ANDROID_CHANNEL_ID_DEFAULTS ?  "" : SystemParam.IOS_SOUND;
            }
            set { }
        }
        public List<string> include_player_ids { get; set; }
        public string android_accent_color = "e8000c";
        public int ttl { get; set; }
    }
    public class TextInput
    {
        public string en { get; set; }

    }

    public class DataOnesignal
    {
        public int timeSend
        {
            get
            {
                Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                return unixTimestamp;
            }
            set { }
        }
        public int timeWait
        {
            get; set;
        }
        public int orderID { get; set; }
        public int type { get; set; }
        public string deviceID { get; set; }
    }


}
