import request from '@/utils/request';

/* 请求大屏背景图 */
export function getScreenList(params) {
  return request.get('/beiJing/getPcBeiJingList', params);
}
/* 获取手机背景图列表 */
export function getMobileBgList(params) {
  return request.get('/qiYeNe/liebiao', params);
}
/* 根据liveid获取所有相关活动信息 */
export function getActivity(params) {
  return request.post('/sheZhi/findInfo', params);
}

export function editGzhBack(params) {
  return request.post('/beiJing/editGzhBack', params);
}

export function clearGzhImg(params) {
  return request.post('/gzh/clearImg', params);
}
