<template>
  <sub-page class="yx">
    <!-- <main-card class="yxCardWrap"> 为 </main-card> -->
    <div class="yx-navbar">
      <div
        class="navbar-item"
        :class="{ active: currentNavBarIndex === index }"
        v-for="(item, index) in navBarList"
        :key="'nav' + index"
        @click="changeTab(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="yx-card">
      <!-- <div class="yx-card-item add" @click="add">
        <div class="card-add"></div>
        <div class="card-text">创建活动</div>
      </div> -->
      <div class="yx-card-item" v-for="card in cards" :key="card.id">
        <div class="badge" :class="[card.release_class]">{{ card.release_name }}</div>
        <div class="top">
          <div class="box" :class="{ chouJiang: String(card.type) === '2', daodian: String(card.type) === '3' }"></div>
          <div class="title">{{ card.title }}</div>
        </div>
        <div class="detail" v-if="String(card.type) === '1'">
          <div>
            互动时间：
            <span>{{ card.start_date }} ~ {{ card.end_date }}</span>
          </div>
          <div>
            参与人数：
            <span>{{ card.canyu_size || 0 }} 人</span>
          </div>
        </div>
        <div class="detail" v-if="String(card.type) === '2' || String(card.type) === '3'">
          <div>
            已领取人数：
            <span>{{ card.totalPrizeGainUserCount || 0 }}人</span>
          </div>
          <div>
            奖品情况：
            <span>剩余{{ card.remainAwardNum || 0 }}份</span>
          </div>
        </div>
        <div class="operate">
          <el-popconfirm
            v-if="card.is_release === '0'"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定发布本条活动吗"
            @confirm="releaseIt(card)"
            @onConfirm="releaseIt(card)"
          >
            <div class="action-group" slot="reference">
              <div class="btn-release btn">
                <div class="icon"></div>
              </div>
              <div class="text">发布</div>
            </div>
          </el-popconfirm>

          <div class="action-group" @click="editIt(card)">
            <div class="btn-edit btn">
              <div class="icon"></div>
            </div>
            <div class="text">编辑</div>
          </div>

          <div class="action-group" @click="previewIt(card)">
            <div class="btn-preview btn">
              <div class="icon"></div>
            </div>
            <div class="text">预览</div>
          </div>

          <div class="action-group" @click="showData(card)">
            <div class="btn-data btn">
              <div class="icon"></div>
            </div>
            <div class="text">数据</div>
          </div>

          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除本条活动吗"
            @confirm="deleteIt(card)"
            @onConfirm="deleteIt(card)"
          >
            <div class="action-group" slot="reference">
              <div class="btn-delete btn">
                <div class="icon"></div>
              </div>
              <div class="text">删除</div>
            </div>
          </el-popconfirm>

          <el-popconfirm
            v-if="card.is_release !== '0'"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定结束本条活动吗"
            @confirm="endIt(card)"
            @onConfirm="endIt(card)"
          >
            <div class="action-group" slot="reference">
              <div class="btn-end btn">
                <div class="icon"></div>
              </div>
              <div class="text">结束</div>
            </div>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <PreviewActivity v-if="previewVisible" :id="activityID" :type="currentType" @change="change" :release="release" @edit="edit" @fabu="fabu" />
    <phone v-if="phoneVisible" :id="activityID" @close="close" />
  </sub-page>
</template>

<script>
import { getActivityList, editBaseInfo } from '@/api/yx/yx';
import SubPage from '@/components/subPage';
import PreviewActivity from '../previewActivity';
import phone from '../phone.vue';

export default {
  name: 'yx',
  components: {
    // MainCard,
    PreviewActivity,
    SubPage,
    phone,
  },
  data() {
    return {
      release: false,
      phoneVisible: false,
      previewVisible: false,
      currentNavBarIndex: 0,
      activityID: null,
      currentType: '',
      navBarList: [
        {
          id: null,
          text: '全部',
        },
        {
          id: '0',
          text: '未发布',
        },
        {
          id: '1',
          text: '进行中',
        },
        {
          id: '2',
          text: '已结束',
        },
      ],
      cards: [],
    };
  },
  created() {
    this.getActivityList();
  },
  methods: {
    close() {
      this.phoneVisible = false;
      this.activityID = null;
    },
    change() {
      console.log(11);
      this.release = false;
      this.previewVisible = false;
      this.activityID = null;
    },
    getActivityList() {
      const params = {
        // is_release: this., // "0:未发布 1:进行中 2：已结束  不填就是全部",
        is_delete: '0', // 1：删除   0不要删除",
        currentPage: '1', //
        showCount: '100', //
      };

      if (this.currentNavBarIndex > 0) {
        params.is_release = this.navBarList[this.currentNavBarIndex].id;
      }
      getActivityList(params).then((res) => {
        console.log(res);
        const releaseMap = {
          0: '未发布',
          1: '进行中',
          2: '已结束',
        };
        this.cards = res.data.list.map((card) => {
          if (String(card.type) === '2') {
            card.remainAwardNum = this.remainAward(card);
          }
          if (String(card.type) === '3') {
            card.remainAwardNum = this.remainDaodianli(card);
          }
          return {
            ...card,
            // release: :
            release_name: releaseMap[card.is_release] || '',
            // release_class: 'badge-' + card.is_release,
            release_class: `badge-${card.is_release}`,
          };
        });
      });
    },
    changeTab(index) {
      if (index === this.currentNavBarIndex) {
        return;
      }
      this.currentNavBarIndex = index;

      this.getActivityList();
    },
    add() {
      this.$router.push({
        path: '/app/yxViews/main',
      });
    },
    deleteIt(item) {
      console.log(item);
      const params = {
        id: String(item.id),
        is_delete: '1',
        // is_delete: '0',
      };
      if (String(item.type) === '2') {
        params.is_clear_redis = '1';
      }
      editBaseInfo(params).then((res) => {
        console.log(res);
        this.$message.success('删除成功');
        this.getActivityList();
      });
    },
    releaseIt(item) {
      console.log(item);
      const params = {
        id: String(item.id),
        // is_release: '0',
        is_release: '1',
      };
      if (String(item.type) === '2') {
        params.is_clear_redis = '1';
      }
      editBaseInfo(params).then((res) => {
        console.log(res);
        this.getActivityList();
        this.$message.success('发布成功');
      });
    },
    editIt(item) {
      const { id, type } = item;
      if (String(type) === '1') {
        this.$router.push({
          path: '/app/yxViews/main',
          query: {
            id,
          },
        });
      } else if (String(type) === '2') {
        this.$router.push({
          path: '/app/yxChouJiang/chouJiang',
          query: {
            id,
          },
        });
      } else if (String(type) === '3') {
        this.$router.push({
          path: '/app/daodian',
          query: {
            id,
          },
        });
      }
    },
    previewIt(item) {
      const { id, is_release, type } = item;
      this.release = is_release === '0';
      this.activityID = id;
      this.currentType = type;
      this.previewVisible = true;
    },
    edit(e) {
      console.log(e);
      this.editIt(e);
      this.previewVisible = false;
    },
    endIt(e) {
      console.log(e);
      const params = {
        id: String(e.id),
        is_release: '2',
      };
      if (String(e.type) === '2') {
        params.is_clear_redis = '1';
      }
      editBaseInfo(params).then((res) => {
        console.log(res);
        this.$message.success('已结束');
        this.getActivityList();
      });
    },
    fabu(e) {
      console.log(e);
      this.releaseIt(e);
      this.previewVisible = false;
    },
    showData(item) {
      const { id } = item;
      this.activityID = id;
      // this.phoneVisible = true;
      // 判断活动类型
      if (String(item.type) === '1') {
        this.$router.push({
          name: 'yxrank',
          params: {
            id,
          },
        });
      } else if (String(item.type) === '2') {
        this.$router.push({
          name: 'chouJiangData',
          params: {
            id,
          },
        });
      } else if (String(item.type) === '3') {
        this.$router.push({
          name: 'daodianData',
          params: {
            id,
          },
        });
      }
    },
    // 处理奖品剩余数量
    remainAward(card) {
      if (!card?.prize_json) return 0;
      if (Number(card.prize_json.totalPrizeCount) <= Number(card.totalPrizeGainCount || 0)) return 0;
      return Number(card.prize_json.totalPrizeCount) - Number(card.totalPrizeGainCount || 0);
    },
    // 处理剩余到店礼
    remainDaodianli(card) {
      if (!card.prize_json) return 0;
      if (Number(card.prize_json.award_num) <= Number(card.totalPrizeGainCount || 0)) return 0;
      return Number(card.prize_json.award_num) - Number(card.totalPrizeGainCount || 0);
    },
  },
  computed: {
    // ...mapState({}),
  },
};
</script>

<style lang="less" scoped>
@basePath: '~@/assets/image/yx/';
@addIcon: '@{basePath}add.png';
.yx-navbar {
  padding: 20px;
  display: flex;
  .navbar-item {
    margin-right: 48px;
    font-size: 28rpx;
    color: #333333;
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      font-weight: 500;
      color: #1e87f0;
    }
  }
}
.yx-card {
  padding: 0 20px 20px 20px;
  // color: red;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 32px;
  .yx-card-item {
    width: 360px;
    height: 255px;
    background: #f3f3f3;
    // margin-right: 32px;
    // margin-top: 32px;
    flex-grow: 0;
    // margin: 32px auto;
    border-radius: 10px;
    position: relative;
    &.add {
      border-radius: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: #fff;
      .card-add {
        width: 64px;
        height: 64px;
        background-size: 100% 100%;
        background-image: url(@addIcon);
      }
      .card-text {
        margin-top: 10px;
        color: #333333;
        font-size: 16px;
      }
    }
    .badge {
      position: absolute;
      top: 12px;
      right: 0px;
      width: 58px;
      height: 23px;
      background: #ffb86f;
      box-shadow: 0px 2px 8px 0px rgba(255, 173, 98, 0.25), 0px 0px 57px 0px rgba(255, 228, 132, 0.25) inset;
      font-size: 14px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      &.badge-0 {
        background: #ffb86f;
      }
      &.badge-1 {
        background: #18d671;
      }
      &.badge-2 {
        background: #c4c4c4;
      }
    }
    .top {
      height: 99px;
      padding: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      @radius: 10px;
      border-top-left-radius: @radius;
      border-top-right-radius: @radius;
      .box {
        width: 102px;
        height: 67px;
        // background: #1e87f0;
        background-image: url('@{basePath}banner.png');
        background-size: 100% 100%;
      }
      .chouJiang {
        background-image: url('@{basePath}chou-banner.png');
      }
      .daodian {
        background-image: url('@{basePath}/daodianli/daodian-bg.png');
      }
      .title {
        color: #333;
        font-size: 20px;
        font-weight: 500;
        margin-left: 16px;
      }
    }
    .detail {
      display: flex;
      justify-content: space-evenly;
      align-items: flex-start;
      flex-direction: column;
      padding-left: 28px;
      color: #333;
      font-size: 14px;
      height: 72px;
    }
    .operate {
      height: 84px;
      background: #fff;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      @radius: 10px;
      border-bottom-left-radius: @radius;
      border-bottom-right-radius: @radius;
      .action-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .btn {
          background-size: 100% 100%;
          width: 28px;
          height: 28px;
          opacity: 0.4;
          background: #0080ff;
          border-radius: 50%;
          margin-bottom: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          &.btn-edit {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}bianji.png');
            }
          }
          &.btn-release {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}fabu.png');
            }
          }
          &.btn-end {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}end.png');
            }
          }
          &.btn-delete {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}shanchu.png');
            }
          }
          &.btn-data {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}shuju.png');
            }
          }
          &.btn-preview {
            .icon {
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
              background-image: url('@{basePath}yulan.png');
            }
          }
        }
      }
    }
  }
}
</style>
