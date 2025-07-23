<template>
  <div class="phoneWrap">
    <div class="phone">
      <div class="rank-wrap">
        <div class="close" @click="close"></div>
        <div class="rankItem" v-for="rank in rankList" :key="rank.id">
          <div class="head">
            {{ rank.order }}
          </div>
          <div class="headimg" :style="'background-image: url(' + rank.headImg + ');'"></div>
          <div class="name">{{ rank.name }}</div>

          <div class="second">{{ rank.second }}秒</div>
          <div class="score">{{ rank.score }}分</div>
        </div>

        <!-- <div v-if="rankList.length === 0" class="none">暂无数据</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getRank } from '../../../api/yx/yx';

export default {
  data() {
    return {
      rankList: [],
    };
  },
  created() {
    this.getRank();
  },
  methods: {
    close() {
      console.log(1);
      this.$emit('close');
    },
    getRank() {
      getRank({
        activity_id: this.id,
        currentPage: 1,
        showCount: 100,
      }).then((res) => {
        console.log(res);
        let list = [];
        if (!res.data) {
          this.$message('暂无数据');
        } else {
          list = res.data.list.map((user, index) => {
            return {
              order: index + 1,
              name: user.wx_name,
              score: user.score,
              second: user.user_time,
              headImg: user.avator,
            };
          });
        }

        if (list.length < 10) {
          while (list.length < 10) {
            list.push({
              order: list.length + 1,
              name: '虚位以待',
              score: '0',
              second: 0,
              headImg: '',
              // headImg: 'https://thirdwx.qlogo.cn/mmopen/vi_32/bUrGSf23HibGv15wE0Zv42XnC3BDeibYqkTwxgXcz4hRLzJWxmdgJjo9u0ibbrWwEwZ80g1VFN50Wel6lrDQAER0Q/132',
            });
          }
        }
        this.rankList = list;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.phoneWrap {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  overflow: hidden;
  .phone {
    width: 375px;
    height: 667px;
    position: absolute;
    box-shadow: 5px 5px 10px #dedede, -5px -5px 10px #dedede;
    top: calc(50% - 375px / 2 - 120px);
    left: calc(50% - 667px / 2 + 120px);
    background: #fff;
    @radius: 10px;
    border-radius: @radius;
    display: flex;
    .rank-wrap {
      padding-top: 50px;
      width: 327rpx;
      margin: 0 auto;
      .rankItem {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 30px;
        margin-top: 15px;
        // div{
        //   flex: 1;
        // }
        .head {
          width: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333333;
          font-size: 16px;
          font-weight: 400;
        }
        .name {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333333;
          font-size: 14px;
        }
        .headimg {
          // flex:0;
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 100%;
          background-size: 100% 100%;
          background-color: #dcdcdc;
        }

        .second {
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaaaaa;
          font-size: 14px;
        }
        .score {
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: right;
          color: #fb4a40;
          font-size: 18px;
        }
      }
    }
  }
  .none {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close {
    width: 30px;
    height: 30px;
    // border: 1px solid red;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    background-image: url(~@/assets/image/opManage/close.png);
    background-size: 70% 70%;
    background-position: center;
    background-color: grey;
    border-radius: 100%;
    z-index: 10;
  }
}
</style>
