using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateShopInputModel
    {
        public int ID { set; get; }
        public string Name { set; get; }
        public int ProvinceID { set; get; }
        public int DistrictID { set; get; }
        public string Address { set; get; }
        public string PlusCode { set; get; }
        public double Lati { set; get; }
        public double Long { set; get; }
        public string ContactName { set; get; }
        public string ContactPhone { set; get; }
        public List<string> ListUrl
        {
            get
            {
                try
                {
                    if (this.Url != null)
                    {
                        string[] arr = Url.Split(',');
                        List<string> URL = new List<string>();
                        for (int i = 0; i < arr.Length; i++)
                        {
                            URL.Add(arr[i]);
                        }
                        // danh sách url 
                        return URL;
                    }
                    else
                    {
                        return new List<string>();
                    }
                }
                catch
                {
                    return new List<string>();
                }

            }
        }
        public string Url { get; set; }
        // dương dan1 , dương dan 2 , dương dan 3 
    }
}
