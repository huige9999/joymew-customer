import store from '@/store/index';
import request from '@/utils/request';

export const editActivityMsg = (params) => request.post('/sheZhi/update', params);

export const getLivePhotoInfo = (params) => request.post('/photo/getPhotoShiList', params);

export const purchaseLivePhotoFunc = (params) => request.post('/kpPay/chongzhi', params);

export const purchaseLivePhotoFunc2 = (params) => request.post('/kpPay/chongzhi2', params);

export const getFixedQrcodeInfo = (params) => request.post('/fixed/getMyQrcodeInfo', params);

export const updateFixedQrcodeInfo = (params) => request.post('/fixed/editQrcodeSplid', params);

export const editActivityInfo = ({
  theme = '', // 活动名称
  hotel_name = '', // 活动地点,
  hide_gift_switch = '', // 是否关闭礼物
  is_test_game = '', // 是否本场设置为测试活动
  isSendSystemGift = '', // 是否开启系统弹幕
  isNeedUserComment = '', // 是否开启来宾评价
  is_help_hm = '', // 是否帮助嗨喵吸粉
  is_gift_to_hbkd = '', // 礼物进红包口袋 取值'0'表示关闭,非'0'表示礼物进红包口袋的比例
  isLimitBuyHbq = '', // 是否开启限制参与开宝箱红包墙游戏(开启后特定用户买不了红包墙和宝箱)
  forbit_repeat_lottery = '', // 是否禁止游戏前十名重复中奖
  hui_suo_switch = '', // 是否隐藏手机端的红包口袋余额
  phone_zfb = '', // 申请活动的手机号
  is_end_wedding = '', // 是否提前结束本场活动
  font_color = '', // 祝福榜字体颜色
  emcee_name = '', // 宴会厅名称
  wedding_schedule = '', // 活动时段
  is_open_advert = '', // 是否开启看广告得半价礼物
  is_close_coin = '', // 是否开启取消喵币支付功能
  coupon_id = '', // 券
  card_json = '', // 广告弹幕
  is_forbid_send = '', // 自定义文本内容
  hbkd_str = '', // 自定义红包口袋充值模板
  identity_switch = '', // 是否开启男女方亲友设置
  newcomer_json = '', // 新人信息
}) => {
  // 根据函数参数传值情况生成paramData的值
  const paramData = {
    splid: store.state.liveId,
  };
  const tmpParamMap = {
    theme,
    hotel_name,
    hide_gift_switch,
    is_test_game,
    isSendSystemGift,
    isNeedUserComment,
    is_help_hm,
    is_gift_to_hbkd,
    isLimitBuyHbq,
    forbit_repeat_lottery,
    hui_suo_switch,
    phone_zfb,
    is_end_wedding,
    font_color,
    emcee_name,
    wedding_schedule,
    is_open_advert,
    is_close_coin,
    coupon_id,
    card_json,
    is_forbid_send,
    hbkd_str,
    identity_switch,
    newcomer_json,
  };
  const tmpParamMapKeys = Object.keys(tmpParamMap);
  tmpParamMapKeys.forEach((paramMapKey) => {
    if (tmpParamMap[paramMapKey] !== '') {
      paramData[paramMapKey] = tmpParamMap[paramMapKey];
    }
  });
  return request.post('/sheZhi/update', paramData);
};

export const updateHbyKind = (params) => request.post('/sheZhi/updateHbyKind', params);
