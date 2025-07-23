<template>
  <div class="suggestion-container">
    <div class="part-header">
      <div class="part-title">反馈历史</div>
      <div class="upload-suggestion" @click="showdialog">
        <i class="el-icon-edit"></i>意见反馈
      </div>
    </div>

    <div class="suggestion-table">
      <el-table v-loading="isLoading" :data="suggestionList" :header-cell-style="{ background: '#f2f3f5' }">
        <el-table-column label="反馈人" min-width="120">
          <template slot-scope="scope">
            <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
            <span style="margin-left: 5px; width: 60px; display: inline-block; text-align: center">
              {{ scope.row.emcee_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="反馈时间" prop="feedback_time" width="180"></el-table-column>
        <el-table-column label="反馈内容" prop="feedback_content" min-width="250"></el-table-column>
        <el-table-column label="是否采纳" align="center">
          <template slot-scope="scope">
            <div class="status-col">
              <div class="status-icon"
                :class="{ success: Number(scope.row.status) === 1, failed: Number(scope.row.status) === 2 }"></div>
              {{ statusMap[scope.row.status].label }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="奖励" prop="reward" align="center" width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.reward ? scope.row.reward : "无奖励" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="回复时间" prop="reply_time" min-width="180">
          <template slot-scope="scope">
            <div>{{ scope.row.reward ? scope.row.reward : "暂未回复" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="公司回复" prop="reply_content" min-width="250">
          <template slot-scope="scope">
            <div>{{ scope.row.reward ? scope.row.reward : "暂未回复" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <div class="detailBtn" @click="showDetail(scope.row)">查看详情</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagenation" v-if="total > 0">
      <el-pagination background v-show="total > 0" layout=" prev, pager, next, total" :total="total"
        :page.sync="currentPage" :limit.sync="showCount" @current-change="changePage" />
    </div>

    <el-dialog v-loading="isLoading" :visible.sync="dialogVisible" width="464px" center>
      <template #title>
        <div class="dialog-title">{{ dialogTitle }}</div>
      </template>
      <div class="dialog-body" v-if="dialogTitle === '添加反馈内容'">
        <el-input type="textarea" placeholder="请填写您的功能建议，感谢您的支持，最多不超过200字" v-model="uploadContent" maxlength="200"
          show-word-limit>
        </el-input>
      </div>
      <div class="fb-detail" v-else>
        <div class="fb-top fb-part">
          <div class="fb-item">
            <div class="item-label">反馈人：</div>
            <div class="item-data user">
              <img :src="dialogObj.avator" v-if="isLoadImg" @error="showBgImg"/>
              <div class="none-image" v-else></div>
              <span>{{ dialogObj.emcee_name }}</span>
            </div>
          </div>
          <div class="fb-item">
            <div class="item-label">反馈时间：</div>
            <div class="item-data">{{ dialogObj.feedback_time }}</div>
          </div>
          <div class="fb-item">
            <div class="item-label">反馈内容：</div>
            <div class="item-data">{{ dialogObj.feedback_content }}</div>
          </div>
          <div class="fb-item">
            <div class="item-label">反馈状态：</div>
            <div class="item-data">{{ statusMap[dialogObj.status].label }}</div>
          </div>
        </div>
        <div class="fb-bottom fb-part">
          <div class="fb-item">
            <div class="item-label">公司回复：</div>
            <div class="item-data">{{ dialogObj.reply_content ? dialogObj.reply_content : '暂未回复' }}</div>
          </div>
          <div class="fb-item">
            <div class="item-label">回复时间：</div>
            <div class="item-data">{{ dialogObj.reply_time ? dialogObj.reply_time : '暂未回复' }}</div>
          </div>
          <div class="fb-item">
            <div class="item-label">奖励：</div>
            <div class="item-data">{{ dialogObj.reward ? dialogObj.reward : '无奖励' }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="dialogTitle === '添加反馈内容'">
          <div class="cancel-btn btn" @click="cancelHandler">取消</div>
          <div class="confirm-btn btn" @click="confirmHandler">确定</div>
        </div>
        <div class="dialog-footer" v-else>
          <div class="confirm-btn btn" @click="dialogVisible = false">确定</div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSuggestionList,
  uploadFeedBack,
} from '@/api/partnerSystem/index';

const statusMap = {
  0: {
    label: '处理中',
    value: 0,
  },
  1: {
    label: '已采纳',
    value: 1,
  },
  2: {
    label: '未采纳',
    value: 2,
  },
};

export default {
  name: 'PartnerSuggestion',
  data() {
    return {
      statusMap,
      isLoadImg: true,
      suggestionList: [],
      isLoading: false,
      userId: '',
      dialogVisible: false,
      dialogTitle: '',
      uploadContent: '',
      showCount: 10,
      currentPage: 1,
      total: 0,
      totalPage: 0,
      dialogObj: {
        feedback_time: '',
        feedback_content: '',
        emcee_name: '',
        avator: '',
        reward: '',
        reply_content: '',
        reply_time: '',
        status: 0,
      },
    };
  },
  created() {
    this.userId = this.$store.state.partner.user.id;
    //  获取反馈列表
    this.getSuggestionList();
  },
  methods: {
    async getSuggestionList() {
      this.isLoading = true;
      const res = await getSuggestionList({
        showCount: this.showCount,
        currentPage: this.currentPage,
      });
      const target = res.data;
      console.log('反馈列表', target);
      this.isLoading = false;
      this.suggestionList = [...target.list];
      this.total = target.totalResult;
      this.totalPage = target.totalPage;
    },
    showdialog() {
      this.dialogVisible = true;
      this.dialogTitle = '添加反馈内容';
    },
    async confirmHandler() {
      this.isLoading = true;
      await uploadFeedBack({
        content: this.uploadContent,
      });
      this.isLoading = false;
      this.dialogVisible = false;
      this.uploadContent = '';
      this.getSuggestionList();
    },
    cancelHandler() {
      this.dialogVisible = false;
      this.uploadContent = '';
      this.dialogTitle = '';
    },
    changePage(val) {
      this.isLoading = true;
      this.currentPage = val;
      this.getSuggestionList();
    },
    showDetail(item) {
      this.dialogTitle = '反馈详情';
      this.dialogObj.avator = item.avator;
      this.dialogObj.emcee_name = item.emcee_name;
      this.dialogObj.feedback_time = item.feedback_time;
      this.dialogObj.feedback_content = item.feedback_content;
      this.dialogObj.reward = item.reward;
      this.dialogObj.reply_time = item.reply_time;
      this.dialogObj.reply_content = item.reply_content;
      this.dialogObj.status = item.status;
      this.isLoadImg = true;
      this.dialogVisible = true;
    },
    showBgImg() {
      this.isLoadImg = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.suggestion-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 6px;
  background-color: #fff;

  .part-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .part-title {
      color: #1D2129;
      font-size: 20px;
      font-weight: bold;
    }

    .upload-suggestion {
      width: 108px;
      height: 32px;
      background-color: #165DFF;
      color: #FFFFFF;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;

      i {
        margin-right: 10px;
      }
    }
  }

  .suggestion-table {
    margin-top: 20px;

    .status-col {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .status-icon {
        width: 6px;
        height: 6px;
        margin-right: 8px;
        border-radius: 50%;
        background-color: #3491FA;
      }

    }
  }

  .success {
    background-color: #00B42A;
  }

  .failed {
    background-color: #F53F3F;
  }

  .pagenation {
    width: 100%;
    padding: 20px 0 0 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .detailBtn {
    color: #165DFF;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .dialog-title {
    color: #1D2129;
    font-size: 16px;
    font-weight: bold;
  }

  .dialog-body::v-deep {
    background-color: #F2F3F5;
    font-size: 14px;

    .el-textarea {

      .el-textarea__inner {
        height: 100%;
        min-height: 136px !important;
        background-color: #F2F3F5;
        font-size: 14px;
        border: none;

        &::placeholder {
          color: #86909C;
        }
      }

      .el-input__count {
        background-color: #F2F3F5;
      }
    }
  }

  .fb-detail {
    width: 100%;

    .fb-part {
      padding: 16px;
      box-sizing: border-box;
      background-color: #FAFAFA;
      border-radius: 4px;

      .fb-item {
        margin-bottom: 14px;
        display: flex;
        align-items: flex-start;
        color: #86909C;
        font-size: 14px;

        .item-label {
          width: 70px;
          margin-right: 4px;
        }

        .item-data {
          color: #1D2129;
        }

        .user {
          display: flex;
          align-items: center;

          span {
            margin-left: 8px;
          }

          img {
            width: 22px;
            height: 22px;
            border-radius: 50%;
          }

          .none-image {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #c0c4cc;
          }
        }

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    .fb-bottom {
      margin-top: 12px;
    }
  }

  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 60px;
      height: 32px;
      background-color: #165DFF;
      color: #FFFFFF;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      border-radius: 2px;
      cursor: pointer;
    }

    .cancel-btn {
      margin-right: 6px;
      color: #4E5969;
      background-color: #F2F3F5;
    }
  }
}
</style>
