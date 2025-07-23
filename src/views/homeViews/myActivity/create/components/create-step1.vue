<!--创建地图-->
<template>
  <div class="creat-step1">
    <div class="inner">
      <el-form label-position="left" :model="createForm" :rules="rules" ref="createForm" label-width="103px">
        <el-form-item label="大屏版本" prop="kind" v-if="dy_appid">
          <div class="versions">
            <div class="veItem wct" @click="chooseKind('1')" :class="{ active: createForm.kind === '1' }">
              <img src="@/assets/image/icon/activity/wct.png" class="vIcon" />
              微信版
              <img src="@/assets/image/icon/activity/tick.png" class="tIcon" v-if="createForm.kind === '1'" />
            </div>
            <div class="veItem dy" @click="chooseKind('2')" :class="{ active: createForm.kind === '2' }">
              <img src="@/assets/image/icon/activity/dy.png" class="vIcon" />
              抖音版
              <img src="@/assets/image/icon/activity/tick.png" class="tIcon" v-if="createForm.kind === '2'" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <div class="activityTypeWrap">
            <div class="mainTypeList">
              <div
                class="mainCardItem"
                :class="[
                  item.className,
                  {
                    active: createForm.type === item.value || item.value.split(';').indexOf(createForm.type) > -1,
                  },
                ]"
                v-for="(item, index) in activityTypeList"
                :key="item.value"
                @click="chooseActivityType(item.value, index)"
              >
                <img :src="item.icon" class="typeIcon" />
                {{ item.name }}
              </div>
            </div>
            <div class="subTypeList" v-show="subTypeVisible" :class="activeTypeName">
              <div
                class="subCardItem"
                :class="{ active: createForm.type === item.value }"
                v-for="item in activitySubTypeList"
                :key="item.value"
                @click="chooseActivitySubType(item.value)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入活动名称，例如：小明&小红 婚礼盛典" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-form-item prop="date">
            <el-date-picker
              type="date"
              placeholder="请选择活动日期"
              v-model="createForm.date"
              size="mini"
              style="width: 100%"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="活动时段" prop="activeScheduleId">
          <el-select
            v-model="createForm.activeScheduleId"
            placeholder="请选择活动时段"
            @change="handleScheduleSelectChange"
            class="templateConfig"
          >
            <el-option v-for="item in scheduleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地点" prop="address" style="margin-bottom: 18px">
          <el-input v-model="createForm.address" placeholder="请输入活动地点" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="key_word" style="margin-bottom: 18px" v-if="is_show_keyword === '1'">
          <el-input v-model="createForm.key_word" placeholder="请输入关键字" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone_zfb" style="margin-bottom: 18px" v-if="is_show_phone === '1'">
          <el-input v-model="createForm.phone_zfb" placeholder="请输入手机号" size="mini"></el-input>
        </el-form-item>
        <div class="switch-wrap">
          <div class="switch-item" v-if="!isNewUser">
            <span>礼物进红包口袋</span>
            <el-switch v-model="isGiftToHbkd" active-value="1" inactive-value="0" @change="handleGiftToHbkdChange"></el-switch>
            <div class="introduce-box" v-if="isGiftToHbkd === '0'">
              <i class="el-icon-question question-icon"></i>
              <div class="para">
                <p>礼物进红包口袋说明：来宾发送礼物祝福弹幕霸屏所产生的消费金额，将自动转入本场活动红包口袋，可用于红包雨等游戏。</p>
                <p>礼物霸屏进入红包口袋的比例：50%-100%可选,默认开启后100%</p>
              </div>
            </div>
            <div class="detail-label" v-else @click="openGiftToHbkdAndHbyRateSetting('giftToHbkd')">{{ giftToHbkdRateUI }}%</div>
          </div>
          <div class="switch-item">
            <span>来宾评价</span>
            <el-switch v-model="createForm.isNeedUserComment" active-value="1" inactive-value="0"></el-switch>
            <div class="introduce-box">
              <i class="el-icon-question question-icon"></i>
              <div class="para">开启评价后，来宾可对您的婚礼进行评价和打赏。</div>
            </div>
          </div>
          <div class="switch-item" v-if="is_show_helphm === '1'">
            <span>为嗨喵吸粉</span>
            <el-switch v-model="createForm.is_help_hm" active-value="1" inactive-value="0"></el-switch>
          </div>
        </div>
        <el-form-item label="活动扣点比例" prop="hby_kd_rate_val" v-if="!isNewUser && !isInHMenuHidden">
          <div class="rate-set-btn" @click="openGiftToHbkdAndHbyRateSetting('hbyRate')">
            <span>立即设置</span>
            <span>{{ createForm.hby_kd_rate_val }}%</span>
          </div>
        </el-form-item>
        <el-form-item label="互动配置" prop="activeTemplateId" v-if="templateList.length > 0">
          <el-select
            v-model="createForm.activeTemplateId"
            placeholder="请选择互动配置模板"
            @change="handleTemplateSelectChange"
            class="templateConfig"
          >
            <el-option v-for="item in templateList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用劵" v-if="couponList.length > 0">
          <div class="coupon-list">
            <div
              class="coupon-type-item"
              @click="selectCoupon(item)"
              :class="[{ active: couponIdChoosed === item.coupon_id }]"
              v-for="item in couponList"
              :key="item.coupon_id"
            >
              <img :src="require('@/assets/image/coupon/coupon-type-selected.png')" alt="选中" class="i-img" />
              <img :src="item.img_url" alt="券" class="img" />
              <div class="size" v-if="Number(item.size) >= 0">x{{ item.size }}</div>
            </div>
          </div>
          <div class="coupon-tips">注： 劵与红包不可同时叠加使用</div>
        </el-form-item>
        <el-form-item>
          <my-button type="primary" @click.native="submitForm('createForm')" height="29" width="67" v-loading="isLoading">
            立即创建
          </my-button>
        </el-form-item>
      </el-form>
    </div>
    <giftToHbkdAndHbyRateSetting
      v-if="giftToHbkdAndHbyRateSettingVisible"
      :isGiftToHbkd="isGiftToHbkd"
      :giftToHbkdRate="createForm.is_gift_to_hbkd"
      :hbyRate="createForm.hby_kd_rate_val"
      :type="giftToHbkdAndHbyRateSettingType"
      @confirm="handleGiftToHbkdAndHbyRateSettingConfirm"
    />
  </div>
</template>

<script>
import { checkKeyWord, createActivity, getCouponSelectList, getTemplateList } from '@/api/app/live';
import MyButton from '@/components/my-button';
import messageMixin from '@/mixins/messageMixin';
import { mapState } from 'vuex';
import giftToHbkdAndHbyRateSetting from '../../components/giftToHbkdAndHbyRateSetting';

const ACTIVITYTYPE = [
  {
    name: '婚礼版',
    icon: require('../../../../../assets/image/icon/activity/loveIcon.png'),
    hasSubType: false,
    className: 'wedding',
    value: '0',
    subTypeList: [
      {
        name: '婚礼版(默认)',
        value: '0',
      },
    ],
  },
  {
    name: '企业版',
    icon: require('../../../../../assets/image/icon/activity/homeIcon.png'),
    value: '1',
    hasSubType: false,
    className: 'enterprise',
  },
  {
    name: '生日版',
    icon: require('../../../../../assets/image/icon/activity/starIcon.png'),
    hasSubType: true,
    className: 'birth',
    value: '2;21;22;23',
    subTypeList: [
      {
        name: '生日版(通用)',
        value: '2',
      },
      {
        name: '宝宝宴',
        value: '21',
      },
      {
        name: '寿宴',
        value: '22',
      },
      {
        name: '成人礼',
        value: '23',
      },
      {
        name: '百露宴',
        value: '24',
      },
      {
        name: '满月宴',
        value: '25',
      },
      {
        name: '圆锁宴',
        value: '26',
      },
    ],
  },
  {
    name: '校园版',
    icon: require('../../../../../assets/image/icon/activity/schoolIcon.png'),
    hasSubType: true,
    className: 'school',
    value: '41;42;43',
    subTypeList: [
      {
        name: '毕业典礼',
        value: '41',
      },
      {
        name: '谢师宴',
        value: '42',
      },
      {
        name: '金榜题名',
        value: '43',
      },
    ],
  },
  {
    name: '更多版本',
    icon: require('../../../../../assets/image/icon/activity/otherIcon.png'),
    hasSubType: true,
    className: 'other',
    value: '51;52;53;54',
    subTypeList: [
      {
        name: '同学会',
        value: '51',
      },
      {
        name: '乔迁宴',
        value: '52',
      },
      {
        name: '会销',
        value: '53',
      },
      {
        name: '订婚宴',
        value: '54',
      },
    ],
  },
];
export default {
  mixins: [messageMixin],
  name: 'create-step1',
  components: { MyButton, giftToHbkdAndHbyRateSetting },
  data() {
    return {
      showMarker: false,
      timeout: null,
      giftToHbkdAndHbyRateSettingVisible: false,
      giftToHbkdAndHbyRateSettingType: 'giftToHbkd', // 取值 gifToHbkd hbyRate
      isGiftToHbkd: '0', // 礼物进红包口袋开关
      is_gift_to_hbkd_server: '0', // 服务端返回的礼物进红包口袋比例的原始值
      createForm: {
        address: '',
        hotelName: '',
        title: '',
        date: '',
        type: '0',
        isSendSystemGift: '0',
        isNeedUserComment: '1',
        is_help_hm: '0',
        is_show_helphm: '',
        phone_zfb: '',
        activeTemplateId: '',
        activeScheduleId: '',
        key_word: '',
        kind: '1',
        is_gift_to_hbkd: '0', // 礼物进红包口袋比例
        hby_kd_rate_val: '8', // 红包雨扣点比例
        is_close_coin: '0', // 是否喵币充值
      },
      // 输入验证
      rules: {
        title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        date: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'blur',
          },
        ],
        address: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
        phone_zfb: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        activeScheduleId: [{ required: true, message: '请选择活动时段', trigger: 'change' }],
        key_word: [{ required: false, validator: this.validateKeyWord, trigger: 'blur' }],
      },
      /* 限制创建活动的日期 今天开始的30天之内不禁用,其他都禁用 */
      pickerOptions: {
        disabledDate(time) {
          const days = 30; // 设置天数范围
          const minDate = new Date() * 1;
          const maxDate = new Date(minDate + (days - 1) * 24 * 60 * 60 * 1000);
          if (time.getTime() > maxDate || time.getTime() < minDate - 86400000) {
            return true;
          }
          return false;
        },
      },
      activityTypeList: [],
      currentActiveType: 0,
      activitySubTypeList: [],
      activeTypeIndex: 0,
      activeTypeName: '',
      subTypeVisible: false,
      qVisible: false,
      qzVisible: false,
      wxtQrcodeVisible: true,
      isWxtDuang: false,
      templateList: [],
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
      showBindUser: false, // 展示绑定主持人
      giftToHbkdChild: 100, // 给子组件传值 默认值100 8
      hbyKdRateChild: 8,
      hbyKdRateMax: 30,
      couponList: [], // 优惠券列表 项: coupon_id,kind,name,size,img_url
      couponIdChoosed: '', // 选中的优惠券id
      isLoading: false,
      // dyUseApplyDialogVisible: false,
      // kefuQrcodeVisible: false,
    };
  },
  computed: {
    currentActivityType() {
      return this.createForm.type;
    },
    ...mapState({
      is_show_phone: (state) => state.login.userInfo.is_show_phone,
      is_show_keyword: (state) => state.login.userInfo.config.is_show_keyword,
      is_show_helphm: (state) => state.login.userInfo.config.is_show_helphm,
      dy_appid: (state) => state.login.userInfo.config.dy_appid,
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
    }),
    // 是否是新用户
    isNewUser() {
      const { is_hide_tx } = this.$store.state.login.userInfo.config;
      return is_hide_tx;
    },
    giftToHbkdRateUI() {
      return Math.floor(this.createForm.is_gift_to_hbkd * 100);
    },
  },
  created() {
    this.createForm.isSendSystemGift = this.$store.state.login.userInfo.isSendSystemGift;
    this.createForm.isNeedUserComment = this.$store.state.login.userInfo.isNeedUserComment;
    this.createForm.is_show_helphm = this.is_show_helphm;
    this.initActivityTypeList();
    this.getTemplateList();
    this.getCouponSelectList();
  },
  methods: {
    handleGiftToHbkdChange() {
      if (this.isGiftToHbkd === '1') {
        this.giftToHbkdAndHbyRateSettingVisible = true;
        this.createForm.is_gift_to_hbkd = this.is_gift_to_hbkd_server;
        this.giftToHbkdAndHbyRateSettingType = 'giftToHbkd';
        // this.createForm.hby_kd_rate_val = '8';
      } else {
        this.createForm.is_gift_to_hbkd = '0';
        // 礼物进红包口袋功能关闭 红包雨扣点比例超过30的重置为30
        // if (parseInt(this.createForm.hby_kd_rate_val, 10) > 30) {
        //   this.createForm.hby_kd_rate_val = this.createForm.hby_kd_rate_val;
        // }
      }
    },
    handleGiftToHbkdAndHbyRateSettingConfirm(e) {
      if (e.type === 'giftToHbkd') {
        this.createForm.is_gift_to_hbkd = e.giftToHbkdRate;
      } else if (e.type === 'hbyRate') {
        this.createForm.hby_kd_rate_val = e.hbyRate;
      }
      this.handleGiftToHbkdAndHbyRateSettingClose();
      console.log(this.createForm.is_gift_to_hbkd, this.createForm.hby_kd_rate_val);
    },
    handleGiftToHbkdAndHbyRateSettingClose() {
      this.giftToHbkdAndHbyRateSettingVisible = false;
    },
    openGiftToHbkdAndHbyRateSetting(type) {
      this.giftToHbkdAndHbyRateSettingType = type;
      this.giftToHbkdAndHbyRateSettingVisible = true;
    },
    handleTemplateSelectChange(e) {
      this.createForm.activeTemplateId = e;
    },
    handleScheduleSelectChange(e) {
      this.createForm.activeScheduleId = e;
    },
    getTemplateList() {
      this.templateList = [];
      getTemplateList({
        showCount: 10,
        currentPage: 1,
      })
        .then((res) => {
          console.log(res);
          this.templateList = res.data.liveList.map((item) => ({
            id: item.id,
            label: item.theme,
          }));
          if (res.data.endSpl) {
            if (res.data.endSpl.is_gift_to_hbkd === '0') {
              this.createForm.is_gift_to_hbkd = '0';
              this.isGiftToHbkd = '0';
            } else {
              this.createForm.is_gift_to_hbkd = res.data.endSpl.is_gift_to_hbkd;
              this.isGiftToHbkd = '1';
            }
            this.is_gift_to_hbkd_server = this.createForm.is_gift_to_hbkd;
            this.createForm.hby_kd_rate_val = String(res.data.endSpl.hby_kd_rate_val);
            if (res.data.endSpl.is_close_coin && res.data.endSpl.is_close_coin === '1') {
              this.createForm.is_close_coin = '1';
            }
            if (res.data.endSpl.is_help_hm && res.data.endSpl.is_help_hm === '1') {
              this.createForm.is_help_hm = '1';
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
    /**
     * 选择父级版本
     * @param {string} type
     * @param {number} index 当前选中的父级版本索引
     */
    chooseActivityType(type, index) {
      if (this.activeTypeIndex === index) {
        return;
      }
      this.activeTypeIndex = index;
      this.activeTypeName = ACTIVITYTYPE[index].className;
      if (type.indexOf(';') === -1) {
        this.createForm.type = type;
        this.subTypeVisible = false;
        if (this.activitySubTypeList.length > 0) {
          this.activitySubTypeList.splice(0);
        }
      } else {
        this.setSubTypeList();
      }
    },
    chooseActivitySubType(type) {
      this.createForm.type = type;
    },
    initActivityTypeList() {
      if (this.$store.state.login.userInfo.isCanUseZhongShi === '1' && !ACTIVITYTYPE[0].hasSubType) {
        ACTIVITYTYPE[0].hasSubType = true;
        ACTIVITYTYPE[0].value = '0;91';
        ACTIVITYTYPE[0].subTypeList.push({
          name: '中式婚礼版',
          value: '91',
        });
      }
      // END
      this.activeTypeName = ACTIVITYTYPE[0].className;
      const tmpLen = ACTIVITYTYPE.length;
      for (let i = 0; i < tmpLen; i += 1) {
        this.activityTypeList.push({
          name: ACTIVITYTYPE[i].name,
          icon: ACTIVITYTYPE[i].icon,
          value: ACTIVITYTYPE[i].value,
          className: ACTIVITYTYPE[i].className,
        });
      }
      // 设置子类型列表
      this.setSubTypeList();
    },
    setSubTypeList() {
      if (ACTIVITYTYPE[this.activeTypeIndex].hasSubType) {
        this.activitySubTypeList.splice(0);
        this.createForm.type = ACTIVITYTYPE[this.activeTypeIndex].subTypeList[0].value;
        const tmpLen2 = ACTIVITYTYPE[this.activeTypeIndex].subTypeList.length;
        this.subTypeVisible = true;
        for (let j = 0; j < tmpLen2; j += 1) {
          this.activitySubTypeList.push({
            name: ACTIVITYTYPE[this.activeTypeIndex].subTypeList[j].name,
            value: ACTIVITYTYPE[this.activeTypeIndex].subTypeList[j].value,
          });
        }
      }
    },
    submitForm(formName) {
      if (this.isLoading) {
        return;
      }
      const { userInfo } = this.$store.state.login;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          const form = this.createForm;
          if (this.is_show_phone === '1' && form.phone_zfb.length !== 11) {
            this.alertError('手机号格式错误!');
            return;
          }
          const formatDate = `${form.date.getFullYear()}-${(form.date.getMonth() + 1).toString().padStart(2, '0')}-${form.date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
          const params = {
            theme: form.title,
            using_date: formatDate,
            scenario: form.type,
            hotel_name: form.address,
            emcee_name: userInfo.emcee_name,
            isSendSystemGift: form.isSendSystemGift,
            isNeedUserComment: form.isNeedUserComment,
            is_help_hm: form.is_help_hm,
            is_show_helphm: form.is_show_helphm,
            phone_zfb: form.phone_zfb,
            templateId: form.activeTemplateId,
            wedding_schedule: form.activeScheduleId,
            key_word: form.key_word,
            kind: form.kind,
            is_gift_to_hbkd: form.is_gift_to_hbkd,
            hby_kd_rate_val: form.hby_kd_rate_val,
            is_close_coin: form.is_close_coin,
            dy_appid: '',
          };
          if (params.kind === '2' && this.dy_appid) {
            params.dy_appid = this.dy_appid;
          }
          if (this.couponIdChoosed) {
            params.coupon_id = String(this.couponIdChoosed);
          }
          console.log(params);
          this.isLoading = true;
          createActivity(params)
            .then((res) => {
              console.log(res);
              if (res.code === 200) {
                this.alertSuccess('创建成功' || res.msg);
                // 更新设置 避免调用gogog之前的设置问题
                this.$store.commit('login/updateUserInfo', {
                  isSendSystemGift: form.isSendSystemGift,
                  isNeedUserComment: form.isNeedUserComment,
                });
                // 重置form
                this.createForm.address = '';
                this.createForm.hotelName = '';
                this.createForm.title = '';
                this.createForm.date = '';
                this.createForm.type = '0';
                this.createForm.address = '';
                this.createForm.phone_zfb = '';
                this.createForm.key_word = '';

                this.$confirm('活动创建成功,是否跳转到设置页面', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'info',
                })
                  .then((result) => {
                    console.log('************');
                    console.log(res);
                    if (result === 'confirm') {
                      this.toSetting({
                        liveId: res.data.id,
                        sceneType: res.data.scenario,
                      });
                    }
                    this.isLoading = false;
                  })
                  .catch(() => {
                    // 跳转进行中页面
                    this.$router.replace('/app/myActivity/currentActivity');
                    this.isLoading = false;
                  });
              } else {
                this.alertError('创建失败！');
                this.isLoading = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.alertError('创建失败！');
              this.isLoading = false;
            });
        }
      });
    },
    toSetting(pObj) {
      this.$store.commit('initLiveInfo', {
        ...pObj,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityInfo/themeSetting');
    },
    validateKeyWord(rule, value, callback) {
      console.log(rule, value);
      if (!value) {
        return callback();
      }
      checkKeyWord(value)
        .then((res) => {
          console.log(res);
          if (res.data.isUse === '1') {
            return callback(new Error('关键字已被使用!'));
          }
          return callback();
        })
        .catch((err) => {
          console.log(err);
          return callback(new Error('关键字异常!'));
        });
      return undefined;
    },
    selectCoupon(item) {
      if (item.coupon_id === this.couponIdChoosed) {
        this.couponIdChoosed = '';
        this.$message.success(`取消使用${item.name}成功`);
      } else {
        this.couponIdChoosed = item.coupon_id;
        this.$message.success(`本场选择使用${item.name}成功`);
      }
    },
    chooseKind(cKind) {
      this.createForm.kind = cKind;
    },
    dataFormat(val) {
      return `${val}%`;
    },
  },
};
</script>

<style lang="less" scoped>
.creat-step1 {
  padding-top: 15px;
  display: flex;
  width: 100%;

  .inner {
    margin: auto;
    width: 70%;
    max-width: 480px;
    position: relative;
    left: -134px;

    .el-form::v-deep {
      .el-form-item__label {
        width: 66px;
        font-size: 13px;
        font-weight: 400;
        color: rgba(24, 17, 17, 0.85);
      }

      .el-autocomplete {
        width: 100%;
      }

      //取消显示左侧必填星号
      .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
      .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
        content: '';
        color: #f56c6c;
        margin-right: 0;
        display: none;
      }
    }

    .versions {
      display: flex;

      .veItem {
        width: 116px;
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        position: relative;

        &.wct {
          background-color: #28c445;
          margin-right: 24px;
          color: #ffffff;
        }

        &.dy {
          background-color: rgba(255, 0, 79, 0.1);
          color: #ff004f;
        }

        &.active {
          &.wct {
            box-shadow: 0px 6px 8px 0px rgba(40, 196, 69, 0.32);
          }

          &.dy {
            box-shadow: 0px 6px 8px 0px rgba(255, 0, 79, 0.32);
          }
        }

        .vIcon {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }

        .tIcon {
          width: 16px;
          height: 14px;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }

    .activityTypeWrap {
      width: 640px;

      .mainTypeList {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .mainCardItem {
          width: 120px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &.wedding {
            background: #fcf3ee;
            font-size: 18px;
            font-weight: 500;
            color: #f76371;
          }

          &.enterprise {
            background: #e3e8fe;
            font-size: 18px;
            font-weight: 500;
            color: #5972ff;
          }

          &.birth {
            background: #ebdcf9;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            color: #9a50e0;
          }

          &.school {
            background: rgba(255, 196, 131, 0.4);
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            color: #f9ac30;
          }

          &.other {
            background: #ddffd8;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            color: #55cf87;
          }

          &:hover {
            &.wedding {
              box-shadow: 0px 6px 8px 0px rgba(247, 99, 113, 0.32);
              transform: scale(1.05);
            }

            &.enterprise {
              box-shadow: 0px 6px 8px 0px rgba(89, 114, 255, 0.32);
              transform: scale(1.05);
            }

            &.birth {
              box-shadow: 0px 6px 8px 0px rgba(154, 80, 224, 0.32);
              transform: scale(1.05);
            }

            &.school {
              box-shadow: 0px 6px 8px 0px rgba(249, 172, 48, 0.32);
              transform: scale(1.05);
            }

            &.other {
              box-shadow: 0px 6px 8px 0px rgba(85, 207, 135, 0.32);
              transform: scale(1.05);
            }
          }

          &.active {
            &.wedding {
              box-shadow: 0px 6px 8px 0px rgba(247, 99, 113, 0.32);
              transform: scale(1.05);
            }

            &.enterprise {
              box-shadow: 0px 6px 8px 0px rgba(89, 114, 255, 0.32);
              transform: scale(1.05);
            }

            &.birth {
              box-shadow: 0px 6px 8px 0px rgba(154, 80, 224, 0.32);
              transform: scale(1.05);
            }

            &.school {
              box-shadow: 0px 6px 8px 0px rgba(249, 172, 48, 0.32);
              transform: scale(1.05);
            }

            &.other {
              box-shadow: 0px 6px 8px 0px rgba(85, 207, 135, 0.32);
              transform: scale(1.05);
            }
          }

          .typeIcon {
            width: 18px;
            height: 18px;
            margin-right: 16px;
          }
        }
      }

      .subTypeList {
        width: 512px;
        height: 48px;
        border-radius: 8px;
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;

        &.wedding {
          color: #f76371;
          background: #fcf3ee;
          width: 256px;

          .subCardItem {
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;

            &.active {
              width: 114px;
              height: 28px;
              background: #f76371;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }

        &.enterprise {
          color: #5972ff;
        }

        &.birth {
          color: #9a50e0;
          background: #ebdcf9;

          .subCardItem {
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;

            &.active {
              width: 114px;
              height: 28px;
              background: #a564e4;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }

        &.school {
          color: #f9ac30;
          background: rgba(255, 196, 131, 0.4);

          .subCardItem {
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;

            &.active {
              width: 114px;
              height: 28px;
              background: #f9ac30;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }

        &.other {
          color: #55cf87;
          background: #ddffd8;

          .subCardItem {
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;

            &.active {
              width: 114px;
              height: 28px;
              background: #55cf87;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
    .rate-set-btn {
      cursor: pointer;
      color: #409eff;
      font-size: 11px;
      span {
        &:nth-child(2) {
          margin-left: 5px;
        }
      }
    }
    // .sendSystemGiftWrap {
    //   display: flex;
    //   align-items: center;
    //   height: 100%;
    //   position: absolute;
    //   cursor: pointer;

    //   &.newhdWrap {
    //     margin-left: -40px;
    //   }

    //   .quesIcon {
    //     color: #1890ff;
    //     margin-left: 12px;
    //   }

    //   .answerBox {
    //     width: 187px;
    //     padding: 10px;
    //     background-color: #fff;
    //     border-radius: 4px;
    //     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    //     font-size: 11px;
    //     border: 1px solid #ebeef5;
    //     color: #606266;
    //     position: absolute;
    //     top: -113px;
    //     left: 52px;
    //     line-height: 23px;
    //   }

    //   .answerQzBox {
    //     width: 187px;
    //     padding: 10px;
    //     background-color: #fff;
    //     border-radius: 4px;
    //     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    //     font-size: 11px;
    //     border: 1px solid #ebeef5;
    //     color: #606266;
    //     position: absolute;
    //     top: -63px;
    //     left: 45px;
    //     line-height: 23px;
    //   }
    // }
  }
}

.switch-wrap {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  .switch-item {
    color: rgba(24, 17, 17, 0.85);
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
    .introduce-box {
      margin-left: 10px;
      position: relative;
      cursor: pointer;
      .question-icon {
        color: #1890ff;
      }
      .para {
        width: 165px;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px;
        border: 1px solid #ebeef5;
        color: #606266;
        position: absolute;
        top: -42px;
        left: 0px;
        line-height: 1.8;
        z-index: 9999;
        display: none;
      }
      &:hover {
        .para {
          display: block;
        }
      }
    }
    .detail-label {
      margin-left: 10px;
      position: relative;
      cursor: pointer;
      color: #409eff;
      font-size: 11px;
    }
    // &:nth-child(2) {
    // &::after {
    //   content: '';
    //   display: block;
    // }
    // .question-icon {
    //   color: #1890ff;
    // }
    // }
  }
}

.templateConfig::v-deep {
  .el-input {
    font-size: 12px;

    .el-input__inner {
      height: 28px;
    }
  }
}

.coupon-tips {
  width: 700px;
  display: flex;
  align-items: center;
  color: #666;
}

.coupon-list {
  width: 700px;
  display: flex;
  flex-wrap: wrap;

  .coupon-type-item {
    width: 295px;
    height: 82px;
    margin-right: 11px;
    margin-right: 21px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;

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

.dyUseApplyDialogWrap::v-deep {
  .el-dialog {
    width: 985px;
    height: 580px;
    border-radius: 16px;
  }

  .top {
    display: flex;
    justify-content: center;

    .title {
      font-size: 20px;
      font-weight: 500;
      color: #1d2129;
    }
  }

  .dyapplyct {
    display: flex;
    flex-direction: column;
    align-items: center;
    .applyPityImg {
      width: 412px;
      height: 307px;
    }
    .qrcodeImg {
      width: 307px;
      height: 307px;
    }
    .dyapplytip {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      label {
        color: #1890ff;
      }
    }

    .dyapplyBtnGroup {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70px;
      .closeBtn {
        font-size: 14px;
        font-weight: 400;
        color: #1890ff;
        cursor: pointer;
      }

      .contactKeBtn {
        width: 96px;
        height: 38px;
        background: #1890ff;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        margin-left: 60px;
        cursor: pointer;
      }
    }
  }
}
</style>
