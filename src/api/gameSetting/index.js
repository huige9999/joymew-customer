import store from '@/store/index';
import request from '@/utils/request';

/**
 * 获取猜台词数据
 */
export const reqGetGuessSpeech = () => request.get(`https://ustatic.joymew.com/joymewServer/guessSpeech.json?time=${Date.now()}`);
export const reqGetGuessSpeechNew = () => request.get(`/miniGame/getGameData?starType=18&splid=${store.state.liveId}`);
/**
 * 获取猜台词配置
 */
export const reqGetGuessSpeechConfig = () => request.get(`/activityMay2023/getRule?ruleKey=${store.state.liveId}-guessSpeech`);

/**
 * 保存猜台词配置
 */

export const saveGuessSpeechConfig = (valueStr) => request.post('/activityMay2023/saveRulo', {
  ruleKey: `${store.state.liveId}-guessSpeech`,
  ruleValue: valueStr,
});
export const saveGuessSpeechConfigNew = (valueStr) => request.post('/miniGame/setGameData', {
  starType: '18',
  questionIds: valueStr,
});

/**
 * 喊红包初始化
 * @returns {Promise<String>}
 */
export async function reqShouHbData() {
  return request.post('/sheZhi/findInfo', { splid: store.state.liveId }).then((res) => res.data.han_hb_json);
}

/**
 * 喊红包更新
 * @param {String} danmu 弹幕 格式xxx_xxx_xxx
 */
export async function reqUpdateShoutHbData(danmu) {
  return await request.post('/qianDaoYu/updateHanHbJson', {
    han_hb_json: danmu,
    splid: store.state.liveId,
  });
}

/**
 * 摇钱树更新
 * @param {String} data json字符串
 */
export async function reqUpdateMoneyShakeTreeData(data) {
  return await request.post('/qianDaoYu/updateHanHbJson', {
    money_tree_json: data,
    splid: store.state.liveId,
  });
}

/**
 * 生成数字
 */
export const reqGenerateNumber = (rangeList) => {
  const listStr = JSON.stringify(rangeList);
  return request.post('/neiDing/newShengChengNumber2', {
    splid: store.state.liveId,
    arrayStr: listStr,
  });
};

// 猜电影
export const reqGetGuessCommon = () => request.get('/miniGame/getGameData?starType=17');
export const saveGuessCommon = (valueStr) => request.post('/miniGame/setGameData', {
  starType: '17',
  questionIds: valueStr,
});

// 猜动画
export const reqGetGuessAnimation = () => request.get('/miniGame/getGameData?starType=21');
export const saveGuessAnimation = (valueStr) => request.post('/miniGame/setGameData', {
  starType: '21',
  questionIds: valueStr,
});

// 品牌达人
export const reqGetGuessBrand = () => request.get('/miniGame/getGameData?starType=20');
export const saveGuessBrand = (valueStr) => request.post('/miniGame/setGameData', {
  starType: '20',
  questionIds: valueStr,
});

// 猜明星
export const reqGetGuessStar = () => request.get('/miniGame/getGameData?starType=11');
export const saveGuessStar = (valueStr) => request.post('/miniGame/setGameData', {
  starType: '11',
  questionIds: valueStr,
});
