<template>
  <div class="previewArea">
    <section class="block1" v-if="msWeddingDressList.length<=0">
      {{msWeddingDressList.length}}
      暂无精选单品
    </section>
    <section class="block2" v-if="previewStatus === 0">
      <div class="currentNav">精选单品 ({{ msWeddingDressList.length }})</div>
      <div class="cardList">
        <div class="card" v-for="(item, index) in msWeddingDressList" :key="index">
          <div class="topPoster" ><img :src="item.content.coverPath" /></div>
          <div class="info">
            <div class="hotelName" >{{ item.content.name }}</div>
            <div class="type">{{ item.content.type }}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="block4" v-if="previewStatus === 1&&previewDetail">
      <div class="introArea">
        <div class="name">{{ previewDetail.name }}</div>
        <div class="baseInfo">
          <div class="infoItem">{{ previewDetail.desc }}</div>
        </div>
      </div>
      <div class="posterImgWrap">
        <div class="imgItem" v-for="(item, index) in previewDetail.carouselList" :key="index">
          <img :src="item" class="posterImg" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MsweddingdressPreviewer',
  props: {
    id: [Number, String],
    previewDetail: Object,
    msWeddingDressList: Array,
    previewStatus: Number,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.previewArea {
  width: 405px;
  height: 749px;
  background-image: url('~@/assets/image/iphone.png');
  background-size: 100% 100%;
  margin-left: 40px;
  padding: 25px;
  margin-bottom: 20px;
  padding-top: 60px;
  padding-bottom: 50px;
  .block1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 28px;
    height: 100%;
  }
  .block2 {
    padding-bottom: 24px;
    margin-bottom: 16px;
    .currentNav {
      padding: 0 16px;
      font-size: 18px;
      font-weight: 500;
      color: #333333;
    }
    .cardList {
      padding: 0 6px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      overflow: hidden;
      max-height: 589px;
      overflow-y: auto;
      .card {
        width: 166px;
        height: 288px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
        position: relative;
        .topPoster {
          height: 225px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          height: 67px;
          padding: 8px;
          .hotelName {
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            cursor: pointer;
          }
          .type {
            margin-top: 5px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
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
    }
  }
  .block4 {
    height: 100%;
    overflow-y: scroll;
    .introArea {
      flex-direction: column;
      .name {
        font-size: 20px;
        font-weight: 400;
        color: #000000;
        padding: 0 10px;
      }
      .baseInfo {
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        .infoItem {
          padding: 0 10px;
          position: relative;
          display: flex;
          align-items: center;
          &::before {
            content: '';
            width: 2px;
            height: 12px;
            opacity: 1;
            background: #dddddd;
            position: absolute;
            right: 0;
          }
          &:last-child {
            &::before {
              background: transparent;
            }
          }
        }
      }
    }
    .posterImgWrap {
      margin-top: 24px;
      margin-left: 5px;
      .imgItem {
        width: 100%;
        position: relative;
        .posterImg {
          width: 100%;
        }
      }
    }
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
  }
}
</style>
