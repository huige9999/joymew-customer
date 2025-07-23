<template>
  <sub-page>
    <div class="messageverify-container">
      <main-card v-loading="isLoading">
        <card-top-info title="消息审核"> </card-top-info>
        <div class="switchControl rowContent flexGap rowGap">
          <div class="mItem">
            <span class="mKey">审核开关：</span>
            <el-switch v-model="checkSwitch" active-value="1" inactive-value="0" @change="handleCheckSwitch"> </el-switch>
          </div>
          <div class="mItem">
            <span class="mKey">自动刷新：</span>
            <el-switch v-model="autoRefreshData" active-value="1" inactive-value="0" @change="handleRreshSwitch"> </el-switch>
          </div>
        </div>
        <div class="messageTypeNav rowContent flexGap rowGap">
          <span class="mKey">消息类型：</span>
          <div class="messageTypeList flexGap">
            <el-badge
              :value="item.unReadSize"
              class="messageTypeItem"
              v-for="item in messageTypeList"
              :key="item.type"
              :hidden="item.unReadSize === 0"
              :class="{ active: item.type === activeMessageType }"
            >
              <span @click="chooseMessageType(item.type)">{{ item.name }}</span>
            </el-badge>
          </div>
        </div>
        <div class="verifyStatusNav rowContent rowGap">
          <div class="verifyStatusList">
            <div
              class="verifyStatusItem"
              v-for="item in verifyStatusList"
              :key="item.status"
              :class="{ active: item.status === activeVerifyStatus }"
              @click="chooseVerifyStatus(item.status)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="messageTableData rowGap">
          <div class="tableWrap">
            <div class="operateTop">
              <el-button type="success" size="mini" @click="multiPass">批量通过</el-button>
              <el-button type="danger" size="mini" @click="multiReject">批量拒绝</el-button>
              <el-button type="primary" size="mini" @click="handleRefresh">刷新</el-button>
            </div>
            <el-table
              :data="messageList"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
              v-show="activeMessageType === 1"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="wx_name" label="昵称" width="120"></el-table-column>
              <el-table-column prop="avator" label="头像" width="80">
                <template #default="{ row }"> <img :src="row.avator" class="avator-img" /> </template>
              </el-table-column>
              <el-table-column prop="content" label="内容"></el-table-column>
              <el-table-column prop="create_time" label="发送时间" width="180"> </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="handlePass(row)" v-show="activeVerifyStatus === 0">通过</el-button>
                  <el-button type="danger" size="mini" @click="handleReject(row)" v-show="activeVerifyStatus === 0">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="messageList"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
              v-show="activeMessageType === 2"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="wx_name" label="昵称" width="120"></el-table-column>
              <el-table-column prop="avator" label="头像" width="80">
                <template #default="{ row }"> <img :src="row.avator" class="avator-img" /> </template>
              </el-table-column>
              <el-table-column prop="content" label="内容"></el-table-column>

              <el-table-column prop="miaoGiftName" label="礼物名称"></el-table-column>
              <el-table-column prop="tpUrl" label="照片">
                <template #default="{ row }">
                  <img :src="row.tpUrl" class="tp-img" v-show="row.tpUrl" @click="previewTp(row.tpUrl)" />
                </template>
              </el-table-column>
              <el-table-column prop="create_time" label="发送时间" width="180"> </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="handlePass(row)" v-show="activeVerifyStatus === 0">通过</el-button>
                  <el-button type="danger" size="mini" @click="handleReject(row)" v-show="activeVerifyStatus === 0">拒绝</el-button>
                  <el-button type="success" size="mini" @click="handleResend(row)" v-show="activeVerifyStatus === 1 || activeVerifyStatus === 2">重新发送</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="getTableInfo"
                @current-change="getTableInfo"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="showCount"
                layout="total, sizes, prev, pager, next"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
/* eslint-disable no-undef */
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { reqGetMsgCheckBaseInfo, reqUpdateCheckSwitch, reqGetMsgChecList, reqHandleMsgChek, reqSendMsg } from '@/api/messageVerify';

export default {
  name: 'locationLimit',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      checkSwitch: '0',
      autoRefreshData: '0',
      messageTypeList: [
        {
          type: 1,
          name: '普通消息',
          unReadSize: 0,
        },
        {
          type: 2,
          name: '礼物消息',
          unReadSize: 0,
        },
      ],
      activeMessageType: 1,
      verifyStatusList: [
        {
          status: 0,
          name: '未审核',
        },
        {
          status: 1,
          name: '已通过',
        },
        {
          status: 2,
          name: '已拒绝',
        },
      ],
      activeVerifyStatus: 0,
      messageList: [
        // {
        //   id: '0',
        //   wx_name: '微信昵称',
        //   avator: 'https://img.yzcdn.cn/vant/cat.jpeg',
        //   content: '消息内容',
        //   create_time: '2019-12-12 12:12:12'
        // }
      ],
      total: 0,
      currentPage: 1,
      showCount: 10,
      isLoading: false,
      selectList: [],
    };
  },
  created() {
    this.getBaseInfo();
    this.getTableInfo();
  },
  beforeDestroy() {
    this.endLoopRefresh();
  },
  mounted() {},
  computed: {},
  methods: {
    formateDate(isoTime) {
      // 使用 Date 构造函数将其转换为 Date 对象
      const date = new Date(isoTime);
      // 获取年月日时分秒的数值
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      // 如果数值小于10，补0
      if (month < 10) month = `0${month}`;
      if (day < 10) day = `0${day}`;
      if (hour < 10) hour = `0${hour}`;
      if (minute < 10) minute = `0${minute}`;
      if (second < 10) second = `0${second}`;
      // 拼接成年月日时分秒的格式
      const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      // 返回结果
      return formattedTime;
    },
    handleSelectionChange(e) {
      console.log(e);
      this.selectList = e;
    },
    handlePass(row) {
      console.log(row);
      this.isLoading = true;
      reqHandleMsgChek(this.$store.state.liveId, row.id, 1)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('操作成功');
          this.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('操作失败');
        });
    },
    handleReject(row) {
      console.log(row);
      this.isLoading = true;
      reqHandleMsgChek(this.$store.state.liveId, row.id, 2)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('操作成功');
          this.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('操作失败');
        });
    },
    multiPass() {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择要通过的消息');
        return;
      }
      const tmpIds = this.selectList.map((item) => item.id);
      const tmpIdStr = tmpIds.join(',');
      this.isLoading = true;
      reqHandleMsgChek(this.$store.state.liveId, tmpIdStr, 1)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('操作成功');
          this.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('操作失败');
        });
    },
    multiReject() {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择要拒绝的消息');
        return;
      }
      const tmpIds = this.selectList.map((item) => item.id);
      const tmpIdStr = tmpIds.join(',');
      console.log(tmpIdStr);
      this.isLoading = true;
      reqHandleMsgChek(this.$store.state.liveId, tmpIdStr, 2)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('操作成功');
          this.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('操作失败');
        });
    },
    chooseMessageType(messageType) {
      this.activeMessageType = messageType;
      this.getTableInfo();
    },
    chooseVerifyStatus(verifyStatus) {
      this.activeVerifyStatus = verifyStatus;
      this.getTableInfo();
    },
    getBaseInfo() {
      this.isLoading = true;
      reqGetMsgCheckBaseInfo(this.$store.state.liveId)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.checkSwitch = res.data.check_switch;
          this.messageTypeList[0].unReadSize = parseInt(res.data.msgUnReadSize, 10);
          this.messageTypeList[1].unReadSize = parseInt(res.data.giftUnReadSize, 10);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    getTableInfo() {
      this.isLoading = true;
      reqGetMsgChecList(this.$store.state.liveId, this.activeMessageType, this.activeVerifyStatus, this.currentPage, this.showCount)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.total = res.data.totalResult;
          this.messageList = res.data.list.map((item) => {
            return {
              ...item,
              create_time: this.formateDate(item.create_time),
            };
          });
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    handleCheckSwitch() {
      console.log(this.checkSwitch);
      this.isLoading = true;
      reqUpdateCheckSwitch(this.$store.state.liveId, this.checkSwitch)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('操作成功');
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('操作失败');
        });
    },
    handleRefresh() {
      this.currentPage = 1;
      this.showCount = 10;
      this.getBaseInfo();
      this.getTableInfo();
    },
    startLoopRefresh() {
      if (this.timer) {
        return;
      }
      this.timer = setInterval(() => {
        this.handleRefresh();
      }, 5000);
    },
    endLoopRefresh() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    handleRreshSwitch() {
      if (this.autoRefreshData === '1') {
        this.startLoopRefresh();
      } else {
        this.endLoopRefresh();
      }
    },
    previewTp(tpUrl) {
      // 跳转预览图片
      window.open(tpUrl, '_blank');
    },
    handleResend(row) {
      this.isLoading = true;
      reqSendMsg(this.$store.state.liveId, row.id)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.rowContent {
  padding: 0 40px;
  display: flex;
  align-items: center;
}
.flexGap {
  gap: 40px;
}
.rowGap {
  margin-bottom: 20px;
}
.mItem {
  display: flex;
  align-items: center;
}
.mKey {
  font-size: 16px;
  color: #303133;
}
.messageTypeList {
  display: flex;
  .messageTypeItem {
    font-size: 16px;
    cursor: pointer;
    height: 27px;
    &.active {
      color: #4886ff;
      border-bottom: 1px solid #4886ff;
    }
  }
}
.verifyStatusList {
  width: 212px;
  height: 28px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 16px;
  color: #303133;
  display: flex;
  .verifyStatusItem {
    cursor: pointer;
    flex: 1;
    text-align: center;
    line-height: 28px;
    border-left: 1px solid #c4c4c4;
    &:nth-child(1) {
      border-left: 0;
      border-radius: 4px 0 0 4px;
    }
    &.active {
      color: #fff;
      background-color: #4886ff;
      border-color: #4886ff;
    }
  }
}
.messageTableData {
  padding: 0 40px;
  .tableWrap {
    border: 1px solid #dfe6ec;
    padding: 20px;
    .operateTop {
      margin-bottom: 20px;
    }
  }
}
.avator-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.tp-img {
  width: 80px;
  height: 40px;
  cursor: pointer;
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
