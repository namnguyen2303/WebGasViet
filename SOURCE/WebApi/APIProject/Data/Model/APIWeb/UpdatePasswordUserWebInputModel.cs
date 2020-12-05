using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class UpdatePasswordUserWebInputModel
    {
        public string NewPassword { get; set; }
        public string OldPassword { get; set; }

    }
}
