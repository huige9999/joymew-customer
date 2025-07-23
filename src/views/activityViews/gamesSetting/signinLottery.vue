<template>
  <sub-page>
    <main-card>
      <card-top-info
        title="签到抽奖"
        style="position: relative"
      >
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
          (当前正在使用签到抽奖)
        </div>
        <!-- <div class="radio-container" style="position: absolute; right: 100px">
          <el-radio v-model="lotteryType" label="1">签到抽奖</el-radio>
          <el-radio v-model="lotteryType" label="2">名单抽奖</el-radio>
        </div> -->
      </card-top-info>
      <div class="header-container">
        <div class="peopleAmount">
          <div class="signin-user">签到用户({{ signinAmount }})</div>
          <div class="custom-user">自定义用户</div>
        </div>
        <!-- 查询 -->
        <div class="query-form-container">
          <div class="form-box">
            <el-form
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item label="用户名">
                <el-input
                  v-model="queryInfo.queryUsername"
                  placeholder="用户名"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit(queryInfo.queryUsername)"
                >
                  查询
                </el-button>
              </el-form-item>
              <el-form-item>
                <span class="label">开启内定抽奖测试</span>
                <el-tooltip
                  content="内定抽奖测试打开后，抽奖过程中用户将不会收到抽奖通知，中奖数据将不会显示在手机端"
                  placement="top"
                >
                  <i
                    class="label el-icon-question"
                    style="color: #409eff; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-switch
                  v-model="isArrangedLotteryTest"
                  @change="onIsArrangedLotteryTestChange"
                  style="margin-left: 10px"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="list-info-container">
        <div class="signin-user-table">
          <div class="title">签到用户</div>
          <my-table style="height: auto; margin: 0px">
            <el-table
              :data="filterSigninUserList"
              highlight-current-row
              style="width: 100%"
              height="80vh"
              header-row-class-name="table-header"
              v-loading="loading"
            >
              <el-table-column
                type="index"
                min-width="50"
                align="center"
                header-align="center"
                label="序号"
              ></el-table-column>
              <el-table-column
                min-width="50"
                align="center"
                header-align="center"
                label="用户名"
              >
                <template slot-scope="scope">
                  <div
                    class="upload-img"
                    style="display: flex; align-items: center; margin-left: 30%"
                  >
                    <img
                      width="22"
                      height="22"
                      style="border-radius: 50%; margin-right: 5px"
                      :src="scope.row.avator"
                    />
                    <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ scope.row.wx_name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="50"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    disabled
                    v-if="scope.row.choosed"
                  >
                    已内定
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="setNeiding(scope.row)"
                    v-else
                  >
                    内定
                  </el-button>
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
              <el-table-column
                type="index"
                min-width="50"
                align="center"
                header-align="center"
                label="序号"
              ></el-table-column>
              <el-table-column
                min-width="50"
                align="center"
                header-align="center"
                label="用户名"
              >
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img
                      width="22"
                      height="22"
                      style="border-radius: 50%"
                      :src="scope.row.avator"
                    />
                    <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                min-width="50"
                align="center"
                prop="awardname"
                header-align="center"
                label="内定奖项"
              ></el-table-column>
              <el-table-column
                label="操作"
                min-width="50"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="delateUser(scope.row.awardid)"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
      </div>
      <!-- 签到列表内定用户弹框 -->
      <my-dialog :show="isShowEditDialog">
        <div class="editSigninUser-dialog-container">
          <div
            class="add-user-title"
            slot="title"
          >
            <img
              src="@/assets/image/redPackageRain/hbyrecharge-logo.png"
              alt=""
              width="26"
              height="31"
            />
            <div class="text">内定用户</div>
          </div>
          <div class="tip">
            注意：当签到人数大于{{
              arrangedLotteryTestSignInCount
            }}人，您在操作测试内定中奖功能时，系统将会给已签到的来宾发送“抽奖开始”通知，来宾将在手机端看到内定中奖结果，建议您在签到人数小于{{
              arrangedLotteryTestSignInCount
            }}人测试内定中奖功能。
          </div>
          <div class="form-box">
            <div class="user-header">
              <div class="title">用户头像</div>
              <img
                :src="chooseImg"
                class="preview"
                alt=""
                v-if="chooseImg"
              />
              <div
                class="no-img"
                v-else
              >
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <div class="username">
              <div class="title">用户名称:</div>
              <div class="text">{{ username }}</div>
            </div>
            <div class="select-award">
              <div class="title">中奖奖项</div>
              <el-select
                style=""
                v-model="selectedAwardType"
                placeholder="请选择中奖奖项"
              >
                <el-option
                  v-for="item in awardTypes"
                  :key="item.id"
                  :label="item.lable"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div
              class="btn-group"
              style="padding-left: 145px"
            >
              <el-button
                type="primary"
                @click="saveEdit(selectedAwardType, username, chooseImg, userId)"
              >
                保存
              </el-button>
              <el-button
                type="info"
                @click="cancelEdit"
                style="margin-left: 20px"
              >
                取消
              </el-button>
            </div>
          </div>
        </div>
      </my-dialog>
    </main-card>
  </sub-page>
</template>
<script>
import { getPrizeList } from '@/api/setting/activityData/gameData';
import {
  getCustomAwardList,
  getSignUser,
  lotteryDelateOrEdit,
  lotteryListSetting,
  neidingLotteryList,
  reqSwitchArrangedLotteryTest,
} from '@/api/setting/activitySetting/gameSetting';
import { reqGetActivityDetail } from '@/api/setting/setting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import { mapState } from 'vuex';

export default {
  name: 'signinLottery',
  data() {
    return {
      queryInfo: {
        // 用于查询的用户
        queryUsername: '',
      },
      isArrangedLotteryTest: false,
      lotteryType: '1',
      queryUsername: '',
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
      loading: false,
    };
  },
  created() {
    this.requestRightList();
    this.requestSigninList();
    this.requestCustomData();
    this.getIsArrangedLotteryTest();
  },
  computed: {
    ...mapState({
      arrangedLotteryTestSignInCount: (state) => state.login.userInfo.arrangedLotteryTestSignInCount,
    }),
    signinAmount() {
      return this.signinUserList.length;
    },
    filterSigninUserList() {
      const choosedUser = this.rightUserList.filter((item) => !!item.userId).map((item) => item.userId);

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
    async getIsArrangedLotteryTest() {
      const res = await reqGetActivityDetail('isSwitchOnArrangedLotteryTest');
      this.isArrangedLotteryTest = res.data.isSwitchOnArrangedLotteryTest === '1';
    },
    async onIsArrangedLotteryTestChange(val) {
      try {
        const res = await reqSwitchArrangedLotteryTest(val);
        if (res.code !== 200) {
          throw new Error(res.msg || '设置抽奖内定测试开关状态失败');
        }
        this.$message.success(res.msg || '设置抽奖内定测试成功');
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /* 查询请求 */
    requestQuery(username) {
      const data = {
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '1000',
        wx_name: username, // 只传用户名
      };
      getSignUser(data).then((res) => {
        console.log('查询结果', res);
        this.signinUserList = res.data.list;
        this.$message.success('查询成功');
      }).catch(() => {
        this.$message.error('查询失败');
      });
    },
    onSubmit(wx_name) {
      this.requestQuery(wx_name);
    },
    /* 设置为内定 todo */
    setNeiding(obj) {
      console.log(obj);
      if (obj.choosed) {
        this.$message.error(`${obj.wx_name}已在内定名单中 不可重复添加`);
        return;
      }
      this.loading = true;
      getPrizeList({
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        category: '1',
      })
        .then((res) => {
          console.log('奖项列表', res);
          this.loading = false;
          const luckyUserList = res?.data?.varList ?? [];
          // 判断obj.userId在不在luckyUserList中
          const isExist = luckyUserList.some((item) => item.userId === obj.userId && !item.delete_time);
          if (isExist) {
            // 当前用户已经被抽过，提示不可以内定
            this.$message.error('不可以内定已中奖用户哦，如需内定已中奖用户，请先清空抽奖数据!');
          } else {
            // console.log('内定对象', obj);
            this.isShowEditDialog = true;
            this.username = obj.wx_name;
            this.chooseImg = obj.avator;
            this.userId = obj.userId;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('获取奖项列表失败');
          this.loading = false;
        });
    },
    /* 清除内定弹出框中的数据 */
    clearData() {
      this.selectedAwardType = '';
    },
    saveEdit(awardType, username, headImg, userId) {
      if (!awardType) {
        this.$message.info('请选择中奖奖项');
        return;
      }
      console.log(awardType);
      const data = {
        // prize: awardType + '',
        // kind: '1',
        // liveid: this.$store.state.liveId,
        // type: '2',
        // head_img: headImg,
        // name: username,
        // userId,
        award: `${awardType}`,
        gametype: '1',
        splid: this.$store.state.liveId,
        usertype: '2',
        avator: headImg,
        name: username,
        userId,
      };
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
          console.log('自定义奖项列表数据', res);
          const awardsList = res.data.list;
          awardsList.forEach((item) => {
            const obj = {};
            obj.lable = item.awardname;
            obj.id = item.cusaward_id;
            this.awardTypes.push(obj);
          });
        } else {
          console.error('自定义奖项列表数据获取失败');
        }
      });
    },
    /* 请求签到用户列表 */
    requestSigninList() {
      const data = {
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '1000',
      };
      getSignUser(data).then((res) => {
        console.log('签到用户列表', res);
        this.signinUserList = res.data.list;
      });
    },
    /* 请求自定义列表 */
    requestRightList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // kind: '1',
        // is_delete: '0',
        // type: '2',
        // currentPage: 1,
        // showCount: '500',
        splid: this.$store.state.liveId,
        gametype: '1',
        removed: '0',
        usertype: '2',
        currentPage: 1,
        showCount: '500',
        removed_val: '0',
      };
      neidingLotteryList(data).then((res) => {
        console.log(res, '0000000000000000000000000');
        this.rightUserList = res.data.list;
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
.header-container {
  display: flex;
  padding-left: 20px;
  .peopleAmount {
    display: flex;
    width: 250px;
    & > div {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      height: 38px;
      line-height: 38px;
      padding-left: 10px;
      padding-right: 10px;
      background: #ffffff;
      border-radius: 4px 0px 0px 4px;
      border: 1px solid #d9d9d9;
    }
    .signin-user {
      border-color: #1e87f0;
      color: #1e87f0;
    }
  }
  .query-form-container {
    display: flex;
    align-items: center;
    margin-left: 20px;
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
  display: grid;
  grid-template:
    'title title' min-content
    'form tip' 1fr
    / max-content 1fr;
  gap: 20px;

  .add-user-title {
    grid-area: title;
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

  .tip {
    grid-area: tip;
    color: #ff6260;
  }
  .form-box {
    grid-area: form;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    > div {
      display: flex;
      align-items: center;
      .title {
        width: 100px;
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
</style>
