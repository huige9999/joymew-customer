import request from '@/utils/request';

/**
 * 获取团队基本信息
 * @param {string} splid 活动ID
 * @returns {Promise<{
 * code:number,
 * data: {
 * team_additional_withdraw: number, // 阶段性奖励：可提现部分
 * team_additional_next_income: string, // 下一个阶段的奖励
 * team_gift_income: number, // 团队礼物收益
 * team_super_income: number, // 团队全屏特效收益
 * team_hbq: number, // 团员红包墙收益
 * balance_withdraw: number, // 团队可提现余额
 * team_hbq_income: number, // 团队红包墙收益
 * team_total_income: number, // 团队总收益
 * team_hby: number, // 团员红包雨收益
 * team_additional_income: number, // 阶段性奖励：全部的
 * has_tx_income: number, // 团队收益 已经提现的部分
 * team_hby_income: number, // 团队红包雨收益
 * team_kbx: number, // 团员开宝箱收益
 * team_super: number, // 团员全屏特效收益
 * team_gift: number, // 团员礼物收益
 * team_kbx_income: number, // 团队开宝箱收益
 * additional_has_tx_income: number, // 阶段性奖励: 已经提现的金额
 * team_name: string, // 团队名称
 * team_area: string, // 团队地区
 * },
 * msg: string
 * }>}
 */
export const reqGetTeamBaseInfo = () => {
  return request.post('/teamIncome/getTeamIncome', {});
};

/**
 * 获取团队收益
 * @params {string} splid 活动ID 必传
 * @params {string} start_date 开始日期 可选
 * @params {string} end_date 结束日期 可选
 * @returns {Promise<{
 *  code: number,
 *   data: {
 *   team_super: number, // 团员全屏特效收益
 *   team_super_income: number, // 团队全屏特效收益
 *   team_gift: number, // 团员礼物收益
 *   team_gift_income: number, // 团队礼物收益
 *   team_kbx: number, // 团员开宝箱收益
 *   team_kbx_income: number, // 团队开宝箱收益
 *   team_hby: number, // 团员红包雨收益
 *   team_hby_income: number, // 团队红包雨收益
 *   team_hbq: number, // 团员红包墙收益
 *   team_hbq_income: number, // 团队红包墙收益
 *   team_total_income: number, // 团队总收益
 * },
 * msg: string
 * }>}
 */
export const reqGetTeamIncome = ({ start_date, end_date }) => {
  const paramObj = {};
  if (start_date) {
    paramObj.start_date = start_date;
  }
  if (start_date) {
    paramObj.end_date = end_date;
  }
  return request.post('/teamIncome/getTeamIncomeinfo', paramObj);
};

/**
 * 团队收益明细列表
 * @params {string} currentPage 当前页码 必传
 * @params {string} showCount 显示条数 必传
 * @params {string} splid 活动ID 必传
 * @returns {Promise<{
 *  code: number,
 *   data: {
 *   totalResult: number, // 总条数
 *   totalPage: number, // 总页数
 *   list: Array<{
 *      emcee_name: string, // 主持人名称
 *      team_gift_income: number, // 团队礼物收益
 *      scenario: string, // 活动版本
 *      team_super_income: number, // 团队全屏特效收益
 *      team_kbx_income: number, // 团队开宝箱收益
 *      phonenumber: number, // 手机号
 *      team_hbq_income: number, // 团队红包墙收益
 *      theme: string, // 活动标题
 *      team_total_income: number, // 团队总收益
 *      scenario_val: string, // 活动类型
 *      using_date: string, // 使用日期
 *      team_hby_income: number, // 团队红包雨收益
 *   }>
 * },
 *  msg: string
 * }>}
 */
export const reqGetTeamIncomeDetailList = ({ currentPage, showCount }) => {
  return request.post('/teamIncome/getTeamIncomeSplList', {
    currentPage,
    showCount,
  });
};

/**
 * 团队数据列表
 * @params {string} currentPage 当前页码 必传
 * @params {string} showCount 显示条数 必传
 * @params {string} income_sort 收益排序 可选
 * @params {string} lastLoginTime 最近登录时间 可选
 * @params {string} userInfo 用户信息 可选
 * @params {string} zhuceTime 注册时间 可选
 * @params {string} splid 活动ID 必传
 * @returns {Promise<{
 *  code: number,
 *   data: {
 *   totalResult: number, // 总条数
 *   totalPage: number, // 总页数
 *   varList: Array<{
 *      emcee_name: string, // 主持人名称
 *      phonenumber: string, // 手机号
 *      teamIncome: {team_total_income: number} // 团队贡献收益
 *      splactual: number, // 完成场次
 *      total_income: number, // 总收益
 *      lastDateDesc: string, // 最近登录时间
 *      spltotal: string, // 申请场次
 *      avator: string, // 头像
 *      carnival_level: number, // 嘉年华分成
 *      super_level: number, // 全屏特效分成
 *      vip_level: string, // 礼物分成
 *   }>,
 *   jiHuoInfo: {
 *    size:number,
 *    titil_json:
 *        {
 *          jiHuoSize: number,// 激活数量
 *          notJiHuoSize: number, // 待激活数量
 *          totalSize: number, // 总数量
 *          JiHuoHb: number, // 激活红包
 *      }
 *   }
 *
 *
 * },
 *  msg: string
 * }>}
 */
export const reqGetTeamDataList = ({ currentPage, showCount, income_sort, lastLoginTime, userInfo, zhuceTime }) => {
  const paramObj = {
    currentPage,
    showCount,
  };
  if (income_sort) {
    paramObj.income_sort = income_sort;
  }
  if (lastLoginTime) {
    paramObj.lastLoginTime = lastLoginTime;
  }
  if (userInfo) {
    paramObj.userInfo = userInfo;
  }
  if (zhuceTime) {
    paramObj.zhuceTime = zhuceTime;
  }
  return request.post('/teamIncome/getTeamUserList', paramObj);
};

/**
 * 团队收益提现
 * @params {string} splid 活动ID 必传
 * @params {string} money 提现金额 必传
 * @returns {Promise<{
 *  code: number,
 *   data: {2
 *   code: string,
 *   userId: string,
 * },
 * msg: string
 * }>}
 */
export const reqWithdrawTeamIncome = ({ money }) => {
  return request.post('/teamMoney/teamIncomeTx', {
    money,
  });
};

/**
 * 团队额外奖励提现
 * @params {string} splid 活动ID 必传
 * @params {string} money 提现金额 必传
 * @returns {Promise<{
 *   code: number,
 *   data: {
 *   zfbWithdraw: {
 *     redorder_wxid: string,
 *     des: string,
 *     result_code: string,
 *   },
 *   code: string,
 *   userId: string,
 *  },
 * msg: string
 * }>}
 */
export const reqWithdrawExtraProfit = ({ money }) => {
  return request.post('/teamMoney/teamIncomeExtraTx', {
    money,
  });
};

/**
 * 团队提现记录
 * @params {string} currentPage 当前页码 必传
 * @params {string} showCount 显示条数 必传
 * @params {string} splid 活动ID 必传
 * @returns {Promise<{
 *  code: number,
 *   data: {
 *   totalResult: number, // 总条数
 *   totalPage: number, // 总页数
 *   list: Array<{
 *      create_time: string,
 *      diceid: string,
 *      result_code: string,
 *      end_finish_time: string,
 *      id: string,
 *      redsum: number,
 *      userId: string,
 *      paytype: string,
 *      finish_time: string,
 *      info: {
 *        code: string,
 *        context: string, // 提现类型
 *     },
 *   }>,
 * },
 *  msg: string
 * }>}
 */
export const reqGetWithdrawRecord = ({ currentPage, showCount }) => {
  return request.post('/teamMoney/teamIncomeTxList', {
    currentPage,
    showCount,
  });
};

/**
 * 队长主持人修改下级礼物比例分成
 */
export const alterJuniorProp = ({ ratio, targetUserId }) => {
  return request.post('/common/alterJuniorProp', {
    ratio,
    targetUserId,
  });
};

// 修改团队名称和地点
export const alterNameAndArea = ({ teamName, teamArea }) => {
  return request.post('/common/alterNameAndArea', {
    teamName,
    teamArea,
  });
};
