using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIProject.Models
{
    public class JsonResultModel
    {
        public int Status { get; set; }
        public int Code { get; set; }
        public object Result { get; set; }
        public string Message { get; set; }
    }
}