<template>
    <div class="follow-record-container">
        <div class="page-title">跟进详情</div>
        <div class="record-table">
            <el-table v-loading="isLoading" :data="recordList" :header-cell-style="{background:'#f2f3f5'}" border header-row-class-name="table-header">
                <el-table-column label="用户" align="center" min-width="120">
                    <template slot-scope="scope">
                        <!-- <el-avatar :size="22" :src="scope.row.avator"></el-avatar> -->
                        <div style="margin-left: 5px; display: inline-block; text-align: center">
                            {{ scope.row.emcee_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="phonenumber" align="center"></el-table-column>
                <el-table-column label="跟进日期" prop="record_time" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.record_time.split(" ")[0] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" prop="record_remark" align="center" min-width="120"></el-table-column>
                <el-table-column label="跟进前场次" prop="follow_start_spltotal" align="center"></el-table-column>
                <el-table-column label="跟进前有效场次" prop="follow_start_splactual" align="center"></el-table-column>
                <el-table-column label="跟进后一个月场次" prop="follow_end_spltotal" align="center"
                    min-width="100"></el-table-column>
                <el-table-column label="跟进后一个月有效场次" prop="follow_end_splactual" align="center"
                    min-width="110"></el-table-column>
                <el-table-column label="是否激活" align="center">
                    <template slot-scope="scope">
                        <div class="is-jh">
                            <div class="jh-logo" :class="{'not-jh': String(scope.row.isJh) === '0'}"></div>
                            <span>{{ String(scope.row.isJh) === '0' ? '未激活' : '已激活' }}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagenation" v-if="total > 0">
            <el-pagination background v-show="total > 0" layout="prev, pager, next, total" :total="total" :page.sync="currentPage"
                :limit.sync="showCount" @current-change="changePage" />
        </div>
    </div>
</template>
<script>
import {
  getRecordList,
} from '@/api/partnerSystem/index';

export default {
  name: 'PartnerFollowRecord',
  data() {
    return {
      isLoading: false,
      showCount: 10,
      currentPage: 1,
      total: 0,
      totalPage: 1,
      recordList: [],
    };
  },
  created() {
    this.getFollowRecordList();
  },
  methods: {
    async getFollowRecordList() {
      this.isLoading = true;
      const res = await getRecordList({
        showCount: this.showCount,
        currentPage: this.currentPage,
      });
      const target = res.data;
      console.log('跟进数据', target);
      this.isLoading = false;
      this.recordList = [...target.list];
      this.total = target.totalResult;
      this.totalPage = target.totalPage;
    },
    changePage(val) {
      this.isLoading = true;
      this.currentPage = val;
      this.getFollowRecordList();
    },
  },
};
</script>
<style lang="less" scoped>
.follow-record-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;

    .page-title {
        font-size: 20px;
        font-weight: bold;
    }

    .record-table {
        margin-top: 20px;
        .is-jh {
            display: flex;
            justify-content: center;
            align-items: center;
            .jh-logo {
                width: 6px;
                height: 6px;
                margin-right: 8px;
                background-color: #00B42A;
                border-radius: 50%;
            }
            .not-jh {
                background-color: #F53F3F;
            }
        }

    }

    .pagenation {
        width: 100%;
        padding: 20px 0 0 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
