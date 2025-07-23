import request from '@/utils/request';

// /**
//  * 获取收益明细
//  */
// export const getProfitList = ({}) => request.post('/info/goldDaoZhangLb', {

// });

export const getActivityList = ({ is_release, currentPage, showCount }) => {
  return request.post('/activity/getActivityList', {
    is_release, // "0:未发布 1:进行中 2：已结束  不填就是全部",
    is_delete: '0', // 1：删除   0不要删除",
    currentPage, //
    showCount, //
  });
};

export const saveBaseInfo = (params) => {
  return request.post('/activity/save', params);
};

export const editBaseInfo = (params) => {
  return request.post('/activity/edit', params);
};

export const getRank = ({ activity_id, currentPage, showCount }) => {
  return request.post('/activityData/getScoreList', {
    activity_id, // "活动ID",
    type: '1',
    kind: '1',
    currentPage, // : "",
    showCount, // : "",
    is_need_my_rank: '0', // '1代表手机端需要自己的排名  0代表电脑看不需要',
  });
};
export const getMoreRank = ({ is_award_data, activity_id, currentPage, showCount }) => {
  return request.post('/activityData/getAwardList', {
    is_award_data,
    activity_id, // "活动ID",
    type: '1',
    kind: '1',
    currentPage, // : "",
    showCount, // : "",
    // is_need_my_rank: '0', // '1代表手机端需要自己的排名  0代表电脑看不需要',
  });
};

// 回显基本信息
export const getBaseInfo = ({ id }) => {
  return request.post('/activity/getActivityInfo', {
    id,
  });
};

// 获取预览二维码
export const getActivityCode = ({ scene, type }) => {
  return request.post('/newHuoDongHm/getActivityCode', {
    page: 'pages/index/index',
    appid: 'wx341e552aeabccc55',
    scene,
    type,
  });
};

// 获取奖项列表
export const getAwardList = ({ activity_id }) => {
  return request.post('/activityAward/getAwardList', {
    activity_id, //
    is_delete: '0',
    type: '1',
  });
};

// 新增奖项
export const saveAward = ({ award_name, award_grade, award_type, award_size, cashing_method, address, activity_id }) => {
  return request.post('/activityAward/saveAward', {
    award_name, // '奖品名称',
    award_grade, // : '奖品等级',
    award_type, // : '1',
    award_size, // : '奖品数量',
    cashing_method, // '兑奖方式',
    address, // ': '兑奖地址',
    activity_id, // ': '13f8f969270f461f852cba454181fd79',
    type: '1',
  });
};

// 编辑奖项
export const editAward = ({ activity_id, award_id, award_name, award_grade, award_type, award_size, cashing_method, address }) => {
  return request.post('/activityAward/editAward', {
    activity_id, // '13f8f969270f461f852cba454181fd79',
    award_id, //
    award_name, // '奖品名称',
    award_grade, // : '奖品等级',
    award_type, // : '1',
    award_size, // : '奖品数量',
    cashing_method, // '兑奖方式',
    address, // ': '兑奖地址',

    // is_delete: '1',
  });
};
// 删除奖项
export const deleteAward = ({ activity_id, award_id }) => {
  return request.post('/activityAward/editAward', {
    activity_id, // '13f8f969270f461f852cba454181fd79',
    award_id, //
    is_delete: '1',
  });
};
