using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Model.APIApp
{
    public class UserInforOutputModel : CustomerDetailOutputModel
    {
        public int UserID { get; set; }
        public int Role { get; set; }
        public int IsNeedUpdate { get; set; }
        public int IsAgent { get; set; }
        public string Token { get; set; }
        public int PointRanking { get; set; }

        public int isGeneralAgent
        {
            get
            {
                return UserID == SystemParam.CUSTOMER_DEFAULT ? 1 :0 ;
            }
            set { }
        }
        //public string RankName { get; set; }
        //public string Description { get; set; }
        //public string NoteNextLevel { get; set; }
        public int RankLevel { get; set; }

    }
}
