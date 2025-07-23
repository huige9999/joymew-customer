<template>
<el-table
  :data="tableData"
  header-row-class-name="table-header"
  height="100%"
  style="width: 100%"
>
  <el-table-column
      prop="completeNum"
      label="完成场次"
      header-align="center"
      align="center"
      min-width="70"
      class-name="column-header"
  >
  </el-table-column>
  <el-table-column
      prop="standard"
      label="是否达标"
      :formatter="formatStandard"
      header-align="center"
      align="center"
      min-width="70"
  >
  </el-table-column>
  <el-table-column
      prop="totalIncome"
      label="总收益"
      header-align="center"
      align="center"
      min-width="70"
  >
  </el-table-column>
  <el-table-column
      prop="proportion"
      label="分成比例"
      header-align="center"
      align="center"
      min-width="70"
  >
  </el-table-column>
  <el-table-column
      prop="myIncome"
      label="我的分成"
      header-align="center"
      align="center"
      min-width="70"
  >
  </el-table-column>
  <el-table-column
      prop="alipay"
      label="支付宝账号"
      header-align="left"
      align="left"
      class-name="padding-left"
      min-width="110"
  >
  </el-table-column>
  <el-table-column
      prop="alipayName"
      label="支付宝姓名"
      header-align="center"
      align="center"
      min-width="85"
  >
  </el-table-column>
  <el-table-column
      prop="month"
      label="结算月份"
      header-align="left"
      align="left"
      class-name="padding-left"
      min-width="100"
  >
  </el-table-column>
  <el-table-column
      prop="status"
      label="结算状态"
      :formatter="formatStatus"
      header-align="center"
      align="center"
  >
  </el-table-column>
  <el-table-column
    label="操作"
    header-align="center"
    align="center"
  >
    <template>
      <el-link href="#" type="primary">明细</el-link>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
export default {
  name: 'table1',
  data() {
    return {
      tableData: [
        {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        }, {
          completeNum: 33,
          standard: true,
          totalIncome: 9246,
          proportion: '9%',
          myIncome: 10,
          alipay: 'd.lmbvxltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-03',
          status: false,
        }, {
          completeNum: 337,
          standard: false,
          totalIncome: 946,
          proportion: '9%',
          myIncome: 80,
          alipay: 'dltckl@gmail.com',
          alipayName: '李浩正',
          month: '2019-06',
          status: true,
        },
      ],
    };
  },
  methods: {
    formatStandard(row, column, cellValue) {
      if (cellValue) {
        return '是';
      }
      return '否';
    },
    formatStatus(row, column, cellValue) {
      if (cellValue) {
        return '已结算';
      }
      return '未结算';
    },
  },
};
</script>

<style scoped>

</style>
