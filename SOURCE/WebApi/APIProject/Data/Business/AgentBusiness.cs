using Data.DB;
using Data.Model.APIWeb;
using Data.Utils;
using OfficeOpenXml;
using PagedList;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;


namespace Data.Business {
    public class AgentBusiness : GenericBusiness {
        public AgentBusiness(DEKKOEntities context = null) : base() {

        }

        // Tìm Kiếm Đại Lý
        public IPagedList<Customer> Search(int Page, string Phone, string Name, string FromDate, string ToDate) {
            try {
                var list = cnn.Customers.Where(x => x.IsActive.Equals(SystemParam.ACTIVE) && x.Role.Equals(SystemParam.ROLL_ADMIN));

                if (Phone != null && Phone != "") {
                    list = list.Where(x => x.Phone.Contains(Phone));
                }
                if (Name != null && Name != "") {
                    list = list.Where(x => x.Name.Contains(Name));
                }
                if (FromDate != "" && FromDate != null) {
                    DateTime? fd = Util.ConvertDate(FromDate);
                    list = list.Where(x => x.CraeteDate >= fd);
                }

                if (ToDate != "" && ToDate != null) {
                    DateTime? td = Util.ConvertDate(ToDate);
                    td = td.Value.AddDays(1);
                    list = list.Where(x => x.CraeteDate <= td);
                }

                if (list != null && list.Count() > 0)
                    return list.OrderByDescending(x => x.ID).ToList().ToPagedList(Page, SystemParam.MAX_ROW_IN_LIST_WEB);
                else
                    return new List<Customer>().ToPagedList(1, 5);
            } catch (Exception ex) {
                ex.ToString();
                return new List<Customer>().ToPagedList(1, 5);
            }
        }

        public List<Customer> LoadAgent() {
            List<Customer> listAgent = new List<Customer>();
            var query = from c in cnn.Customers
                        where c.Role.Equals(SystemParam.ROLE_ADMIN) && c.IsActive.Equals(SystemParam.ACTIVE)
                        orderby c.Name ascending
                        select c;
            if(query != null && query.Count() > 0) {
                listAgent = query.ToList();
                return listAgent;
            } else {
                return new List<Customer>();
            }
        }

        public List<Customer> LoadCustomer() {
            List<Customer> listCustomer = new List<Customer>();
            var query = from c in cnn.Customers
                        where c.Role.Equals(0) && c.IsActive.Equals(SystemParam.ACTIVE)
                        orderby c.Name ascending
                        select c;
            if (query != null && query.Count() > 0) {
                listCustomer = query.ToList();
                return listCustomer;
            } else {
                return new List<Customer>();
            }
        }

        public Boolean CheckExistingAgent(string agentPhone, string agentEmail) {
            try {
                var agent = cnn.Customers.Where(u => u.Phone.Equals(agentPhone) && u.IsActive.Equals(SystemParam.ACTIVE) || u.Email.Equals(agentEmail) && u.IsActive.Equals(SystemParam.ACTIVE)).ToList();
                if (agent != null && agent.Count() > 0) {
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        }

        //public Boolean CheckExistingAgent(string agentCode)
        //{
        //    try
        //    {
        //        var agent = cnn.Agents.Where(u => u.Code.Equals(agentCode) && u.IsActive.Equals(SystemParam.ACTIVE)).ToList();
        //        if (agent != null && agent.Count() > 0)
        //        {
        //            return true;
        //        }
        //        return false;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

        public int CreateAgent(CreateAgentInputModel agent) {
            try {
                if (CheckExistingAgent(agent.Phone, agent.Email)) {
                    return SystemParam.EXISTING;
                }
                //var lastShopID = cnn.Shops.OrderByDescending(x => x.ID).FirstOrDefault().ID + 1;

                Shop shop = new Shop();
                shop.Name = agent.Name;
                shop.Lati = agent.Lati;
                shop.Long = agent.Long;
                shop.PlusCode = agent.PlusCode2;
                shop.Address = agent.PlusCode2;
                shop.ProvinceID = 1;
                shop.DistrictID = 1;
                shop.ContactName = agent.Name;
                shop.ContactPhone = agent.Phone;
                //shop.AgentID = chua biet dien cai gi vao day
                shop.CraeteDate = DateTime.Today;
                shop.IsActive = SystemParam.ACTIVE;
                cnn.Shops.Add(shop);
                cnn.SaveChanges();

                Customer data = new Customer();
                data.Phone = agent.Phone;
                data.Email = agent.Email;
                data.PassWord = Util.CreateMD5(agent.Password);
                data.Address = agent.PlusCode2;
                data.Name = agent.Name;
                data.Code = "";
                data.Token = "";
                data.AvatarUrl = "";
                data.DOB = DateTime.Now;
                data.ProvinceCode = 1;
                data.DistrictCode = 1;
                data.Sex = 0;
                data.PointRanking = 0;
                data.AvatarUrl = "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg";
                //data.Point = SystemParam.POINT_START;
                data.Point = cnn.Configsses.Where(x => x.NameConst.Contains("PointAddFirst")).FirstOrDefault().ValueConst;
                data.LastLoginDate = DateTime.Now;
                data.ExpireTocken = DateTime.Now.AddYears(1);
                data.DeviceID = "";
                data.ShopID = shop.ID;
                data.Status = SystemParam.ACTIVE;
                data.IsActive = SystemParam.ACTIVE_AGENT;
                data.Role = SystemParam.ROLE_ADMIN;
                data.CraeteDate = DateTime.Today;
                cnn.Customers.Add(data);
                cnn.SaveChanges();

                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public Agent ShowEdit(int ID) {
            try {
                Agent edit = cnn.Agents.Find(ID);
                return edit;
            } catch (Exception ex) {
                ex.ToString();
                return new Agent();
            }
        }

        public int SaveEdit(int ID, string Name, string Address) {
            try {
               
                Agent agEdit = cnn.Agents.Find(ID);
                agEdit.Name = Name;
                agEdit.Address = Address;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public int cancelActive(int ID) {
            try {
                Agent agentCancel = cnn.Agents.Find(ID);
                Customer cusAvtive = cnn.Customers.Find(agentCancel.CustomerActiveID);
                agentCancel.CustomerActiveID = null;
                agentCancel.ActiveDate = null;
                agentCancel.Phone = null;
                agentCancel.ModifiedDate = DateTime.Now;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public int DeleteAgent(int ID) {
            try {
                ShopBusiness shp = new ShopBusiness();
                Customer delAgent = cnn.Customers.Find(ID);
                delAgent.IsActive = SystemParam.NO_ACTIVE_DELETE;
                if(delAgent.ShopID != null)
                {
                    shp.DeleteShop(delAgent.ShopID.Value);
                }
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        public int ImportExcel(HttpPostedFileBase ExcelFile) {
            try {
                if (ExcelFile == null || ExcelFile.ContentLength == 0) {
                    //ModelState.AddModelError("", "Hãy chọn một file Excel");
                    return SystemParam.FILE_NOT_FOUND;
                } else if (ExcelFile.FileName.EndsWith("xls") || ExcelFile.FileName.EndsWith("xlsx")) {
                    string path = HttpContext.Current.Server.MapPath("~/Import/" + ExcelFile.FileName);
                    if (System.IO.File.Exists(path)) {
                        System.IO.File.Delete(path);
                    }
                    ExcelFile.SaveAs(path);
                    FileInfo file = new FileInfo(path);
                    ExcelPackage pack = new ExcelPackage(file);
                    ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                    int row = 3;
                    int col = 1;
                    if (sheet.Cells[row, col].Value == null) {
                        return SystemParam.FILE_EMPTY;
                    }
                    object data = 0;
                    while (data != null) {
                        data = sheet.Cells[row, col].Value;
                        if (data == null)
                            break;
                        string CheckCode = sheet.Cells[row, col].Value.ToString();
                        if (cnn.Agents.Where(a => a.Code.Equals(CheckCode)).Count() > 0) {
                            return SystemParam.FILE_DATA_DUPLICATE;
                        }
                        Agent item = new Agent();
                        item.Code = sheet.Cells[row, col].Value.ToString();
                        item.Name = sheet.Cells[row, col + 1].Value.ToString();
                        item.Address = "Ha Noi";
                        item.CreateDate = DateTime.Now;
                        item.IsActive = SystemParam.ACTIVE;
                        cnn.Agents.Add(item);
                        row++;
                        cnn.SaveChanges();
                    }
                    return SystemParam.FILE_IMPORT_SUCCESS;
                } else {
                    return SystemParam.FILE_FORMAT_ERROR;
                }

            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.FILE_FORMAT_ERROR;
            }
        }

        public int AddPoint(string ListChecked, int Point, string Description) {
            string[] listBox = ListChecked.Split(',');
            List<int> boxes = new List<int>();

            foreach (var number in listBox) {
                if(number != null && number != "") {
                    boxes.Add(Convert.ToInt32(number));
                }
            }

            try {
                foreach(var box in boxes) {
                    NotifyBusiness notify = new NotifyBusiness();
                    PackageBusiness package = new PackageBusiness();
                    PointBusiness pointBusiness = new PointBusiness();
                    Customer customer = cnn.Customers.Find(box);
                    customer.Point += Point;
                    cnn.SaveChanges();
                    string code = Util.CreateMD5(DateTime.Now.ToString()).Substring(0,6);
                    pointBusiness.CreateHistoryes(box, Point, SystemParam.HISPOINT_HE_THONG_CONG_DIEM,code, Description, null);
                     string contennotify = "Bạn vừa được cộng " + Point + " điểm từ hệ thống";
                    notify.CreateNoti(box, SystemParam.HISPOINT_HE_THONG_CONG_DIEM, 0, contennotify, contennotify, null);
                    //if(customer.DeviceID.Length > 0)
                    //{
                    //    NotifyDataModel notifyData = new NotifyDataModel();
                    //    notifyData.id = customer.ID;
                    //    notifyData.type = SystemParam.HISPOINT_HE_THONG_CONG_DIEM;
                    //    package.StartPushNoti(notifyData, customer.DeviceID, contennotify, SystemParam.ROLE_ADMIN);
                    //    string a = notify.PushNotify(customer.ID, contennotify, SystemParam.HISPOINT_HE_THONG_CONG_DIEM);
                    //}

                }
                return 1;
            } catch (Exception ex) {
                ex.ToString();
                return 0;
            }
        }

        public int ResetPassword(int ID) {
            try {
                var DefaultPassword = "123456";
                Customer customer = cnn.Customers.Find(ID);
                customer.PassWord = Util.CreateMD5(DefaultPassword);
                cnn.SaveChanges();
                return SystemParam.SUCCESS;
            } catch (Exception ex) {
                ex.ToString();
                return SystemParam.ERROR;
            }
        }

        public double getLat(String PlusCode) {
            int partition = 0;
            Regex reg = new Regex("/@([0-9]*.?[0-9]*),([0-9]*.?[0-9]*),");

            Match regResult = reg.Match(PlusCode);
            String regResultString = regResult.ToString();
            regResultString = regResultString.Substring(2, regResultString.Length - 2);

            for (int i = 0; i <= regResultString.Length - 2; i++) {
                if (regResultString[i] == ',') {
                    partition = i;
                }
            }

            String lat = regResultString.Substring(0, partition);
            String longg = regResultString.Substring(partition + 1, regResultString.Length - 1 - partition - 1);
            
            return double.Parse(lat, CultureInfo.InvariantCulture);
        }        

        public double getLong(String PlusCode) {
            int partition = 0;
            Regex reg = new Regex("/@([0-9]*.?[0-9]*),([0-9]*.?[0-9]*),");

            Match regResult = reg.Match(PlusCode);
            String regResultString = regResult.ToString();
            regResultString = regResultString.Substring(2, regResultString.Length - 2);

            for (int i = 0; i <= regResultString.Length - 2; i++) {
                if (regResultString[i] == ',') {
                    partition = i;
                }
            }

            String lat = regResultString.Substring(0, partition);
            String longg = regResultString.Substring(partition + 1, regResultString.Length - 1 - partition - 1);

            return double.Parse(longg, CultureInfo.InvariantCulture);
        }
    }
}
