import { handleRoutePermission } from '@/router/index';

const state = {
  userInfo: {
    bind_switch: '0', // 是否绑定主持人
    total_person: '0', // 总粉丝数
    time_lastlogin: 0,
    emcee_name: '',
    avator: '',
    invite_income: 0,
    earning_gift: 0,
    password: '',
    gift_share_income: 0,
    wx_openid: '',
    qinNiu_prefix: 'https://ustatic.joymew.com/',
    id: '',
    wx_name: '',
    set_meal_type: '0',
    gzh_type: '0',
    // 高级模式
    high_privilege: '',
    // 是否设置过过高级模式密码
    hp_passwd: '',
    withdrawal_money: 0,
    create_time: 1605873153000,
    IP: '',
    business_college: '0',
    is_hide_zfb: '0',
    is_can_create_user: '0',
    token: '',
    income_rate: '',
    user_money: {
      spltotal: 0, // 总互动
      create_time: 0,
      splactual: 0,
      dicetype: '0',
      earning_invite: 0,
      earning_gift: 0,
      earning_total: 0,
      earning_giftshare: 0,
      earning_hasTx: 0,
      user_id: '',
      kbx_share_income: 0,
      id: '',
      invite_code: '',
      balance_withdraw: 0,
      funcount: 0,
    },
    last_month_active_size: 0,
    total_income: 0,
    money: 0,
    phonenumber: '',
    authority: '0',
    component_end_time: '',
    invite_code: '',
    vip_level: 0,
    Browser: '',
    isCanUploadKp: '0', // 是否能上传课程
    powder_switch: '0', // 是否开通吸粉
    wedding_switch: '0', // 是否开通婚宴预定功能
    advert_json: '',
    phone_advert_json: '',
    sign_json: '',
    sign_show_phone: '0', // 婚礼版是否获取手机号
    config: {
      is_show_keyword: '0',
      dy_appid: '',
      is_show_helphm: '0',
      is_hide_tx: true,
    },
    arrangedLotteryTestSignInCount: 0,
  }, // sideBar菜单
  isLogin: false,
  isScreenBgLS: '0', // 是否大屏背景拉伸
  hotelId: '', // 酒店id
};

const getters = {};

const mutations = {
  updateUserInfo(state, userInfo) {
    state.userInfo = { ...state.userInfo, ...userInfo };
    state.isLogin = true;
    handleRoutePermission(state.userInfo);
  },
  quit(state) {
    state.isLogin = false;
  },
  // 更新个人信息头像
  upadateImgUrl(state, payload) {
    state.userInfo.avator = payload;
  },
  updateIsScreenBgLS(state, data) {
    state.isScreenBgLS = data;
  },
  // 更新个人信息姓名
  updateName(state, payload) {
    state.userInfo.emcee_name = payload;
  },
  // 更新签到背景信息
  updateSignJson(state, payload) {
    state.userInfo.sign_json = payload;
  },
  // 更新开屏广告信息
  updatePhoneAdvertJson(state, data) {
    state.userInfo.phone_advert_json = data;
  },
  setHotelId(state, data) {
    state.hotelId = data;
  },
  setJcUpIncome(state, data) {
    state.userInfo.income_rate = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
