<template>
  <div class="h5Theme-area">
    <div class="changeBgEntry">
      <div class="text">小屏背景</div>
      <div class="btn">
        <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="handleFile">
          <div class="select-bg-button">
            <i class="el-icon-plus"></i>
            &nbsp;自选
          </div>
        </el-upload>
        <div class="delate-bg" @click="cancel">取消上传</div>
      </div>
      <el-button type="text" size="small" class="compressBtn" @click="imageCompressDrawerVisible = true">图片压缩</el-button>
    </div>
    <div class="preview-area" v-loading="isLoading">
      <img src="@/assets/image/mobileBgX.png" class="mobileBox" />
      <div class="themeBg" :style="{ backgroundImage: 'url(' + h5Theme + ')' }"></div>
      <img src="@/assets/image/mobileBg.png" class="bottomDCBg" />
    </div>
    <!-- 图片压缩配置区域 -->
    <imageCompress
      :imageCompressDrawerVisible="imageCompressDrawerVisible"
      @closeImageCompress="imageCompressDrawerVisible = false"
      type="h5"
    />
  </div>
</template>
<script>
import request from '@/utils/request';
import uploadImage from '@/api/app/qiniuUpload';
import { compressImage } from '@/utils/index';
import imageCompress from '@/components/imageCompress.vue';

export default {
  name: 'h5Theme',
  data() {
    return {
      uploadFile: null,
      isLoading: false,
      imageCompressDrawerVisible: false,
    };
  },
  props: {
    h5Theme: {
      type: String,
      default: '',
    },
  },
  components: {
    imageCompress,
  },
  methods: {
    handleFile(e) {
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // this.requestUploadImgFront(e.file);
      compressImage('h5', e.file)
        .then((compressedFile) => {
          console.log('上传压缩后的图');
          // 压缩成功的情况上传压缩后的图
          this.requestUploadImgFront(compressedFile);
        })
        .catch(() => {
          console.log('上传原图');
          // 压缩失败或不执行压缩的情况上传原图
          this.requestUploadImgFront(e.file);
        });
    },
    requestUploadImgFront(file) {
      this.isLoading = true;
      uploadImage(file, 'h5Theme', 0.7)
        .then((res) => {
          console.log(res.key);
          this.$emit('uht', res.key);
          const params = {
            splid: this.$store.state.liveId,
            phone_piclink: res.key,
          };
          request
            .post('/qiYeNe/update', params)
            .then((res) => {
              this.isLoading = false;
              this.$message({
                message: '图片上传成功',
                type: 'success',
              });
              console.log('upload-success', res);
            })
            .catch((err) => {
              console.log(err);
              this.isLoading = false;
              this.$message.error('背景图上传失败!');
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 后台上传(废弃)
    requestUploadImg() {
      const formData = new FormData();
      formData.append('file', this.uploadFile);

      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log(res);
          this.$emit('uht', res.data.filePath);
          const params = {
            splid: this.$store.state.liveId,
            phone_piclink: res.data.filePath,
          };
          request
            .post('/qiYeNe/update', params)
            .then((res) => {
              this.$message({
                message: '图片上传成功',
                type: 'success',
              });
              console.log('upload-success', res);
            })
            .catch((err) => {
              console.log(err);
              this.$message.error('图片上传失败!');
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /* 取消上传 */
    cancel() {
      this.$emit('cu');
    },
  },
};
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.h5Theme-area {
  width: 53%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .preview-area {
    width: 80%;
    position: relative;
    transform: scale(0.85);
    .mobileBox {
      width: 100%;
    }
    .themeBg {
      position: absolute;
      top: 13%;
      left: 15%;
      width: 70%;
      height: 76%;
      border-radius: 0 0 6% 6%;
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
    }
    .bottomDCBg {
      position: absolute;
      // top: 13%;
      top: 52%;
      left: 15%;
      width: 70%;
      // height: 76%;
      height: 36%;
      border-radius: 0 0 6% 6%;
    }
  }
  .changeBgEntry {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    .text {
      margin-right: 20px;
    }
    .select-bg-button {
      cursor: pointer;
      font-size: 13px;
      color: #3694f1;
      text-align: center;
      width: 67px;
      height: 26px;
      line-height: 26px;
      border-radius: 3px;
      border: dashed 1px #3694f1;
      margin: 10px auto;
    }
    .delate-bg {
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
      margin-left: 20px;
    }
    .compressBtn {
      position: absolute;
      bottom: -50%;
      left: 32%;
      color: #67c23a;
    }
  }
}
</style>
