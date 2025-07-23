<!--
  * @Description: 「转盘抽奖」游戏设置
  * @Author: Ruan Jiazhen
  * @Date: 2023-12-06
-->
<template>
  <div class="container">
    <card-top-info
      title="转盘抽奖"
      class="title"
    />
    <!-- 模式开关 -->
    <div class="mode-switch">
      <span class="mode-switch-text">高级模式</span>
      <el-switch
        class="mode-switch-btn"
        v-model="isAdvancedMode"
        active-color="#F7A120"
        @change="handleSave(true)"
      />
    </div>
    <!-- 奖品表格 -->
    <div class="prize-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        max-height="450px"
        @cell-mouse-enter="handleShowDragIcon"
        @cell-mouse-leave="handleHideDragIcon"
        @selection-change="handleSelectionChange"
      >
        <!-- TODO 暂时删除拖拽列，待后续实现 -->
        <el-table-column
          width="36px"
          align="right"
          v-if="false"
        >
          <template slot-scope="scope">
            <i
              v-show="scope.row.isShowDragIcon"
              class="el-icon-sort drag-icon"
            ></i>
          </template>
        </el-table-column>
        <!-- 选择列 -->
        <el-table-column
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column
          label="奖品信息"
          min-width="150px"
        >
          <template slot-scope="scope">
            <div class="prize-info">
              <div class="prize-img">
                <img
                  :src="scope.row.prizeImg"
                  alt=""
                  class="img"
                />
                <img
                  src="@/assets/image/wheelLottery/cover.png"
                  class="cover"
                />
                <input
                  class="input"
                  type="file"
                  accept="image/jpg,image/jpeg,image/png"
                  @change="handleSelectImg($event, scope.row)"
                />
              </div>
              <div class="prize-name">
                <el-input
                  v-if="scope.row.isInputPrizeName"
                  :ref="`prizeNameInput-${scope.$index}`"
                  type="text"
                  maxlength="8"
                  show-word-limit
                  v-model="scope.row.prizeName"
                  @blur="handleEdit(scope.row, 'isInputPrizeName', false)"
                />
                <div
                  class="prize-name-text"
                  v-else
                  @click="handleEdit(scope.row, 'isInputPrizeName', true, scope.$index)"
                >
                  {{ scope.row.prizeName }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAdvancedMode"
          label="奖品数量"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div class="prize-probability">
              <el-input-number
                size="mini"
                v-model="scope.row.prizeCount"
                :min="1"
                :max="999999"
                :step="1"
                step-strictly
                @change="updateProbabilityWithCount"
              ></el-input-number>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAdvancedMode"
          label="中奖概率（%）"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="totalProbability === targetTotalProbability"
              content="中奖概率总和必须为100"
              placement="top"
            >
              <el-input-number
                :class="totalProbability !== targetTotalProbability ? 'error' : ''"
                size="mini"
                :value="scope.row.probability / 10"
                :min="0"
                :max="100"
                :step="0.1"
                step-strictly
                :precision="1"
                @change="handleProbabilityChange($event, scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="50px"
        >
          <template slot-scope="scope">
            <div class="action">
              <span
                class="delete"
                @click="handleDelete(scope.row)"
              >
                删除
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="prize-table-footer">
        <el-checkbox
          class="check-box"
          :value="multipleSelection.length === tableData.length && tableData.length > 0"
          :disabled="tableData.length === 0"
          @change="toggleAllSelection"
        >
          全选
        </el-checkbox>
        <span
          class="delete"
          :class="{ disabled: multipleSelection.length === 0 }"
          @click="handleDeleteAll"
        >
          删除
        </span>
        <span class="selected-count">
          已选奖品
          <i>{{ multipleSelection.length }}</i>
          项/共{{ tableData.length }}项
        </span>
        <el-tooltip
          :disabled="tableData.length < prizeItemLimit"
          content="最多添加12个奖品"
          placement="top"
        >
          <el-button
            class="add-prize-btn"
            type="primary"
            @click="handleAdd"
            icon="el-icon-plus"
            :disabled="tableData.length >= prizeItemLimit"
            :class="tableData.length >= prizeItemLimit ? 'disabled' : ''"
          >
            添加奖品
          </el-button>
        </el-tooltip>
        <el-button
          :type="saveBtn.type"
          @click="handleSave"
          :loading="saveBtn.loading"
          :icon="saveBtn.icon"
          :disabled="totalProbability !== targetTotalProbability"
        >
          保存
        </el-button>
      </div>
    </div>

    <el-dialog
      class="cropper-dialog"
      :visible.sync="cropImg.length > 0"
      title="裁剪图片"
    >
      <div class="dialog-body">
        <div class="cropper-container">
          <VueCropper
            class="cropper"
            :img="cropImg"
            ref="cropper"
            :outputSize="1"
            :canScale="false"
            fixed
            :fixedNumber="[1, 1]"
            :autoCropWidth="100"
            :autoCropHeight="100"
            centerBox
            autoCrop
            mode="cover"
            fillColor="#ffffff"
          />
        </div>
      </div>
      <span
        class="dialog-btn"
        slot="footer"
      >
        <el-button
          size="mini"
          @click="cropImg = ''"
        >
          取消
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleConfirmCrop"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cardTopInfo from '@/components/cardTopInfo.vue';
import { reqGetWheel, reqUpdateWheel } from '@/api/setting/activitySetting/gameSetting';
import { DEFAULT_PRIZE_IMG } from '@/assets/constant/default';
import VueCropper from 'vue-cropper';
import { uploadImage } from '@/api/app/upload';
import { mapState } from 'vuex';

export default {
  components: { cardTopInfo, VueCropper },
  name: 'wheelLottery',
  data() {
    return {
      targetTotalProbability: 1000,
      tableData: [],
      prizeItemLimit: 12,
      isAdvancedMode: false,
      multipleSelection: [],
      cropImg: '',
      cropImgRow: null,
      isInitFinished: false,
      wheelId: 0,
      saveBtn: {
        type: 'primary',
        loading: false,
        icon: 'el-icon-check',
      },
    };
  },
  computed: {
    ...mapState({
      liveId: (state) => state.liveId,
    }),
    totalProbability() {
      return this.tableData.reduce((acc, cur) => acc + cur.probability, 0);
    },
  },
  watch: {
    'tableData.length': function fn() {
      if (!this.isInitFinished) return;
      this.updateProbabilityWithCount();
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const { liveId } = this.$store.state;
      const res = await reqGetWheel(liveId);
      this.isAdvancedMode = res.data.type === '2';
      this.tableData = res.data.awardList.map((item) => ({
        isShowDragIcon: false,
        prizeImg: item.award_picture,
        prizeName: item.award_name,
        isInputPrizeName: false,
        probability: item.award_chance,
        prizeCount: item.award_init_number,
        isInputPrizeCount: false,
      }));
      this.wheelId = res.data.id;
      this.$nextTick(() => {
        this.isInitFinished = true;
      });
    },
    // 显示拖拽图标
    handleShowDragIcon(row) {
      this.$set(row, 'isShowDragIcon', true);
    },
    // 隐藏拖拽图标
    handleHideDragIcon(row) {
      this.$set(row, 'isShowDragIcon', false);
    },
    // 切换编辑状态
    handleEdit(row, flagName, isInput, refIndex = 0) {
      this.$set(row, flagName, isInput);
      if (isInput) {
        this.$nextTick(() => {
          this.$refs[`prizeNameInput-${refIndex}`].focus();
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleAllSelection() {
      if (this.multipleSelection.length === this.tableData.length) {
        this.$refs.multipleTable.clearSelection();
      } else {
        this.$refs.multipleTable.toggleAllSelection();
      }
    },
    handleAdd() {
      this.tableData.push({
        isShowDragIcon: false,
        prizeImg: DEFAULT_PRIZE_IMG,
        prizeName: '新增奖品',
        isInputPrizeName: false,
        probability: Math.max(0, this.targetTotalProbability - this.totalProbability),
        prizeCount: 1,
        isInputPrizeCount: false,
      });
    },
    handleSelectImg(e, row) {
      const file = e.target.files[0];
      e.target.value = '';
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.cropImg = event.target.result;
      };
      this.cropImgRow = row;
    },
    async handleConfirmCrop() {
      const img = await new Promise((resolve) => {
        this.$refs.cropper.getCropBlob((data) => {
          resolve(data);
        });
      });
      const formData = new FormData();
      formData.append('file', img);
      // TODO 上传的图片默认都是没后缀的，后续看如何处理成jpg后缀的
      const res = await uploadImage(formData);
      if (!res.data.filePath) {
        this.$message.error('图片上传失败');
        return;
      }
      this.$set(this.cropImgRow, 'prizeImg', res.data.filePath);
      this.cropImg = '';
      this.cropImgRow = null;
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定删除该奖品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const index = this.tableData.findIndex((item) => item === row);
        this.tableData.splice(index, 1);
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    async handleDeleteAll() {
      if (this.multipleSelection.length === 0) {
        return;
      }
      try {
        await this.$confirm('确定删除所选奖品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        this.tableData = this.tableData.filter((item) => !this.multipleSelection.includes(item));
        this.multipleSelection = [];
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    updateProbabilityWithCount() {
      const totalCount = this.tableData.reduce((acc, cur) => acc + cur.prizeCount, 0);
      const sortedTableData = this.tableData.slice().sort((a, b) => a.prizeCount - b.prizeCount);

      // XXX 有可能出现数量相同，但是概率不同，甚至差别很大的情况，后续有好的方法可替换
      sortedTableData.forEach((item, index) => {
        if (index === sortedTableData.length - 1) {
          const prevTotalProbability = sortedTableData.slice(0, -1).reduce((acc, cur) => acc + cur.probability, 0);
          item.probability = Math.max(0, this.targetTotalProbability - prevTotalProbability);
          return;
        }
        item.probability = Math.round((item.prizeCount / totalCount) * 1000);
      });
    },
    handleProbabilityChange(event, row) {
      row.probability = event * 10;
    },
    checkData() {
      if (this.tableData.length === 0) {
        return {
          isValid: false,
          msg: '请添加奖品',
        };
      }

      if (this.tableData.some((item) => item.prizeName === '')) {
        return {
          isValid: false,
          msg: '奖品名称不能为空',
        };
      }

      if (this.tableData.some((item) => !item.prizeImg)) {
        return {
          isValid: false,
          msg: '请上传奖品图片',
        };
      }

      if (this.isAdvancedMode) {
        if (this.totalProbability !== this.targetTotalProbability) {
          return {
            isValid: false,
            msg: '中奖概率总和必须为100',
          };
        }
      }

      return {
        isValid: true,
      };
    },
    async handleSave(event, isChangeMode = false) {
      const { isValid, msg } = this.checkData();
      if (!isValid) {
        if (isChangeMode) return;
        this.$message.error(msg);
        return;
      }
      const params = {
        splid: this.liveId,
        type: this.isAdvancedMode ? '2' : '1',
        awardInfo: this.tableData.map((item) => ({
          awardPicture: item.prizeImg,
          awardName: item.prizeName,
          awardChance: item.probability,
          awardSaveNumber: item.prizeCount,
        })),
      };
      this.saveBtn.loading = true;

      // 延迟最少2s
      const [res] = await Promise.all([
        reqUpdateWheel(params),
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 800);
        }),
      ]);
      this.saveBtn.loading = false;

      if (res.code !== 200) {
        this.$message.error(res.msg || '修改失败，请稍后再试');

        this.saveBtn.type = 'danger';
        this.saveBtn.icon = 'el-icon-close';

        setTimeout(() => {
          this.saveBtn.type = 'primary';
          this.saveBtn.icon = 'el-icon-check';
        }, 2000);
        return;
      }
      this.$message({
        message: '修改成功',
        type: 'success',
      });
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 20px;

  background: #fff;
  box-shadow: 2px 3px 9px 0 rgba(119, 119, 119, 0.1);
  border-radius: 4px;

  display: grid;
  grid-template:
    'title switch' min-content
    '. .' 16px
    'table table' 1fr
    e('/') 1fr 120px;
  .title {
    grid-area: title;
  }
  .mode-switch {
    grid-area: switch;
    display: flex;
    align-items: center;
    .mode-switch-text {
      margin-right: 10px;
    }

    .mode-switch-btn {
      display: inline-block;
    }
  }
  .prize-table {
    grid-area: table;
    width: 100%;

    .drag-icon {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
    .prize-info {
      display: flex;
      align-items: center;
      .prize-img {
        position: relative;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        &:hover {
          .cover {
            display: block;
          }
        }

        .input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;

          cursor: pointer;
        }
      }
      .prize-name {
        height: 100%;
        flex: 1;

        ::v-deep input {
          font-family: 'PingFangSC-Regular', 'Microsoft Yahei', sans-serif;
        }
        .el-input {
          width: 100%;
        }

        .prize-name-text {
          position: relative;
          width: 100%;
          height: 40px;

          margin-left: 15px;
          line-height: 40px;
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          cursor: pointer;
          font-family: 'PingFangSC-Regular', 'Microsoft Yahei', sans-serif;
        }
      }
    }

    .error {
      ::v-deep input {
        border-color: #f56c6c;
      }
    }

    .action {
      display: flex;
      align-items: center;
      .delete {
        font-size: 12px;
        color: #f56c6c;
        cursor: pointer;
      }
    }

    // TODO 将各元素对齐
    .prize-table-footer {
      margin-top: 20px;

      padding-left: 20px;
      display: flex;
      align-items: center;

      .delete {
        margin-left: 10px;
        color: #ff4949;
        cursor: pointer;
        vertical-align: middle;

        &.disabled {
          color: #c0c4cc;
          cursor: not-allowed;
        }
      }
      .selected-count {
        margin-left: 14px;
        vertical-align: middle;
        i {
          font-size: 20px;
          color: #f79f20;
          font-style: normal;
        }
      }
      .add-prize-btn {
        margin-left: auto;
        display: inline-block;
        background-color: #f7a120;
        border-color: #f7a120;

        &.disabled {
          background-color: #ffdca8;
          border-color: #ffdca8;
        }
      }
    }
  }

  .cropper-dialog {
    .dialog-body {
      width: 100%;
      display: flex;
      justify-content: center;

      .cropper-container {
        width: 200px;
        height: 200px;
      }
    }
  }
}
</style>
