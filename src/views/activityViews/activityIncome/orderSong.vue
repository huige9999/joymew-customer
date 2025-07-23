<!--点歌-->
<template>
  <sub-page>
    <main-card>
      <!-- 表格项 -->
      <my-table class="mytable" style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="200" align="center" header-align="center"> </el-table-column>
          <el-table-column label="姓名" min-width="130" header-align="center">
            <template slot-scope="scope">
              <div class="uploadImg">
                <img width="22" height="22" :src="scope.row.avator" />
                <span class="text">{{ scope.row.wx_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="歌曲" min-width="120" align="center" header-align="center"> </el-table-column>
          <el-table-column prop="gift_price" label="价格" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="gift_income" label="收益" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <div class="income-container">
                {{ scope.row.gift_income }}
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  title="是否确认提现？"
                  @onConfirm="withDraw(scope.row.heart_wall_id)"
                  @confirm="withDraw(scope.row.heart_wall_id)"
                  v-show="String(scope.row.kind) === '0' && Number(scope.row.gift_income) >= 0.30"
                >
                  <div class="with-draw-btn" slot="reference">提现</div>
                </el-popconfirm>
                <div class="already-withdraw" v-show="String(scope.row.kind) === '1' && Number(scope.row.gift_income) >= 0.30">已提现</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import { getMusicIncomeListData } from '@/api/setting/activityIncome/activityIncomeData';
import { formatDate } from '@/utils/format';
import { withDrawOrderSongIncome } from '@/api/app/user';
import { mapState } from 'vuex';

export default {
  name: 'orderSong',
  components: {
    SubPage,
    MainCard,
    MyTable,
  },
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      liveId: (state) => state.liveId,
    }),
  },
  created() {
    this.getBoxList();
  },
  methods: {
    getBoxList() {
      getMusicIncomeListData().then((res) => {
        console.log('getMusicIncomeListData:', res);
        this.tableData = res.data.list;
      });
    },
    async withDraw(id) {
      console.log('对应id', id);
      const res = await withDrawOrderSongIncome(this.liveId, id);
      console.log('提现结果', res);
      if (res && res.msg && String(res.msg) === '提现成功') {
        this.$message.success('操作成功~');
        this.getBoxList();
        return;
      }
      this.$message.error('网络错误，请稍后重试~');
    },
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy/MM/dd hh:mm:ss');
    },
  },
};
</script>
<style lang="less" scoped>
.income-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .with-draw-btn {
    margin-left: 10px;
    color: #57afe4;
    text-decoration: underline;
    cursor: pointer;
  }
  .already-withdraw {
    margin-left: 10px;
    color: rgba(0, 0, 0, .4);
    text-decoration: underline;
    cursor: default;
  }
}
</style>
