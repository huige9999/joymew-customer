<template>
  <sub-page class="activityEdit">
    <main-card>
      <el-form
        label-position="left"
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="105px"
      >
        <div class="activity">
          <div
            class="activity-left"
            v-show="!isTemplate"
          >
            <card-top-info title="基本信息"></card-top-info>
            <!-- 表单 -->
            <div class="creat-step1">
              <div class="inner">
                <el-form-item
                  label="活动名称"
                  prop="name"
                >
                  <el-input
                    v-model="createForm.name"
                    placeholder="请输入活动名称"
                    @change="handleCreateFormNameChange"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="活动时间"
                  required
                >
                  <el-form-item prop="date">
                    <el-date-picker
                      disabled
                      type="date"
                      placeholder="请选择活动日期"
                      v-model="createForm.date"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item
                  label="活动类型"
                  prop="type"
                >
                  <el-radio-group v-model="createForm.type">
                    <el-radio
                      label="0"
                      disabled
                    >
                      婚礼
                    </el-radio>
                    <el-radio
                      label="1"
                      disabled
                    >
                      年会
                    </el-radio>
                    <el-radio
                      label="2"
                      disabled
                    >
                      生日
                    </el-radio>
                    <el-radio
                      label="4"
                      disabled
                    >
                      校园
                    </el-radio>
                    <el-radio
                      label="5"
                      disabled
                    >
                      其他
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="活动地点"
                  prop="address"
                  style="margin-bottom: 18px"
                  v-show="!isHlt"
                >
                  <el-input
                    v-model="createForm.address"
                    placeholder="请输入活动地点"
                    @change="handleCreateFormAddressChange"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="关键字"
                  prop="key_word"
                  style="margin-bottom: 18px"
                  v-if="is_show_keyword === '1'"
                >
                  <el-input
                    v-model="createForm.key_word"
                    placeholder="请输入关键字"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="活动时段"
                  prop="activeScheduleId"
                  style="margin-bottom: 18px"
                  v-show="isHlt"
                >
                  <el-select
                    v-model="createForm.activeScheduleId"
                    placeholder="请选择活动时段"
                    @change="handleScheduleSelectChange"
                    class="templateConfig"
                  >
                    <el-option
                      v-for="item in scheduleList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="活动酒店"
                  prop="address"
                  style="margin-bottom: 18px"
                  v-show="isHlt"
                >
                  <el-select
                    v-model="createForm.address"
                    placeholder="请选择活动酒店"
                    @change="handleHotelSelectChange"
                    class="templateConfig"
                  >
                    <el-option
                      v-for="item in hotelList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="宴会厅"
                  prop="emceeName"
                  style="margin-bottom: 18px"
                  v-show="isHlt"
                >
                  <el-select
                    v-model="createForm.emceeName"
                    placeholder="请选择宴会厅"
                    @change="handleEmceeNameSelectChange"
                    class="templateConfig"
                  >
                    <el-option
                      v-for="item in emceeNameList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="手机号"
                  prop="phone_zfb"
                  style="margin-bottom: 18px"
                  v-if="is_show_phone === '1'"
                >
                  <el-input
                    v-model="createForm.phone_zfb"
                    placeholder="请输入手机号"
                    @change="handlePhoneChange"
                  ></el-input>
                </el-form-item>
                <div
                  class="switch-wrap"
                  v-if="isBindHost"
                >
                  <el-form-item
                    label="绑定主持人"
                    prop="showBindUser"
                    style="margin-bottom: 18px"
                  >
                    <!-- 开关-是否开启绑定二维码 -->
                    <el-switch
                      v-model="isShowBind"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <!-- 绑定二维码 -->
                    <!-- <div v-if="!isHasBinded && isShowBind === '1'" class="qr-wrap">
                      <img class="qrcode" :src="bindQrCode" alt="绑定二维码" />
                      <div class="qrtext">
                        主持人绑定本场活动后，第二天会获得 本场活动的礼物收益和游戏收益分成。 将通过微信零钱的方式
                        <span style="color: #1e87f0">自动到账</span>。
                      </div>
                    </div> -->
                    <!-- 已绑定的主持人信息 -->
                    <!-- <div v-if="isHasBinded && bindUser" class="bind-user">
                      <div class="bind-info">
                        <img :src="bindUser.headImg" alt class="headImg" />
                        <div class="name">{{ bindUser.name }}</div>
                      </div>
                      <div @click="cancelBindWX" class="edit">取消绑定</div>
                    </div>-->
                    <bindHostNew
                      :onlyDialogMode="true"
                      :liveId="liveId"
                      ref="bindHostNew"
                      @onBindedDialogClose="handleBindedDialogClose"
                    />
                  </el-form-item>
                </div>
                <el-form-item
                  label="祝福榜字体颜色"
                  prop="font_color"
                >
                  <el-color-picker
                    v-model="createForm.font_color"
                    @change="handleFontcolorChange"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item
                  label="使用劵:"
                  v-if="is_show_coupon && couponList.length > 0"
                >
                  <div class="coupon-list">
                    <div
                      class="coupon-type-item"
                      @click="selectCoupon(item)"
                      :class="[{ active: couponKindActive === item.kind }]"
                      v-for="item in couponList"
                      :key="item.coupon_id"
                    >
                      <img
                        :src="require('@/assets/image/coupon/coupon-type-selected.png')"
                        alt="选中"
                        class="i-img"
                      />
                      <img
                        :src="item.img_url"
                        alt="券"
                        class="img"
                      />
                      <div
                        class="size"
                        v-if="Number(item.size) >= 0"
                      >
                        x{{ item.size }}
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="activity-right">
            <card-top-info title="互动配置"></card-top-info>
            <!-- 表单 -->
            <div class="creat-step1">
              <div class="inner inner-right">
                <div class="line">
                  <span style="padding-right: 20px">关闭手机端"发礼物"功能:</span>
                  <el-switch
                    v-model="createForm.selector"
                    active-value="1"
                    inactive-value="0"
                    class="d-switch"
                    @change="handleSwitchChange('hide_gift_switch', 'selector')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">关闭手机端"发照片"功能</span>
                  <el-switch
                    v-model="createForm.is_open_advert"
                    active-value="2"
                    inactive-value="3"
                    @change="handleSwitchChange('is_open_advert')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">开启"系统弹幕"功能:</span>
                  <el-switch
                    v-model="createForm.isSendSystemGift"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('isSendSystemGift')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">开启"来宾评价"功能:</span>
                  <el-switch
                    v-model="createForm.isNeedUserComment"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('isNeedUserComment')"
                  ></el-switch>
                </div>
                <div
                  class="line"
                  v-if="is_show_helphm"
                >
                  <span style="padding-right: 20px">开启"为嗨喵吸粉"功能:</span>
                  <el-switch
                    v-model="createForm.is_help_hm"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('is_help_hm')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">隐藏手机端"红包口袋余额":</span>
                  <el-switch
                    v-model="createForm.hui_suo_switch"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('hui_suo_switch')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">限制"非现场来宾"参与红包墙和开宝箱游戏:</span>
                  <el-switch
                    v-model="createForm.isLimitBuyHbq"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('isLimitBuyHbq')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">限制摇一摇、数钞票等游戏的前十名重复中奖:</span>
                  <el-switch
                    v-model="createForm.isForbidRepeatLottery"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('forbit_repeat_lottery', 'isForbidRepeatLottery')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">开启手机端"取消喵币充值"功能:</span>
                  <el-switch
                    v-model="createForm.is_close_coin"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('is_close_coin')"
                  ></el-switch>
                </div>
                <giftToHbkdProportionSet v-bind:isGiftToHbkd.sync="createForm.is_gift_to_hbkd" ref="giftToHbkdProportionSet"/>
                <div class="line">
                  <span style="padding-right: 20px">禁止来宾手机端自定义文本内容:</span>
                  <el-switch
                    v-model="createForm.is_forbid_send"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('is_forbid_send')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">来宾手机端上传头像、昵称:</span>
                  <el-switch
                    v-model="needFormAuth"
                    active-value="1"
                    inactive-value="0"
                    @change="setNeedFormAuth"
                  ></el-switch>
                </div>
                <div
                  class="line"
                  v-if="sceneType === '0'"
                >
                  <span style="padding-right: 20px">男女方亲友设置:</span>
                  <el-switch
                    v-model="createForm.identity_switch"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('identity_switch')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">本场活动设置为测试活动:</span>
                  <el-switch
                    v-model="createForm.is_test_game"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('is_test_game')"
                  ></el-switch>
                </div>
                <div class="line">
                  <span style="padding-right: 20px">提前结束本场活动:</span>
                  <el-switch
                    v-model="createForm.is_end_wedding"
                    active-value="1"
                    inactive-value="0"
                    @change="handleSwitchChange('is_end_wedding')"
                  ></el-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="bottom-tipbar">
        <my-tip-bar
          class="my-tip-bar"
          colorStyle="yellow"
        >
          为了您的互动体验更流畅，请使用chrome浏览器进行互动
          <a
            :href="downloadURL"
            class="blue-text"
            target="_blank"
          >
            立即下载
          </a>
        </my-tip-bar>
        <my-tip-bar
          class="my-tip-bar"
          colorStyle="blue"
        >
          点击查看使用帮助，简易连接大屏电脑的网络单独提供（如4g热点），不要与现场混在一起，以免现场用户太多导致网络拥堵，从而影响现场效果
        </my-tip-bar>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import { getCouponSelectList } from '@/api/app/live';
import { editActivityInfo, editActivityMsg } from '@/api/setting/activitySetting/activity';
import { getActivity } from '@/api/setting/activitySetting/theme';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import MyTipBar from '@/components/myTipBar';
import SubPage from '@/components/subPage';
import bindHostNew from '@/views/homeViews/myActivity/create/components/bindHostNew.vue';
import { mapState } from 'vuex';
import giftToHbkdProportionSet from './components/giftToHbkdProportionSet.vue';

let bindTimer = null;
const macUrl = 'https://ustatic.joymew.com/browsers/googlechromeSetupMacos.dmg';
const osUrl = 'https://ustatic.joymew.com/browsers/ChromeStandaloneSetup64.exe';
export default {
  name: 'activityEdit',
  components: {
    MainCard,
    SubPage,
    MyTipBar,
    CardTopInfo,
    bindHostNew,
    giftToHbkdProportionSet,
  },
  beforeDestroy() {
    if (bindTimer) {
      clearInterval(bindTimer);
      bindTimer = null;
    }
  },
  created() {
    if (bindTimer) {
      clearInterval(bindTimer);
      bindTimer = null;
    }
    // 根据liveId获取所有活动信息
    this.getActivityInfo();
    this.generateDownloadURL();
    if (this.is_show_coupon) {
      this.getCouponSelectList();
    }
  },
  mounted() {},
  data() {
    return {
      active: 0,
      timeout: null,
      downloadURL: osUrl,
      createForm: {
        date: '',
        type: '0',
        name: '',
        address: '',
        phone_zfb: '',
        selector: '0',
        isSendSystemGift: '0',
        isNeedUserComment: '1',
        hui_suo_switch: '0',
        is_end_wedding: '0',
        isLimitBuyHbq: '0',
        isForbidRepeatLottery: '0',
        font_color: '',
        activeScheduleId: '',
        emceeName: '',
        is_test_game: '0',
        key_word: '',
        is_close_coin: '0',
        is_open_advert: '3',
        is_help_hm: '0',
        coupon_id: '',
        is_forbid_send: '0',
        identity_switch: '0',
        is_gift_to_hbkd: '0',
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
        emceeName: [{ required: true, message: '请输入宴会厅', trigger: 'blur' }],
        phone_zfb: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      },
      hotelList: [],
      emceeNameList: [],
      scheduleList: [
        {
          id: '1',
          label: '午宴',
        },
        {
          id: '2',
          label: '晚宴',
        },
      ],
      isShowBind: '0',
      couponList: [], // 优惠券列表 项: coupon_id,kind,name,size,img_url
      couponKindActive: '',
      requestLock: false,
      needFormAuth: '0',
    };
  },
  watch: {
    isShowBind(newVal) {
      // console.log('-----');
      // this.handleBindStatus();
      if (newVal === '1') {
        this.$refs.bindHostNew.openBindedDialog();
      }
    },
    // isHasBinded() {
    //   if (!this.isHasBinded) {
    //     this.handleBindStatus();
    //   }
    // }
  },
  computed: {
    ...mapState({
      is_show_phone: (state) => state.login.userInfo.is_show_phone,
      isTemplate: (state) => state.isTemplate,
      high_privilege: (state) => state.login.userInfo.high_privilege,
      is_show_keyword: (state) => state.login.userInfo.config.is_show_keyword,
      is_show_helphm: (state) => state.login.userInfo.config.is_show_helphm,
      bind_switch: (state) => state.login.userInfo.bind_switch,
      liveId: (state) => state.liveId,
      sceneType: (state) => state.sceneType,
      isBindHost() {
        return this.high_privilege === 3 || this.high_privilege === 4 || this.bind_switch === '1';
      },
      isHlt() {
        return this.high_privilege === 3 || this.high_privilege === 4 || this.high_privilege === 5;
      },
      is_show_coupon() {
        return !this.isHlt;
      },
      // 是否是新用户
      isNewUser() {
        const { is_hide_tx } = this.$store.state.login.userInfo.config;
        return is_hide_tx;
      },
    }),
  },
  methods: {
    // 开关变化处理
    // paramKey表示请求接口所需要传递的key, createFormKey表示paramKey所对应的createForm中的key
    // createFormKey不传表示 paramKey和createForm的key相同
    handleSwitchChange(paramKey, createFormKey) {
      const createFormKeyLast = createFormKey || paramKey;
      this.updateFormInfo({
        [paramKey]: this.createForm[createFormKeyLast],
      });
    },
    // 请求接口修改表单信息
    // pObj => {theme: '活动名称'}
    updateFormInfo(pObj) {
      return new Promise((resolve, reject) => {
        editActivityInfo(pObj)
          .then((res) => {
            console.log('提交修改', res);
            resolve(res);
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功',
              });
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 不同系统浏览器下载
    generateDownloadURL() {
      const version = navigator.userAgent.toLowerCase();
      const mac = version.indexOf('mac');
      const os = version.indexOf('os');
      if (mac > 0 && os > 0) {
        // 苹果系统下执行的操作
        this.downloadURL = macUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      } else {
        this.downloadURL = osUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      }
      console.log(this.downloadURL);
    },
    /* 获取活动信息 */
    getActivityInfo() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        const info = res.data;
        this.createForm.name = info.theme;
        this.createForm.date = info.using_date;
        this.createForm.type = info.scenario.length === 1 ? info.scenario : info.scenario.slice(0, 1);
        this.createForm.address = info.hotel_name;
        this.createForm.phone_zfb = info.phone_zfb;
        this.createForm.selector = info.hide_gift_switch;
        this.createForm.is_test_game = info.is_test_game;
        this.createForm.isSendSystemGift = info.isSendSystemGift;
        this.createForm.isNeedUserComment = info.isNeedUserComment;
        this.createForm.is_help_hm = info.is_help_hm;
        this.createForm.hui_suo_switch = info.hui_suo_switch;
        this.createForm.is_end_wedding = info.is_end_wedding;
        this.createForm.isLimitBuyHbq = info.isLimitBuyHbq;
        this.createForm.isForbidRepeatLottery = info.forbit_repeat_lottery;

        this.createForm.font_color = info.userInfo.font_color;
        this.createForm.activeScheduleId = info.wedding_schedule === '0' ? '' : info.wedding_schedule;
        this.createForm.emceeName = info.emcee_name;
        this.createForm.key_word = info.key_word;
        this.createForm.is_forbid_send = info.is_forbid_send === '1' ? '1' : '0';
        this.createForm.identity_switch = info.identity_switch === '1' ? '1' : '0';
        if (info.configInfo) {
          const tmpIsOpenAdvert = info.configInfo.is_open_advert.toString();
          this.createForm.is_open_advert = tmpIsOpenAdvert === '2' ? '2' : '3';
        }
        this.createForm.is_close_coin = info.is_close_coin;
        this.createForm.is_gift_to_hbkd = info.is_gift_to_hbkd;
        if (info.tqlInfoMap5) {
          const tmpTqlInfoObj = JSON.parse(info.tqlInfoMap5);
          if (tmpTqlInfoObj.list) {
            this.hotelList = tmpTqlInfoObj.list.map((item) => ({
              id: item.storeId,
              label: item.storeName,
              hallName: item.hallName,
            }));
          }
        }
        if (info.coupon_info) {
          this.couponKindActive = info.coupon_info.kind;
        }

        if (info.location_val && info.location_val.includes('needFormAuth')) {
          this.locationObj = JSON.parse(info.location_val);
          const { needFormAuth } = this.locationObj;
          this.needFormAuth = needFormAuth;
        }
      });
    },
    handleHotelSelectChange(e) {
      this.createForm.address = e;
      this.generateEmceeNameListByHotel(this.createForm.address);
      this.createForm.emceeName = this.emceeNameList[0].label;
      this.updateFormInfo({
        hotel_name: this.createForm.address,
        emcee_name: this.createForm.emceeName,
      });
    },
    generateEmceeNameListByHotel(e) {
      if (this.hotelList.length === 0) {
        return;
      }
      const hotelInfo = this.hotelList.find((item) => item.label === e);
      this.emceeNameList = hotelInfo.hallName.split(',').map((item, index) => ({
        id: index,
        label: item,
      }));
    },
    handleScheduleSelectChange(e) {
      this.createForm.activeScheduleId = e;
      this.updateFormInfo({
        wedding_schedule: this.createForm.activeScheduleId,
      });
    },
    handleEmceeNameSelectChange(e) {
      this.createForm.emceeName = e;
      this.updateFormInfo({
        emcee_name: this.createForm.emceeName,
      });
    },
    handleFontcolorChange() {
      this.updateFormInfo({
        font_color: this.createForm.font_color,
      });
    },
    setNeedFormAuth() {
      console.log(this.needFormAuth);
      let targetObj = null;
      if (this.locationObj) {
        targetObj = {
          ...this.locationObj,
          needFormAuth: this.needFormAuth,
        };
      } else {
        targetObj = {
          needFormAuth: this.needFormAuth,
        };
      }
      const data = {
        splid: this.$store.state.liveId,
        location_val: JSON.stringify(targetObj),
      };
      editActivityMsg(data).then((res) => {
        console.log('提交修改', res);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
        }
      });
    },
    // handleBindStatus() {
    //   if (this.isShowBind === '0') {
    //     this.askIsBindWx();
    //     return;
    //   }

    //   const isShowBind = this.isShowBind === '1';
    //   if (isShowBind) {
    //     this.setBindImgAndAskIsBind();
    //   } else if (bindTimer) {
    //     clearInterval(bindTimer);
    //   }
    // },
    // 获取绑定二维码图片并轮询绑定结果
    // setBindImgAndAskIsBind() {
    //   console.log('获取二维码图片');
    //   bindVxQrCode({
    //     splid: this.$store.state.liveId
    //   }).then(res => {
    //     console.log(res);
    //     if (res) {
    //       this.bindQrCode = res;
    //       console.log('轮询绑定结果');
    //       if (bindTimer) {
    //         clearInterval(bindTimer);
    //         bindTimer = null;
    //       }
    //       bindTimer = setInterval(() => {
    //         this.askIsBindWx(true);
    //       }, 2000);
    //     }
    //   });
    // },
    // 查询是否已绑定
    // askIsBindWx(interval) {
    //   isBindWx({
    //     splid: this.$store.state.liveId
    //   }).then(res => {
    //     console.log(res);
    //     const { is_bind } = res.data;
    //     if (is_bind === '0') {
    //       // 未绑定
    //       this.isHasBinded = false;
    //     }
    //     if (is_bind === '1') {
    //       const { bind_headImg, bind_nickname } = res.data;
    //       if (interval) {
    //         this.$message.success('绑定成功');
    //       }

    //       // 已经绑定
    //       this.isHasBinded = true;
    //       if (bindTimer) {
    //         clearInterval(bindTimer);
    //       }
    //       this.bindUser = {
    //         headImg: bind_headImg,
    //         name: bind_nickname
    //       };
    //       // this.isShowBind = false;
    //     }
    //   });
    // },
    // 取消绑定
    // cancelBindWX() {
    //   cancelBindWx({
    //     splid: this.$store.state.liveId
    //   }).then(res => {
    //     if (res.success) {
    //       this.isHasBinded = false;
    //       this.isShowBind = '1';
    //       this.$message.success('解绑成功');
    //     }
    //     console.log(res);
    //   });
    // },
    handleBindedDialogClose() {
      this.isShowBind = '0';
    },
    // 活动名称变化的处理方法
    handleCreateFormNameChange() {
      this.updateFormInfo({
        theme: this.createForm.name,
      });
    },
    // 活动地点变化的处理方法
    handleCreateFormAddressChange() {
      this.updateFormInfo({
        hotel_name: this.createForm.address,
      });
    },
    // 手机号变化的处理方法
    handlePhoneChange() {
      if (this.is_show_phone === '1' && this.createForm.phone_zfb.length !== 11) {
        this.$message.error('手机号格式错误!');
        return;
      }
      this.updateFormInfo({
        phone_zfb: this.createForm.phone_zfb,
      });
    },
    selectCoupon(item) {
      if (this.requestLock) {
        return;
      }
      if (this.couponKindActive) {
        // 使用券的情况
        // 点击已选中的券-> 取消该券的使用
        if (item.kind === this.couponKindActive) {
          this.couponKindActive = '';
          this.createForm.coupon_id = '';
          this.updateFormInfo({
            coupon_id: '0',
          });
        } else {
          // 点击未选中的券 -> 取消已经在使用的券，使用该券
          this.couponKindActive = item.kind; // 视图层选中
          this.createForm.coupon_id = item.coupon_id; // 数据层使用
          this.requestLock = true;
          this.updateFormInfo({
            coupon_id: this.createForm.coupon_id,
          })
            .then(() => {
              this.requestLock = false;
            })
            .catch((err) => {
              console.log(err);
              this.requestLock = false;
            });
        }
      } else {
        // 未使用券的情况
        // 点击使用某一张券
        this.couponKindActive = item.kind; // 视图层选中
        this.createForm.coupon_id = item.coupon_id; // 数据层使用
        this.requestLock = true;
        this.updateFormInfo({
          coupon_id: this.createForm.coupon_id,
        })
          .then(() => {
            this.requestLock = false;
          })
          .catch((err) => {
            console.log(err);
            this.requestLock = false;
          });
      }
    },
    /* 获取优惠券信息 */
    getCouponInfo() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res);
        const info = res.data;
        if (info.coupon_info) {
          this.coupon_kind = info.coupon_info.kind || '';
        } else {
          this.coupon_kind = '';
        }
      });
    },
    getCouponSelectList() {
      const IMGMAP = {
        5: 'https://ustatic.hudongmiao.com/joymewCustomer/giftCoupon.png', // 礼物图片
        6: 'https://ustatic.hudongmiao.com/joymewCustomer/gameCoupon.png', // 游戏图片
      };
      getCouponSelectList().then((res) => {
        console.log(res);
        if (res?.data?.list && res.data.list.length > 0) {
          this.couponList = res.data.list.map((item) => ({
            coupon_id: item.coupon_id,
            kind: item.kind,
            name: item.name,
            size: item.size,
            img_url: IMGMAP[item.kind],
          }));
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form::v-deep {
  .el-form-item__label {
    width: 66px;
    font-size: 13px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }

  .el-autocomplete {
    width: 100%;
  }

  .el-input {
    input {
      height: 29px;
    }
  }

  //取消显示左侧必填星号
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
    content: '';
    color: #f56c6c;
    margin-right: 0;
    display: none;
  }

  .submit-button {
    width: 67px;
    height: 29px;
    background: #1890ff;
    border-color: #1890ff;
    .hvCenter();
    padding: 0;

    span {
      width: 51px;
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
  }
}

.my-steps {
  margin: 45px 100px 10px;
}

.bottom-tipbar {
  border-top: 1px solid #e9e9e9;
  padding: 10px 0 80px 35px;

  .my-tip-bar {
    margin-top: 10px;
  }
}

.creat-step1 {
  padding-top: 15px;
  display: flex;
  // justify-content: flex-start;
  width: 100%;

  .inner {
    // margin: auto;
    margin-left: 20px;

    &.inner-right {
      margin-right: 20px;
    }

    width: 100%;
    max-width: 480px;
    max-width: 500px;

    .activity-type-container {
      display: flex;
      align-items: center;

      > div {
        display: flex;
        width: 73px;
        height: 28px;
        border-radius: 4px;
        border: 1px solid #ff3fc7;
        position: relative;

        img {
          width: 16px;
          height: 16px;
        }

        .text {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff3fc7;
        }

        .selected {
          position: absolute;
          background-image: url('~@/assets/image/isSelect-icon.png') no-repeat;
        }
      }
    }
  }
}

.switch-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.templateConfig::v-deep {
  .el-input {
    font-size: 12px;

    .el-input__inner {
      height: 28px;
    }
  }
}

.qr-wrap {
  width: 374px;
  height: 120px;
  background: #f4f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;

  .qrcode {
    width: 100px;
    height: 100px;
  }

  .qrtext {
    margin-left: 20px;
    width: 204px;
    height: 66px;
    line-height: 1.8;
    font-size: 12px;
    color: #666666;
  }
}

.bind-user {
  width: 374px;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bind-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .headImg {
      width: 48px;
      height: 48px;
      border-radius: 41px;
    }

    .name {
      margin-left: 10px;
      color: #333333;
      font-size: 18px;
    }
  }

  .edit {
    width: 80px;
    height: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f01e44;
    font-size: 14px;
  }
}

.coupon-tips {
  width: 500px;
  display: flex;
  // justify-content: center;
  // align-items: center;
  color: #666;
  text-align: center;
}

.coupon-list {
  width: 700px;
  display: flex;
  flex-direction: column;

  .coupon-type-item {
    width: 295px;
    height: 82px;
    margin-right: 11px;
    margin-right: 21px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    margin-bottom: 20px;

    .img {
      width: 285px;
      height: 81px;
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 1;
      border-radius: 5px;
      cursor: pointer;
    }

    .i-img {
      width: 295px;
      height: 91px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      display: none;
      cursor: pointer;
    }

    .size {
      position: absolute;
      top: 3px;
      right: 105px;
      font-size: 21px;
      color: #9e6843;
      user-select: none;
      z-index: 3;
    }

    &.active,
    &:hover {
      .i-img {
        display: block;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.activity {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .activity-left {
    width: 50%;
    flex-grow: 1;
  }

  .activity-right {
    width: 50%;

    flex-grow: 1;
  }
}

.line {
  margin-bottom: 28px;
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: 13px;
  color: #262626;
  position: relative;
}

.detailLabel {
  color: #409eff;
  position: absolute;
  right: 100px;
  cursor: pointer;
}
</style>
