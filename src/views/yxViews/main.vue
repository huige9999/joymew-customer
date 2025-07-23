<template>
  <div class="yx">
    <div class="yx-header">
      <div class="logo"></div>
      <div class="btn-group">
        <el-button type="primary" @click="prview" v-if="id">预览</el-button>
        <el-button type="none" @click="back">返回</el-button>

        <!-- <el-button type="primary" @click="save">保存</el-button> -->
      </div>
    </div>
    <div class="yx-body">
      <div class="yx-sidebar">
        <div
          class="yx-sidebar-item"
          :class="{ active: activeMenuIndex === index }"
          v-for="(menu, index) in menus"
          :key="menu.id"
          @click="changMenu(index)"
        >{{ menu.text }}</div>
      </div>
      <div class="yx-preview">
        <div class="com" :class="activeMenuClass"></div>
      </div>
      <div class="yx-setting">
        <!-- <div class=""> -->
        <div class="tabbar">
          <div
            class="tab-item"
            :class="{ active: activeTabIndex === index }"
            v-for="(tab, index) in tabs"
            :key="tab.id"
            @click="changTab(index)"
          >{{ tab.text }}</div>
        </div>
        <div class="com-wrapper">
          <baseSetting v-if="activeTabIndex === 0" :aid="id" ref="baseSetting" @update="updateId" />
          <awardType v-if="activeTabIndex === 1" :aid="id" @update="updateId" />
          <awardSetting v-if="activeTabIndex === 2" :aid="id" @update="updateId" />
        </div>
        <!-- </div> -->
      </div>
    </div>

    <PreviewActivity
      v-if="previewVisible"
      :id="id"
      @change="change"
      :release="release"
      @edit="edit"
      @fabu="fabu"
      :canEdit="true"
    />
  </div>
</template>

<script>
import baseSetting from './tab/baseSetting';
import awardType from './tab/awardType';
import awardSetting from './tab/awardSetting';
import PreviewActivity from '../homeViews/yx/previewActivity';
import { editBaseInfo } from '../../api/yx/yx';

export default {
  components: {
    baseSetting,
    awardSetting,
    awardType,
    PreviewActivity,
  },
  data() {
    return {
      release: true,
      previewVisible: false,
      id: null,
      activeAcId: null,
      menus: [
        {
          text: '首页',
          id: 1,
        },
        {
          text: '活动过程',
          id: 2,
        },
        {
          text: '活动奖品',
          id: 3,
        },
        {
          text: '我的奖品',
          id: 4,
        },
        {
          text: '排行榜',
          id: 5,
        },
      ],
      tabs: [
        {
          text: '基本设置',
          id: 1,
        },
        {
          text: '派奖方式',
          id: 2,
        },
        {
          text: '奖项设置',
          id: 3,
        },
      ],
      activeMenuIndex: 0,
      activeTabIndex: 0,
    };
  },
  computed: {
    activeMenuClass() {
      const MenuClass = ['home', 'game', 'reward', 'myreward', 'rank'];

      return MenuClass[this.activeMenuIndex];
    },
  },
  created() {
    this.release = false;
    this.previewVisible = false;
    const { id } = this.$route.query;
    if (id) {
      this.id = id;
    }
  },
  methods: {
    changMenu(index) {
      if (index === this.activeMenuIndex) {
        return;
      }
      this.activeMenuIndex = index;
    },
    changTab(index) {
      if (index === this.activeTabIndex) {
        return;
      }
      if (!this.id && index === 2) {
        this.$message.error('请先保存基本设置');
        return;
      }
      if (!this.id && index === 1) {
        this.$message.error('请先保存基本设置');
        return;
      }
      this.activeTabIndex = index;
    },
    save() {
      console.log(this.activeTabIndex);
      if (this.activeTabIndex === 0) {
        this.$refs.baseSetting.submitForm('baseForm');
        return;
      }
      if (this.activeTabIndex === 1) {
        return;
      }
      if (this.activeTabIndex === 2) {
        // return;
      }
    },
    prview() {
      // const { id, is_release } = item;
      // this.release = is_release === '0';
      // this.activityID = id;
      this.previewVisible = true;
      // if(!this.activeAcId){
      // }
    },
    updateId(e) {
      // console.log(e);
      const { id } = e;
      this.id = id;
    },
    back() {
      this.$router.replace({
        path: '/app/yx',
      });
    },
    edit(e) {
      console.log(e);
      this.editIt(e);
      this.previewVisible = false;
    },
    fabu(e) {
      console.log(e);
      this.releaseIt(e);
      this.previewVisible = false;
    },
    change() {
      console.log(11);
      this.release = false;
      this.previewVisible = false;
      this.activityID = null;
    },
    releaseIt(id) {
      console.log(id);
      const params = {
        id: String(id),
        // is_release: '0',
        is_release: '1',
      };
      editBaseInfo(params).then((res) => {
        console.log(res);
        this.getActivityList();
        this.$message.success('发布成功');
      });
    },
  },
};
</script>

<style lang="less" scoped>
@basePath: "~@/assets/image/yx/demo/";
.yx {
  width: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .yx-header {
    width: 100%;
    // border: 1px solid red;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    box-shadow: 0px 4px 4px 0px rgba(203, 203, 203, 0.19);
    .logo {
      width: 93px;
      height: 47px;
      // border: 1px solid red;
      background-size: 100% 100%;
      background-image: url("~@/assets/image/logo.png");
    }
  }
  .yx-body {
    display: flex;
    height: 100%;
    flex-grow: 1;
    .yx-sidebar {
      padding-top: 24px;
      width: 122px;
      height: 100%;
      background: #fff;
      color: #8ca0b3;
      font-size: 16px;
      background: #ffffff;
      box-shadow: 4px 0px 4px 0px rgba(203, 203, 203, 0.19);
      //   flex-grow: 1;
      .yx-sidebar-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 500;
          color: #0f3d5f;
        }
        &::after {
          display: block;
          content: "";
          width: 12px;
          height: 1px;
          background: #c4c4c4;
          position: absolute;
          bottom: 0;
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
    .yx-preview {
      background: #f2f5f8;
      padding: 76px 45px;
      padding-top: 50px;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      // flex-grow: 1;
      .com {
        @rate: 1.4;
        width: 300px * @rate;
        height: 593px  * @rate;
        background: #c4c4c4;
        background-size: 100% 100%;
        background-image: url("@{basePath}home.jpeg");

        &.home {
          background-image: url("@{basePath}home.jpeg");
        }
        &.game {
          background-image: url("@{basePath}game.jpeg");
        }
        &.reward {
          background-image: url("@{basePath}reward.jpeg");
        }
        &.myreward {
          background-image: url("@{basePath}myreward.jpeg");
        }
        &.rank {
          background-image: url("@{basePath}rank.jpeg");
        }
      }
    }
    .yx-setting {
      width: 718px;
      flex-grow: 1;
      .tabbar {
        display: flex;
        justify-content: center;
        width: 100%;
        background: #f6f6f6;
        color: #666666;
        height: 64px;
        // .line{

        // }
        .tab-item {
          width: 33.33%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
          &.active {
            color: #0f3d5f;
            background: #fff;
          }
          &::after {
            display: block;
            content: "";
            width: 1px;
            height: 28px;
            background: #d9d9d9;
            position: absolute;
            right: 0;
          }
          &:last-child {
            &::after {
              display: none;
            }
          }
        }
      }
      .com-wrapper {
        margin-top: 20px;
      }
      // background: red;
    }
  }
}
</style>
