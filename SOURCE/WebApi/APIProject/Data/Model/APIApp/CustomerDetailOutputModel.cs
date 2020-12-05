using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Model.APIApp
{
    public class CustomerDetailOutputModel
    {
        public string Code { get; set; }
        public int TypeLogin { get; set; }
        public string Phone { set; get; }
        public string CustomerName { set; get; }
        public DateTime? DOB { set; get; }
        public string DOBStr { get; set; }
        public int Sex { set; get; }
        public string Email { set; get; }
        public string ProvinceName { set; get; }
        public string DistrictName { set; get; }
        public int ProvinceID { set; get; }
        public int DistrictID { set; get; }
        public string Address { set; get; }
        public int Point { get; set; }
        public string UrlAvatar { get; set; }
        public string AgentName { get; set; }
    }
}