<template>
  <sub-page class="home">
    <!-- <home-header /> -->

    <main-card class="main">
      <card-top-info title="近期互动">
        <router-link to="myActivity/create">
          <div class="createActivity">
            <img src="@/assets/image/icon/add-blue.png" alt="" />
            <span>创建互动</span>
          </div>
        </router-link>
      </card-top-info>

      <!-- 近期互动 -->
      <el-timeline class="activity-timeLine" v-loading="loading" ref="main">
        <have-not-activity v-show="dataList.length === 0 && !loading" style="height: auto"></have-not-activity>
        <el-timeline-item placement="top" v-for="(item, index) in dataList" :timestamp="item.date" :key="index">
          <!-- 卡片 -->
          <activity-card
            :activity-data="item"
            :labelData="{ type: item.type, sstate: item.sstate, schedule: item.schedule, carrierType: item.carrierType }"
            @refresh="refresh"
          />
        </el-timeline-item>
      </el-timeline>

      <!-- 分页器 -->
      <el-pagination
        background
        :hide-on-single-page="true"
        layout="  prev, pager, next"
        @current-change="changePage"
        :page-size="showCount"
        :total="totalResult"
        class="my-pagination"
      />

      <!-- 首次设置高级模式密码 -->
    </main-card>
  </sub-page>
</template>

<script>
// 首页头部信息
import SubPage from '@/components/subPage';
import HaveNotActivity from '@/layout/home/components/haveNotActivity';
import MainCard from '@/components/mainCard';

import { getRecentActivityInfo } from '@/api/app/live';
import CardTopInfo from '@/components/cardTopInfo';
import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import ActivityCard from '@/layout/home/components/activityCard/activityCompanyCard';
import request from '@/utils/request';
// import HomeHeader from './components/homeHeader';

export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'cHome',
  components: {
    HaveNotActivity,
    CardTopInfo,
    MainCard,
    ActivityCard,
    SubPage,
    // HomeHeader,
  },
  created() {},
  data() {
    return {
      dataList: [],
      showCount: 3,
      currentPage: 1,
      totalResult: 1,
      loading: true,
    };
  },
  methods: {
    getIsActive(sstate) {
      return sstate === 'in_progress' || sstate === 'not_start';
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
      }
      this.dataList.push({
        id: dataObj.id,
        date: dataObj.using_date,
        title: dataObj.theme,
        address: dataObj.hotel_name,
        person: dataObj.person,
        chatNum: dataObj.chat_size,
        isActive: this.getIsActive(dataObj.wedding_status),
        sstate: dataObj.wedding_status,
        type: dataObj.scenarioKey,
        typeVal: dataObj.scenario,
        schedule: this.getSchedule(dataObj.wedding_schedule),
        youke_size: dataObj.youke_size,
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
    // 获取单页活动信息
    getActivityInfo() {
      this.dataList = [];
      getRecentActivityInfo({
        showCount: this.showCount,
        currentPage: this.currentPage,
      }).then((res) => {
        this.dealResponse(res.data);
      });
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
  mounted() {
    // 存放 timeline 的高度为 offSetHeight 减去其 padding-top
    // 注意：不能将底部分页组件的 hide-on-single-page 设置为 true
    // const height = this.$refs.main.$el.offsetHeight - 10;
    // console.log(this.$refs.main.$el.offsetHeight)

    // console.log(height)
    this.showCount = 3;
    // 获取并填入活动信息
    this.getActivityInfo();
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/styles/activity';
@headerHeight: 112px;
.home {
  .main {
    margin: auto;
    margin-top: 19px;
    flex: 1 1 auto;

    &.card {
      margin-bottom: 10px;
    }
    .card-top-info {
      .createActivity {
        height: 37px;
        margin-right: @activityMarginRight;
        .vCenter();
        img {
          width: 36px;
          height: 36px;
        }
        span {
          margin-left: 10px;
          font-size: 16px;
          font-weight: 500;
          color: #1e87f0;
        }
      }
    }
  }
  .content {
    padding: 0 21px;
  }
}
</style>
