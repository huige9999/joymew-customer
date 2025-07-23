<!--创建地图-->
<template>
  <div class="creat-step1">
    <div class="inner">
      <el-form
        label-position="left"
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="86px"
      >
        <el-form-item
          label="大屏版本"
          prop="kind"
          v-if="dy_appid"
        >
          <div
            class="versions"
            :class="{ hltVersion: isHlt }"
          >
            <div
              class="veItem wct"
              @click="chooseKind('1')"
            >
              <img
                src="@/assets/image/icon/activity/wct.png"
                class="vIcon"
              />
              微信版
              <img
                src="@/assets/image/icon/activity/tick.png"
                class="tIcon"
                v-if="createForm.kind === '1'"
              />
            </div>
            <div
              class="veItem dy"
              @click="chooseKind('2')"
            >
              <img
                src="@/assets/image/icon/activity/dy.png"
                class="vIcon"
              />
              抖音版
              <img
                src="@/assets/image/icon/activity/tick.png"
                class="tIcon"
                v-if="createForm.kind === '2'"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="活动类型"
          prop="type"
        >
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
                <img
                  :src="item.icon"
                  class="typeIcon"
                />
                {{ item.name }}
              </div>
            </div>
            <div
              class="subTypeList"
              v-show="subTypeVisible"
              :class="activeTypeName"
            >
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
        <el-form-item
          label="活动名称"
          prop="title"
        >
          <el-input
            v-model="createForm.title"
            placeholder="请输入活动名称，例如：小明&小红 婚礼盛典"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动日期">
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
        <el-form-item
          label="活动时段"
          prop="activeScheduleId"
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
          prop="activeHotelName"
        >
          <!-- <el-select
            v-model="createForm.activeHotelName"
            placeholder="请选择活动酒店"
            @change="handleHotelSelectChange"
            class="templateConfig"
          >
            <el-option v-for="item in hotelList" :key="item.id" :label="item.label" :value="item.label"></el-option>
          </el-select> -->
          <el-autocomplete
            class="templateConfig"
            v-model="createForm.activeHotelName"
            @blur="handleHotelBlur"
            @select="handleHotelSelect"
            :fetch-suggestions="queryHotelNameSearch"
            placeholder="请输入活动酒店"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item
          label="宴会厅"
          prop="address"
          style="margin-bottom: 18px"
        >
          <el-select
            v-model="createForm.address"
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
          label="互动配置"
          v-if="templateList.length > 0"
        >
          <el-select
            v-model="createForm.activeTemplateId"
            placeholder="请选择互动配置模板"
            @change="handleTemplateSelectChange"
            class="templateConfig"
          >
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 同庆楼绑定主持人 -->
        <el-form-item
          label="绑定主持人"
          prop="bindId"
          style="margin-bottom: 18px"
          v-if="isBindHost"
        >
          <!-- <bind-host-item v-model="createForm.bindId"></bind-host-item> -->
          <bind-host-new v-model="createForm.bindId"></bind-host-new>
        </el-form-item>

        <el-form-item>
          <my-button
            type="primary"
            @click.native="submitForm('createForm')"
            height="29"
            width="67"
            v-loading="isLoading"
          >
            立即创建
          </my-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createActivity, getTemplateList } from '@/api/app/live';
import MyButton from '@/components/my-button';
import messageMixin from '@/mixins/messageMixin';
import { mapState } from 'vuex';
import BindHostNew from './bindHostNew';

const ACTIVITYTYPE = [
  {
    name: '婚礼版',
    icon: require('../../../../../assets/image/icon/activity/loveIcon.png'),
    value: '0',
    hasSubType: false,
    className: 'wedding',
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
    value: '51;52;53',
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
    ],
  },
];
export default {
  mixins: [messageMixin],
  name: 'create-step1',
  components: {
    MyButton,
    BindHostNew,
  },
  data() {
    return {
      showMarker: false,
      timeout: null,
      createForm: {
        address: '',
        title: '',
        date: '',
        type: '0',
        activeHotelName: '',
        activeScheduleId: '',
        activeTemplateId: '',
        bindId: null,
        kind: '1',
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
        activeHotelName: [
          { required: true, message: '请输入活动酒店', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.hotelList.some((item) => item.value === value)) {
                callback();
              } else {
                callback(new Error('请输入正确的酒店名称'));
              }
            },
          },
        ],
        activeScheduleId: [{ required: true, message: '请选择活动时段', trigger: 'change' }],
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
      hotelList: [],
      emceeNameList: [],
      // mapInfo: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      high_privilege: (state) => state.login.userInfo.high_privilege,
      dy_appid: (state) => state.login.userInfo.config.dy_appid,
      bind_switch: (state) => state.login.userInfo.bind_switch,
    }),
    currentActivityType() {
      return this.createForm.type;
    },
    isBindHost() {
      return this.high_privilege === 3 || this.high_privilege === 4 || this.bind_switch === '1';
    },
    isHlt() {
      return this.high_privilege === 3 || this.high_privilege === 4 || this.high_privilege === 5;
    },
  },
  created() {
    this.initActivityTypeList();
    this.getTemplateList();
    // 拥有抖音版权限并且是婚礼堂账号默认版本是抖音版
    if (this.dy_appid && this.isHlt) {
      this.createForm.kind = '2';
    }
  },
  mounted() {},
  methods: {
    handleTemplateSelectChange(e) {
      this.createForm.activeTemplateId = e;
    },
    handleScheduleSelectChange(e) {
      this.createForm.activeScheduleId = e;
    },
    // 手动输入酒店名称
    handleHotelBlur() {
      this.generateEmceeNameListByHotel(this.createForm.activeHotelName);
    },
    // 选择建议项
    handleHotelSelect(e) {
      this.createForm.activeHotelName = e.label;
      this.generateEmceeNameListByHotel(this.createForm.activeHotelName);
    },
    handleEmceeNameSelectChange(e) {
      this.createForm.address = e;
    },
    generateEmceeNameListByHotel(e) {
      if (this.hotelList.length === 0) {
        return;
      }
      const hotelInfo = this.hotelList.find((item) => item.label === e);
      if (!hotelInfo) {
        this.emceeNameList = [];
        return;
      }
      this.emceeNameList = hotelInfo.hallName.split(',').map((item, index) => ({
        id: index,
        label: item,
      }));
    },
    getTemplateList() {
      getTemplateList({
        showCount: 10,
        currentPage: 1,
      })
        .then((res) => {
          console.log(res, '000001');
          this.templateList = res.data.liveList.map((item) => ({
            id: item.id,
            label: item.theme,
            isForbitEdit: item.is_forbit_edit,
          }));
          if (res.data.tqlInfoMap5) {
            const tmpTqlInfoObj = JSON.parse(res.data.tqlInfoMap5);
            this.hotelList = tmpTqlInfoObj.list.map((item) => ({
              id: item.storeId,
              label: item.storeName,
              value: item.storeName,
              hallName: item.hallName,
            }));
          }
          // 设置默认选中模板
          const tempLen = this.templateList.length;
          for (let i = 0; i < tempLen; i += 1) {
            if (this.templateList[i].isForbitEdit && this.templateList[i].isForbitEdit === '1') {
              this.createForm.activeTemplateId = this.templateList[i].id;
              break;
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

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          const form = this.createForm;
          const formatDate = `${form.date.getFullYear()}-${(form.date.getMonth() + 1).toString().padStart(2, '0')}-${form.date
            .getDate()
            .toString()
            .padStart(2, '0')}`;

          const params = {
            theme: form.title,
            using_date: formatDate,
            scenario: form.type,
            hotel_name: form.activeHotelName,
            emcee_name: form.address,
            templateId: form.activeTemplateId,
            wedding_schedule: form.activeScheduleId,
            kind: form.kind,
            dy_appid: '',
          };

          if (form.bindId) {
            params.bind_userId = form.bindId;
          }
          if (params.kind === '2' && this.dy_appid) {
            params.dy_appid = this.dy_appid;
          }
          this.isLoading = true;
          createActivity(params)
            .then((res) => {
              console.log(res);
              if (res.code === 200) {
                this.alertSuccess('创建成功' || res.msg);
                // 重置form
                this.createForm.address = '';
                this.createForm.title = '';
                this.createForm.date = '';
                this.createForm.type = '0';

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
    chooseKind(cKind) {
      this.createForm.kind = cKind;
    },
    queryHotelNameSearch(querystring, cb) {
      const result = querystring ? this.hotelList.filter((hotel) => hotel.value.includes(querystring)) : this.hotelList;
      cb(result);
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

      &.hltVersion {
        .veItem {
          &.wct {
            order: 2;
            margin-right: 0;
          }
          &.dy {
            order: 1;
            margin-right: 24px;
          }
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

// .switch-wrap {
//   width: 100%;
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
// }

.templateConfig::v-deep {
  .el-input {
    font-size: 12px;

    .el-input__inner {
      height: 28px;
    }
  }
}
</style>
