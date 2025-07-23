/* 游戏设置中所有相关接口请求方法 */
import store from '@/store';
import request from '@/utils/request';

/* 红包雨获取初始化数据 */
/* 红包雨 红包明细 */
export function getHbyLotteryList(params) {
  return request.post('/redBaoController/hbyLotteryList', params);
}
/* 红包雨提现 */
/* 活动信息 --账户余额 */
export function getActivityMsg(params) {
  return request.post('/sheZhi/findInfo', {
    splid: params.id,
  });
}
/* 红包雨请求二维码图片 */
export function getHbyErweima(params) {
  return request.post('/redBaoController/chongzhi', params);
}
export function getHbyErweima2(params) {
  return request.post('/redBaoController/chongzhi2', params);
}
/* 摇一摇获取初始化数据 */
export function getSwingData(params) {
  return request.get('/youXiSheZhi/juTiMsg', params);
}
/* 设置摇一摇数据 */
export function setSwingData(params) {
  return request.post('/youXiSheZhi/yXSheZhi', params);
}
/* 设置划一划数据 */
export function setCountMoney(params) {
  return request.post('/youXiSheZhi/yXSheZhi', params);
}
/* 划一划获取初始化数据 */
export function getCountMoneyData(params) {
  return request.get('/youXiSheZhi/juTiMsg', params);
}
/* 获取摇一摇,划一划用户分数明细 */
export function getSwingInfoList(params) {
  return request.post('/youXiSheZhi/fenShuList', params);
}
/* 自定义奖项列表数据 */
export function getCustomAwardList(params) {
  return request.post('/ziDingYiGift/giftList', params);
}
/* 新增奖项 */
export function addCustomAward(params) {
  return request.post('/ziDingYiGift/add', params);
}
/* 修改或删除奖项 */
export function editOrDeleteCustomAward(params) {
  return request.post('/ziDingYiGift/update', params);
}
/**
 * 调整奖项顺序
 * @param {string[]} newlist 调整好顺序的奖项id数组
 */
export function reqOrderAward(newlist) {
  // eslint-disable-next-line no-async-promise-executor
  // return new Promise(async (resolve, reject) => {
  //   const oldListLen = oldList.length;
  //   const newListLen = newList.length;
  //   try {
  //     for (let i = 0; i < oldListLen; i++) {
  //       const params = {
  //         splid: store.state.liveId,
  //         cusaward_id: oldList[i].cusaward_id,
  //         removed: '1',
  //       };
  //       // eslint-disable-next-line no-await-in-loop
  //       await editOrDeleteCustomAward(params);
  //     }
  //     for (let i = 0; i < newListLen; i++) {
  //       const params = {
  //         awardname: newList[i].awardname,
  //         piclink: newList[i].piclink,
  //         prize_name: newList[i].prize_name ? newList[i].prize_name : '',
  //         splid: store.state.liveId,
  //         kind: '1',
  //       };
  //       // eslint-disable-next-line no-await-in-loop
  //       await addCustomAward(params);
  //     }
  //     resolve();
  //   } catch (err) {
  //     reject(err);
  //   }
  // });
  return request.post('/ziDingYiGift/order', {
    splid: store.state.liveId,
    cusawardIds: newlist,
  });
}

/* 签到用户(活动数据中) */
export function getSignUser(params) {
  return request.post('/zhongJiang/qianDaoLieBiao', params);
}
/* 名单 签到抽奖列表 */
export function neidingLotteryList(params) {
  return request.post('/neiDing/liebiao', params);
}
/* 内定中奖设置 添加 */
export function lotteryListSetting(params) {
  return request.post('/neiDing/add', params);
}
/* 内定中奖删除和修改 */
export function lotteryDelateOrEdit(params) {
  return request.post('/neiDing/update', params);
}
/** 开关内定抽奖测试
 * @param {boolean} isSwitchOn 开关状态
 */
export const reqSwitchArrangedLotteryTest = (isSwitchOn) => {
  return request.post('/sheZhi/switchArrangedLotteryTest', {
    splid: store.state.liveId,
    isSwitchOnArrangedLotteryTest: isSwitchOn ? '1' : '0',
  });
};
/* 猜明星列表 */
export function guessStarList(params) {
  return request.post('/caiStar/list', params);
}
/* 猜明星增加 */
export function guessStarAdd(params) {
  return request.post('/caiStar/save', params);
}
/* 猜明星编辑 */
export function guessStarEdit(params) {
  return request.post('/caiStar/update', params);
}
/* 猜明星删除 */
export function guessStarDelete(params) {
  return request.post('/caiStar/delete', params);
}
/* 红包雨平均红包设置 */
export function averageHb(params) {
  return request.post('/redBaoController/pingJunKey', params);
}
/* 红包雨难度设置 */
export function hardHb(params) {
  return request.post('/redBaoController/robTimeKey', params);
}
// 红包雨扣点比例设置
export function updateHbRate(params) {
  return request.post('/sheZhi/updateHbyKdRate', params);
}

// 获取赛龙舟队伍列表
export function getDragonBoatTeamList(params) {
  return request.post('/dragon/list', params);
}

// 保存赛龙舟队伍信息
export function saveDragonBoatTeamInfo(params) {
  return request.post('/dragon/save', {
    ...params,
    type: '1',
  });
}

// 删除赛龙舟队伍信息
export function deleteDragonBoatTeamInfoById(params) {
  return request.post('/dragon/update', {
    ...params,
    is_delete: '1',
  });
}

// 修改赛龙舟队伍信息
export function updateDragonBoatTeamInfoById(params) {
  return request.post('/dragon/update', params);
}

/* 同庆楼优惠券列表 */
export function tqlCouponList(params) {
  return request.post('/ziDingYiGift/tqlCouponList', params);
}

// 获取红包墙开宝箱内定列表
export function getKbNeidings(params) {
  return request.post('/neiDing/liebiao_hbq', params);
}

// 获取席位表
export function getSeatList(params) {
  return request.post('/neiDing/getSeatList', params);
}

/**
 * 获取卡牌抽奖正面内容
 * @liveId 活动id，必传
 */
export function reqGetCardFrontContent(liveId) {
  return request.get('/qiYeNe/liebiao', { params: { splid: liveId } });
}

/**
 * 更新卡牌抽奖正面内容
 * @param liveId 活动id，必传
 * @param card_data_json 卡牌正面文本内容列表的json字符串
 * @param card_info_json 卡牌样式设置
 */
export function reqUpdateCardFrontContent(liveId, { card_data_json, card_info_json } = {}) {
  return request.post('/qiYeNe/update', { splid: liveId, card_data_json, card_info_json });
}

/**
 * 更新卡牌抽奖背面内容
 * @liveId 活动id，必传
 * @card_info_json 卡牌样式设置
 */
export function reqUpdateCardBackContent(liveId, card_info_json) {
  return request.post('/qiYeNe/update', { splid: liveId, card_info_json });
}

// 签到红包充值
export function shineAnywherePay(params) {
  return request.post('/kpPay/chongzhi2', params);
}

// 签到红包设置
export function shineAnywhereSetting(params) {
  return request.post('/sheZhi/updateSunInfo', params);
}

/** 签到红包余额与红包口袋余额转账
 * @param {string} splid 活动id
 * @param {string} type 转账类型：1 -> 签到红包转账至红包口袋；2 -> 红包口袋转账至签到红包
 * @param {string} money 转账金额
 */
export const zhuanZhangAccount = (splid, type, money) => {
  return request.post('/common/transferAccount', {
    splid,
    type,
    money,
  });
};

// 获取红包雨内定列表
export function getHbyNeidingList(params) {
  return request.post('/neiDing/liebiao_hby', params);
}

/**
 * @typedef {Object} Award
 * @property {string} awardName 奖品名称
 * @property {string} awardPicture 奖品图片
 * @property {Number} awardChance 中奖概率
 * @property {string} awardSaveNumber 奖品数量
 */

/**
 * 「转盘抽奖」—— 获取转盘
 * @param {string} splid 活动id
 */
export const reqGetWheel = (splid) => {
  return request.get('/drawAward/getTurntable', {
    params: {
      splid,
    },
  });
};

/**
 * 「转盘抽奖」 —— 修改转盘
 * @param {string} splid 活动id
 * @param {string} type 转盘类型：1 -> 简易版 2 -> 定制版
 * @param {Array<Award>} awardInfo 奖品列表
 */
export const reqUpdateWheel = ({ splid, type, awardInfo }) => {
  return request.post('/drawAward/updateAward', {
    splid,
    type,
    awardInfo,
  });
};

/**
 * 「你划我猜」 —— 获取游戏信息
 * @param {string} splid 活动id
 */
export const reqGetGestureRiddle = (splid) => {
  return request.get('/rowGuess/getTopic', {
    params: {
      splid,
    },
  });
};

/**
 * 「你划我猜」 —— 修改游戏信息
 * @param {string} splid 活动id
 * @param {{
 *    title?: string,
 *    contentList?: string[],
 *    newTitle?: string,
 *    countDown?: number
 * }}
 */
export const reqEditGestureRiddle = (splid, newInfo) => {
  const param = {
    splid,
    replaceTypeName: newInfo?.oldTitle,
    typeName: newInfo?.newTitle,
    typeValue: newInfo?.contentList,
    gameTime: newInfo?.gameTime,
  };
  Object.keys(param).forEach((item) => {
    switch (param[item]) {
      case undefined:
      case '':
      case null:
        delete param[item];
        break;
      default:
        break;
    }
  });
  return request.post('/rowGuess/updateTopic', param);
};

/**
 * 「你划我猜」 —— 重置单个词组
 * @param {string} splid 活动id
 * @param {number} index 词组索引
 */
export const reqResetSingleWordGroup = (splid, index) => {
  return request.get('/rowGuess/restoreByTypeName', {
    params: {
      splid,
      index,
    },
  });
};

/**
 * 「你划我猜」 —— 重置所有词组
 * @param {string} splid 活动id
 */
export const reqResetAllWordGroup = (splid) => {
  return request.get('/rowGuess/restoreAll', {
    params: {
      splid,
    },
  });
};
