import request from '@/utils/request';

/**
 * 修改用户昵称、头像、隐私设置菜单状态
 * @param { {emcee?:string,avator?:string,hp_status?:'1'|'0'} } paramObj
 */
export const editNameAndHeadImg = (paramObj) => {
  const targetObj = {};
  const objKeys = Object.keys(paramObj);
  objKeys.forEach((key) => {
    if (paramObj[key]) {
      targetObj[key] = paramObj[key];
    }
  });
  return request.post('/host/personalInformation', targetObj);
};

// 自定义签到背景
export const editSignBgCustom = ({ sign_json = '' }) => request.post('/host/personalInformation', {
  sign_json,
});

// 自定义开屏广告
export const editAdvertCustom = ({ phone_advert_json = '' }) => request.post('/host/personalInformation', {
  phone_advert_json,
});

/**
 * 获取绑定微信的二维码
 * @param {String} user_name //
 * @param {String} headimg_url
 */
export const getBindWXERCode = ({ request_from_page } = { request_from_page: 'api/app/user' }) => request.post('/host/bangDingVxQrCode', {
  request_from_page,
});

/**
 * 是否  已绑定微信号
 */
export const judgeIsBindWX = ({ request_from_page } = { request_from_page: 'api/app/user' }) => request.post('/host/isBangDingWx', {
  request_from_page,
});

/**
 * 解绑微信号
 */
export const unBIndWX = ({ request_from_page } = { request_from_page: 'api/app/user' }) => request.post('/host/notBangDingWx', {
  request_from_page,
});

/**
 * 设置  微信推送
 */
export const setWeChatPushNotice = ({ request_from_page = 'api/app/user', notice_type, notice_value }) => request.post('/noticeUser/editNotice', {
  request_from_page,
  [notice_type]: notice_value,
});

/**
 * 获取用户推送设置
 */

export const getWeChatSettingList = ({ request_from_page = 'api/app/user' }) => request.post('/noticeUser/noticeInfo', {
  request_from_page,
});

/**
 * 获取  吸粉 列表
 */
export const getFansList = ({ request_from_page = 'api/app/user' }) => request.post('/gzh/getShouQuanList', {
  request_from_page,
});

/**
 * 获取  吸粉 绑定公众号二维码
 */
export const getFansERCode = ({ request_from_page = 'api/app/user', id }) => request.post('/gzh/shouQuan2', {
  request_from_page,
  id,
});

/**
 * 设置吸粉开关
 */

export const getFansSwitch = ({ request_from_page = 'api/app/user', id }) => request.get('/gzh/switchPowder', {
  params: { request_from_page, id },
});

/**
 * 帮我吸粉
 */

export const helpMeGetFans = ({ request_from_page = 'api/app/user', invitee_id }) => {
  request.get('/yaoQing/helpMePowder', {
    invitee_id,
    request_from_page,
  });
};

/**
 * 取消帮我吸粉
 */

export const cancelHelpMeGetFans = ({ request_from_page = 'api/app/user', invitee_id }) => {
  request.get('/yaoQing/cancelPowder', {
    invitee_id,
    request_from_page,
  });
};

// 修改公众号游戏二维码绑定
export const editGameQrcodeBind = (pObj) => request.post('/gzh/editGzhInfo', {
  play_info: pObj.play_info,
  id: pObj.id,
});

// 设置广告位
export const setAd = (pObj) => request.post('/host/personalInformation', {
  advert_json: JSON.stringify(pObj),
});

//  绑定支付宝
export const bindZfbFn = ({ zhiFuBaoPhone, realName }) => request.post('/host/updateZhiFuBaoInfo', {
  zhiFuBaoPhone,
  realName,
});

/** 点歌收益提现
 * @param {string} splid 活动id
 * @param {string} heart_wall_id 收益明细id
 */
export const withDrawOrderSongIncome = (splid, heart_wall_id) => {
  return request.post(`/newHuoDongHm/musicTiXian?splid=${splid}&heart_wall_id=${heart_wall_id}`);
};
