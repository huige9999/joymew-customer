<template>
  <div class="card-icons">
    <div class="item" @click="toActivity" v-if="exists.includes('settings')">
      <img src="@/assets/image/icon/setting-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/setting.png" v-if="!isActive" />
      <span>互动配置</span>
    </div>
    <!-- <div class="item" v-if="exists.includes('auditMassage')">
      <img src="@/assets/image/icon/ring-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/ring.png" v-if="!isActive" />
      <span>消息审核</span>
    </div> -->
    <!-- <div class="item" v-if="exists.includes('enterInteraction')">
      <img src="@/assets/image/icon/eatbean-on.png" v-if="isActive"/>
      <img src="@/assets/image/icon/eatbean.png"  v-if="!isActive"/>
      <span>进入互动</span>
    </div> -->
    <div class="item" v-if="exists.includes('signInMember')" @click="siginPerson">
      <img src="@/assets/image/icon/tick-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/tick.png" v-if="!isActive" />
      <span>签到人员</span>
    </div>
    <div class="item" v-if="exists.includes('income') && !isInHMenuHidden" @click="income">
      <img src="@/assets/image/icon/money-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/money.png" v-if="!isActive" />
      <span>活动收入</span>
    </div>
    <div class="item" v-if="exists.includes('fansManagement')" @click="toFans">
      <img src="@/assets/image/icon/activity/fans-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/activity/fans.png" v-if="!isActive" />
      <span>粉丝管理</span>
    </div>
    <div class="item" v-if="exists.includes('winnerItem1')" @click="toLottery">
      <img src="@/assets/image/icon/prize-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/prize.png" v-if="!isActive" />
      <span>中奖记录</span>
    </div>
    <div class="item" v-if="exists.includes('winnerItem2')" @click="toLottery">
      <img src="@/assets/image/icon/prize2-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/prize2.png" v-if="!isActive" />
      <span>中奖记录</span>
    </div>
    <div class="item" v-show="isActive" v-if="exists.includes('deleteActivity')" @click="scanData">
      <img src="@/assets/image/icon/prize-on.png" v-if="isActive" />
      <img src="@/assets/image/icon/activity/scanData.png" v-if="!isActive" class="meng-ban" />
      <span>查看数据</span>
    </div>
    <div class="item" v-show="isActive" v-if="exists.includes('host') && isActive && isBindHost" @click="checkLiveHostInfo">
      <img src="@/assets/image/icon/hostIcon.png" />
      <span>本场主持人</span>
    </div>
    <div class="item upperLimit" v-if="exists.includes('upperLimit')" @click="showBuyer">
      <div class="upperPara">试用上限</div>
      <div class="upperPara">{{ size }}人</div>
    </div>
    <bindHostNew :onlyDialogMode="true" :liveId="liveId" ref="bindHostNew" />
  </div>
</template>

<script>
import bindHostNew from '@/views/homeViews/myActivity/create/components/bindHostNew.vue';
import { mapState } from 'vuex';

export default {
  name: 'cardIcons',
  props: {
    exists: Array,
    isActive: Boolean,
    size: Number,
    liveId: String,
  },
  components: {
    bindHostNew,
  },
  computed: {
    ...mapState({
      high_privilege: (state) => state.login.userInfo.high_privilege,
      bind_switch: (state) => state.login.userInfo.bind_switch,
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
      isBindHost() {
        return this.high_privilege === 3 || this.high_privilege === 4 || this.bind_switch === '1';
      },
    }),
  },
  methods: {
    /* 查看数据 */
    scanData() {
      this.$emit('toScanData');
    },
    toActivity() {
      this.$emit('toSettingEvent');
    },
    /* 粉丝管理 */
    toFans() {
      this.$emit('toSeeFanss');
    },
    /* 中奖记录 */
    toLottery() {
      this.$emit('toSeeLotteryy');
    },
    /* 签到人员 */
    siginPerson() {
      this.$emit('toSiginPerson');
    },
    /* 活动收入 */
    income() {
      this.$emit('toIncome');
    },
    showBuyer() {
      this.$emit('buy');
    },
    checkLiveHostInfo() {
      this.$refs.bindHostNew.openBindedDialog();
    },
  },
};
</script>

<style lang="less" scoped>
.card-icons {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  height: 115px;
  .hvAroundCenter();
  .item {
    cursor: pointer;
    .multiHCenter();
    .meng-ban {
      width: 31px;
      height: 31px;
      background: #000000;
    }
    span {
      font-size: 13px;
      color: #8c8c8c;
    }
    &:nth-child(1) {
      img {
        width: 31px;
        height: 31px;
      }
      span {
        margin-top: 9px;
      }
    }
    &:nth-child(2) {
      img {
        width: 31px;
        height: 31px;
      }
      span {
        margin-top: 7px;
      }
    }
    &:nth-child(3) {
      img {
        width: 29px;
        height: 26px;
      }
      span {
        margin-top: 10px;
      }
    }
    &:nth-child(4) {
      img {
        width: 27px;
        height: 26px;
      }
      span {
        margin-top: 7px;
      }
    }
    &:nth-child(5) {
      img {
        width: 28px;
        height: 30px;
      }
      span {
        margin-top: 6px;
      }
    }
    &:nth-child(6) {
      img {
        width: 27px;
        height: 29px;
      }
      span {
        margin-top: 5px;
      }
    }
    &.upperLimit {
      background-image: url('../../../../assets/image/icon/upperLimit.png');
      background-size: 100% 100%;
      width: 80px;
      height: 80px;
      justify-content: center;
      position: relative;
      .upperPara {
        font-size: 14px;
        color: #ffffff;
        line-height: 34px;
      }
      &::after {
        content: '您当前活动上限人数为20人，点击调整上限人数';
        width: 159px;
        height: 62px;
        background-image: url('../../../../assets/image/icon/dialogBg.png');
        background-size: 100% 100%;
        position: absolute;
        top: -84px;
        right: -50px;
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        padding: 8px 12px;
        line-height: 21px;
        letter-spacing: 1px;
        display: none;
      }
      &:hover {
        &::after {
          display: block;
        }
      }
    }
  }
}
</style>
