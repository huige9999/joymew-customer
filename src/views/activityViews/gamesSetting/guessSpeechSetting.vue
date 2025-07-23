<!-- 废弃待删除 -->
<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card>
        <card-top-info title="台词模仿秀设置"></card-top-info>
        <div class="award-info-list-container">
          <my-table style="height: auto">
            <el-table
              :data="customAwardData"
              highlight-current-row
              style="width: 100%"
              header-row-class-name="table-header"
            >
              <el-table-column type="index" width="120" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" label="图片">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="80" height="100" style="border-radius: 4px" :src="scope.row.star_img" alt="" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" prop="star_option" label="提示词"></el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" prop="star_answer" label="答案"></el-table-column>
              <el-table-column label="操作" min-width="100" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditAwardDialog(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelateOpen(scope.row.star_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
          <div class="addAwardBtn" @click="showAddAwardDialog">
            <span class="el-icon-plus" style="margin-right: 10px"></span>
            新增题目
          </div>
        </div>
        <my-dialog :show="editAwardDialogIsShow">
          <div class="editTitle" slot="title">
            <div class="title-text">编辑题目:</div>
          </div>
          <div class="editInfo-container">
            <div class="editInfo-container-item uploadImg">
              <div class="uploadImg-title">图片:</div>
              <div class="uploadImg-input-box no-img">
                <img :src="chooseImg" v-if="chooseImg" width="129" height="77" alt="" />
                <img src="@/assets/image/default-uploadImg.png" v-else width="51" height="51" alt="" />
              </div>
              <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
                <div class="uploadImg-btn">
                  <el-button type="primary" size="small" icon="el-icon-circle-plus">选择图片</el-button>
                </div>
              </el-upload>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">答案:</div>
              <div class="input"><el-input v-model="starName" placeholder="请输入答案"></el-input></div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">提示:</div>
              <div class="input"><el-input v-model="starOption" placeholder="请输入提示词"></el-input></div>
            </div>
          </div>
          <div class="editBtn-group">
            <el-button type="primary" class="save-btn" v-loading="isLoading" @click="keepEdit">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </my-dialog>
        <my-dialog :show="addAwardDialogIsShow">
          <div class="editTitle" slot="title">
            <div class="title-text">添加题目:</div>
          </div>
          <div class="editInfo-container">
            <div class="editInfo-container-item uploadImg">
              <div class="uploadImg-title">图片:</div>
              <div class="uploadImg-input-box no-img">
                <img :src="chooseImg" v-if="chooseImg" width="129" height="77" alt="" />
                <img src="@/assets/image/default-uploadImg.png" v-else width="51" height="51" alt="" />
              </div>
              <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
                <div class="uploadImg-btn">
                  <el-button type="primary" size="small" icon="el-icon-circle-plus">选择图片</el-button>
                </div>
              </el-upload>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">答案:</div>
              <div class="input"><el-input v-model="starName" placeholder="请输入答案"></el-input></div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">提示词:</div>
              <div class="input"><el-input v-model="starOption" placeholder="请输入提示词"></el-input></div>
            </div>
          </div>
          <div class="editBtn-group">
            <el-button type="primary" class="save-btn" @click="keepAdd" v-loading="isLoading">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </my-dialog>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import { guessStarList, guessStarAdd, guessStarEdit, guessStarDelete } from '@/api/setting/activitySetting/gameSetting';
import myDialog from '@/components/myDialog';
import request from '@/utils/request';

export default {
  name: 'guessCommonSetting',
  data() {
    return {
      // 明星的数据列表
      customAwardData: [],
      // 编辑明星弹出框是否显示
      editAwardDialogIsShow: false,
      // 添加明星弹出框是否显示
      addAwardDialogIsShow: false,
      chooseImg: '', // 上传的图片
      starName: '', // 答案
      starOption: '', // 提示词
      starId: '',
      tmpFile: null,
      isLoading: false,
    };
  },
  created() {
    this.requestCustomData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
  },
  methods: {
    /* 获取自定义奖项列表 */
    requestCustomData() {
      const data = {
        star_type: 'custom18',
      };
      guessStarList(data).then((res) => {
        console.log(res, 'guessStarList--------');
        if (res.code === 200) {
          this.customAwardData = res.data.varList;
        } else {
          console.error('自定义奖项列表数据获取失败');
        }
      });
    },
    /* 显示编辑奖项的弹框 */
    showEditAwardDialog(currentRow) {
      this.editAwardDialogIsShow = true;
      // 回显数据
      this.chooseImg = currentRow.star_img;
      this.starName = currentRow.star_answer;
      this.starOption = currentRow.star_option;
      this.starId = currentRow.star_id;
      console.log(currentRow);
    },
    /* 显示增加奖项的弹框 */
    showAddAwardDialog() {
      this.addAwardDialogIsShow = true;
    },
    /* 保存编辑 */
    async keepEdit() {
      if (!this.chooseImg) {
        this.$message({
          message: '请上传图片!',
          type: 'error',
        });
        return;
      }
      if (!this.starName) {
        this.$message({
          message: '请输入答案!',
          type: 'error',
        });
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      try {
        if (this.tmpFile) {
          await this.requestUploadFile();
        }
        const addRes = await guessStarEdit({
          star_answer: this.starName,
          star_img: this.chooseImg,
          star_type: 'custom18',
          star_option: this.starOption,
          star_id: this.starId,
        });
        console.log(addRes);
        this.isLoading = false;
        this.clearData();
        this.editAwardDialogIsShow = false;
        this.requestCustomData();
      } catch (err) {
        this.isLoading = false;
      }
    },
    /* 取消编辑 */
    cancelEdit() {
      this.editAwardDialogIsShow = false;
      this.clearData();
      console.log('取消编辑');
    },
    /* 删除明星 */
    deleteAward(id) {
      console.log(id);
      const data = {
        star_id: id,
      };
      guessStarDelete(data).then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.requestCustomData();
        }
      });
    },
    /* 删除操作确认框 */
    confirmDelateOpen(id) {
      this.$confirm('此操作将永久删除该明星, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteAward(id);
          this.$message({
            type: 'success',
            message: '删除明星成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    /* 保存添加 */
    async keepAdd() {
      if (!this.chooseImg) {
        this.$message({
          message: '请上传图片!',
          type: 'error',
        });
        return;
      }
      if (!this.starName) {
        this.$message({
          message: '请输入答案!',
          type: 'error',
        });
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      try {
        if (this.tmpFile) {
          await this.requestUploadFile();
        }
        const addRes = await guessStarAdd({
          star_answer: this.starName,
          star_img: this.chooseImg,
          star_type: 'custom18',
          star_option: this.starOption,
        });
        console.log(addRes);
        this.isLoading = false;
        this.clearData();
        this.addAwardDialogIsShow = false;
        this.requestCustomData();
      } catch (err) {
        this.isLoading = false;
      }
    },
    /* 取消添加 */
    cancelAdd() {
      this.addAwardDialogIsShow = false;
      this.clearData();
      console.log('取消添加');
    },
    /* 上传图片 */
    handleFile(e) {
      console.log(e);
      // 大小不超过5M
      if (e.file.size > 10 * 1024 * 1024) {
        this.$message.error('图片大小不能超过10M!');
        return;
      }
      if (e.file.type.indexOf('image') === -1) {
        this.$message.error('请上传图片!');
        return;
      }
      this.tmpFile = e.file;
      const freader = new FileReader();
      freader.readAsDataURL(e.file);

      freader.onload = () => {
        this.chooseImg = freader.result;
      };
    },
    requestUploadFile() {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', this.tmpFile);
        request
          .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
          .then((res) => {
            console.log(res);
            this.chooseImg = res.data.filePath;
            resolve();
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败!');
            reject();
          });
      });
    },
    /* 编辑提交框消失时清空所有表单双向绑定的数据 */
    clearData() {
      this.chooseImg = '';
      this.starName = '';
      this.starOption = '';
      this.starId = '';
      this.tmpFile = null;
    },
  },
};
</script>
<style lang="less" scoped>
.editTitle {
  display: flex;
  .title-text {
    font-size: 26px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.editInfo-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .editInfo-container-item {
    display: flex;
    align-items: center;
    margin-top: 30px;
  }
  .uploadImg {
    .uploadImg-input-box {
      width: 129px;
      height: 77px;
      border-radius: 4px;
      border: 1px dashed #cccccc;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 80px;
    }
    .uploadImg-btn {
      margin-left: 20px;
      .tips {
        margin-top: 10px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .award-info {
    .title {
      font-size: 15px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .input {
      margin-left: 80px;
    }
    .tips {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c7cdd5;
      margin-left: 20px;
    }
  }
}
.editBtn-group {
  padding-left: 143px;
  margin-top: 30px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  .save-btn,
  .cancel-btn {
    padding: 10px 40px;
  }
  .cancel-btn {
    margin-left: 30px;
  }
}
.award-info-list-container {
  color: #1e87f0;
  .addAwardBtn {
    width: 96%;
    margin: 30px auto;
    height: 29px;
    border: 1px dashed #1e87f0;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
  }
}
</style>
