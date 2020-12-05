using Data.Business;
using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class BaseAPIController:ApiController
    {
        protected DEKKOEntities Context;
        public LoginBusiness lgBus;
        public NewsBusiness newsBus;
        public NotifyBusiness notiBus;
        public GiftBusiness giftBus;
        public RequestBusiness rqBus;
        public CustomerBusiness cusBus;
        public PointBusiness pBus;
        public MessageBusiness mBus;
        public RequestAPIBusiness apiBus;
        public StatisticBusiness statisticBus;
        public ShopBusiness shopBus;
        public ItemBusiness itemBus;
        public OrderBusiness orderBus;
        public PackageBusiness packBus;
        public VNPay vnPay;


        public BaseAPIController() : base()
        {
            lgBus = new LoginBusiness(this.GetContext());
            newsBus = new NewsBusiness(this.GetContext());
            notiBus = new NotifyBusiness(this.GetContext());
            giftBus = new GiftBusiness(this.GetContext());
            rqBus = new RequestBusiness(this.GetContext());
            cusBus = new CustomerBusiness(this.GetContext());
            mBus = new MessageBusiness(this.GetContext());
            apiBus = new RequestAPIBusiness(this.GetContext());
            pBus = new PointBusiness(this.GetContext());
            statisticBus = new StatisticBusiness(this.GetContext());
            shopBus = new ShopBusiness(this.GetContext());
            itemBus = new ItemBusiness(this.GetContext());
            orderBus = new OrderBusiness(this.GetContext());
            packBus = new PackageBusiness(this.GetContext());
            vnPay = new VNPay(this.GetContext());
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
    }
}