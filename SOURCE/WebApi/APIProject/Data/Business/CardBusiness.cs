using Data.DB;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Model.APIWeb;
using System.Globalization;
using OfficeOpenXml;
using Microsoft.Office.Interop.Excel;
using System.Web;
using System.IO;

namespace Data.Business
{
    public class CardBusiness : GenericBusiness
    {
        public CardBusiness(DEKKOEntities context = null) : base()
        {

        }

        //tìm kiếm
        public List<CardDetailOutputModel> Search(int Page, string Seri, string FromDate, string ToDate, int? Status)
        {
            try
            {
                if (Status == 1)
                {
                    var query = from c in cnn.Cards
                                join cus in cnn.Customers on c.CustomerActiveID.Value equals cus.ID
                                where c.IsActive.Equals(SystemParam.ACTIVE)
                                orderby c.ID descending
                                select new CardDetailOutputModel
                                {
                                    CardID = c.ID,
                                    CardCode = c.Code,
                                    SeriNumber = c.Seri,
                                    CardTypeStr = c.CardType,
                                    TelecomTypeStr = c.TelecomType,
                                    Status = c.Status,
                                    CustomerActiveName = cus.Name,
                                    CreateDate = c.CreateDate
                                };

                    query = query.Where(c => c.SeriNumber.Contains(Seri));

                    if (FromDate != "" && FromDate != null)
                    {
                        DateTime? fd = Util.ConvertDate(FromDate);
                        query = query.Where(c => c.CreateDate.Value >= fd);
                    }

                    if (ToDate != null && ToDate != "")
                    {
                        DateTime? td = Util.ConvertDate(ToDate);
                        td = td.Value.AddDays(1);
                        query = query.Where(c => c.CreateDate.Value <= td);
                    }

                    if (Status != null)
                        query = query.Where(c => c.Status == Status);
                    if (query != null && query.Count() >= 0)
                    {
                        List<CardDetailOutputModel> List = query.OrderByDescending(c => c.CreateDate).ToList();
                        return List;
                    }
                    else
                    {
                        return new List<CardDetailOutputModel>();
                    }
                }
                else
                {
                    var query = from c in cnn.Cards
                                where c.IsActive.Equals(SystemParam.ACTIVE)
                                orderby c.ID descending
                                select new CardDetailOutputModel
                                {
                                    CardID = c.ID,
                                    CardCode = c.Code,
                                    SeriNumber = c.Seri,
                                    CardTypeStr = c.CardType,
                                    TelecomTypeStr = c.TelecomType,
                                    Status = c.Status,
                                    CustomerActiveName = c.Customer.Name,
                                    CreateDate = c.CreateDate
                                };
                    query = query.Where(c => c.SeriNumber.Contains(Seri));

                    if (FromDate != "" && FromDate != null)
                    {
                        DateTime? fd = Util.ConvertDate(FromDate);
                        query = query.Where(c => c.CreateDate.Value >= fd);
                    }

                    if (ToDate != null && ToDate != "")
                    {
                        DateTime? td = Util.ConvertDate(ToDate);
                        td = td.Value.AddDays(1);
                        query = query.Where(c => c.CreateDate.Value <= td);
                    }

                    if (Status != null)
                        query = query.Where(c => c.Status == Status);
                    if (query != null && query.Count() >= 0)
                    {
                        List<CardDetailOutputModel> List = query.OrderByDescending(c => c.CreateDate).ToList();
                        return List;
                    }
                    else
                    {
                        return new List<CardDetailOutputModel>();
                    }
                }
            }
            catch (Exception ex)
            {
                string a = ex.ToString();
                return new List<CardDetailOutputModel>();
            }
        }
        //check trung code,seri
        public Boolean checkDuplicateCodeOrSeriCard(string Code, string Seri)
        {
            try
            {
                var Card = cnn.Cards.Where(c => c.Seri.Equals(Seri) && c.IsActive.Equals(SystemParam.ACTIVE)).ToList();              
                if (Card != null && Card.Count() > 0)
                {
                    return SystemParam.BOOLEAN_TRUE;
                }
                var listCard = cnn.Cards.Where(c => c.IsActive.Equals(SystemParam.ACTIVE));
                foreach (var item in listCard)
                {
                    if (Util.EnCode(item.Code).Equals(Code))
                    {
                        return SystemParam.BOOLEAN_TRUE;
                    }
                }
                return SystemParam.BOOLEAN_FALSE;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return SystemParam.BOOLEAN_FALSE;
            }
        }


        // thêm Card
        public int addCard(CreateCardWebInputModel input, int userID)
        {
            try
            {
                if (input.ID != null)
                {
                    return SaveEdit(input.ID, input.CardCode, input.SeriNumber, input.CardType, input.TelecomType, input.StartDate, input.ExprireDate);
                }
                if (input.CardCode.Equals(input.SeriNumber))
                {
                    return SystemParam.CODE_EQUALS_SERI;
                }

                if (checkDuplicateCodeOrSeriCard(input.CardCode, input.SeriNumber))
                {
                    return SystemParam.DUPLICATE_NAME;
                }

                Card card = new Card();
                card.CreateUserID = userID;
                card.CustomerActiveID = null;
                card.Code = Util.Code(input.CardCode);
                card.Seri = input.SeriNumber;
                card.TelecomType = input.TelecomType;
                card.CardType = input.CardType;
                string t = input.StartDate;
                card.StartDate = DateTime.ParseExact(input.StartDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                card.ExpireDate = DateTime.ParseExact(input.ExprireDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                if(card.StartDate >= card.ExpireDate)
                {
                    return SystemParam.ERROR_DATE;
                }

                card.ActiveDate = null;
                card.Status = SystemParam.STATUS_CARD_NO_ACTIVE;
                card.CreateDate = DateTime.Today;
                card.IsActive = SystemParam.ACTIVE;
                cnn.Cards.Add(card);
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();

                return SystemParam.RETURN_FALSE;
            }
        }

        public CreateCardWebInputModel editCard(int CardID, int UserID)
        {
            try
            {
                Card card = cnn.Cards.Find(CardID);
                CreateCardWebInputModel Edit = new CreateCardWebInputModel();
                Edit.ID = card.ID;
                Edit.TelecomType = card.TelecomType;
                Edit.CardType = card.CardType;
                Edit.CardCode = Util.EnCode(card.Code);
                Edit.SeriNumber = card.Seri;
                Edit.StartDate = card.StartDate.ToString("dd/MM/yyyy");
                Edit.ExprireDate = card.ExpireDate.ToString("dd/MM/yyyy");
                Edit.CreateUserID = UserID;
                return Edit;
            }
            catch (Exception ex)
            {
                ex.ToString();
                CreateCardWebInputModel obj = new CreateCardWebInputModel();
                return obj;
            }
        }

        public int SaveEdit(int? id, string CodeEdit, string SeriEdit, int CardTypeEdit, int TelecomTypeEdit, string StartDateEdit, string ExpireDateEdit)
        {
            var edit = cnn.Cards.SingleOrDefault(p => p.ID == id);

            if (CodeEdit.Equals(SeriEdit))
            {
                return SystemParam.CODE_EQUALS_SERI;
            }

            if (Util.EnCode(edit.Code) != CodeEdit && checkDuplicateCodeOrSeriCard(CodeEdit, "") 
                || edit.Seri != SeriEdit && checkDuplicateCodeOrSeriCard("", SeriEdit))
            {
                return SystemParam.DUPLICATE_NAME;
            }
            edit.Code = Util.Code(CodeEdit);
            if(edit.Seri != SeriEdit)
                edit.Seri = SeriEdit;

            if(edit.CardType != CardTypeEdit)
                edit.CardType = CardTypeEdit;

            if(edit.TelecomType != TelecomTypeEdit)
                edit.TelecomType = TelecomTypeEdit;
            edit.StartDate = Util.ConvertDate(StartDateEdit).Value;
            edit.ExpireDate = Util.ConvertDate(ExpireDateEdit).Value;

            if (edit.StartDate >= edit.ExpireDate)
            {
                return SystemParam.ERROR_DATE;
            }
            cnn.SaveChanges();
            return SystemParam.RETURN_TRUE;
        }
        public int DeleteCard(int ID)
        {
            try
            {
                var edit = cnn.Cards.Find(ID);
                edit.IsActive = SystemParam.RETURN_FALSE;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE; ;
            }
        }
        //public string CountCard()
        //{
        //    var listCard = cnn.Cards.Where(u => u.IsActive.Equals(SystemParam.ACTIVE));
        //    int totalCard = listCard.Count();
        //    int card = listCard.Where(u => u.Status.Equals(2)).Count();
        //    return card + " / " + totalCard;
        //}

        // Save File Excel
        /*public int Import(HttpPostedFileBase ExcelFile, int UserImport)
        {
            string path = HttpContext.Current.Server.MapPath("~/Import/" + ExcelFile.FileName);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            ExcelFile.SaveAs(path);
            Application app = new Application();
            Workbook wb = app.Workbooks.Open(path);
            Worksheet ws = wb.ActiveSheet;
            Range range = ws.UsedRange;
            int lastUsedRow = ws.Cells.Find("*", System.Reflection.Missing.Value,
                       System.Reflection.Missing.Value, System.Reflection.Missing.Value,
                       XlSearchOrder.xlByRows, XlSearchDirection.xlPrevious,
                       false, System.Reflection.Missing.Value, System.Reflection.Missing.Value).Row;
            int row = 4;
            for ( row = 4; row <= lastUsedRow; row++)
            {
                if(checkDuplicateCodeOrSeriCard(Util.Code(((Range)range.Cells[row, 2]).Text), ((Range)range.Cells[row, 3]).Text))
                {
                    wb.Close(true);
                    app.Quit();
                    return SystemParam.ERROR_IMPORT_DUPLICATE;
                }
                Card c = new Card();
                c.Code = Util.Code(((Range)range.Cells[row, 2]).Text);
                c.Seri = ((Range)range.Cells[row, 3]).Text;
                try
                {
                    c.CardType = int.Parse(((Range)range.Cells[row, 4]).Text);
                }
                catch (Exception ex)
                {
                    ex.ToString();
                }

                if (((Range)range.Cells[row, 5]).Text.Equals(SystemParam.IMPORT_CARD_VIETTEL))
                {
                    c.TelecomType = SystemParam.TELECOMTYPE_VIETTEL;
                }
                else if (((Range)range.Cells[row, 5]).Text.Equals(SystemParam.IMPORT_CARD_MOBIPHONE))
                {
                    c.TelecomType = SystemParam.TELECOMTYPE_MOBIPHONE;
                }
                else if (((Range)range.Cells[row, 5]).Text.Equals(SystemParam.IMPORT_CARD_VINAPHONE))
                {
                    c.TelecomType = SystemParam.TELECOMTYPE_VINAPHONE;
                }
                else if (((Range)range.Cells[row, 5]).Text.Equals(SystemParam.IMPORT_CARD_VIETNAMOBILE))
                {
                    c.TelecomType = SystemParam.TELECOMTYPE_VIETNAMOBILE;
                }
                c.IsActive = SystemParam.ACTIVE;
                c.StartDate = DateTime.Now;
                c.Status = SystemParam.NO_ACTIVE;
                c.CreateUserID = UserImport;
                c.ExpireDate = DateTime.Now.AddYears(4);
                c.CreateDate = DateTime.Now;
                cnn.Cards.Add(c);
            }
            cnn.SaveChanges();
            wb.Close(true);
            app.Quit();
            return SystemParam.RETURN_TRUE;
        }*/

        public int ImportData(HttpPostedFileBase ExcelFile, int UserImport)
        {
            try
            {
                if (ExcelFile == null || ExcelFile.ContentLength == 0)
                {
                    return SystemParam.FILE_NOT_FOUND;
                }
                else if (ExcelFile.FileName.EndsWith("xls") || ExcelFile.FileName.EndsWith("xlsx"))
                {
                    string path = HttpContext.Current.Server.MapPath("~/Import/" + ExcelFile.FileName);
                    if (System.IO.File.Exists(path))
                    {
                        System.IO.File.Delete(path);
                    }
                    ExcelFile.SaveAs(path);
                    FileInfo file = new FileInfo(path);
                    ExcelPackage pack = new ExcelPackage(file);
                    ExcelWorksheet sheet = pack.Workbook.Worksheets[1];
                    int row = 4;
                    //int col = 1;
                    if(sheet.Cells[row,2].Value == null)
                    {
                        return SystemParam.FILE_EMPTY;
                    }
                    object data = 0;
                    long isNumber;
                    while (data != null)
                    {
                        data = sheet.Cells[row, 2].Value;
                        if (data == null)
                            break;
                        // kiểm tra nhập đầy đủ
                        if (sheet.Cells[row, 2].Value == null
                            || sheet.Cells[row, 3].Value == null
                            || sheet.Cells[row, 4].Value == null
                            || sheet.Cells[row, 5].Value == null)
                        {
                            return row + 20000;
                        }

                        string CheckCode = sheet.Cells[row, 2].Value.ToString();
                        string CheckSeri = sheet.Cells[row, 3].Value.ToString();

                        // check max độ dài
                        if (CheckCode.Length > 15)
                        {
                            return row + 25000;
                        }
                        if (CheckSeri.Length > 15)
                        {
                            return row + 25000;
                        }

                        // kiểm tra là số
                        if (!long.TryParse(CheckCode, out isNumber) || !long.TryParse(CheckSeri, out isNumber))
                        {
                            return row + 10000;
                        }

                        if(CheckCode.Length < 10 || CheckSeri.Length < 10)
                        {
                            return SystemParam.MIN_LENGTH_VALIDATE;
                        }

                        if(CheckCode.Equals(CheckSeri))
                        {
                            return row + 30000;
                        }
                        // check trùng
                        if (checkDuplicateCodeOrSeriCard(CheckCode, CheckSeri))
                        {
                            return row;
                        }
                        Card item = new Card();
                        item.Code = Util.Code(CheckCode);
                        item.Seri = sheet.Cells[row, 3].Value.ToString();

                        if (sheet.Cells[row, 4].Value.ToString() != "10000" 
                           && sheet.Cells[row, 4].Value.ToString() != "20000"
                           && sheet.Cells[row, 4].Value.ToString() != "50000"
                           && sheet.Cells[row, 4].Value.ToString() != "100000"
                           && sheet.Cells[row, 4].Value.ToString() != "200000"
                           && sheet.Cells[row, 4].Value.ToString() != "500000")
                        {
                            return row + 10000;
                        }

                        try
                        {
                            item.CardType = int.Parse(sheet.Cells[row, 4].Value.ToString());
                        }
                        catch (Exception ex)
                        {
                            ex.ToString();
                        }
                        if (sheet.Cells[row, 5].Value.ToString().Equals(SystemParam.IMPORT_CARD_VIETTEL))
                        {
                            item.TelecomType = SystemParam.TELECOMTYPE_VIETTEL;
                        }
                        else if (sheet.Cells[row, 5].Value.ToString().Equals(SystemParam.IMPORT_CARD_MOBIPHONE))
                        {
                            item.TelecomType = SystemParam.TELECOMTYPE_MOBIPHONE;
                        }
                        else if (sheet.Cells[row, 5].Value.ToString().Equals(SystemParam.IMPORT_CARD_VINAPHONE))
                        {
                            item.TelecomType = SystemParam.TELECOMTYPE_VINAPHONE;
                        }
                        else if (sheet.Cells[row, 5].Value.ToString().Equals(SystemParam.IMPORT_CARD_VIETNAMOBILE))
                        {
                            item.TelecomType = SystemParam.TELECOMTYPE_VIETNAMOBILE;
                        }
                        else
                        {
                            return row + 10000;
                        }
                        item.IsActive = SystemParam.ACTIVE;
                        item.StartDate = DateTime.Now;
                        item.Status = SystemParam.NO_ACTIVE;
                        item.CreateUserID = UserImport;
                        item.ExpireDate = DateTime.Now.AddYears(4);
                        item.CreateDate = DateTime.Now;
                        cnn.Cards.Add(item);
                        row++;
                        cnn.SaveChanges();
                    }
                    
                    return SystemParam.FILE_IMPORT_SUCCESS;
                }
                else
                {
                    return SystemParam.FILE_FORMAT_ERROR;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.IMPORT_ERROR;
            }
        }
    }
}
