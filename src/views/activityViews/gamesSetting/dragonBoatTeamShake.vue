<!--赛龙舟-->
<template>
  <sub-page>
    <div class="mainCard">
      <card-top-info title="赛龙舟设置"></card-top-info>
      <div class="block">
        <span class="label">游戏时间</span>
        <el-input-number v-model="dragonTime" controls-position="right" :min="30" :max="90" :step="1" :precision="0"></el-input-number>
        <span style="margin-left: 15px">秒</span>
        <div class="submitBtn">
          <el-button type="primary" @click="submitTimeSetting">提交</el-button>
        </div>
      </div>
      <div class="block">
        <span class="label">游戏队伍</span>
        <el-button size="small" type="primary" @click="showAddTeam">添加队伍</el-button>
        <div class="tips">(至少设置2支队伍，最多设置5支队伍)</div>
      </div>
      <el-table :data="dragonTeamShow" border style="width: 90%; margin-bottom: 20px; margin-left: 100px" v-loading="isLoading">
        <el-table-column prop="teamLogo" label="队伍图标" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.teamLogo" style="width: 120px" />
          </template>
        </el-table-column>
        <el-table-column prop="teamName" label="队伍名称"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div class="link-wrap">
              <el-link type="primary" @click="deleteTeam(scope.row)" style="margin-right: 20px">删除</el-link>
              <el-link type="primary" @click="showEditTeam(scope.row)">修改</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加队伍" :visible.sync="addDialogShow" width="400px">
        <div class="block">
          <span class="label" style="text-align: right">队伍图标</span>

          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFileAdd" action>
            <img :src="chooseImgAdd" class="preview" alt v-if="chooseImgAdd" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>

        <div class="block">
          <span class="label" style="text-align: right">团队名称</span>
          <el-input style="width: 200px" v-model="teamNameAdd" maxlength="20"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="addTeam" v-loading="isLoading">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑队伍" :visible.sync="editDialogShow" width="400px">
        <div class="block">
          <span class="label" style="text-align: right">队伍图标</span>

          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFileEdit" action>
            <img :src="chooseImgEdit" class="preview" alt v-if="chooseImgEdit" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>

        <div class="block">
          <span class="label" style="text-align: right">团队名称</span>
          <el-input style="width: 200px" v-model="teamNameEdit"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="editTeam" v-loading="isLoading">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';
import {
  getDragonBoatTeamList,
  saveDragonBoatTeamInfo,
  deleteDragonBoatTeamInfoById,
  updateDragonBoatTeamInfoById,
  getSwingData,
  setSwingData,
} from '@/api/setting/activitySetting/gameSetting';

export default {
  name: 'dragonBoatTeamShake',
  data() {
    return {
      isLoading: false,
      dragonTime: 30,
      dragonTeamShow: [],

      addDialogShow: false,
      editDialogShow: false,
      chooseImgAdd: '',
      teamNameAdd: '',
      teamIdEdit: '',
      chooseImgEdit: '',
      teamNameEdit: '',
    };
  },
  created() {
    this.requestGetDragonTeamInfo();
    this.requestGetTimeSettingInfo();
  },
  components: {
    SubPage,
    CardTopInfo,
  },
  methods: {
    showAddTeam() {
      if (this.dragonTeamShow.length >= 5) {
        this.$message.error('队伍最多创建五支!');
        return;
      }
      this.addDialogShow = true;
    },
    deleteTeam(e) {
      console.log(e);
      this.isLoading = true;
      deleteDragonBoatTeamInfoById({
        splid: this.$store.state.liveId,
        dragon_id: e.id,
      })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.requestGetDragonTeamInfo();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('删除失败!');
        });
    },
    showEditTeam(e) {
      this.chooseImgEdit = e.teamLogo;
      this.teamNameEdit = e.teamName;
      this.teamIdEdit = e.id;
      this.editDialogShow = true;
    },
    async addTeam() {
      if (!this.chooseImgAdd) {
        this.$message.error('请上传队伍图标!');
        return;
      }
      if (!this.teamNameAdd) {
        this.$message.error('请填写团队名称!');
        return;
      }
      this.isLoading = true;
      this.chooseImgAdd = await this.requestUploadFile('add');
      console.log('上传的图片地址：', this.chooseImgAdd);
      this.requestSaveDragonTeamInfo();
    },
    async editTeam() {
      if (!this.teamNameEdit) {
        this.$message.error('请填写团队名称!');
        return;
      }
      if (this.chooseImgEdit.indexOf('base64') > -1) {
        // 需要上传图标
        this.chooseImgEdit = await this.requestUploadFile('edit');
      }
      this.isLoading = true;
      updateDragonBoatTeamInfoById({
        title: this.teamNameEdit,
        icon: this.chooseImgEdit,
        splid: this.$store.state.liveId,
        dragon_id: this.teamIdEdit,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '修改成功!',
            type: 'success',
          });
          this.chooseImgEdit = '';
          this.teamNameEdit = '';
          this.teamIdEdit = '';
          this.editDialogShow = false;
          this.isLoading = false;
          this.requestGetDragonTeamInfo();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('修改失败!');
        });
    },
    handleFileEdit(e) {
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      freader.onload = () => {
        this.chooseImgEdit = freader.result;
      };
    },
    handleFileAdd(e) {
      const freader = new FileReader();
      freader.readAsDataURL(e.file);
      freader.onload = () => {
        this.chooseImgAdd = freader.result;
      };
    },
    requestSaveDragonTeamInfo() {
      saveDragonBoatTeamInfo({
        splid: this.$store.state.liveId,
        title: this.teamNameAdd,
        icon: this.chooseImgAdd,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
          this.chooseImgAdd = '';
          this.teamNameAdd = '';
          this.addDialogShow = false;
          this.isLoading = false;
          this.requestGetDragonTeamInfo();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('保存失败!');
          this.isLoading = false;
        });
    },
    requestUploadFile(uploadType) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = uploadType === 'add' ? this.chooseImgAdd : this.chooseImgEdit;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.clearRect(0, 0, img.width, img.height);
          context.drawImage(img, 0, 0, img.width, img.height);
          const result = canvas.toDataURL('image/png', 0.7);

          // 转换成 file
          const arr = result.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'photo');
          const formData = new FormData();
          formData.append('file', file);
          request
            .post('/beiJing/shangchuanTomcat', formData)
            .then((res) => {
              resolve(res.data.filePath);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        };
      });
    },
    requestGetDragonTeamInfo() {
      getDragonBoatTeamList({ splid: this.$store.state.liveId })
        .then((res) => {
          console.log('***赛龙舟信息:***', res); // res.data.varList
          this.dragonTeamShow = res.data.varList.map((item) => ({
            teamLogo: item.icon,
            teamName: item.title,
            id: item.dragon_id,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    requestGetTimeSettingInfo() {
      getSwingData({
        params: {
          splid: this.$store.state.liveId,
        },
      }).then((res) => {
        console.log(res);
        this.dragonTime = res.data.pd.dragon_time_limit;
      }).catch((err) => {
        console.log(err);
      });
    },
    submitTimeSetting() {
      setSwingData({
        splid: this.$store.state.liveId,
        dragon_time_limit: this.dragonTime,
      }).then((res) => {
        console.log(res);
        this.$message.success('赛龙舟时间设置成功!');
      }).catch((err) => {
        console.log(err);
        this.$message.error('赛龙舟时间设置失败!');
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mainCard {
  width: 100%;
  margin: auto;
  margin-top: 19px;
  margin-bottom: 10px;
  background: #ffffff;
  box-shadow: 2px 3px 9px 0 rgb(119 119 119 / 10%);
  border-radius: 4px;
  .block {
    padding: 0 20px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .label {
      font-size: 15px;
      width: 72px;
      margin-right: 10px;
      &::after {
        content: ':';
        margin-left: 5px;
      }
    }
    .submitBtn {
      margin-left: 120px;
    }
    .tips {
      font-size: 14px;
      color: #909399;
      margin-left: 12px;
    }
    .head-upload {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 50px;
      border-radius: 50%;
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
