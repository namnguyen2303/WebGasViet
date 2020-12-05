using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateWarrantyWebInputModel
    {
        public int CreateUserID { set; get; }
        public int Qty { get; set; }
        public int Point { get; set; }
        public string  ExpireDate { set; get; }
        public  DateTime GetExpireDate()
        {
            try
            {
                return Utils.Util.ConvertDate(this.ExpireDate).Value; 
            }
            catch
            {
                return DateTime.Now; 
            }
        }
    }
}
