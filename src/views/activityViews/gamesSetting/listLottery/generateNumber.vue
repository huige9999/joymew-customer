<template>
  <my-dialog :show="dialogVisible">
    <div class="addUser-dialog-container">
      <div
        class="add-user-title"
        slot="title"
      >
        <div class="text">生成数字</div>
      </div>
      <div class="form-box">
        <div
          class="username"
          v-for="(item, index) in rangeList"
          :key="index"
        >
          <div class="title">范围：</div>
          <el-input
            v-model="item.start"
            placeholder="请输入"
            size="small"
          >
            {{ item.start }}
          </el-input>
          <div
            class="title"
            style="width: 100px; text-align: center"
          >
            到
          </div>
          <el-input
            v-model="item.end"
            placeholder="请输入"
            size="small"
          >
            {{ item.end }}
          </el-input>
          <el-checkbox
            v-model="item.isRemove4"
            style="margin-left: 10px"
            true-label="1"
            false-label="0"
          >
            去除数字4
          </el-checkbox>
          <el-checkbox
            v-model="item.isRemove3"
            true-label="1"
            false-label="0"
          >
            去除数字3
          </el-checkbox>
          <el-checkbox
            v-model="item.isRemove7"
            true-label="1"
            false-label="0"
          >
            去除数字7
          </el-checkbox>
        </div>
        <div
          class="addUserBtn"
          @click="addRange"
        >
          <span
            class="el-icon-plus"
            style="margin-right: 10px"
          ></span>
          新增范围
        </div>
        <div
          class="btn-group"
          style="padding-left: 145px"
        >
          <el-button
            type="primary"
            @click="confirm"
          >
            确定
          </el-button>
          <el-button
            type="info"
            @click="cancel"
            style="margin-left: 20px"
          >
            取消
          </el-button>
        </div>
      </div>
    </div>
  </my-dialog>
</template>
<script>
import { reqGenerateNumber } from '@/api/gameSetting/index';
import myDialog from '@/components/myDialog';

export default {
  data() {
    return {
      dialogVisible: false,
      rangeList: [
        {
          start: '0',
          end: '0',
          isRemove4: '0',
          isRemove3: '0',
          isRemove7: '0',
        },
      ],
      rangeItem: {
        start: '0',
        end: '0',
        isRemove4: '0',
        isRemove3: '0',
        isRemove7: '0',
      },
    };
  },
  components: {
    myDialog,
  },
  methods: {
    async confirm() {
      // 1. rangeList数据校验
      if (!this.validateRangeList()) {
        return;
      }
      console.log(this.rangeList);
      // 2. 提交rangeList到服务端
      await reqGenerateNumber(this.rangeList);
      // 3. 重置rangeList并关闭弹窗
      this.cancel();
      // 4. 通知父组件刷新列表
      this.$emit('refreshList');
    },
    cancel() {
      this.resetRangeList();
      this.hideDialog();
    },
    addRange() {
      const newItem = { ...this.rangeItem };
      this.rangeList.push(newItem);
    },
    showDialog() {
      this.dialogVisible = true;
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    /**
     * 重置rangeList
     */
    resetRangeList() {
      const newItem = { ...this.rangeItem };
      this.rangeList = [newItem];
    },
    /**
     * 规则：
     * 每一项的start和end必须是整数数字
     * 每一项的范围不能超过10000
     * 各项的start和end范围不能交错
     *
     */
    validateRangeList() {
      const { rangeList } = this;
      let isValid = true;
      for (let i = 0; i < rangeList.length; i++) {
        const item = rangeList[i];
        const start = parseInt(item.start, 10);
        const end = parseInt(item.end, 10);
        // 判断是否为数字
        if (Number.isNaN(start) || Number.isNaN(end)) {
          isValid = false;
          this.$message.error(`第${i + 1}项范围必须为数字`);
          break;
        }
        // 判断整数
        if (start !== Math.floor(start) || end !== Math.floor(end)) {
          isValid = false;
          this.$message.error(`第${i + 1}项范围必须为整数`);
          break;
        }
        // 判断范围开始和结束值有问题
        if (start >= end || start < 0) {
          isValid = false;
          this.$message.error(`第${i + 1}项输入有误`);
          break;
        }

        if (end - start > 10000) {
          isValid = false;
          this.$message.error(`第${i + 1}项范围不能超过10000`);
          break;
        }
        // 判断范围是否交错
        if (i > 0 && start <= rangeList[i - 1].end) {
          isValid = false;
          this.$message.error('各项之间范围不能交错');
          break;
        }
      }
      return isValid;
    },
  },
};
</script>
<style lang="less" scoped>
.addUser-dialog-container {
  padding-bottom: 50px;

  .add-user-title {
    display: flex;
    align-items: center;

    .text {
      margin-left: 20px;
      font-size: 25px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #42474e;
    }
  }

  .form-box {
    > div {
      display: flex;
      align-items: center;
      margin-top: 30px;

      .title {
        width: 100px;
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
      }
    }
  }

  .addUserBtn {
    color: #1e87f0;
    width: 96%;
    margin: 30px auto;
    height: 29px;
    border: 1px dashed #1e87f0;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }
}
</style>
