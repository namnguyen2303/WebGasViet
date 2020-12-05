using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class ChangePointOutputModel
    {
        public int CurrentPoint { get; set; }
        public int RankingPoint { get; set; }
        public int Remain { get; set; }
        public int Point { get; set; }
    }
}
