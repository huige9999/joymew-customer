<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card>
        <card-top-info title="猜明星游戏设置"></card-top-info>
        <div class="toggle-bar">
          <div class="toggle-bar-item">
            <span>猜明星游戏设置</span>
            <div class="underLine"></div>
          </div>
        </div>
        <div class="award-info-list-container">
          <my-table style="height: auto">
            <el-table
              :data="customAwardData"
              highlight-current-row
              style="width: 100%"
              header-row-class-name="table-header"
              :cell-style="cellStyle"
            >
              <el-table-column type="index" width="120" align="center" header-align="center" label="序号"> </el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" label="猜明星图片">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="80" height="100" style="border-radius: 4px" :src="scope.row.star_img" alt="" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" prop="star_answer" label="明星"></el-table-column>
              <el-table-column label="操作" min-width="100" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditAwardDialog(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelateOpen(scope.row.star_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
          <!-- 新增奖项按钮 -->
          <div class="addAwardBtn" @click="showAddAwardDialog"><span class="el-icon-plus" style="margin-right: 10px"></span>新增图片</div>
        </div>
        <!-- 编辑奖项弹出框 -->
        <my-dialog :show="editAwardDialogIsShow">
          <div class="editTitle" slot="title">
            <!-- <img src="@/assets/image/headImg.jpg" alt="" width="25" height="15"> -->
            <div class="title-text">编辑明星:</div>
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
                  <div class="tips">建议尺寸500*900</div>
                </div>
              </el-upload>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">明星:</div>
              <div class="input"><el-input v-model="starName" placeholder="请输入内容"></el-input></div>
            </div>
          </div>
          <div class="editBtn-group">
            <el-button type="primary" class="save-btn" @click="keepEdit(chooseImg, starName, starId)"
              >&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button
            >
            <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </my-dialog>
        <!-- 新增奖项弹出框 -->
        <my-dialog :show="addAwardDialogIsShow">
          <div class="editTitle" slot="title">
            <!-- <img src="@/assets/image/headImg.jpg" alt="" width="25" height="15"> -->
            <div class="title-text">添加明星:</div>
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
                  <div class="tips">建议尺寸：500*900</div>
                </div>
              </el-upload>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">明星:</div>
              <div class="input"><el-input v-model="starName" placeholder="请输入内容"></el-input></div>
            </div>
          </div>
          <div class="editBtn-group">
            <el-button type="primary" class="save-btn" @click="keepAdd(chooseImg, starName)">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </my-dialog>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { guessStarAdd, guessStarDelete, guessStarEdit, guessStarList } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import request from '@/utils/request';

export default {
  name: 'awardSetting',
  data() {
    return {
      // 明星的数据列表
      customAwardData: [],
      // 编辑明星弹出框是否显示
      editAwardDialogIsShow: false,
      // 添加明星弹出框是否显示
      addAwardDialogIsShow: false,
      // 图片地址
      chooseImg: '',
      // 明星名称
      starName: '',
      starId: '',
      tmpFile: null,
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
        star_type: '2',
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
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tcolor = '';
      if (columnIndex === 2) {
        tcolor = 'color:#ff6260';
      }
      return tcolor;
    },
    /* 显示编辑奖项的弹框 */
    showEditAwardDialog(currentRow) {
      this.editAwardDialogIsShow = true;
      // 回显数据
      this.chooseImg = currentRow.star_img;
      this.starName = currentRow.star_answer;
      this.starId = currentRow.star_id;
      console.log(currentRow);
    },
    /* 显示增加奖项的弹框 */
    showAddAwardDialog() {
      this.addAwardDialogIsShow = true;
    },
    /* 保存编辑 */
    keepEdit(chooseImg, starName, starId) {
      if (this.chooseImg && this.starName) {
        // 提交添加的奖项
        const data = {
          star_answer: starName,
          star_img: chooseImg,
          star_id: starId,
        };
        guessStarEdit(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '编辑明星成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.currentEditId = '';
        this.editAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    /* 取消编辑 */
    cancelEdit() {
      this.editAwardDialogIsShow = false;
      this.clearData();
      this.currentEditId = '';
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
    keepAdd(chooseImg, starName) {
      if (this.chooseImg && this.starName) {
        // 提交添加的奖项
        const data = {
          star_answer: starName,
          star_img: chooseImg,
          star_type: '2',
        };
        guessStarAdd(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.addAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
      console.log('保存添加');
    },
    /* 取消添加 */
    cancelAdd() {
      this.addAwardDialogIsShow = false;
      this.clearData();
      console.log('取消添加');
    },
    /* 上传图片 */
    handleFile(e) {
      this.tmpFile = e.file;
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestUploadFile();
      };
    },
    requestUploadFile() {
      const formData = new FormData();
      formData.append('file', this.tmpFile);
      request
        .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '图片上传成功!',
            type: 'success',
          });
          this.chooseImg = res.data.filePath;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    /* 编辑提交框消失时清空所有表单双向绑定的数据 */
    clearData() {
      this.chooseImg = '';
      this.starName = '';
    },
  },
};
</script>
<style lang="less" scoped>
.toggle-bar {
  display: flex;
  border-bottom: 1px solid #eeeeee;
  padding-left: 20px;
  .toggle-bar-item {
    position: relative;
    height: 44px;
    justify-content: flex-start;
    padding: 10px 20px;
    text-align: center;
    cursor: pointer;
    background: #d8eafd;
    border-radius: 2px;
    span {
      color: #1e87f0;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .underLine {
      position: absolute;
      width: 20px;
      height: 5px;
      background: #1e87f0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 2px;
      opacity: 1;
    }
  }
}
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
