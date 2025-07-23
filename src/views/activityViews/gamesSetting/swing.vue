<!--摇一摇-->
<template>
  <sub-page>
    <div class="swing-setting-container">
      <main-card>
        <card-top-info title="摇一摇设置"></card-top-info>
        <div class="setting-box">
          <div class="game-time">
            <div>
              <span style="margin-right: 20px">游戏时间:</span>
              <!-- <set-time-btn :changeSize="10" @timeBtnClick="timeBtnChange" :initTime="swingTime" unit="s"></set-time-btn> -->
              <el-input-number v-model="swingTime" controls-position="right" :min="5" :max="120"></el-input-number>
              <span style="margin-left: 15px">秒</span>
            </div>
            <div class="setting-tip">
              <span class="tip1">摇一摇属于体力活，建议控制在60s以内</span>
            </div>
          </div>
          <div class="game-person">
            <div>
              <span style="margin-right: 20px">领奖人数:</span>
              <!-- <set-person-btn :changeSize="1" @personBtnClick="personBtnChange" :initPerson="swingPerson"></set-person-btn> -->
              <el-input-number v-model="swingPerson" controls-position="right" :min="1" :max="10"></el-input-number>
              <span style="margin-left: 15px">人</span>
            </div>
            <div class="setting-tip">
              <span class="tip2">每轮游戏领奖人数可设置1-10人</span>
            </div>
          </div>
          <div class="submit-btn">
            <el-button type="primary" @click="submitSetting(swingTime, swingPerson)">提交</el-button>
          </div>
        </div>
      </main-card>
    </div>

    <div>
      <miniGameAward kind="2" />
    </div>
    <div class="swing-user-info-container">
      <main-card>
        <card-top-info title="摇一摇明细"></card-top-info>
        <div class="type-choose">
          <span>摇一摇类型：</span>
          <el-select v-model="gameType" @change="onShakeTypeChange" class="type-select">
            <el-option v-for="item in shakeTypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </div>
        <change-sort :totleSort="totleSort" @sortClick="getClickSort"></change-sort>
        <div class="swing-score-list-container">
          <my-table style="height: auto">
            <el-table
              :data="scoreList"
              highlight-current-row
              style="width: 100%"
              header-row-class-name="table-header"
              :cell-style="cellStyle"
            >
              <el-table-column type="index" width="120" align="center" header-align="center" label="编号"></el-table-column>
              <el-table-column min-width="120" label="姓名" align="center" header-align="center">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="22" height="22" style="border-radius: 50%" :src="scope.row.userInfo.avator" v-if="scope.row.userInfo" />
                    <span v-if="scope.row.userInfo">{{ scope.row.userInfo.wx_name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label="分数" prop="gscore" align="center" header-align="center"></el-table-column>
              <el-table-column min-width="100" label="到账时间" align="center" header-align="center">
                <template slot-scope="scope">
                  {{ new Date(scope.row.create_time) | dateFormat }}
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
        <export-table :URL="downLoadURL"></export-table>
      </main-card>
    </div>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import ChangeSort from '@/views/activityViews/gamesSetting/commonCpn/changeSort';
import ExportTable from '@/components/exportTable';
import { getSwingData, getSwingInfoList, setSwingData } from '@/api/setting/activitySetting/gameSetting';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';
import miniGameAward from './TQL/miniGameAward/index';

const SHAKETYPES = [
  {
    id: 'hmPlay6',
    label: '其他摇一摇',
  },
  {
    id: 'hmPlay8',
    label: '谁最牛',
  },
  {
    id: 'hmPlay12',
    label: '赛龙舟',
  },
  {
    id: 'hmPlay27',
    label: '飞龙在天',
  },
];

export default {
  name: 'swing',
  data() {
    return {
      // 前后按钮是否高亮状态
      isLastBtnHightlight: false,
      isNextBtnHightlight: true,
      // 摇一摇游戏时间
      swingTime: 0,
      // 摇一摇领奖人数
      swingPerson: 0,
      // 总轮数
      totleSort: 0,
      // 当前轮数
      currentSort: 1,
      // 分数列表
      scoreList: [],
      // 游戏类型
      gameType: SHAKETYPES[0].id,
      shakeTypes: SHAKETYPES,
    };
  },
  computed: {
    downLoadURL() {
      return `${BASEURL}/reportFormsHm/findReportInfo?splid=${this.$store.state.liveId}&report_type=game_score_in_report&gtype=${this.gameType}&order_by=${this.currentSort}`;
    },
  },
  created() {
    // 请求摇一摇初始化数据
    this.requestInitData();
    // 请求摇一摇用户分数列表
    this.requestScoreListData(this.currentSort, this.gameType);
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    ExportTable,
    miniGameAward,
    ChangeSort,
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    },
  },
  methods: {
    /* 导出报表 */
    exportTable() {},
    /* 获取changeTab组件中传来的轮数值 */
    getClickSort(index) {
      console.log('父组件种', index);
      this.currentSort = index;
      this.requestScoreListData(this.currentSort, this.gameType);
    },
    /* last按钮点击事件 */
    lastBtnClick() {
      console.log('last click');
      this.isLastBtnHightlight = true;
      this.isNextBtnHightlight = !this.isLastBtnHightlight;
    },
    /* next按钮点击事件 */
    nextBtnClick() {
      console.log('next click');
      this.isNextBtnHightlight = true;
      this.isLastBtnHightlight = !this.isNextBtnHightlight;
    },
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tColor = '';
      if (columnIndex === 2) {
        tColor = 'color:#ff6260';
      }
      return tColor;
    },
    /* 请求摇一摇初始化数据 */
    requestInitData() {
      const params = { splid: this.$store.state.liveId };
      getSwingData({ params }).then((res) => {
        if (res.code === 200) {
          console.log('摇一摇初始数据', res.data);

          // this.swingTime = res.data.pd.cash_time_limit;
          // this.swingPerson = res.data.pd.cash_pnum;
          this.swingTime = res.data.pd.shake_time_limit;
          this.swingPerson = res.data.pd.shake_award_num;
        } else {
          console.error('初始化数据获取失败');
        }
      });
    },
    /* 请求摇一摇用户分数列表 */
    requestScoreListData(currentSort, gameType) {
      const data = {
        // liveId: this.$store.state.liveId,
        // gameCode: gameType,
        // currentPage: 1,
        // showCount: '500',
        // sort: currentSort,
        splid: this.$store.state.liveId,
        gtype: gameType,
        currentPage: 1,
        showCount: '500',
        order_by: currentSort,
      };
      getSwingInfoList(data).then((res) => {
        if (res.code === 200) {
          console.log('摇一摇分数列表', res);
          this.totleSort = res.data.maxSort;
          this.scoreList = res.data.scoreList;
        } else {
          console.error('分数列表获取失败');
        }
      });
    },
    /* 时间设置按钮改变 */
    timeBtnChange(timeItem) {
      this.swingTime = timeItem;
    },
    /* 领奖人数设置按钮改变 */
    personBtnChange(personItem) {
      this.swingPerson = personItem;
    },
    /* 提交设置按钮提交设置数据 */
    submitSetting(swingTime, swingPerson) {
      const data = {
        // liveid: this.$store.state.liveId,
        // rock_award_count: swingPerson,
        // rock_time: swingTime,
        splid: this.$store.state.liveId,
        shake_award_num: swingPerson,
        shake_time_limit: swingTime,
      };
      setSwingData(data).then((res) => {
        if (res.code === 200) {
          console.log('提交设置数据', res);
          this.$message.success('摇一摇设置成功');
          console.log(res.msg);
        } else {
          this.$message.error('摇一摇设置失败');
          console.error('提交设置数据失败');
        }
      });
    },
    onShakeTypeChange() {
      console.log(this.gameType);
      this.requestScoreListData(this.currentSort, this.gameType);
    },
  },
};
</script>

<style lang="less" scoped>
.swing-setting-container {
  .setting-box {
    display: flex;
    justify-content: space-around;

    & > div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .setting-tip {
    height: 50px;
    line-height: 50px;

    .tip1 {
      font-size: 11px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff5454;
    }

    .tip2 {
      font-size: 11px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff5454;
    }
  }
}

.lastNext-btn-group {
  display: flex;
  justify-content: center;
  margin-right: 25px;

  /* 前后切换按钮触发时的样式 */
  .heigh-light-btn {
    background: #1e87f0 !important;
    opacity: 1 !important;
  }

  .last,
  .next {
    color: #ffffff;
    width: 26px;
    height: 26px;
    border-radius: 4px 0px 0px 4px;
    margin-left: 10px;
    font-size: 15px;
    text-align: center;
    line-height: 26px;
    cursor: pointer;
    background: #000000;
    opacity: 0.27;
  }

  .next {
    border-radius: 0px 4px 4px 0px;
  }
}

.swing-score-list-container {
  .upload-img {
    display: flex;
    align-items: center;
    margin-left: 30%;

    span {
      margin-left: 15px;
    }
  }
}

.type-choose {
  padding-left: 20px;
  span {
    color: #666;
  }
}
</style>
