using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class CreateCustomerAppInputModel
    {
        public string Phone { set; get; }
        public string customerName { set; get; }
        public string DOB { get; set; }
        public int Sex { set; get; }
        public string Email { set; get; }
        public int ProvinceID { set; get; }
        public int DistrictID { set; get; }
        public string Address { set; get; }
    }
}
