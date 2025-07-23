<template>
  <sub-page class="introduction">
    <content-header>
      <div class="h-top">
        <div class="sub-hm">嗨喵合伙人:</div>
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
    <main-card>
      <!-- <div class="example blue-background">样例</div> -->
      <card-top-info title="已结算详情">
        <!-- <span class="blue-text" style="margin-right: 18px">成为合伙人，每个月完成固定场次，享受1-2级团队收益8%的合伙人奖励</span> -->
      </card-top-info>
      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <!-- <el-table-column label="编号" header-align="center" align="center" min-width="80" class-name="column-header">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column> -->

          <el-table-column prop="emcee_name" label="姓名" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
              <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: centr">{{ scope.row.emcee_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.phonenumber }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="month" header-align="center" align="center" label="月份">
            <template slot-scope="scope">
              <span>{{ scope.row.month }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="my_income" header-align="center" align="center" label="一级团队礼物总收益" min-width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.one_income }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="shares" header-align="center" align="center" label="持股数"> </el-table-column> -->
          <el-table-column prop="two_income" header-align="center" align="center" label="二级团队礼物总收益" min-width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.two_income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_income" header-align="center" align="center" label="总收益">
            <template slot-scope="scope">
              <span>{{ scope.row.total_income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rate" header-align="center" align="center" label="分成比例">
            <template slot-scope="scope">
              <span>{{ scope.row.rate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="my_income" header-align="center" align="center" label="我的分成">
            <template slot-scope="scope">
              <span>{{ scope.row.my_income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="结算状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status === "1" ? "已结算" : "未结算" }}</span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
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
import { getHhrIncomInfo } from '@/api/cityPartner/citypartnerDetail';
import { mapState } from 'vuex';

export default {
  mixins: [messageBoxMixin],
  name: 'incomeCountDown',
  components: {
    MyTable,
    CardTopInfo,
    MainCard,
    ContentHeader,
    SubPage,
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
  },
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    getHhrIncomInfo().then((res) => {
      console.log(res);
      this.tableData = res.data.list;
    });
  },
};
</script>

<style lang="less" scoped>
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
</style>
