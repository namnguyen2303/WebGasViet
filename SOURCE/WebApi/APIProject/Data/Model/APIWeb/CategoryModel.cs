using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIWeb
{
    public class CategoryModel
    {
            public int CategoryID { get; set; }
            public int ParentID { get; set; }
            public string Name { get; set; }
    }
}
