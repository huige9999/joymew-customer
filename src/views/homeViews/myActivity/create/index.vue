<template>
  <sub-page class="createActivity">
    <main-card>
      <div class="title">- 活动创建 -</div>
      <create-step-company v-if="company" />
      <create-step1 v-else-if="!isHlt" />
      <create-step-tql v-else-if="isHlt" />
      <el-divider></el-divider>
      <my-tip-bar color-style="blue">
        为了您的互动体验更流畅，请使用chrome浏览器进行互动
        <a :href="downloadURL" class="blue-text" target="_blank">立即下载</a>
      </my-tip-bar>
    </main-card>
  </sub-page>
</template>

<script>
import MainCard from '@/components/mainCard.vue';
import MyTipBar from '@/components/myTipBar.vue';
import SubPage from '@/components/subPage.vue';
import { mapState } from 'vuex';
import CreateStepCompany from './components/create-step-company.vue';
import CreateStepTql from './components/create-step-tql.vue';
import CreateStep1 from './components/create-step1.vue';

const macUrl = 'https://ustatic.joymew.com/browsers/googlechromeSetupMacos.dmg';
const osUrl = 'https://ustatic.joymew.com/browsers/ChromeStandaloneSetup64.exe';
export default {
  name: 'createActivity',
  components: {
    CreateStep1,
    CreateStepTql,
    CreateStepCompany,
    MainCard,
    MyTipBar,
    SubPage,
  },
  data() {
    return {
      active: 0,
      downloadURL: osUrl,
    };
  },
  computed: {
    ...mapState({
      high_privilege: (state) => state.login.userInfo.high_privilege,
      user_end_type: (state) => state.login.userInfo.config.user_end_type,
    }),
    isHlt() {
      return this.high_privilege === 3 || this.high_privilege === 4 || this.high_privilege === 5;
    },
    company() {
      return this.user_end_type === '1';
    },
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    // 不同系统浏览器下载
    generateDownloadURL() {
      const version = navigator.userAgent.toLowerCase();
      const mac = version.indexOf('mac');
      const os = version.indexOf('os');
      if (mac > 0 && os > 0) {
        // 苹果系统下执行的操作
        this.downloadURL = macUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      } else {
        this.downloadURL = osUrl; // 这里的请求方式为get，如果需要认证，接口上需要带上token
      }
      console.log(this.downloadURL);
    },
  },
  created() {
    this.generateDownloadURL();
  },
};
</script>

<style lang="less" scoped>
.createActivity {
  .main-card {
    padding: 10px;
    .title {
      margin: auto;
      margin-bottom: 10px;
      margin-top: 18px;
      font-size: 20px;
      font-weight: 500;
      color: #1890ff;
      line-height: 27px;
    }
  }
  .my-steps {
    width: 90%;
    max-width: 760px;
    margin: auto;
    margin-top: 25px;
    margin-bottom: 22px;
  }
  .my-tip-bar {
    margin-left: 55px;
  }
}
.createActivity::v-deep {
  .el-divider--horizontal {
    margin-top: 0;
  }
}
</style>
