<template>
      <div class="previewArea">
        <section class="block1" v-if="menuList.length === 0">
          暂无菜单
          <!-- <el-button type="primary" @click="toCreateHotel" class="openCreateFormBtn">前往创建</el-button> -->
        </section>
        <section class="block2" v-if="previewStatus === 0">
          <div class="currentNav">套餐 ({{ menuList.length }})</div>
          <div class="cardList">
            <div class="card" v-for="(item, index) in menuList" :key="index">
              <div
                class="poster"
                :style="{ backgroundImage: 'url(' + item.content.coverPath + ')' }"

              ></div>
              <div class="ct">
                <div class="name" >{{ item.content.name }}</div>
                <div class="contains" v-show="item.dishList && item.dishList.length > 0" >
                  含一份菜单
                </div>
                <div class="price" >
                  ¥<label>{{ item.content.pricePerDesk }}</label
                  >/桌
                </div>
              </div>

            </div>
          </div>
        </section>
        <section class="block3" v-if="previewStatus === 0&&menuBaseData">
          <!-- <el-button type="primary" @click="openAddMenuForm" class="openAddMenuFormBtn">新增菜单</el-button> -->
        </section>
        <section class="block4" v-if="previewStatus === 1">
          <div class="navTop">
            <div class="navItem">
              <div class="deskNum">{{ menuBaseData.pricePerDesk }}元/桌</div>
            </div>
          </div>
          <div class="section1">
            <div class="posterImgItem">
              <img :src="menuBaseData.coverPath" class="posterImg" v-show="menuBaseData.coverPath" />
              <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" /> -->
            </div>
            <div class="name">{{ menuBaseData.name }}</div>
            <div class="desc" v-show="menuBaseData.dishList && menuBaseData.dishList.length > 0">含一个菜单</div>
          </div>
          <div class="section2">
            <div class="menuBox">
              <div class="posterImgItem">
                <img :src="menuBaseData.coverPath" class="posterImg" v-show="menuBaseData.coverPath" />
                <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" /> -->
              </div>
              <div class="menuItem" v-for="(item, index) in menuBaseData.dishList" :key="index">{{ item }}</div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-其他费用-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">服务费</div>
                <div class="ct">
                  <div class="ctItem">{{ menuBaseData.otherPrice.servicePrice }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">开瓶费</div>
                <div class="ct">
                  <div class="ctItem">{{ menuBaseData.otherPrice.openBottlePrice }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">进场费</div>
                <div class="ct">
                  <div class="ctItem">{{ menuBaseData.otherPrice.approachPrice }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-附加信息-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">附加信息</div>
                <div class="ct">
                  <div class="ctItem">{{ menuBaseData.additionInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
</template>

<script>
import { switchFunc } from '@/api/hotelReserve/index';

export default {
  name: 'MenuPreviewer',
  props: {
    id: [Number, String],
    menuList: Array,
    menuBaseData: Object,
    banquetList: Array,
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
        width: 100%;
        height: 96px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
        position: relative;
        display: flex;
        align-items: center;
        .poster {
          width: 96px;
          height: 96px;
          cursor: pointer;
          border-radius: 10px;
          background-size: cover;
        }
        .ct {
          padding: 8px;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            cursor: pointer;
          }
          .price {
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 4px;
            cursor: pointer;
            label {
              font-size: 14px;
            }
          }
          .contains {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 6px;
          }
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 2px;
          top: 2px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            // opacity: 1;
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
    overflow-x: hidden;
    .navTop {
      height: 41px;
      white-space: nowrap;
      .navItem {
        width: 184px;
        height: 100%;
        flex-direction: column;
        font-size: 12px;
        font-weight: 400;
        color: #ff457a;
        position: relative;
        display: inline-block;
        padding-top: 12px;
        .deskNum {
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 6px;
        }
        &::after {
          content: '';
          display: block;
          width: 108px;
          height: 3px;
          background: #ff457a;
          position: absolute;
          bottom: 0;
          left: 35px;
        }
      }
    }
    .section1 {
      background-color: #fff;
      .posterImgItem {
        position: relative;
        width: 100%;
        height: 238px;
        .posterImg {
          width: 100%;
          height: 100%;
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
          top: -22px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            opacity: 1;
          }
        }
      }
      .name {
        padding: 0 16px;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        padding-top: 16px;
      }
      .desc {
        padding: 0 16px;
        margin-top: 4px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .section2 {
      background: #fff;
      padding-top: 20px;
      padding-bottom: 28px;
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        padding-bottom: 20px;
        .posterImgItem {
          position: relative;
          width: 343px;
          height: 125px;
          margin-bottom: 20px;
          .posterImg {
            width: 100%;
            height: 100%;
          }
          .deleteIcon {
            position: absolute;
            width: 22px;
            height: 22px;
            right: -1px;
            top: -25px;
            cursor: pointer;
            opacity: 0;
          }
          &:hover {
            .deleteIcon {
              opacity: 1;
            }
          }
        }
        .menuItem {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          text-align: center;
        }
      }
    }
    .section4 {
      background: #fff;
      .tit {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        text-align: center;
      }
      .infoList {
        margin-top: 16px;
        padding-left: 24px;
        padding-right: 16px;
        .infoItem {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          .label {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
          .ct {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            width: 207px;
          }
        }
      }
      .contactBtn {
        width: 6303px;
        height: 38px;
        background: #ff457a;
        border-radius: 4px;
        margin: 0 auto;
        margin-top: 25px;
        font-size: 12px;
        font-weight: 500;
        color: #ffffff;
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
