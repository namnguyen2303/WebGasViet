using Data.DB;
using Data.Model.APIWeb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Utils
{
    public class SystemParam
    {
        //DEKKOEntities cnns = new DEKKOEntities();
        public const string vnp_Url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        public const string vnp_Return_url = "http://winds.hopto.org:8221/VnPay/Index";
        public const string vnpay_api_url = "http://winds.hopto.org:8221/Service/vnp_ipn";
        public const string vnp_Return_Rawurl = "/api/Service/vnp_return";
        public const string vnpay_api_Rawurl = "/api/Service/vnp_ipn";
        public const string vnp_TmnCode = "FMCTALLS";
        public const string vnp_HashSecret = "GBYCJQQSMDDDJJXHIROLZKZJYJEOZSGY";

        public const string Transaction_Succes = "Giao dịch Thành công";
        public const string Transaction_False = "Giao dịch thất bại";

        public const string vnp_CodeSucces = "00";

        public const double LON_DEFAUL = 105.7930512;
        public const double LAT_DEFAUL = 20.9977337;
        public const string PASS_DEFAUL = "windsoft@123";
        public const string HOST_DEFAUL = "smtp.gmail.com";
        public const string EMAIL_CONFIG = "gasvietsp @gmail.com";
        public const string PASS_CONFIG = "tktjjucoxcosivsc";
        public const string PASS_EMAIL = "windsoft123456@";

        public const string APP_ID = "68dd1942-66ba-4300-81eb-e68fbe59181b";
        public const string Authorization = "Basic :ZGZlZmEwNmItNmUxMi00Y2NjLWJmOGUtMWFiMGQxYzU4NDY5";
        public const string URL_ONESIGNAL = "https://onesignal.com/api/v1/notifications";
        public const string URL_BASE_https = "Basic ://onesignal.com/api/v1/notifications";
        public const string ANDROID_CHANNEL_IDS = "564f6a18-015b-43c1-85b2-290abb9fec97";
        public const string ANDROID_CHANNEL_ID_DEFAULTS= "bc2f590c-5ab1-490a-a5fd-bddc2f74f9b2";
        public const string IOS_SOUND= "gasviet2.wav";

        //public const int TIME_DELAY = cnn.Configs.Where(u =>u.Key.Equals("")).Select(u =>u.Value).FirstOrDefault();
        public const int MIN_MONEY_SENNOTI = 1000;
        //public const int DISTANCE_DEFAULT = 5;
        public const int CUSTOMER_DEFAULT = 3;

       
        public const int CONFIG_TIME = 5;
        public const int ROLL_ADMIN = 1;
        public const int ROLL_CUSTOMER = 0;
        public const int POINT_START = 9;
        //public const int ROLL_ADMIN = 1;
        public const int TYPE_LOGIN_PHONE = 3;
        public const int TYPE_LOGIN_FACE = 1;
        public const int TYPE_LOGIN_GOOGLE = 2;

        public const int NO_NEED_UPDATE = 0;
        public const int NEED_UPDATE = 1;

        public const string CONVERT_DATETIME = "dd/MM/yyyy";
        public const string CONVERT_DATETIME_HAVE_HOUR = "HH:mm dd/MM/yyyy";
        public const int MAX_ROW_IN_LIST = 30;
        public const int ACTIVE = 1;
        public const int RETURN_TRUE = 1;
        public const int RETURN_FALSE = 0;
        public const int ACTIVE_FALSE = 0;
        public const int NO_ACTIVE = 2;
        public const int COUNT_NULL = 0;
        public const int DELETE_REQUEST_FAIL = 2;
        public const int CATEGORY_PRODUCT = 11;

        public const int TYPE_IMAGE = 1;
        public const int TYPE_VIDEO = 2;
        // thanh cong
        public const int SUCCESS_CODE = 200;
        // thanh cong
        public const int STATUS_CHANGED = 7749;
        // sai mk
        public const int ERROR_PASS_API = 403;
        // loi quy trinh
        public const int PROCESS_ERROR = 500;
        public const int FAIL = 501;
        public const int ERROR = 0;
        public const int SUCCESS = 1;
        // khong duoc phep
        public const int NOT_FOUND = 404;
        // khong thay du lieu
        public const int DATA_NOT_FOUND = 400;
        // khong duoc phep
        public const int UNAUTHORIZED = 401;

        public const int STATUS_RUNNING = 1;
        public const int STATUS_REQUEST_WAITING = 0;
        public const int STATUS_REQUEST_SUCCESS = 1;
        public const int STATUS_REQUEST_CANCEl = 2;
        public const int STATUS_REQUEST_DELETE = 3;
        // Type đổi quà
        public const int TYPE_POINT_SAVE = 1;
        public const int TYPE_RECEIVE_ORDER = 2;
        //public const int TYPE_POINT_RECEIVE = 3;
        //public const int TYPE_POINT_RECEIVE_GIFT =4;
        //public const int TYPE_ADD_POINT =5;
        //public const int TYPE_CARD =6;

        public const int SIZE_CODE = 8;
        public const int MIN_NUMBER = 100000;
        public const int MAX_NUMBER = 999999;


        // Status warranty 
        public const int W_STATUS_ACTIVE = 1;
        public const int W_STATUS_NO_ACTIVE = 2;
        public const int W_STATUS_ERROR = 3;

        // cách kiểu tích điểm
        public const int WARRANTY = 2;
        public const int PRODUCT = 1;

        //
        public const int MESS_BY_CUS = 1;
        public const int MESS_BY_ADMIN = 2;
        //
        public const int NEWS_TYPE_ADVERTISEMENT= 1;
        public const int NEWS_TYPE_EVENT= 2;
        public const int NEWS_TYPE_NEWS= 3;
        public const int NEWS_TYPE_PRODUCT= 4;
        public const int NEWS_TYPE_PROMOTION= 5;
        //
        public const string COMMENT_HISTORY_ADD_POINT  = "Tích điểm";
        // link check access Token
        public const string LINK_URL_FACEBOOK = "https://graph.facebook.com/me?fields=name,picture.height(960).width(960)&access_token=";
        public const string LINK_URL_GOOGLE_MAIL = "https://www.googleapis.com/plus/v1/people/me?access_token=";
        // Telecom
        public const int MAX_TELECOM = 4;
        public const string URL_VIETTEL = "https://upload.wikimedia.org/wikipedia/vi/thumb/e/e8/Logo_Viettel.svg/800px-Logo_Viettel.svg.png";
        public const string URL_MOBIPHONE = "https://upload.wikimedia.org/wikipedia/commons/d/de/Mobifone.png";
        public const string URL_VINAPHONE = "https://lozimom.com/wp-content/uploads/2017/04/vinaphone-logo.png";
        public const string URL_VIETNAMMOBILE = "https://upload.wikimedia.org/wikipedia/vi/thumb/a/a8/Vietnamobile_Logo.svg/1280px-Vietnamobile_Logo.svg.png";
        public const int TELECOM_TYPE_GIFT = 0;
        public const int TYPE_VIETTEL = 1;
        public const int TYPE_MOBIPHONE = 2;
        public const int TYPE_VINAPHONE = 3;
        public const int TYPE_VIETNAMMOBILE = 4;
        public const string TYPE_VIETTEL_STRING = "Viettel";
        public const string TYPE_MOBIPHONE_STRING = "Mobiphone";
        public const string TYPE_VINAPHONE_STRING = "Vinaphone";
        public const string TYPE_VIETNAMMOBILE_STRING = "VietnamMobile";
        public const string URL_FIRST = "https://graph.facebook.com/";
        public const string URL_LAST = "/picture?type=large&redirect=true&width=250&height=250";
        public const int STATUS_PRODUCT_ACTIVE = 1;
        public const int STATUS_PRODUCT_NO_ACTIVE = 2;
        public const string STATUS_PRODUCT_ACTIVE_STRING = "Đã sử dụng";
        public const string STATUS_PRODUCT_NO_ACTIVE_STRING = "Chưa sử dụng";

        public const int STATUS_REQUEST_PENDING = 0;
        public const int STATUS_REQUEST_ACCEPTED = 1;
        public const int STATUS_REQUEST_CANCEL = 2;
        public const string STATUS_REQUEST_PENDING_STRING = "Chờ xác nhận";
        public const string STATUS_REQUEST_ACCEPTED_STRING = "Đã xác nhận";
        public const string STATUS_REQUEST_CANCEL_STRING = "Hủy";

        public const int TYPE_REQUEST_GIFT = 1;
        public const int TYPE_REQUEST_VOUCHER = 2;
        public const int TYPE_REQUEST_CARD = 3;

        public const string TYPE_REQUEST_GIFT_STRING = "Quà tặng";
        public const string TYPE_REQUEST_VOUCHER_STRING = "Voucher";
        public const string TYPE_REQUEST_CARD_STRING = "Thẻ cào";

        public const int TYPE_GIFT_GIFT = 1;
        public const int TYPE_GIFT_VOUCHER = 2;
        public const int TYPE_GIFT_CARD = 3;

        public const int STATUS_GIFT_ACTIVE = 1;
        public const int STATUS_GIFT_PAUSE = 0;
        public const int STATUS_GIFT_CANCEL_AND_ADD =2;
        public const int STATUS_GIFT_CANCEL = 3;

        public const int NO_ACTIVE_DELETE = 0;
        public const int MAX_ROW_IN_LIST_WEB = 20;
        public const bool BOOLEAN_TRUE = true;
        public const bool BOOLEAN_FALSE = false;
        public const int DUPLICATE_NAME = 2;

        public const int QRCODE_TYPE_PRODUCT = 1;
        public const int QRCODE_TYPE_WARRANTY = 2;

        public const int STATUS_CARD_ACTIVE = 1;
        public const int STATUS_CARD_NO_ACTIVE = 2;
        public const int ERROR_DATE = 3;


        public const string REQUIRE_FIELD = "Vui lòng không để trống!";
        public const string INVALID_NUMBER = "Chỉ được phép nhập số!";
        public const string CONFIRM_FAIL = "Hệ thống đã hết thẻ vui lòng chọn sản phẩm khác";
        public const string LOGIN_FAIL = "Vui lòng nhập đúng số điện thoại";
        public const float KeyA = 11;
        public const float KeyB = 87;
        public const float KeyC = 48;
        public const string NEW_ORDER = "https://img.icons8.com/color/240/000000/google-alerts.png";
        public const string ORDER_FALSE = "https://img.icons8.com/color/240/000000/google-alerts.png";


        public const int TYPE_NOTI_NEW_ORDER = 0;
        public const int TYPE_NOTI_CONFIRM_ORDER = 1;
        public const int TYPE_NOTI_ORDER_CUSSCESS = 2;
        public const int TYPE_NOTI_ORDER_CANCEL = 3;
        public const int TYPE_NOTI_ORDER_ADMIN = 4;

        public const int HAVE_A_NEW_ORDER = 1;
        public const int AGENT_DEFAULT_TYPE = -1;
        public const int HAVE_A_NEW_NOTI = 2;
        public const int HAVE_A_NEW_NEWS = 3;

        public const int TYPE_ADS = 1;
        public const int TYPE_EVENT = 2;
        public const int TYPE_NEWS = 3;
        public const int TYPE_PRODUCT = 4;
        public const int TYPE_PROMOTION = 5;
        public const int TYPE_PRICE_QUOTE = 6;

        public const string TYPE_ADS_STRING = "Quảng cáo";
        public const string TYPE_EVENT_STRING = "Sự kiện";
        public const string TYPE_NEWS_STRING = "Tin tức";
        public const string TYPE_PRODUCT_STRING = "Sản phẩm";
        public const string TYPE_PROMOTION_STRING = "Khuyến mại";
        public const string TYPE_PRICE_QUOTE_STRING = "Báo giá";

        public const int PARENT_NEWS_PRODUCT = 11;

        public const int TYPE_SEND_CUSTOMER = 2;
        public const int TYPE_SEND_AGENCY = 1;
        public const int TYPE_SEND_ALL = 0;

        public const int STATUS_NEWS_ACTIVE = 1;
        public const int STATUS_NEWS_DRAFT = 0;
        public const int UPDATE_NEWS_DEFAULT = 1;
        public const int UPDATE_NEWS_POST = 0;
        public const int LENGTH_QR_HASH = 15;
        public const int EXISTING = 2;
        public const int CAN_NOT_DELETE = 2;
        public const int ROLE_USER_ORDER = 3;
        public const int ROLE_USER = 2;
        public const int ROLE_ADMIN = 1;
        public const int NOT_ADMIN = 3;
        public const int WRONG_PASSWORD = 2;
        public const int FAIL_LOGIN = 2;
        public const int TYPE_REQUEST_NOTIFY = 4;
        public const int TYPE_ORDER_NOTIFY = 7;

        public const string MAX_POINT_PER_DAY = "MaxPointPerDay";
        public const string MIN_POINT = "MinPoin";

        //Card
        public const string IMPORT_CARD_VIETTEL = "viettel";
        public const string IMPORT_CARD_MOBIPHONE = "mobi";
        public const string IMPORT_CARD_VINAPHONE = "vina";
        public const string IMPORT_CARD_VIETNAMOBILE = "vnmobile";
        public const int TELECOMTYPE_VIETTEL = 1;
        public const int TELECOMTYPE_MOBIPHONE = 2;
        public const int TELECOMTYPE_VINAPHONE = 3;
        public const int TELECOMTYPE_VIETNAMOBILE = 4;
        public const int ERROR_IMPORT_DUPLICATE = 0;
        //public const int NO_ACTIVE_CARD = 2;
        // status Order
        public const int ORDER_STATUS_WAITING = 0;
        public const int ORDER_STATUS_PROCESS = 1;
        public const int ORDER_STATUS_REFUSE = 2;
        // Status for all
        public const int STATUS_ACTIVE = 1;
        public const int STATUS_NO_ACTIVE = 0;

        // Not Found
        public const int PHONE_NOT_FOUND = -1;

        // ExcelFile Error
        public const int FILE_NOT_FOUND = -1;
        public const int FILE_DATA_DUPLICATE = 0;
        public const int FILE_IMPORT_SUCCESS = 1;
        public const int FILE_FORMAT_ERROR = -2;
        public const int FILE_EMPTY = -3;
        public const int IMPORT_ERROR = -4;
        public const int MIN_LENGTH_VALIDATE = -5;
        public const int DATA_ERROR = -6;

        // check Length Card
        public const int MAX_LENGTH_CODE = -7;
        public const int MAX_LENGTH_SERI = -8;
        public const int CODE_EQUALS_SERI = -9;

        // type MemberPointHistory
        public const int HISPOINT_TICH_DIEM = 1;
        public const int HISPOINT_TANG_DIEM = 2;
        public const int HISPOINT_DUOC_TANG_DIEM = 3;
        public const int HISPOINT_DOI_QUA = 4;
        public const int HISPOINT_HE_THONG_CONG_DIEM = 5;
        public const int HISPOINT_DOI_THE = 6;
        public const int HAVE_A_NEWS = 6;
        public const int CHANGE_MINUS_POINT_ITEM = 4;

        //
        public const int ACTIVE_AGENT = 1;

        public const int HISTORY_POINT_CANCEL_REQUEST = 7;
        public const string SEND_TIME = "null";
        public const string USER = "dekko";
        public const string PASS = "Vmg@123456";
        public const string ALIAS = "DEKKO GROUP";
        public const string LINK_MESS = "http://brandsms.vn:8018/VMGAPI.asmx/BulkSendSms?";
        public const string CONTENT_MESS = "Cam on quy khach da dang ky. Ma xac nhan cua quy khach la :";

        public const string EXPO_NOTI = "https://exp.host/--/api/v2/push/send";


        public const string SUCCES_STR = "Thành công";
    }
}
