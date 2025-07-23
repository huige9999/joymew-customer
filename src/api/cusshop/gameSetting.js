/* 游戏设置中所有相关接口请求方法 */
import request from '@/utils/request';

/* 商城优惠券列表 */
export function getShopCouponList(params) {
  return request.post('/ziDingYiGift/miaoCouponList', params);
}
/* 商城优惠券列表 */
export function aa(params) {
  return request.post('/ziDingYiGift/miaoCouponList', params);
}
