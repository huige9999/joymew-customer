// 合伙人系统相关的请求
import { servicePartner } from '@/utils/request';

export function login(user) {
  return servicePartner.post('/hhrSystem/hhrLogin', {
    phonenumber: user.phone,
    passwd: user.password,
  });
}

// 获取登录首页基本信息
export function getUserBaseInfo() {
  return servicePartner.post('/hhrSystem/getShouYeInfo');
}

// 获取首页登录日志
export function getLoginList() {
  return servicePartner.post('/hhrSystem/getLoginList', {
    type: 1,
    showCount: '10',
    currentPage: '1',
  });
}

// 获取首页收益排行
export function getIncomeRank() {
  return servicePartner.post('/hhrSystem/getHhrIncomeRank', {
    showCount: '10',
    currentPage: '1',
  });
}

// 获取首页跟进排行
export function getFollowRecordRank() {
  return servicePartner.post('/hhrSystem/getRecordRankList', {
    type: '5',
    showCount: '10',
    currentPage: '1',
  });
}

// 获取互动列表
export function getHdList(data) {
  return servicePartner.post('/hhrSystem/newSpoList', data);
}

// 结算详情列表
export function getSettleRecordList({ showCount, currentPage }) {
  return servicePartner.post('/hhr/getHhrIncomInfo', {
    showCount,
    currentPage,
  });
}

// 人员列表
export function getHhrInfo1() {
  return servicePartner.post('/hhr/getHhrInfo1');
}

// 获取一级团队人员
export function getHhrInfo2({ inviter_emid, showCount, currentPage }) {
  return servicePartner.post('/hhr/getHhrInfo2', {
    inviter_emid,
    showCount,
    currentPage,
  });
}
// 获取人员明细
export function getHhrDetail({ invitee_id, currentPage, showCount }) {
  return servicePartner.post('/yaoQing/seeLiveInfo', {
    invitee_id,
    currentPage,
    showCount,
  });
}

// 获取跟进列表
// 不传userId则默认通过token查询
export function getRecordList(data) {
  return servicePartner.post('/hhrSystem/listRecord', data);
}

// 上传跟进内容
export function uploadRecord(data) {
  return servicePartner.post('/hhrSystem/saveRecord', data);
}

// 获取互动详情的基本内容
export function getHdBaseInfo(splid) {
  return servicePartner.post('/sheZhi/findInfo', {
    splid,
  });
}
// 获取大屏背景
export function getScreenBg({ spl_userId, splid }) {
  return servicePartner.post('/beiJing/getPcBeiJingList', {
    spl_userId,
    splid,
  });
}

// 获取手机背景
export function getMobileBg({ spl_userId, splid }) {
  return servicePartner.post('/qiYeNe/liebiao', {
    spl_userId,
    splid,
  });
}

// 获取签到语
export function getCustomSign({ spl_userId, splid }) {
  return servicePartner.post('/qianDaoYu/list', {
    spl_userId,
    splid,
  });
}

// 礼物收益
export function getGiftIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/giftIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    income_type: 'gift',
    preName: 'gift',
    showCount: '500',
  });
}

// 弹幕收益
export function getDanmuIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/giftIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    income_type: 'Miao_Bq',
    preName: 'Miao_Bq%',
    showCount: '500',
  });
}

// 霸屏收益
export function getBapinIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/giftIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    income_type: 'Miao_Bp',
    preName: 'Miao_Bp',
    showCount: '500',
  });
}

// 照片收益
export function getPhotoIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/giftIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    income_type: 'Miao_Tp',
    preName: 'Miao_Tp',
    showCount: '500',
  });
}

// 全屏特效
export function getAllScreenIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/superIncomeList', {
    spl_userId,
    splid,
    type: 'Super_Bp',
  });
}

// 开宝箱
export function getKbxIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/kbxIncomeList', {
    data: {
      spl_userId,
      splid,
      showCount: '100',
      order_by: '1',
      earning_type: 'zjd',
      currentPage: '1',
    },
  });
}

// 扭一扭
export function getNynIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/gameIncomeList', {
    spl_userId,
    splid,
    sortTime: '1',
    sortGold: '1',
    showCount: '500',
    income_type: 'dzp',
    giftid: 'DZP',
    currentPage: '1',
  });
}

// 红包墙
export function getHbqIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/hbqIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    earning_type: 'hbq',
    order_by: '1',
    showCount: '100',
  });
}

// 红包口袋
export function getHbkdIncome({ spl_userId, splid }) {
  return servicePartner.post('/giftDetailsHm/gameIncomeList', {
    spl_userId,
    splid,
    currentPage: '1',
    giftid: 'HBKD',
    income_type: 'hbkd',
    showCount: '500',
    sortGold: '2',
    sortTime: '2',
  });
}

// 获取登录日志数据
export function getLoginRecordList({ showCount, currentPage }) {
  return servicePartner.get('/hhrSystem/getHhrLogList', {
    params: {
      showCount,
      currentPage,
      type: '1',
    },
  });
}

//  获取反馈列表
export function getSuggestionList({ showCount, currentPage }) {
  return servicePartner.get('/hhrFeedback/getFeedback', {
    params: {
      showCount,
      currentPage,
    },
  });
}

//  上传反馈
export function uploadFeedBack({ content }) {
  return servicePartner.post('/hhrFeedback/submitFeedback', {
    feedbackContent: content,
  });
}
