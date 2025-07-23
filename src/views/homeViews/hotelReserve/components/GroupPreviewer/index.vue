<template>
  <div class="previewArea">
    <section class="block1" v-if="previewStatus === 0&&groupList.length===0">
      暂无套餐
      <!-- <el-button type="primary"  class="openCreateFormBtn">前往创建</el-button> -->
    </section>
    <section class="block2" v-if="previewStatus === 0&&groupList.length>0">
      <div class="currentNav">精选套餐 ({{ groupList.length }})</div>
      <div class="cardList">
        <div class="card" v-for="(item, index) in groupList" :key="index">
          <div class="poster" :style="{ backgroundImage: 'url(' + item.content.carouselList[0] + ')' }"></div>
          <div class="ct">
            <div class="name">{{ item.content.name }}</div>
            <div class="price">
              ¥<label>{{ item.content.banquet.pricePerDesk }}</label
              >/桌
            </div>
            <div class="contains" v-show="item.content.dishList && item.content.dishList.length > 0">含一份菜单</div>
          </div>
          <img src="@/assets/image/delete_icon.png" class="deleteIcon" />
        </div>
      </div>
    </section>
    <section class="block3" v-if="previewStatus === 0">
      <!-- <el-button type="primary" @click="openAddSetMealForm" class="openAddSetMealFormBtn">新增套餐</el-button> -->
    </section>
    <section class="block4" v-if="previewStatus === 1&& groupBaseData" >
      <div class="section1">
        <el-carousel height="150px" class="hotelCarousel">
          <el-carousel-item v-for="(item, index) in groupBaseData.carouselList" :key="index">
            <div class="cImgBox">
              <img :src="item" class="cImg" />
              <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCarousel(item)" /> -->
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="name">{{ groupBaseData.name }}</div>
        <div class="desc">{{ groupBaseData.desc }}</div>
      </div>
      <div class="section2">
        <div class="tit">-喜宴-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">每桌单价：</div>
            <div class="val">{{ groupBaseData.banquet.pricePerDesk }}元</div>
          </div>
          <div class="infoItem">
            <div class="label">每桌人数：</div>
            <div class="val">{{ groupBaseData.banquet.peopleNumPerDesk }}人</div>
          </div>
          <div class="infoItem">
            <div class="label">桌数：</div>
            <div class="val v1">{{ groupBaseData.banquet.deskNum }}桌</div>
          </div>
          <div class="infoItem">
            <div class="label">酒水：</div>
            <div class="val v1">{{ groupBaseData.banquet.drink }}</div>
          </div>
          <div class="infoItem">
            <div class="label">下午茶：</div>
            <div class="val v2">{{ groupBaseData.banquet.afternoonTea }}</div>
          </div>
          <div class="infoItem">
            <div class="label">附加：</div>
            <div class="val v1">{{ groupBaseData.banquet.extraTip }}</div>
          </div>
        </div>
        <div class="menuBox">
          <div class="posterImgItem">
            <img :src="groupBaseData.coverPath" class="posterImg" v-show="groupBaseData.coverPath" />
            <!-- <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" /> -->
          </div>
          <div class="menuItem" v-for="(item, index) in groupBaseData.dishList" :key="index">{{ item }}</div>
        </div>
      </div>
      <div class="section3">
        <div class="tit">-场地-</div>
        <div class="infoList">
          <div class="infoItem">{{ groupBaseData.field }}</div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-婚礼布置-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">迎宾区</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.weddingArragement.welcomeGuestsArea }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">仪式区</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.weddingArragement.ceremonyArea }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">婚宴区</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.weddingArragement.banqueArea }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-鲜花装饰-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">新郎</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.flowerDecoration.husband }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">新娘</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.flowerDecoration.wife }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">贵宾</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.flowerDecoration.guests }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-服务团队-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">司仪</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.serviceTeam.emcee.name }}</div>
              <div class="ctItem">{{ groupBaseData.serviceTeam.emcee.desc }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">化妆</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.serviceTeam.makeUp.name }}</div>
              <div class="ctItem">{{ groupBaseData.serviceTeam.makeUp.desc }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">摄影</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.serviceTeam.sy.name }}</div>
              <div class="ctItem">{{ groupBaseData.serviceTeam.sy.desc }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">摄像</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.serviceTeam.sx.name }}</div>
              <div class="ctItem">{{ groupBaseData.serviceTeam.sx.desc }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="label">其他人员</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.serviceTeam.other.name }}</div>
              <div class="ctItem">{{ groupBaseData.serviceTeam.other.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-仪式-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">宴会仪式</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.ceremony }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-灯光设备-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">灯光设备</div>
            <div class="ct">
              <div class="ctItem">{{ groupBaseData.lightEquipment }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section3">
        <div class="tit">-个性制作-</div>
        <div class="infoList">
          <div class="infoItem">
            {{ groupBaseData.personalityProduction }}
          </div>
        </div>
      </div>
      <div class="section4">
        <div class="tit">-附加信息-</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="label">附加信息</div>
            <div class="ct">
              <div class="ctItem spec">{{ groupBaseData.extraInfo }}</div>
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
  name: 'GroupPreviewer',
  props: {
    id: [Number, String],
    groupBaseData: Object,
    groupList: Array,
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
    overflow-x: hidden;
    background-color: #f7f6f2;
    .section1 {
      background-color: #ffffff;
      padding-bottom: 16px;
      .hotelCarousel {
        .cImgBox {
          position: relative;
          height: 100%;
          width: 100%;
          .cImg {
            height: 100%;
            width: 100%;
            border-radius: 15px;
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
              opacity: 1;
            }
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
      padding-top: 12px;
      margin-top: 8px;
      padding-bottom: 6px;
      position: relative;
      .tit {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        text-align: center;
      }
      .infoList {
        margin-top: 16px;
        .infoItem {
          padding-left: 11px;
          padding-right: 6px;
          position: relative;
          margin-bottom: 16px;
          display: flex;
          .label {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
          .val {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            width: 245px;
            &.v1 {
              margin-left: 26px;
            }
            &.v2 {
              margin-left: 11px;
            }
          }
        }
      }
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        margin-top: 46px;
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
      .operateArea {
        justify-content: space-between;
        padding-left: 26px;
        padding-right: 15px;
        .price {
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
          font-size: 9px;
          .unit {
            color: #ff457a;
            font-size: 12px;
          }
          .price {
            color: #ff457a;
            font-size: 18px;
          }
        }
        .contactBtn {
          width: 96px;
          height: 38px;
          background: #ff457a;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        margin-top: 46px;
        padding-bottom: 20px;
        .posterImg {
          width: 343px;
          height: 125px;
          margin-bottom: 20px;
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
    .section3 {
      background: #fff;
      padding-top: 12px;
      margin-top: 8px;
      padding-bottom: 6px;
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
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-bottom: 4px;
        }
      }
    }
    .section4 {
      background: #fff;
      padding-top: 12px;
      margin-top: 16px;
      padding-bottom: 6px;
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
            width: 257px;
            &.spe {
              width: 240px;
            }
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
