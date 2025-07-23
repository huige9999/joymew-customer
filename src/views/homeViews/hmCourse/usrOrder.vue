<template>
  <sub-page>
    <main-card>
      <div style="height: 60px; width: 100%; display: flex; justify-content: flex-start;align-items: center;padding-left: 40px;">
        <div style="width: 200px;">
          <el-select v-model="paystate" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
      </div>
      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <el-table-column prop="album_title" label="课程名称" header-align="center" align="center" min-width="80"> </el-table-column>

          <el-table-column label="购买用户" header-align="left" align="left" min-width="180" class-name="avtor-header">
            <template slot-scope="scope">
              <div class="avtor-wrap">
                <el-avatar :size="40" :src="scope.row.avator"></el-avatar>
                <span style="margin-left: 10px">{{ scope.row.emcee_name }} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="客户渠道" header-align="left" align="left" min-width="180" class-name="avtor-header">
            <template slot-scope="scope">
              <!-- {{ scope.row.is_share }} -->
              <div class="avtor-wrap" v-if="scope.row.is_share === '1'">
                <el-avatar :size="40" :src="scope.row.inviter_info.avator"></el-avatar>
                <span style="margin-left: 10px">{{ scope.row.inviter_info.emcee_name }} </span>
              </div>
              <div class="avtor-wrap" v-else>
                <!-- 直邀用户 -->
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="emcee_name" label="用户" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <el-table-column prop="money" header-align="center" align="center" label="价格(元)"> </el-table-column>
          <el-table-column prop="create_time" header-align="center" align="center" label="下单时间" min-width="130"> </el-table-column>
          <!-- <el-table-column prop="shares" header-align="center" align="center" label="持股数"> </el-table-column> -->
          <!-- <el-table-column prop="coureLink" header-align="center" align="center" label="课程链接"> </el-table-column> -->
          <el-table-column label="状态" header-align="center" align="center" min-width="120" class-name="column-header">
            <template slot-scope="scope">
              <span style="color: grey;">{{ scope.row.paystate === '0' ? '未支付' : '' }}</span>
              <span style="color: #3bcacd;">{{ scope.row.paystate === '1' ? '已支付' : '' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>

      <el-pagination
        background
        :hide-on-single-page="!true"
        layout="prev, pager, next"
        @current-change="changPage"
        :page-size="showCount"
        :total="totalResult"
        class="my-pagination"
      />
    </main-card>
  </sub-page>
</template>

<script>
import { getCourseOrder } from '@/api/app/course';
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';

export default {
  components: {
    SubPage,
    MainCard,
    MyTable,
  },
  data() {
    return {
      showCount: 10,
      currentPage: 1,
      totalResult: 10,
      tableData: [],
      paystate: '',
      options: [
        {
          value: '',
          label: '全部订单',
        },
        {
          value: '1',
          label: '已支付',
        },
        {
          value: '0',
          label: '未支付',
        },
      ],
    };
  },
  watch: {
    paystate() {
      this.tableData = [];
      this.showCount = 10;
      this.currentPage = 1;
      this.totalResult = 10;
      this.getCourseOrder();
    },
  },
  created() {
    this.getCourseOrder();
  },
  methods: {
    changPage(val) {
      // this.     // 改变当前页
      this.currentPage = val;
      this.getCourseOrder();
    },
    getCourseOrder() {
      getCourseOrder({
        showCount: this.showCount,
        currentPage: this.currentPage,
        paystate: this.paystate,
      })
        .then((res) => {
          console.log(res);
          if (res.data.list) {
            this.tableData = res.data.list || [];
            this.totalResult = res?.data?.totalResult || 10;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.avtor-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // padding-left: 60px;
}
.avtor-header {
  padding-left: 60px;
}
</style>
