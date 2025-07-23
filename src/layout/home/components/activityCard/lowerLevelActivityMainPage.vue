<!--进行中/已完成页面-->
<template>
  <sub-page class="underwayActivity">
    <main-card :cusClass="'minHeight'">
      <info-bar>
        <span>建议连接大屏电脑的网络单独提供（如4g热点），不要与现场混在一起，以免现场用户太多导致网络拥堵，从而影响现场效果</span>
        <div class="blue-text" @click="contact">联系客服</div>
      </info-bar>
      <el-timeline class="activity-timeLine" v-loading="loading" ref="main">
        <have-not-data v-show="dataList.length === 0 && !loading"></have-not-data>
        <el-timeline-item placement="top" v-for="(item, index) in dataList" :timestamp="item.date" :key="index">
          <card
            :activity-data="item"
            :is-active="isActive"
            @refresh="refresh"
            :labelData="{ type: item.type, sstate: item.sstate, schedule: item.schedule, carrierType: item.carrierType }"
          />
        </el-timeline-item>
      </el-timeline>
      <el-pagination
        background
        :hide-on-single-page="true"
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="showCount"
        :total="totalResult"
        class="my-pagination"
      />
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import Card from '@/layout/home/components/activityCard/activityCard2';
import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';

import InfoBar from '@/components/infoBar';
import HaveNotData from '@/layout/home/components/haveNotData';
import { getLowerLevelActivityInfo } from '@/api/app/live';

export default {
  mixins: [messageBoxMixin, messageMixin],
  name: 'mainPage',
  components: {
    InfoBar,
    Card,
    MainCard,
    SubPage,
    HaveNotData,
  },
  props: {
    isActive: Boolean,
    activityType: Number,
  },
  created() {
    this.$forceUpdate();
  },
  beforeCreate() {
    console.log('进来了');
    this.$forceUpdate();
  },
  computed: {
    pageTitle: function pageTitle() {
      return '';
    },
  },
  data() {
    return {
      dataList: [],
      showCount: 3,
      currentPage: 1,
      totalResult: 1,
      loading: true,
    };
  },
  mounted() {
    this.showCount = 3;
    // 获取并填入活动信息
    this.getActivityInfo();
  },
  methods: {
    // 获取单页活动信息
    getActivityInfo() {
      this.dataList = [];
      getLowerLevelActivityInfo({
        showCount: this.showCount,
        currentPage: this.currentPage,
        type: this.activityType,
        request_from_page: 'lowerLevelActivityMainPage',
      }).then((res) => {
        this.dealResponse(res.data);
      });
    },
    contact() {
      console.log('concat 2');
      this.openInfoBox(
        '联系客服',
        this.$createElement('img', {
          attrs: { src: require('@/assets/image/assist.png') },
          style: 'width:100%; margin-bottom:-30px',
        }),
        { center: true },
      );
    },
    getIsActive(status) {
      return status === 'in_progress' || status === 'not_start';
    },
    // 点击页面按钮
    changePage(val) {
      // 显示加载图标
      this.loading = true;
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      this.getActivityInfo();
    },
    // 将活动信息填入数据，触发视图更新
    setActivityInfo(dataObj) {
      console.log(dataObj.scenario);
      if (dataObj.scenario === '0') {
        dataObj.scenarioKey = 'Wedding_plus';
      } else if (dataObj.scenario === '91') {
        dataObj.scenarioKey = 'ZSHL_plus';
      } else if (dataObj.scenario === '1') {
        dataObj.scenarioKey = 'Meeting_plus';
      } else if (dataObj.scenario === '2') {
        dataObj.scenarioKey = 'Birthday_plus';
      } else if (dataObj.scenario === '21') {
        dataObj.scenarioKey = 'BBY_plus';
      } else if (dataObj.scenario === '22') {
        dataObj.scenarioKey = 'SY_plus';
      } else if (dataObj.scenario === '23') {
        dataObj.scenarioKey = 'CRL_plus';
      } else if (dataObj.scenario === '24') {
        dataObj.scenarioKey = 'BLY_plus';
      } else if (dataObj.scenario === '25') {
        dataObj.scenarioKey = 'MMY_plus';
      } else if (dataObj.scenario === '26') {
        dataObj.scenarioKey = 'YSY_plus';
      } else if (dataObj.scenario === '41') {
        dataObj.scenarioKey = 'BYDL_plus';
      } else if (dataObj.scenario === '42') {
        dataObj.scenarioKey = 'XSY_plus';
      } else if (dataObj.scenario === '43') {
        dataObj.scenarioKey = 'JBTM_plus';
      } else if (dataObj.scenario === '51') {
        dataObj.scenarioKey = 'TXH_plus';
      } else if (dataObj.scenario === '52') {
        dataObj.scenarioKey = 'QQY_plus';
      } else if (dataObj.scenario === '53') {
        dataObj.scenarioKey = 'HX_plus';
      } else if (dataObj.scenario === '54') {
        dataObj.scenarioKey = 'DHY_plus';
      }
      let tmpCarrierType = '';
      if (dataObj.kind === '1') {
        tmpCarrierType = 'weixin';
      } else if (dataObj.kind === '2') {
        tmpCarrierType = 'dy';
      }
      this.dataList.push({
        id: dataObj.id,
        date: dataObj.using_date,
        title: dataObj.theme,
        address: dataObj.hotel_name,
        person: dataObj.person,
        chatNum: dataObj.chat_size,
        isActive: this.getIsActive(dataObj.wedding_status),
        status: dataObj.wedding_status,
        type: dataObj.scenarioKey,
        typeVal: dataObj.scenario,
        schedule: this.getSchedule(dataObj.wedding_schedule),
        carrierType: tmpCarrierType,
      });
      console.log('***dataList***');
      console.log(this.dataList);
    },
    getSchedule(schedule) {
      let tempResult = '';
      if (schedule === '1') {
        tempResult = 'lunch';
      } else if (schedule === '2') {
        tempResult = 'evening';
      }
      return tempResult;
    },
    // 处理结果
    dealResponse(response) {
      // 加载完成
      this.loading = false;
      // 填入活动信息
      response.liveList.forEach((item) => {
        this.setActivityInfo(item);
      });
      // 设置总条数
      this.totalResult = response.totalResult;
    },
    refresh() {
      this.getActivityInfo();
    },
    // 删除活动
    deleteActivity_axios(id, deleteName = undefined) {
      return this._asyncDeleteActivity(id, deleteName)
        .then(() => {
          // 弹出成功提示
          this.alertSuccess('删除成功');
          // 刷新页面
          this.$emit('refresh');
        })
        .catch((err) => {
          // 非取消造成的失败
          if (err.toString() !== 'Error: cancel') {
            this.alertError('删除失败');
          }
          console.log(`删除出错: ${err}`);
        });
    },
    /* eslint-disable */
    async _asyncDeleteActivity(id, deleteName) {
      let msg;
      if (typeof deleteName === 'undefined') {
        msg = '确认删除此活动？';
      } else {
        msg = `确认删除活动：${deleteName}？`;
      }
      // 删除活动确认框
      await this.confirmBox(msg, 'error');
      // 提交删除请求
      await request.post('/huoDongHm/shanChuHuoDong', {
        // liveid: id,
        splid: id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../../../assets/styles/activity';
.underwayActivity {
  .info-bar {
    margin-top: 17px;
    margin-left: 33px;
    margin-right: 33px;
    margin-bottom: 10px;
  }
}
.el-timeline-item {
  padding-right: 28px;
}
</style>
