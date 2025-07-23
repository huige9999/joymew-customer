<!--签到嘉宾-->
<template>
  <sub-page class="signIn">
    <main-card class="main" style="height: auto">
      <div class="singInInfo">
        <card-top-info title="">
          <my-tip-bar colorStyle="yellow" class="warning">
            <span>签到用户超过5人后，将不可进行删除，请谨慎测试</span>
          </my-tip-bar>
        </card-top-info>
      </div>

      <div class="searchInfo">
        <div class="signed">
          <span
            >已签到人数<label>{{ totalResult }}</label
            >人</span
          >
        </div>
        <div class="search">
          <label>昵称：</label>
          <el-input v-model="query" size="mini" placeholder="请输入内容" class="myIpt"></el-input>
          <el-button size="mini" type="primary" @click="queryUserList">查询</el-button>
        </div>
      </div>

      <my-table class="myTable" style="height: auto">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="table-header">
          <el-table-column type="index" label="编号" width="120" align="center" header-align="center"> </el-table-column>
          <el-table-column prop="name" min-width="130" align="center" header-align="center" label="姓名">
            <template slot-scope="scope">
              <div class="uploadImg">
                <img :src="scope.row.avator" width="22" height="22" alt="" />
                <span class="text">{{ scope.row.wx_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bless_str" label="祝福语" align="center" header-align="center" min-width="120"></el-table-column>
          <el-table-column prop="phonenumber" label="手机" min-width="120" align="center" header-align="center"></el-table-column>
          <el-table-column prop="needs" label="需求" min-width="120" align="center" header-align="center" v-if="isDz"></el-table-column>
          <el-table-column label="日期" align="center" header-align="center" min-width="120">
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="opt" label="操作" min-width="60">
            <template slot-scope="scope">
              <el-link type="primary" @click="removeUser(scope.row.userId)">删除</el-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template class="btnblock" slot-scope="scope">
              <div>{{ scope.row.isBlack === '0' ? '未拉黑' : '已拉黑' }}</div>
              <el-switch
                v-model="tableData[scope.$index].isBlack"
                active-value="1"
                inactive-value="0"
                active-color="#ff4949"
                inactive-color="#13ce66"
                @change="moveblack(scope.row.userId, tableData[scope.$index].isBlack === '0' ? '0' : '1')"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="评分权限" align="center">
            <template class="btnblock" slot-scope="scope">
              <div>{{ scope.row.isPlayerPermission === '0' ? '无权限' : '有权限' }}</div>
              <el-switch
                v-model="tableData[scope.$index].isPlayerPermission"
                active-value="1"
                inactive-value="0"
                @change="movePlayerPermission(scope.row.userId, tableData[scope.$index].isPlayerPermission === '0' ? '0' : '1')"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <!-- 导出报表 -->
        <export-table :URL="downLoadURL"> </export-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import { getSignInList, movePlayerPermission, movetoblack, removeUserData } from '@/api/setting/activityData/gameData';
import CardTopInfo from '@/components/cardTopInfo';
import ExportTable from '@/components/exportTable';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import MyTipBar from '@/components/myTipBar';
import SubPage from '@/components/subPage';
import { formatDate } from '@/utils/format';
import { BASEURL } from '@/utils/request';

const LABELLIST = [
  {
    id: '0',
    name: '婚纱照',
  },
  {
    id: '1',
    name: '婚纱礼服',
  },
  {
    id: '2',
    name: '婚礼布置',
  },
  {
    id: '3',
    name: '暂时不需要',
  },
];

export default {
  name: 'signIn',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTipBar,
    MyTable,
    ExportTable,
  },
  data() {
    return {
      tableData: [],
      query: '',
      // state: '1',
      // 签到人数
      totalResult: '',
      downLoadURL: '#',
      isDz: false,
    };
  },
  created() {
    const { liveId } = this.$store.state;
    this.getTableList();
    this.downLoadURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=sign_in_report`;
  },
  methods: {
    // 拉黑
    moveblack(id, block) {
      const data = {
        userId: id,
        splid: this.$store.state.liveId,
        type: block,
      };
      movetoblack(data).then((res) => {
        console.log(res);
        console.log(block);
      });
    },
    // 设置评分权限
    movePlayerPermission(id, block) {
      movePlayerPermission({
        splid: this.$store.state.liveId,
        type: block,
        userId: id,
      }).then((res) => {
        console.log(res);
        console.log(block);
      });
    },
    // 查询用户数据
    queryUserList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        // renickname: this.query,
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '1000',
        wx_name: this.query,
      };
      getSignInList(data)
        .then((res) => {
          if (res.code === 200) {
            console.log(res);
            this.$message({
              type: 'success',
              message: '查询成功!',
            });
          }
          if (res.data.list.length > 0) {
            this.tableData = res.data.list;
            if (res.data.list[0].phonenumber && res.data.list[0].phonenumber.indexOf('dz') > -1) {
              // 定制的特殊情况处理
              this.isDz = true;
              this.tableData = res.data.list.map((item) => {
                return {
                  ...item,
                  phonenumber: item.phonenumber.split('dz')[0],
                  needs: this.mapLabelName(item.phonenumber.split('dz')[1]),
                };
              });
            } else {
              this.tableData = res.data.list;
            }
          }
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
          console.log(e);
        });
    },
    // 获取表格数据
    getTableList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // currentPage: 1,
        // showCount: '500',
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
      };
      getSignInList(data)
        .then((res) => {
          console.log('列表数据', res);
          if (res.data.list.length > 0) {
            this.tableData = res.data.list;
            if (res.data.list[0].phonenumber && res.data.list[0].phonenumber.indexOf('dz') > -1) {
              // 定制的特殊情况处理
              this.isDz = true;
              this.tableData = res.data.list.map((item) => {
                return {
                  ...item,
                  phonenumber: item.phonenumber.split('dz')[0],
                  needs: this.mapLabelName(item.phonenumber.split('dz')[1]),
                };
              });
            } else {
              this.tableData = res.data.list;
            }
          }
          this.totalResult = res.data.totalResult;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 删除用户数据userId
    removeUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            // liveId: this.$store.state.liveId,
            // userId: id,
            splid: this.$store.state.liveId,
            userId: id,
          };
          removeUserData(data).then((res) => {
            if (res.code === 200) {
              console.log('删除', res);
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getTableList();
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
    mapLabelName(id) {
      let tmpName = '';
      for (let i = 0; i < 4; i += 1) {
        if (LABELLIST[i].id === id) {
          tmpName = LABELLIST[i].name;
          break;
        }
      }
      return tmpName;
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
.main {
  .singInInfo {
    display: flex;
    .warning {
      margin-left: 50px;
      span {
        padding-right: 150px;
        color: red;
        margin-left: 8px;
      }
    }
  }
  .searchInfo {
    display: flex;
    align-items: center;
    .signed {
      width: 156px;
      height: 40px;
      background: #e6f7ff;
      border: 1px solid #bae7ff;
      margin-left: 17px;
      border-radius: 3px;
      line-height: 40px;
      span {
        padding-left: 12px;
        label {
          padding: 0px 5px 0px 12px;
          font-size: 22px;
          font-weight: 500;
          color: #1e87f0;
        }
      }
    }
    .search {
      display: flex;
      margin-left: 29px;
      label {
        flex: 1 0 auto;
        display: flex;
        align-items: center;
      }
      .el-button {
        margin-left: 30px;
      }
    }
  }
  .myTable {
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
}
</style>
