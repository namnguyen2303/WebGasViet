using Data.Business;
using Data.DB;
using Data.Model.APIWeb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class BaseController:Controller
    {
        protected DEKKOEntities Context;
        public LoginBusiness loginBusiness;
        public BatchBusiness batchBusiness;
        public CardBusiness cardBusiness;
        public RequestBusiness requestBusiness;
        public NewsBusiness newsBusiness;
        public CustomerBusiness cusBusiness;
        public RankBusiness rankBusiness;
        public ConfigBusiness configBusiness;
        public PointBusiness pointBusiness;
        public WarrantyBusiness warrantyBusiness;
        public StatisticBusiness statisticBus;
        public OrderBusiness orderBus;
        public UserBusiness userBusiness;
        public ItemBusiness itemBusiness;
        public ItemBusiness productsBusiness;
        public NotifyBusiness notifyBusiness;
        public ShopBusiness shopBusiness;
        public AgentBusiness agentBusiness;
        public VNPay vnpay;
        public BaseController() : base()
        {
            loginBusiness = new LoginBusiness(this.GetContext());
            batchBusiness = new BatchBusiness(this.GetContext());
            cardBusiness = new CardBusiness(this.GetContext());
            requestBusiness = new RequestBusiness(this.GetContext());
            newsBusiness = new NewsBusiness(this.GetContext());
            cusBusiness = new CustomerBusiness(this.GetContext());
            rankBusiness = new RankBusiness(this.GetContext());
            configBusiness = new ConfigBusiness(this.GetContext());
            pointBusiness = new PointBusiness(this.GetContext());
            warrantyBusiness = new WarrantyBusiness(this.GetContext());
            statisticBus = new StatisticBusiness(this.GetContext());
            orderBus = new OrderBusiness(this.GetContext());
            userBusiness = new UserBusiness(this.GetContext());
            itemBusiness = new ItemBusiness(this.GetContext());
            productsBusiness = new ItemBusiness(this.GetContext());
            notifyBusiness = new NotifyBusiness(this.GetContext());
            shopBusiness = new ShopBusiness(this.GetContext());
            agentBusiness = new AgentBusiness(this.GetContext());
            vnpay = new VNPay(this.GetContext());
        }


        /// <summary>
        /// Create new context if null
        /// </summary>
        public DEKKOEntities GetContext()
        {
            if (Context == null)
            {
                Context = new DEKKOEntities();
            }
            return Context;
        }
       
        public UserDetailOutputModel UserLogins
        {
            get
            {
                return Session[Data.Utils.Sessions.LOGIN] as UserDetailOutputModel; 
            }
        }



    }
}