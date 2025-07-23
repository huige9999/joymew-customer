<template>
  <sub-page>
    <div class="giveMark-container">
      <main-card>
        <card-top-info title="评分设置"></card-top-info>
        <div class="mainContent">
          <div class="tableWarp">
            <el-table :data="markUserList" border style="width: 100%">
              <el-table-column prop="num" type="index" label="编号" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="avator" label="头像" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.avator" style="width: 120px" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div class="link-wrap">
                    <el-link type="primary" style="margin-right: 20px" @click="deleteMarkUser(scope.row)">删除</el-link>
                    <el-link type="primary" @click="showEditMarkUser(scope.row)">修改</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="btnWarp">
          <el-button type="primary" @click="showAddMarkUser">添加选手</el-button>
        </div>
        <div class="switchWrap">
          <label>评分模式：</label>
          <el-switch
            v-model="giveMarkVersion"
            active-value="new"
            inactive-value="old"
            active-text="简单"
            inactive-text="详细"
            v-loading="isLoading"
            @change="handleGiveMarkVersionChange"
          >
          </el-switch>
        </div>
        <div class="switchWrap" v-if="giveMarkVersion === 'old'">
          <label>去除最高分和最低分：</label>
          <el-switch
            v-model="isRemoveHLScore"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
            v-loading="isLoading"
            @change="handleIsRemoveHLScoreChange"
          >
          </el-switch>
        </div>
        <div class="switchWrap" v-if="giveMarkVersion === 'new'">
          <label>总票数固定：</label>
          <el-switch
            v-model="pfSwitch"
            active-value="1"
            inactive-value="0"
            active-text="固定"
            inactive-text="不固定"
            v-loading="isLoading"
            @change="onPfSwitchChange"
          >
          </el-switch>
        </div>
        <div class="switchWrap" v-if="giveMarkVersion === 'new'">
          <label>票数：</label>
          <el-input-number
            v-model="pfTotalPiao"
            controls-position="right"
            :min="0"
            :max="10000"
            :step="1"
            :precision="0"
            @change="onPfTotalPiaoChange"
          ></el-input-number>
        </div>
      </main-card>
      <main-card v-if="giveMarkVersion === 'new'">
        <card-top-info title="评分明细"></card-top-info>
        <change-sort :totleSort="totalSort" @sortClick="onClickSort"></change-sort>
        <my-table class="tableWrap">
          <el-table :data="remarkList" highlight-current-row header-row-class-name="table-header" style="width: 100%">
            <el-table-column prop="num" align="center" label="编号"> </el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <!-- <el-table-column prop="avator" label="头像" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.avator" class="myAvator" />
                </template>
              </el-table-column> -->
            <el-table-column prop="score" label="分数" align="center"> </el-table-column>
          </el-table>
        </my-table>
      </main-card>
      <el-dialog title="添加选手" :visible.sync="addDialogShow" width="400px">
        <div class="block">
          <span class="label" style="text-align: right">编号</span>
          <el-input style="width: 200px" v-model="numAdd"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">姓名</span>
          <el-input style="width: 200px" v-model="nameAdd"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">头像</span>
          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFileAdd" action>
            <img :src="avatorAdd" class="preview" alt v-if="avatorAdd" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="addMarkUser" v-loading="isLoading">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑选手" :visible.sync="editDialogShow" width="400px">
        <div class="block">
          <span class="label" style="text-align: right">编号</span>
          <el-input style="width: 200px" v-model="numEdit"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">姓名</span>
          <el-input style="width: 200px" v-model="nameEdit"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">头像</span>
          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFileEdit" action>
            <img :src="avatorEdit" class="preview" alt v-if="avatorEdit" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="editMarkUser" v-loading="isLoading">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import ChangeSort from '@/views/activityViews/gamesSetting/commonCpn/changeSort';
import MyTable from '@/components/myTable';
import { formatDate } from '@/utils/format';
import request from '@/utils/request';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { saveMarkUser, getMarkUserList, editMarkUser, getRemarkData } from '@/api/setting/setting';

export default {
  name: 'giveMark',
  data() {
    return {
      markUserList: [],
      addDialogShow: false,
      editDialogShow: false,
      isLoading: false,

      numAdd: '',
      nameAdd: '',
      avatorAdd: '',

      numEdit: '',
      nameEdit: '',
      avatorEdit: '',
      markUserId: '',

      isRemoveHLScore: '0',

      pfSwitch: '0',
      giveMarkVersion: 'new',
      pfTotalPiao: 0,

      tmpFileAdd: null,
      tmpFileEdit: null,

      totalSort: 0,
      currentSort: 1,

      remarkList: [],
    };
  },
  components: {
    SubPage,
    MainCard,
    ChangeSort,
    CardTopInfo,
    MyTable,
  },
  // computed: {
  //   giveMarkVersion() {
  //     return this.pfSwitch === '2' ? 'old' : 'new';
  //   }
  // },
  watch: {
    pfSwitch(newVal) {
      this.giveMarkVersion = newVal === '2' ? 'old' : 'new';
    },
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    },
  },
  created() {
    this.getActivityInfo();
    this.requestGetMarkUserInfo();
    this.getRemarkInfo();
  },
  methods: {
    // 获取活动的信息
    getActivityInfo() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res);
        this.isRemoveHLScore = res.data.isChooseScore;
        this.pfSwitch = res.data.pf_switch;
        this.pfTotalPiao = parseInt(res.data.pf_total_piao, 10);
      });
    },
    // 获取评价信息
    getRemarkInfo() {
      this.remarkList.splice(0);
      getRemarkData({
        splid: this.$store.state.liveId,
        orderBy: this.currentSort,
      })
        .then((res) => {
          console.log(res);
          this.totalSort = res.data.maxSort;
          this.remarkList = res.data.list.map((item) => ({
            num: item.number_info,
            name: item.player_name,
            score: item.score_total_2,
            avator: item.img_url,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showAddMarkUser() {
      this.addDialogShow = true;
    },
    showEditMarkUser(e) {
      this.numEdit = e.num;
      this.nameEdit = e.name;
      this.avatorEdit = e.avator;
      this.markUserId = e.markUserId;
      this.editDialogShow = true;
    },
    deleteMarkUser(e) {
      console.log(e);
      this.isLoading = true;
      editMarkUser({
        player_id: e.markUserId.toString(),
        splid: this.$store.state.liveId,
        is_delete: '1',
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '删除成功!',
            type: 'success',
          });
          this.nameEdit = '';
          this.numEdit = '';
          this.avatorEdit = '';
          this.markUserId = '';
          this.editDialogShow = false;
          this.isLoading = false;
          this.requestGetMarkUserInfo();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('删除失败!');
        });
    },
    async addMarkUser() {
      if (!this.numAdd) {
        this.$message.error('请填写选手编号!');
        return;
      }
      if (!this.nameAdd) {
        this.$message.error('请填写选手姓名!');
        return;
      }
      if (!this.avatorAdd) {
        this.$message.error('请上传选手头像!');
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.avatorAdd = await this.requestUploadFile('add');
      console.log('上传的图片地址：', this.avtorAdd);
      this.requestSaveMarkUserInfo();
    },
    async editMarkUser() {
      if (!this.numEdit) {
        this.$message.error('请填写选手编号!');
        return;
      }
      if (!this.nameEdit) {
        this.$message.error('请填写选手姓名!');
        return;
      }
      if (!this.avatorEdit) {
        this.$message.error('请上传选手头像!');
        return;
      }
      if (this.isLoading) {
        return;
      }
      if (this.avatorEdit.indexOf('base64') > -1) {
        // 需要上传图标
        this.avatorEdit = await this.requestUploadFile('edit');
      }
      this.isLoading = true;
      editMarkUser({
        player_name: this.nameEdit,
        img_url: this.avatorEdit,
        splid: this.$store.state.liveId,
        number_info: this.numEdit,
        player_id: this.markUserId.toString(),
        is_delete: '0',
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '修改成功!',
            type: 'success',
          });
          this.nameEdit = '';
          this.numEdit = '';
          this.avatorEdit = '';
          this.markUserId = '';
          this.editDialogShow = false;
          this.isLoading = false;
          this.requestGetMarkUserInfo();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('修改失败!');
        });
    },
    handleFileAdd(e) {
      this.tmpFileAdd = e.file;
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      freader.onload = () => {
        this.avatorAdd = freader.result;
      };
    },
    handleFileEdit(e) {
      this.tmpFileEdit = e.file;
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      freader.onload = () => {
        this.avatorEdit = freader.result;
      };
    },
    requestUploadFile(uploadType) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        const tmpFile = uploadType === 'add' ? this.tmpFileAdd : this.tmpFileEdit;
        formData.append('file', tmpFile);
        request
          .post('/beiJing/shangchuanTomcat', formData)
          .then((res) => {
            resolve(res.data.filePath);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
        // const canvas = document.createElement('canvas');
        // const context = canvas.getContext('2d');
        // const img = new Image();
        // img.src = uploadType === 'add' ? this.avatorAdd : this.avatorEdit;
        // img.onload = () => {
        //   canvas.width = img.width;
        //   canvas.height = img.height;
        //   context.clearRect(0, 0, img.width, img.height);
        //   context.drawImage(img, 0, 0, img.width, img.height);
        //   const result = canvas.toDataURL('image/png', 0.7);

        //   // 转换成 file
        //   const arr = result.split(',');
        //   const bstr = atob(arr[1]);
        //   let n = bstr.length;
        //   const u8arr = new Uint8Array(n);
        //   while (n--) {
        //     u8arr[n] = bstr.charCodeAt(n);
        //   }
        //   const file = new File([u8arr], 'photo');
        //   const formData = new FormData();
        //   formData.append('file', file);
        //   request
        //     .post('/beiJing/shangchuanTomcat', formData)
        //     .then((res) => {
        //       resolve(res.data.filePath);
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //       reject(err);
        //     });
        // };
      });
    },
    requestSaveMarkUserInfo() {
      saveMarkUser({
        player_name: this.nameAdd,
        img_url: this.avatorAdd,
        splid: this.$store.state.liveId,
        number_info: this.numAdd,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
          this.numAdd = '';
          this.nameAdd = '';
          this.avatorAdd = '';
          this.addDialogShow = false;
          this.isLoading = false;
          this.requestGetMarkUserInfo();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('保存失败!');
          this.isLoading = false;
        });
    },
    requestGetMarkUserInfo() {
      getMarkUserList({
        splid: this.$store.state.liveId,
      })
        .then((res) => {
          console.log(res);
          this.markUserList = res.data.list.map((item) => ({
            num: item.number_info,
            name: item.player_name,
            avator: item.img_url,
            markUserId: item.player_id,
            userId: item.userId,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleIsRemoveHLScoreChange(e) {
      console.log(e);
      this.isLoading = true;
      const formData = {
        isChooseScore: e,
        splid: this.$store.state.liveId,
      };
      request
        .post('/qiYeNe/update', formData)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '设置成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    handleGiveMarkVersionChange() {
      const tmpPfSwitch = this.giveMarkVersion === 'old' ? '2' : '1';
      this.isLoading = true;
      const formData = {
        pf_switch: tmpPfSwitch,
        splid: this.$store.state.liveId,
      };
      request
        .post('/qiYeNe/update', formData)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '设置成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    onPfSwitchChange(e) {
      console.log(e);
      this.isLoading = true;
      const formData = {
        pf_switch: e,
        splid: this.$store.state.liveId,
      };
      request
        .post('/qiYeNe/update', formData)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '设置成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    onPfTotalPiaoChange(e) {
      console.log(e);
      this.isLoading = true;
      const formData = {
        pf_total_piao: e,
        splid: this.$store.state.liveId,
      };
      request
        .post('/qiYeNe/update', formData)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '设置成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    onClickSort(sortIndex) {
      this.currentSort = sortIndex;
      // 请求对应轮次的数据
      this.getRemarkInfo();
    },
  },
};
</script>
<style lang="less" scoped>
.deleteIcon {
  width: 22px;
  height: 22px;
}
.mainContent {
  padding-top: 34px;
  padding-left: 40px;
  margin-bottom: 24px;
  label {
    margin-right: 12px;
    font-size: 16px;
    color: #000;
  }
  .tableWarp {
    width: 638px;
  }
}
.btnWarp {
  padding-top: 30px;
  padding-bottom: 30px;
  width: 525px;
  display: flex;
  justify-content: center;
}
.switchWrap {
  padding-left: 40px;
  margin-bottom: 24px;
  label {
    font-size: 15px;
    width: 100px;
    margin-right: 10px;
  }
}
.block {
  margin-top: 30px;
  display: flex;
  align-items: center;
  .label {
    font-size: 15px;
    width: 100px;
    margin-right: 10px;
    &::after {
      content: ':';
      margin-left: 5px;
    }
  }
}
.head-upload {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
}

.no-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
}

.preview {
  width: 100px;
  height: 100px;
  cursor: pointer;
}

.myAvator {
  width: 120px;
  height: 120px;
}
</style>
