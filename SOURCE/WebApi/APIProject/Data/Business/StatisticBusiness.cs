using Data.DB;
using Data.Model.APIWeb;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class StatisticBusiness : GenericBusiness
    {
        public StatisticBusiness(DEKKOEntities context = null) : base()
        {

        }

        public double Revenue(int? agentId, string FromDate, string Todate)
        {
            DateTime? fd = Util.ConvertDate(FromDate);
            DateTime? td = Util.ConvertDate(Todate);

            var query = cnn.Orders.Where(x => x.Status == 2 && x.IsActive == SystemParam.ACTIVE).ToList();
            if(agentId != null)
            {
                query = query.Where(x => x.Agent_id == agentId).ToList();
            }
            if (FromDate != null && FromDate != "")
            {   
                query = query.Where(x => x.CreateDate >= fd.Value).ToList();
            }
            if (Todate != null && Todate != "")
            {
                query = query.Where(x => x.CreateDate <= td.Value.AddDays(1)).ToList();
            }
            if (query != null)
            {
                return query.Sum(x => x.TotalPrice);
            }
            else
            {
                return 0;
            }


        }

        public int RevenuePoint(int? agentID , string FromDate, string Todate)
        {
            DateTime? fd = Util.ConvertDate(FromDate);
            DateTime? td = Util.ConvertDate(Todate);
            var query = cnn.Orders.Where(x => x.Status == 2 && x.IsActive == SystemParam.ACTIVE).ToList();
            //var sum = cnn.Orders.Where(x => x.Status == 2 && x.IsActive == SystemParam.ACTIVE).Select(x=>x.TotalPrice).Sum();
            if (agentID != null)
            {
                query = query.Where(x => x.Agent_id == agentID).ToList();
            }
            if (FromDate != null && FromDate != "")
            {
                query = query.Where(x => x.CreateDate >= fd.Value).ToList();
            }
            if (Todate != null && Todate != "")
            {
                query = query.Where(x => x.CreateDate <= td.Value.AddDays(1)).ToList();
            }
            if (query != null)
            {
                return query.Sum(x => x.PointAdd).Value;
            }
            else
            {
                return 0;
            }
        }

        public List<StatisticRevenueOutputModel> Search(int Page, int? AgentID, string FromDate, string ToDate)
        {
            try
            {
                List<StatisticRevenueOutputModel> list = new List<StatisticRevenueOutputModel>();
                var Customer = cnn.Customers;
                var query = from oi in cnn.OrderItems
                            where oi.Order.IsActive == SystemParam.ACTIVE && oi.Order.Status == 2
                            select new StatisticRevenueOutputModel
                            {
                                customer = oi.Order.Customer,
                                order = oi.Order,
                                item = oi.Item,
                                AgentName = Customer.Where(x => x.ID == oi.Order.Agent_id).FirstOrDefault().Name,
                                CustomerName = oi.Order.Customer.Name,
                                Revenue = oi.SumPrice
                            };
                if (AgentID != null)
                {
                    query = query.Where(x => x.order.Agent_id == AgentID);
                }
                if (FromDate != "" && FromDate != null)
                {
                    DateTime? fd = Util.ConvertDate(FromDate); ;
                    query = query.Where(x => x.order.CreateDate >= fd);
                }
                if (ToDate != "" && ToDate != null)
                {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    query = query.Where(x => x.order.CreateDate <= td);
                }
                if (query != null && query.Count() > 0)
                {
                    return query.OrderByDescending(x => x.order.CreateDate).ToList();
                }
                else
                {
                    return new List<StatisticRevenueOutputModel>();
                }

            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<StatisticRevenueOutputModel>();
            }
        }

        public List<Customer> getListAgent()
        {
            try
            {
                var query = from c in cnn.Customers
                            where c.IsActive.Equals(SystemParam.ACTIVE) && c.Role == 1
                            select c;
                return query.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<Customer>();
            }
        }
    }
}
