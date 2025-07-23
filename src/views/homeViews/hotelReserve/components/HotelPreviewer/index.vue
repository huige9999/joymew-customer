<template>
  <div class="previewArea">
    <section class="block1" v-if="id">
      <!-- <div class="imgItem" v-for="(item, index) in hotelBaseData.carouselList" :key="index">
        <img :src="item" class="cImg"  />
      </div> -->
      <el-carousel :autoplay="false" height="177px" indicator-position="none" class="carousel-wrap" ref="carousel"
        @change="handleCarouselChange">
        <el-carousel-item v-for="(item, index) in mediaCarouselList" :key="index">
          <img class="element-img" :src="item.mediaPath" v-if="item.type === 'img'" />
          <img class="element-img" :src="item.poster" v-if="item.type === 'video' && !item.isPlay" />
          <i class="el-icon-video-play play-icon" v-if="item.type === 'video' && !item.isPlay" @click="playMedia"></i>
          <video class="element-video" :src="item.mediaPath" v-if="item.type === 'video' && item.isPlay" controls autoplay
            @pause="updatePaused"></video>
        </el-carousel-item>
      </el-carousel>
      <div class="navDot" v-if="currentMediaType">
        <div class="dot" :class="{ active: currentMediaType === 'video' }" @click="chooseNav('video')">视频</div>
        <div class="dot" :class="{ active: currentMediaType === 'img' }" @click="chooseNav('img')">照片</div>
      </div>
    </section>
    <section class="block2" v-if="id">
      <div class="hotelName" v-show="hotelBaseData.hotelName">
        {{ hotelBaseData.hotelName }}
        <div class="authBox">
          <img src="@/assets/image/auth_icon.png" alt="认证图片" class="auth-img" />
          已认证
        </div>
      </div>
      <div class="labelList" v-if="hotelBaseData.baseLabelList.length > 0">
        <div class="labelItem" v-for="(item, index) in hotelBaseData.baseLabelList" :key="index">{{ item }}</div>
      </div>
      <div class="contactInfo">
        <div class="address">
          <img src="@/assets/image/location_icon.png" alt="位置icon" class="location_icon" />
          {{ hotelBaseData.location }}
        </div>
        <div class="phone-info">
          <div class="phoneIconBox">
            <img src="@/assets/image/phone_icon.png" class="phoneIcon" />
          </div>
          电话
        </div>
      </div>
      <div class="paraInfo" v-if="hotelBaseData.baseParaList.length > 0">
        <div class="paraItem">
          <div class="value-info">
            <label>{{ hotelBaseData.baseParaList[0] }}</label>年
          </div>
          <div class="key">装修时间</div>
        </div>
        <div class="paraItem">
          <div class="value-info">
            <label>{{ hotelBaseData.baseParaList[1].split('/')[0] }}</label>个/最多{{hotelBaseData.baseParaList[1].split('/')[1]}}桌
          </div>
          <div class="key">宴会厅</div>
        </div>
        <div class="paraItem">
          <div class="value-info">
            <label>{{ hotelBaseData.baseParaList[2] }}</label>/桌
          </div>
          <div class="key">最低餐标</div>
        </div>
        <div class="paraItem">
          <div class="value-info">
            <label>{{ hotelBaseData.baseParaList[3] }}</label>
          </div>
          <div class="key">停车位</div>
        </div>
      </div>
      <!-- <div class="contactInfo">
        <div class="address" v-show="hotelBaseData.location">
          <img src="@/assets/image/placeIcon.png" class="placeIcon" />
          {{ hotelBaseData.location }}
        </div>
        <div class="phone" v-show="hotelBaseData.phone">
          <img src="@/assets/image/phoneIcon.png" class="phoneIcon" />
          电话
          <el-popover placement="top-start" title="手机号" width="150" trigger="hover" :content="hotelBaseData.phone">
            <el-button slot="reference"></el-button>
          </el-popover>
        </div>
      </div> -->
      <div class="entryInfo">
        <label>入口Logo：</label>
        <img :src="hotelBaseData.icon" v-show="hotelBaseData.icon" />
      </div>
      <div class="funcSwitch" v-show="id">
        <label>功能开关：</label>
        <el-switch :value="hotelBaseData.switchStatus" active-value="1" inactive-value="0"> </el-switch>
      </div>
    </section>
    <section class="block3" v-if="!id">
      暂无酒店
    </section>
  </div>
</template>

<script>
import { switchFunc } from '@/api/hotelReserve/index';

export default {
  name: 'previewHotel',
  props: {
    id: [Number, String],
    hotelBaseData: Object,
  },
  watch: {
    'hotelBaseData.carouselVideoList': function carouselVideoListWatchHandle(val) {
      if (val.length > 0) {
        this.currentMediaType = 'video';
      }
    },
  },
  computed: {
    mediaCarouselList() {
      const videoList = this.hotelBaseData.carouselVideoList.map((item) => {
        let returnObj;
        if (typeof item === 'string') {
          returnObj = {
            poster: `${item}?vframe/jpg/offset/1/w/500/h/400`,
            mediaPath: item,
            type: 'video',
            isPlay: false,
          };
        } else {
          returnObj = {
            poster: item.poster,
            mediaPath: item.path,
            type: 'video',
            isPlay: false,
          };
        }
        return returnObj;
      });
      const imgList = this.hotelBaseData.carouselList.map((item) => {
        return {
          mediaPath: item,
          type: 'img',
        };
      });
      return [...videoList, ...imgList];
    },
  },
  data() {
    return {
      hasNoHotel: true,
      currentCarouselIndex: 0,
      currentMediaType: '', // 取值video、img
    };
  },
  methods: {
    switchHotelReserveFunc(e) {
      switchFunc(e, this.id)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCarouselChange(e) {
      console.log(e);
      this.currentCarouselIndex = e;
      let lastCarouselIndexLeft = this.currentCarouselIndex - 1;
      let lastCarouselIndexRight = this.currentCarouselIndex + 1;
      if (lastCarouselIndexLeft < 0) {
        lastCarouselIndexLeft = this.mediaCarouselList.length - 1;
      }
      if (lastCarouselIndexRight > this.mediaCarouselList.length - 1) {
        lastCarouselIndexRight = 0;
      }
      if (this.mediaCarouselList[lastCarouselIndexLeft].type === 'video') {
        this.mediaCarouselList[lastCarouselIndexLeft].isPlay = false;
      }
      if (this.mediaCarouselList[lastCarouselIndexRight].type === 'video') {
        this.mediaCarouselList[lastCarouselIndexRight].isPlay = false;
      }
      if (this.currentMediaType) {
        const videoStartIndex = this.mediaCarouselList.findIndex((item) => item.type === 'video');
        const imgStartIndex = this.mediaCarouselList.findIndex((item) => item.type === 'img');
        if (this.currentCarouselIndex >= videoStartIndex && this.currentCarouselIndex < imgStartIndex) {
          this.currentMediaType = 'video';
        } else if (this.currentCarouselIndex >= imgStartIndex) {
          this.currentMediaType = 'img';
        }
      }
      this.$forceUpdate();
      console.log(this.mediaCarouselList);
    },
    playMedia() {
      const { type } = this.mediaCarouselList[this.currentCarouselIndex];
      if (type === 'video') {
        this.mediaCarouselList[this.currentCarouselIndex].isPlay = true;
      }
      this.$forceUpdate();
      console.log(this.mediaCarouselList);
    },
    updatePaused(e) {
      console.log(e);
      this.mediaCarouselList[this.currentCarouselIndex].isPlay = false;
      this.$forceUpdate();
    },
    chooseNav(type) {
      this.currentMediaType = type;
      if (type === 'video') {
        this.$refs.carousel.setActiveItem(this.mediaCarouselList.findIndex((item) => item.type === 'video'));
      } else if (type === 'img') {
        this.$refs.carousel.setActiveItem(this.mediaCarouselList.findIndex((item) => item.type === 'img'));
      }
    },
  },
};
</script>

<style lang="less" scoped>
.previewArea {
  width: 350px;
  height: 667px;
  background-image: url('~@/assets/image/iphone.png');
  background-size: 100% 100%;
  margin-left: 40px;
  padding: 25px;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 19px;

  .block1 {
    padding-top: 20px;
    cursor: pointer;
    position: relative;

    .carousel-wrap {
      position: relative;

      .element-img {
        width: 100%;
        height: 100%;
      }

      .element-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: #fff;
        transition: all 0.3s;

        &:hover {
          font-size: 60px;
        }
      }
    }

    .navDot {
      width: 74px;
      height: 20px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50px;
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      z-index: 2;

      .dot {
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        padding: 10px 6px;

        &.active {
          background-color: #FFFFFF;
          color: #333333;
        }
      }
    }
  }

  // .block1 {
  //   padding-top: 20px;
  //   overflow-x: scroll;
  //   white-space: nowrap;
  //   cursor: pointer;
  //   .imgItem {
  //     width: 242px;
  //     height: 177px;
  //     margin-right: 20px;
  //     position: relative;
  //     display: inline-block;
  //     &:nth-child(1) {
  //       margin-left: 20px;
  //     }
  //     .cImg {
  //       width: 100%;
  //       height: 100%;
  //       border-radius: 15px;
  //     }
  //     .deleteIcon {
  //       position: absolute;
  //       width: 22px;
  //       height: 22px;
  //       right: -21px;
  //       top: 1px;
  //       cursor: pointer;
  //       opacity: 0;
  //     }
  //     &:hover {
  //       .deleteIcon {
  //         opacity: 1;
  //       }
  //     }
  //   }
  //   &::-webkit-scrollbar {
  //     width: 7px;
  //     height: 10px;
  //   }
  //   &::-webkit-scrollbar-track-piece {
  //     background-color: transparent;
  //     border-radius: 6px;
  //   }
  //   &::-webkit-scrollbar-corner {
  //     background-color: rgba(0, 0, 0, 0.8);
  //   }
  //   &::-webkit-scrollbar-thumb:horizontal {
  //     width: 7px;
  //     background-color: rgba(0, 0, 0, 0.8);
  //     border-radius: 6px;
  //   }
  //   &::-webkit-scrollbar-thumb:vertical {
  //     width: 7px;
  //     background-color: rgba(0, 0, 0, 0.8);
  //     border-radius: 6px;
  //   }
  // }
  .block2 {
    margin-top: 20px;

    .hotelName {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      align-items: center;

      .authBox {
        display: flex;
        align-items: center;
        background: #FEF1CD;
        font-size: 10px;
        font-weight: 500;
        color: #c55e06;
        border-radius: 42px;
        padding: 3px 8px;
        margin-left: 8px;

        .auth-img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
      }
    }

    .labelList {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      padding: 0 20px;

      .labelItem {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        background-color: #F2F4F7;
        border-radius: 4px;
        padding: 2px 4px;
        white-space: nowrap;
        // align-self: center;
      }
    }

    .contactInfo {
      background-color: #E8F0FD;
      border-radius: 8px;
      margin: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;

      .address {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        max-width: 220px;
        display: flex;
        align-items: center;
        .location_icon {
          width: 24px;
          height: 24px;
        }
      }

      .phone-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10px;

        .phoneIconBox {
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.40);
          margin-bottom: 4px;

          .phoneIcon {
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .paraInfo {
      display: flex;
      margin-top: 10px;
      margin-bottom: 20px;
      padding: 0 20px;
      justify-content: space-between;

      .paraItem {
        display: flex;
        flex-direction: column;
        align-items: center;

        .value-info {
          font-size: 10px;
          font-weight: 400;
          color: #333333;

          label {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .key {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.40);
          margin-top: 4px;
        }
      }
    }

    // .contactInfo {
    //   height: 67px;
    //   padding: 0 20px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;

    //   .address {
    //     font-size: 14px;
    //     font-weight: 400;
    //     color: rgba(0, 0, 0, 0.6);
    //     display: flex;
    //     align-items: center;
    //     cursor: pointer;
    //     width: 210px;

    //     .placeIcon {
    //       width: 16px;
    //       height: 16px;
    //       margin-right: 5px;
    //     }
    //   }

    //   .phone::v-deep {
    //     display: flex;
    //     align-items: center;
    //     flex-direction: column;
    //     font-size: 9px;
    //     font-weight: 400;
    //     color: rgba(0, 0, 0, 0.25);
    //     position: relative;

    //     .phoneIcon {
    //       width: 18px;
    //       height: 18px;
    //       margin-bottom: 2px;
    //     }

    //     .el-button {
    //       position: absolute;
    //       top: 0;
    //       left: -6px;
    //       width: 54px;
    //       padding: 0;
    //       height: 35px;
    //       opacity: 0;
    //     }

    //     &::after {
    //       content: '';
    //       display: block;
    //       width: 2px;
    //       height: 30px;
    //       background: #f0f0f0;
    //       position: absolute;
    //       left: -13px;
    //     }
    //   }
    // }

    .entryInfo {
      display: flex;
      align-items: center;
      padding: 0 20px;

      label {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        margin-right: 10px;
      }

      img {
        width: 110px;
        height: 120px;
      }
    }

    .funcSwitch {
      display: flex;
      align-items: center;
      padding: 0 20px;
      margin-top: 20px;

      label {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        margin-right: 10px;
      }
    }
  }

  .block3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 28px;
    height: 100%;

    .openCreateFormBtn {
      margin-top: 20px;
    }
  }
}
</style>
