<template>
  <sub-page>
    <main-card>
      <card-top-info title="照片抽奖" style="position: relative">
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
          (当前正在使用照片抽奖)
        </div>
      </card-top-info>
      <div class="header-container">
        <div class="peopleAmount">
          <div class="custom-user">自定义用户({{ peopleAmount }})</div>
        </div>
        <!-- 查询 -->
        <div class="query-form-container">
          <div class="form-box">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="用户名">
                <el-input v-model="queryInfo.queryUsername" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item label="中奖奖项">
                <el-select v-model="queryInfo.querySelectAwardType" placeholder="全部">
                  <el-option v-for="item in queryInfo.queryAwardTypes" :key="item.id" :label="item.lable" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit(queryInfo.queryUsername, queryInfo.querySelectAwardType)">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="openPopup">批量上传</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="user-list-table-container">
        <my-table style="height: auto">
          <el-table :data="userList" highlight-current-row style="width: 100%" header-row-class-name="table-header" :cell-style="cellStyle">
            <!-- el-table height="350" -->
            <el-table-column type="index" width="120" align="center" header-align="center" label="序号"> </el-table-column>
            <el-table-column min-width="130" align="center" header-align="center" label="用户名">
              <template slot-scope="scope">
                <div class="upload-img">
                  <img width="22" height="22" style="border-radius: 50%" :src="scope.row.avator" />
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="内定奖项" prop="awardname" align="center" header-align="center"> </el-table-column>
            <el-table-column label="操作" min-width="100" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditUserDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelateUser(scope.row.awardid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </my-table>
        <!-- 手动添加按钮 -->
        <div class="addUserBtn" @click="showAddUserDialog">
          <span class="el-icon-plus" style="margin-right: 10px; color: #1e87f0"></span>手动添加
        </div>
      </div>
      <!-- 添加用户名单弹出框 -->
      <my-dialog :show="isShowAddUserDialog">
        <div class="addUser-dialog-container">
          <div class="add-user-title" slot="title">
            <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
            <div class="text">添加名单用户</div>
          </div>
          <div class="form-box">
            <div class="user-header">
              <div class="title">用户照片</div>
              <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleAddFile" action>
                <img :src="chooseImg" class="preview" alt v-if="chooseImg" />
                <div class="no-img" v-else>
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
            </div>
            <div class="username">
              <div class="title">用户名称:</div>
              <el-input style="margin-left: 65px" v-model="username" placeholder="请输入内容"></el-input>
            </div>
            <div class="isNeiding">
              <div class="title">是否内定</div>
              <el-switch style="margin-left: 45px" v-model="isNeiding" active-color="#249AFF" inactive-color="#D5D9DF"> </el-switch>
            </div>
            <div class="select-award" v-show="isNeiding">
              <div class="title">中奖奖项</div>
              <el-select style="margin-left: 45px" v-model="selectedAwardType" placeholder="请选择中奖奖项">
                <el-option v-for="item in awardTypes" :key="item.id" :label="item.lable" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button type="primary" @click="saveAdd(chooseImg, username, selectedAwardType)">保存</el-button>
              <el-button type="info" @click="cancelAdd" style="margin-left: 20px">取消</el-button>
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
          <div class="form-box">
            <div class="user-header">
              <div class="title">用户照片</div>
              <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleEditFile" action>
                <img :src="editDialogData.editChooseImg" class="preview" alt v-if="editDialogData.editChooseImg" />
                <div class="no-img" v-else>
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
            </div>
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
              >
              </el-switch>
            </div>
            <div class="select-award" v-show="editDialogData.editIsNeiding">
              <div class="title">中奖奖项</div>
              <el-select
                style="margin-left: 45px"
                v-model="editDialogData.editSelectedAwardTypeID"
                placeholder="请输入内容"
                @change="handleSelectChange"
              >
                <el-option v-for="item in awardTypes" :key="item.id" :label="item.lable" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button
                type="primary"
                @click="
                  saveEdit(
                    editDialogData.editChooseImg,
                    editDialogData.editSelectedAwardTypeID,
                    editDialogData.editUsername,
                    editDialogData.prize_id
                  )
                "
                >保存</el-button
              >
              <el-button type="info" @click="cancelEdit" style="margin-left: 20px">取消</el-button>
            </div>
          </div>
        </div>
      </my-dialog>
      <!-- 批量上传弹出区域 -->
      <transition
        enter-active-class="animate__animated animate__faster animate__fadeIn"
        leave-active-class="animate__animated animate__faster animate__fadeOut"
      >
        <div class="uploadPopArea" v-show="popupVisible">
          <div class="uploadBox">
            <div class="head">
              <div class="name">批量上传图片</div>
              <img src="@/assets/image/close.png" class="closeIcon" @click="closePopup" />
            </div>
            <div class="content">
              <div class="upload-img-wrap">
                <!-- 上传图片 -->
                <el-upload
                  drag
                  action
                  multiple
                  :http-request="handleBgFile"
                  :file-list="fileList"
                  list-type="picture"
                  :on-remove="handleRemove"
                  :show-file-list="true"
                  class="uploadImg"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将图片拖到此处，或
                    <em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main-card>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import myDialog from '@/components/myDialog';
import { neidingLotteryList, getCustomAwardList, lotteryDelateOrEdit, lotteryListSetting } from '@/api/setting/activitySetting/gameSetting';
import request from '@/utils/request';

export default {
  name: 'customUser',
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
      lotteryType: '1',
      queryUsername: '',
      // 下拉框中已选中的中奖奖项  存储的是奖项对应的id值
      selectedAwardType: '',
      // 中奖奖项
      awardTypes: [],
      // 签到人员列表
      userList: [],
      isShowAddUserDialog: false,
      isShowEditDialog: false,
      currentEdit: {},
      // 添加弹出框中
      username: '',
      isNeiding: false,
      // 编辑框中相关数据
      editDialogData: {
        editUsername: '',
        editSelectedAwardTypeID: '',
        editIsNeiding: true,
        editChooseImg: '',
      },
      chooseImg: '',
      popupVisible: false,
      // 批量上传相关
      fileList: [],
    };
  },
  computed: {
    peopleAmount() {
      return this.userList.length;
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
  },
  created() {
    this.requestList();
    this.requestCustomData();
  },
  methods: {
    /* 查询请求 */
    requestQuery(username, prizeId) {
      const data = {
        // liveId: this.$store.state.liveId,
        // kind: '1',
        // is_delete: '0',
        // type: '1',
        // currentPage: 1,
        // showCount: '500',
        // username,
        // custom_prize_id: prizeId,
        splid: this.$store.state.liveId,
        gametype: '6',
        removed: '0',
        // usertype: '1',
        currentPage: 1,
        showCount: '5000',
        name: username,
        awardid: prizeId,
      };
      neidingLotteryList(data).then((res) => {
        console.log('query-list', res);
        this.userList = res.data.list;
        this.$message({
          message: '查询成功',
          type: 'success',
        });
      });
    },
    /* 处理上传图片文件 */
    handleAddFile(e) {
      // console.log(e)
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      // console.log('freader',freader)
      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestAddUploadFile();
      };
    },
    handleEditFile(e) {
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      // console.log('freader',freader)
      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestEditUploadFile();
      };
    },
    requestEditUploadFile() {
      // base 64 转换成file
      // 这里对base64 进行压缩
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.chooseImg;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);
        request
          .post('/beiJing/shangchuanTomcat', formData)
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功！',
              type: 'success',
            });
            this.editDialogData.editChooseImg = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败！');
          });
      };
    },
    requestAddUploadFile() {
      // base 64 转换成file
      // 这里对base64 进行压缩
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.chooseImg;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);
        request
          .post('/beiJing/shangchuanTomcat', formData)
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功！',
              type: 'success',
            });
            this.chooseImg = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败！');
          });
      };
    },
    requestMultiAddUploadFile(cImg) {
      return new Promise((resolve, reject) => {
        // base 64 转换成file
        // 这里对base64 进行压缩
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = cImg;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.clearRect(0, 0, img.width, img.height);
          context.drawImage(img, 0, 0, img.width, img.height);
          const result = canvas.toDataURL('image/jpeg', 0.7);

          // 转换成 file
          const formData = new FormData();
          const arr = result.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'photo');
          formData.append('file', file);
          request
            .post('/beiJing/shangchuanTomcat', formData)
            .then((res) => {
              console.log(res);
              resolve(res.data.filePath);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        };
      });
    },
    /* 点击查询 */
    onSubmit(username, prizeId) {
      this.requestQuery(username, prizeId);
      console.log('query');
    },
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tcolor = '';
      if (columnIndex === 2) {
        tcolor = 'color:#ff6260';
      }
      return tcolor;
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
    requestList() {
      const data = {
        // liveId: this.$store.state.liveId,
        // kind: '1',
        // is_delete: '0',
        // type: '1',
        // currentPage: 1,
        // showCount: '500',
        splid: this.$store.state.liveId,
        gametype: '6',
        removed: '0',
        // usertype: '1',
        currentPage: 1,
        showCount: '5000',
      };
      neidingLotteryList(data).then((res) => {
        console.log(res);
        this.userList = res.data.list;
      });
    },
    showAddUserDialog() {
      this.isShowAddUserDialog = true;
    },
    /* 显示编辑用户弹出框 */
    showEditUserDialog(currentUser) {
      this.isShowEditDialog = true;
      this.editDialogData.editUsername = currentUser.name;
      if (currentUser.award) {
        this.editDialogData.editSelectedAwardTypeID = Number(currentUser.award);
        this.editDialogData.editIsNeiding = true;
      } else {
        this.editDialogData.editIsNeiding = false;
      }
      this.editDialogData.prize_id = currentUser.awardid;
      this.editDialogData.editChooseImg = currentUser.avator;
    },
    /* 监听编辑框中的开关状态发生改变的回调 */
    switchIsChange(e) {
      if (e === false) {
        this.editDialogData.editSelectedAwardTypeID = '';
      }
    },
    /* 编辑框中监听下拉框选项 */
    handleSelectChange(e) {
      console.log(e);
      this.editDialogData.editSelectedAwardTypeID = e;
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
    saveAdd(chooseImg, username, selectedAwardType) {
      if (username && chooseImg) {
        if (this.isNeiding) {
          if (selectedAwardType) {
            // 请求
            this.requestSaveAdd(chooseImg, username, selectedAwardType);
            this.isShowAddUserDialog = false;
            this.chooseImg = '';
            this.clearAddData();
          } else {
            this.$message({
              message: '请完善所有信息!',
              type: 'error',
            });
          }
        } else {
          // 请求
          this.requestSaveAdd(chooseImg, username, selectedAwardType);
          this.isShowAddUserDialog = false;
          this.chooseImg = '';
          this.clearAddData();
        }
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    cancelAdd() {
      this.isShowAddUserDialog = false;
      this.chooseImg = '';
      this.clearAddData();
    },
    saveEdit(chooseImg, prize, username, prize_id) {
      const data = {
        // head_img: chooseImg,
        // prize,
        // username,
        // liveId: this.$store.state.liveId,
        // prize_id,
        avator: chooseImg,
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
      this.editDialogData.editChooseImg = '';
    },
    cancelEdit() {
      this.isShowEditDialog = false;
      this.editDialogData.editUsername = '';
      this.editDialogData.editSelectedAwardTypeID = '';
    },
    /* 提交或取消添加以后清除数据 */
    clearAddData() {
      this.username = '';
      this.isNeiding = false;
      this.selectedAwardType = '';
    },
    requestSaveAdd(chooseImg, username, selectedAwardType) {
      const data = {
        // head_img: chooseImg,
        // prize: selectedAwardType + '',
        // username,
        // kind: '1',
        // liveid: this.$store.state.liveId,
        // type: '1',
        avator: chooseImg,
        award: `${selectedAwardType}`, // ？
        name: username,
        gametype: '6',
        splid: this.$store.state.liveId,
        // usertype: '1',
      };
      lotteryListSetting(data).then((res) => {
        console.log('添加用户成功', res);
        this.requestList();
      });
    },
    openPopup() {
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    handleBgFile(e) {
      console.log(e);
      if (e.file.size > 21000000) {
        this.$message.error('上传图片不超过20M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      console.log('打印图片');
      console.log(e.file);
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.requestMultiAddUploadFile(freader.result).then((res) => {
          console.log('批量图片上传地址：', res);
          this.requestSaveAdd(res, '', '');
          this.closePopup();
        });
      };
    },
    handleRemove() {},
  },
};
</script>
<style lang="less" scoped>
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
.user-list-table-container {
  .upload-img {
    display: flex;
    align-items: center;
    margin-left: 120px;
    img {
      margin-right: 5px;
    }
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.header-container {
  display: flex;
  padding-left: 20px;
  .peopleAmount {
    display: flex;
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
    .custom-user {
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
    .head-upload {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 50px;
      // border-radius: 50%;
      .no-img {
        width: 100px;
        height: 150px;
        // border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #d9d9d9;
        // border-radius: 50%;
        cursor: pointer;
      }
      .preview {
        width: 100px;
        height: 150px;
        // border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
/* 编辑用户弹出框 */
.editUser-dialog-container {
  padding-bottom: 50px;
  .edit-user-title {
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
    .head-upload {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 50px;
      border-radius: 50%;
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
}
.uploadPopArea {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
  .uploadBox {
    background-color: #ffffff;
    position: absolute;
    top: 19%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 320px;
    min-height: 280px;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 12px 14px;
    .head {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 5%;
      .name {
        font-size: 14px;
        font-weight: 600;
        color: rgba(165, 165, 165, 1);
      }
      .closeIcon {
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 88%;
      margin-top: 24px;
      .uploadImg::v-deep {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .el-upload-list--picture .el-upload-list__item {
          padding: 0;
          width: 169px;
          height: 92px;
          float: left;
          margin-right: 30px;
          &.is-ready {
            display: none;
          }
        }
        .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
          display: none;
        }
        .el-upload-list--picture .el-upload-list__item-thumbnail {
          width: 167px;
          height: 95px;
          margin-left: 0px;
        }
        .el-upload-list--picture .el-upload-list__item-status-label {
          z-index: 1;
        }
        .el-upload-list__item .el-icon-close {
          color: black;
          z-index: 1;
        }
        .el-upload-list--text {
          display: none;
        }
      }
    }
  }
}
</style>
