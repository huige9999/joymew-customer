<template>
  <div class="screenPhotoOrder">
    <el-dialog
      :visible.sync="screenPhotoOrderVisible"
      :close-on-click-modal="false"
      title="照片顺序调整"
      class="elDialog"
      width="1000px"
      v-loading="isLoading"
    >
      <div class="dialogContent">
        <draggable :list="screenBgOrders" class="list-group" ghost-class="ghost">
          <div class="list-group-item" v-for="item in screenBgOrders" :key="item.id">
            <img :src="item.url" class="itemImg" />
          </div>
        </draggable>
      </div>
      <template #footer>
        <div class="btnGroup">
          <div class="btn cancel" @click="onCancel">取消</div>
          <div class="btn confirm" @click="onConfirm">确定</div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { setBgImgSort } from '@/api/setting/whiteList';
import draggable from 'vuedraggable';

export default {
  name: 'screenPhotoOrder',
  data() {
    return {
      isLoading: false,
      screenPhotoOrderVisible: false,
      screenBgOrders: [],
    };
  },
  watch: {
    screenPhotoOrderVisible(newVal) {
      // 弹窗关闭要通知父级将子组件的dom删除
      if (!newVal) {
        this.$emit('onScreenPhotoOrderDialogClose');
      }
    },
  },
  props: {
    screenBgList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    draggable,
  },
  created() {},
  mounted() {
    this.screenBgOrders = this.screenBgList.map((item) => ({
      id: item.id,
      url: item.url,
    }));
    console.log('初始化screenBgOrders:', this.screenBgOrders);
  },
  methods: {
    onCancel() {
      this.screenPhotoOrderVisible = false;
    },
    onConfirm() {
      console.log('改变后的screenBgOrders:', this.screenBgOrders);
      this.isLoading = true;
      // 1、将this.screenBgOrders转成json字符串存到服务端
      setBgImgSort(this.$store.state.liveId, this.screenBgOrders)
        .then(() => {
          // 提示设置成功
          this.$message.success('设置成功');
          // 2、通知父组件调用接口更新screenBgList的展示顺序
          this.$emit('refreshScreenBgList');
          this.screenPhotoOrderVisible = false;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          // 提示设置失败
          this.$message.error('设置失败');
          this.isLoading = false;
        });
    },
    openDialog() {
      this.screenPhotoOrderVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.elDialog::v-deep {
  .el-dialog__header {
    text-align: center;
  }
}
.dialogContent::v-deep {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  overflow-y: auto;
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 5px;
  }
  .itemImg {
    width: 80px;
    height: 80px;
  }
}
.btnGroup {
  display: flex;
  justify-content: center;
  gap: 24px;
  .btn {
    width: 68px;
    height: 38px;
    border-radius: 2px;
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.confirm {
      background: #249aff;
      color: #ffffff;
    }
    &.cancel {
      background: #f2f3f5;
      color: #1d2129;
    }
  }
}

.screenPhotoOrder::v-deep {
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.9);
    position: fixed;
  }
}
</style>
