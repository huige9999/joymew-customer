/* 所有西瓜互动 相关接口请求方法 */

import request from '@/utils/request';

export function buyPeopleSize(params) {
  return request.post('/kpPay/chongzhi2', params);
}

export const name = 1;
