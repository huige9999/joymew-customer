<!--游客模式首页-->
<template>
  <sub-page class="home">
    <home-header />
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
        <el-timeline-item
          placement="top"
          v-for="(item, index) in dataList"
          :timestamp="item.date"
          :key="index"
          :labelData="{ type: item.type, sstate: item.sstate, schedule: item.schedule, carrierType: item.carrierType }"
        >
          <!-- 卡片 -->
          <activity-card :activity-data="item" @refresh="refresh" />
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
    </main-card>
    <el-dialog title="人数调整" width="786px" :visible.sync="editDialogShow">
      <el-form ref="form" :model="editForm" label-width="120px" class="editForm">
        <el-form-item label="购买人数：">
          <div class="sliderWrap">
            <el-slider v-model="editForm.peoplePurchase" show-input :min="20" :max="2000"></el-slider>
            <div class="purchaseTip">
              超过2000人，请与
              <label>客服联系</label>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="当前人数：">
          {{ editForm.peopleCurrent }}
        </el-form-item>
        <el-form-item label="订单合计：">
          {{ editForm.priceTotal }}
        </el-form-item>
        <el-form-item label="实付款：">
          <div class="actualPay">{{ editForm.priceLast }}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 118px">确认支付</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="goodNewsPopup" v-if="goodNewsDialogShow">
      <div class="shade"></div>
      <div class="ct">
        <img src="@/assets/image/goodNewsTourist.png" class="goodNewsImg" />
        <div class="btnGroup">
          <div class="bindBtn">绑定账号</div>
          <div class="bindBtn">暂不绑定</div>
        </div>
      </div>
    </div>
  </sub-page>
</template>

<script>
// 首页头部信息
import SubPage from '@/components/subPage';
import HaveNotActivity from '@/layout/home/components/haveNotActivity';
import { getRecentActivityInfo } from '@/api/app/live';
import request from '@/utils/request';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import ActivityCard from '@/layout/home/components/activityCard/activityCard1Tourist';
import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import HomeHeader from './components/homeHeaderTourist';

export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'home',
  components: {
    SubPage,
    HomeHeader,
    HaveNotActivity,
    CardTopInfo,
    MainCard,
    ActivityCard,
  },
  created() {},
  data() {
    return {
      dataList: [],
      showCount: 3,
      currentPage: 1,
      totalResult: 1,
      loading: true,
      editDialogShow: false,
      goodNewsDialogShow: false,
      editForm: {
        peoplePurchase: 20,
        peopleCurrent: 20,
        priceTotal: 100,
        priceLast: 100,
      },
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
  .editForm::v-deep {
    .purchaseTip {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      label {
        color: #ff4646;
      }
    }
    .actualPay {
      font-size: 20px;
      font-weight: 500;
      color: #ff4646;
    }
    .el-form-item__label {
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
    }
    .el-form-item__content {
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .goodNewsPopup {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    .shade {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .ct {
      width: 714px;
      position: absolute;
      .goodNewsImg {
        width: 714px;
        height: 529px;
      }
      .btnGroup {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        .bindBtn {
          width: 138px;
          height: 44px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:nth-child(1) {
            background: #fb7b58;
          }
          &:nth-child(2) {
            background-color: #249aff;
            margin-left: 103px;
          }
        }
      }
    }
    // .goodNewsImg {
    //   width: 714px;
    //   height: 529px;
    //   position: absolute;
    //   top:
    // }
  }
}
</style>
