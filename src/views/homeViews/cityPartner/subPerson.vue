<template>
  <sub-page class="introduction">
    <content-header>
      <div class="h-top">
        <div class="sub-hm">
          嗨喵合伙人:
        </div>
        <div class="sub-person">
          <div class="sub-name">
            尊敬的
            <div class="name">{{ name }}</div>
            老师:
          </div>
          <div class="sub-degree">
            您的级别是
            <div class="degree">{{ degree }}</div>
          </div>
        </div>
      </div>
    </content-header>
    <div class="group-box">
      <div class="group">
        <div class="top">
          <div class="group-name">
            <img src="@/assets/image/icon/primaryIcon.png" alt="" />
            <span>一级团队</span>
          </div>
          <div class="sum">{{ info1TotalSize }}<span calss="unit">人</span></div>
        </div>
        <div class="form-data">
          <div class="form-item">
            <div class="label">已激活:</div>
            <div class="count" style="margin-right: 100px ;color:#3BCACD">
              {{ info1jhSize }} <span calss="unit" style="color:#333333">人</span>
            </div>
          </div>
          <div class="form-item">
            <div class="label">礼物总收益:</div>
            <div class="count" style="color:#3BCACD">{{ info1allGiftIncome }} <span calss="unit" style="color:#333333">元</span></div>
          </div>
          <div class="form-item">
            <div class="label">总场次:</div>
            <div class="count" style="margin-right: 100px;color:#3BCACD">
              {{ info1IncomeSize }} <span calss="unit" style="color:#333333">场</span>
            </div>
          </div>
          <div class="form-item">
            <div class="label">我的收益:</div>
            <div class="count" style="color:#FB466C">{{ info1GiftIncome }} <span calss="unit" style="color:#333333">元</span></div>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="top">
          <div class="group-name">
            <img src="@/assets/image/icon/secondaryIcon.png" alt="" />
            <span>二级团队</span>
          </div>
          <div class="sum">{{ info2TotalSize }}<span calss="unit">人</span></div>
        </div>
        <div class="form-data">
          <div class="form-item">
            <div class="label">已激活:</div>
            <div class="count" style="margin-right: 100px ;color:#3BCACD">
              {{ info2jhSize }} <span calss="unit" style="color:#333333">人</span>
            </div>
          </div>
          <div class="form-item">
            <div class="label">礼物总收益:</div>
            <div class="count" style="color:#3BCACD">{{ info2allGiftIncome }} <span calss="unit" style="color:#333333">元</span></div>
          </div>
          <div class="form-item">
            <div class="label">总场次:</div>
            <div class="count" style="margin-right: 100px;color:#3BCACD">
              {{ info2IncomeSize }} <span calss="unit" style="color:#333333">场</span>
            </div>
          </div>
          <div class="form-item">
            <div class="label">我的收益:</div>
            <div class="count" style="color:#FB466C">{{ info2GiftIncome }} <span calss="unit" style="color:#333333">元</span></div>
          </div>
        </div>
      </div>
    </div>
    <main-card>
      <!-- <div class="example blue-background">样例</div> -->
      <card-top-info title="人员列表">
        <!-- <span class="blue-text" style="margin-right: 18px"
          >成为合伙<span calss="unit">人</span>，每个月完成固定场次，享受1-2级团队收益8%的合伙<span calss="unit">人</span>奖励</span
        > -->
      </card-top-info>
      <my-table class="my-table" style="height: 100%">
        <el-table
          :data="tableData"
          header-row-class-name="table-header"
          style="width: 100%"
          row-key="id"
          lazy
          border
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="avator" label="头像" header-align="center" align="center" min-width="50">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.emcee_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 100px; display: inline-block; text-align: centr">{{ scope.row.phonenumber }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spltotal" header-align="center" align="center" label="申请场次">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.spltotal }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="splactual" header-align="center" align="center" label="完成场次" min-width="50">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.splactual }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="shares" header-align="center" align="center" label="持股数"> </el-table-column> -->
          <el-table-column prop="total_income" header-align="center" align="center" label="总收益">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.total_income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_lastlogin" header-align="center" align="center" label="最后登陆" min-width="70">
            <template slot-scope="scope">
              <span style="margin-left: 5px; width: 100px; display: inline-block; text-align: centr">{{
                new Date(scope.row.format_time_lastlogin) | dateFormat
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="center" header-align="center" align="center" label="查看场次">
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
      <!-- <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button> -->
      <!-- 点击查看明细弹框 -->
      <el-dialog :visible.sync="dialogTableVisible" width="85%" style="margin-left: 14%">
        <div class="abow_dialog">
          <my-table class="myInfo">
            <el-table :data="getInfoList" header-row-class-name="table-header" style="width: 100%" height="70vh" v-loading="tableLoading">
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
import ContentHeader from '@/layout/home/components/header/contentHeader';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import { getHhrInfo1, getHhrInfo2 } from '@/api/cityPartner/citypartnerDetail';
import request from '@/utils/request';
// import { getMyInviteList, getMiniWPERCode } from '@/api/app/invite';
// import HeaderIcons from '@/layout/home/components/header/headerIcons';
import { formatDate } from '@/utils/format';
// import { helpMeGetFans } from '@/api/app/user';
// import messageMixin from '@/mixins/messageBoxMixin';
import { mapState } from 'vuex';
// const inviteUrlR = 'https://www.hudongmiao.com/#/phoneRegister?inviteCode=';

export default {
  mixins: [messageBoxMixin],
  name: 'subPerson',
  components: {
    MyTable, CardTopInfo, MainCard, ContentHeader, SubPage,
  },

  computed: {
    ...mapState({
      // hhr_type: (state) => state.login.userInfo.hhr_type,
      userInfo: (state) => state.login.userInfo,
    }),
    name() {
      return this.userInfo.emcee_name;
    },
    degree() {
      const hhrType = this.userInfo.hhr_type;
      const hhrTypeName = {
        0: '普通用户',
        1: '普通合伙人',
        2: '高级合伙人',
      };
      return hhrTypeName[hhrType];
    },
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

    //     name: '甘地',
    // degree: '圣雄',
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd');
    },
  },
  methods: {
    getFirstPeople() {
      getHhrInfo2({
        parmas: '',
        showCount: this.outShowCount,
        currentPage: this.outCurrentPage,
      }).then((res) => {
        this.outTotalResult = res.data.totalResult;
        console.log(res);
        this.tableData = res.data.list;
        // this.tableData[0].hasChildren = true
        this.tableData.forEach((element) => {
          if (element.invite_pcount && element.invite_pcount > 0) {
            element.hasChildren = true;
          }
        });
        console.log(this.tableData);
      });
    },
    load(tree, treeNode, resolve) {
      const { id: inviter_emid } = tree;
      console.log(inviter_emid);
      getHhrInfo2({
        inviter_emid,
        showCount: '1000',
        currentPage: '1',
      }).then((res) => {
        console.log(res);
        const { list } = res.data;
        resolve(list || []);
        console.log(this.tableData);
      });
    },
    getInfo(obj) {
      console.log(obj);
      this.invitee_id = obj.id;
      this.getDialogTableData();
      this.dialogTableVisible = true;
    },
    getDialogTableData() {
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
      });
      console.log('****000****', this.getInfoList.scenario);
    },
    changePage1(val) {
      // 显示加载图标
      this.loading = true;
      // 改变当前页
      this.getInfoTotalCurrentPage = val;
      console.log(this.getInfoTotalCurrentPage);
      // 请求数据
      this.getDialogTableData();
    },
    outChangePage(val) {
      // 显示加载图标
      this.outLoading = true;
      // 改变当前页
      this.outCurrentPage = val;
      // 请求数据
      // this.getMyInviteList();
      this.getFirstPeople();
    },

    formatData(res) {
      return res.varList;
    },
  },
  data() {
    return {
      incomeSort: [
        { value1: '0', label: '请选择' },
        {
          value1: '1',
          label: '金额从小到大排序',
        },
        {
          value1: '2',
          label: '金额从大到小排序',
        },
      ],
      enrollTime: [
        { value2: '0', label: '请选择' },
        { value2: '1', label: '注册时间正排序' },
        {
          value2: '2',
          label: '注册时间倒排序',
        },
      ],
      lastLoginTime: [
        { value3: '0', label: '请选择' },
        { value3: '1', label: '最后一次登录时间正排序' },
        {
          value3: '2',
          label: '最后一次登录时间倒排序',
        },
      ],
      value1: '请选择',
      value2: '请选择',
      value3: '请选择',
      dataList: [],
      myInviteList: [],
      getInfoList: [],
      tableLoading: false,
      loading: false,
      showCount: 10,
      totalResult: 1,
      currentPage: 1,
      outLoading: false,
      outShowCount: 10,
      outTotalResult: 1,
      outCurrentPage: 1,
      // head-icons props
      inviteSuccess: '',
      totalProfitLj: '',
      inviteProfit: '',
      inviteUrl: '',
      smallProgramCode: '',
      invtercode: '',
      // userInfo: '',
      Activated: '', // 已激活
      toActivate: '', // 待激活人数
      activateHb: '', // 激活红包总金额
      //-------
      dialogTableVisible: false,
      getInfoTotalResult: 1,
      getInfoTotalshowCount: 10,
      getInfoTotalCurrentPage: 1,
      invitee_id: '',

      // 总人数
      info1TotalSize: '',
      // 总激活人数
      info1jhSize: '',
      // 礼物总收益
      info1allGiftIncome: '',
      // 我的收益
      info1GiftIncome: '',
      // 总场次
      info1IncomeSize: '',
      // 总人数
      info2TotalSize: '',
      // 总激活人数
      info2jhSize: '',
      // 礼物总收益
      info2allGiftIncome: '',
      // 我的收益
      info2GiftIncome: '',
      // 总场次
      info2IncomeSize: '',

      tableData: [],
    };
  },

  created() {
    getHhrInfo1().then((res) => {
      console.log(res);
      const { info1, hhr, info2 } = res.data;
      this.info1TotalSize = info1.size;
      this.info1jhSize = info1.jhSize.size;
      this.info1allGiftIncome = hhr.one_income_all;
      this.info1GiftIncome = hhr.one_income_my;
      this.info1IncomeSize = info1.wedding_size;

      this.info2TotalSize = info2.size;
      this.info2jhSize = info2.jhSize.size;
      this.info2allGiftIncome = hhr.two_income_all;
      this.info2GiftIncome = hhr.two_income_my;
      this.info2IncomeSize = info2.wedding_size;
    });
    this.getFirstPeople();
    // this.getMyInviteList();
    // this.getMyInviteERCode();
  },
};
</script>

<style lang="less" scoped>
.introduction {
  .join-button {
    margin: auto;
    margin-bottom: 26px;
    width: 136px;
    height: 40px;
    border-radius: 4px;
    .hvCenter();
    font-weight: 500;
    font-size: 19px;
    cursor: pointer;
  }
  .content-header {
    padding: 20px;
    img {
      width: 100%;
    }
  }
  .main-card {
    .example {
      .hvCenter();
      margin-left: 21px;
      width: 82px;
      height: 26px;
      border-radius: 0 0 5px 5px;
      font-size: 13px;
      font-weight: 500;
      color: #ffffff;
      line-height: 19px;
    }
  }
}
.h-top {
  display: flex;
  flex-direction: column;
  font-size: 32px;
  font-size: 1.6vw;

  .sub-name,
  .sub-degree {
    display: flex;
  }
  // .sub-person {
  //   margin-top: 20px;
  // }
  .name,
  .degree {
    // font-size: 27px;
    // font-size: 1.1vw;
    color: #1890ff;
  }
  .sub-person {
    display: flex;
    margin-top: 20px;
    margin-left: 120px;
  }
}
.group-box {
  margin: 27px 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  div {
    box-sizing: border-box;
  }

  .group {
    width: 40vw;
    // height: 14vw;
    padding: 1.8vw;
    background: #fff;
    // border: 1px solid red;
    border-radius: 5px;
    color: #333333;
    box-shadow: 3px 4px 13px 0px rgba(119, 119, 119, 0.1);
    .top {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      height: 4vw;
      .group-name {
        font-size: 27px;
        font-size: 1.4vw;
        display: flex;
        align-items: center;
        img {
          width: 66px;
          height: 66px;
        }
      }
      .sum {
        font-size: 43px;
        font-size: 2.23vw;
      }
    }
    .form-data {
      display: flex;
      flex-wrap: wrap;
      height: 10vw;

      justify-content: space-around;
      align-items: space-around;
      .form-item {
        height: 5vw;
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          font-size: 1.1vw;
        }
        .count {
          font-size: 1.6vw;
          span {
            font-size: 1.1vw;
            height: 5vw;
            line-height: 5vw;
          }
        }
      }
    }
  }
}
</style>
