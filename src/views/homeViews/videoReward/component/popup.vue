<template>
    <div class="popup-container" v-if="show">
        <div class="content">
            <div class="header">
                <div>
                    嗨喵发福利啦~
                    <img @click="close" src="@/assets/image/vr-close.png" alt="">
                </div>
            </div>
            <div class="body">
                <p>
                    尊敬的各位主持人老师您好：<br />
                    <span style="text-indent: 2em;display: block;">现在看教程可提升收益比例啦～，即日起每查看一个指定教程，即可提升
                        <span style="color: #23C343;">1%</span>礼物收益。
                    </span>
                </p>
                <div style="text-align: center;margin: 18px 0 32px 0;">
                    当前礼物收益：<span style="color: #1890FF;">{{ rate }}%</span>
                </div>

                <div class="video-list">
                    <div @click="gotoVideoReward($.id)" v-for="($, i) in list" :key="i">
                        <div></div>
                        <span class="duration">{{ $.duration }}</span>
                        <span class="playCount">{{ $.count }}
                            <span style="margin-left: 4px;display: inline-block;">播放</span>
                        </span>
                        <img class="cover" :src="$.cover" alt="">
                        <img class="play" src="@/assets/image/player-button.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showJcUpincomeJcList } from '@/api/teachVideo/index';
import router from '@/router';
import store from '@/store';

const STORAGE_KEY = 'teachReward';

export default {
  props: [
    'getVideoCallback',
  ],
  computed: {
    userInfo() {
      return store.state.login.userInfo;
    },
    rate() {
      return this.userInfo.income_rate;
    },
  },

  methods: {
    close() {
      // 从dom树上移除自己
      this.show = false;
      setTimeout(() => {
        // 销毁自己的状态
        this.$destroy(true);
      }, 100);
    },
    gotoVideoReward(id) {
      router.replace({ path: '/app/video/reward', query: { id } });
      // alert('aaa');
      store.commit('menu/setActiveMenu', '15-1');
      this.close();
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const date = (today.getDate()).toString().padStart(2, '0');
      return `${year}-${month}-${date}`;
    },
    /**
                         * 判断今天有没有弹出过弹窗
                         */
    hasPopupToday() {
      const today = this.getTodayDate();
      const storageInfo = localStorage.getItem(STORAGE_KEY);
      if (storageInfo && storageInfo === today) {
        return true;
      }
      return false;
    },
    /**
                         * 打上今天已经弹出过标识
                         */
    setPopupToday(today) {
      localStorage.setItem(STORAGE_KEY, today);
    },
  },
  data: () => ({
    show: false,
    list: [],
  }),
  async created() {
    const { high_privilege, income_rate } = store.state.login.userInfo;
    // 婚礼堂不弹
    // 礼物收益大于80
    // 不弹窗说明也不会有导航栏
    if ([3, 4, 5].includes(high_privilege) || income_rate >= 80) {
      this.close();
      return store.commit('menu/deleteTeachMenu');
    }
    const { data } = await showJcUpincomeJcList();
    const result = Object.values(data).map((item) => ({
      duration: item.media_length,
      title: item.title,
      cover: item.media_cover,
      url: item.media,
      count: item.view,
      id: item.id,
    }));

    // 有推荐视频才弹出并且今天从未登录过才弹窗 但是这个时候导航栏的视频列表也会显示
    if (result.length !== 0 && !this.hasPopupToday()) {
      this.show = true;
      this.setPopupToday(this.getTodayDate());
    } else {
      this.close();
      return store.commit('menu/deleteTeachMenu');
    }
    this.list = result;
    return undefined;
  },
};
</script>

<style scoped lang="scss">
.popup-container {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
        width: 786px;
        // background-color: #fff;
        border-radius: 4px;
        overflow: hidden;

        .header {
            width: 100%;
            height: 113px;
            background: linear-gradient(90deg, #51aafd 0%, #7dd3fd 100%);
            color: #fff;

            div {
                width: 100%;
                height: 100%;
                background-image: url(~@/assets/image/vr-popup.png);
                background-size: 100% 100%;
                font-size: 43px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                img {
                    position: absolute;
                    right: 14px;
                    top: 13px;
                    width: 23px;
                    height: 23px;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .body {
            padding: 25px 35px;
            background-color: #fff;
            font-size: 20px;
            color: #333;

            .video-list {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;

                >div {
                    width: 211px;
                    height: 119px;
                    background-color: red;
                    // margin-right: 28px;
                    position: relative;
                    overflow: hidden;
                    margin: 0 10px 27px 10px;

                    &:hover {
                        cursor: pointer;

                        >div {
                            background-color: rgba(0, 0, 0, .3);
                        }

                        .cover {

                            transform: scale(1.1);
                        }
                    }

                    // background-size: 100% 100%;
                    .cover {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        transition: all .75s ease;
                    }

                    >div {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 10;
                    }

                    .duration {
                        position: absolute;
                        right: 12px;
                        bottom: 12px;
                        color: #fff;
                        font-size: 10px;
                        background-color: rgba(0, 0, 0, 0.6);
                        padding: 4px 6px;
                        border-radius: 5px;
                        z-index: 11;
                    }

                    .playCount {
                        position: absolute;
                        left: 12px;
                        bottom: 12px;
                        color: white;
                        font-size: 12px;
                        z-index: 11;
                    }

                    .play {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 44px;
                        height: 44px;
                        z-index: 13;
                    }

                    // &:nth-child(3n - 1) {
                    //     margin-bottom: 27px;
                    //     margin: 0 auto;

                    // }
                }
            }
        }
    }
}
</style>
