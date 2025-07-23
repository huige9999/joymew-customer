<template>
  <sub-page class="teachvideo">
    <main-card>
      <div class="top-nav">
        <el-button v-if="$route.path === '/app/teachVideo'" type="text" @click="back">返回</el-button>
      </div>
      <div class="title">嗨喵视频教程</div>
      <div class="videotype-list">
        <div class="videotype-item" v-for="item in videotype_list" :key="item.nav_key"
          :class="{ active: item.nav_key === videotype_active }" @click="chooseVideoType(item.nav_key)">
          {{ item.nav_name }}
        </div>
      </div>
      <div class="video-list" v-loading="isLoading">
        <div class="video-item" v-for="item in videolist" :key="item.id">
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
      <div class="pagination-wrap">
        <el-pagination background :page-size="pageSize" @current-change="handleCurrentChange" layout="prev, pager, next"
          :total="totalResult">
        </el-pagination>
      </div>
      <el-dialog :visible.sync="videopreview_dialog_visible" width="850px" center class="videopreview-dialog">
        <video :src="videopath_active" controls class="video-preview" @play="playHandler" @pause="pauseHandler" autoplay
          ref="video_dom"></video>
      </el-dialog>
    </main-card>
  </sub-page>
</template>

<script>
import { getTeachVideoByType, recordVideoPlayTime } from '@/api/teachVideo/index';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';

export default {
  name: 'teachVideo',
  components: {
    SubPage,
    MainCard,
  },
  data() {
    return {
      videotype_list: [
        // {
        //   nav_name: '最新上线',
        //   nav_key: 'new_online',
        // },
        {
          nav_name: '大屏使用',
          nav_key: 'screen_use',
        },
        {
          nav_name: '互动功能',
          nav_key: 'hd_func',
        },
        {
          nav_name: '互动游戏',
          nav_key: 'hd_game',
        },
        {
          nav_name: '提高收益',
          nav_key: 'income_up',
        },
      ],
      videotype_active: 'screen_use',
      videolist: [],
      videopath_active: '',
      videopreview_dialog_visible: false,
      pageSize: 10,
      totalResult: 0,
      currentPage: 1,
      isLoading: false,
      start_time: 0, // 开始播放时间
      end_time: 0, // 结束播放时间
      time: 0, // 播放总时长
      currentItem: {},
    };
  },
  watch: {
    videopreview_dialog_visible(newVal) {
      if (!newVal) {
        this.$refs.video_dom.pause();
      }
    },
  },
  created() {
    this.requestTeachVideoByType();
    // localStorage.setItem('isRun', false)
  },
  mounted() {
    window.addEventListener('beforeunload', this.handlerLeave);
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.handlerLeave);
  },
  methods: {
    back() {
      this.$router.replace({
        path: '/app/home',
      });
    },
    playCurrentVideo(videoObj) {
      this.videopath_active = videoObj.video_path;
      this.videopreview_dialog_visible = true;
      this.currentItem = { ...videoObj };
    },
    chooseVideoType(key) {
      this.videotype_active = key;
      this.currentPage = 1;
      this.requestTeachVideoByType();
    },
    handleCurrentChange(page) {
      console.log(page);
      this.currentPage = page;
      this.requestTeachVideoByType();
    },
    requestTeachVideoByType() {
      this.isLoading = true;
      this.videolist.splice(0);
      getTeachVideoByType({
        type: this.videotype_active,
        currentPage: this.currentPage,
        showCount: this.pageSize,
      })
        .then((res) => {
          console.log(res);
          this.videolist = res.data.list.map((item) => {
            return {
              cover_path: item.media_cover,
              video_path: item.media,
              title: item.title,
              time_long: item.media_length,
              id: item.id,
            };
          });
          this.totalResult = res.data.totalResult;
          this.isLoading = false;
          console.log('videolist', this.videolist);
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
        localStorage.setItem('isRun', `${this.time || '000'}`);
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
.teachvideo {
  .top-nav {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .title {
    font-size: 24px;
    font-weight: 400;
    color: #000000;
    text-align: center;
  }

  .videotype-list {
    display: flex;
    justify-content: center;
    margin-top: 50px;

    .videotype-item {
      margin: 0 13px;
      width: 144px;
      height: 42px;
      background: rgba(140, 140, 140, 0.2);
      border-radius: 31px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      cursor: pointer;

      &.active {
        background: rgba(30, 135, 240, 0.1);
        border: 1px solid #1e87f0;
        color: #1e87f0;
      }
    }
  }

  .video-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 249px);
    column-gap: 20px;
    grid-template-rows: 192px;
    grid-auto-rows: 192px;
    margin-top: 20px;
    justify-content: space-between;
    padding: 0 40px;

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
        position: relative;
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

  .pagination-wrap {
    display: flex;
    justify-content: center;
    padding-bottom: 40px;
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
