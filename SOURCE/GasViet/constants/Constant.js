const SCREEN_ROUTER = {
  MAIN_NAV: "MainNav",
  MAIN_TAB: "Main",
  AUTH: "Auth",
  LOGIN: "Login",
  AUTH_LOADING: "AuthLoading",
  REGISTER: "Register",
  WORKFLOW: "WorkflowScreen",
  WORKFLOW_DETAIL: "WorkflowDetail",
  DOCUMENT: "DocumentScreen",
  DOCUMENT_DETAIL: "DetailDocument",
  CHANGE_PASS: "ChangPassScreen",
  SEARCHDOCUMENT: "SearchDocument",
  PDF_SCREEN: "PDFScreen",
  SEARCHRESULT: "SearchResultDocument",
  WORKFLOW_REPORT: "WorkflowReport",
  SEARCH_SCREEN: "SearchScreen",
  PROMOTION_SCREEN: "Promotion",
  PRODUCT_DETAIL: "ProductDetail",
  ORDER_STEP1_SCREEN: "OrderStep1",
  ORDER_DETAIL_SCREEN: "OrderDetail",
  REGISTER: "Register",
  UPDATE: "UpdateUserScreen",
  ORDER_DETAIL: "OrderDetailScreen",
  HISTORY_POINT: "HistoryPointScreen",
  NOTIFY: "NotifyScreen",
  PAYMENT_INFO: "PaymentInfoScreen",
  ORDER_CUS_SCREEN: "Order",
  MAP_LOCATION_SCREEN: "MapLocation",
  FORGOT_PASS: "ForgotPass",
  VNPAY: "VNPAYScreen",
  LOGIN_AGENT: 'LoginAgent',
  AGENT_TAB: 'AgentTabNavigator',
  PROMOTION_DETAIL:"PromotionDetail"
  
};
const TYPE_TASK = {
  ASSIGNED_TASK: 0,
  PROCESSED_TASK: 1,
  CC_TASK: 2,
  AUTHORITIED_TASK: 3
};

const ORDER_TYPE = {
  pending: 0,
  processing: 1,
  completed: 2,
  cancel: 3
};

const USER_TYPE = {
  general_agent: -1,
  agent: 1,
  customer: 2
};

const NOTI_TYPE ={
  news: 6
};

const TYPE_DETAIL = {
  WORK_FLOW: 1,
  DOCUMENT: 0
};
const ERR_CODE = {
  USER_IS_NOT_AVAILABLE: "001",
  PASSWORD_WRONG: "002",
  SYSTEM_ERR: "009",
  REQUSET_METHOD_WRONG: "013",
  WORKFLOW_EXECUTE_FAIL: "002",
  WORK_ACTION_FOR_NOTE: "003"
};
const ORDER_BY = {
  LATEST_DEADLINE: 1,
  OLDEST_DEADLINE: 2,
  LATEST_CREATE_DATE: 3,
  OLDEST_CREATE_DATE: 4
};
const PRIORITY = {
  SORT_PRIORITY: 1,
  SORT_NOT_PRIORITY: 0
};
export {
  SCREEN_ROUTER,
  TYPE_TASK,
  ERR_CODE,
  TYPE_DETAIL,
  ORDER_BY,
  PRIORITY,
  ORDER_TYPE,
  USER_TYPE,
  NOTI_TYPE
};
