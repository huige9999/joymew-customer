import request from '@/utils/request';

/**
 * 获取近期互动
 * @param {Number} showCount //
 * @param {Number} currentPage
 */
export const getRecentActivityInfo = ({ showCount, currentPage }) => request.post('/newHuoDongHm/latelyHuoDongList', {
  // type: '5',
  // showCount,
  // currentPage,
  type: '5',
  showCount,
  currentPage,
});

/**
 * 获取互动
 * @param {Number} showCount
 * @param {Number} currentPage
 * @param {Number} type
 *
 */
export const getActivityInfo = ({ showCount, currentPage, type, request_from_page = 'api/app/live', title_val = '' }) => request.post('/newHuoDongHm/liebiao', {
  // request_from_page,
  // type, // 2 进行中活动 1 已完成活动
  // scene_type: '', // 0 婚礼 1 企业
  // showCount: showCount.toString(),
  // currentPage: currentPage.toString(),
  request_from_page,
  type, // 2 进行中活动 1 已完成活动
  scenario: '', // 0 婚礼 1 企业
  showCount: showCount.toString(),
  currentPage: currentPage.toString(),
  title_val,
});

/**
 * 获取进行中互动
 * @param {Number} showCount
 * @param {Number} currentPage
 */
export const getProcessingActivityInfo = ({ showCount, currentPage }) => request.post('/newHuoDongHm/liebiao', {
  // type: '2', // 进行中活动
  // scene_type: '', // 0 婚礼 1 企业
  // showCount: showCount.toString(),
  // currentPage: currentPage.toString(),
  type: '2', // 2 进行中活动 1 已完成活动
  scenario: '', // 0 婚礼 1 企业
  showCount: showCount.toString(),
  currentPage: currentPage.toString(),
});

/**
 * 获取已完成互动
 * @param {Number} showCount //
 * @param {Number} currentPage
 */
export const getCompleteActivityInfo = ({ showCount, currentPage }) => request.post('/newHuoDongHm/liebiao', {
  type: '1', // 已完成活动
  showCount,
  currentPage,
});

// 创建活动
export const createActivity = (pObj) => request.post('/huoDongHm/add', pObj);

// 获取活动模板列表
export const getTemplateList = ({ showCount, currentPage }) => request.post('/newHuoDongHm/templateList', {
  showCount,
  currentPage,
});

// 创建活动模板
export const createTemplate = (pObj) => request.post('/huoDongHm/add', pObj);

// 获取下级活动列表
export const getLowerLevelActivityInfo = ({ showCount, currentPage, type, request_from_page = 'api/app/live' }) => request.post('/newHuoDongHm/lowerLevelSplList', {
  request_from_page,
  type, // 2 进行中活动 1 已完成活动 5 下级活动列表
  scenario: '',
  showCount: showCount.toString(),
  currentPage: currentPage.toString(),
});

// 检查关键字
export const checkKeyWord = (keyWord) => request.post('/newHuoDongHm/checkKeyWord', {
  key_word_val: keyWord,
});

// 申请活动的时候获取下拉框列表
// 检查关键字
export const getCouponSelectList = () => request.post('/emcoupon/getCouponSelectList', {});
