using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class CardOutputModel
    {
        public string name { get; set; }
        public int price { get; set; }
        public string seri { get; set; }
        public string code { get; set; }
    }
    public class CardOutput
    {
        public CardOutputModel cardDetail { get; set; }
        public ChangePointOutputModel changePoint { get; set; }

    }
}
