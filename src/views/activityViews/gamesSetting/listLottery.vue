<!-- 已废弃待删除 -->
<template>
  <sub-page>
    <main-card>
      <card-top-info title="名单抽奖" style="position: relative">
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
          (当前正在使用名单抽奖)
        </div>
        <!-- <div class="radio-container" style="position: absolute; right: 100px">
          <el-radio v-model="lotteryType" label="1">签到抽奖</el-radio>
          <el-radio v-model="lotteryType" label="2">名单抽奖</el-radio>
        </div> -->
      </card-top-info>
      <!-- 查询表单 -->
      <div class="query-form-container" style="display: flex; margin-left: 30px">
        <div class="form-box">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户名">
              <el-input v-model="queryInfo.queryUsername" placeholder="请输入用户名" size="10"></el-input>
            </el-form-item>
            <el-form-item label="中奖奖项">
              <el-select v-model="queryInfo.querySelectAwardType" placeholder="全部" max-width="100">
                <el-option v-for="item in queryInfo.queryAwardTypes" :key="item.id" :label="item.lable" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button min-width="200" type="primary" @click="onSubmit(queryInfo.queryUsername, queryInfo.querySelectAwardType)">
                查询
              </el-button>
            </el-form-item>
            <el-form-item>
              <span class="label">开启内定抽奖测试</span>
              <el-tooltip content="内定抽奖测试打开后，抽奖过程中用户将不会收到抽奖通知，中奖数据将不会显示在手机端" placement="top">
                <i class="label el-icon-question" style="color: #409eff; cursor: pointer"></i>
              </el-tooltip>
              <el-switch v-model="isArrangedLotteryTest" @change="onIsArrangedLotteryTestChange" style="margin-left: 10px"></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tools">
        <el-button style="height: 39px; margin-left: 10px" type="primary" icon="el-icon-upload" @click="showImportDialog">
          导入名单
        </el-button>
        <!-- 点击生成数字按钮 -->
        <el-button style="height: 39px; margin-left: 10px" type="primary" @click="number">
          <span>点击生成数字</span>
        </el-button>
        <el-button style="height: 39px; margin-left: 10px" type="primary" @click="mutipleDelete" v-loading="isLoading">
          <span>批量删除</span>
        </el-button>
      </div>
      <!-- 名单列表 -->
      <div class="user-list-table-container">
        <my-table style="height: auto">
          <el-table
            :data="userList"
            highlight-current-row
            style="width: 100%"
            header-row-class-name="table-header"
            :cell-style="cellStyle"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="120" align="center" header-align="center" label="序号"></el-table-column>
            <el-table-column min-width="120" align="center" header-align="center" label="用户名">
              <template slot-scope="scope">
                <div class="upload-img">
                  <!-- <img width="22" height="22" style="border-radius:50%;" :src="scope.row.head_img" /> -->
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="内定奖项" prop="awardname" align="center" header-align="center"></el-table-column>
            <el-table-column label="操作" min-width="100" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditUserDialog(scope.row)">
                  编辑
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelateUser(scope.row.awardid)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </my-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage2"
            :page-sizes="[15, 25, 50, 100]"
            :page-size="currentPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
          ></el-pagination>
        </div>
        <!-- 手动添加按钮 -->
        <div class="addUserBtn" @click="showAddUserDialog">
          <span class="el-icon-plus" style="margin-right: 10px"></span>
          手动添加
        </div>
      </div>
      <!-- 生成数字弹出框 -->
      <my-dialog :show="isNumber">
        <div class="addUser-dialog-container">
          <div class="add-user-title" slot="title">
            <div class="text">生成数字</div>
          </div>
          <div class="form-box">
            <div class="username">
              <div class="title">范围</div>
              <el-input v-model="inputDown" placeholder="请输入" size="small">
                {{ inputDown }}
              </el-input>
              <div class="title" style="width: 100px; text-align: center">
                到
              </div>
              <el-input v-model="inputUp" placeholder="请输入" size="small">
                {{ inputUp }}
              </el-input>
              <el-checkbox v-model="checked" @change="change" style="margin-left: 10px">
                去除数字4
              </el-checkbox>
              <el-checkbox v-model="checked2" @change="change2">
                去除数字3
              </el-checkbox>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button type="primary" @click="saveNum(inputDown, inputUp)">
                确定
              </el-button>
              <el-button type="info" @click="cancelNum" style="margin-left: 20px">
                取消
              </el-button>
            </div>
          </div>
        </div>
      </my-dialog>
      <!-- 添加用户名单弹出框 -->
      <my-dialog :show="isShowAddUserDialog">
        <div class="addUser-dialog-container">
          <div class="add-user-title" slot="title">
            <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
            <div class="text">添加名单用户</div>
          </div>
          <div class="form-box">
            <div class="username">
              <div class="title">用户名称:</div>
              <el-input style="margin-left: 65px" v-model="username" placeholder="请输入内容"></el-input>
            </div>
            <div class="isNeiding">
              <div class="title">是否内定</div>
              <el-switch style="margin-left: 45px" v-model="isNeiding" active-color="#249AFF" inactive-color="#D5D9DF"></el-switch>
            </div>
            <div class="select-award" v-show="isNeiding">
              <div class="title">中奖奖项</div>
              <el-select style="margin-left: 45px" v-model="selectedAwardType" placeholder="请选择中奖奖项">
                <el-option v-for="item in awardTypes" :key="item.id" :label="item.lable" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button type="primary" @click="saveAdd(username, selectedAwardType)" v-loading="isLoading">
                保存
              </el-button>
              <el-button type="info" @click="cancelAdd" style="margin-left: 20px">
                取消
              </el-button>
            </div>
          </div>
        </div>
      </my-dialog>
      <!-- 导入名单弹出框 -->
      <my-dialog :show="isShowImportDialog">
        <div class="import-dialog-container">
          <div class="import-title" slot="title">
            <img src="@/assets/image/importList.png" alt="" width="34" height="29" />
            <div class="text">导入名单</div>
          </div>
          <div class="import-info">
            <div class="upload-temp">
              <div class="title">
                下载导入模板
                <span>(下载后请勿更改模板格式)</span>
              </div>
              <div class="btn">
                <el-button icon="el-icon-download" type="warning" @click="downloadTemplate">
                  下载
                </el-button>
              </div>
            </div>
            <div class="upload-file">
              <div class="title">
                上传名单文件
                <span>(提示：重新导入模板后将覆盖原有数据)</span>
              </div>
              <div class="btn">
                <el-upload name="uploadFile" :show-file-list="false" :http-request="handleFile" action accept="txt">
                  <el-button type="primary" icon="el-icon-upload2">
                    上传
                  </el-button>
                </el-upload>
              </div>
            </div>
            <div class="upload-success-text">您已成功上传：抽奖名单.xls</div>
            <div class="btn-group">
              <el-button type="primary" @click="confirmUpload">
                确认导入
              </el-button>
              <el-button type="info" @click="cancelUpload" style="margin-left: 20px">
                取消
              </el-button>
            </div>
          </div>
        </div>
      </my-dialog>
      <!-- 编辑用户弹出框 -->
      <my-dialog :show="isShowEditDialog">
        <div class="editUser-dialog-container">
          <div class="edit-user-title" slot="title">
            <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
            <div class="text">编辑名单用户</div>
          </div>
          <div class="tip">
            注意：当签到人数大于{{
              arrangedLotteryTestSignInCount
            }}人，您在操作测试内定中奖功能时，系统将会给已签到的来宾发送“抽奖开始”通知，来宾将在手机端看到内定中奖结果，建议您在签到人数小于{{
              arrangedLotteryTestSignInCount
            }}人测试内定中奖功能。
          </div>
          <div class="form-box">
            <div class="username">
              <div class="title">用户名称:</div>
              <el-input style="margin-left: 65px" v-model="editDialogData.editUsername" placeholder="请输入内容"></el-input>
            </div>
            <div class="isNeiding">
              <div class="title">是否内定</div>
              <el-switch
                style="margin-left: 45px"
                @change="switchIsChange"
                v-model="editDialogData.editIsNeiding"
                active-color="#249AFF"
                inactive-color="#D5D9DF"
              ></el-switch>
            </div>
            <div class="select-award" v-show="editDialogData.editIsNeiding">
              <div class="title">中奖奖项</div>
              <el-select style="margin-left: 45px" v-model="editDialogData.editSelectedAwardTypeID" @change="handleSelectChange">
                <el-option v-for="item in awardTypes" :key="item.id" :label="item.lable" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button
                type="primary"
                @click="saveEdit(editDialogData.editSelectedAwardTypeID, editDialogData.editUsername, editDialogData.prize_id)"
                v-loading="isLoading"
              >
                保存
              </el-button>
              <el-button type="info" @click="cancelEdit" style="margin-left: 20px">
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
import request from '@/utils/request';
import { mapState } from 'vuex';

export default {
  name: 'listLottery',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
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
      },
      // 是否开启抽奖内定测试
      isArrangedLotteryTest: false,
      // 名单抽奖列表
      userList: [],
      // 单选按钮设置抽奖类型
      lotteryType: '2',
      // 中奖奖项
      awardTypes: [],
      // 查询用户
      queryUsername: '',
      // 是否显示添加名单用户弹出框
      isShowAddUserDialog: false,
      // 是否显示导入名单弹出框
      isShowImportDialog: false,
      // 添加框中用户名称
      username: '',
      // 设置是否内定
      isNeiding: false,
      // 下拉框中已选中的中奖奖项  存储的是奖项对应的id值
      selectedAwardType: '',
      // 上传的文件
      tmpFile: '',
      // 编辑框是否弹出
      isShowEditDialog: false,
      // 编辑框中相关数据
      editDialogData: {
        editUsername: '',
        editSelectedAwardTypeID: '',
        editIsNeiding: true,
      },
      // 传输数字框
      isNumber: false,
      // 输入框传输数字
      inputDown: '0',
      inputUp: '0',
      // 数字类型
      radio: '1',
      checked: false,
      checked2: false,
      isRemove4: '',
      isRemove3: '',
      currentPage2: 1,
      currentPageSize: 15,
      totals: 1,
      multipleSelection: [],
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      arrangedLotteryTestSignInCount: (state) => state.login.userInfo.arrangedLotteryTestSignInCount,
    }),
  },
  created() {
    const logStyle = 'background: #39C5BB; padding: 2px 4px; border-radius: 2px;';
    console.log('%c arrangedLotteryTestSignInCount', logStyle, this.arrangedLotteryTestSignInCount);
    this.requestList();
    this.requestCustomData();
    this.getIsArrangedLotteryTest();
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
    /* 页数切换 */
    handleCurrentChange(val) {
      console.log(`currentPage2${val}`);
      this.currentPage2 = val;
      this.requestList();
    },
    /* 页大小切换 */
    handleSizeChange(val) {
      console.log(`currentPageSize${val}`);
      this.currentPageSize = val;
      this.requestList();
    },
    change() {
      if (this.checked === true) {
        this.isRemove4 = '1';
      } else if (this.checked === false) {
        this.isRemove4 = '0';
      }
    },
    change2() {
      if (this.checked === true) {
        this.isRemove3 = '1';
      } else if (this.checked === false) {
        this.isRemove3 = '0';
      }
    },
    /* 查询请求 */
    requestQuery(username, prizeId) {
      // 查询参数都不存在的情况
      if (!username && !prizeId) {
        this.requestList();
        return;
      }
      const data = {
        splid: this.$store.state.liveId,
        gametype: '2',
        removed: '0',
        currentPage: 1,
        showCount: '500',
        name: username,
        awardid: prizeId,
      };
      neidingLotteryList(data).then((res) => {
        console.log('query-list', res);
        this.userList = res.data.list;
        this.totals = res.data.totalResult;
        this.$message({
          message: '查询成功',
          type: 'success',
        });
      });
    },
    /* 确认上传提交按钮 */
    confirmUpload() {
      this.isShowImportDialog = false;
      this.requestList();
    },
    /* 取消上传按钮 */
    cancelUpload() {
      this.isShowImportDialog = false;
    },
    /* 显示文件上传 */
    showImportDialog() {
      this.isShowImportDialog = true;
    },
    /* 操作文件 */
    handleFile(e) {
      const fileName = e.file.name;
      // 类型判断
      const extName = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      console.log(extName);
      if (extName.indexOf('txt') > -1 || extName.indexOf('xlsx') > -1 || extName.indexOf('xls') > -1) {
        this.tmpFile = e.file;
        this.uploadNameSheet();
      } else {
        this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
      }
    },
    /* 上传文件请求接口 */
    uploadNameSheet() {
      const formData = new FormData();
      formData.append('file', this.tmpFile);
      formData.append('splid', this.$store.state.liveId);
      request
        .post('/neiDing/shangchuanMd', formData)
        .then((res) => {
          console.log(res);
          this.$message({
            message: '上传成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
        });
    },
    /* 点击查询 */
    onSubmit(username, prizeId) {
      this.requestQuery(username, prizeId);
      console.log('query');
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
            this.queryInfo.queryAwardTypes.push(obj);
          });
          this.queryInfo.queryAwardTypes.unshift({ lable: '全部', id: '' });
        } else {
          console.error('自定义奖项列表数据获取失败');
        }
      });
    },
    /* 显示编辑用户弹出框 */
    showEditUserDialog(currentUser) {
      this.isShowEditDialog = true;
      console.log('编辑对象', currentUser);
      this.editDialogData.editUsername = currentUser.name;
      if (currentUser.award) {
        this.editDialogData.editSelectedAwardTypeID = Number(currentUser.award);
        this.editDialogData.editIsNeiding = true;
      } else {
        this.editDialogData.editIsNeiding = false;
      }
      this.editDialogData.prize_id = currentUser.awardid;
      // if (currentUser.name) {
      //   this.editDialogData.editIsNeiding = true;
      // } else {
      //   this.editDialogData.editIsNeiding = false;
      // }
    },
    /* 监听编辑框中的开关状态发生改变的回调 */
    switchIsChange(e) {
      if (e === false) {
        this.editDialogData.editSelectedAwardTypeID = '';
      }
    },
    /* 确认编辑 */
    saveEdit(prize, username, prize_id) {
      // if (!prize) {
      //   this.$message.info('请选择中奖奖项');
      //   return;
      // }
      // prize 内定奖项的id prize_id 这一项数据的id
      console.log(prize);
      console.log(username);
      console.log(prize_id);
      // 内定开关打开的情况下中奖奖项一定要有值
      if (this.editDialogData.editIsNeiding && !prize) {
        this.$message.info('请选择中奖奖项');
        return;
      }

      this.isLoading = true;
      getPrizeList({
        splid: this.$store.state.liveId,
        currentPage: 1,
        showCount: '500',
        category: '2',
      })
        .then((res) => {
          console.log('奖项列表', res);
          this.isLoading = false;
          const luckyUserList = res?.data?.varList ?? [];
          if (luckyUserList.length > 0) {
            // this.$message.warning('不可以内定已中奖用户哦，如需内定已中奖用户，请先清空抽奖数据!');
            // 询问框
            this.$confirm('不可以内定已中奖用户哦，如需内定已中奖用户，请先清空抽奖数据!', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                const data = {
                  award: prize,
                  name: username,
                  splid: this.$store.state.liveId,
                  awardid: prize_id,
                };
                lotteryDelateOrEdit(data).then((res) => {
                  console.log(res);
                  if (res.code === 200) {
                    this.$message({
                      message: '修改用户成功',
                      type: 'success',
                    });
                    this.requestList();
                  } else {
                    this.$message({
                      message: '修改用户失败',
                      type: 'error',
                    });
                  }
                });
                this.isShowEditDialog = false;
                this.editDialogData.editUsername = '';
                this.editDialogData.editSelectedAwardTypeID = '';
              })
              .catch(() => {});
            return;
          }
          const data = {
            award: prize,
            name: username,
            splid: this.$store.state.liveId,
            awardid: prize_id,
          };
          lotteryDelateOrEdit(data).then((res) => {
            console.log(res);
            if (res.code === 200) {
              this.$message({
                message: '修改用户成功',
                type: 'success',
              });
              this.requestList();
            } else {
              this.$message({
                message: '修改用户失败',
                type: 'error',
              });
            }
          });
          this.isShowEditDialog = false;
          this.editDialogData.editUsername = '';
          this.editDialogData.editSelectedAwardTypeID = '';
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('获取奖项列表失败');
          this.isLoading = false;
        });
    },
    mutipleDelete() {
      if (this.isLoading) {
        return;
      }
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择需要删除的用户!');
        return;
      }
      this.isLoading = true;
      const awardidList = this.multipleSelection.map((item) => item.awardid);
      // 单个删除
      const singleDelete = (id) => {
        return new Promise((resolve, reject) => {
          const data = {
            splid: this.$store.state.liveId,
            awardid: id,
            removed: '1',
          };
          lotteryDelateOrEdit(data)
            .then((res) => {
              if (res.code === 200) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch((err) => {
              reject(err);
            });
        });
      };

      const asyncTasks = [];
      awardidList.forEach((item) => {
        asyncTasks.push(singleDelete(item));
      });
      Promise.all(asyncTasks)
        .then((res) => {
          console.log(res);
          // this.$message({
          //   message: '批量删除成功!',
          //   type: 'success',
          // });
          // this.isLoading = false;
          return this.requestList();
        })
        .then(() => {
          this.isLoading = false;
          this.$message({
            message: '批量删除成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('批量删除失败!');
          this.isLoading = false;
        });
    },
    requestMultiSave(pObj) {
      return lotteryDelateOrEdit({
        award: pObj.award,
        name: pObj.name,
        splid: this.$store.state.liveId,
        awardid: pObj.awardid,
      });
    },
    /* 取消编辑 */
    cancelEdit() {
      this.isShowEditDialog = false;
      this.editDialogData.editUsername = '';
      this.editDialogData.editSelectedAwardTypeID = '';
    },
    /* 确认删除 */
    confirmDelateUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
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
              this.requestList();
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
    /* 显示添加用户弹出框 */
    showAddUserDialog() {
      console.log('添加弹出');
      this.isShowAddUserDialog = true;
    },
    /* 确认添加用户接口请求并刷新列表 */
    requestSaveAdd(username, selectedAwardType) {
      const data = {
        // username,
        // kind: '2',
        // prize: selectedAwardType + '',
        // liveid: this.$store.state.liveId,
        // type: '0',
        name: username,
        gametype: '2',
        award: `${selectedAwardType}`,
        splid: this.$store.state.liveId,
        usertype: '0',
      };
      lotteryListSetting(data).then((res) => {
        console.log('添加用户成功', res);
        this.$message({
          message: '添加用户成功',
          type: 'success',
        });
        this.requestList();
      });
    },
    /* 确认添加用户 */
    saveAdd(username, selectedAwardType) {
      if (username) {
        if (this.isNeiding) {
          if (selectedAwardType) {
            this.requestSaveAdd(username, selectedAwardType);
            this.isShowAddUserDialog = false;
            this.clearAddData();
          } else {
            this.$message({
              message: '请完善所有信息!',
              type: 'error',
            });
          }
        } else {
          // 请求
          this.requestSaveAdd(username, selectedAwardType);
          this.isShowAddUserDialog = false;
          this.clearAddData();
        }
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    /* 取消添加数据 */
    cancelAdd() {
      this.isShowAddUserDialog = false;
      this.clearAddData();
    },
    /* 提交或取消添加以后清除数据 */
    clearAddData() {
      this.username = '';
      this.isNeiding = false;
      this.selectedAwardType = '';
    },
    /* 请求内定名单抽奖数据 */
    requestList() {
      return new Promise((resolve, reject) => {
        const data = {
          splid: this.$store.state.liveId,
          gametype: '2',
          removed: '0',
          currentPage: this.currentPage2,
          showCount: this.currentPageSize,
        };
        neidingLotteryList(data)
          .then((res) => {
            if (res.code === 200) {
              this.userList = res.data.list;
              this.totals = res.data.totalResult;
              console.log('内定名单抽奖列表', res);
              resolve(res);
            } else {
              console.error('内定名单抽奖列表获取失败');
              reject();
            }
          })
          .catch((err) => {
            reject(err);
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
    /* 编辑框中监听下拉框选项 */
    handleSelectChange(e) {
      console.log(e);
      this.editDialogData.editSelectedAwardTypeID = e;
    },
    //---------------------------
    /* 显示添加用户弹出框 */
    number() {
      this.isNumber = true;
    },
    /* 确认向后台传输数据 */
    saveNum(inputDown, inputUp) {
      const obj = {
        splid: this.$store.state.liveId,
        start: inputDown.toString(),
        end: inputUp.toString(),
        isRemove4: this.isRemove4,
        isRemove3: this.isRemove3,
      };
      console.log(obj);
      request.post('/neiDing/newShengChengNumber', obj).then((res) => {
        this.clearAddData();
        console.log(res);
        this.$message({
          message: '添加用户成功',
          type: 'success',
        });
        this.requestList();
      });

      this.isNumber = false;
    },
    cancelNum() {
      this.isNumber = false;
      // this.clearAddData();
    },
    // 数字增减
    down() {
      if (this.inputDown > 0) {
        this.inputDown--;
      }
    },
    up() {
      if (this.inputDown < this.inputUp - 1) this.inputDown++;
    },
    sub() {
      if (this.inputUp > 0) {
        this.inputUp--;
      }
    },
    add() {
      this.inputUp++;
    },
    downloadTemplate() {
      window.location.href = 'https://www.hudongmiao.com/reportFormsHm/findReportInfo?report_type=list_prize';
    },
    handleSelectionChange(e) {
      console.log(e);
      this.multipleSelection = e;
    },
  },
};
</script>
<style lang="less">
.produceNum {
  width: 5%;
  margin: 30px auto;
  height: 36px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  display: inline-block;
}

.addUserBtn {
  color: #1e87f0;
  width: 96%;
  margin: 30px auto;
  height: 29px;
  border: 1px dashed #1e87f0;
  text-align: center;
  line-height: 29px;
  cursor: pointer;
}

.tools {
  padding-left: 20px;
  display: flex;
}

/* 添加用户名单弹出框 */
.addUser-dialog-container {
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
  }
}

/* 导入名单弹出框 */
.import-dialog-container {
  padding-bottom: 30px;

  .import-title {
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

  .import-info {
    position: relative;
    margin-left: 55px;

    &::after {
      position: absolute;
      width: 1px;
      height: 100px;
      background: #d8d8d8;
    }

    & > div {
      .title {
        font-size: 14px;
        line-height: 50px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 600;
        color: #333333;

        span {
          margin-left: 10px;
          color: #fa3e3e;
          font-size: 14px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 600;
        }
      }
    }

    .upload-temp {
      position: relative;
      margin-top: 20px;

      &::after {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #d8d8d8;
        border-radius: 50%;
      }
    }

    .upload-file {
      position: relative;
      margin-top: 35px;

      &::after {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #d8d8d8;
        border-radius: 50%;
      }
    }

    .upload-success-text {
      margin-top: 8px;
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }

    .btn-group {
      margin-top: 50px;
    }
  }
}

/* 编辑用户弹出框 */
.editUser-dialog-container {
  padding-bottom: 50px;

  display: grid;
  grid-template:
    'title title' min-content
    'form tip' 1fr
    / max-content 1fr;
  gap: 20px;

  .edit-user-title {
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
  }
}

.pagination-container {
  padding: 20px;
}
</style>
