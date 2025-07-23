<!-- 婚礼堂获取手机号服务管理界面  -->
<template>
  <div class="container">
    <div class="title">
      获取手机号
    </div>
    <div class="tip">
      <img src="@/assets/icons/yj-dz/loudspeaker.png" alt="tip" class="icon" />
      <!-- XXX 用来支撑起盒子高度的透明文字 -->
      <span class="right" style="opacity: 0;">
        根据微信最新政策，微信小程序授权手机号组件自8月26日起需按次付费使用，费用为0.03元/次，为避免无法获取到用户手机号，您需要提前充值金额
      </span>
      <el-carousel class="right" direction="vertical">
        <!-- XXX 之所以多复制一份，是因为el-carousel-item数量为2时滚动方向有问题 -->
        <el-carousel-item class="right-text">
          <span>
            根据微信最新政策，微信小程序授权手机号组件自8月26日起需按次付费使用，费用为0.03元/次，为避免无法获取到用户手机号，您需要提前充值金额
          </span>
        </el-carousel-item>
        <el-carousel-item v-if="useInfo.available < 1000" class="right-text">
          <span> 您获取用户手机号的次数仅剩{{ useInfo.available }}次，请及时充值，避免因此影响业务 </span>
        </el-carousel-item>
        <el-carousel-item v-if="useInfo.available < 1000" class="right-text">
          <span>
            根据微信最新政策，微信小程序授权手机号组件自8月26日起需按次付费使用，费用为0.03元/次，为避免无法获取到用户手机号，您需要提前充值金额
          </span>
        </el-carousel-item>
        <el-carousel-item v-if="useInfo.available < 1000" class="right-text">
          <span> 您获取用户手机号的次数仅剩{{ useInfo.available }}次，请及时充值，避免因此影响业务 </span>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 次数统计 -->
    <div class="count-panel">
      <div class="count-panel-item purchased">
        <div class="count-panel-item-count">{{ useInfo.purchased }}</div>
        <div class="count-panel-item-title">已购买次数</div>
      </div>
      <div class="count-panel-item used">
        <div class="count-panel-item-count">{{ useInfo.used }}</div>
        <div class="count-panel-item-title">已使用次数</div>
      </div>
      <div class="count-panel-item available">
        <div class="count-panel-item-count">{{ useInfo.available }}</div>
        <div class="count-panel-item-title">剩余可用次数</div>
      </div>
      <el-button type="primary" size="small" class="count-panel-item-btn" @click="clickRecharge">充值</el-button>
    </div>
    <!-- 记录面板 -->
    <div class="record-panel">
      <div class="header">
        <el-tabs class="tabs" v-model="activeName">
          <el-tab-pane label="充值记录" name="recharge"></el-tab-pane>
          <el-tab-pane label="使用记录" name="used"></el-tab-pane>
        </el-tabs>
        <el-date-picker
          class="date-picker"
          v-model="pickedDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onChangeDate"
        >
        </el-date-picker>
      </div>
      <el-table
        v-show="activeName === 'recharge'"
        v-loading="rechargeRecordLoading"
        class="table"
        :data="showRechargeRecord"
        style="width: 100%"
        :header-cell-style="{ color: '#232323' }"
        current-row-key="id"
      >
        <el-table-column align="center" prop="time" label="充值时间"> </el-table-column>
        <el-table-column align="center" prop="person" label="充值人员" class-name="person">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="avatar" class="avatar" />
            <span class="name">{{ scope.row.person }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="amount" label="充值金额（元）"> </el-table-column>
        <el-table-column align="center" prop="availableCount" label="可用次数（次）"> </el-table-column>
        <template slot="empty">
          <img src="@/assets/icons/yj-dz/empty-folder.png" alt="empty" class="icon" />
        </template>
      </el-table>
      <el-pagination
        v-show="activeName === 'recharge'"
        class="pagination recharge"
        background
        layout="total, prev, pager, next"
        :current-page="rechargeRecordPagination.currentPage"
        :page-size="rechargeRecordPagination.pageSize"
        :total="rechargeRecordPagination.total"
        @current-change="rechargeRecordPageChange"
      >
      </el-pagination>
      <el-table
        v-show="activeName === 'used'"
        v-loading="useRecordLoading"
        class="table"
        :data="showUseRecord"
        style="width: 100%"
        :header-cell-style="{ color: '#232323' }"
        current-row-key="id"
      >
        <el-table-column align="center" prop="time" label="获取手机号时间"> </el-table-column>
        <el-table-column align="center" prop="phone" label="获取手机号"> </el-table-column>
        <el-table-column align="center" prop="cost" label="获取手机号费用（元）"> </el-table-column>
        <template slot="empty">
          <img src="@/assets/icons/yj-dz/empty-folder.png" alt="empty" class="icon" />
        </template>
      </el-table>
      <el-pagination
        v-show="activeName === 'used'"
        class="pagination used"
        background
        layout="total, prev, pager, next"
        :current-page="useRecordPagination.currentPage"
        :page-size="useRecordPagination.pageSize"
        :total="useRecordPagination.total"
        @current-change="useRecordPageChange"
      >
      </el-pagination>
    </div>
    <get-phone-number-recharge-popup
      ref="getPhoneNumberRechargePopup"
      :remainCount="useInfo.available"
      :rechargeAmountList="rechargeAmountList"
      @completePay="onCompletePay"
    ></get-phone-number-recharge-popup>
  </div>
</template>

<script lang="ts">
import { reqGetRechargeList, reqGetUseInfo, reqGetRechargeRecord, reqGetUseRecord } from '@/api/getPhoneNumber';
import { Loading } from 'element-ui';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import getPhoneNumberRechargePopup from './getPhoneNumberRechargePopup.vue';

dayjs.extend(isSameOrAfter);

export default {
  name: 'getPhoneNumber',
  components: {
    getPhoneNumberRechargePopup,
  },
  data() {
    return {
      /** 选择的日期范围，默认为过去一个月 */
      pickedDate: [
        dayjs()
          .subtract(1, 'month')
          .toDate(),
        dayjs().toDate(),
      ],
      tableData: [],
      activeName: 'recharge',
      useInfo: {
        purchased: 0,
        used: 0,
        available: 0,
      },
      rechargeAmountList: [],
      /** 充值记录 */
      rechargeRecord: [],
      /** 充值记录分页参数 */
      rechargeRecordPagination: {
        currentPage: 1,
        pageSize: 10,
        total: -1,
      },
      rechargeRecordLoading: false,
      /** 使用记录 */
      useRecord: [],
      /** 使用记录分页参数 */
      useRecordPagination: {
        currentPage: 1,
        pageSize: 10,
        total: -1,
      },
      useRecordLoading: false,
    };
  },
  computed: {
    showRechargeRecord() {
      return this.rechargeRecord[this.rechargeRecordPagination.currentPage - 1] || [];
    },
    showUseRecord() {
      return this.useRecord[this.useRecordPagination.currentPage - 1] || [];
    },
  },
  mounted() {
    this.getUseInfo();
    this.getRechargeList();
    this.getRechargeRecord();
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === 'used') {
          this.getUseRecord();
        }
      },
      immediate: true,
    },
  },

  methods: {
    /** 获取使用情况 */
    async getUseInfo() {
      const loadingInstance = Loading.service({ fullscreen: true });
      const res = await reqGetUseInfo();
      this.$nextTick(() => {
        loadingInstance.close();
      });

      this.useInfo = {
        purchased: res.data.buyCount || 0,
        used: res.data.useCount || 0,
        available: res.data.saveCount || 0,
      };
    },
    /** 获取充值记录
     * @param isReset 是否重置数据, 默认为false
     */
    /* eslint-disable */
    async getRechargeRecord(isReset = false) {
      if (isReset) {
        this.rechargeRecordPagination.currentPage = 1;
        this.rechargeRecordPagination.total = -1;
      }

      if (this.rechargeRecord.length >= this.rechargeRecordPagination.total && this.rechargeRecordPagination.total !== -1) {
        return console.warn('充值记录没有更多数据了');
      }

      if (
        this.rechargeRecord[this.rechargeRecordPagination.currentPage - 1]
        && this.rechargeRecord[this.rechargeRecordPagination.currentPage - 1].length > 0
        && this.rechargeRecordPagination.total !== -1
      ) {
        return console.warn('充值记录已存在');
      }

      this.rechargeRecordLoading = true;
      const res = await reqGetRechargeRecord({
        currentPage: this.rechargeRecordPagination.currentPage,
        showCount: this.rechargeRecordPagination.pageSize,
        startDate: dayjs(this.pickedDate[0]).format('YYYY-MM-DD'),
        endDate: dayjs(this.pickedDate[1]).format('YYYY-MM-DD'),
      });
      this.rechargeRecordLoading = false;

      if (isReset || this.rechargeRecordPagination.total === -1) {
        // 根据分页参数，生成包含n个空数组的数组，n为总页数，每个空数组的长度为pageSize
        this.rechargeRecord = Array.from({ length: res.data.totalPage }, () => []);
      }
      this.$set(
        this.rechargeRecord,
        this.rechargeRecordPagination.currentPage - 1,
        res.data.list.map((item) => ({
          id: item.id.toString(),
          time: dayjs(item.dateTime).format('YYYY-MM-DD HH:mm:ss'),
          avatar: item.avator,
          person: item.emcee_name,
          amount: Number(item.amount),
          availableCount: Number(item.useCount),
        })),
      );
      console.log('this.rechargeRecord', this.rechargeRecord);
      this.rechargeRecordPagination.total = res.data.totalResult;
    },
    /** 重置充值记录相关数据 */
    resetRechargeRecord() {
      this.rechargeRecord = [];
      this.rechargeRecordPagination = {
        currentPage: 1,
        pageSize: 10,
        total: -1,
      };
    },
    /** 充值记录分页器切换事件 */
    rechargeRecordPageChange(page) {
      this.rechargeRecordPagination.currentPage = page;
      this.getRechargeRecord();
    },
    /** 获取使用记录 */
    /* eslint-disable */
    async getUseRecord() {
      if (this.useRecord.length >= this.useRecordPagination.total && this.useRecordPagination.total !== -1) {
        return console.warn('使用记录没有更多数据了');
      }

      if (this.useRecord[this.useRecordPagination.currentPage - 1] && this.useRecord[this.useRecordPagination.currentPage - 1].length > 0) {
        return console.warn('使用记录已存在');
      }

      this.useRecordLoading = true;
      const res = await reqGetUseRecord({
        currentPage: this.useRecordPagination.currentPage,
        showCount: this.useRecordPagination.pageSize,
        startDate: dayjs(this.pickedDate[0]).format('YYYY-MM-DD'),
        endDate: dayjs(this.pickedDate[1]).format('YYYY-MM-DD'),
      });
      this.useRecordLoading = false;

      // 根据分页参数，生成包含n个空数组的数组，n为总页数，每个空数组的长度为pageSize
      if (this.useRecordPagination.total === -1) {
        this.useRecord = Array.from({ length: res.data.totalPage }, () => []);
      }

      this.$set(
        this.useRecord,
        this.useRecordPagination.currentPage - 1,
        res.data.list.map((item) => ({
          id: item.id.toString(),
          time: dayjs(item.dateTime).format('YYYY-MM-DD HH:mm:ss'),
          phone: item.phone,
          cost: Number(item.amount),
        })),
      );

      this.useRecordPagination.total = res.data.totalResult;
    },
    /** 重置使用记录相关数据 */
    resetUseRecord() {
      this.useRecord = [];
      this.useRecordPagination = {
        currentPage: 1,
        pageSize: 10,
        total: -1,
      };
    },
    /** 使用记录分页器切换事件 */
    useRecordPageChange(page) {
      this.useRecordPagination.currentPage = page;
      this.getUseRecord();
    },
    /** 获取充值金额列表 */
    async getRechargeList() {
      const res = await reqGetRechargeList();
      this.rechargeAmountList = res.data.map((item) => ({
        price: Number(item.split(',')[0]),
        count: Number(item.split(',')[1]),
      }));
    },
    clickRecharge() {
      this.$refs.getPhoneNumberRechargePopup.openDialog();
    },
    onCompletePay() {
      if (dayjs(this.pickedDate[1]).isSameOrAfter(dayjs(), 'day')) {
        this.getRechargeRecord(true);
      }
      this.getUseInfo();
    },
    onChangeDate(e) {
      if (!e || (e && e.length <= 1)) {
        return;
      }
      this.resetRechargeRecord();
      this.getRechargeRecord();
      this.resetUseRecord();
      this.getUseRecord();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  background-color: #f1f4f7;

  display: grid;
  grid-template:
    'title' min-content
    'tip' min-content
    'count-panel' min-content
    'record-panel' min-content
    / 1fr;
  grid-gap: 20px;
  place-items: center;

  .title {
    grid-area: title;
    padding: 15px 20px 28px;
    background-color: #fff;
    box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);

    width: 100%;
    display: flex;
    align-items: center;

    font-size: 20px;
    font-weight: bold;
    color: #232323;
  }

  .tip {
    grid-area: tip;
    padding: 16px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);

    width: calc(100% - 40px);
    height: fit-content;
    display: grid;
    grid-template:
      'icon right'
      / 20px auto;
    align-items: center;
    column-gap: 10px;

    font-size: 16px;
    color: #333;

    .icon {
      grid-area: icon;
      width: 20px;
      height: 20px;
    }

    .right {
      grid-area: right;
      width: 100%;
      height: 100%;

      ::v-deep .el-carousel__container {
        height: 100%;
      }

      .right-text {
        display: flex;
        align-items: center;
      }
    }
  }

  .count-panel {
    grid-area: count-panel;
    padding: 15px 20px 28px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);

    width: calc(100% - 40px);
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    place-items: center;

    font-size: 14px;

    .count-panel-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      row-gap: 8px;

      .count-panel-item-count {
        font-size: 40px;
        color: #333;
      }

      .count-panel-item-title {
        font-size: 16px;
        color: #8d8d8d;
      }

      &.available {
        .count-panel-item-count {
          color: #eb5757;
        }
      }

      &:nth-child(1),
      &:nth-child(2) {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 89px;
          background-color: #eaeaea;
        }
      }
    }

    .count-panel-item-btn {
      justify-self: end;
    }
  }

  .record-panel {
    grid-area: record-panel;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);

    width: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tabs {
      // width: 200px;
      // height: 40px;
    }

    .date-picker {
      // width: 300px;
      // height: 40px;
    }

    .table {
      width: 100%;

      // 表头文字设置为黑色
      ::v-deep.el-table__header {
        color: #232323;
      }

      ::v-deep.el-table__body {
        .person {
          .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            .avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              object-fit: cover;
            }

            .name {
              margin-left: 8px;
            }
          }
        }
      }

      .empty {
        .icon {
          margin-top: 80px;

          width: 60px;
          height: 60px;

          object-fit: contain;
        }
      }
    }

    .pagination {
      align-self: end;
      margin-top: 20px;
    }
  }
}
</style>
