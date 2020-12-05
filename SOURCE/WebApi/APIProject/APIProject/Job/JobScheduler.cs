using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;


namespace APIProject.Job
{
    public class JobScheduler
    {
        public async void Start()
        {
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            IScheduler scheduler = await schedulerFactory.GetScheduler();
            await scheduler.Start();

            IJobDetail job = JobBuilder.Create<Jobclass>().Build();

            ITrigger trigger = TriggerBuilder.Create()

                .WithIdentity("HelloJob ", "GreetingGroup")

                .WithSimpleSchedule(s => s.WithIntervalInSeconds(10).RepeatForever())

                .StartAt(DateTime.UtcNow)

                .WithPriority(1)

                .Build();

            await scheduler.ScheduleJob(job, trigger);

        }

    }
}