using APIProject.App_Start;
using Data.DB;
using Data.Model.APIWeb;
using Data.Utils;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class AgentController : BaseController
    {
        // GET: Agent
        [UserAuthenticationFilter]
        public ActionResult Index()
        {
            return View();
        }
        //Get detail agent
        public PartialViewResult GetAgentDetail(int ID)
        {
            ViewBag.CusDetail = cusBusiness.cusDetail(ID);
            return PartialView("_AgentDetail");
        }

        [UserAuthenticationFilter]
        public PartialViewResult Search(int Page, string Phone, string Name, string FromDate, string ToDate)
        {
            ViewBag.Phone = Phone;
            ViewBag.Name = Name;
            ViewBag.FromDate = FromDate;
            ViewBag.ToDate = ToDate;
            UserDetailOutputModel userLogin = UserLogins;
            ViewBag.UserCreate = userLogin.UserName;
            return PartialView("_ListAgent", agentBusiness.Search(Page, Phone, Name, FromDate, ToDate));
        }
        [UserAuthenticationFilter]
        //Search auto complate agent
        public ActionResult SearchAgentName(string Name)
        {
            return Json(cusBusiness.SearchAgentName(Name), JsonRequestBehavior.AllowGet);
        }
        // Thêm Đại Lý
        [UserAuthenticationFilter]
        public int CreateAgent(CreateAgentInputModel agent)
        {
            return agentBusiness.CreateAgent(agent);
        }

        // show edit Agent
        //[UserAuthenticationFilter]
        //public ActionResult ShowEditForm(int ID)
        //{
            
        //}

        // Save Edit Agent
        [UserAuthenticationFilter]
        public int SaveEdit(int ID, string Name, string Phone, string Address,float Lati, float Long)
        {
            return agentBusiness.SaveEdit(ID, Name, Address);
        }

        //Save edit infor agent GasViett
        [ValidateInput(false)]
        [HttpPost]
        [UserAuthenticationFilter]
        public int SaveEditInforAgent (int ID, string Name, string Phone, string Address, string DOB, string Email, int Sex,float Lati,float Long)
        {
            try
            {
                return cusBusiness.SaveEditInforAgent(ID, Name, Phone, Address, DOB, Email, Sex,Lati,Long);
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }

        // Delete Agent
        [UserAuthenticationFilter]
        public int DeleteAgent(int ID)
        {
            return agentBusiness.DeleteAgent(ID);
        }

        // hủy kích hoạt đại lý
        [UserAuthenticationFilter]
        public int cancelActive(int ID)
        {
            try
            {
                return agentBusiness.cancelActive(ID);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        // Import Data
        [UserAuthenticationFilter]
        public int ImportData(HttpPostedFileBase ExcelFile)
        {
            return agentBusiness.ImportExcel(ExcelFile);
        }

        // mẫu import
        [UserAuthenticationFilter]
        public FileResult exportFormImport()
        {
            FileInfo file = new FileInfo(Server.MapPath(@"/Template/FormAgent.xlsx"));
            ExcelPackage pack = new ExcelPackage(file);
            ExcelWorksheet workSheet = pack.Workbook.Worksheets[1];
            return File(pack.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "FormAgent.xlsx");
        }

        public int AddPoint(string ListChecked, int Point, string Description) {
            return agentBusiness.AddPoint(ListChecked, Point,Description);
        }

        public int ResetPassword(int ID) {
            return agentBusiness.ResetPassword(ID);
        }
    }
}