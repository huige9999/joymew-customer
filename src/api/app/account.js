import request from '@/utils/request';

/**
 * 获取收益明细
 */
export const getProfitList = ({ request_from_page = '/api/app/account', showCount, currentPage }) => request.post('/info/goldDaoZhangLb', {
  request_from_page,
  showCount,
  currentPage,
});

/**
 * 支付宝提现申请
 */
export const alipayApplyWithDraw = ({ request_from_page = '/api/app/account', user_name, ali_account, withdraw_fee }) => request.post('/tiXian/shengQingTx', {
  request_from_page,
  user_name,
  ali_account,
  withdraw_fee,
});

/**
 *  支付宝提现列表
 */
export const alipayWithDrawList = ({ request_from_page = '/api/app/account', showCount, currentPage }) => request.post('/tiXian/liebiao', {
  request_from_page,
  showCount,
  currentPage,
});

/**
 *  支付宝提现修改
 */
export const alipayEditWithDraw = ({ request_from_page = '/api/app/account', user_name, ali_account, id }) => request.post('/tiXian/update', {
  request_from_page,
  user_name,
  ali_account,
  id,
});

/**
 *  微信列表提现列表
 */
export const weChatWithDrawList = ({ request_from_page = '/api/app/account', showCount, currentPage }) => request.post('/info/newLiveList', {
  request_from_page,
  showCount,
  currentPage,
});
