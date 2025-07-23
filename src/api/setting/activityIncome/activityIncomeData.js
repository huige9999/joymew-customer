import store from '@/store/index';
import request from '@/utils/request';

// 获取红包墙列表
export function getWallListData(params) {
  return request.post('/giftDetailsHm/hbqIncomeList', params);
}
// 获取猜宝箱列表
export function getBoxListData(params) {
  return request.post('/giftDetailsHm/kbxIncomeList', params);
}
// 扭一扭数据列表
export function getZyzListData(params) {
  return request.post('/giftDetailsHm/gameIncomeList', params);
}
// 获取弹幕数据列表
export function getChatListData(params) {
  return request.post('/giftDetailsHm/giftIncomeList', params);
}
// 获取礼物列表
export function getGiftListData(params) {
  return request.post('/giftDetailsHm/giftIncomeList', params);
}
// 获取霸屏数据列表
export function getAllScreenListData(params) {
  return request.post('/giftDetailsHm/giftIncomeList', params);
}
// 获取照片数据列表
export function getPhotoListData(params) {
  return request.post('/giftDetailsHm/giftIncomeList', params);
}
// 获取红包口袋数据列表
export function getRedPackageListData(params) {
  return request.post('/giftDetailsHm/gameIncomeList', params);
}
// 获取活动收入报表数据
export function getReportData(params) {
  return request.post('/reportFormsHm/liveReportForm', params);
}
// 获取全屏特效数据列表
export function getSuperDanmuListData(params) {
  return request.post('/giftDetailsHm/superIncomeList', params);
}
// 重新发送礼物
export function resendGift(params) {
  return request.post('/huoDongHm/sendMsgToWs', params);
}
// 重新发送全屏特效
export function resendSuperDanmu(params) {
  return request.post('/huoDongHm/sendSuperMsgToWs', params);
}
// 获取音乐礼物收益列表
export function getMusicIncomeListData() {
  return request.post('/giftDetailsHm/musicIncomeList', {
    splid: store.state.liveId,
    type: 'music',
  });
}

// 获取加分宝发送的列表
export function getScoreAddListData() {
  return request.post('/giftDetailsHm/scoreIncomeList', {
    splid: store.state.liveId,
    type: 'addScore',
  });
}
