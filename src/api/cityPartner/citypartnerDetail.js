import request from '@/utils/request';

// 人员列表
export const getHhrInfo1 = () => request.post('/hhr/getHhrInfo1');

export const getHhrInfo2 = ({ inviter_emid, showCount, currentPage }) => request.post('/hhr/getHhrInfo2', {
  inviter_emid,
  showCount,
  currentPage,
});

// 邀请收益
export const getHhrInfo3 = (parmas, showCount, currentPage) => request.post('/hhr/getHhrInfo3', {
  query_date: parmas,
  showCount,
  currentPage,
});

// 结算详情
export const getHhrIncomInfo = () => request.post('/hhr/getHhrIncomInfo');

// 收益明细
export const getIncomeDetail = (pObj) => request.post('/hhr/getHhrInfo3', pObj);
// 个人收益明细
export const getMyIncomeDetail = (pObj) => request.post('/hhr/getMySplidInfoList', pObj);

// 获取区域代理信息
export const getHhrInfoArea1 = () => request.post('/hhr/getHhrInfoArea1');

export const getHhrInfoArea2 = ({ showCount, currentPage }) => request.post('/hhr/getHhrInfoArea2', {
  showCount,
  currentPage,
});
