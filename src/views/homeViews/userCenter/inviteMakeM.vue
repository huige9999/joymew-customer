<!--活动收益-->
<template>
  <sub-page class="my-invite">
    <!-- ---------- -->

    <!-- -------------- -->
    <main-card>
      <header-icons
        :exists="['inviteSuccessTwo', 'Activated', 'toActivate', 'activateHb']"
        :data-obj="{ inviteSuccess, Activated, toActivate, activateHb }"
        padding="18px 0px 0"
      />
      <!-- 查询 -->
      <div class="query-form-container" style="display: flex; margin-left: 30px; margin-top: 30px">
        <div class="form-box">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户信息">
              <el-input v-model="userInfo" placeholder="姓名/电话"></el-input>
            </el-form-item>
            <el-form-item label="总收入">
              <el-select v-model="value1" placeholder="请选择">
                <el-option v-for="item in incomeSort" :key="item.value1" :label="item.label" :value="item.value1"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册时间">
              <el-select v-model="value2" placeholder="请选择">
                <el-option v-for="item in enrollTime" :key="item.value2" :label="item.label" :value="item.value2"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录时间">
              <el-select v-model="value3" placeholder="请选择">
                <el-option v-for="item in lastLoginTime" :key="item.value3" :label="item.label" :value="item.value3"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(userInfo, value1, value2, value3)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <my-table>
        <el-table :data="myInviteList" header-row-class-name="table-header" style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="avator" label="头像" align="center" min-width="100">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="emcee_name" label="用户名 " align="center" min-width="120"> </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" align="center"> </el-table-column>
          <el-table-column prop="spltotal" label="申请场次" align="center"> </el-table-column>
          <el-table-column prop="splactual" label="完成场次" align="center"> </el-table-column>
          <el-table-column prop="total_income" align="center">
            <template slot="header">
              <span>总收益</span>
              <el-tooltip class="item" effect="dark" content="您所邀请用户的总收益" placement="right">
                <i class="el-icon-question" style="color: #249aff"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="lastDateDesc" label="最后登录时间" align="center" min-width="100"> </el-table-column>
          <el-table-column label="查看明细" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getInfo(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="gzh_powder" label="帮我吸粉" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.gzh_powder"
                @change="changeXifenStatus(scope.row)"
                active-color="#249AFF"
                inactive-color="#D5D9DF"
                active-value="1"
                inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column> -->
        </el-table>
      </my-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="showCount"
        :total="totalResult"
        @current-change="changePage"
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
              <!-- <el-table-column label="查看明细" align="center">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getInfo(scope.row)">查看明细</el-button>
                        <el-dialog :visible.sync="dialogTableVisible"> </el-dialog>
                      </template>
                    </el-table-column> -->
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
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';

import HeaderIcons from '@/layout/home/components/header/headerIcons';

import { formatDate } from '@/utils/format';

import { getMiniWPERCode, getMyInviteList } from '@/api/app/invite';
import { helpMeGetFans } from '@/api/app/user';
import messageMixin from '@/mixins/messageBoxMixin';
import request from '@/utils/request';

const inviteUrlR = 'https://www.hudongmiao.com/#/phoneRegister?inviteCode=';
export default {
  mixins: [messageMixin],
  name: 'inviteMakeM',
  components: {
    HeaderIcons, MainCard, MyTable, SubPage,
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
      showCount: 10,
      totalResult: 1,
      currentPage: 1,
      // head-icons props
      inviteSuccess: '',
      totalProfitLj: '',
      inviteProfit: '',
      inviteUrl: '',
      smallProgramCode: '',
      invtercode: '',
      userInfo: '',
      Activated: '', // 已激活
      toActivate: '', // 待激活人数
      activateHb: '', // 激活红包总金额
      //-------
      dialogTableVisible: false,
      getInfoTotalResult: 1,
      getInfoTotalshowCount: 10,
      getInfoTotalCurrentPage: 1,
      invitee_id: '',
    };
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd');
    },
  },
  methods: {
    getInfo(obj) {
      console.log(obj);
      this.invitee_id = obj.userId;
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
    // 点击页面按钮
    changePage(val) {
      // 显示加载图标
      this.loading = true;
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      this.getMyInviteList();
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
    changeXifenStatus(obj) {
      helpMeGetFans({
        invitee_id: obj.userId,
      }).then((res) => {
        console.log('set helpxifen', res);
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
          });
        }
      });
    },
    /* 请求我的邀请表格数据 */
    getMyInviteList() {
      getMyInviteList({
        showCount: this.showCount,
        currentPage: this.currentPage,
        userInfo: this.userInfo,
        income_sort: this.value1,
        zhuceTime: this.value2,
        lastLoginTime: this.value3,
        request_from_page: 'app/userCenter/myInvite',
      }).then((res) => {
        console.log('myinvite list', res);
        if (res.data) {
          this.myInviteList = res.data.varList;
          // this.inviteUrl = inviteUrlR + res.data.totalincome.invite_code;
          this.inviteUrl = inviteUrlR + res.data.totalincome.invite_key;
          // this.invtercode = res.data.totalincome.invite_code; // 邀请码
          this.invtercode = res.data.totalincome.invite_key; // 邀请码
          this.totalResult = res.data.totalResult;
          this.inviteSuccess = res.data.jiHuoInfo.totalSize; // 成功邀请
          // this.totalProfitLj = res.data.totalincome.gift_share_income; // 成功邀请
          this.totalProfitLj = res.data.totalincome.earning_giftshare;
          // this.inviteProfit = res.data.totalincome.kbx_share_income; // 开宝箱奖励
          this.inviteProfit = res.data.totalincome.earning_gbox; // 开宝箱奖励
          this.Activated = res.data.jiHuoInfo.size; // 已激活人数
          this.toActivate = res.data.jiHuoInfo.notJiHuoSize; // 待激活
          this.activateHb = res.data.jiHuoInfo.JiHuoHb.bonus; // 激活红包金额
        } else {
          console.log('邀请列表res.data为空');
        }
      });
    },
    onCopy() {
      this.$message({
        type: 'success',
        message: '复制成功，发送您的好友，使用后即可获得收益奖励',
      });
    },
    formatData(res) {
      return res.varList;
    },
    contact() {
      this.openInfoBox(
        '邀请',
        this.$createElement('img', {
          attrs: { src: this.smallProgramCode },
          style: 'width:100%; margin-bottom:-30px',
        }),
        { center: true },
      );
    },
    getMyInviteERCode() {
      const token = localStorage.getItem('token');
      const page = 'pages/invite/invite';
      getMiniWPERCode({ token, page }).then((res) => {
        this.smallProgramCode = res.smallProgramCode;
        console.log(this.smallProgramCode);
      });
    },
    onSubmit(userInfo, Activated, toActivate, activateHb) {
      this.getMyInviteList(userInfo, Activated, toActivate, activateHb);
      this.$message({
        type: 'success',
        message: '查询成功',
      });
    },
  },
  created() {
    this.getMyInviteList();
    this.getMyInviteERCode();
  },
  computed: {
    // 判断活动类型
    getInforType() {
      return (type) => {
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
};
</script>

<style lang="less" scoped>
.my-invite {
  .my-tip-bar {
    margin-bottom: 20px;
    margin-top: 0;
  }
  .top-card {
    flex-direction: row;
    // 左右均分宽度
    .left,
    .right {
      display: flex;
      flex-direction: column;
      width: 50%;
      padding-right: 40px;
    }
    .left {
      .items {
        max-width: 420px;
        display: flex;
        position: relative;
        justify-content: space-between;
        margin-left: 17px;
        padding-bottom: 23px;
        // 图标中间的连接线
        &:after {
          z-index: 0;
          content: '';
          position: absolute;
          width: calc(100% - 10px);
          height: 35px;
          border-bottom: 1px dashed #ffb84c;
        }
        .item {
          z-index: 1;
          img {
            height: 69px;
          }
          p {
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            color: #3b3c3d;
            line-height: 20px;
          }
        }
      }
    }
    .right {
      .items {
        .vCenter();
      }
      .link::v-deep {
        display: flex;
        .invite-link {
          max-width: 60%;
          a {
            width: 100%;
            span {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .QRInvite {
        margin-top: 14px;
        margin-bottom: 23px;
        img {
          padding-left: 9px;
          padding-right: 9px;
          width: 31px;
          cursor: pointer;
        }
      }
    }
  }
}
.doubt-one {
  position: absolute;
  left: 68%;
  z-index: 999;
}
.myInfo {
  padding: 1px 16px 10px;
}
.abow_dialog {
  height: 75vh;
  // overflow: auto;
}
</style>
