<template>
  <sub-page>
    <div class="team-index_container">
      <main-card>
        <card-top-info title="团队信息"></card-top-info>
        <div class="base-info_wrap contentPadding">
          <div class="base-info_item">
            <span class="key">团队名称：</span>
            <span v-show="teamEditPropotion">{{ baseInfo.team_name }}</span>
            <el-input
              @blur="editName(baseInfo.team_name)"
              v-show="!teamEditPropotion"
              v-model="baseInfo.team_name"
              class="infoEditInput"
              ref="teamNameInput"
              size="mini"
            ></el-input>
            <i class="el-icon-edit proportion-edit" @click="teamNameEdit(baseInfo.team_name)"></i>
          </div>
          <div class="base-info_item">
            <span class="key">所属地区：</span>
            <span v-show="teamAreaEditPropotion">{{ baseInfo.teamArea }}</span>
            <el-input
              v-show="!teamAreaEditPropotion"
              ref="teamAreaInput"
              v-model="baseInfo.teamArea"
              @blur="editName(baseInfo.teamArea)"
              class="infoEditInput"
              size="mini"
            ></el-input>
            <i class="el-icon-edit proportion-edit" @click="editArea(baseInfo.teamArea)"></i>
          </div>
          <div class="base-info_item">
            <span class="key">团队邀请码：</span>
            {{ baseInfo.invite_code }}
          </div>
        </div>
      </main-card>
      <main-card>
        <card-top-info title="团队数据"></card-top-info>
        <header-icons :exists="['inviteSuccess', 'Activated', 'toActivate', 'activateHb']" :dataObj="headerDatas" />
        <div class="query-form_wrap contentPadding">
          <div class="form_box">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="用户信息:">
                <el-input v-model="queryInfo.namephone" placeholder="姓名电话" size="mini"></el-input>
              </el-form-item>

              <el-form-item label="总收入:">
                <el-select v-model="queryInfo.income" placeholder="请选择" size="mini">
                  <el-option v-for="(item, index) in incomeRanges" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="注册时间:">
                <el-select v-model="queryInfo.income" placeholder="请选择" size="mini">
                  <el-option v-for="(item, index) in registerDateRanges" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="登录时间:">
                <el-select v-model="queryInfo.income" placeholder="请选择" size="mini">
                  <el-option v-for="(item, index) in loginDateRanges" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table_wrap contentPadding">
          <el-table :data="teamMemberList" style="width: 100%" border>
            <el-table-column prop="avatar" label="头像" width="80">
              <template #default="{ row }"><img :src="row.avatar" class="avatar-img" /></template>
            </el-table-column>
            <el-table-column prop="wx_name" label="用户名" width="120"></el-table-column>
            <el-table-column prop="gift_proportion" label="礼物收益比例" width="120">
              <template #default="{ row }">
                <div class="content_wrap">
                  <el-input
                    v-model="tempEditProportion"
                    focus
                    ref="giftProportionInput"
                    size="mini"
                    v-if="row.extra_options.canEditGiftProportion"
                    @blur="editGiftProportion(row)"
                    :autofocus="true"
                  ></el-input>
                  <span v-if="row.extra_options.canEditGiftProportion">%</span>
                  <span v-if="!row.extra_options.canEditGiftProportion">{{ row.gift_proportion }}%</span>
                  <i class="el-icon-edit proportion-edit" @click="showProportionEdit(row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="apply_num" label="申请场次"></el-table-column>
            <el-table-column prop="finish_num" label="完成场次"></el-table-column>
            <el-table-column prop="total_income" label="总收益"></el-table-column>
            <el-table-column prop="team_contribution_income" label="团队贡献收益"></el-table-column>
            <el-table-column prop="last_login_time" label="最后登录时间"></el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button type="primary" size="mini" @click="checkDetail(row)">查看明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="showCount"
          :total="totalResult"
          @current-change="changePage"
          :hide-on-single-page="true"
          class="my-pagination"
        />
      </main-card>
      <!-- 点击查看明细弹框 -->
      <el-dialog :visible.sync="dialogTableVisible" width="85%" style="margin-left: 14%">
        <div class="abow_dialog">
          <my-table class="myInfo">
            <el-table :data="getInfoList" header-row-class-name="table-header" style="width: 100%" height="70vh" v-loading="tableLoading">
              <el-table-column prop="emcee_name" label="姓名" align="center" min-width="100"></el-table-column>
              <el-table-column prop="theme" label="活动名称 " align="center" min-width="120"></el-table-column>
              <el-table-column prop="using_date" label="活动时间" align="center" min-width="100">
                <template slot-scope="scope">
                  {{ new Date(scope.row.using_date) | dateFormat }}
                </template>
              </el-table-column>
              <el-table-column prop="hotel_name" label="活动地点" align="center"></el-table-column>

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
    </div>
  </sub-page>
</template>
<script>
import { alterJuniorProp, alterNameAndArea, reqGetTeamBaseInfo, reqGetTeamDataList } from '@/api/teamManage/index';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import HeaderIcons from '@/layout/home/components/header/headerIcons';
import { formatDate } from '@/utils/format';
import request from '@/utils/request';

export default {
  name: 'teamIndex',
  data() {
    return {
      teamEditPropotion: true, // 团队名称输入框开关
      teamAreaEditPropotion: true, // 团队地区输入框开关
      baseInfo: {
        team_name: '', // 团队名称
        teamArea: '', // 团队地区
        invite_code: '',
      },
      queryInfo: {
        namephone: '',
        income: '0',
        registerDate: '',
        loginDate: '',
      },
      headerDatas: {
        inviteSuccess: 10,
        Activated: 20,
        toActive: 30,
        activateHb: 10,
      },
      incomeRanges: [
        { label: '请选择', value: '0' },
        { label: '金额从低到高', value: '1' },
        { label: '金额从高到底', value: '2' },
      ],
      registerDateRanges: [
        {
          label: '请选择',
          value: '0',
        },
        {
          label: '注册时间正排序',
          value: '1',
        },
        {
          label: '注册时间倒排序',
          value: '2',
        },
      ],
      loginDateRanges: [
        {
          label: '请选择',
          value: '0',
        },
        {
          label: '登录时间正排序',
          value: '1',
        },
        {
          label: '登录时间倒排序',
          value: '2',
        },
      ],
      teamMemberList: [],
      currentPage: 1,
      showCount: 10,
      totalResult: 0,
      tempEditProportion: 0,
      canEditProportion: false,
      // ---弹出层数据---
      getInfoList: [],
      dialogTableVisible: false,
      getInfoTotalResult: 1,
      getInfoTotalshowCount: 10,
      getInfoTotalCurrentPage: 1,
      invitee_id: '',
      tableLoading: false,
    };
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd');
    },
  },
  created() {
    this.initData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    HeaderIcons,
    MyTable,
  },
  methods: {
    // 修改团队名称
    teamNameEdit() {
      this.teamEditPropotion = !this.teamEditPropotion;
      // 输入框聚焦
      this.$nextTick(() => {
        this.$refs.teamNameInput.focus();
        console.log(this.$refs);
      });
    },
    // 修改所属地区
    editArea() {
      this.teamAreaEditPropotion = !this.teamAreaEditPropotion;
      // 输入框聚焦
      this.$nextTick(() => {
        this.$refs.teamAreaInput.focus();
      });
    },
    // 团队名字输入框失焦事件
    editName() {
      // 关闭输入框
      this.teamEditPropotion = true;
      this.teamAreaEditPropotion = true;
      const obj = {
        teamName: this.baseInfo.team_name,
        teamArea: this.baseInfo.teamArea,
      };
      console.log(obj, 'obj');
      alterNameAndArea(obj).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.msg);
        }
      });
    },
    // 判断活动类型
    getInforType(type) {
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
    },
    changePage1(val) {
      // 显示加载图标
      this.tableLoading = true;
      // 改变当前页
      this.getInfoTotalCurrentPage = val;
      console.log(this.getInfoTotalCurrentPage);
      // 请求数据
      this.getDialogTableData();
    },
    checkDetail(obj) {
      console.log(obj);
      this.invitee_id = obj.userId;
      this.getDialogTableData();
      this.dialogTableVisible = true;
    },
    showProportionEdit(row) {
      // if (!this.canEditProportion) {
      //   this.$message.error('暂未开发礼物比例修改!');
      //   return;
      // }
      console.log(row, '00001');
      this.tempEditProportion = row.gift_proportion;
      row.extra_options.canEditGiftProportion = true;
      this.$nextTick(() => {
        this.$refs.giftProportionInput.focus();
        console.log(this.$refs.giftProportionInput);
      });
    },
    editGiftProportion(row) {
      // this.tempEditProportio是正整数 并且在(0,100]区间内
      const reg = /^\d+$/;
      if (!reg.test(this.tempEditProportion) || this.tempEditProportion <= 0 || this.tempEditProportion > 100) {
        this.$message.error('请输入0-100的数字');
        row.extra_options.canEditGiftProportion = false;
        // 还原输入的值
        this.tempEditProportion = row.gift_proportion;
        return;
      }
      // 修改礼物收益比例
      const obj = {
        ratio: Number(this.tempEditProportion),
        targetUserId: row.userId,
      };
      alterJuniorProp(obj).then((res) => {
        if (res.code === 200) {
          this.$message.success('修改礼物比例成功!');
          // 输入的礼物比例作为新的值
          row.gift_proportion = this.tempEditProportion;
        } else {
          this.$message.error(res.msg);
          this.tempEditProportion = 0;
        }
      });
      row.extra_options.canEditGiftProportion = false;
    },
    onSubmit() {
      // console.log(this.queryInfo, '000002');
      // console.log(this.queryInfo);
      this.getTeamDataList();
    },
    initBaseInfo({ team_name, team_area, invite_key }) {
      this.baseInfo.team_name = team_name;
      this.baseInfo.teamArea = team_area;
      this.baseInfo.invite_code = invite_key;
    },
    initHeaderDatas(data) {
      const { totalSize, jiHuoSize, notJiHuoSize, jiHuoHb } = data.jiHuoInfo.titil_json;
      this.headerDatas.inviteSuccess = totalSize;
      this.headerDatas.Activated = jiHuoSize;
      this.headerDatas.toActive = notJiHuoSize;
      this.headerDatas.activateHb = jiHuoHb;
    },
    initTeamMemberList(data) {
      this.totalResult = data.totalResult;
      this.teamMemberList = data.varList.map((item) => {
        return {
          avatar: item.avator,
          wx_name: item.emcee_name,
          gift_proportion: item.vip_level,
          phone: item.phonenumber,
          apply_num: item.spltotal,
          finish_num: item.splactual,
          total_income: item.total_income,
          team_contribution_income: item.teamIncome?.team_total_income,
          last_login_time: item.lastDateDesc,
          userId: item.id,
          extra_options: {
            canEditGiftProportion: false,
          },
        };
      });
    },
    getTeamDataList() {
      reqGetTeamDataList({
        // splid: this.$store.state.liveId,
        currentPage: this.currentPage,
        showCount: this.showCount,
        lastLoginTime: this.queryInfo.loginDate,
        zhuceTime: this.queryInfo.registerDate,
        userInfo: this.queryInfo.namephone,
        income_sort: this.queryInfo.income,
      })
        .then((res) => {
          // console.log('团队数据:', res);
          this.initHeaderDatas(res.data);
          this.initTeamMemberList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initData() {
      reqGetTeamBaseInfo()
        .then((res) => {
          // console.log('团队基本信息：', res);
          this.initBaseInfo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      this.getTeamDataList();
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
      this.getTeamDataList();
    },
  },
};
</script>
<style lang="less" scoped>
.contentPadding {
  padding: 0 20px;
}

.base-info_wrap {
  display: flex;
  column-gap: 40px;
  padding-bottom: 20px;

  .base-info_item {
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    color: #606266;
    width: 200px;

    .key {
      font-weight: 400;
    }

    .infoEditInput {
      width: 100px;
      outline: none;
    }
  }
}

.table_wrap {
  padding-bottom: 20px;

  .avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .content_wrap {
    display: flex;
    align-items: center;
    column-gap: 5px;

    .proportion-edit {
      cursor: pointer;
    }

    span {
      display: inline-block;
      width: 50%;
    }
  }
}
</style>
