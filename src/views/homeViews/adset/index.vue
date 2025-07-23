<template>
  <sub-page>
    <div class="header">
      品牌营销是在<label class="blue">抬花轿</label>游戏和<label class="blue">划一划</label>游戏中，背景可以植入<label class="red"
        >婚庆公司，酒店，四大金刚</label
      >等广告，让全场来宾都可以看到各自的品牌，只需设置一次，每次活动都会出现品牌广告。
    </div>
    <main-card>
      <div class="uploadArea">
        <div class="uploadItem" v-for="item in itemList" :key="item.key">
          <div class="name">{{ item.name }}</div>
          <div class="uploadEntry">
            <img :src="fileList[item.index].url" v-if="fileList[item.index] && fileList[item.index].url" class="previewImg" />
            <img
              src="@/assets/image/delete_icon.png"
              class="deleteIcon"
              v-show="fileList[item.index] && fileList[item.index].url !== addefaultList[item.index]"
              @click="handleRemoveImg(item.index)"
            />
          </div>
          <div class="uploadTip">（默认广告 建议尺寸16:9）</div>

          <el-upload class="upload-demo" action :http-request="handleBgFile" :limit="1" :name="item.index">
            <div class="uploadBtn">重新上传</div>
          </el-upload>
        </div>
      </div>
      <div class="previewArea">
        <div class="previewItem">
          <div class="name">抬花轿摇一摇预览</div>
          <div class="previewContent">
            <img src="@/assets/image/ad/adSet/sky.png" class="skyImg" />
            <img src="@/assets/image/ad/adSet/clouds.png" class="cloudsImg" />
            <img src="@/assets/image/ad/adSet/distanceArchitecture.png" class="distanceArchitectureImg" />
            <div class="ads">
              <div class="adItem" v-for="item in itemList" :key="item.index">
                <img :src="fileList[item.index].url" class="ad" />
              </div>
            </div>
            <img src="@/assets/image/ad/adSet/runway.png" class="runway" />
            <img src="@/assets/image/ad/adSet/buildingBg.png" class="buildingBg" />
            <img src="@/assets/image/ad/adSet/audidenceBg.png" class="audidenceBg" />
          </div>
        </div>
        <div class="previewItem">
          <div class="name">划一划预览</div>
          <div class="previewContent countMoney">
            <div class="ads">
              <div class="adItem" v-for="item in itemList" :key="item.index">
                <img :src="fileList[item.index].url" class="ad" />
                <img src="@/assets/image/ad/adSet/ad-wrap.webp" class="adBgImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import request from '@/utils/request';
import { setAd } from '@/api/app/user';
import { Login } from '@/api/login';
import messageMixin from '@/mixins/messageBoxMixin';

const BLOCKLIST = [
  {
    name: '背景一',
    key: 'ad1',
    index: '0',
  },
  {
    name: '背景二',
    key: 'ad2',
    index: '1',
  },
];
const ADDEFULTLIST = [require('../../../assets/image/ad/adDefault1.png'), require('../../../assets/image/ad/adDefault2.png')];

export default {
  name: 'adset',
  mixins: [messageMixin],
  components: { MainCard, SubPage },
  data() {
    return {
      fileList: [],
      itemList: BLOCKLIST,
      addefaultList: ADDEFULTLIST,
    };
  },
  methods: {
    initFileList() {
      for (let i = 0; i < 2; i += 1) {
        this.fileList.push({
          url: ADDEFULTLIST[i],
        });
      }
      if (this.$store.state.login.userInfo.advert_json) {
        // 上传过广告图
        const advertJson = JSON.parse(this.$store.state.login.userInfo.advert_json);
        advertJson.forEach((item, index) => {
          if (item.url.indexOf('/static/img/adDefault') === -1) {
            // 非默认图片
            this.fileList[index].url = item.url;
          }
        });
      }
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
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
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

          console.log('上传的图片');
          console.log(file);
          this.bgFile = file;
          // 调用图片上传接口
          this.uploadBgFile(parseInt(e.filename, 10));
        };
      };
    },
    // 走后台上传
    uploadBgFile(fileIndex) {
      const formData = new FormData();
      formData.append('file', this.bgFile);
      request.post('/beiJing/shangchuanTomcat', formData).then((res) => {
        console.log('上传主题图片的图片地址', res);
        this.fileList[fileIndex].url = res.data.filePath;
        this.updateAd();
      });
    },
    // 删除图片(恢复成默认的广告)
    handleRemoveImg(fileIndex) {
      this.fileList[fileIndex].url = ADDEFULTLIST[fileIndex];
      this.updateAd();
    },
    updateAd() {
      setAd(this.fileList)
        .then((res) => {
          console.log(res);
          Login({ request_from_page: '/app/adset/index' }).then((res) => {
            this.$store.commit('login/updateUserInfo', res);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.initFileList();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.header {
  font-size: 20px;
  color: #333333;
  font-weight: 400;
  padding: 20px;
  width: 100%;
  background-color: #ffffff;
  line-height: 30px;
  .blue {
    color: #1e87f0;
  }
  .red {
    color: #ff1e1e;
  }
}
.uploadArea {
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .uploadItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
      font-size: 16px;
      color: #333333;
      font-weight: 500;
    }
    .uploadEntry {
      width: 320px;
      height: 180px;
      position: relative;
      margin-top: 20px;
      .previewImg {
        width: 100%;
        height: 100%;
      }
      .deleteIcon {
        position: absolute;
        width: 22px;
        height: 22px;
        right: -24px;
        top: 1px;
        cursor: pointer;
      }
    }
    .uploadTip {
      font-size: 14px;
      color: #333333;
      font-weight: 400;
      margin-top: 10px;
    }
    .uploadBtn {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #ffffff;
      font-weight: 400;
      margin-top: 20px;
      background-color: #1e87f0;
      width: 140px;
      height: 39px;
      border-radius: 3px;
      position: relative;
    }
  }
}
.previewArea {
  padding: 20px;
  margin-top: 20px;
  // display: flex;
  // justify-content: space-between;
  .previewItem {
    margin-bottom: 12px;
    // width: 48%;
    .name {
      font-size: 20px;
      font-weight: 500;
      color: #333333;
    }
    .previewContent {
      width: 100%;
      height: 295px;
      margin-top: 15px;
      position: relative;
      overflow: hidden;
      .skyImg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .cloudsImg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .distanceArchitectureImg {
        position: absolute;
        width: 100%;
        height: 52%;
        bottom: 20px;
        left: 0;
      }
      .ads {
        display: flex;
        width: 100%;
        height: 185px;
        justify-content: space-around;
        position: absolute;
        bottom: 35px;
        .adItem {
          width: 306px;
          height: 185px;
          background-image: url("../../../assets/image/ad/adSet/adWall.png");
          background-size: 100% 100%;
          position: relative;
          .ad {
            position: absolute;
            width: 255px;
            height: 143px;
            left: 26px;
            top: 32px;
          }
        }
      }
      .runway {
        position: absolute;
        width: 100%;
        height: 80px;
        bottom: 0;
      }
      .buildingBg {
        position: absolute;
        width: 100%;
        height: 83px;
        bottom: 20px;
      }
      .audidenceBg {
        position: absolute;
        width: 100%;
        height: 28px;
        bottom: 20px;
      }
      &.countMoney {
        background-image: url("../../../assets/image/ad/adSet/bg.jpg");
        background-size: cover;
        background-position: center;
        .ads {
          display: flex;
          width: 100%;
          height: 185px;
          justify-content: space-around;
          position: absolute;
          bottom: 35px;
          .adItem {
            width: 306px;
            height: 185px;
            position: relative;
            background-image: unset;
            .ad {
              position: absolute;
              width: 235px;
              height: 125px;
              left: 35px;
              top: 25px;
            }
            .adBgImg {
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.upload-demo::v-deep {
  .el-upload-list {
    display: none;
  }
}
</style>
