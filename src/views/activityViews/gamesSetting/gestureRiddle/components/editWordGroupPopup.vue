<!--
  * @Description: 「你划我猜」编辑词组弹窗
  * @Author: Ruan Jiazhen
  * @Date: 2023-12-19
-->
<template>
  <el-dialog
    title="编辑词组"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="form"
      label-width="80px"
    >
      <el-form-item
        label="词组名称"
        prop="title"
      >
        <el-input
          v-model="form.title"
          maxlength="4"
          show-word-limit
          placeholder="请输入词组类别"
        />
      </el-form-item>
      <el-form-item
        label="词组内容"
        prop="content"
      >
        <div class="content">
          <div
            class="content-list"
            id="contentList"
          >
            <div
              class="item"
              v-for="(item, index) in form.contentList"
              :key="index"
            >
              <span>{{ item }}</span>
              <i
                class="el-icon-close"
                @click="deleteItem(index)"
              ></i>
            </div>
            <el-button
              type="text"
              size="small"
              @click="deleteAll"
              :disabled="form.contentList.length === 0"
            >
              删除全部 ({{ form.contentList.length }}/{{ maxContentLength }})
            </el-button>
          </div>
          <el-input
            class="input"
            v-model="newContentItem"
            :disabled="form.contentList.length >= maxContentLength"
            :placeholder="form.contentList.length >= maxContentLength ? '最多添加100个词语' : '请输入词语，多个词语用逗号分隔'"
            @keyup.enter.native="addContentItem"
            @input="checkInput"
          />
          <el-button
            type="primary"
            size="small"
            class="add-btn"
            @click="addContentItem"
          >
            添加
          </el-button>
          <div
            class="input-tips"
            :class="isError ? 'error' : ''"
          >
            <span>单个词语最多6个字，不能为空</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="danger"
        @click="clickReset"
      >
        重置为默认
      </el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="clickSave"
      >
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'editWordGroupPopup',
  props: {
    wordGroupInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: { title: '', contentList: [] },
      dialogVisible: false,
      maxContentLength: 200,
      newContentItem: '',
      splitReg: /[,，]/,
      isError: false,
    };
  },
  watch: {
    wordGroupInfo: {
      handler() {
        this.form = _.cloneDeep(this.wordGroupInfo);
      },
      deep: true,
    },
  },
  methods: {
    open() {
      this.dialogVisible = true;
      this.scrollToBottom();
    },
    close() {
      this.dialogVisible = false;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const contentList = document.getElementById('contentList');
        contentList.scrollTop = contentList.scrollHeight;
      });
    },
    deleteItem(index) {
      this.form.contentList.splice(index, 1);
    },
    async deleteAll() {
      try {
        await this.$confirm('确定删除全部词组内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        this.form.contentList = [];
      } catch (error) {
        if (error !== 'cancel') this.$message.error('删除失败');
      }
    },
    addContentItem() {
      const inputContentList = this.newContentItem
        .split(this.splitReg)
        .map((item) => item.trim())
        .filter((item) => item !== '');
      const contentListSet = new Set([...this.form.contentList, ...inputContentList]);
      this.form.contentList = [...contentListSet].slice(0, 100);
      this.newContentItem = '';
      this.scrollToBottom();
    },
    checkInput() {
      const inputContentList = this.newContentItem.split(this.splitReg);
      const lastInput = inputContentList[inputContentList.length - 1];
      const sliceEnd = this.newContentItem.length - lastInput.length + 6;
      if (lastInput.length > 6) {
        this.newContentItem = this.newContentItem.slice(0, sliceEnd);
        this.isError = true;
      } else {
        this.isError = false;
      }
    },
    clickReset() {
      this.$emit('reset');
    },
    clickSave() {
      this.$emit('save', this.wordGroupInfo.title, this.form);
    },
  },
};
</script>

<style scoped lang="less">
.content {
  display: grid;
  grid-template:
    'content-list content-list' min-content
    'input input' min-content
    'add-btn tips' min-content
    / min-content 1fr;
  grid-gap: 10px;

  .content-list {
    grid-area: content-list;

    max-height: 200px;
    overflow-y: auto;

    // 滚动条调细
    &::-webkit-scrollbar {
      width: 5px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background: #b1b1b1;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;

    .item {
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;

      line-height: 1;
      span {
        margin-right: 10px;
      }
      i {
        cursor: pointer;
      }
    }
  }

  .input {
    grid-area: input;
    width: 100%;
  }

  .add-btn {
    grid-area: add-btn;
  }

  .input-tips {
    grid-area: tips;
    color: #999;

    &.error {
      color: #f56c6c;
    }
  }
}
</style>
