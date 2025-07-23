<template>
  <sub-page>
    <main-card>
      <card-top-info title="开宝内定" style="position: relative">
        <div
          style="
            font-size: 13px;
            position: absolute;
            left: 112px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #8da1b4;
          "
        >
          (开宝箱红包墙内定)
        </div>
      </card-top-info>
      <!-- 列表 -->
      <div class="list-info-container" v-if="hasPurchase">
        <div class="signin-user-table">
          <div class="title">签到用户</div>
          <my-table style="height: auto; margin: 0px">
            <el-table
              :data="filterSigninUserList"
              highlight-current-row
              style="width: 100%"
              height="80vh"
              header-row-class-name="table-header"
            >
              <el-table-column type="index" min-width="50" align="center" header-align="center" label="序号"> </el-table-column>
              <el-table-column min-width="50" align="center" header-align="center" label="用户名">
                <template slot-scope="scope">
                  <div class="upload-img" style="display: flex; align-items: center; margin-left: 30%">
                    <img width="22" height="22" style="border-radius: 50%; margin-right: 5px" :src="scope.row.avator" />
                    <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ scope.row.wx_name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="50" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" disabled @click="setNeiding(scope.row)" v-if="scope.row.choosed">已内定</el-button>
                  <el-button size="mini" type="primary" @click="setNeiding(scope.row)" v-else>内定</el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
        <!-- right table -->
        <div class="neiding-user-table">
          <div class="title">内定用户</div>
          <my-table style="height: auto; margin: 0px">
            <el-table
              :data="rightUserList"
              highlight-current-row
              style="width: 100%"
              height="80vh"
              header-row-class-name="table-header"
              :cell-style="cellStyle"
            >
              <el-table-column type="index" min-width="50" align="center" header-align="center" label="序号"> </el-table-column>
              <el-table-column min-width="50" align="center" header-align="center" label="用户名">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="22" height="22" style="border-radius: 50%" :src="scope.row.avator" />
                    <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="50" align="center" prop="awardname" header-align="center" label="内定奖项"></el-table-column>
              <el-table-column label="操作" min-width="50" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="delateUser(scope.row.awardid)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
      </div>
      <div class="unPurchaseStatus" v-if="!hasPurchase">
        <div class="unPTxt">未开启</div>
        <img src="@/assets/image/qs.png" class="qsImg" />
        <div class="uPTip">暂无权限查看</div>
      </div>
      <!-- 签到列表内定用户弹框 -->
      <my-dialog :show="isShowEditDialog">
        <div class="editSigninUser-dialog-container">
          <div class="add-user-title" slot="title">
            <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
            <div class="text">内定用户</div>
          </div>
          <div class="form-box">
            <div class="user-header">
              <div class="title">用户头像</div>
              <img :src="chooseImg" class="preview" alt="" v-if="chooseImg" />
              <div class="no-img" v-else>
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <div class="username">
              <div class="title">用户名称:</div>
              <div class="text">{{ username }}</div>
            </div>
            <div class="select-award">
              <div class="title">中奖奖项</div>
              <el-select style="" v-model="selectedAwardType" placeholder="请选择中奖奖项">
                <el-option v-for="item in awardTypes" :key="item.id" :label="item.label" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="info" @click="cancelEdit" style="margin-left: 20px">取消</el-button>
            </div>
          </div>
        </div>
      </my-dialog>
    </main-card>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import myDialog from '@/components/myDialog';
import { getKbNeidings, getSignUser, lotteryListSetting, lotteryDelateOrEdit } from '@/api/setting/activitySetting/gameSetting';
import { getActivity } from '@/api/setting/activitySetting/theme';

export default {
  name: 'kbCustom',
  data() {
    return {
      // 下拉框中已选中的中奖奖项  存储的是奖项对应的id值
      selectedAwardType: '',
      // 中奖奖项
      awardTypes: [],
      // 签到人员列表
      signinUserList: [],
      // 自定义用户列表
      rightUserList: [],
      isShowEditDialog: false,
      chooseImg: '',
      username: '',
      userId: '',
      hasPurchase: false, // 功能是否开通
    };
  },
  created() {
    this.initData();
  },
  computed: {
    filterSigninUserList() {
      const choosedUser = this.rightUserList.map((item) => item.userId);
      const canChoosedUser = this.signinUserList.map((item) => {
        if (choosedUser.includes(item.userId)) {
          item.choosed = true;
        } else {
          item.choosed = false;
        }
        return item;
      });
      return canChoosedUser;
    },
  },
  methods: {
    /* 设置为内定 todo */
    setNeiding(obj) {
      console.log('当前内定对象:', obj);
      if (obj.choosed) {
        this.$message.error(`${obj.wx_name}已在内定名单中 不可重复添加`);
        return;
      }
      console.log('内定对象', obj);
      this.isShowEditDialog = true;
      this.username = obj.wx_name;
      this.chooseImg = obj.avator;
      this.userId = obj.userId;
    },
    /* 清除内定弹出框中的数据 */
    clearData() {
      this.selectedAwardType = '';
    },
    saveEdit() {
      if (!this.selectedAwardType) {
        this.$message.info('请选择中奖奖项');
        return;
      }
      const data = {
        award: `${this.selectedAwardType}`,
        gametype: '5',
        splid: this.$store.state.liveId,
        usertype: '2',
        avator: this.chooseImg,
        name: this.username,
        userId: this.userId,
      };
      console.log(data);
      lotteryListSetting(data).then((res) => {
        console.log(res);
        this.requestSigninList();
        this.requestRightList();
      });
      this.isShowEditDialog = false;
      this.clearData();
    },
    cancelEdit() {
      this.isShowEditDialog = false;
      this.clearData();
    },
    /* righttable移除用户 */
    delateUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            // liveId: this.$store.state.liveId,
            // prize_id: id,
            // is_delete: '1',
            splid: this.$store.state.liveId,
            awardid: id,
            removed: '1',
          };
          lotteryDelateOrEdit(data).then((res) => {
            if (res.code === 200) {
              console.log(res);
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.requestRightList();
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
    // 请求签到用户列表
    requestSigninList() {
      const data = {
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
      };
      getSignUser(data).then((res) => {
        console.log('签到用户列表', res);
        this.signinUserList = res.data.list;
      });
    },
    /* 请求自定义列表 */
    requestRightList() {
      const data = {
        splid: this.$store.state.liveId,
        gametype: '5',
        removed: '0',
        usertype: '2',
        currentPage: 1,
        showCount: '500',
      };
      getKbNeidings(data).then((res) => {
        console.log('内定用户列表：', res);
        this.rightUserList = res.data.list;
        Object.keys(res.data.game_select_map).forEach((item, index) => {
          this.awardTypes[index] = {
            id: item,
            label: res.data.game_select_map[item],
          };
        });
      });
    },
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tcolor = '';
      if (columnIndex === 2) {
        tcolor = 'color:#ff6260';
      }
      return tcolor;
    },
    initData() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log('活动信息:', res.data);
        this.hasPurchase = res.data.game_nd_switch === '1';
        if (this.hasPurchase) {
          this.requestRightList();
          this.requestSigninList();
        }
      });
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
  },
};
</script>
<style lang="less" scoped>
.neiding-user-table {
  .upload-img {
    display: flex;
    align-items: center;
    margin-left: 30px;
    img {
      margin-right: 5px;
    }
  }
}
.list-info-container {
  display: flex;
  justify-content: space-around;
  & > div {
    width: 43%;
    box-sizing: border-box;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 10px;
    }
  }
}
.editSigninUser-dialog-container {
  padding-bottom: 50px;
  .add-user-title {
    display: flex;
    align-items: center;
    .text {
      margin-left: 20px;
      font-size: 25px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #42474e;
    }
  }
  .form-box {
    > div {
      display: flex;
      align-items: center;
      margin-top: 30px;
      .title {
        width: 100px;
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
      }
    }
    .no-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
    }
    .preview {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
.unPurchaseStatus {
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .unPTxt {
    font-size: 32px;
    color: #fff;
    font-weight: 500;
    position: absolute;
    top: 17px;
  }
  .uPTip {
    font-size: 32px;
    color: #000;
    font-weight: 500;
    margin-top: 43px;
  }
  .qsImg {
    width: 549px;
    height: 344px;
  }
}
</style>
