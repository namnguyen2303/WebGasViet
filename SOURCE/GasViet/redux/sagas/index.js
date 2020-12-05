import {
  watchGetUser,
  watchRequestLogin,
  watchRequestLoginFB,
  watchRequestLoginGG,
  watchGetListItem,
  watchGetHomeData,
  watchChangeAvatar,
  watchCreateOrder,
  watchGetProvince,
  watchGetNotify,
  watchGetHistoryPoint,
  watchGetListOrder,
} from "./NetworkSaga";

export default function* rootSaga() {
  yield watchGetUser;
  yield watchRequestLogin;
  yield watchGetListItem;
  yield watchGetHomeData;
  yield watchChangeAvatar;
  yield watchGetProvince,
  yield watchGetNotify,
  yield watchGetHistoryPoint,
  yield watchGetListOrder,
  yield watchRequestLoginFB;
  yield watchCreateOrder;
  yield watchRequestLoginGG;
}
