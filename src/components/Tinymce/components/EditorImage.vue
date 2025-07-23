<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action
        :http-request="handleFile"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击 上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { uploadImage } from '@/api/app/upload';

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff',
    },
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every((item) => this.listObj[item].hasSuccess);
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map((v) => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          '图片上传中 请稍后再试',
        );
        return;
      }
      this.$emit('successCBK', arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, uid) {
      console.log('handleSuccess success');
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.filePath;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },
    handleRemove(file) {
      const { uid } = file;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = () => {
          _self.listObj[fileName] = {
            hasSuccess: false, uid: file.uid, width: this.width, height: this.height,
          };
        };
        resolve(true);
      });
    },
    /* 上传图片 */
    handleFile(e) {
      // 处理文件
      //  console.log(e)
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestUploadFile(e.file.uid);
      };
    },
    /* base 64 转换成file  这里对base64 进行压缩 */
    requestUploadFile(uid) {
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

        uploadImage(formData)
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功!',
              type: 'success',
            });
            this.handleSuccess(res, uid);
            // console.log(res.data.filePath)
            // this.chooseImg = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败!');
          });
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
