using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Model.APIApp
{
    public class LoginAppInputModel
    {
        public string Value { get; set; }
        public string PassWord { get; set; }
        public int Type { get; set; }
        public string deviceID { get; set; }
    }

    public class ChangePass
    {
        public string newPass { get; set; }
        public string OldPass { get; set; }
    }
}