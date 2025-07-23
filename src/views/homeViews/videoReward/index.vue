<template>
    <div class="video-reward">
        <div class="left">
            <p>{{ current.title }}</p>

            <div class="video-player">
                <template v-if="!videoShow">
                    <img :src="current.cover" alt="">

                    <img @click="videoShow = true" class="button" src="@/assets/image/player-button.png" alt="">

                    <div @click="videoShow = true"></div>
                </template>
                <video ref="video" style="width: 100%;height: 100%;" :src="current.url" v-show="videoShow"
                    controls></video>
            </div>

            <div v-show="isShowHelp" class="help">
                <span>该内容对你有帮助吗？</span>

                <div @click="helpful">
                    <img src="@/assets/image/good.png" alt="">
                    <span>有帮助</span>
                </div>

                <div @click="unHelpful">
                    <img style="transform: rotate(180deg);" src="@/assets/image/good.png" alt="">
                    <span>没帮助</span>
                </div>
            </div>
            <div class="bottom">
                <div class="title">
                    {{ current.title }}
                </div>

                <div class="desc">
                    {{ current.desc }}
                </div>
            </div>
        </div>

        <div class="right">
            <p>其他教程</p>

            <div @click="otherVideoClick($.id)" v-for="($, i) in otherList" :key="i">
                <div>
                    <img :src="$.cover" alt="">

                    <div class="mask"></div>
                    <img src="@/assets/image/player-button.png" class="button" alt="">
                    <span class="bottom">
                        <span>{{ $.count }}次 播放</span>
                        <span>{{ $.duration }}</span>
                    </span>
                </div>
                <p>{{ $.title }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import {
  showJcUpincomeJcList,
  watchJcUpIncome,
} from '@/api/teachVideo/index';

export default {
  name: 'videoReward',
  data: () => ({
    otherList: [],
    current: {
      title: '',
      cover: '',
      url: '',
      count: 0,
      duration: '',
      id: '',
    },
    allList: [],
    videoShow: false,
    isShowHelp: true,

  }),
  methods: {
    otherVideoClick(id) {
      this.videoShow = false;
      this.otherList[this.otherList.findIndex((i) => id === i.id)] = this.current;
      this.current = this.allList.find((i) => i.id === id);
      this.isShowHelp = true;
      setTimeout(() => {
        this.videoShow = true;
        this.$refs.video.play();
      }, 0);
      // this.$nextTick(() => {
      //     this.videoShow = true;
      //     this.$refs.video.play();
      // });
      // this.otherList = this.allList.filter((i) => i.id != id).sort(() => Math.random() - 0.5);
    },
    helpful() {
      this.isShowHelp = false;
      this.$message.success('感谢您的反馈');
    },
    unHelpful() {
      this.isShowHelp = false;
      this.$message.success('感谢您的反馈');
    },
  },
  async created() {
    const { data } = await showJcUpincomeJcList();
    const result = Object.values(data).map((item) => ({
      duration: item.media_length,
      title: item.title,
      cover: item.media_cover,
      url: item.media,
      count: item.view,
      id: item.id,
      desc: item.note,
    }));
    if (!this.$route.query.id) {
      [this.current] = result;
    } else this.current = result.find((item) => item.id === this.$route.query.id);
    // alert(this.current);
    this.allList = result;
    if (!this.$route.query.id) {
      this.otherList = result.slice(1).sort(() => Math.random() - 0.5);
    } else this.otherList = result.filter((i) => i.id !== this.$route.query.id).sort(() => Math.random() - 0.5);

    console.error(result);
  },
  mounted() {
    // this.$message('sssss');?
    // console.error(this.$route.query.id);
    let lastTime = 0;
    this.$refs.video.addEventListener('timeupdate', function _() {
      if (this.currentTime > lastTime + 1) {
        this.currentTime = lastTime;
      } else {
        lastTime = this.currentTime;
      }
    });
    const that = this;
    this.$refs.video.addEventListener('ended', async function _() {
      // alert('视频播放结束');

      this.pause();
      // this.videoShow = false;
      // alert(that.current.id);
      const { data } = await watchJcUpIncome(that.current.id);
      /**
                   * 修改store，更新用户的收益，其他页面的收益也会更新
                   */
      that.$store.commit('login/setJcUpIncome', data);
      // alert(JSON.stringify(result));
      that.$message({
        type: 'success',
        message: `恭喜您的礼物收益比例已达到 ${data}`,
      });
      // console.error(55555555555);
    });

    window.addEventListener('blur', () => {
      if (this.videoShow) {
        this.$refs.video.pause();
      }
    });
  },

  watch: {
    videoShow(show) {
      if (show) {
        this.$refs.video.play();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.video-reward {
    background-color: #F0F2F5;
    padding: 20px;
    display: flex;

    .left {
        width: 0;
        flex-grow: 1;
        margin-right: 20px;
        background-color: #fff;
        padding: 20px;

        p {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .video-player {
            aspect-ratio: 1.79;
            position: relative;
            overflow: hidden;

            &:hover {
                cursor: pointer;

                img:first-child {
                    transform: scale(1.05);
                }
            }

            img {
                width: 100%;
                height: 100%;
                transition: all 0.5s ease-in-out;

            }

            .button {
                position: absolute;
                width: 120px;
                height: 120px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 11;
            }

            div {
                position: absolute;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.5);
            }
        }

        .help {
            display: flex;
            background-color: #F9F9F9;
            height: 70px;
            align-items: center;
            padding: 0 20px;
            margin-bottom: 24px;

            // border-bottom: 1px solid #E9E9E9;
            span {
                color: #666;
            }

            >span {
                font-size: 16px;
            }

            div {
                display: flex;
                align-items: center;
                background-color: #EEEFEF;
                padding: 7px 11px;
                margin-left: 20px;

                &:hover {
                    cursor: pointer;
                }

                span {
                    font-size: 14px;

                }

                img {
                    width: 18px;
                    height: 18px;
                    margin-right: 10px;
                }

                &:nth-child(2) {
                    margin-left: auto;
                }
            }
        }

        .bottom {

            .title {
                padding-top: 24px;
                border-top: 1px solid #E9E9E9;
                font-size: 20px;

            }

            .desc {
                margin-top: 13px;
                font-size: 16px;
                color: #666666;
            }
        }
    }

    .right {
        width: 0;
        flex: 0 0 330px;
        background-color: #fff;
        padding: 20px;

        p {
            font-size: 16px;

        }

        >div {
            margin-top: 20px;

            div {
                width: 100%;
                height: 163px;
                position: relative;
                overflow: hidden;

                &:hover {
                    cursor: pointer;

                    img:first-child {
                        transform: scale(1.1);
                    }
                }

                img {
                    width: 100%;
                    height: 100%;
                    transition: all 0.5s ease-in-out;
                }

                .mask {
                    position: absolute;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.4);
                }

                .button {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    left: 50%;
                    width: 50px;
                    height: 50px;
                }

                .bottom {
                    position: absolute;
                    bottom: 12px;
                    left: 8px;
                    width: calc(100% - 16px);
                    font-size: 14px;
                    color: white;
                    display: flex;
                    align-items: center;

                    span:first-child {

                        // font-size: ;
                    }

                    span:last-child {
                        margin-left: auto;
                        background-color: rgba(0, 0, 0, 0.6);
                        padding: 4px 8px;
                        border-radius: 6px;
                        font-size: 12px;
                    }
                }

            }

            p {
                font-size: 14px;
                margin-top: 12px;
            }
        }
    }
}
</style>
