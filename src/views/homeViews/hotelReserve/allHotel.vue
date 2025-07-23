<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="酒店信息"></card-top-info>

      <el-row class="topRow" :gutter="20">
        <el-col :span="6" v-for="card in hotelList" class="topCol" :key="card.wedding_id">
          <el-card class="box-card" shadow="hover" >
            <div slot="header" class="clearfix topLogoWrap">
              <img class="logo" :src="userInfo.avator || card.carouselList[0]" />
              <div class="name">{{ card.store_name }}</div>
              <div class="func-wrap">
                功能开关：
                <el-switch v-model="switchStatus" active-value="1" inactive-value="0" @change="switchHotelReserveFunc"> </el-switch>
              </div>
            </div>
            <div class="timeWrap" v-if="card.create_time||card.update_time">
              <div class="timeItem" v-if="card.create_time"><span class="title">创建时间：</span>{{ card.create_time }}</div>
              <div class="timeItem" v-if="card.update_time"><span class="title">最近修改：</span>{{ card.update_time }}</div>
            </div>
            <div class="btnGroup">
              <div class="btnWrap" @click="toPath(card.wedding_id)">
                <div class="btn preview"> <div class="icon"></div></div>
                <div class="text">预览</div>
              </div>
              <div class="btnWrap" @click="toPath(card.wedding_id)">
                <div class="btn edit">  <div class="icon"></div></div>

                <div class="text">编辑</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
// import request from '@/utils/request';
import { createNamespacedHelpers } from 'vuex';
import { getHotelList, switchFunc } from '@/api/hotelReserve/index';

const { mapState } = createNamespacedHelpers('login');
export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  computed: mapState(['userInfo']),
  data() {
    return {
      switchStatus: '0',
      hotelList: [
      ],
    };
  },
  created() {
    // if (this.$route.query.hasNoHotel) {
    //   this.openCreateForm();
    // }
    // if (this.$store.state.login.hotelId) {
    //   this.hasNoHotel = false;
    //   this.hotelId = this.$store.state.login.hotelId;
    // }
    // this.getHotelInfo();
    getHotelList()
      .then((res) => {
        console.log(res);
        this.switchStatus = res.data.is_show_wedding;
        this.hotelList = res.data.list.map((item) => {
          const detailInfo = JSON.parse(item.json_data);
          return {
            ...item,
            ...detailInfo,
          };
        });
      })
      .catch((err) => {
        console.warn(err);
      });
  },
  methods: {
    toPath(id) {
      this.$router.push({
        path: '/app/hotelReserve/editHotel',
        query: {
          id,
        },
      });
    },
    switchHotelReserveFunc(e) {
      console.log(e);
      switchFunc(e, this.hotelId)
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
.myMainCard {
  position: relative;
  padding-left: 20px;
}
.topRow {
  width: 100%;
  // display: flex;
  .topCol {
    margin-bottom: 20px;
    .box-card {
      .topLogoWrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        margin-bottom: 25px;
        .func-wrap {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .logo {
          width: 136px;
          height: 89.33px;
        }
        .name {
          margin-left: 30px;
          font-size: 14px;
          height: 89.33px;
          font-weight: 500;
          flex-grow: 1;
          display: flex;
          align-items: flex-end;
        }
      }
      &::v-deep {
        .el-card__body {
          padding: 0;
        }
      }
      .timeWrap {
        width: 100%;
        background: #f3f3f3;
        height: 66px;
        padding: 8px 10px;
        .timeItem {
          color: #333333;
          .title {
            color: #999999;
          }
        }
      }
      .btnGroup {
        width: 100%;
        background: #fff;
        height: 66px;
        padding: 8px 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .btnWrap {
          cursor: pointer;
          .btn {
            width: 28px;
            height: 28px;
            background: #fb466c;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon{
              width: 14px;
              height: 14px;
              background-size: 100% 100%;
            }
            &.preview{
              .icon{
                background-image: url('~@/assets/image/hotel/preview.png');
              }
            }
            &.edit{
              .icon{
                background-image: url('~@/assets/image/hotel/edit.png');
              }
            }
          }
          .text {
            margin-top: 2px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
