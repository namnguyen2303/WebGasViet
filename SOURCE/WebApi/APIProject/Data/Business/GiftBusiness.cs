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
    public class GiftBusiness : GenericBusiness
    {
        public GiftBusiness(DEKKOEntities context = null) : base()
        {

        }
        public List<GiftByTypeOutputModel> GetListGift(int type, string SearchKey)
        {
            List<GiftByTypeOutputModel> query = new List<GiftByTypeOutputModel>();
            var listGift = from g in cnn.Gifts
                           where g.Type.Equals(type) && g.IsActive.Equals(SystemParam.ACTIVE) && g.Status.Equals(SystemParam.STATUS_RUNNING) && g.FromDate.Value <= DateTime.Now && g.ToDate >= DateTime.Now
                           orderby g.Name
                           select new GiftByTypeOutputModel
                           {
                               GiftID = g.ID,
                               Description = g.Description,
                               GiftName = g.Name,
                               Point = g.Point,
                               Price = g.Price,
                               Status = g.Status,
                               UrlImage = g.UrlImage
                           };
            if (listGift != null && listGift.Count() > 0)
            {
                query = listGift.ToList();
            }
            try
            {
                if (SearchKey.Length > 0)
                {
                    List<GiftByTypeOutputModel> list = new List<GiftByTypeOutputModel>();

                    string newSK = Util.Converts(SearchKey).ToLower();
                    foreach (var gift in query)
                    {
                        string Name = Util.Converts(gift.GiftName).ToLower();
                        if (Name.Contains(newSK))
                        {
                            list.Add(gift);
                        }
                    }
                    query = list;
                }
            }
            catch { }
            return query;
        }
        public List<ListTelecom> GetListCard()
        {
            List<ListTelecom> listtelecom = new List<ListTelecom>();
            for (int typetelecom = 1; typetelecom <= SystemParam.MAX_TELECOM; typetelecom++)
            {
                ListTelecom list = new ListTelecom();
                list.typeTelecom = typetelecom;
                switch (typetelecom) {
                    case SystemParam.TYPE_VIETTEL:
                        list.UrlTelecom = SystemParam.URL_VIETTEL;
                        break;
                    case SystemParam.TYPE_MOBIPHONE:
                        list.UrlTelecom = SystemParam.URL_MOBIPHONE;
                        break;
                    case SystemParam.TYPE_VINAPHONE:
                        list.UrlTelecom = SystemParam.URL_VINAPHONE;
                        break;
                    case SystemParam.TYPE_VIETNAMMOBILE:
                        list.UrlTelecom = SystemParam.URL_VIETNAMMOBILE;
                        break;
                }
                var listGift = from g in cnn.Gifts
                               where g.Type.Equals(SystemParam.TYPE_REQUEST_CARD) && g.IsActive.Equals(SystemParam.ACTIVE) && g.Status.Equals(SystemParam.STATUS_RUNNING) && g.FromDate.Value <= DateTime.Now && g.ToDate >= DateTime.Now && g.TelecomType.Value.Equals(typetelecom)
                               orderby g.Price
                               select new GiftByTypeOutputModel
                               {
                                   GiftID = g.ID,
                                   Description = g.Description,
                                   GiftName = g.Name,
                                   Point = g.Point,
                                   Price = g.Price,
                                   Status = g.Status,
                                   UrlImage = g.UrlImage
                               };
                if (listGift != null && listGift.Count() > 0) {
                    list.listGift = listGift.ToList();
                    listtelecom.Add(list);
                }
            }
            return listtelecom;
        }
        public GiftByTypeOutputModel GetGiftDetail(int GiftID)
        {
            GiftByTypeOutputModel query = new GiftByTypeOutputModel();

            var listGift = from g in cnn.Gifts
                           where g.ID.Equals(GiftID) && g.IsActive.Equals(SystemParam.ACTIVE) && g.Status.Equals(SystemParam.STATUS_RUNNING)
                           orderby g.Name
                           select new GiftByTypeOutputModel
                           {
                               GiftID = g.ID,
                               Description = g.Description,
                               GiftName = g.Name,
                               Point = g.Point,
                               Price = g.Price,
                               Status = g.Status,
                               UrlImage = g.UrlImage
                           };
            if (listGift != null && listGift.Count() > 0)
            {
                query = listGift.FirstOrDefault();
                return query;
            }
            else
                return null;
        }
    }
}
