using Data.DB;
using Data.Model;
using Data.Model.APIApp;
using Data.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Data.Business
{
    public class PackageBusiness : GenericBusiness
    {
        public PackageBusiness(DEKKOEntities context = null) : base()
        {
        }
        ShopBusiness shopBus = new ShopBusiness();
        public string StartPushNoti(object obj, string deviceID, string contents, int role)
        {
            OneSignalInputs input = new OneSignalInputs();
            int TimeWait = cnn.Configsses.Where(u => u.NameConst.Equals("TimeWaiting")).FirstOrDefault().ValueConst / 1000;
            TextInput header = new TextInput();
            header.en = "Bạn có thông báo mới";
            TextInput content = new TextInput();
            content.en = String.IsNullOrEmpty(contents) ? "Bạn có thông báo mới" : contents;
            input.app_id = SystemParam.APP_ID;
            input.data = obj;
            input.ttl = TimeWait;
            input.headings = header;
            input.contents = content;
            input.android_channel_id = role == SystemParam.ROLL_CUSTOMER ? SystemParam.ANDROID_CHANNEL_ID_DEFAULTS : SystemParam.ANDROID_CHANNEL_IDS;
            string a = deviceID;
            List<string> lsString = new List<string>();
            lsString.Add(a);
            input.include_player_ids = lsString;
            return JsonConvert.SerializeObject(input);
        }
        public string StartPushNotiNewS(object obj, string deviceID, string contents, int role)
        {
            OneSignalInputs input = new OneSignalInputs();
            int TimeWait = cnn.Configsses.Where(u => u.NameConst.Equals("TimeWaiting")).FirstOrDefault().ValueConst / 1000;
            TextInput header = new TextInput();
            header.en = "Bạn có thông báo mới";
            TextInput content = new TextInput();
            content.en = String.IsNullOrEmpty(contents) ? "Bạn có thông báo mới" : contents;
            input.app_id = SystemParam.APP_ID;
            input.data = obj;
            input.ttl = 10 ;
            input.headings = header;
            input.contents = content;
            input.android_channel_id = SystemParam.ANDROID_CHANNEL_ID_DEFAULTS;
            string a = deviceID;
            List<string> lsString = new List<string>();
            lsString.Add(a);
            input.include_player_ids = lsString;
            return JsonConvert.SerializeObject(input);
        }





        public string PushOneSignals(string value)
        {

            string url = SystemParam.URL_ONESIGNAL;

            var request = HttpWebRequest.Create(string.Format(url));

            request.Headers["Authorization"] = SystemParam.Authorization;
            request.Headers["https"] = SystemParam.URL_BASE_https;
            var byteData = Encoding.UTF8.GetBytes(value);
            request.ContentType = "application/json";
            request.Method = "POST";
            try
            {
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byteData, 0, byteData.Length);
                }
                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return responseString;
            }
            catch (WebException e)
            {
                return e.ToString();
            }
        }
    }
}
