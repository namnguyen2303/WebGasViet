using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class ListCustomerOutputModel
    {
        public int CustomerID { set; get; }
        public string CustomerName { set; get; }
        public string PhoneNumber { set; get; }
        public int? Role { get; set; }
        public int? Status { get; set; }
        public DateTime? DOB { set; get; }
        public string DOBStr
        {
            set { }
            get
            {
                return DOB.HasValue ? DOB.Value.ToString(SystemParam.CONVERT_DATETIME) : "";
            }
        }
        public string Email { set; get; }
        public string TypeLoginStr { set; get; }
        public int TypeLogin { set; get; }
        public int Point { set; get; }
        public DateTime? CreateDate { set; get; }
        public int ProvinceCode { get; set; }
        public int DistrictCode { get; set; }
        public string CreateDateStr
        {
            set { }
            get
            {
                return CreateDate.HasValue ? CreateDate.Value.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR) : "";
            }
        }
        public int Sex { set; get; }
        public string Address { set; get; }

    }
}
