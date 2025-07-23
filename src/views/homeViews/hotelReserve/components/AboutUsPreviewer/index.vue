<template>
  <section class="preview-area">
    <div class="nav"></div>
    <div class="container">
      <div class="top-swiper">
        <el-carousel :autoplay="false" height="177px" indicator-position="none">
          <el-carousel-item v-for="(item, index) in previewData.swiper_imgs" :key="`${index}swip`">
            <img :src="item" alt="" class="swiper-img" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="about-us">
        <div class="title">关于我们</div>
        <div class="dsp-container" v-show="previewData.hlt_intro">
          <div class="txt" v-for="(txt, index) in previewData.hlt_intro.split(';')" :key="`${index}txt`">{{ txt }}</div>
        </div>
        <div class="posters" v-show="previewData.hlt_poster.length">
          <img :src="poster" class="poster-img" v-for="(poster, index) in previewData.hlt_poster" :key="`${index}post`" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutUsPreviewer',
  props: {
    previewData: {
      type: Object,
      default: () => {
        return {
          swiper_imgs: [],
          hlt_poster: [],
          hlt_intro: '',
        };
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.preview-area {
  width: 350px;
  height: 667px;
  margin-left: 40px;
  margin-bottom: 20px;
  padding: 48px 19px 50px 20px;
  box-sizing: border-box;
  background-image: url('~@/assets/image/iphone.png');
  background-size: 100% 100%;
  overflow: hidden;
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  user-select: none;
  .container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 7px;
      height: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 6px;
    }
    &::-webkit-scrollbar-corner {
      background-color: rgba(0, 0, 0, 0.8);
    }
    &::-webkit-scrollbar-thumb:horizontal {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
    &::-webkit-scrollbar-thumb:vertical {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
    .top-swiper {
      width: 100%;
      flex-shrink: 0;
      background-color: rgba(0, 0, 0, 0.05);
      .swiper-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .about-us {
      width: 100%;
      padding: 16px;
      padding-bottom: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      .title {
        margin-bottom: 12px;
        font-size: 20px;
        position: relative;

        &::after,
        &::before {
          content: '';
          width: 37px;
          height: 2px;
          border-radius: 4px;
          background-image: linear-gradient(to right, #ffffff, #ff4e6b);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        &::after {
          right: -45px;
          transform: translateY(-50%) rotate(180deg);
        }
        &::before {
          left: -45px;
        }
      }
      .dsp-container {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: black;
        .txt {
          width: 100%;
          text-align: center;
          margin-bottom: 8px;
          font-size: 13px;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
      .posters {
        width: 100%;
        .poster-img {
          width: 100%;
          border-radius: 10px;
          margin-bottom: 10px;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
