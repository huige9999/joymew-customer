<!--中奖记录-->
<template>
  <sub-page class="reward">
    <main-card>
      <card-top-info title="中奖记录"></card-top-info>
      <el-button-group>
        <el-button size="mini" @click="signLottery" :autofocus="true">
          签到抽奖
          <span>( {{ signTableData.length }} 人 )</span>
        </el-button>
        <el-button size="mini" @click="listLottery" :autofocus="true">
          名单抽奖
          <span>( {{ listTableData.length }} 人 )</span>
        </el-button>
      </el-button-group>
      <!-- 用户信息查找 -->
      <div class="query-form-container">
        <div class="form-box">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户名">
              <el-input v-model="queryInfo.queryUsername" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="是否已删除">
              <el-select v-model="queryInfo.notdraw" placeholder="">
                <el-option v-for="(item, index) in queryInfo.notdrawTypes" :key="index" :label="item.lable" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="中奖奖项">
              <el-select v-model="queryInfo.querySelectAwardType" placeholder="中奖奖项">
                <el-option v-for="(item, index) in queryInfo.queryAwardTypes" :key="index" :label="item.lable" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格组件 -->
      <my-table class="mytable" style="height: auto">
        <el-table :data="kind === 'sign' ? signTableData : listTableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="wx_name" label="姓名" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <div class="uploadImg">
                <!-- <el-avatar :size="22" :src="scope.row.headImg_url"> </el-avatar> -->
                <img v-if="kind === 'sign' ? true : false" width="22" height="22" :src="scope.row.avator" />
                <span class="text">{{ scope.row.wx_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="awardname" label="奖项" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="prize_name" label="奖品" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column label="领奖状态" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.hexiao === '0'" style="color: red">
                未领奖
              </div>
              <div v-else style="color: #409EFF">
                已领奖
              </div>
            </template>
          </el-table-column>
          <el-table-column label="删除状态" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.notdraw === '1'" style="color: red">
                已删除
              </div>
              <div v-else style="color: #409EFF">
                未删除
              </div>
            </template>
          </el-table-column>

          <el-table-column label="删除时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ scope.row.delete_time || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" min-width="60" align="center" header-align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click="removeUser(scope.row.id)">删除</el-link>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 导出报表 -->
        <export-table :URL="downLoadURL"></export-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import { getPrizeList, removeUserWinningRecordData } from '@/api/setting/activityData/gameData';
import { getCustomAwardList } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import ExportTable from '@/components/exportTable';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';

export default {
  name: 'messageAudit',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    ExportTable,
  },
  data() {
    return {
      queryInfo: {
        // 用于查询的用户
        queryUsername: '',
        // 用于查询的下拉框中的奖项数据
        queryAwardTypes: [],

        // 用于查询的下拉框已选中奖项  存储的是奖项对应的id值
        querySelectAwardType: '',
        downLoadURL: '#',
        notdraw: '',
        notdrawTypes: [
          {
            id: '',
            lable: '全部',
          },
          {
            id: '0',
            lable: '未删除',
          },
          {
            id: '1',
            lable: '已删除',
          },
        ],
      },
      // 表格数据
      tableData: [],
      // 签到抽奖表格数据
      signTableData: [],
      // 列表抽奖表格数据
      listTableData: [],
      // 类型  默认签到抽奖类型   sign list
      kind: 'sign',
    };
  },
  created() {
    this.requestCustomData();
    this.requestSignTable();
    this.requestListTable();
    const { liveId } = this.$store.state;
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=lottery_report&notdraw=0`;
  },
  methods: {
    /* 获取自定义奖项列表(获取所有中奖奖项名称) */
    requestCustomData() {
      const data = {
        splid: this.$store.state.liveId,
        removed: '0',
        kind: '1',
        currentPage: '1',
        showCount: '500',
      };
      getCustomAwardList(data).then((res) => {
        if (res.code === 200) {
          console.log('自定义奖项列表数据', res.data.list);
          const awardsList = res.data.list;
          awardsList.forEach((item) => {
            const obj = {};
            obj.lable = item.awardname;
            obj.id = item.cusaward_id;
            this.queryInfo.queryAwardTypes.push(obj);
          });
          this.queryInfo.queryAwardTypes.unshift({ lable: '全部', id: '' });
        } else {
          console.error('自定义奖项列表数据获取失败');
        }
      });
    },
    /* 签到列表数据 */
    requestSignTable() {
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // is_delete: '0',
        // kind: '1',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        // notdraw: '0',
        category: '1',
      };
      getPrizeList(data).then((res) => {
        console.log('signLotter table data', res.data.varList);
        this.signTableData = res.data.varList;
      });
    },
    /* 名单列表数据 */
    requestListTable() {
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // is_delete: '0',
        // kind: '2',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        // notdraw: '0',
        category: '2',
      };
      getPrizeList(data).then((res) => {
        console.log('listLotter table data', res.data.varList);
        this.listTableData = res.data.varList;
      });
    },
    /* 签到抽奖点击事件 */
    signLottery() {
      this.requestSignTable();
      this.kind = 'sign';
    },
    /* 名单抽奖点击事件 */
    listLottery() {
      this.requestListTable();
      this.kind = 'list';
    },
    /* 查询按钮点击 */
    onSubmit() {
      this.queryUserList();
    },
    // 查询用户列表  判断当前的数据的类型 sign list
    queryUserList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // renickname: this.queryInfo.queryUsername,
        // type: this.queryInfo.querySelectAwardType,
        // kind: this.kind === 'sign' ? '1' : '2',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        wx_name: this.queryInfo.queryUsername,
        grade: this.queryInfo.querySelectAwardType,
        category: this.kind === 'sign' ? '1' : '2',
        notdraw: this.queryInfo.notdraw,
      };
      getPrizeList(data).then((res) => {
        console.log('查询列表数据', res);
        if (this.kind === 'sign') {
          this.signTableData = res.data.varList;
        } else {
          this.listTableData = res.data.varList;
        }
      });
    },
    // 删除用户数据
    removeUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            // liveId: this.$store.state.liveId,
            // is_delete: '1',
            // id,
            liveId: this.$store.state.liveId,
            notdraw: '1',
            id,
          };
          removeUserWinningRecordData(data).then((res) => {
            if (res.code === 200) {
              console.log('删除中奖人', res);
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.requestListTable();
              this.getPrizeData();
              this.nameDraw();
              this.signInDraw();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 签到抽奖
    signInDraw() {
      this.type1 = 'primary';
      this.type2 = '';
      if (this.type1 === 'primary') {
        this.type2 = '';
      } else {
        this.type2 = 'primary';
      }
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // is_delete: '0',
        // // 奖项类型
        // type: '',
        // kind: '2',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        // notdraw: '0',
        // 奖项类型
        grade: '',
        category: '2',
      };
      getPrizeList(data).then((res) => {
        console.log('获取id列表数据2', res);
        this.signInDrawAmount = res.data.totalResult;
        this.tableData = res.data.varList;
      });
    },
    // 名单抽奖
    nameDraw() {
      this.type2 = 'primary';
      this.type1 = '';
      if (this.type2 === 'primary') {
        this.type1 = '';
      } else {
        this.type1 = 'primary';
      }
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // is_delete: '0',
        // // 奖项类型
        // type: '',
        // kind: '1',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        // notdraw: '0',
        // 奖项类型
        grade: '',
        category: '2',
      };
      getPrizeList(data)
        .then((res) => {
          console.log('获取id列表数据2', res);
          this.nameDrawAmount = res.data.totalResult;
          this.tableData = res.data.varList;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 改变自定义下拉奖项列表数据
    changePrizeItem(prizeType) {
      this.getPrizeData(prizeType);
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
.main-card {
  .el-button-group {
    margin-left: 18px;
    .el-button {
      span {
        padding: 8px;
      }
    }
  }
  .seekPrize {
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-left: 18px;
    .name {
      flex: 0 0 57px;
    }
    .el-input::v-deep {
      width: 149px;
    }
    .prize {
      margin-left: 19px;
      flex: 0 0 70px;
    }
  }
}
.query-form-container {
  margin-left: 18px;
  margin-top: 20px;
}
.mytable {
  .uploadImg {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
