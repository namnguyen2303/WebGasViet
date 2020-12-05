using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIProject.Controllers
{
    public class VnPayController : BaseController
    {
        // GET: VnPay
        public ActionResult Index(string vnp_Amount, string vnp_BankCode, string vnp_BankTranNo, string vnp_CardType, string vnp_OrderInfo, string vnp_PayDate, string vnp_ResponseCode, string vnp_TmnCode, string vnp_TransactionNo, string vnp_TxnRef, string vnp_SecureHashType, string vnp_SecureHash)
        {
            return View(vnp_return(vnp_Amount, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode,  vnp_TransactionNo,  vnp_TxnRef,  vnp_SecureHashType,  vnp_SecureHash));
        }
        public VnpViewModel vnp_return(string vnp_Amount, string vnp_BankCode, string vnp_BankTranNo, string vnp_CardType, string vnp_OrderInfo, string vnp_PayDate, string vnp_ResponseCode, string vnp_TmnCode, string vnp_TransactionNo, string vnp_TxnRef, string vnp_SecureHashType, string vnp_SecureHash)
        {
            VnpOutputModel vnp = new VnpOutputModel();
            vnp.vnp_Amount = vnp_Amount;
            vnp.vnp_BankCode = vnp_BankCode;
            vnp.vnp_BankTranNo = vnp_BankTranNo;
            vnp.vnp_CardType = vnp_CardType;
            vnp.vnp_OrderInfo = vnp_OrderInfo;
            vnp.vnp_PayDate = vnp_PayDate;
            vnp.vnp_ResponseCode = vnp_ResponseCode;
            vnp.vnp_TmnCode = vnp_TmnCode;
            vnp.vnp_TransactionNo = vnp_TransactionNo;
            vnp.vnp_TxnRef = vnp_TxnRef;
            vnp.vnp_SecureHashType = vnp_SecureHashType;
            vnp.vnp_SecureHash = vnp_SecureHash;
            VnpViewModel output = vnpay.GetVnpReturn(vnp);
            return output;
        }

    }
}