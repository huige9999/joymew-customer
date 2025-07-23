<template>
  <div class="music-library-container">
    <div class="music-library-title">音乐库</div>
    <div class="music-library-panel">
      <div class="search-bar">
        <div class="search-input-wrapper">
          <input v-model="searchText" type="text" class="search-input" placeholder="" />
          <span v-if="searchText" class="clear-icon" @click="clearSearch">×</span>
        </div>
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
      <div class="tag-list">
        <span
          v-for="tag in tags"
          :key="tag"
          :class="['tag-item', { selected: selectedTags.includes(tag) }]"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="selected-tag" v-if="selectedTags.length">
        <img src="https://ustatic.hudongmiao.com/joymewScreen/img/musicLib/tag.png" style="width: 12px; height: 18px; margin-right: 4px;" />
        标签：
        <span v-for="tag in selectedTags" :key="tag" class="tag-selected-multi">
          {{ tag }}
          <span class="tag-remove" @click.stop="removeTag(tag)">×</span>
        </span>
        <button class="clear-btn" @click="clearTag">清除筛选</button>
      </div>
    </div>

    <!-- 音乐库列表 -->
    <div class="music-list-section">
      <div class="music-list-title">音乐列表</div>
      <CustomTable
        :data.sync="musicList"
        :columns="tableColumns"
        :loading="loading"
        row-key="musicId"
        empty-text="暂无音乐"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <!-- 音乐试听插槽 -->
        <template #music="{ row }">
          <CustomAudio :url="row.url" />
        </template>
        <!-- 收藏按钮插槽 -->
        <template #favorite="{ row }">
          <button class="favorite-btn" @click="handleFavorite(row)">收藏</button>
        </template>
        <!-- 人气插槽 -->
        <template #popularity="{ row }">
          <span style="color: #f56c6c; display: flex; align-items: center;">
            <img src="https://ustatic.hudongmiao.com/joymewScreen/img/musicLib/hot.png" style="width: 12px; height: 18px; margin-right: 4px;" />
            {{ row.favoriteCount || 0 }}
          </span>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<script>
import { musicLibraryAPI } from '../api';
import CustomTable from './CustomTable.vue';
import CustomAudio from './CustomAudio.vue';

export default {
  name: 'MusicLibrary',
  components: { CustomTable, CustomAudio },
  data() {
    return {
      searchText: '',
      tags: [],
      selectedTags: [],
      // 音乐库列表相关
      musicList: [],
      loading: false,
      tableColumns: [
        { prop: 'name', label: '收藏选中歌曲', width: '180px', formatter: (row) => `${row.name}${row.tags && row.tags.length ? `（${row.tags.join('、')}）` : ''}` },
        { slot: 'favorite', label: '', width: '100px' },
        { slot: 'music', label: '音乐', flex: 1 },
        { slot: 'popularity', label: '人气', width: '120px' },
        { prop: 'uploader', label: '上传者', width: '140px' },
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100],
    };
  },
  created() {
    this.fetchTags();
    this.fetchMusicList();
  },
  watch: {
    selectedTags() {
      this.currentPage = 1;
      this.fetchMusicList();
    },
  },
  methods: {
    async fetchTags() {
      try {
        const res = await musicLibraryAPI.getMusicTags();
        if (res && res.data && Array.isArray(res.data)) {
          this.tags = res.data;
        }
      } catch (error) {
        console.error('获取音乐标签失败:', error);
        // 如果获取标签失败，可以设置一些默认标签
      }
    },
    async fetchMusicList() {
      this.loading = true;
      try {
        const params = {
          currentPage: this.currentPage,
          showCount: this.pageSize,
          keyword: this.searchText,
          tags: this.selectedTags.join(','),
        };
        const res = await musicLibraryAPI.getMusicLibraryList(params);
        if (res && res.data) {
          // 确保使用分页数据，而不是全部数据
          this.musicList = res.data.list || [];
          this.total = res.data.totalResult || 0;
        }
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchMusicList();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.fetchMusicList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchMusicList();
    },
    toggleTag(tag) {
      const idx = this.selectedTags.indexOf(tag);
      if (idx === -1) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags.splice(idx, 1);
      }
    },
    removeTag(tag) {
      const idx = this.selectedTags.indexOf(tag);
      if (idx !== -1) {
        this.selectedTags.splice(idx, 1);
      }
    },
    clearTag() {
      this.selectedTags = [];
    },
    clearSearch() {
      this.searchText = '';
    },
    async handleFavorite(row) {
      try {
        const { favoriteAPI } = await import('../api');
        const res = await favoriteAPI.addToFavorites(row.musicId);
        console.log('收藏的响应', res);
        if (res.msg === '收藏成功') {
          if (this.$message) this.$message.success('收藏成功');
        } else if (this.$message) {
          this.$message.warning(res.msg);
        }
      } catch (e) {
        if (this.$message) this.$message.error((e && e.message) || '收藏失败');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.music-library-container {
  padding: 20px 0;
}
.music-library-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}
.music-library-panel {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-input {
  width: 500px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 32px 0 12px;
  font-size: 16px;
  margin-right: 0;
  outline: none;
}
.search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
}
.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #ccc;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.clear-icon:hover {
  color: #999;
  border-color: #1890ff;
}
.search-btn {
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  height: 40px;
  width: 80px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s;
}
.search-btn:active {
  background: #1765ad;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 20px;
  margin-bottom: 16px;
}
.tag-item {
  font-size: 15px;
  color: #333;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 3px;
  transition: background 0.2s, color 0.2s;
}
.tag-item.selected {
  background: #1890ff;
  color: #fff;
}
.selected-tag {
  display: flex;
  align-items: center;
  font-size: 15px;
  margin-top: 8px;
}
.tag-selected {
  color: #1890ff;
  margin: 0 8px;
}
.tag-selected-multi {
  display: inline-flex;
  align-items: center;
  background: #f5f5f5;
  color: #1890ff;
  border-radius: 3px;
  padding: 0 6px 0 6px;
  margin: 0 6px;
  font-size: 15px;
}
.tag-remove {
  color: #aaa;
  margin-left: 2px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.tag-remove:hover {
  background: #eee;
  color: #ff4d4f;
}
.clear-btn {
  margin-left: 8px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.clear-btn:hover,
.clear-btn:active {
  border-color: #1890ff;
  color: #1890ff;
}
.music-list-section {
  margin-top: 32px;
  width: 100%;
}
.music-list-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.favorite-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 16px;
  min-width: 78px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  white-space: nowrap;
}
.favorite-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
