<!-- 活动收入头部数据组件 -->
<template>
  <div class="header-item">
    <!-- 签到人数 -->
    <div class="item" v-if="exists.includes('user')" :style="{ order: exists.indexOf('user') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/user.png" alt="" />
      </div>
      <div class="right">
        <div>签到人数</div>
        <div :style="{ color: color.lightGreen }" v-if="sumDetail[0]">{{ parseInt(person, 10) }}</div>
      </div>
    </div>
    <!-- 礼物消费 -->
    <div class="item" v-if="exists.includes('giftTotalConsume')" :style="{ order: exists.indexOf('giftTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftTotalConsume.png" alt="" />
      </div>
      <div class="right">
        <div>礼物总消费</div>
        <div :style="{ color: color.lightOrange }" v-if="sumDetail[0]">{{ sumDetail[0].allused }}</div>
        <!-- <div v-if="sumDetail[0]">{{ parseFloat(sumDetail[0].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 弹幕总消费 -->
    <div class="item" v-if="exists.includes('danMuTotalConsume')" :style="{ order: exists.indexOf('danMuTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/danMuTotalConsume.png" alt="" />
      </div>
      <div class="right">
        <div>弹幕总消费</div>
        <div :style="{ color: color.red }" v-if="sumDetail[1]">{{ sumDetail[1].allused }}</div>
        <!-- <div v-if="sumDetail[1]">{{ parseFloat(sumDetail[1].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 霸屏总消费 -->
    <div class="item" v-if="exists.includes('allScreenTotalConsume')" :style="{ order: exists.indexOf('allScreenTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/allScreenTotalConsume.png" alt="" />
      </div>
      <div class="right">
        <div>霸屏总消费</div>
        <div :style="{ color: color.blueGrey }" v-if="sumDetail[2]">{{ sumDetail[2].allused }}</div>
        <!-- <div v-if="sumDetail[2]">{{ parseFloat(sumDetail[2].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 照片总消费 -->
    <div class="item" v-if="exists.includes('photoTotalConsume')" :style="{ order: exists.indexOf('photoTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/photoDivide.png" alt="" />
      </div>
      <div class="right">
        <div>照片总消费</div>
        <div :style="{ color: color.orange }" v-if="sumDetail[3]">{{ sumDetail[3].allused }}</div>
        <!-- <div v-if="sumDetail[3]">{{ parseFloat(sumDetail[3].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 扭一扭总消费 -->
    <div class="item" v-if="exists.includes('zyzTotalConsume')" :style="{ order: exists.indexOf('zyzTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/zyz.png" alt="" />
      </div>
      <div class="right">
        <div>扭一扭总消费</div>
        <div :style="{ color: color.blueGrey }" v-if="sumDetail[5]">{{ sumDetail[5].allused }}</div>
        <!-- <div v-if="sumDetail[5]">{{ parseFloat(sumDetail[5].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 红包雨总消费 -->
    <div class="item" v-if="exists.includes('redPackageConsume')" :style="{ order: exists.indexOf('redPackageConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/redPackageConsume.png" alt="" />
      </div>
      <div class="right">
        <div>红包雨总消费</div>
        <div :style="{ color: color.lightGreen }" v-if="sumDetail[6]">{{ sumDetail[6].allused }}</div>
        <!-- <div v-if="sumDetail[6]">{{ parseFloat(sumDetail[6].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
    <!-- 宝箱总消费 -->
    <div class="item" v-if="exists.includes('boxTotalConsume')" :style="{ order: exists.indexOf('boxTotalConsume') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/boxTotalCost.png" alt="" />
      </div>
      <div class="right">
        <div>宝箱总消费</div>
        <div :style="{ color: color.red }" v-if="sumDetail[4]">{{ sumDetail[4].allused }}</div>
        <!-- <div v-if="sumDetail[4]">{{ parseFloat(sumDetail[4].earning_ratio * 100) + '%' }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reportData',
  props: {
    exists: Array,
    sumDetail: Array,
    person: Number,
  },
  data() {
    return {
      color: {
        lightOrange: '#FFB97E',
        lightGreen: '#3BCACD',
        red: '#FB466C',
        orange: '#FF7F74',
        blueGrey: '#ABB7C7',
      },
      // total_consumption: '',
    };
  },
};
</script>

<style lang="less" scoped>
.header-item {
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  // border: 1px solid;
  flex-wrap: wrap; /*换行*/
  padding: 5px 45px;
  .item {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    height: 100px;
    flex: none; /*不放大不缩小*/
    // 分割线
    border-right: solid 2px #eeeeee;
    // border-bottom: solid 2px #eeeeee;
    // &:first-child {
    //   // padding-right: 36px;
    // }
    &:nth-of-type(4n) {
      justify-content: center;
      border-right: none;
    }
    &:nth-of-type(-n + 4) {
      border-bottom: solid 2px #eeeeee;
    }
  }

  // 左侧图片
  .left {
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 右侧文字
  .right {
    position: relative;
    padding: 0 5px;
    white-space: nowrap;
    div:nth-of-type(1) {
      font-size: 12px;
      color: #666666;
    }
    div:nth-of-type(2) {
      font-size: 18px;
      color: #3bcacd;
      padding-top: 2px;
    }
    div:nth-of-type(3) {
      position: absolute;
      top: 18px;
      left: 56px;
      text-align: center;
      border-radius: 12px 12px 12px 0px;
      width: 42px;
      height: 22px;
      line-height: 22px;
      font-size: 10px;
      color: #ffffff;
      background: red;
    }
  }
}
</style>
