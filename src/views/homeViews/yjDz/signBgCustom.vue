<template>
  <sub-page>
    <main-card>
      <card-top-info title="自定义签到背景"></card-top-info>
      <div class="shareCardInfo">
        <div class="signTheme">
          <div class="previewArea">
            <img :src="customSignBg" class="ctImg" />
            <img src="@/assets/image/iphone.png" class="iphoneImg" />
            <div class="signBox">
              <img src="@/assets/image/signBox.jpg" class="signBoxImg" />
            </div>
          </div>
          <div class="btn">
            <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="handleFile">
              <div class="select-bg-button"><i class="el-icon-plus"></i>&nbsp;自选</div>
            </el-upload>
            <div class="delate-bg" @click="cancelUpload">取消上传</div>
          </div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { editSignBgCustom } from '@/api/app/user';
import request from '@/utils/request';

const DEFAULTBG = 'https://ustatic.joymew.com/joymewMp/joymewIndex/weddingSignBg.png';
export default {
  name: 'signTheme',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      customSignBg: DEFAULTBG,
      uploadFile: null,
    };
  },
  created() {
    this.initBgCustom();
  },
  methods: {
    initBgCustom() {
      if (!this.$store.state.login.userInfo.sign_json) {
        return;
      }
      try {
        const signJsonObj = JSON.parse(this.$store.state.login.userInfo.sign_json);
        this.customSignBg = signJsonObj.bg;
      } catch (err) {
        console.log(err);
      }
    },
    handleFile(e) {
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        // 这里对base64 进行压缩
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = freader.result;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.clearRect(0, 0, img.width, img.height);
          context.drawImage(img, 0, 0, img.width, img.height);
          const result = canvas.toDataURL('image/jpeg', 0.7);

          // 转换成 file
          const arr = result.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'photo');
          this.uploadFile = file;
          // 调用图片上传接口
          this.requestUploadImg();
        };
      };
    },
    cancelUpload() {
      editSignBgCustom({
        sign_json: '',
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '取消上传成功',
            type: 'success',
          });
          this.customSignBg = DEFAULTBG;
          this.$store.commit('login/updateSignJson', '');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('取消上传失败!');
        });
    },
    requestUploadImg() {
      const formData = new FormData();
      formData.append('file', this.uploadFile);

      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log(res);
          const tmpParamObj = {
            bg: res.data.filePath,
          };
          const tmpParamObjStr = JSON.stringify(tmpParamObj);
          editSignBgCustom({
            sign_json: tmpParamObjStr,
          })
            .then((res2) => {
              console.log(res2);
              this.$message({
                message: '图片上传成功',
                type: 'success',
              });
              this.customSignBg = res.data.filePath;
              this.$store.commit('login/updateSignJson', tmpParamObjStr);
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
  },
};
</script>
<style scoped lang="less">
.shareCardInfo {
  padding-left: 20px;
  padding-bottom: 20px;
  .signTheme {
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
      .signBox {
        width: 80%;
        height: 38%;
        background-color: #ffffff;
        border-radius: 10px;
        position: absolute;
        bottom: 10%;
        left: 11%;
        display: flex;
        justify-content: center;
        align-items: center;
        .signBoxImg {
          width: 80%;
        }
      }
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
    }
  }
}
</style>
