<!-- 启动仪式设置 -->
<template>
  <sub-page v-loading="loading">
    <main-card class="myMainCard">
      <card-top-info title="启动仪式设置"></card-top-info>
      <div class="mainCt">
        <div class="previewArea">
          <div class="screen">
            <video
              width="1920"
              height="1080"
              src="https://ustatic.hudongmiao.com/joymewScreen/video/bg.webm"
              autoplay="autoplay"
              loop="loop"
              muted
              class="bgVideo"
            ></video>
            <img :src="formData.centerTheme" class="themeLogo" />
            <div class="userList">
              <div class="userItem" v-for="item in 10" :key="item">
                <img :src="formData.avator" class="avator" :class="{defaultAvator: isDefaultAvator}"/>
              </div>
            </div>
          </div>
          <div class="block">
            <span class="label" style="text-align: right">中心主题</span>
            <el-upload class="upload-demo" action :limit="1" :show-file-list="false" :http-request="handleCenterTheme">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button size="small" style="margin-left: 20px" @click="resetCenterTheme">恢复默认</el-button>
          </div>
          <div class="block">
            <span class="label" style="text-align: right">头像</span>
            <el-upload class="upload-demo" action :limit="1" :show-file-list="false" :http-request="handleAvator">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button size="small" style="margin-left: 20px" @click="resetAvator">恢复默认</el-button>
          </div>
        </div>
        <div class="previewArea">
          <div class="screen">
            <video
              width="1920"
              height="1080"
              src="https://ustatic.hudongmiao.com/joymewScreen/video/bg.webm"
              autoplay="autoplay"
              loop="loop"
              muted
              class="bgVideo"
            ></video>
            <img :src="formData.endTheme" class="themeLogo" />
          </div>
          <div class="block">
            <span class="label" style="text-align: right">结束主题</span>
            <el-upload class="upload-demo" action :limit="1" :show-file-list="false" :http-request="handleEndTheme">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button size="small" style="margin-left: 20px" @click="resetEndTheme">恢复默认</el-button>
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
import request from '@/utils/request';

const defaultCenterTheme = require('../../../assets/image/centerTheme.png');
const defaultEndTheme = require('../../../assets/image/logo.png');

const defaultAvator = 'https://static.hudongmiao.com/joymewScreen/img/startCeremony/handAni.webp';

export default {
  name: 'launchCeremony',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  created() {
    this.initData();
  },
  data() {
    return {
      formData: {
        centerTheme: defaultCenterTheme,
        avator: defaultAvator,
        endTheme: defaultEndTheme,
      },
      loading: false,
    };
  },
  computed: {
    isDefaultAvator() {
      return this.formData.avator === defaultAvator;
    },
  },
  methods: {
    handleCenterTheme(e) {
      console.log(e);
      this.handleImgFile(e.file, 'centerTheme');
    },
    handleAvator(e) {
      console.log(e);
      this.handleImgFile(e.file, 'avator');
    },
    handleEndTheme(e) {
      console.log(e);
      this.handleImgFile(e.file, 'endTheme');
    },
    handleImgFile(imgFile, type) {
      if (imgFile.size > 11000000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(imgFile.type === 'image/jpeg' || imgFile.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      const formData = new FormData();
      formData.append('file', imgFile);
      request.post('/beiJing/shangchuanTomcat', formData).then((res) => {
        console.log('上传主题图片的图片地址', res.data.filePath);
        if (type === 'centerTheme') {
          this.formData.centerTheme = res.data.filePath;
        } else if (type === 'avator') {
          this.formData.avator = res.data.filePath;
        } else if (type === 'endTheme') {
          this.formData.endTheme = res.data.filePath;
        }
        this.updateDate();
      });
    },
    updateDate() {
      const formData = {
        begin_yishi: JSON.stringify(this.formData),
        splid: this.$store.state.liveId,
      };
      request.post('/qiYeNe/update', formData).then((res) => {
        console.log(res);
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    initData() {
      this.loading = true;
      request
        .get(`/qiYeNe/liebiao?splid=${this.$store.state.liveId}`)
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.data.begin_yishi) {
            const beginYishiObj = JSON.parse(res.data.begin_yishi);
            if (beginYishiObj.centerTheme) {
              this.formData.centerTheme = beginYishiObj.centerTheme;
            }
            if (beginYishiObj.avator) {
              this.formData.avator = beginYishiObj.avator;
            }
            if (beginYishiObj.endTheme) {
              this.formData.endTheme = beginYishiObj.endTheme;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetCenterTheme() {
      this.formData.centerTheme = defaultCenterTheme;
      this.updateDate();
    },
    resetAvator() {
      this.formData.avator = defaultAvator;
      this.updateDate();
    },
    resetEndTheme() {
      this.formData.endTheme = defaultEndTheme;
      this.updateDate();
    },
  },
};
</script>
<style lang="less" scoped>
.myMainCard {
  position: relative;
}
.mainCt {
  display: flex;
  .previewArea {
    width: 50%;
    margin-left: 20px;
    margin-bottom: 20px;
    .screen {
      width: 480px;
      height: 270px;
      background-color: #000;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .bgVideo {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      .themeLogo {
        width: 200px;
        position: absolute;
      }
      .userList {
        width: 425px;
        height: 46px;
        overflow: hidden;
        position: absolute;
        bottom: 35px;
        display: flex;
        .userItem {
          margin: 0 4px;
          width: 44px;
          height: 35px;
          border: 1px solid #28deff;
          border-radius: 50%;
          .avator {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            &.defaultAvator {
              transform: translate(3px, 1px);
            }
          }
        }
      }
      &:nth-child(1) {
        margin-bottom: 20px;
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
  }
}
</style>
