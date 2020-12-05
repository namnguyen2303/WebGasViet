using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CreateCardWebInputModel
    {
        public int? ID { get; set; }
        public string CardCode { get; set; }
        public string SeriNumber { get; set; }
        public int CardType { set; get; }
        public int TelecomType { set; get; }
        public int CreateUserID { get; set; }
        public string StartDate { get; set; }
        public string ExprireDate { get; set; }
    }
}
