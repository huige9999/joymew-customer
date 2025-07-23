import request from '@/utils/request';

/**
 *
 * @param {*} showCount
 * @param {*} currentPage
 *
 */
export const getMyInviteList = ({ showCount, currentPage, userInfo, income_sort, zhuceTime, lastLoginTime }) => request.post('/yaoQing/myYaoQingList', {
  showCount,
  currentPage,
  userInfo,
  income_sort,
  zhuceTime,
  lastLoginTime,
});

/**
 *
 */
export const getMiniWPERCode = ({ page, token }) => request.post('/newHuoDongHm/getSmallCodeInviter1', {
  page,
  token,
});
