using Data.DB;
using Data.Model.APIApp;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class MessageBusiness : GenericBusiness
    {
        public MessageBusiness(DEKKOEntities context = null) : base()
        {
        }
        //public List<MessOutputModel> GetListMessage(int cusID)
        //{
        //    List<MessOutputModel> query = new List<MessOutputModel>();
        //    var ListMess = from m in cnn.Messages
        //                   where m.IsActive.Equals(SystemParam.ACTIVE) && m.CustomerID.Equals(cusID)
        //                   orderby m.CraeteDate descending
        //                   select new MessOutputModel
        //                   {
        //                       MessID = m.ID,
        //                       Content = m.Content,
        //                       Type = m.Type,
        //                       CreateDate = m.CraeteDate
        //                   };
        //    if (ListMess != null && ListMess.Count() > 0)
        //    {
        //        query = ListMess.ToList();
        //    }
        //    return query;
        //}
        //public bool CreateMess(CreateMessageAppInputModel item, int loginID)
        //{
        //    try
        //    {
        //        Message mess = new Message();
        //        if (item.Type == SystemParam.MESS_BY_CUS)
        //            item.CustomerID = loginID;
        //        else
        //            mess.UserID = loginID;
        //        //Tạo mới mess
        //        mess.CustomerID = item.CustomerID;
        //        mess.Content = item.Content;
        //        mess.CraeteDate = DateTime.Now;
        //        mess.Type = item.Type;
        //        mess.Viewed = 0;
        //        mess.IsActive = SystemParam.ACTIVE;
        //        cnn.Messages.Add(mess);
        //        cnn.SaveChanges();
        //        return true;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

    }
}
