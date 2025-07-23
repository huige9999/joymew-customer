<!--绑定微信-已绑定-->
<template>
  <sub-page class="bindWechat_unbind">
    <title-header title="微信推送设置">
      <template v-slot:titleTip>
        <span class="title-tip">（已绑定微信号）</span>
      </template>
      <my-button type="primary" width="72" height="27" style="margin-left: auto" @click.native="unBind">解绑</my-button>
    </title-header>
    <main-card>
      <div class="items">
        <div class="item">
          <div class="title">系统通知</div>
          <el-switch v-model="systemNotice" active-color="#249AFF" inactive-color="#D5D9DF" @change-="setting('systemNotice')"> </el-switch>
          <div class="explanation"></div>
        </div>
        <div class="item">
          <div class="title">周、月报通报</div>
          <el-switch v-model="periodNotice" active-color="#249AFF" inactive-color="#D5D9DF" @change-="setting('periodNotice')"> </el-switch>
          <div class="explanation">每周、每月发送报表</div>
        </div>
        <div class="item">
          <div class="title">互动通知</div>
          <el-switch v-model="activityNotice" active-color="#249AFF" inactive-color="#D5D9DF" @change-="setting('activityNotice')">
          </el-switch>
          <div class="explanation">申请、开始、结束通知</div>
        </div>
        <div class="item">
          <div class="title">收益通知</div>
          <el-switch v-model="profitNotice" active-color="#249AFF" inactive-color="#D5D9DF" @change-="setting('profitNotice')"> </el-switch>
          <div class="explanation">收益提醒、每天早晨定时推送收益明细</div>
        </div>
        <div class="item">
          <div class="title">邀请通知</div>
          <el-switch v-model="inviteNotice" active-color="#249AFF" inactive-color="#D5D9DF" @change-="setting('inviteNotice')"> </el-switch>
          <div class="explanation">每成功邀请一名好友，获得一次激励信息</div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import TitleHeader from '@/layout/home/components/header/titleHeader';
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyButton from '@/components/my-button';
import messageMixin from '@/mixins/messageMixin';
import { unBIndWX, setWeChatPushNotice, getWeChatSettingList } from '@/api/app/user';

export default {
  mixins: [messageMixin],
  name: 'bindWechat_bind',
  components: {
    MyButton, MainCard, SubPage, TitleHeader,
  },
  data() {
    return {
      systemNotice: false,
      periodNotice: false,
      activityNotice: false,
      profitNotice: false,
      inviteNotice: false,
    };
  },
  created() {
    getWeChatSettingList({
      request_from_page: 'app/userCenter/bindWechat',
    })
      .then((data) => {
        this.systemNotice = data.system_notice === '1';
        this.periodNotice = data.month_notice === '1';
        this.activityNotice = data.hudong_notice === '1';
        this.profitNotice = data.money_notice === '1';
        this.inviteNotice = data.invite_notice === '1';
      })
      .catch(() => {});
  },
  methods: {
    setting(button) {
      const status = this[button]; // status为操作后的开关状态
      const value = status ? '1' : '0';
      const a = {
        systemNotice: 'system_notice',
        periodNotice: 'month_notice',
        activityNotice: 'hudong_notice',
        profitNotice: 'money_notice',
        inviteNotice: 'invite_notice',
      };
      // 发送请求
      setWeChatPushNotice({
        notice_type: a[button],
        notice_value: value,
      })
        .then(() => {})
        .catch(() => {
          // 操作失败时，按钮复原
          this[button] = !status;
        });
    },
    /* 解绑 */
    unBind() {
      unBIndWX({
        request_from_page: 'app/userCenter/bindWechat',
      }).then((res) => {
        console.log('解绑', res);
        this.$store.commit('login/updateUserInfo', {
          wx_openid: '',
        });
        this.$message({
          type: 'success',
          message: '解除绑定成功！',
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bindWechat_unbind::v-deep {
  .title-tip {
    font-size: 13px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
  }
  .items {
    .item {
      display: flex;
      margin-top: 22px;
      margin-bottom: 40px;
      margin-left: 30px;
      .title {
        flex: 0 0 170px;
      }
      .explanation {
        padding-left: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #6f7682;
        line-height: 22px;
      }
    }
  }
}
</style>
