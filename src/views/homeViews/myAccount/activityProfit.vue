<!--活动收益-->
<template>
  <sub-page class="activityProfit">
    <main-card >
      <my-table>
        <el-table :data="tableData" header-row-class-name="table-header" height="100%" style="width: 100%">
          <el-table-column prop="title" label="活动标题" header-align="left" min-width="100" class-name="column-header"> </el-table-column>
          <el-table-column prop="time" label="活动时间" :formatter="formatTableDate" header-align="center" align="center" min-width="150">
          </el-table-column>
          <el-table-column prop="type" label="活动类型" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="totalIncome" label="总收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="invitationIncome" label="邀请收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="redPacketIncome" label="红包收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="presentIncome" label="礼物收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="zyzIncome" label="扭一扭收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="boxIncome" label="开宝箱收益" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="gameIncome" label="游戏收益" header-align="center" align="center"> </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template>
              <el-link href="#" type="primary">明细</el-link>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MyTable from '@/components/myTable';
import MainCard from '@/components/mainCard';
import { formatTableDate } from '@/utils/format';

export default {
  name: 'activityProfit',
  components: { MainCard, MyTable, SubPage },
  data() {
    return {
      tableData: [
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
        {
          title: '投票',
          time: '2019-03-08',
          type: '婚礼',
          totalIncome: 442,
          invitationIncome: 546,
          redPacketIncome: 53,
          presentIncome: 25,
          zyzIncome: 26,
          boxIncome: 25,
          gameIncome: 44,
        },
      ],
    };
  },
  methods: {
    formatTableDate,
  },
};
</script>

<style lang='less' scoped>
.activityProfit {
  .el-table::v-deep {
    .column-header {
      padding-left: 20px;
    }
  }
}
</style>
