using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.IO;
using Data.Business;

namespace APIProject.Job
{
    public class Jobclass : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {

            OrderBusiness orderBus = new OrderBusiness();
            orderBus.FindListOrderWaitting();
            orderBus.SenotiForAllCustomer();
            var reportDirectory = string.Format("~/text/{0}/", DateTime.Now.ToString("yyyy-MM-dd"));
            reportDirectory = System.Web.Hosting.HostingEnvironment.MapPath(reportDirectory);
            if (!Directory.Exists(reportDirectory))
            {
                Directory.CreateDirectory(reportDirectory);
            }
            var dailyReportFullPath = string.Format("{0}text_{1}.log", reportDirectory, DateTime.Now.Day);
            var logContent = string.Format("{0}-{1}-{2}", DateTime.Now, "Dripping drop", Environment.NewLine);
            if (logContent == null)
            {
                JobExecutionException jobex = new JobExecutionException("Write failure");

            }
            File.AppendAllText(dailyReportFullPath, logContent);
           
        }



    }
}