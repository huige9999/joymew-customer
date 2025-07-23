/* 绑定主持人中所有相关接口请求方法 */
import request from '@/utils/request';

/* 获取绑定司仪的二维码 和 BindId */
export function bindVxQrCode({ splid }) {
  return request.post('/bind/getBindUrl', {
    splid,
  });
}

/* 轮询的时候判断是否司仪扫码 */
export function isBindWx({ bindId }) {
  return request.post('/bind/getUserByBindId', {
    bindId,
  });
}

// 通过手机号查询司仪信息
export function getUserInfoByPhone({ phone }) {
  return request.get('/bind/getUserByPhone', {
    params: { phone },
  });
}

// 获取本场活动的绑定情况
export function getBindInfoByLiveId({ splid }) {
  return request.post('/bind/isBindWx', {
    splid,
  });
}

// 获取本场活动的二维码
export function getQrcodeByLiveId({ splid }) {
  return request.post('/bind/bindVxQrCode', {
    splid,
  });
}

// userId绑定liveId
export function bindUserToLiveId({ userId, liveId }) {
  return request.get('/bind/updateSplBind', {
    params: { userId, splid: liveId },
  });
}
