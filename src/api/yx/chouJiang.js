import request from '@/utils/request';

/**
 * 创建抽奖营销活动
 * @param {title, activity_desc, data_json, limit_switch, type = '2'}
 * title: 优惠券名称
 * activity_desc：优惠券简介
 * data_json：优惠券使用时间,如生效时间effectTime，有效期valideteTime等，JSON类型，如 "{ 'effectTime'： '1', valideteTime: '365' }"
 * limit_switch：用户领取次数限制，-1代表无限
 * type：活动类型，1为元宵灯谜；2为抽奖
 * @returns
 */
export function createChouJiang({ title, activity_desc, data_json, limit_switch }) {
  return request.post('/activity/save', {
    title,
    activity_desc,
    data_json,
    limit_switch,
    type: '2',
  });
}

// 获取抽奖活动数据
export function getChouJiangData(id) {
  return request.post('/activity/getActivityInfo', {
    id,
  });
}

/**
 * 编辑抽奖活动数据
 * @param {id, title, activity_desc, data_json, limit_switch, is_delete, is_release, prize_json }
 * id：活动id
 * title: 优惠券名称
 * activity_desc：优惠券简介
 * data_json：优惠券使用时间,如生效时间effectTime，有效期valideteTime等，JSON类型，如 "{ 'effectTime'： '1', valideteTime: '365' }"
 * limit_switch：用户领取次数限制，-1代表无限
 * is_delete：是否删除，0为未删除；1为删除
 * is_release：是否发布，0为未发布；1为进行中；2为已结束
 * prize_json：奖项数据
 */
export function modifyChouJiangData(paramObj) {
  return request.post('/activity/edit', {
    ...paramObj,
    is_clear_redis: '1',
  });
}

// 获取中奖名单
export function getCouponUserList(paramObj) {
  return request.post('/weddingConpon/getMyCouponList', paramObj);
}

// 判断是否创建了幸运大转盘活动
export function judgeIsCreateChou() {
  return request.post('/activity/getLotteryHistory', {
    type: '2',
  });
}
