/* 游戏设置中所有相关接口请求方法 */
import request from '@/utils/request';

/** 编辑签到白名单开关 */
export function setWhiteListStatus(params) {
  return request.post('/sheZhi/updateDetail', params);
}

/** 上传白名单 */
export function uploadWhiteList(params) {
  return request.post('/neiDing/shangchuanLimitMd', params);
}

/** 撤销白名单 */
export function cancelUploadedWhiteList(splid) {
  return request.post('/neiDing/deleteSeat', {
    type: '2',
    splid,
  });
}

/** 获取上传的白名单数据 */
export function getWhiteList(splid) {
  return request.post('/neiDing/getLimitList', {
    splid,
  });
}

/**
 * 设置背景图顺序
 * @param {String} splid
 * @param {Array} backSortArr
 */
export function setBgImgSort(splid, backSortArr) {
  const backSortStr = JSON.stringify(backSortArr);
  return request.post('/sheZhi/updateDetail', {
    splid,
    back_sort_json: backSortStr,
  });
}

/** 保存自定义链接配置信息 */
export function setConfigUrlOptions({
  splid,
  data,
  expire,
}) {
  return request.post('/sheZhi/setSplInfo', {
    splid,
    data,
    expire,
  });
}

/** 获取自定义链接配置信息 */
export function getConfigUrlOptions({ splid }) {
  return request.post('/sheZhi/getSplInfo', {
    splid,
  });
}

// 账号密码登录
export function inputLogin({ phone, password }) {
  return request.post('/dengLuHm/gogogo', {
    phonenumber: phone,
    passwd: password,
  });
}
