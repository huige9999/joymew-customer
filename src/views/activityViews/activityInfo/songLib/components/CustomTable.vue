<template>
  <div class="custom-table">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><span>⏳</span></el-icon>
      <p style="margin-top: 8px; color: #909399;">{{ loadingText }}</p>
    </div>

    <!-- 有数据时显示表格 -->
    <div v-else-if="data.length > 0">
      <!-- 表格头部 -->
      <div class="table-header">
        <div
          v-for="column in columns"
          :key="column.prop || column.label"
          class="header-cell"
          :style="getColumnStyle(column)"
        >
          {{ column.label }}
        </div>
      </div>

      <!-- 可拖拽的表格内容 -->
      <draggable
        v-model="internalData"
        :handle="dragHandle"
        @start="handleDragStart"
        @end="handleDragEnd"
        tag="div"
        class="table-body"
        :disabled="!draggable"
        :scroll="true"
        :scroll-sensitivity="50"
        :scroll-speed="10"
      >
        <div
          v-for="(item, index) in data"
          :key="getRowKey(item, index)"
          class="table-row"
          @click="handleRowClick(item, index)"
        >
          <div
            v-for="column in columns"
            :key="column.prop || column.label"
            class="table-cell"
            :style="getColumnStyle(column)"
          >
            <!-- 自定义插槽内容 -->
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="item"
              :index="index"
              :column="column"
            ></slot>
            <!-- 拖拽把手列 -->
            <span
              v-else-if="column.type === 'drag'"
              :class="dragHandle.replace('.', '')"
              style="cursor: move; color: #909399; font-size: 16px;"
            >
              ⋮⋮
            </span>
            <!-- 序号列 -->
            <span v-else-if="column.type === 'index'">{{ index + 1 }}</span>
            <!-- 普通数据列 -->
            <span v-else>{{ getColumnValue(item, column) }}</span>
          </div>
        </div>
      </draggable>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && data.length === 0" class="empty-state">
      <div class="empty-content">
        <slot name="empty">
          <p style="color: #909399; margin: 0;">{{ emptyText }}</p>
          <p style="color: #c0c4cc; font-size: 12px; margin: 4px 0 0 0;">{{ emptySubText }}</p>
        </slot>
      </div>
    </div>

    <!-- 分页器 -->
    <el-pagination
      v-if="showPagination && !isDragging"
      class="custom-pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'CustomTable',
  components: { draggable },
  props: {
    // 表格数据
    data: {
      type: Array,
      default: () => [],
    },
    // 列配置
    columns: {
      type: Array,
      required: true,
    },
    // 行的唯一标识符字段名
    rowKey: {
      type: String,
      default: 'id',
    },
    // 是否支持拖拽
    draggable: {
      type: Boolean,
      default: false,
    },
    // 拖拽把手选择器
    dragHandle: {
      type: String,
      default: '.drag-handle',
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 加载文本
    loadingText: {
      type: String,
      default: '加载中...',
    },
    // 空状态文本
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    // 空状态副文本
    emptySubText: {
      type: String,
      default: '',
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
  },
  data() {
    return {
      isDragging: false,
      wheelHandler: null,
    };
  },
  beforeDestroy() {
    // 组件销毁时清理事件监听器
    this.removeWheelListener();
  },
  computed: {
    internalData: {
      get() {
        return this.data;
      },
      set(newData) {
        this.$emit('update:data', newData);
        this.$emit('input', newData);
      },
    },
  },
  methods: {
    // 获取列样式
    getColumnStyle(column) {
      const style = {};
      if (column.width) {
        style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      } else if (column.flex) {
        style.flex = column.flex;
      }
      if (column.align) {
        style.textAlign = column.align;
        if (column.align === 'center') {
          style.justifyContent = 'center';
        } else if (column.align === 'right') {
          style.justifyContent = 'flex-end';
        } else {
          style.justifyContent = 'flex-start';
        }
      }
      return style;
    },

    // 获取行唯一标识
    getRowKey(row, index) {
      return row[this.rowKey] || index;
    },

    // 获取列数据值
    getColumnValue(row, column) {
      if (!column.prop) return '';
      return this.getNestedValue(row, column.prop);
    },

    // 获取嵌套对象值
    getNestedValue(obj, path) {
      return path.split('.').reduce((o, key) => ((o && o[key] !== undefined) ? o[key] : ''), obj);
    },

    // 处理拖拽开始
    handleDragStart(evt) {
      this.$emit('drag-start', evt);
      this.isDragging = true;
      // 添加滚轮事件监听器
      this.addWheelListener();
    },

    // 处理拖拽结束
    handleDragEnd(evt) {
      // 确保数据已经更新后再触发事件
      this.$nextTick(() => {
        this.$emit('drag-end', evt, this.internalData);
      });
      this.isDragging = false;
      // 移除滚轮事件监听器
      this.removeWheelListener();
    },

    // 添加滚轮事件监听器
    addWheelListener() {
      this.wheelHandler = (e) => {
        e.stopPropagation();
        // 允许默认的滚轮行为
        return true;
      };
      document.addEventListener('wheel', this.wheelHandler, { passive: false });
    },

    // 移除滚轮事件监听器
    removeWheelListener() {
      if (this.wheelHandler) {
        document.removeEventListener('wheel', this.wheelHandler);
        this.wheelHandler = null;
      }
    },

    // 处理行点击
    handleRowClick(row, index) {
      this.$emit('row-click', row, index);
    },

    handleSizeChange(size) {
      this.$emit('update:pageSize', size);
      this.$emit('size-change', size);
    },
    handleCurrentChange(page) {
      this.$emit('update:currentPage', page);
      this.$emit('current-change', page);
    },
  },
};
</script>

<style lang="less" scoped>
.custom-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.loading-state {
  text-align: center;
  padding: 40px;
  background: #fff;
}

.table-header {
  display: flex;
  background: #fafbfc;
  border-bottom: 1px solid #e4e7ed;

  .header-cell {
    padding: 16px 20px;
    font-weight: 500;
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}

.table-body {
  background: #fff;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;

  .table-row {
    display: flex;
    border-bottom: 1px solid #e4e7ed;
    transition: all 0.2s ease;
    min-height: 60px;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .table-cell {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      color: #333;

      // 序号列样式
      &:nth-child(2) {
        font-weight: 500;
        color: #666;
      }

      // 音乐名列样式
      &:nth-child(3) {
        color: #333;
        font-weight: 400;
      }

      // 音乐播放器列样式
      &:nth-child(4) {
        audio {
          width: 100%;
          max-width: 240px;
          height: 32px;
          border-radius: 16px;
          outline: none;

          &::-webkit-media-controls-panel {
            background-color: #f5f5f5;
            border-radius: 16px;
          }

          &::-webkit-media-controls-play-button {
            background-color: #409eff;
            border-radius: 50%;
            margin-left: 8px;
          }

          &::-webkit-media-controls-timeline {
            background-color: #e4e7ed;
            border-radius: 2px;
            margin: 0 8px;
          }

          &::-webkit-media-controls-current-time-display,
          &::-webkit-media-controls-time-remaining-display {
            font-size: 12px;
            color: #666;
          }
        }
      }

                              // 操作列样式
      &:last-child {
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
      }
    }
  }
}

.drag-handle {
  user-select: none;
  color: #c0c4cc !important;
  font-size: 16px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

// 拖拽时的样式
.sortable-ghost {
  opacity: 0.6;
  background: #f0f9ff;
  transform: scale(1.02);
}

.sortable-chosen {
  background: #f0f9ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

// 空状态样式
.empty-state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border-radius: 8px;

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    p:first-child {
      font-size: 16px;
      color: #909399;
      margin: 0 0 8px 0;
    }

    p:last-child {
      font-size: 14px;
      color: #c0c4cc;
      margin: 0;
    }
  }
}

// 确保删除按钮样式正确
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

.custom-pagination {
  display: flex;
  justify-content: flex-end;
  margin: 16px 0 0 0;
  background: #fff;
  padding: 12px 20px;
  border-radius: 0 0 8px 8px;
}
</style>
