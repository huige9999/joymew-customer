<template>
  <div class="yx-config-page">
    <div class="yx-header">
      <div class="header-left">
        <div class="logo"></div>
        <div class="back-btn" @click="back">返回上一级</div>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="prview" v-if="id">预览并发布</el-button>
        <el-button type="primary" @click="saveHandler">保存</el-button>
      </div>
    </div>
    <div class="yx-body">
      <div class="yx-sidebar">
        <div
          class="yx-sidebar-item"
          :class="{ active: activeMenuIndex === index }"
          v-for="(menu, index) in menus"
          :key="menu.id"
          @click="changMenu(index)"
        >
          {{ menu.text }}
        </div>
      </div>
      <div class="yx-preview">
        <div class="pre-style" :class="menus[activeMenuIndex].key"></div>
      </div>
      <div class="yx-config">
        <div class="config-tab">
          <div
            class="tab-item"
            v-for="(tab, index) in configTabs"
            :key="tab.text"
            :class="{ active: activeTab === index }"
            @click="changeTab(index)"
          >
            {{ tab.text }}
          </div>
        </div>
        <div class="part-body">
          <div class="cpn-container">
            <base-config :yxId="id" :config="baseConfig" v-show="activeTabKey === 'base'" @complete="nextStep" ref="baseRef"></base-config>
            <award-config :config="awardConfig" v-show="activeTabKey === 'award'" @showResort="showResort" ref="awardRef"></award-config>
          </div>
        </div>
      </div>
    </div>
    <resort-cpn v-if="isShowResort" :awardData="copyData" @close="isShowResort = false" @change="changeAwardData"> </resort-cpn>
    <PreviewActivity v-if="isShowPreview" :id="id" :type="'2'" @change="isShowPreview = false" :release="is_release" @edit="edit" @fabu="fabu" />
  </div>
</template>

<script>
// 接口
import { getChouJiangData, modifyChouJiangData } from '@/api/yx/chouJiang';
import { editBaseInfo } from '@/api/yx/yx';
// 组件
import PreviewActivity from '@/views/homeViews/yx/previewActivity.vue';
import awardConfig from './components/awardConfig.vue';
import baseConfig from './components/baseConfig.vue';
import resortCpn from './components/resortCpn.vue';

export default {
  name: 'chouJiang',
  components: {
    awardConfig,
    baseConfig,
    resortCpn,
    PreviewActivity,
  },
  data() {
    return {
      menus: [
        {
          text: '首页',
          id: 1,
          key: 'home',
        },
        {
          text: '奖品详情',
          id: 2,
          key: 'detail',
        },
        {
          text: '中奖页面',
          id: 3,
          key: 'success',
        },
        {
          text: '未中奖页面',
          id: 4,
          key: 'fail',
        },
        {
          text: '奖品派完页 ',
          id: 5,
          key: 'complete',
        },
      ],
      activeMenuIndex: 0,
      id: '',
      configTabs: [
        {
          id: 1,
          text: '基本设置',
          key: 'base',
        },
        {
          id: 2,
          text: '奖项设置',
          key: 'award',
        },
      ],
      activeTab: 0,
      activeTabKey: '',
      isCompleteBase: false,
      isShowResort: false,
      isShowPreview: false,
      copyData: [],
      is_release: '',
      baseConfig: {
        name: '', // 优惠券名称
        introduce: '', // 优惠券简介
        effectTime: '1', // 生效时间，默认1
        validateTime: '365', // 有效期，默认365
        times: '1', // 领取次数，默认-1 代表无限
        diyTimes: '1',
        tips: '', // 使用须知
      },
      awardConfig: [
        {
          award_name: '优惠券',
          award_level: '一等奖',
          award_condition: '1000',
          award_discount: '100',
          award_probability: '20',
          award_count: '100',
        },
      ],
      timer: null,
    };
  },
  async created() {
    // 获取路径参数
    const { id } = this.$route.query;
    // 如果携带id，则请求对应活动的数据
    if (id) {
      this.id = id;
      this.isCompleteBase = true;
      this.getHuoDongData();
    }
  },
  mounted() {
    this.activeTabKey = 'base';
  },
  methods: {
    changMenu(index) {
      if (index === this.activeMenuIndex) {
        return;
      }
      this.activeMenuIndex = index;
    },
    changeTab(index) {
      if (this.activeTab === index) return;
      if (!this.isCompleteBase) {
        this.$message.error('请先完成基本设置');
        return;
      }
      if (this.activeTab === index) return;
      this.activeTab = index;
      this.activeTabKey = this.configTabs[index].key;
    },
    back() {
      this.$router.back();
    },
    nextStep(id) {
      this.id = id;
      this.isCompleteBase = true;
      this.changeTab(1);
    },
    showResort() {
      // 获取奖项数据
      const data = this.$refs.awardRef.awardItems;
      this.copyData = [...data];
      this.isShowResort = true;
    },
    // 更新奖项数据
    changeAwardData(data) {
      // 修改awardConfig组件中的数据
      this.$refs.awardRef.awardItems = [...data];
      // 调用接口更新数据
      this.updateAwardData();
    },
    // 获取对应活动id的数据
    async getHuoDongData() {
      const { data: res } = await getChouJiangData(this.id);
      if (!res) {
        this.$message.error('获取活动数据失败，请稍后重试');
        return;
      }
      this.is_release = (res.is_release === '0');
      this.handlerBaseConfig(res);
      this.handlerAwardConfig(res);
    },
    // 处理基本设置数据
    handlerBaseConfig(data) {
      const { activity_desc, data_json, limit_switch, title } = data;
      // 去JSON化data_json属性获取对应的使用须知、生效时间、有效期等数据
      const otherData = JSON.parse(data_json);
      // 更新表单数据
      this.baseConfig = {
        name: title,
        introduce: activity_desc,
        tips: otherData.tips,
        times: limit_switch,
        diyTimes: '1',
        effectTime: otherData.effectTime,
        validateTime: otherData.validateTime,
      };
      if (String(limit_switch) !== '-1') {
        this.baseConfig.diyTimes = limit_switch;
      }
    },
    // 处理奖项数据
    handlerAwardConfig(data) {
      const { prize_json } = data;
      if (!prize_json) return;
      const copy = [];
      // 将对象类型转化为数组类型
      Object.keys(prize_json).forEach((key) => {
        // 判断key是否为数字类型
        if (Number.isNaN(Number(key))) return;
        copy.push(prize_json[key]);
      });
      this.awardConfig = [...copy];
    },
    // 保存活动设置
    async saveHandler() {
      // 判断是否完成了基本设置
      if (!this.isCompleteBase) {
        this.$message.error('请先完成基本设置');
        return;
      }

      // 判断奖项设置中的表单是否填写完整
      this.$refs.awardRef.$refs.contentForm.validate(async () => {
        this.$refs.awardRef.$refs.awardConfig.validate(async (valid) => {
          if (valid) {
            // 更新奖项数据
            this.updateAwardData();
          } else {
            // 验证失败弹出错误提示，
            this.$message.error('请完善奖项的配置');
          }
        });
      });
    },
    // 上传奖项
    async updateAwardData() {
      if (this.timer) return;
      // 处理奖项数据
      const copy = [...this.$refs.awardRef.awardItems];
      console.log('数组', copy);
      // 判断中奖概率是否合格：1.当奖项数量小于6时，所有奖项的中奖的总概率小于等于100%；当奖项数量为6时，中奖概率总和等于100%；
      const len = copy.length;
      let totalProbability = 0;
      // 计算总中奖率
      totalProbability = copy.reduce((pV, cV) => {
        return pV + Number(cV.award_probability);
      }, totalProbability);
      // 如果奖项小于6个，且总中奖率大于100，提示错误
      if (len < 6 && totalProbability > 100) {
        this.$message.error(`当前共${len}个奖项，总中奖概率为${totalProbability}%，大于100%，请确保总概率不超过100%`);
        return;
      }
      // 如果奖项为6个，且总中奖率不等于100，则提示错误
      if (len === 6 && totalProbability !== 100) {
        this.$message.error(`当前共${len}个奖项，总中奖概率为${totalProbability}%，请确保总概率为100%`);
        return;
      }
      let totalPrizeCount = 0;
      // 计算所有奖品的总数量
      totalPrizeCount = copy.reduce((pV, cV) => {
        return pV + Number(cV.award_count);
      }, 0);
      // 将数组转化为对象
      const targetObj = {};
      copy.forEach((award, index) => {
        targetObj[index] = award;
      });
      targetObj.totalPrizeCount = totalPrizeCount;
      const prize_json = JSON.stringify(targetObj);
      // 处理要修改的数据
      this.baseConfig = { ...this.$refs.baseRef.baseConfig };
      const data_json = {
        effectTime: String(this.baseConfig.effectTime),
        validateTime: String(this.baseConfig.validateTime),
        tips: String(this.baseConfig.tips),
      };
      // 处理请求接口的参数
      const paramObj = {
        id: this.id,
        title: this.baseConfig.name,
        activity_desc: this.baseConfig.introduce,
        data_json: JSON.stringify(data_json),
        limit_switch: String(this.baseConfig.times),
        prize_json,
      };
      // 调用编辑活动数据接口
      const { msg: target } = await modifyChouJiangData(paramObj);
      if (target && target !== 'edit成功') {
        this.$message.error('保存失败，请稍后重试');
        return;
      }
      this.$message.success('保存成功');
      // 跳转路由至我的活动页
      this.timer = setTimeout(() => {
        this.$router.replace({
          path: '/app/yx/myActivities',
        });
      }, 1000);
    },
    // 预览
    prview() {
      this.isShowPreview = true;
    },
    // 编辑
    edit() {
      this.isShowPreview = false;
    },
    // 发布
    fabu() {
      const params = {
        id: String(this.id),
        is_release: '1',
      };
      editBaseInfo(params).then(() => {
        this.$message.success('发布成功');
        this.$router.replace({
          path: '/app/yx/myActivities',
        });
        this.isShowPreview = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@basePath: '~@/assets/image/yx/choujiang/';
.yx-config-page {
  width: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .yx-header {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    box-shadow: 0px 10px 5px 5px rgba(0, 0, 0, 0.6);

    .header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .logo {
        width: 93px;
        height: 47px;
        margin-right: 34px;
        background-size: 100% 100%;
        background-image: url('~@/assets/image/logo.png');
      }

      .back-btn {
        height: 22px;
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4e5969;
        font-size: 14px;
        cursor: pointer;
        &::before {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-image: url('~@/assets/image/yx/back-icon.png');
          background-size: 100% 100%;
          background-position: center;
          margin-right: 4px;
          margin-top: 2px;
        }
      }
    }
  }
  .yx-body {
    display: flex;
    height: 100%;
    flex-grow: 1;
    .yx-sidebar {
      padding-top: 24px;
      width: 122px;
      height: 100%;
      background: #fff;
      color: #8ca0b3;
      font-size: 16px;
      background: #ffffff;
      box-shadow: 4px 0px 4px 0px rgba(203, 203, 203, 0.19);
      //   flex-grow: 1;
      .yx-sidebar-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 500;
          color: #0f3d5f;
        }
        &::after {
          display: block;
          content: '';
          width: 12px;
          height: 1px;
          background: #c4c4c4;
          position: absolute;
          bottom: 0;
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
    .yx-preview {
      background: #f2f5f8;
      padding: 76px 45px;
      padding-top: 50px;
      box-sizing: border-box;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      .pre-style {
        width: 390px;
        height: 690px;
        background: #c4c4c4;
        background-size: 100%;
      }
      .home {
        background-image: url('@{basePath}home.png');
      }
      .detail {
        background-image: url('@{basePath}detail.png');
      }
      .success {
        background-image: url('@{basePath}zhongjiang.png');
      }
      .fail {
        background-image: url('@{basePath}weizhongjiang.png');
      }
      .complete {
        background-image: url('@{basePath}kucunbuzu.png');
      }
    }
    .yx-config {
      width: 718px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;

      .config-tab {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        background-color: #f6f6f6;

        .tab-item {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #535353;
          font-size: 16px;
          letter-spacing: 2px;
          cursor: pointer;
        }
        .active {
          background-color: #fff;
          color: #0f3d5f;
          font-weight: bold;
        }
      }

      .part-body {
        margin-top: 17px;

        .cpn-container {
          width: 100%;
          padding-right: 17px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
