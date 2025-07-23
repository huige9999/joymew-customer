/* 游戏设置中所有相关接口请求方法 */
import request from '@/utils/request';

/* 同庆楼优惠券列表 */
export function tqlCouponList(params) {
  return request.post('/ziDingYiGift/tqlCouponList', params);
}

/* 自定义奖项列表数据 */
export function getTQLAwardList({ splid, kind, currentPage, showCount }) {
  return request.post('/ziDingYiGift/giftListTql', {
    splid,
    removed: '0',
    kind,
    currentPage,
    showCount,
  });
}
/* 新增奖项 */
export function addTQLAward({ template_id, prize_name, splid, kind, rank }) {
  return request.post('/ziDingYiGift/addTql', {
    template_id,
    awardname: '',
    piclink: '',
    prize_name,
    splid,
    kind,
    rank,
  });
}
/* 修改奖项 */
export function editTQLAward({ splid, prize_name, cusaward_id, template_id, kind, rank }) {
  return request.post('/ziDingYiGift/updateTql', {
    awardname: '',
    piclink: '',
    prize_name,
    splid,
    cusaward_id,
    template_id,
    kind,
    rank,
  });
}

/* 删除奖项 */
export function deleteTQLAward({ cusaward_id, splid }) {
  return request.post('/ziDingYiGift/updateTql', {
    splid,
    cusaward_id,
    removed: '1',
  });
}

/* 新增奖项 */
export function addTQLAutoAward({ template_id, prize_name, splid, kind, rank_start, rank_end }) {
  return request.post('/ziDingYiGift/addTqlList', {
    template_id,
    awardname: '',
    piclink: '',
    prize_name,
    splid,
    kind,
    rank_start,
    rank_end,
  });
}
