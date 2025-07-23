<template>
    <sub-page>
        <main-card v-loading="loading">
            <card-top-info title="品牌达人游戏新增设置"></card-top-info>
            <div class="wrap">
                <el-button type="primary" size="small" @click="openDialog({ type: 'add' })">
                    新增
                </el-button>
            </div>
            <div class="wrap">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="编号"
              width="200"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              label="图片"
              header-align="center"
            >
              <template slot-scope="scope">
                <div class="uploadImg">
                  <img
                    width="200"
                    height="200"
                    :src="scope.row.img"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="answer"
              label="答案"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="begin"
              label="最开始展示"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="firstTip"
              label="第一次提示"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="secondTip"
              label="第二次提示"
              min-width="120"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              label="操作"
              min-width="120"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="openDialog({ type: 'edit', rowData: scope.row })"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: red"
                  @click="deleteRowData(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </main-card>
        <main-card>
            <card-top-info title="品牌达人自定义设置">
            </card-top-info>
            <div class="item-list">
                <CheckItem :itemInfo="item" v-for="item in itemList" :key="item.star_id" @update="onUpdateItemChecked"
                    @preview="onPreviewItem" />
            </div>
            <div class="operate-btns">
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" @click="confirm">
                    确认
                </el-button>
            </div>
            <!-- <video :src="previewMedia" class="video-preview" autoplay controls v-if="previewMedia"></video> -->
        </main-card>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="closeDialog" width="550px">
            <el-form :model="infoForm">
                <el-form-item prop="img" label="图片：">
                    <el-upload class="upload-demo" action accept="image/jpg,image/jpeg,image/png" :limit="1"
                        :auto-upload="false" :show-file-list="true" :on-change="onFileChange" :on-remove="onFileRemove"
                        :file-list="previewFileList" :on-exceed="onFileExceed" list-type="picture-card">
                        <i class="el-icon-plus upload-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="answer" label="答案：">
                    <el-input v-model="infoForm.answer"></el-input>
                </el-form-item>
                <el-form-item prop="begin" label="最开始展示(选1个)：">
                    <el-checkbox-group v-model="infoForm.begin" :min="0" :max="1">
                        <el-checkbox v-for="order in ordersBegin" :label="order" :key="order">
                            {{ order }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="firstTip" label="第一次提示(选2个)：">
                    <el-checkbox-group v-model="infoForm.firstTip" :min="0" :max="2">
                        <el-checkbox v-for="order in ordersFirstTip" :label="order" :key="order">
                            {{ order }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="secondTip" label="第二次提示(选2个)：">
                    <el-checkbox-group v-model="infoForm.secondTip" :min="0" :max="2">
                        <el-checkbox v-for="order in ordersSecondTip" :label="order" :key="order">
                            {{ order }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <div class="center-wrap">
                        <el-button type="primary" @click="handleConfirm">
                            确定
                        </el-button>
                        <el-button @click="handleCancel" style="margin-left: 40px">
                            取消
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </sub-page>
</template>
<script>
import reqUploadImage from '@/api/app/qiniuUpload';
import { reqGetGuessBrand, saveGuessBrand } from '@/api/gameSetting/index';
import { guessStarAdd, guessStarDelete, guessStarEdit, guessStarList } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import CheckItem from '../components/checkItem.vue';
import { getDataOfClientNeed, getDataOfServerNeed } from './func';

const orderOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export default {
  name: 'GuessBrand',
  data() {
    return {
      tableData: [],
      infoForm: {
        // 新增/编辑公用的表单
        id: '',
        img: '',
        answer: '',
        begin: [],
        firstTip: [],
        secondTip: [],
      },
      dialogVisible: false,
      dialogType: 'add', // 取值 'add'|'edit'
      tempFile: null, // 暂存选择的文件
      previewFileList: [], // 图片预览列表
      loading: false,
      itemList: [],
      previewDialogVisible: false,
      previewMedia: '',
    };
  },
  computed: {
    checkedIds() {
      return this.itemList.filter((item) => item.checked).map((item) => item.id);
    },
    dialogTitle() {
      return this.dialogType === 'add' ? '新增' : '编辑';
    },
    ordersBegin() {
      console.log(this.infoForm);
      return orderOptions.filter((item) => !this.infoForm.firstTip.includes(item) && !this.infoForm.secondTip.includes(item));
    },
    ordersFirstTip() {
      return orderOptions.filter((item) => !this.infoForm.begin.includes(item) && !this.infoForm.secondTip.includes(item));
    },
    ordersSecondTip() {
      return orderOptions.filter((item) => !this.infoForm.begin.includes(item) && !this.infoForm.firstTip.includes(item));
    },
  },
  created() {
    this.initTableData();
    this.initData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    CheckItem,
  },
  methods: {
    /**
       * 选择文件后的回调
       */
    onFileChange(file) {
      this.setFileAndPreviewImage(file);
    },
    /**
       * 移除文件后的回调
       */
    onFileRemove() {
      this.setFileAndPreviewImage();
    },
    /**
       * 上传文件数量超出限制的提示
       */
    onFileExceed() {
      this.$message.error('只能上传1张图片');
    },
    /**
       * 设置文件和预览图片
       * (1)不传参数表示清空
       * (2)参数是文件,生成base64图片预览
       * (3)参数是url,直接设置图片预览
       */
    setFileAndPreviewImage(fileOrUrl) {
      return new Promise((resolve, reject) => {
        if (!fileOrUrl) {
          this.tempFile = null;
          this.previewFileList = [];
          resolve();
          return;
        }
        // 如果是文件的情况...
        if (fileOrUrl?.raw) {
          const reader = new FileReader();
          reader.readAsDataURL(fileOrUrl.raw);
          reader.onload = (e) => {
            this.tempFile = fileOrUrl;
            this.previewFileList.push({
              name: '猜明星图片',
              url: e.target.result,
            });
            resolve();
          };
          return;
        }

        if (fileOrUrl.includes('http')) {
          this.tempFile = null;
          this.previewFileList.push({
            name: '猜明星图片',
            url: fileOrUrl,
          });
          resolve();
          return;
        }
        this.tempFile = null;
        this.previewFileList = [];
        reject(new Error('非预期调用!'));
      });
    },
    /**
       * 上传文件得到url
       */
    async uploadFileThenGetUrl(file) {
      const uploadRes = await reqUploadImage(file, 'guess_star');
      return uploadRes.key;
    },
    /**
       * 保存或编辑表单数据
       */
    async saveOrEditFormData(data) {
      let res;
      if (data.star_id) {
        // 编辑...
        res = await guessStarEdit(data);
      } else {
        // 新增...
        res = await guessStarAdd(data);
        await this.initData();
      }
      return res;
    },
    /**
       * 初始化表格数据
       */
    async initTableData() {
      try {
        this.loading = true;
        const guessStarRes = await guessStarList({
          star_type: '20',
          splid: this.$store.state.liveId,
        });
        this.loading = false;
        this.tableData = getDataOfClientNeed(guessStarRes.data.varList);
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    /**
       * 删除某个表格数据
       */
    async deleteTableData(id) {
      const deleteRes = await guessStarDelete({
        star_id: id,
      });
      return deleteRes;
    },
    /**
       * 表单信息确认
       */
    async handleConfirm() {
      // 1.校验表单数据
      if (!this.validateForm()) {
        return;
      }
      try {
        this.loading = true;
        // 2.上传图片
        // let imgUrl;
        if (this.tempFile) {
          this.infoForm.img = await this.uploadFileThenGetUrl(this.tempFile.raw);
        } else {
          this.infoForm.img = this.previewFileList[0].url;
        }
        // 3.保存表单数据
        await this.saveOrEditFormData(getDataOfServerNeed(this.infoForm));
        // 4.关闭弹窗、提示成功、刷新列表
        this.initTableData();
        this.loading = false;
        this.closeDialog();
        this.$message.success('保存成功!');
      } catch (e) {
        console.log(e);
        this.$message.error('保存失败!');
        this.loading = false;
      }
    },
    /**
       * 取消表单信息
       */
    handleCancel() {
      this.closeDialog();
    },
    /**
       * 设置表单数据
       * 不传rowData则清空表单数据
       */
    setInfoForm(rowData) {
      if (!rowData) {
        this.infoForm = {
          id: '',
          img: '',
          begin: [],
          firstTip: [],
          secondTip: [],
          answer: '',
        };
        // 清空文件和图片预览
        this.setFileAndPreviewImage();
        return;
      }
      const { id, img, begin, firstTip, secondTip, answer } = rowData;
      this.infoForm = {
        id,
        img,
        begin: begin ? begin.split(',').map(Number) : [],
        firstTip: firstTip ? firstTip.split(',').map(Number) : [],
        secondTip: secondTip ? secondTip.split(',').map(Number) : [],
        answer,
      };
      // 设置文件和图片预览
      this.setFileAndPreviewImage(img);
    },
    /**
       * 打开弹窗
       * @params{add|edit} type 弹窗类型
       * @params{Object} rowData 行数据
       */
    openDialog({ type, rowData }) {
      // 1.设置弹窗类型
      this.dialogType = type;
      // 2.如果是编辑类型的弹窗需要设置表单数据
      if (type === 'edit') {
        this.setInfoForm(rowData);
      }
      // 3.打开弹窗
      this.dialogVisible = true;
    },
    /**
       * 关闭弹窗
       */
    closeDialog() {
      // 清空表单数据
      this.setInfoForm();
      if (this.dialogVisible) {
        this.dialogVisible = false;
      }
    },
    /**
       * 删除某一行数据
       */
    async deleteRowData(rowData) {
      // 1.提示是否删除...
      try {
        await this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          this.loading = true;
          // 2.删除数据
          await this.deleteTableData(rowData.id);
          // 3.刷新列表
          this.initTableData();
          // 4.提示删除成功
          this.$message.success('删除成功!');
          this.loading = false;
        } catch (e) {
          console.log(e);
          this.$message.error('删除失败!');
          this.loading = false;
        }
      } catch (e) {
        console.log(e);
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      }
    },
    /**
       * 校验表单数据
       * 1、图片不能为空
       * 2、如果上传了图片，图片的大小不能超过3M
       * 3、最开始展示的顺序数组长度必须要是1
       * 4、第一次提示的顺序数组长度必须要是2
       * 5、第二次提示的顺序数组长度必须要是2
       */
    validateForm() {
      if (this.previewFileList.length === 0) {
        this.$message.error('请上传图片!');
        return false;
      }
      if (this.tempFile && this.tempFile.size > 3 * 1024 * 1024) {
        this.$message.error('图片大小不能超过3M!');
        return false;
      }
      if (this.infoForm.begin.length !== 1) {
        this.$message.error('选择1个最开始展示!');
        return false;
      }
      if (this.infoForm.firstTip.length !== 2) {
        this.$message.error('选择2个第一次提示!');
        return false;
      }
      if (this.infoForm.secondTip.length !== 2) {
        this.$message.error('选择2个第二次提示!');
        return false;
      }
      return true;
    },

    async initData() {
      this.loading = true;
      // 获取游戏数据
      const res = await reqGetGuessBrand();
      // 获取游戏配置数据
      this.itemList = this.getItemList(res.data);
      this.loading = false;
    },
    async reset() {
      this.itemList.forEach((item) => {
        item.checked = false;
      });
      await this.confirm('reset');
    },
    async confirm(isReset) {
      try {
        this.loading = true;
        // const valueStr = JSON.stringify(this.checkedIds);
        // const res = await saveGuessSpeechConfig(valueStr);
        const valueStr = this.checkedIds.join();
        const res = await saveGuessBrand(valueStr);
        this.loading = false;
        console.log(res);
        if (isReset !== 'reset') {
          this.$message.success('保存成功!');
        } else {
          this.$message.success('重置成功!');
        }
        await this.initData();
      } catch (e) {
        console.log(e);
        this.loading = false;
        if (isReset !== 'reset') {
          this.$message.success('保存失败!');
        } else {
          this.$message.success('重置失败!');
        }
        await this.initData();
      }
    },
    getItemList(list) {
      return list.map((item) => {
        //   let option = item.star_option
        return {
          id: item.star_id,
          cover: item.star_option,
          previewMedia: item.star_option,
          answer: item.star_answer,
          option: item.star_option,
          checked: item.status === '1',
        };
      });
    },
    onUpdateItemChecked(item) {
      item.checked = !item.checked;
    },
    onPreviewItem(item) {
      this.previewMedia = item.previewMedia;
      this.previewDialogVisible = true;
    },
  },
};
</script>
  <style lang="less" scoped>
  .wrap {
    padding: 0 20px;
  }
  .center-wrap {
    display: flex;
    justify-content: center;
  }
  .previewImage {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }
  .upload-icon {
    font-size: 42px;
  }

  .item-list {
      padding: 20px 40px;
      display: grid;
      column-gap: 20px;
      row-gap: 40px;
      grid-template-columns: repeat(5, 1fr);
  }

  .operate-btns {
      display: flex;
      justify-content: center;
      padding-bottom: 40px;
}

</style>
