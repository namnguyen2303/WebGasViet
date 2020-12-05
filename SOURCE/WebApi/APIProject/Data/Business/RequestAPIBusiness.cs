using Data.DB;
using Data.Model.APIApp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
namespace Data.Business
{
    public class RequestAPIBusiness
    {
        public RequestAPIBusiness(DEKKOEntities context = null) : base()
        {
        }

        public string GetJson(string url)
        {
            HttpWebRequest WebReq = (HttpWebRequest)WebRequest.Create(string.Format(url));

            WebReq.Method = "GET";

            HttpWebResponse WebResp = (HttpWebResponse)WebReq.GetResponse();

            Console.WriteLine(WebResp.StatusCode);
            Console.WriteLine(WebResp.Server);

            string jsonString;
            using (Stream stream = WebResp.GetResponseStream())   //modified from your code since the using statement disposes the stream automatically when done
            {
                StreamReader reader = new StreamReader(stream, System.Text.Encoding.UTF8);
                jsonString = reader.ReadToEnd();
            }
            return jsonString;
        }
        public string Post(string url, string value)
        {
            var request = HttpWebRequest.Create(string.Format(url));
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
              return  e.ToString();
                return null;
            }
        }

    }
}
