<!--首页的卡片-->
<template>
  <div
    class="activityItem"
    :class="{ active: activityData.isActive }"
  >
    <div class="leftSide">
      <div class="top">
        <activity-info class="info">
          <template v-slot:name>
            <span
              @click.capture="copyLiveId(activityData.id)"
              class="copyLiveId"
            >
              {{ activityData.title }}
            </span>
          </template>
          <template v-slot:address>
            {{ activityData.local }}
            {{ activityData.address }}
          </template>
        </activity-info>
        <div class="operate hideen">
          <!-- <router-link to="/app/home" class="icon edit">
            <img src="@/assets/image/icon/edit.png"/>
          </router-link> -->
          <div
            @click.capture="copyLiveUrl(activityData)"
            class="icon copy"
            v-if="activityData.isActive"
          >
            <img src="@/assets/image/icon/copyIcon.png" />
          </div>
          <div
            @click="toEdit"
            class="icon edit"
            v-if="activityData.isActive"
          >
            <img src="@/assets/image/icon/edit.png" />
          </div>
          <!-- deleteActivity成功之后触发refresh事件，需要父组件监听-->
          <div
            @click="deleteActivity_axios(activityId, deleteName)"
            class="icon delete"
            v-if="activityData.isActive"
          >
            <img src="@/assets/image/icon/delete.png" />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="limit item">
          <p>
            <label class="big-size">{{ activityData.person }}</label>
            /{{ activityData.youke_size }}
          </p>
          <p>已参与/参与人数</p>
        </div>
        <div class="chat-num item">
          <p class="big-size">{{ activityData.chatNum || 0 }}</p>
          <p>弹幕量</p>
        </div>
      </div>
    </div>
    <card-icons
      @toSeeLotteryy="seeLottery"
      @toSiginPerson="siginPerson"
      @toIncome="income"
      :exists="exists"
      :size="activityData.youke_size"
      :isActive="activityData.isActive"
      @toSettingEvent="toSetting"
      @buy="toBuy"
    />
    <!-- 进入互动 -->
    <enter-activity
      v-if="isActive"
      :currentId="this.activityId"
      :sceneType="activityData.typeVal"
    />
    <!-- 婚礼版新版  进入互动-->
    <!-- <enterActivityNew v-if="isActive && activityData.typeVal === '0'" :currentId="this.activityId"/> -->
    <!-- 查看数据 -->
    <scan-data
      v-if="!isActive"
      :currentId="this.activityId"
      @toSeeData="toScanData"
    ></scan-data>
    <div class="label-wrap">
      <div
        class="carrierType"
        :class="labelData.carrierType"
        v-if="labelData.carrierType"
      ></div>
      <div
        class="schedule"
        :class="labelData.schedule"
        v-if="labelData.schedule"
      ></div>
      <div
        class="sstate"
        :class="labelData.sstate"
        v-if="labelData.sstate"
      ></div>
      <div
        class="type"
        :class="labelData.type"
        v-if="labelData.type"
      ></div>
    </div>
    <el-dialog
      class="box"
      :visible.sync="buyVisible"
      width="500px"
      center
      title="人数调整"
    >
      <div class="buy-box">
        <div class="buy-wrap"></div>
        <el-form
          v-model="buyForm"
          class="buyForm"
        >
          <el-form-item label="购买人数:">
            <el-col :span="16">
              <el-slider
                v-model="buyForm.number"
                show-input
                :min="1"
                :max="2000"
              ></el-slider>
            </el-col>
          </el-form-item>
          <div class="tip">
            超过2000人，请与
            <span>客服联系</span>
          </div>
          <el-form-item label="当前人数:">{{ activityData.youke_size }}</el-form-item>
          <el-form-item label="订单合计:">{{ buyForm.number }}</el-form-item>
          <el-form-item label="实付款:">{{ buyForm.number * price }}</el-form-item>

          <el-button
            type="primary"
            @click="surePay"
          >
            确认支付
          </el-button>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      class="box"
      :visible.sync="qrcodeVisible"
      width="500px"
      center
      title="扫码付款"
    >
      <div class="buy-box">
        <div class="buy-wrap"></div>
        <div
          class="erweima-box"
          style="margin-left: 17px"
        >
          <div>
            <iframe
              :srcdoc="erweimaHtml"
              frameborder="0"
            ></iframe>
          </div>
        </div>
        <el-button
          type="primary"
          @click="refreshList"
        >
          已付款
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { buyPeopleSize } from '@/api/company/index';
import ActivityInfo from '@/layout/home/components/activityCard/activityInfo';
import CardIcons from '@/layout/home/components/activityCard/cardIcons';
import EnterActivity from '@/layout/home/enterActivity';
import messageBoxMixin from '@/mixins/messageBoxMixin';
import messageMixin from '@/mixins/messageMixin';
import { judgeIsHttps } from '@/utils/index';
import request from '@/utils/request';

// import enterActivityNew from '@/layout/home/enterActivityNew';
import scanData from '@/layout/activity/scanData';

export default {
  mixins: [messageMixin, messageBoxMixin],
  name: 'activityCard',
  components: {
    EnterActivity,
    // enterActivityNew,
    ActivityInfo,
    CardIcons,
    scanData,
  },
  created() {
    console.log('活动信息', this.activityData);
  },

  data() {
    return {
      buyForm: {
        number: 1,
      },
      buyVisible: false,
      qrcodeVisible: false,
      activityId: this.activityData.id,
      deleteName: this.activityData.title,
      isActive: this.activityData.isActive,
      // 支付二维码html标签
      erweimaHtml: '',
    };
  },
  computed: {
    price() {
      return this.$store.state.login.userInfo.YouKe_One || 10;
    },
    exists() {
      const exists = [
        'settings', // 互动配置
        'signInMember', // 签到人员
        'auditMassage', // 消息审核 未开发
        'enterInteraction', // 进入互动 未开发

        // "income",// 活动收入
        'winnerItem1', // 中奖记录
      ];
      exists.push('upperLimit'); // 人数限制
      return exists;
    },
  },
  props: {
    activityData: Object,
    labelData: Object,
  },
  methods: {
    toBuy() {
      this.buyVisible = true;
    },
    async copyLiveUrl(activity) {
      if (!this.isActive) {
        return;
      }
      let livePath = `https://screen.hudongmiao.com/#/?liveId=${activity.id}`;
      // 婚礼版和企业版各自有两个版本
      if (activity.typeVal === '0' || activity.typeVal === '1') {
        try {
          await this.$confirm('选择新版or旧版', '版本选择', {
            confirmButtonText: '新版',
            cancelButtonText: '旧版',
            type: 'info',
          });
          const suffix = activity.typeVal === '0' ? 'wedding' : 'enterprise';
          livePath = `${livePath}&screenType=${suffix}`;
        } catch (err) {
          console.log(err);
        }
      }
      await this.$copyText(livePath);
      this.$message.success('活动地址复制成功!');
    },
    copyLiveId(id) {
      this.$copyText(`${id}`).then(
        (res) => {
          console.log(res);
          // 这是element的Message 消息提示组件
          this.$message({
            message: '活动id复制成功',
            type: 'success',
          });
        },
        (err) => {
          console.log(err);
          this.$message.error('活动id复制失败');
        },
      );
    },
    toSetting() {
      // console.log(this.activityId, '卡片一点击了');
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityInfo/themeSetting');
    },
    /* 点击编辑跳转到编辑页面 修改store中liveId */
    toEdit() {
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityInfo/activityEdit');
    },
    /* 跳转到签到人员 */
    siginPerson() {
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityData/signIn');
    },
    /* 跳转到活动收入 */
    income() {
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityIncome/report');
    },
    /* 中奖记录 */
    seeLottery() {
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityData/winningRecord');
    },
    /* 跳转到查看数据 */
    toScanData() {
      console.log('***toScanData***');
      this.$store.commit('initLiveInfo', {
        liveId: this.activityId,
        sceneType: this.activityData.typeVal,
        isTemplate: false,
      });
      this.$router.push('/app/activity/activityData/signIn');
    },
    // 删除活动
    deleteActivity_axios(id, deleteName = undefined) {
      return this._asyncDeleteActivity(id, deleteName)
        .then(() => {
          // 弹出成功提示
          this.alertSuccess('删除成功');
          // 刷新页面
          this.$emit('refresh');
        })
        .catch((err) => {
          // 非取消造成的失败
          if (err.toString() !== 'Error: cancel') {
            this.alertError('删除失败');
          }
          console.log(`删除出错: ${err}`);
        });
    },
    async _asyncDeleteActivity(id, deleteName) {
      let msg;
      if (typeof deleteName === 'undefined') {
        msg = '确认删除此活动？';
      } else {
        msg = `确认删除活动：${deleteName}？`;
      }
      // 删除活动确认框
      await this.confirmBox(msg, 'error');
      // 提交删除请求
      await request.post('/huoDongHm/shanChuHuoDong', {
        // liveid: id,
        splid: id,
      });
    },
    surePay() {
      const data = {
        splid: this.activityId,
        // money: rechargeAmount,
        // USER_ID: this.$store.state.liveId,
        pay_type: 'alipay',
        type: '6',
        data_json: String(this.buyForm.number),

        isHttps: judgeIsHttps(),
      };
      buyPeopleSize(data).then((res) => {
        this.erweimaHtml = `${res.data.order}`;
        this.buyVisible = false;
        this.qrcodeVisible = true;
      });
    },
    refreshList() {
      this.$emit('refresh');
      console.log('刷新');
    },
  },
};
</script>

<style lang="less" scoped>
.buy-box {
  .erweima-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .erweima {
      background: #f1f8fc;
      width: 311px;
      height: 184px;
      margin-right: 20px;
    }
  }
}
.buyForm::v-deep {
  .tip {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    span {
      color: #ff4646;
    }
  }
  .actualPay {
    font-size: 20px;
    font-weight: 500;
    color: #ff4646;
  }
  .el-form-item__label {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }
  .el-form-item__content {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }
}
// .buyForm{
//       .tip {
//       font-size: 14px;
//       font-weight: 400;
//       color: rgba(0, 0, 0, 0.6);
//       span {
//         color: #ff4646;
//       }
//     }
// }
.copyLiveId {
  cursor: pointer;
}
.activityItem {
  height: 115px;
  border: 1px solid #eeeeee;
  position: relative;
  display: flex;
  border-radius: 6px 10px 10px 6px;
  .leftSide {
    width: 32%;
    /* 挡住border */
    height: calc(100% + 2px);
    position: relative;
    top: -1px;
    left: -1px;
    background: linear-gradient(135deg, #1c75d0 0%, #3fb8f1 100%);
    border-radius: 6px;
    .top {
      width: 100%;
      height: 50%;
      padding-top: 11px;
      display: flex;
      .operate {
        display: flex;
        margin-right: 10px;
        .icon {
          cursor: pointer;
          width: 24px;
          height: 22px;
          .hvCenter();
          &.edit img {
            width: 18px;
          }
          &.delete img {
            width: 14px;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      height: 50%;
      position: relative;
      display: flex;
      .item {
        p {
          color: #ffffff;
          font-size: 11px;
          &:nth-child(2) {
            margin-top: 1px;
            opacity: 0.59;
          }
        }
        .big-size {
          font-size: 20px;
        }
        &.limit {
          padding-left: 17px;
          margin-right: auto;
        }
        &.chat-num {
          width: 50%;
          .multiHCenter();
        }
      }
      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 36px;
        background: rgba(255, 255, 255, 0.22);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 5px;
      }
    }
  }
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid #1e78d2;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    position: absolute;
    top: -12px;
    left: 12px;
  }
  &:not(.active) {
    .leftSide {
      background: linear-gradient(317deg, #c0cad6 0%, #abb7c7 100%);
    }
    &::before {
      border-bottom: 6px solid #acb8c8;
    }
  }
  .label-wrap {
    position: absolute;
    padding-left: 81px;
    width: 100%;
    height: 22px;
    top: -31px;
    display: flex;
    gap: 10px;
    .carrierType {
      width: 65px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      &.dy {
        background-color: rgba(255, 0, 79, 0.1);
        border: 1px solid #ff004f;
        color: #ff004f;
        font-size: 12px;
        &::before {
          width: 14px;
          height: 14px;
          content: '';
          background-image: url('../../../../assets/image/icon/activity/douyin.png');
          background-size: 100% 100%;
          display: block;
          margin-right: 4px;
        }
        &::after {
          content: '抖音';
          display: block;
        }
      }
      &.weixin {
        background: rgba(40, 196, 69, 0.1);
        border: 1px solid #28c445;
        color: #28c445;
        font-size: 12px;
        &::before {
          width: 14px;
          height: 14px;
          content: '';
          background-image: url('../../../../assets/image/icon/activity/weixin.png');
          background-size: 100% 100%;
          display: block;
          margin-right: 4px;
        }
        &::after {
          content: '微信';
          display: block;
        }
      }
    }
    .schedule {
      width: 60px;
      height: 22px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.lunch {
        border: 1px solid #ebbc6b;
        color: #ebbc6b;
        font-size: 12px;
        &::after {
          content: '午宴';
          display: block;
        }
      }
      &.evening {
        border: 1px solid #470886;
        color: #470886;
        font-size: 12px;
        &:after {
          content: '晚宴';
          display: block;
        }
      }
    }
    .sstate {
      width: 60px;
      height: 22px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.in_progress {
        border: 1px solid #15c15a;
        color: #15c15a;
        font-size: 12px;
        &::after {
          content: '进行中';
          display: block;
        }
      }
      &.not_start {
        border: 1px solid #ec850f;
        color: #ec850f;
        font-size: 12px;
        &::after {
          content: '未开始';
          display: block;
        }
      }
      &.finished {
        border: 1px solid #a5a5a5;
        color: #a5a5a5;
        &::after {
          content: '已结束';
          display: block;
        }
      }
    }
    .type {
      &.Wedding_plus {
        &::after {
          content: '婚礼版';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #ea267f;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/weeding_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.Meeting_plus {
        &::after {
          content: '年会版';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #ec0f0f;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/meeting_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.Birthday_plus {
        &::after {
          content: '生日版';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #e6b650;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.BBY_plus {
        &::after {
          content: '宝宝宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.SY_plus {
        &::after {
          content: '寿宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 10px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.CRL_plus {
        &::after {
          content: '成人礼';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.BLY_plus {
        &::after {
          content: '百露宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.MMY_plus {
        &::after {
          content: '满月宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.YSY_plus {
        &::after {
          content: '满月宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #a564e4;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/birthday_type.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.BYDL_plus {
        &::after {
          content: '毕业礼';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #f9ac30;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/schoolIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.XSY_plus {
        &::after {
          content: '谢师宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #f9ac30;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/schoolIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.JBTM_plus {
        &::after {
          content: '金榜题名';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #f9ac30;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/schoolIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 3px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.TXH_plus {
        &::after {
          content: '同学会';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #55cf87;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/otherIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }

      &.QQY_plus {
        &::after {
          content: '乔迁宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #55cf87;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/otherIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.HX_plus {
        &::after {
          content: '会销';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #55cf87;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/otherIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
      &.DHY_plus {
        &::after {
          content: '订婚宴';
          width: 75px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          border-radius: 2px;
          background-color: #55cf87;
          color: #fff;
          display: inline-block;
          background-image: url('../../../../assets/image/icon/otherIcon.png');
          background-size: 16px 16px;
          background-repeat: no-repeat;
          background-position: 1px;
          background-position-x: 6px;
          padding-left: 15px;
          box-sizing: border-box;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
