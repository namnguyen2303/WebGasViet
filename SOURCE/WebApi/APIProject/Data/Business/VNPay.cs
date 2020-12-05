using Data.DB;
using Data.Model;
using Data.Utils;
using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using static Data.Business.VNPAY_CS_ASPX;

namespace Data.Business
{
    public class VNPay : GenericBusiness
    {
        public VNPay(DEKKOEntities context = null) : base()
        {

        }
      
        public string GetUrl(int AppId)
        {
            //Get Config Info

            //Get payment input
            BuyPackageHistory order = cnn.BuyPackageHistories.Find(AppId);
            //Save order to db

            //Build URL for VNPAY
            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", "2.0.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", SystemParam.vnp_TmnCode);

            string locale = "vn";//"en"
            if (!string.IsNullOrEmpty(locale))
            {
                vnpay.AddRequestData("vnp_Locale", locale);
            }
            else
            {
                vnpay.AddRequestData("vnp_Locale", "vn");
            }

            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_TxnRef", order.ID.ToString());
            vnpay.AddRequestData("vnp_OrderInfo", order.ServicePackage.PackageName);
            vnpay.AddRequestData("vnp_OrderType", "insurance"); //default value: other
            vnpay.AddRequestData("vnp_Amount", (order.Price * 100).ToString());
            vnpay.AddRequestData("vnp_ReturnUrl", SystemParam.vnp_Return_url);
            vnpay.AddRequestData("vnp_IpAddr", GetIpAddress());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            //if (bank.SelectedItem != null && !string.IsNullOrEmpty(bank.SelectedItem.Value))
            //{
            //    vnpay.AddRequestData("vnp_BankCode", bank.SelectedItem.Value);
            //}

            string paymentUrl = vnpay.CreateRequestUrl(SystemParam.vnp_Url, SystemParam.vnp_HashSecret);
            return paymentUrl;
        }

        public static string GetIpAddress()
        {
            string ipAddress;
            try
            {
                ipAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (string.IsNullOrEmpty(ipAddress) || (ipAddress.ToLower() == "unknown"))
                    ipAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            catch (Exception ex)
            {
                ipAddress = "Invalid IP:" + ex.Message;
            }

            return ipAddress;
        }

        public VnpViewModel GetVnpReturn(VnpOutputModel vnp)
        {
            VnpViewModel vnpOutput = new VnpViewModel();
            try
            {
                BuyPackageHistory apb = cnn.BuyPackageHistories.Find(int.Parse(vnp.vnp_TxnRef));
                int money;
                try
                {
                    money = int.Parse(vnp.vnp_Amount) / 100;
                    if (money != apb.Price)
                    {
                        vnpOutput.getVnpModel(vnp.vnp_TxnRef, string.Format("{0:#,0}", money), apb.CreateDate.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_False);
                        return vnpOutput;
                    }
                }
                catch
                {
                    vnpOutput.getVnpModel(vnp.vnp_TxnRef, string.Format("{0:#,0}", apb.Price), apb.CreateDate.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_False);
                    return vnpOutput;
                }
                
                if (vnp.vnp_ResponseCode == SystemParam.vnp_CodeSucces)
                {
                    if (apb != null && apb.Status == 0)
                    {
                        apb.CodeVNPay = vnp.vnp_TransactionNo;
                        apb.KeyVNPay = vnp.vnp_SecureHash;
                        cnn.SaveChanges();
                        vnpOutput.getVnpModel(vnp.vnp_TxnRef, string.Format("{0:#,0}", apb.Price), apb.CreateDate.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_Succes);
                    }
                    else
                    {
                        vnpOutput.getVnpModel(vnp.vnp_TxnRef, string.Format("{0:#,0}", apb.Price), apb.CreateDate.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_False);
                    }
                }
                else
                {
                    if (apb != null)
                    {
                        apb.CodeVNPay = vnp.vnp_TransactionNo;
                        apb.KeyVNPay = vnp.vnp_SecureHash;
                        cnn.SaveChanges();
                    }
                    vnpOutput.getVnpModel(vnp.vnp_TxnRef, string.Format("{0:#,0}", apb.Price), apb.CreateDate.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_False);
                }
            }
            catch
            {
                vnpOutput.getVnpModel(vnp.vnp_TxnRef, "", DateTime.Now.ToString("HH:mm:ss dd/MM/yyyy"), SystemParam.Transaction_False);
            }
            return vnpOutput;


        }
        public VNPayOutputModel GetVnpIpn(VnpOutputModel vnp)
        {
            VNPayOutputModel output = new VNPayOutputModel();
            int appID = 0;
            try
            {
                try
                {
                    appID = int.Parse(vnp.vnp_TxnRef);
                }
                catch
                {
                    output = output.GetPayOutputModel("Order not found", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, SystemParam.vnp_Return_Rawurl, "01");
                    return output;
                }
                BuyPackageHistory apb = cnn.BuyPackageHistories.Find(int.Parse(vnp.vnp_TxnRef));
                if (apb != null)
                {
                    int money = 0;
                    try
                    {
                        money = int.Parse(vnp.vnp_Amount) / 100;
                        if (money != apb.Price)
                        {
                            output = output.GetPayOutputModel("Invalid amount", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, "", "04");
                            return output;
                        }
                    }
                    catch
                    {
                        output = output.GetPayOutputModel("Invalid amount", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, "", "04");
                        return output;
                    }
                    if (vnp.vnp_TmnCode.Equals(SystemParam.vnp_TmnCode) && vnp.vnp_SecureHash.Equals(apb.KeyVNPay))
                    {
                        if (vnp.vnp_ResponseCode == SystemParam.vnp_CodeSucces)
                        {
                            if (apb.Status == 0)
                            {
                                apb.Status = 1;
                                cnn.SaveChanges();
                                PointBusiness pBus = new PointBusiness();
                                int point = pBus.CreateAddPointByWarranty(appID, apb.CustomerID,vnp.vnp_TransactionNo);
                                NotifyBusiness noti = new NotifyBusiness();
                                string content = "Giao dịch thành công: \n + Mã đơn hàng qua VNPAY: " + vnp.vnp_TxnRef + "\n + Số tiền: " + string.Format("{0:#,0}", apb.Price) + " đ\n + Thời gian: " + DateTime.Now.ToString(SystemParam.CONVERT_DATETIME_HAVE_HOUR);
                                noti.CreateNotiWhenBuyPackage(apb.CustomerID, "Giao dịch đã được thực hiện", content);

                                output = output.GetPayOutputModel("Confirm Success", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, "", vnp.vnp_ResponseCode);
                            }
                            else
                            {
                                output = output.GetPayOutputModel("Order already confirmed", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, "", "02");
                            }
                        }
                        else
                        {
                            if (apb.Status == 0)
                            {
                                apb.Status = 2;
                                cnn.SaveChanges();
                                output = output.GetPayOutputModel("Confirm Success", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, SystemParam.vnp_Return_Rawurl, "00");
                            }
                            else
                            {
                                output = output.GetPayOutputModel("Order already confirmed", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, "", "02");
                            }
                        }

                    }
                    else
                    {
                        output = output.GetPayOutputModel("Invalid signature", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, SystemParam.vnp_Return_Rawurl, "97");

                    }
                }
                else
                    output = output.GetPayOutputModel("Order not found", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, SystemParam.vnp_Return_Rawurl, "01");
            }
            catch
            {
                output = output.GetPayOutputModel("Unknow error", vnp.vnp_TxnRef, vnp.vnp_TransactionNo, SystemParam.vnp_Return_Rawurl, "99");

            }
            return output;
        }


    }
}
