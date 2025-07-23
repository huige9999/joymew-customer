<template>
  <div>
    <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px;">
      播放列表
      <span v-if="isDragging" style="color: #409eff; font-size: 14px; margin-left: 8px;">
        (拖拽排序中)
      </span>
    </div>

    <!-- 自定义表格组件 -->
    <CustomTable
      :data.sync="playlistData"
      :columns="tableColumns"
      :loading="loading"
      :draggable="draggable"
      row-key="activeId"
      drag-handle=".drag-handle"
      empty-text="暂无播放列表"
      empty-sub-text="请先添加音乐到播放列表"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      :show-pagination="false"
    >
      <!-- 音乐播放插槽 -->
      <template #music="{ row }">
        <CustomAudio :url="row.url" />
      </template>

      <!-- 操作插槽 -->
      <template #action="{ row }">
        <span class="delete-btn" @click="handleDelete(row)">删除</span>
      </template>
    </CustomTable>

    <div style="margin-top: 16px; display: flex; align-items: center;">
      <el-button type="primary" @click="showUploadModal = true">添加音乐</el-button>
      <span style="margin-left: 12px; color: #888;">支持MP3/FLAC格式，文件不超过10M</span>
    </div>
    <UploadModal
      :visible.sync="showUploadModal"
      :activity-id="activityId"
      @success="handleUploadSuccess"
      @close="handleUploadModalClose"
    />

    <!-- 我的收藏表格 -->
    <div style="font-weight: bold; font-size: 16px; margin: 32px 0 12px 0;">我的收藏</div>
    <CustomTable
      :data.sync="favoriteData"
      :columns="favoriteColumns"
      :loading="favoriteLoading"
      row-key="favoriteId"
      empty-text="暂无收藏"
      empty-sub-text="快去添加你喜欢的音乐吧"
      :current-page="favoriteCurrentPage"
      :page-size="favoritePageSize"
      :total="favoriteTotal"
      :page-sizes="favoritePageSizes"
      @size-change="handleFavoriteSizeChange"
      @current-change="handleFavoriteCurrentChange"
    >
      <!-- 音乐播放插槽 -->
      <template #music="{ row }">
        <CustomAudio :url="row.url" />
      </template>
      <!-- 人气插槽 -->
      <template #popularity="{ row }">
        <span style="color: #f56c6c; display: flex; align-items: center;">
          <img src="https://ustatic.hudongmiao.com/joymewScreen/img/musicLib/hot.png" style="width: 12px; height: 18px; margin-right: 4px;" />
          {{ row.favoriteCount || 0 }}
        </span>
      </template>
      <!-- 操作插槽 -->
      <template #action="{ row }">
        <span class="action-btn" @click="handleFavoriteAdd(row)">添加</span>
        <span class="action-btn" @click="handleFavoriteEdit(row)">修改</span>
        <el-popconfirm
          title="确定删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleFavoriteDelete(row)"
        >
          <span class="action-btn delete-btn" slot="reference">删除</span>
        </el-popconfirm>
      </template>
    </CustomTable>

    <!-- 编辑音乐名弹窗 -->
    <el-dialog
      title="修改音乐"
      :visible.sync="editDialogVisible"
      width="700px"
      @close="handleEditDialogClose"
    >
      <el-form label-width="120px">
        <el-form-item label="音乐名" required>
          <el-input v-model="editMusicName" placeholder="请输入音乐名" />
        </el-form-item>
      </el-form>
      <div style="text-align: center; margin-top: 20px;">
        <el-button type="primary" @click="handleEditDialogConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { activityPlaylistAPI, favoriteAPI } from '../api';
import CustomAudio from './CustomAudio.vue';
import CustomTable from './CustomTable.vue';
import UploadModal from './UploadModal.vue';

export default {
  name: 'Playlist',
  components: { CustomTable, UploadModal, CustomAudio },
  props: {
    activityId: { type: [String, Number], required: true },
    draggable: { type: Boolean, default: false },
  },
  data() {
    return {
      playlistData: [],
      showUploadModal: false,
      loading: false,
      // 收藏列表相关
      favoriteData: [],
      favoriteLoading: false,
      favoriteColumns: [
        { type: 'index', label: '序号', width: '80px' },
        { prop: 'favoriteName', label: '音乐名', width: '120px' },
        { slot: 'music', label: '音乐', flex: 1 },
        { slot: 'popularity', label: '人气', width: '100px' },
        { slot: 'action', label: '操作', width: '160px' },
      ],
      favoriteCurrentPage: 1,
      favoritePageSize: 10,
      favoriteTotal: 0,
      favoritePageSizes: [10, 15, 20, 30],
      // 编辑弹窗相关
      editDialogVisible: false,
      editMusicName: '',
      editingRow: null,
      // 拖拽状态
      isDragging: false,
    };
  },
  computed: {
    tableColumns() {
      const base = [
        { type: 'index', label: '序号', width: '80px' },
        { prop: 'favoriteName', label: '音乐名', width: '200px' },
        { slot: 'music', label: '音乐', flex: 1 },
        { slot: 'action', label: '操作', width: '80px' },
      ];
      if (this.draggable) {
        base.push({ type: 'drag', label: '拖拽', width: '80px' });
      }
      return base;
    },
  },
  created() {
    this.fetchPlaylist();
    this.fetchFavoriteList();
  },
  methods: {
    async fetchPlaylist() {
      this.loading = true;
      try {
        // 获取所有播放列表数据
        const res = await activityPlaylistAPI.getActivityPlaylist({
          splid: this.activityId,
          currentPage: 1,
          showCount: 10000,
        });
        this.playlistData = res.data?.list || res.data || [];
        console.log('播放列表数据加载成功:', this.playlistData);
      } catch (error) {
        console.error('获取播放列表失败:', error);
        this.$message.error('获取播放列表失败');
      } finally {
        this.loading = false;
      }
    },
    async handleDelete(row) {
      try {
        const res = await activityPlaylistAPI.removeFromActivityPlaylist(row.activeId);
        if (res.code === 200) {
          // 从本地数据中删除
          const index = this.playlistData.findIndex((item) => item.activeId === row.activeId);
          if (index > -1) {
            this.playlistData.splice(index, 1);
          }
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    async onDragStart() {
      this.isDragging = true;
      await this.$nextTick();
    },
    async onDragEnd(_, draggedData) {
      try {
        // 更新播放列表数据
        this.playlistData = [...(draggedData || this.playlistData)];
        // 拼接activeId字符串并调用排序接口
        const sortStr = this.playlistData.map((item) => item.activeId).join(',');
        await activityPlaylistAPI.sortPlaylist(sortStr);
        this.$message.success('顺序已保存');
      } catch (error) {
        this.$message.error('保存顺序失败');
        // 如果保存失败，重新获取数据以确保数据一致性
        await this.fetchPlaylist();
      } finally {
        this.isDragging = false;
      }
    },

    // 收藏列表相关方法
    async fetchFavoriteList() {
      this.favoriteLoading = true;
      try {
        const res = await favoriteAPI.getFavoriteList({
          currentPage: this.favoriteCurrentPage,
          showCount: this.favoritePageSize,
          // 可扩展：keyword、tags
        });
        const allData = res.data?.list || res.data || [];
        this.favoriteTotal = res.data?.totalResult ?? allData.length;
        this.favoriteData = allData;
      } catch (e) {
        this.$message.error('获取收藏列表失败');
      } finally {
        this.favoriteLoading = false;
      }
    },
    handleFavoriteSizeChange(size) {
      this.favoritePageSize = size;
      this.favoriteCurrentPage = 1;
      this.fetchFavoriteList();
    },
    handleFavoriteCurrentChange(page) {
      this.favoriteCurrentPage = page;
      this.fetchFavoriteList();
    },
    async handleFavoriteAdd(row) {
      try {
        // 调用API将收藏的音乐添加到活动播放列表
        const res = await activityPlaylistAPI.addSongToActivityPlaylist(this.activityId, row.musicId);
        this.$message.success(res.msg);
        // 重新获取播放列表数据
        await this.fetchPlaylist();
        // 新增：添加音乐后，立即同步一次排序
        const sortStr = this.playlistData.map((item) => item.activeId).join(',');
        await activityPlaylistAPI.sortPlaylist(sortStr);
      } catch (error) {
        console.error('添加失败:', error);
        this.$message.error('添加失败');
      }
    },
    handleFavoriteEdit(row) {
      this.editDialogVisible = true;
      this.editMusicName = row.favoriteName;
      this.editingRow = row;
    },
    async handleEditDialogConfirm() {
      if (!this.editMusicName) {
        this.$message.error('音乐名不能为空');
        return;
      }
      try {
        await favoriteAPI.updateFavoriteName(this.editingRow.favoriteId, this.editMusicName);
        this.$message.success('修改成功');
        this.editDialogVisible = false;
        this.fetchFavoriteList();
      } catch (e) {
        this.$message.error('修改失败');
      }
    },
    handleEditDialogClose() {
      this.editDialogVisible = false;
    },
    async handleFavoriteDelete(row) {
      try {
        await favoriteAPI.removeFavoriteById(row.favoriteId);
        this.$message.success('删除成功');
        this.fetchFavoriteList();
      } catch (e) {
        this.$message.error('删除失败');
      }
    },
    handleUploadModalClose() {
      this.showUploadModal = false;
    },
    async handleUploadSuccess() {
      await this.fetchPlaylist();
      // 新增：上传音乐后，立即同步一次排序
      const sortStr = this.playlistData.map((item) => item.activeId).join(',');
      await activityPlaylistAPI.sortPlaylist(sortStr);
      this.fetchFavoriteList();
    },
  },
};
</script>

<style lang="less" scoped>
// Playlist组件特定样式
.delete-btn {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #66b1ff;
  }
}
.action-btn {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
  margin-right: 12px;
  text-decoration: none;
  transition: color 0.2s ease;
}
.action-btn:last-child {
  margin-right: 0;
}
.action-btn:hover {
  color: #66b1ff;
}
</style>
