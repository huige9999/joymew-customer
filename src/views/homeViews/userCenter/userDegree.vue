<!--活动收益-->
<template>
  <sub-page class="my-degree">
    <main-card>
      <div class="my-level">
        <div class="degree-info">
          <div class="zh-en-title">
            <div class="en">MY LEVEL</div>
            <div class="zh">我的等级</div>
          </div>
          <div class="degree-box">
            <div class="crown-wrap">
              <div class="crown"></div>
              <div class="badge-wrap">
                <div class="count">{{ degree }}</div>
              </div>
            </div>
            <div class="info-wrap">
              <div class="distance">还差{{ upNeedPoints }}点升级为LV{{ degree + 1 }}，尊享更多福利</div>
              <div class="progress-wrap">
                <div class="progress">
                  <el-progress :percentage="percentage" type="line" :stroke-width="6" :show-text="false" color="#FF4C60"></el-progress>
                </div>
                <div class="sub">{{ vip_point }}/{{ vip_point * 1 + upNeedPoints * 1 }}</div>
              </div>
              <div class="tips">12大权益免费领取 等级越高福利越多</div>
            </div>
          </div>
        </div>
        <div class="showing">
          <div class="skill">
            <div class="skill-text">
              <div class="zh-en-title">
                <div class="en">LV UP</div>
                <div class="zh">如何快速升级</div>
              </div>

              <div class="up-item">
                <div class="up-icon gift-up"></div>
                <div class="gift-desc">
                  <div class="up-title">邀请好友</div>
                  <div class="up-slogn">好友邀起来，经验飙到嗨</div>
                </div>
              </div>

              <div class="up-item">
                <div class="up-icon coin-up"></div>
                <div class="gift-desc">
                  <div class="up-title">使用互动</div>
                  <div class="up-slogn">互动千千万，嗨喵伴永远</div>
                </div>
              </div>
            </div>
            <div class="skill-img"></div>
          </div>
          <div class="banner"></div>
        </div>
      </div>
      <div class="rank-top">
        <div class="rank-title">
          <div class="en">RANK PRIVILEGE</div>
          <div class="zh">等级特权</div>
        </div>
      </div>
      <div class="rank-priviledge">
        <div class="rank-wrap">
          <div v-for="(item, index) in degreeList" :key="item.id" :data-title="index" class="rank-item-wrap">
            <el-popover placement="top" trigger="hover">
              <div class="rank-box">
                <div class="rank-box-top">
                  <div class="rank-desc">
                    {{item.text}}
                    <!-- <div class="rank-short-title">{{ item.short_title }}</div>
                    <div class="rank-long-title">{{ item.long_title }}</div> -->
                  </div>
                  <div class="rank-image">
                    <img :src="item.img" alt="" class="img" />
                  </div>
                </div>
                <div class="rank-box-bottom">
                  <!-- 大概算是噶恶搞快乐啊好吧，买电脑辐射尽快把水电费是百分百手工发红包福建省国际大撒顽 -->
                 <div class="long-desc"> {{ item.long_desc }}</div>
                  <div class="rank-open">开启等级: {{ item.degree }}</div>
                </div>
              </div>
              <div class="rank-item" slot="reference">
                <img :src="item.img" alt="" class="img" />
                <div class="text">{{ item.text }}</div>
                <div class="btn">Lv{{ item.degree }}开启</div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import messageMixin from '@/mixins/messageBoxMixin';
import { mapState } from 'vuex';

export default {
  mixins: [messageMixin],
  name: 'userDegree',
  components: { MainCard, SubPage },
  data() {
    return {
      // percentage: 20,
      customColor: '#409eff',
      degreeList: [
        {
          id: 1,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_1.png',
          degree: 1,
          text: '所有功能免费使用',
          long_desc: '免费使用  所有功能永久免费试用',
          long_title: '免费使用',
          short_title: '免费使用',
        },
        {
          id: 2,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_2.png',
          degree: 10,
          text: '免费发礼物',
          long_desc: '免费发礼物  开启免费发送礼物特权，带领现场气氛，收益多多',
          long_title: '',
          short_title: '',
        },
        {
          id: 3,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_3.png',
          degree: 20,
          text: '定制弹幕皮肤',
          long_desc: '定制弹幕皮肤  专属弹幕皮肤，与其他用户与众不同',
          long_title: '',
          short_title: '',
        },
        {
          id: 4,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_4.png',
          degree: 30,
          text: '定制进场特效',
          long_desc: '定制进场特效  进入互动时自带特效，引起现场瞩目',
          long_title: '',
          short_title: '',
        },
        {
          id: 5,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_5.png',
          degree: 40,
          text: '靓号邀请码',
          long_desc: '靓号邀请码 自定义邀请码，更方便记忆和邀请用户',
          long_title: '',
          short_title: '',
        },
        {
          id: 6,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_6.png',
          degree: 50,
          text: '荣誉座驾',
          long_desc: '荣誉座驾 进入互动时高大上的座驾，更显尊贵',
          long_title: '',
          short_title: '',
        },
        {
          id: 7,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_7.png',
          degree: 60,
          text: '90%礼物收益',
          long_desc: '90%礼物收益 震惊！礼物收益提高达90%',
          long_title: '',
          short_title: '',
        },
        {
          id: 8,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_8.png',
          degree: 70,
          text: '红包收益比例自定义',
          long_desc: '红包收益比例自定义  红包雨收益比例自定义，最高到15%！',
          long_title: '',
          short_title: '',
        },
        {
          id: 9,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_9.png',
          degree: 75,
          text: '神秘大礼包',
          long_desc: '神秘大礼包  小悦悦不定时给各位老师发送节日福利，生日礼物等',
          long_title: '',
          short_title: '',
        },
        {
          id: 10,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_10.png',
          degree: 80,
          text: '嗨喵嘉年华',
          long_desc: '嗨喵嘉年华 参加嗨喵团建，发布会，年会等公司重要活动',
          long_title: '',
          short_title: '',
        },
        {
          id: 11,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_11.png',
          degree: 85,
          text: '嗨喵荣誉导师',
          long_desc: '嗨喵荣誉导师 聘请老师为嗨喵荣誉导师，颁发荣誉证书，参与课程分成',
          long_title: '',
          short_title: '',
        },
        {
          id: 12,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/reward_12.png',
          degree: 90,
          text: '嗨喵合伙人',
          long_desc: '嗨喵合伙人 嗨喵最高等级用户，获得每月合伙人收益，年底分红，赠送股票',
          long_title: '',
          short_title: '',
        },
      ],
      taskList: [
        {
          title: '邀请好友',
          detail: '好友邀起来，经验飙到嗨',
          income: ' 经验+50',
          btn: '去邀请',
          completed: false,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/task_1.png',
        },
        {
          title: '使用互动',
          detail: '互动千千万，嗨喵伴永远',
          income: '经验+50',
          btn: null,
          completed: false,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/task_2.png',
        },
        {
          title: '获得收益',
          detail: '收益天天有，幸福到长久',
          income: ' 经验+50',
          btn: null,
          completed: false,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/task_3.png',
        },
        {
          title: '分享教程',
          detail: '名师与教程，成就你我他',
          income: ' 经验+50',
          btn: null,
          completed: false,
          img: 'https://ustatic.joymew.com/joymew-assist/home/vip/task_4.png',
        },
      ],
      // degree: 1,
    };
  },
  filters: {},
  methods: {},
  created() {},
  computed: {
    ...mapState({
      vip_point: (state) => state.login.userInfo.vip_point,
      degree: (state) => state.login.userInfo.vip_grade,
      upNeedPoints: (state) => state.login.userInfo.upNeedPoints,
    }),
    percentage() {
      let f = (this.vip_point / (parseInt(this.vip_point, 10) + parseInt(this.upNeedPoints, 10))) * 100;
      console.log(f);
      f = Math.round(f);
      return f;
    },
  },
};
</script>

<style lang="less" scoped>
.my-degree {
  width: 100%;
  overflow: hidden;
  div {
    box-sizing: border-box;
  }
  .my-level {
    width: 92%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    // border: 1px solid red;
    padding-left: 20px;
    // padding-top: 20px;
    .degree-info {
      .zh-en-title {
        .en {
          font-size: 12px;

          font-weight: 400;
          color: #7c7c7c;
          margin-top: 20px;
        }
        .zh {
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;

          font-weight: 600;
          color: #161312;
        }
      }
      .degree-box {
        width: 634px;
        height: 200px;
        background: #ffd38f;
        box-shadow: 0px 7px 16px 0px rgba(186, 186, 204, 0.68);
        border-radius: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .crown-wrap {
          width: 165px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .crown {
            width: 135px;
            height: 108px;
            background-image: url(~@/assets/image/degree/crown.png);
            background-size: 100% 100%;
          }
          .badge-wrap {
            width: 110px;
            height: 43px;
            background-image: url(~@/assets/image/degree/badge.png);
            background-size: 100% 100%;
            position: relative;
            .count {
              font-size: 24px;
              // font-family: sucaijishikufangti;
              font-weight: bold;
              color: #f8f8f8;
              width: 90px;
              height: 100%;
              position: absolute;
              top: 0;
              right: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
        .info-wrap {
          // width: ;
          flex-grow: 1;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: flex-start;
          .distance {
            font-size: 16px;
            // font-family: FZLanTingHeiS-B-GB;
            font-weight: bold;
            color: #dc780d;
          }
          .progress-wrap {
            margin: 30px 0;
            position: relative;
            .progress {
              width: 400px;
            }
            .sub {
              position: absolute;
              bottom: -25px;
              right: 0;
              font-size: 16px;
              // font-family: FZLanTingHei-R-GBK;
              font-weight: 400;
              color: #dc780d;
            }
          }
          .tips {
            font-size: 24px;
            // font-family: FZLanTingHeiS-B-GB;
            font-weight: bold;
            color: #dc780d;
          }
        }
      }
    }

    .showing {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 347px;
      height: 297px;
      .skill {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .skill-text {
          .up-item {
            margin-top: 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .up-icon {
              width: 45px;
              height: 45px;
              background-size: 100% 100%;
              &.coin-up {
                background-image: url(~@/assets/image/degree/coin.png);
              }
              &.gift-up {
                background-image: url(~@/assets/image/degree/gift.png);
              }
            }
            .gift-desc {
              margin-left: 15px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              .up-title {
                font-size: 16px;
                font-weight: 600;
                color: grey;
              }
              .up-slogn {
                margin-top: 8px;

                font-size: 12px;
                font-weight: 400;
                color: grey;
              }
            }
          }
        }
        .skill-img {
          width: 125px;
          height: 178px;
          background-image: url('~@/assets/image/degree/up.png');
          background-size: 100% 100%;
          align-self: flex-end;
        }
        .zh-en-title {
          .en {
            font-size: 12px;

            font-weight: 400;
            color: #7c7c7c;
            // margin-top: 20px;
          }
          .zh {
            margin-top: 20px;
            margin-bottom: 20px;
            font-size: 16px;

            font-weight: 600;
            color: #161312;
          }
        }
      }
      .banner {
        width: 347px;
        height: 60px;
        background-image: url(https://ustatic.joymew.com/joymew-assist/home/vip/banner.png);
        background-size: 100% 100%;
      }
    }
  }
  .rank-top {
    width: 92%;
    margin: 0 auto;
    .rank-title {
      padding-left: 10px;
      .en {
        font-size: 12px;

        font-weight: 400;
        color: #7c7c7c;
        margin-top: 40px;
      }
      .zh {
        margin-top: 20px;
        // margin-bottom: 20px;
        font-size: 16px;

        font-weight: 600;
        color: #161312;
      }
    }
  }
  .rank-priviledge {
    // padding-left: 20px;

    .rank-wrap {
      // padding-left: 10px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .rank-item {
        width: 150px;
        height: 150px;
        // border: 1px solid red;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 50px;
        margin-left: 50px;
        // margin-left: 70px;
        margin-bottom: 30px;
        margin-top: 30px;
        .img {
          width: 56px;
          height: 56px;
          margin-bottom: 10px;
        }

        .text {
          font-size: 18px;
          font-weight: 400;
          color: #616161;
          font-size: 13px;

          margin-bottom: 10px;
        }
        .btn {
          width: 65px;
          height: 20px;
          border: 2px solid #f79132;
          border-radius: 15px;
          font-size: 12px;
          color: #f79132;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>

<style>
.el-popover {
  background: none;
  border: none;
  box-shadow: none;
}
.el-popover .rank-box {
  width: 285px;
  height: 186px;
  background: #ff4c60;
  box-shadow: 0px 7px 16px 0px rgba(186, 186, 204, 0.68);
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rank-box-top {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.rank-desc {
  margin-right: 20px;
  font-size: 12px;
  font-weight: 400;
  color: #fdfcfc;
  margin-right: 70px;
}
.rank-image {
  width: 70px;
  height: 50px;
  border-radius: 13px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rank-image img {
  width: 50px;
  height: 45px;
}
.rank-box-bottom {
  margin-top: 20px;
  width: 254px;
  height: 99px;
  background: #fe7d8b;
  padding: 5px;
  color: #ffffff;
  padding-left: 15px;
}
.long-desc{
  line-height: 1.5;
}
.rank-open {
  margin-top: 10px;
  position: absolute;
  bottom: 30px;
  left: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rank-open::before {
  display: block;
  content: ' ';
  width: 10px;
  height: 10px;
  background: #ffd38f;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
