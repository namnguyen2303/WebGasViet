using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class PackageModel : AddPointIntPutModel
    {
        public int Point { get; set; }
        public long Price { get; set; }
    }

}
