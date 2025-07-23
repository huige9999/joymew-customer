<!--创建地图-->
<template>
  <div class="creat-step1">
    <div class="inner">
      <el-form label-position="left" :model="createForm" :rules="rules" ref="createForm" label-width="103px">
        <el-form-item label="活动类型" prop="type">
          <div class="activityTypeWrap">
            <div class="mainTypeList">
              <div
                class="mainCardItem"
                :class="[
                  item.className,
                  {
                    active: createForm.type === item.value || item.value.split(';').indexOf(createForm.type) > -1
                  }
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
          <el-input v-model="createForm.title" placeholder="请输入活动名称，例如：企业盛典" size="mini"></el-input>
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
        <div class="switch-wrap" v-show="false">
          <el-form-item label="来宾评价" prop="isNeedUserComment" style="margin-bottom: 18px">
            <div class="sendSystemGiftWrap">
              <el-switch v-model="createForm.isNeedUserComment" active-value="1" inactive-value="0"></el-switch>
              <i class="el-icon-question quesIcon" @mouseenter="qzEnter" @mouseleave="qzLeave"></i>
              <div class="answerQzBox" v-show="qzVisible">
                <p>开启评价后，来宾可对您的婚礼进行评价和打赏。</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="为嗨喵吸粉" prop="is_help_hm" style="margin-bottom: 18px; margin-left: 100px" v-if="is_show_helphm === '1'">
            <div class="sendSystemGiftWrap">
              <el-switch v-model="createForm.is_help_hm" active-value="1" inactive-value="0"></el-switch>
            </div>
          </el-form-item>
        </div>
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
        <el-form-item>
          <my-button type="primary" @click.native="submitForm('createForm')" height="29" width="67" v-loading="isLoading"
            >立即创建</my-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkKeyWord, createActivity, getTemplateList } from '@/api/app/live';
import MyButton from '@/components/my-button';
import messageMixin from '@/mixins/messageMixin';
import { mapState } from 'vuex';

const ACTIVITYTYPE = [
  {
    name: '企业版',
    icon: require('../../../../../assets/image/icon/activity/homeIcon.png'),
    value: '1',
    hasSubType: false,
    className: 'enterprise',
  },
  {
    name: '会销版',
    icon: require('../../../../../assets/image/icon/activity/otherIcon.png'),
    value: '53',
    hasSubType: false,
    className: 'other',
  },
];
export default {
  mixins: [messageMixin],
  name: 'CreateStepCompany',
  components: { MyButton },
  data() {
    return {
      showMarker: false,
      timeout: null,
      createForm: {
        address: '',
        hotelName: '',
        title: '',
        date: '',
        type: '1',
        isSendSystemGift: '0',
        isNeedUserComment: '0',
        is_help_hm: '0',
        phone_zfb: '',
        activeTemplateId: '',
        activeScheduleId: '',
        key_word: '',
        kind: '1',
        hby_kd_rate_val: '',
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
      isLoading: false,
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
    }),
  },
  created() {
    // this.createForm.isSendSystemGift = this.$store.state.login.userInfo.isSendSystemGift;
    // this.createForm.isNeedUserComment = this.$store.state.login.userInfo.isNeedUserComment;
    this.initActivityTypeList();
    this.getTemplateList();
    // this.getCouponSelectList();
  },
  mounted() {},
  methods: {
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
          this.templateList = res.data.liveList.map((item) => ({
            id: item.id,
            label: item.theme,
          }));
          if (res.data.endSpl) {
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
    chooseActivityType(type, index) {
      console.log(this.activeTypeIndex, index);
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
          console.log(this.createForm);
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
            phone_zfb: form.phone_zfb,
            templateId: form.activeTemplateId,
            wedding_schedule: form.activeScheduleId,
            key_word: form.key_word,
            kind: form.kind,
            hby_kd_rate_val: form.hby_kd_rate_val.toString(),
            is_close_coin: form.is_close_coin,
            dy_appid: '',
          };
          if (params.kind === '2' && this.dy_appid) {
            params.dy_appid = this.dy_appid;
          }
          // if (this.currentCoupon) {
          //   params.coupon_id = String(this.currentCoupon);
          // }
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
                    this.$router.replace('/app/cHome');
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
    qEnter() {
      this.qVisible = true;
    },
    qLeave() {
      this.qVisible = false;
    },
    qzEnter() {
      this.qzVisible = true;
    },
    qzLeave() {
      this.qzVisible = false;
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
    .activityTypeWrap {
      width: 640px;
      .mainTypeList {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .mainCardItem {
          width: 120px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          margin-right: 20px;
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
    .sendSystemGiftWrap {
      display: flex;
      align-items: center;
      height: 100%;
      position: absolute;
      cursor: pointer;
      &.newhdWrap {
        margin-left: -40px;
      }
      .quesIcon {
        color: #1890ff;
        margin-left: 12px;
      }
      .answerBox {
        width: 187px;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px;
        border: 1px solid #ebeef5;
        color: #606266;
        position: absolute;
        top: -113px;
        left: 52px;
        line-height: 23px;
      }
      .answerQzBox {
        width: 187px;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px;
        border: 1px solid #ebeef5;
        color: #606266;
        position: absolute;
        top: -63px;
        left: 45px;
        line-height: 23px;
      }
    }
  }
}
.map-container::v-deep {
  flex: 1 1 auto;
  background-color: #f3f1ec;
  .BMap_Marker {
    display: none;
  }
  &.showMarker .BMap_Marker {
    display: block;
  }
  .map {
    height: 100%;
    width: 100%;
    .map-view {
      width: 100%;
      flex: 1;
    }
    .BMap_cpyCtrl {
      display: none;
      height: 16px;
    }
    .anchorBL {
      bottom: 0;
      img {
        height: 17px;
        width: 6px;
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
.coupon-tips {
  width: 700px;
  display: flex;
  align-items: center;
  color: #666;
}
</style>
