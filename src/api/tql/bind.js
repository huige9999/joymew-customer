/* 绑定主持人中所有相关接口请求方法 */
import request from '@/utils/request';

/* 获取绑定司仪的二维码 */
export function bindVxQrCode({ splid }) {
  return request.post('/bind/bindVxQrCode', {
    splid,
  });
}

/* 轮询的时候判断是否司仪扫码绑定了 */
export function isBindWx({ splid }) {
  return request.post('/bind/isBindWx', {
    splid,
  });
}

/* 取消绑定 */
export function cancelBindWx({ splid }) {
  return request.post('/bind/cancelBindWx', {
    splid,
  });
}
