<!--视频教程入口-->
<template>
  <div class="teachvideo-entry">
    <div class="top-nav">
      <div class="title">嗨喵视频教程</div>
      <div class="more-entry" @click="toMoreTeachVideo">查看更多教程 >></div>
    </div>
    <div class="top-videos" v-loading="isLoading">
      <div class="video-item" v-for="item in top_videolist" :key="item.id">
        <div class="video-cover" @click="playCurrentVideo(item)">
          <img :src="item.cover_path" alt="封面" class="cover-img" />
          <div class="cover-shade"></div>
          <img src="https://ustatic.hudongmiao.com/joymewCustomer/play-icon.png" class="play-icon" />
          <!-- <div class="play-count">{{ item.play_count }}次 播放</div> -->
          <div class="time-long">{{ item.time_long }}</div>
        </div>
        <div class="video-title">{{ item.title }}</div>
      </div>
    </div>
    <el-dialog :visible.sync="videopreview_dialog_visible" width="850px" center class="videopreview-dialog">
      <video :src="videopath_active" controls class="video-preview" autoplay ref="video_dom" @play="playHandler" @pause="pauseHandler"></video>
    </el-dialog>
  </div>
</template>

<script>
import { getTeachVideoPriority, recordVideoPlayTime } from '@/api/teachVideo/index';

export default {
  name: 'teachVideoEntry',
  components: {},
  created() {
    this.requestTeachVideoPriority();
  },
  data() {
    return {
      videopath_active: '',
      videopreview_dialog_visible: false,
      top_videolist: [],
      isLoading: false,
      start_time: 0, // 开始播放时间
      end_time: 0, // 结束播放时间
      time: 0, // 播放总时长
      currentItem: {},
    };
  },
  mounted() {
    window.addEventListener('beforeunload', this.handlerLeave);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handlerLeave);
  },
  watch: {
    videopreview_dialog_visible(newVal) {
      if (!newVal) {
        this.$refs.video_dom.pause();
        // 重置播放时长记录时间
        this.start_time = 0;
        this.end_time = 0;
        this.time = 0;
      }
    },
  },
  computed: {},
  methods: {
    toMoreTeachVideo() {
      this.$router.push('/app/teachVideo');
    },
    playCurrentVideo(videoObj) {
      this.videopath_active = videoObj.video_path;
      this.videopreview_dialog_visible = true;
      this.currentItem = { ...videoObj };
    },
    requestTeachVideoPriority() {
      this.isLoading = true;
      getTeachVideoPriority()
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.top_videolist = res.data.map((item) => {
            return {
              id: item.id,
              time_long: item.media_length,
              title: item.title,
              video_path: item.media,
              cover_path: item.media_cover,
            };
          }).slice(0, 4);
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    playHandler() {
      // 记录开始时间
      this.start_time = Date.now();
    },
    pauseHandler() {
      this.end_time = Date.now();
      this.caculateTime();
    },
    // 计算间隔时间
    caculateTime() {
      if (this.start_time && this.end_time) {
        this.time += Math.floor((Number(this.end_time) - Number(this.start_time)) / 1000);
      }
      console.log('总时长', this.time);
      // 记录时间
      this.recordJcWatchTime();
    },
    async handlerLeave() {
      if (this.videopreview_dialog_visible && !this.$refs.video_dom.paused) {
        // 判断是否取消了播放
        // 如果关闭时还处于播放状态，则以当前关闭时间作为结束时间
        this.end_time = Date.now();
        await this.caculateTime();
        console.log('总时长', this.time);
      }
    },
    // 记录观看时长
    async recordJcWatchTime() {
      if (this.time === 0) return;
      const res = await recordVideoPlayTime({
        title: this.currentItem.title,
        seeTime: String(this.time),
      });
      console.log('记录结果', res);
      // 重置记录时间的参数
      this.start_time = 0;
      this.end_time = 0;
      this.time = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.teachvideo-entry {
  background-color: #ffffff;
  box-shadow: 0 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;
  padding: 20px;

  .top-nav {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 18px;
      font-weight: 400;
      color: #000000;
    }
    .more-entry {
      font-size: 16px;
      font-weight: 400;
      color: #1e87f0;
      cursor: pointer;
    }
  }

  .top-videos {
    display: grid;
    grid-template-columns: repeat(4, 249px);
    grid-template-rows: 192px;
    grid-auto-rows: 192px;
    margin-top: 20px;
    justify-content: space-between;

    .video-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 249px;

      .video-cover {
        width: 249px;
        height: 140px;
        display: grid;
        cursor: pointer;
        overflow: hidden;
        .cover-img {
          width: 249px;
          height: 140px;
          grid-row-start: 1;
          grid-row-end: 1;
          grid-column-start: 1;
          grid-column-end: 1;
          transition: transform 0.3s linear;
        }

        .cover-shade {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          grid-row-start: 1;
          grid-row-end: 1;
          grid-column-start: 1;
          grid-column-end: 1;
          position: relative;
          z-index: 1;
        }

        .play-icon {
          width: 44px;
          height: 44px;
          grid-row-start: 1;
          grid-row-end: 1;
          grid-column-start: 1;
          grid-column-end: 1;
          justify-self: center;
          align-self: center;
          position: relative;
          z-index: 1;
        }

        .play-count {
          background: rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 10px;
          font-weight: 400;
          color: #ffffff;
          grid-row-start: 1;
          grid-row-end: 1;
          grid-column-start: 1;
          grid-column-end: 1;
          justify-self: end;
          align-self: end;
          margin-right: 8px;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .time-long {
          font-size: 10px;
          font-weight: 400;
          color: #ffffff;
          margin-left: 12px;
          margin-bottom: 12px;
          grid-row-start: 1;
          grid-row-end: 1;
          grid-column-start: 1;
          grid-column-end: 1;
          justify-self: start;
          align-self: end;
          position: relative;
          z-index: 1;
        }

        &:hover {
          .cover-shade {
            background: rgba(0, 0, 0, 0.3);
          }

          .cover-img {
            transform: scale(1.1);
          }
        }
      }

      .video-title {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
    }
  }

  .videopreview-dialog::v-deep {
    // .el-dialog__header {
    //     padding: 0;
    //     padding-bottom: 0;
    // }
    // .el-dialog__body {
    //     padding: 0;
    // }
    .video-preview {
      width: 800px;
    }
  }
}
</style>
