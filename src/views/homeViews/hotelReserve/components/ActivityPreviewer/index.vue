<template>
  <div class="previewArea">
    <section class="block1" v-if="activityList.length<=0">
      {{activityList.length}}
      暂无优惠活动
      <!-- <el-button type="primary"  class="openCreateFormBtn">前往创建</el-button> -->
    </section>
    <section class="block2" v-if="previewStatus === 0">
      <div class="currentNav">优惠活动 ({{ activityList.length }})</div>
      <div class="cardList">
        <div class="card" v-for="(item, index) in activityList" :key="index">
          <div class="topPoster" ><img :src="item.content.coverPath" /></div>
          <div class="info">
            <div class="hotelName" >{{ item.content.name }}</div>
            <!-- <div class="trait" >
              <label>层高 {{ item.content.floorHeight }}米</label>
              <label>{{ item.content.columnStatus === '0' ? '无柱' : '有柱' }}</label>
            </div> -->
          </div>
          <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon" /> -->
        </div>
      </div>
    </section>
    <!-- <section class="block3" v-if="previewStatus === 0">
      <el-button type="primary"  class="openAddBanquetFormBtn">新增优惠活动</el-button>
    </section> -->
    <section class="block4" v-if=" previewStatus === 1&&previewDetail">
      <div class="introArea">
        <div class="name">{{ previewDetail.name }}</div>
        <div class="baseInfo">
          <div class="infoItem">{{ previewDetail.desc }}</div>
          <!-- <div class="infoItem">¥{{ previewDetail.pricePerDesk }}元/桌</div>
          <div class="infoItem">{{ previewDetail.columnStatus === '0' ? '无' : '有' }}柱</div>
          <div class="infoItem">层高{{ previewDetail.floorHeight }}米</div> -->
        </div>
        <!-- <div class="advanBox">
          <div class="advanList">
            <div class="advanItem">
              <div class="label">优惠活动特色：</div>
              <div class="ct">
                {{ previewDetail.detail.feature }}
              </div>
            </div>
            <div class="advanItem">
              <div class="subItem">
                <div class="label">起订价：</div>
                <div class="ct">{{ previewDetail.detail.priceStartOrder }}元/桌</div>
              </div>
              <div class="subItem">
                <div class="label">起订桌数：</div>
                <div class="ct">{{ previewDetail.detail.deskNumStartOrder }}桌</div>
              </div>
            </div>
            <div class="advanItem">
              <div class="subItem">
                <div class="label">桌规格：</div>
                <div class="ct">{{ previewDetail.detail.deskSpecification }}人/桌</div>
              </div>
              <div class="subItem">
                <div class="label">迎宾区：</div>
                <div class="ct">{{ previewDetail.detail.areaWelcomeGuestsStatus === '0' ? '无' : '有' }}</div>
              </div>
            </div>
            <div class="advanItem">
              <div class="subItem">
                <div class="label">香槟塔：</div>
                <div class="ct">{{ previewDetail.detail.champagneTowerStatus === '0' ? '无' : '有' }}</div>
              </div>
              <div class="subItem">
                <div class="label">舞台：</div>
                <div class="ct">{{ previewDetail.detail.stageStatus === '0' ? '无' : '有' }}</div>
              </div>
            </div>
            <div class="advanItem">
              <div class="subItem">
                <div class="label">服务费：</div>
                <div class="ct">{{ previewDetail.detail.servicePrice }}</div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="posterImgWrap">
        <div class="imgItem" v-for="(item, index) in previewDetail.carouselList" :key="index">
          <img :src="item" class="posterImg" />
          <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon"  /> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { switchFunc } from '@/api/hotelReserve/index';

export default {
  name: 'ActivityPreviewer',
  props: {
    id: [Number, String],
    previewDetail: Object,
    activityList: Array,
    previewStatus: Number,
    // hotelBaseData: Object,
  },
  data() {
    return {
      // previewStatus: 0,
    };
  },
  methods: {
    switchHotelReserveFunc(e) {
      console.log(e);
      switchFunc(e, this.id)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    .openCreateFormBtn {
      margin-top: 20px;
    }
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
        height: 188px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
        position: relative;
        .topPoster {
          height: 125px;
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
          .trait {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 4px;
            cursor: pointer;
          }
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
          top: 2px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            opacity: 1;
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
  .block3 {
    margin-top: -34px;
    text-align: center;
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
      .advanBox {
        width: 343px;
        border: 1px solid #dddddd;
        margin-top: 16px;
        flex-direction: column;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        margin-left: 5px;
        .advanList {
          flex-direction: column;
          overflow: hidden;
          display: flex;
          align-items: center;
          .advanItem {
            width: 311px;
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            justify-content: space-between;
            .label {
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.4);
              white-space: nowrap;
            }
            .ct {
              font-size: 14px;
              font-weight: 400;
              color: #333333;
            }
            .subItem {
              width: 50%;
              display: flex;
              align-items: center;
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
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
          top: 2px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            opacity: 1;
          }
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
