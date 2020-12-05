using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb {
    public class CreateAgentInputModel {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string PasswordConfirm { get; set; }
        public float Lati { get; set; }
        public float Long { get; set; }
        public string PlusCode { get; set; }
        public string PlusCode2 { get; set; }
    }
}
