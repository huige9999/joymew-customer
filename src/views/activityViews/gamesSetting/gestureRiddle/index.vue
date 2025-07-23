<!--
  * @Description: 「你划我猜」游戏设置
  * @Author: Ruan Jiazhen
  * @Date: 2023-12-19
-->
<template>
  <div>
    <div class="container">
      <card-top-info
        title="你划我猜"
        class="title"
      />
      <el-table
        class="table"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="title"
          label="词组类别"
          min-width="100"
        />
        <el-table-column
          prop="number"
          label="个数"
          min-width="50"
        />
        <el-table-column
          prop="nature"
          label="词组性质"
          min-width="100"
        />
        <el-table-column
          prop="operation"
          label="操作"
          width="70"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-edit-outline operation-btm"
              @click="handleEdit(scope.row.title)"
            ></i>
            <i
              class="el-icon-refresh operation-btm"
              @click="handleReset(scope.row.title)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="game-time">
        <span>游戏时间：</span>
        <el-input-number
          :value="gameInfo.gameTime"
          :min="1"
          :max="999"
          :step="1"
          size="small"
          @change="handleGameTimeChange"
        />
        <span>&nbsp;秒</span>
      </div>
      <el-button
        class="reset"
        type="danger"
        @click="handleResetAll"
      >
        重置所有词组
      </el-button>
    </div>
    <edit-word-group-popup
      ref="editWordGroupPopup"
      :wordGroupInfo="editWordGroupInfo"
      @reset="handleReset(editWordGroupInfo.title)"
      @save="handleSave"
    />
  </div>
</template>

<script>
import cardTopInfo from '@/components/cardTopInfo.vue';
import _ from 'lodash';
import {
  reqEditGestureRiddle,
  reqGetGestureRiddle,
  reqResetAllWordGroup,
  reqResetSingleWordGroup,
} from '@/api/setting/activitySetting/gameSetting';
import { mapState } from 'vuex';
import editWordGroupPopup from './components/editWordGroupPopup.vue';

export default {
  components: { cardTopInfo, editWordGroupPopup },
  name: 'wheelLottery',
  data() {
    const tableData = [];
    const editWordGroupInfo = {
      title: '',
      contentList: [],
    };
    const gameInfo = {
      wordGroupList: [],
      gameTime: 120,
    };
    return {
      tableData,
      editWordGroupInfo,
      gameInfo,
    };
  },
  computed: {
    ...mapState({
      liveId: (state) => state.liveId,
    }),
  },
  created() {
    this.getGameInfo();
  },
  methods: {
    // 获取游戏信息
    async getGameInfo() {
      const res = await reqGetGestureRiddle(this.liveId);
      this.gameInfo = {
        wordGroupList: res.data.rowGuessList.map((item) => ({
          title: item.typeName,
          contentList: item.typeValue.map((item) => item.name),
          status: item.status,
        })),
        gameTime: res.data.gameTime,
      };
      const natureMap = {
        1: '系统随机',
        2: '已修改',
      };
      this.tableData = this.gameInfo.wordGroupList.map((item) => ({
        title: item.title,
        number: item.contentList.length,
        nature: natureMap[item.status],
      }));
    },
    openEditWordGroupPopup() {
      this.$refs.editWordGroupPopup.open();
    },
    handleEdit(title) {
      this.editWordGroupInfo = {
        title,
        contentList: this.gameInfo.wordGroupList.find((item) => item.title === title).contentList,
      };
      this.openEditWordGroupPopup();
    },
    async handleReset(title) {
      try {
        await this.$confirm('确定要重置该词组吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const index = this.gameInfo.wordGroupList.findIndex((item) => item.title === title);

        const res = await reqResetSingleWordGroup(this.liveId, index);

        if (res.code !== 200) {
          this.$message.error(res.msg || '重置失败，请重试');
          return;
        }

        this.$message({
          message: '重置成功',
          type: 'success',
        });

        this.getGameInfo();
        this.editWordGroupInfo = {
          title,
          contentList: this.gameInfo.wordGroupList.find((item) => item.title === title).contentList,
        };
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    async handleSave(oldTitle, form) {
      try {
        const res = await reqEditGestureRiddle(this.liveId, {
          oldTitle,
          newTitle: form.title === oldTitle ? oldTitle : form.title,
          contentList: form.contentList,
        });

        if (res.code !== 200) {
          this.$message.error(res.msg || '保存失败，请重试');
          return;
        }

        this.$message({
          message: '保存成功',
          type: 'success',
        });
        this.getGameInfo();
        this.$refs.editWordGroupPopup.close();
      } catch (e) {
        console.error(e);
      }
    },
    editGameTime: _.debounce(async function fn(newVal) {
      try {
        const res = await reqEditGestureRiddle(this.liveId, {
          gameTime: newVal,
        });
        if (res.code !== 200) {
          this.$message.error(res.msg || '游戏时间修改失败，请重试');
          return;
        }

        this.$message({
          message: '游戏时间修改成功',
          type: 'success',
        });
      } catch (e) {
        console.error(e);
      }
    }, 500),
    handleGameTimeChange(val) {
      if (val === this.gameInfo.gameTime) return;

      this.gameInfo.gameTime = val;
      this.editGameTime(val);
    },
    async handleResetAll() {
      try {
        await this.$confirm('确定要重置所有词组吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const res = await reqResetAllWordGroup(this.liveId);

        if (res.code !== 200) {
          this.$message.error(res.msg || '重置失败，请重试');
          return;
        }

        this.getGameInfo();
        this.$refs.editWordGroupPopup.close();

        this.$message.success('重置成功');
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('重置失败');
        }
      }
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
    'title title' min-content
    'table game-time' min-content
    'table reset' 1fr
    e('/') 1fr 240px;
  grid-gap: 20px;

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

  .table {
    grid-area: table;

    .operation-btm {
      cursor: pointer;

      font-size: 16px;
      color: #409eff;

      &:nth-child(2) {
        margin-left: 10px;
        color: #f56c6c;
      }
    }
  }

  .game-time {
    grid-area: game-time;

    color: #606266;

    display: flex;
    align-items: center;
  }

  .reset {
    grid-area: reset;
    align-self: flex-end;

    width: 130px;
    height: 40px;
  }
}
</style>
