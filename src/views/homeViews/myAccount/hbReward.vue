<template>
  <sub-page class="hbReward">
    <content-header>
      <header-icons :exists="['canUseHb', 'hbUsed', 'overdueHb']" />
    </content-header>
    <main-card class="hbReward">
      <div class="select">
        <span class="label-title">红包状态：</span>
        <el-select v-model="value" placeholder="请选择" size="mini" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
      <my-table class="my-table">
        <el-table :data="tableData" header-row-class-name="table-header" height="100%" style="width: 100%">
          <el-table-column label="序号" header-align="center" align="center" class-name="column-header">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="红包类型" header-align="center" align="center">
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.type"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="金额" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="rstate" header-align="center" align="center" label="红包状态">
            <template slot-scope="scope">
              <red-package-status :status="scope.row.rstate" />
            </template>
          </el-table-column>
          <el-table-column prop="collectionDate" header-align="center" align="center" label="领取时间" min-width="145"> </el-table-column>
          <el-table-column prop="overdueDate" header-align="center" align="center" label="过期时间" min-width="140"> </el-table-column>
          <el-table-column prop="isWithdraw" header-align="center" align="center" :formatter="formatIsWithdraw" label="是否提现">
          </el-table-column>
          <el-table-column
            prop="withDrawDate"
            header-align="center"
            align="center"
            :formatter="showWithDrawDate"
            label="提现时间"
            min-width="140"
          >
          </el-table-column>
        </el-table>
      </my-table>
      <my-tip-bar color-style="yellow"> 类型说明： </my-tip-bar>
      <my-tip-bar color-style="blue"> 您最关心的：如何获取红包？ </my-tip-bar>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import RedPackageStatus from '@/layout/home/components/myAccount/redPackageStatus';
import MyTipBar from '@/components/myTipBar';
import ContentHeader from '@/layout/home/components/header/contentHeader';
import HeaderIcons from '@/layout/home/components/header/headerIcons';

export default {
  name: 'hbReward',
  components: {
    HeaderIcons,
    ContentHeader,
    MyTipBar,
    RedPackageStatus,
    MyTable,
    MainCard,
    SubPage,
  },
  data() {
    return {
      tableData: [
        {
          collectionDate: '2016-05-02',
          overdueDate: '2016-05-02',
          withDrawDate: '2016-05-02',
          isWithdraw: true,
          name: '李浩正',
          money: '327',
          status: '0',
          type: 'https://www.emiya.com.cn/media/avatar/123.jpg',
        },
        {
          collectionDate: '2016-05-02',
          overdueDate: '2016-05-02',
          withDrawDate: '2016-05-02',
          isWithdraw: true,
          name: '李浩正',
          money: '327',
          status: '1',
          type: 'https://www.emiya.com.cn/media/avatar/123.jpg',
        },
        {
          collectionDate: '2016-05-02',
          overdueDate: '2016-05-02',
          withDrawDate: '2016-05-02',
          isWithdraw: false,
          name: '李浩正',
          money: '327',
          status: '2',
          type: 'https://www.emiya.com.cn/media/avatar/123.jpg',
        },
        {
          collectionDate: '2016-05-02',
          overdueDate: '2016-05-02',
          withDrawDate: '2016-05-02',
          isWithdraw: true,
          name: '李浩正',
          money: '327',
          status: '1',
          type: 'https://www.emiya.com.cn/media/avatar/123.jpg',
        },
      ],
      show: false,
      message: '',
      title: '',
      options: [
        {
          value: '0',
          label: '未使用',
        },
        {
          value: '1',
          label: '已使用',
        },
        {
          value: '2',
          label: '已过期',
        },
      ],
      value: '',
    };
  },
  methods: {
    showWithDrawDate(row, col, value) {
      if (!row.isWithdraw) {
        return '';
      }
      return value;
    },
    formatIsWithdraw(row, col, value) {
      if (value) {
        return '是';
      }
      return '否';
    },
    openDiaLog(title, message) {
      this.show = true;
      this.message = message;
      this.title = title;
    },
  },
  computed: {},
  mounted() {},
};
</script>

<style lang='less' scoped>
.hbReward::v-deep {
  .hbReward {
    position: relative;
    padding: 10px;
  }
  .select {
    margin-left: 18px;
    .label-title {
      margin-right: 11px;
      font-size: 13px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
    }
  }
  .my-tip-bar {
    margin-left: 55px;
  }
}
</style>
