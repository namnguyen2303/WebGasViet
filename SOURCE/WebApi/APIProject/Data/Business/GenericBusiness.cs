using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class GenericBusiness
    {
        public DEKKOEntities context;
        public DEKKOEntities cnn;
        public GenericBusiness(DEKKOEntities context = null)
        {
            this.context = context == null ? new DEKKOEntities() : context;
            cnn = this.context;
            //this.context.Configuration.AutoDetectChangesEnabled = false;
            //this.context.Configuration.ValidateOnSaveEnabled = false;
            //this.context.Configuration.LazyLoadingEnabled = false;
        }
    }
}
