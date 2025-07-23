import request from '@/utils/request';

/** 创建到店礼 */
export const createDaodian = (jsonData) => {
  return request.post('/hlt/saveDaodian', {
    ...jsonData,
  });
};

/** 获取到店里信息
 * @param {string} id 到店礼活动id
 */
export const showDaodianData = (id) => {
  return request.get(`/hlt/getActivity/${id}`);
};

/** 修改到店礼 */
export const modifyDaodian = (id, jsonData) => {
  return request.post('/hlt/editDd', {
    id,
    ...jsonData,
  });
};

/** 判断是否创建了到店礼 */
export const judgeIsCreateDaodian = (type) => {
  return request.post('/hlt/exitActivity', {
    type,
  });
};

/** 获取轮播图 */
export const getSwiper = () => {
  return request.post('/hlt/getImgs');
};

/** 获取领取到店礼数据
 * @param {string} username 用户名
 * @param {string} dateGe 开始日期 yyyy-MM-dd
 * @param {string} dateLe 结束日期 yyyy-MM-dd
 * @param {string} showCount 分页参数 -> 一页展示条数
 * @param {string} currentPage 分页参数 -> 当前页
 */
export const getDaodianData = (paramObj) => {
  return request.post('/hlt/getDdRecordList', {
    ...paramObj,
  });
};
