<template>
  <sub-page class="areaProxy">
    <content-header>
      <header-icons
        :exists="['areaProxyArea', 'areaProxyCode', 'areaProxyPeople', 'areaProxyMoney']"
        :data-obj="{ areaProxyArea, areaProxyCode, areaProxyPeople, areaProxyMoney }"
        padding="18px 0px 40px 0px"
      />
    </content-header>
    <main-card>
      <card-top-info title="区域人员"> </card-top-info>
      <div class="areaProxyBaseInfo">
        <div class="name">代理人: {{ proxyAreaUserName }}</div>
        <div class="phone">电话: {{ proxyAreaUserPhone }}</div>
      </div>
      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" style="width: 100%" row-key="id" border v-loading="loadingOut">
          <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
              <span style="margin-left: 10px; display: inline-block; text-align: centr">{{ scope.row.emcee_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 100px; display: inline-block; text-align: centr">{{ scope.row.phonenumber }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spltotal" header-align="center" align="center" label="申请场次" min-width="50">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.spltotal }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="splactual" header-align="center" align="center" label="完成场次" min-width="50">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.splactual }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_income" header-align="center" align="center" label="总收益" min-width="50">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.total_income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" header-align="center" align="center" label="注册时间">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 100px; display: inline-block; text-align: centr">{{
                new Date(scope.row.create_time) | dateFormat
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_lastlogin" header-align="center" align="center" label="最后登录" min-width="70">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 100px; display: inline-block; text-align: centr">
                {{ new Date(scope.row.format_time_lastlogin) | dateFormat }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="center" header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getInfo(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="outShowCount"
        :total="outTotalResult"
        @current-change="outChangePage"
        :hide-on-single-page="true"
        class="my-pagination"
      />
      <!-- 点击查看明细弹框 -->
      <el-dialog :visible.sync="dialogTableVisible" width="85%" style="margin-left: 14%">
        <div class="abow_dialog">
          <my-table class="myInfo">
            <el-table :data="getInfoList" header-row-class-name="table-header" style="width: 100%" height="70vh" v-loading="loading">
              <el-table-column prop="emcee_name" label="姓名" align="center" min-width="100"> </el-table-column>
              <el-table-column prop="theme" label="活动名称 " align="center" min-width="120"> </el-table-column>
              <el-table-column prop="using_date" label="活动时间" align="center" min-width="100">
                <template slot-scope="scope">
                  {{ new Date(scope.row.using_date) | dateFormat }}
                </template>
              </el-table-column>
              <el-table-column prop="hotel_name" label="活动地点" align="center"> </el-table-column>

              <el-table-column prop="scenario" label="活动类型" align="center">
                <template slot-scope="scope">
                  <span>{{ getInforType(scope.row.scenario) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pcu" align="center">
                <template slot="header">
                  <span>签到人数</span>
                </template>
              </el-table-column>
              <el-table-column prop="gift_income" align="center" min-width="100">
                <template slot="header">
                  <span style="font-size: 12px">礼物收益</span>
                  <el-tooltip class="item" effect="dark" content="您所邀请用户的的礼物收益" placement="right">
                    <i class="el-icon-question" style="color: #249aff"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="earning_gkdhb" align="center" min-width="100">
                <template slot="header">
                  <span>红包收益</span>
                  <el-tooltip class="item" effect="dark" content="您所邀请用户的的红包收益" placement="right">
                    <i class="el-icon-question" style="color: #249aff"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="earning_gwheel" align="center" min-width="100">
                <template slot="header">
                  <span>扭一扭收益</span>
                  <el-tooltip class="item" effect="dark" content="您所邀请用户的的扭一扭收益" placement="right">
                    <i class="el-icon-question" style="color: #249aff"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="earning_gegg" align="center" min-width="100">
                <template slot="header">
                  <span>开宝箱收益</span>
                  <el-tooltip class="item" effect="dark" content="您所邀请用户的的开宝箱收益" placement="right">
                    <i class="el-icon-question" style="color: #249aff"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="live_all_income" align="center">
                <template slot="header">
                  <span>总收益</span>
                  <el-tooltip class="item" effect="dark" content="您所邀请用户的总收益" placement="right">
                    <i class="el-icon-question" style="color: #249aff"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="getInfoTotalshowCount"
          :total="getInfoTotalResult"
          :hide-on-single-page="true"
          class="my-pagination"
          @current-change="changePage1"
        />
      </el-dialog>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import { formatDate } from '@/utils/format';
import { getHhrInfoArea1, getHhrInfoArea2 } from '@/api/cityPartner/citypartnerDetail';
import request from '@/utils/request';

export default {
  mixins: [messageBoxMixin],
  name: 'subPerson',
  components: {
    MyTable,
    CardTopInfo,
    MainCard,
    SubPage,
    ContentHeader,
    HeaderIcons,
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd');
    },
  },
  computed: {
    getInforType() {
      return (type) => {
        console.log(type);
        if (type.length > 1) {
          type = String(type).substr(0, 1);
        }
        let tmpSceneVal;
        if (type === 0 || type === '0') {
          tmpSceneVal = '婚礼版';
        }
        if (type === 1 || type === '1') {
          tmpSceneVal = '年会版';
        }
        if (type === 2 || type === '2') {
          tmpSceneVal = '生日版';
        }
        return tmpSceneVal;
      };
    },
  },
  methods: {
    getInfo(obj) {
      console.log(obj);
      this.invitee_id = obj.id;
      this.getDialogTableData();
      this.dialogTableVisible = true;
    },
    getDialogTableData() {
      this.loading = true;
      const Obj = {
        invitee_id: this.invitee_id,
        currentPage: this.getInfoTotalCurrentPage,
        showCount: this.getInfoTotalshowCount,
      };
      request.post('/yaoQing/seeLiveInfo', Obj).then((res) => {
        console.log('查看明细，个人信息', res);
        console.log('姓名', res.data.liveList);
        this.getInfoList = res.data.liveList;
        this.getInfoTotalResult = res.data.totalResult;
        this.loading = false;
      });
    },
    changePage1(val) {
      // 改变当前页
      this.getInfoTotalCurrentPage = val;
      console.log(this.getInfoTotalCurrentPage);
      // 请求数据
      this.getDialogTableData();
    },
    outChangePage(val) {
      // 改变当前页
      this.outCurrentPage = val;
      this.initTableData();
    },

    formatData(res) {
      return res.varList;
    },
    initBaseInfo() {
      getHhrInfoArea1()
        .then((res) => {
          console.log(res);
          this.areaProxyArea = res.data.area_val;
          this.areaProxyCode = res.data.hhrAreaInfo.area_code;
          this.areaProxyPeople = res.data.person_size;
          this.areaProxyMoney = res.data.hhrAreaInfo.flow_money;
          this.proxyAreaUserName = res.data.userInfo.emcee_name;
          this.proxyAreaUserPhone = res.data.userInfo.phonenumber;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initTableData() {
      this.loadingOut = true;
      getHhrInfoArea2({
        showCount: this.outShowCount,
        currentPage: this.outCurrentPage,
      }).then((res) => {
        console.log(res);
        this.outTotalResult = res.data.totalResult;
        this.tableData = res.data.list;
        this.loadingOut = false;
      });
    },
  },
  data() {
    return {
      getInfoList: [],
      dialogTableVisible: false,
      getInfoTotalResult: 1,
      getInfoTotalshowCount: 10,
      getInfoTotalCurrentPage: 1,

      tableData: [],
      outShowCount: 10,
      outTotalResult: 1,
      outCurrentPage: 1,
      areaProxyArea: '', // 区域
      areaProxyCode: '', // 区域码
      areaProxyPeople: 0, // 区域人数
      areaProxyMoney: 0, // 区域流水
      proxyAreaUserName: '',
      proxyAreaUserPhone: '',
      invitee_id: '',

      loading: false,
      loadingOut: false,
    };
  },

  created() {
    this.initBaseInfo();
    this.initTableData();
  },
};
</script>

<style lang="less" scoped>
.areaProxy {
  .areaProxyBaseInfo {
    display: flex;
    margin-left: 40px;
    color: #606266;
    font-size: 16px;
    .phone {
      margin-left: 40px;
    }
  }
}
</style>
