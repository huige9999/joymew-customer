<template>
  <div class="swing-score-list-container">
    <div style="max-height: 400px; overflow-y: scroll">
      <my-table style="height: auto">
        <el-table :data="awardList" highlight-current-row style="width: 100%" header-row-class-name="table-header">
          <el-table-column min-width="100" label="名次" prop="rank" align="center" header-align="center"></el-table-column>
          <el-table-column min-width="100" label="奖项" prop="prize_name" align="center" header-align="center"></el-table-column>

          <el-table-column min-width="100" label="添加时间" prop="create_time" align="center" header-align="center"></el-table-column>
          <el-table-column label="操作" min-width="100" align="center" header-align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editAwardData(scope.row)">修改</el-button>

              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="'确定删除' + scope.row.prize_name + '吗？'"
                @confirm="deleteAwardData(scope.row)"
                @onConfirm="deleteAwardData(scope.row)"
                @cancel="() => {}"
                style="margin-left: 20px"
              >
                <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </div>
  </div>
</template>

<script>
import { getTQLAwardList, deleteTQLAward } from '@/api/tql/gameSetting';
import MyTable from '@/components/myTable';

export default {
  data() {
    return {
      awardList: [],
      currentPage: 1,
      showCount: 100,
      totalResult: 10,
    };
  },
  computed: {
    splid() {
      return this.$store.state.liveId;
    },
  },
  props: {
    kind: {
      type: String,
    },
  },
  created() {
    this.fetchTQLAwardList();
  },
  components: {
    MyTable,
  },
  methods: {
    fetchTQLAwardList() {
      const { splid, kind } = this;
      getTQLAwardList({
        splid,
        kind,
        currentPage: String(this.currentPage),
        showCount: String(this.showCount),
      })
        .then((res) => {
          res.data.list = res.data.list.map((item) => {
            item.create_time = item.create_time ? item.create_time.substr(0, 10) : '';
            return item;
          });
          this.totalResult = res.data.totalResult;
          this.awardList = res.data.list;
          this.$emit('input', this.awardList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteAwardData(row) {
      const { cusaward_id, splid } = row;
      deleteTQLAward({
        splid,
        cusaward_id,
      })
        .then((res) => {
          console.log(res);
          this.$message.success('删除成功');
          this.fetchTQLAwardList();
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('删除');
    },
    editAwardData(row) {
      console.log(row);
      this.$emit('editRow', row);
    },
  },
};
</script>
