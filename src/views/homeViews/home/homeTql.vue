<!--同庆楼首页-->
<template>
  <sub-page class="home">
    <home-header />

    <main-card>
      <card-top-info title="数据总览" class="cardTopInfo">
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="monthChange"
          v-model="date"
        >
        </el-date-picker>
      </card-top-info>
      <header-icons :exists="['applyNum', 'useNum', 'income', 'signNum']" :dataObj="dataObj" />
    </main-card>
    <main-card>
      <card-top-info title="收益明细">
        <div class="searchForm">
          <div class="searchFItem">
            <label>店名：</label>
            <el-select v-model="searchForm.hotel_name" placeholder="请选择" @change="handleHotelSelectChange" class="templateConfig">
              <el-option v-for="item in hotelList" :key="item.id" :label="item.label" :value="item.label"> </el-option>
            </el-select>
          </div>
          <div class="searchFItem">
            <label>宴会厅：</label>
            <el-select v-model="searchForm.emcee_name" placeholder="请选择" @change="handleEmceeNameSelectChange" class="templateConfig">
              <el-option v-for="item in emceeNameList" :key="item.id" :label="item.label" :value="item.label"> </el-option>
            </el-select>
          </div>
          <div class="searchFItem">
            <label>午宴/晚宴：</label>
            <el-select
              v-model="searchForm.wedding_schedule"
              placeholder="请选择"
              @change="handleScheduleSelectChange"
              class="templateConfig"
            >
              <el-option v-for="item in scheduleList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
            </el-select>
          </div>
          <div class="searchFItem">
            <el-button min-width="200" type="primary" @click="queryInfo">查询</el-button>
            <el-button min-width="200" @click="resetInfo">重置</el-button>
          </div>
        </div>
        <export-table :URL="downLoadURL"> </export-table>
      </card-top-info>
      <my-table>
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="130">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
              <span style="margin-left: 5px; width: 130px; display: inline-block; text-align: centr">{{ scope.row.emcee_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" />
          <el-table-column prop="theme" label="活动标题" header-align="center" align="center" />
          <el-table-column prop="hotel_name" label="店名" header-align="center" align="center" />
          <el-table-column prop="emcee_name_splid" label="宴会厅" header-align="center" align="center" />
          <el-table-column prop="using_date" label="活动时间(午宴/晚宴)" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.using_date }}
              <label class="schedule" :class="{ lunch: scope.row.wedding_schedule === '1', evening: scope.row.wedding_schedule === '2' }">{{
                scope.row.weddingSchedule
              }}</label>
            </template>
          </el-table-column>
          <el-table-column prop="banben" label="活动类型" header-align="center" align="center" min-width="50">
            <template slot-scope="scope">
              <label
                class="banben"
                :class="{
                  wedding: scope.row.sceneType === '0',
                  enterperise: scope.row.sceneType === '1',
                  birth: scope.row.sceneType === '2',
                  school: scope.row.sceneType === '4',
                  other: scope.row.sceneType === '5',
                }"
                >{{ scope.row.banben }}</label
              >
            </template>
          </el-table-column>
          <el-table-column prop="pcu" label="签到人数" header-align="center" align="center" min-width="50" />
          <el-table-column prop="total_income" label="总收益" header-align="center" align="center" min-width="50">
            <template slot-scope="scope">
              <label class="benifit">{{ scope.row.total_income }}</label>
            </template>
          </el-table-column>
          <el-table-column prop="total_income" label="绑定主持人" header-align="center" align="center" min-width="150">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.bind_headImg" v-if=" scope.row.is_bind==1"></el-avatar>
              <span style="margin-left: 5px; width: 130px; display: inline-block; text-align: center"  v-if="scope.row.is_bind==1">{{ scope.row.bind_nickname }}</span>
              <span style="margin-left: 5px; width: 130px; display: inline-block; text-align: center"  v-if="scope.row.is_bind!=1">{{ '未绑定' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalResult"
        :page-size="20"
        @current-change="changePage"
        class="my-pagination"
      >
      </el-pagination>
    </main-card>
  </sub-page>
</template>

<script>
// 首页头部信息
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import messageMixin from '@/mixins/messageMixin';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import ExportTable from '@/components/exportTable';
import MyTable from '@/components/myTable';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import { getIncomeDetail } from '@/api/cityPartner/citypartnerDetail';
import { getTemplateList } from '@/api/app/live';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';
import HomeHeader from './components/homeHeader';

export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'home',
  components: {
    CardTopInfo,
    MainCard,
    SubPage,
    HomeHeader,
    HeaderIcons,
    ExportTable,
    MyTable,
  },
  created() {
    // this.downLoadURL = `${BASEURL}/reportFormsHm/tqlDownloadData?splidStr=${this.multipleSelection}`;
    this.initData();
    this.getTemplateList();
  },
  data() {
    return {
      date: '',
      dataObj: {
        applyNum: 0,
        useNum: 0,
        income: 0,
        signNum: 0,
      },
      downLoadURL: '#',
      tableData: [],
      // 总页数
      totalResult: 0,
      emceeNameList: [],
      hotelList: [],
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
      searchForm: {
        currentPage: 1,
        showCount: 20,
        hotel_name: '',
        emcee_name: '',
        wedding_schedule: '',
        start_date: '',
        end_date: '',
      },
      // mapInfo: null,
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(e) {
      console.log(e);
      if (e.length > 0) {
        this.multipleSelection = e.map((item) => item.id).join(',');
        this.downLoadURL = `${BASEURL}/reportFormsHm/tqlDownloadData?splidStr=${this.multipleSelection}`;
      } else {
        this.multipleSelection = [];
        this.downLoadURL = '#';
      }
      console.log(this.multipleSelection);
    },
    changePage(val) {
      this.searchForm.currentPage = val;
      this.initData();
    },
    monthChange(val) {
      console.log(val);
      if (val) {
        const startFormat = formatDate(new Date(val[0]), 'yyyy-MM-dd');
        const endFormat = formatDate(new Date(val[1]), 'yyyy-MM-dd');
        this.searchForm.start_date = startFormat;
        this.searchForm.end_date = endFormat;
        this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?USER_ID=${this.$store.state.login.userInfo.id}&report_type=lower_level_info&start_date=${startFormat}&end_date=${endFormat}`;
        console.log(this.downLoadURL);
        this.initData();
      }
    },
    initData() {
      getIncomeDetail(this.searchForm).then((res) => {
        console.log(res);
        this.tableData = res.data.list.map((item) => {
          let tempSchedule;
          if (item.wedding_schedule === '1') {
            tempSchedule = '(午宴)';
          } else if (item.wedding_schedule === '2') {
            tempSchedule = '(晚宴)';
          } else {
            tempSchedule = '';
          }
          return {
            ...item,
            weddingSchedule: tempSchedule,
            sceneType: item.scenario.slice(0, 1),
          };
        });
        this.totalResult = res.data.totalResult;
        this.dataObj.income = res.data.tqlInfo.total_income;
        this.dataObj.signNum = res.data.tqlInfo.total_pcu;
        this.dataObj.applyNum = res.data.tqlInfo.size;
        this.dataObj.useNum = res.data.tqlInfo.effective_size;
      });
    },
    handleHotelSelectChange(e) {
      this.searchForm.hotel_name = e;
      this.generateEmceeNameListByHotel(this.searchForm.hotel_name);
    },
    generateEmceeNameListByHotel(e) {
      // if (!this.mapInfo) {
      //   return;
      // }
      // const hotelList = Object.keys(this.mapInfo);
      // const hotelInfo = hotelList.find((item) => item === e);
      // this.emceeNameList = this.mapInfo[hotelInfo].split(',').map((item, index) => ({
      //   id: index,
      //   label: item,
      // }));
      // console.log(hotelList);
      // console.log(hotelInfo);
      // console.log(this.mapInfo[hotelInfo]);
      if (this.hotelList.length === 0) {
        return;
      }
      const hotelInfo = this.hotelList.find((item) => item.label === e);
      this.emceeNameList = hotelInfo.hallName.split(',').map((item, index) => ({
        id: index,
        label: item,
      }));
    },
    handleEmceeNameSelectChange(e) {
      this.searchForm.emcee_name = e;
    },
    handleScheduleSelectChange(e) {
      this.searchForm.wedding_schedule = e;
    },
    getTemplateList() {
      getTemplateList({
        showCount: 10,
        currentPage: 1,
      })
        .then((res) => {
          console.log(res);
          if (!res.data.tqlInfoMap5) {
            return;
          }
          const tmpTqlInfoObj = JSON.parse(res.data.tqlInfoMap5);
          this.hotelList = tmpTqlInfoObj.list.map((item) => ({
            id: item.storeId,
            label: item.storeName,
            hallName: item.hallName,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    queryInfo() {
      this.initData();
    },
    resetInfo() {
      this.searchForm.currentPage = 1;
      this.searchForm.showCount = 20;
      this.searchForm.hotel_name = '';
      this.searchForm.emcee_name = '';
      this.searchForm.wedding_schedule = '';
      this.searchForm.start_date = '';
      this.searchForm.end_date = '';
      this.date = '';
      this.initData();
    },
  },
  mounted() {},
};
</script>

<style lang='less' scoped>
.home {
  .cardTopInfo::v-deep {
    .el-range-editor {
      &.el-input__inner {
        margin-right: 32px;
      }
    }
  }
  .schedule {
    &.lunch {
      color: #ebbc6b;
    }
    &.evening {
      color: #470886;
    }
  }
  .banben {
    &.wedding {
      color: #ff0148;
    }
    &.enterperise {
      color: #008dff;
    }
    &.birth {
      color: #ffb335;
    }
    &.school {
      color: #2dc8c8;
    }
    &.other {
      color: #55cf87;
    }
  }
  .benifit {
    color: #eb133c;
  }
  .searchForm {
    display: flex;
    align-items: center;
    .searchFItem {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
  }
}
</style>
