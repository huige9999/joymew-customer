<template>
  <div class="shareCardTheme" v-loading="isLoading">
    <div class="previewArea">
      <img src="@/assets/image/innerCt.jpg" class="ctImg" />
      <img src="@/assets/image/iphone.png" class="iphoneImg" />
      <img :src="shareCardImg" class="shareCardImg" />
    </div>
    <div class="btn">
      <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="handleFile">
        <div class="select-bg-button">
          <i class="el-icon-plus"></i>
          &nbsp;自选
        </div>
      </el-upload>
      <div class="delate-bg" @click="cancel">取消上传</div>
      <el-button type="text" size="small" class="compressBtn" @click="imageCompressDrawerVisible = true">图片压缩</el-button>
    </div>
    <div class="btn2" @click="clearImg">二维码扫了没反应？点我试试!</div>
    <!-- 图片压缩配置区域 -->
    <imageCompress
      :imageCompressDrawerVisible="imageCompressDrawerVisible"
      @closeImageCompress="imageCompressDrawerVisible = false"
      type="mpCard"
    />
  </div>
</template>
<script>
import { getScreenList, editGzhBack, clearGzhImg } from '@/api/setting/activitySetting/theme';
import request from '@/utils/request';
import uploadImage from '@/api/app/qiniuUpload';
import { compressImage } from '@/utils/index';
import imageCompress from '@/components/imageCompress.vue';

export default {
  name: 'shareCardTheme',
  data() {
    return {
      defaultCardImg: '',
      customCardImg: '',
      isLoading: false,
      imageCompressDrawerVisible: false,
    };
  },
  props: {
    sceneType: {
      type: String,
      default: '0',
    },
  },
  computed: {
    shareCardImg() {
      return this.customCardImg ? this.customCardImg : this.defaultCardImg;
    },
  },
  created() {
    this.requestBgInfo();
  },
  components: {
    imageCompress,
  },
  methods: {
    clearImg() {
      clearGzhImg({
        splid: this.$store.state.liveId,
      })
        .then(() => {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: '操作失败!',
            type: 'success',
          });
        });
    },
    handleFile(e) {
      // this.requestUploadImgFront(e.file);
      compressImage('mpCard', e.file)
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
      editGzhBack({
        splid: this.$store.state.liveId,
        id: '',
        removed: '0',
      })
        .then(() => {
          return uploadImage(file, 'h5Theme', 0.7);
        })
        .then((res) => {
          console.log(res);
          this.customCardImg = res.key;
          const params = {
            splid: this.$store.state.liveId,
            piclink: res.key,
            type: 'GzhBack',
          };
          return request.post('/beiJing/saveGzhBack', params);
        })
        .then(() => {
          this.isLoading = false;
          this.$message({
            message: '图片上传成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('图片上传失败!');
        });
    },
    // 后台上传(废弃)
    requestUploadImg() {
      editGzhBack({
        splid: this.$store.state.liveId,
        id: '',
        removed: '0',
      })
        .then(() => {
          const formData = new FormData();
          formData.append('file', this.uploadFile);
          return request.post('/beiJing/shangchuanTomcat', formData);
        })
        .then((res) => {
          console.log(res);
          this.customCardImg = res.data.filePath;
          const params = {
            splid: this.$store.state.liveId,
            piclink: res.data.filePath,
            type: 'GzhBack',
          };
          return request.post('/beiJing/saveGzhBack', params);
        })
        .then(() => {
          this.$message({
            message: '图片上传成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    cancel() {
      editGzhBack({
        splid: this.$store.state.liveId,
        id: '',
        removed: '0',
      })
        .then((res) => {
          console.log(res);
          this.customCardImg = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    requestBgInfo() {
      const params = {
        splid: this.$store.state.liveId,
        type: 'GzhBack',
        scenario: this.sceneType,
      };
      getScreenList({ params })
        .then((res) => {
          console.log('公众号分享卡片:', res);
          this.defaultCardImg = res.data.default_img_url;
          if (res.data.varList && res.data.varList.length > 0) {
            this.customCardImg = res.data.varList[0].piclink;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.shareCardTheme {
  display: flex;
  align-content: center;
  .previewArea {
    width: 25%;
    position: relative;
    .ctImg {
      width: 89%;
      height: 95%;
      top: 2%;
      left: 6%;
      position: absolute;
      border-radius: 10px;
    }
    .iphoneImg {
      position: relative;
      width: 100%;
    }
    .shareCardImg {
      position: absolute;
      width: 60%;
      height: 24%;
      top: 24%;
      left: 24%;
    }
  }
  .btn2 {
    font-size: 13px;
    color: #3694f1;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 40px;
  }
  .btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 40px;
    position: relative;
    .avatar-uploader {
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
    }
    .delate-bg {
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
      margin-left: 20px;
    }
    .compressBtn {
      color: #67c23a;
      margin-left: 20px;
    }
  }
}
</style>
