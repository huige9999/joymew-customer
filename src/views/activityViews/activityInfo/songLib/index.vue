<template>
  <div class="song-lib-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="播放列表" name="playlist"></el-tab-pane>
      <el-tab-pane label="音乐库" name="musicLib"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName === 'playlist'">
      <Playlist :activity-id="activityId" :draggable="true" />
    </div>
    <div v-else-if="activeName === 'musicLib'">
      <MusicLibrary :activity-id="activityId" />
    </div>
  </div>
</template>

<script>
import MusicLibrary from './components/MusicLibrary.vue';
import Playlist from './components/Playlist.vue';

export default {
  name: 'SongLib',
  components: { Playlist, MusicLibrary },
  data() {
    return {
      activeName: 'playlist',
    };
  },
  computed: {
    activityId() {
      return this.$store.state.liveId;
    },
  },
};
</script>

<style lang="less" scoped>
.song-lib-container {
  background: #fff;
  margin-top: 0px;
  margin-left: 0px;
  padding: 24px;
  border-radius: 8px;
  min-height: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style>
