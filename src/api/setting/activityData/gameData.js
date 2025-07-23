import request from '@/utils/request';

// 获取签到人员列表
export function getSignInList(params) {
  return request.post('/zhongJiang/qianDaoLieBiao', params);
}
// 获取中奖人员列表
export function getPrizeList(params) {
  return request.post('/zhongJiang/liebiao', params);
}
// 获取删除签到用户数据
export function removeUserData(params) {
  return request.post('/zhongJiang/shanchuZj', params);
}
// 获取中奖用户
export function removeUserWinningRecordData(params) {
  return request.post('zhongJiang/update', params);
}
// 获取中奖记录自定义下拉奖项列表
export function getPrizeListSelectData(params) {
  return request.post('/ziDingYiGift/allGift', params);
}
// 导出报表数据
export function getExportReport(params) {
  return request.post('/api/todos/', params);
}
// 是否拉黑
export function movetoblack(params) {
  return request.post('/zhongJiang/addBlackList', params);
}
// 设置评分权限
export function movePlayerPermission(params) {
  return request.post('/player/setPlayerPermission', params);
}
