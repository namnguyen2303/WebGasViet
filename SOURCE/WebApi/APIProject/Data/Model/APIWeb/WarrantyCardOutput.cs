using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class WarrantyCardOutput
    {
        public int ID { set; get; }
        public int CustomerActiveID { set; get; }
        public string WarrantyCardCode { set; get; }
        public int Status { set; get; }
        public int Point { set; get; }
        public DateTime? ActiveDate { set; get; }
        public DateTime? CreateDate { set; get; }
        public int WarrantyID { set; get; }

        public string GetStringCreateDate
        {
            get
            {
                try
                {
                    return this.CreateDate.Value.ToString("dd/MM/yyyy");
                }
                catch
                {
                    return ""; 
                }
              
            }
        }

        public string GetStringActiveDate
        {
            get
            {
                try
                {
                    return this.ActiveDate.Value.ToString("dd/MM/yyyy");
                }
                catch
                {
                    return "";
                }

               
            }
        }
    }
}
