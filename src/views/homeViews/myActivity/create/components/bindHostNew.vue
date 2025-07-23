<template>
  <div class="bindHostNew">
    <!-- 非单弹窗模式 用来给活动绑定司仪 包括未绑定、绑定中、已绑定三个状态 默认为该模式 -->
    <div class="common" v-if="!onlyDialogMode">
      <!-- 未绑定情况 -->
      <el-switch v-model="isShowBind" active-value="1" inactive-value="0" v-if="!isHasBinded"></el-switch>
      <!-- 已绑定情况 -->
      <div class="bind-user" v-else>
        <div class="bind-info">
          <img :src="bindUser.headImg" alt class="headImg" />
          <div class="name">{{ bindUser.name }}</div>
        </div>
        <div @click="cancelBind" class="edit">取消绑定</div>
      </div>
      <!-- 绑定弹窗 -->
      <el-dialog class="bindDialog" title="绑定本场主持人" :visible.sync="bindDialogVisible" width="520px">
        <div class="bindBox">
          <div class="bindItem">
            <div class="key">绑定主持人：</div>
            <el-input v-model="bindPhone" placeholder="请输入主持人手机号码" size="mini" class="phoneInput"></el-input>
          </div>
          <div class="gap">或</div>
          <div class="qrcodeBindWrap">
            <img class="qrcode" :src="bindQrCode" alt="绑定二维码" />
            <div class="qrText">
              <p>将此二维码</p>
              <p>截图发送给主持人</p>
            </div>
          </div>
          <div class="benifit">
            主持人绑定本场活动后，第二天会获得 本场活动的礼物收益和游戏收益分成。 将通过微信零钱的方式
            <span style="color: #1e87f0">自动到账</span>。
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm" v-loading="isLoading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 单弹窗模式 用来展示当前活动的司仪绑定情况 包括已绑定、未绑定两个状态 -->
    <div class="onlyDialogMode" v-else>
      <el-dialog class="bindedDialog" title="本场主持人" :visible.sync="bindedDialogVisible" width="520px">
        <!-- 已绑定情况 -->
        <div class="bind-user" v-if="isHasBinded">
          <div class="bind-info">
            <img :src="bindUser.headImg" alt class="headImg" />
            <div class="name">{{ bindUser.name }}</div>
            <div class="phone" v-if="bindPhone">{{ bindPhone }}</div>
          </div>
          <div @click="cancelBindByLiveId" class="edit" v-loading="isLoading">取消绑定</div>
        </div>
        <div class="bindBox" v-else>
          <div class="bindItem">
            <div class="key">绑定主持人：</div>
            <el-input v-model="bindPhone" placeholder="请输入主持人手机号码" size="mini" class="phoneInput"></el-input>
          </div>
          <div class="gap">或</div>
          <div class="qrcodeBindWrap">
            <img class="qrcode" :src="bindQrCode" alt="绑定二维码" />
            <div class="qrText">
              <p>将此二维码</p>
              <p>截图发送给主持人</p>
            </div>
          </div>
          <div class="benifit">
            主持人绑定本场活动后，第二天会获得 本场活动的礼物收益和游戏收益分成。 将通过微信零钱的方式
            <span style="color: #1e87f0">自动到账</span>。
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { cancelBindWx } from '@/api/tql/bind';
import { bindUserToLiveId, bindVxQrCode, getBindInfoByLiveId, getQrcodeByLiveId, getUserInfoByPhone, isBindWx } from '@/api/tql/new_bind';

let loopTimer = null;

export default {
  name: 'bindHostNew',
  data() {
    return {
      isShowBind: '0',
      isHasBinded: false,
      bindDialogVisible: false,
      bindPhone: '',
      bindQrCode: '',
      bindId: '',
      bindUser: {
        headImg: '',
        name: '',
      },
      isLoading: false,
      bindedDialogVisible: false,
    };
  },
  watch: {
    async isShowBind(val) {
      if (val === '1') {
        this.bindDialogVisible = true;
        this.bindPhone = '';
        await this.getQrcodeInfo();
        this.loopGetBindInfo();
      } else {
        this.bindDialogVisible = false;
        // 停止轮询
        this.clearLoopTimer();
      }
    },
    async bindedDialogVisible(val) {
      if (val) {
        console.log(this.liveId);
        const getBindInfoByLiveIdRes = await getBindInfoByLiveId({ splid: this.liveId });
        if (getBindInfoByLiveIdRes.data && getBindInfoByLiveIdRes.data.userId) {
          this.bindUser.headImg = getBindInfoByLiveIdRes.data.bind_headImg;
          this.bindUser.name = getBindInfoByLiveIdRes.data.bind_nickname;
          this.bindPhone = getBindInfoByLiveIdRes.data.phone;
          this.isHasBinded = true;
        } else {
          this.bindPhone = '';
          await this.getQrcodeInfo();
          this.loopGetBindInfo();
        }
      } else {
        // 停止轮询
        this.clearLoopTimer();
        this.$emit('onBindedDialogClose');
      }
    },
  },
  methods: {
    handleCancel() {
      this.isShowBind = '0';
      this.bindedDialogVisible = false;
    },
    handleConfirm() {
      if (this.isHasBinded) {
        this.isShowBind = '0';
        this.bindedDialogVisible = false;
      } else {
        this.bindUserByPhone();
      }
    },
    cancelBind() {
      this.isHasBinded = false;
      this.isShowBind = '0';
      this.bindId = '';
      this.bindUser.headImg = '';
      this.bindUser.name = '';
    },
    async getQrcodeInfo() {
      if (this.onlyDialogMode) {
        const bindVxQrCodeRes = await getQrcodeByLiveId({ splid: this.liveId });
        if (bindVxQrCodeRes) {
          this.bindQrCode = bindVxQrCodeRes;
        }
      } else {
        const bindVxQrCodeRes = await bindVxQrCode({});
        if (bindVxQrCodeRes && bindVxQrCodeRes.data) {
          this.bindQrCode = bindVxQrCodeRes.data.bindQrcode;
          this.bindId = bindVxQrCodeRes.data.bindId;
        }
      }
    },
    loopGetBindInfo() {
      if (loopTimer) {
        return;
      }
      loopTimer = setInterval(async () => {
        let isBindWxRes = null;
        if (this.onlyDialogMode) {
          isBindWxRes = await getBindInfoByLiveId({ splid: this.liveId });
          const { is_bind } = isBindWxRes.data;
          if (is_bind === '1') {
            this.isHasBinded = true;
            const { bind_headImg, bind_nickname, phone } = isBindWxRes.data;
            this.bindUser.headImg = bind_headImg;
            this.bindUser.name = bind_nickname;
            this.bindPhone = phone;
            this.clearLoopTimer();
          } else {
            this.isHasBinded = false;
          }
        } else {
          isBindWxRes = await isBindWx({ bindId: this.bindId });
          const { code } = isBindWxRes.data;
          if (code === '100') {
            // 未绑定
            this.isHasBinded = false;
          }
          if (code === '200') {
            // 已绑定
            const { avator, emcee_name, bind_userId } = isBindWxRes.data;
            if (!bind_userId) {
              // 异常情况
              this.isHasBinded = false;
              this.isShowBind = '0';
              this.$message.error('绑定失败');
              return;
            }
            // 将userId传给父组件
            this.$emit('input', bind_userId);
            this.isHasBinded = true;
            this.bindUser.headImg = avator;
            this.bindUser.name = emcee_name;
            // 关闭弹窗
            this.isShowBind = '0';
            this.$message.success('绑定成功');
          }
        }
      }, 4000);
    },
    clearLoopTimer() {
      if (loopTimer) {
        clearInterval(loopTimer);
        loopTimer = null;
      }
    },
    async bindUserByPhone() {
      if (!this.bindPhone) {
        this.$message.error('请输入手机号');
        return;
      }
      if (this.bindPhone.length !== 11) {
        this.$message.error('手机号格式不正确');
        return;
      }
      this.isLoading = true;
      const bindUserRes = await getUserInfoByPhone({
        phone: this.bindPhone,
      });
      this.isLoading = false;
      if (bindUserRes.data && bindUserRes.data.userId) {
        // 绑定成功
        if (this.onlyDialogMode) {
          const bindUserToLiveIdRes = await bindUserToLiveId({ userId: bindUserRes.data.userId, liveId: this.liveId });
          console.log(bindUserToLiveIdRes);
          this.clearLoopTimer();
        } else {
          this.$emit('input', bindUserRes.data.userId);
        }
        this.isHasBinded = true;
        this.bindUser.headImg = bindUserRes.data.avator;
        this.bindUser.name = bindUserRes.data.emcee_name;
        this.isShowBind = '0';
        this.$message.success('绑定成功');
      } else {
        this.isHasBinded = false;
        this.$message.error(bindUserRes.msg);
      }
    },
    openBindedDialog() {
      this.bindedDialogVisible = true;
    },
    async cancelBindByLiveId() {
      this.isLoading = true;
      const cancelBindWxRes = await cancelBindWx({ splid: this.liveId });
      this.isLoading = false;
      if (cancelBindWxRes.success) {
        // 提示解绑成功
        this.$message.success('解绑成功');
        this.isHasBinded = false;
        this.bindedDialogVisible = false;
      } else {
        // 提示解绑失败
        this.$message.error(cancelBindWxRes.msg);
      }
    },
  },
  props: {
    onlyDialogMode: {
      type: Boolean,
      default: false,
    },
    liveId: {
      type: String,
      default: '',
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.clearLoopTimer();
  },
};
</script>

<style lang="less" scoped>
.bindHostNew {
  .bind-user {
    display: flex;
    align-items: center;
    .bind-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .headImg {
        width: 48px;
        height: 48px;
        border-radius: 41px;
      }
      .name {
        margin-left: 10px;
        color: #333333;
        font-size: 18px;
      }

      .phone {
        margin-left: 10px;
        color: #333333;
        font-size: 18px;
      }
    }
    .edit {
      width: 80px;
      height: 60px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #f01e44;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .bindBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    .bindItem {
      display: flex;
      .key {
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
      }
      .phoneInput {
        width: 319px;
      }
    }
    .gap {
      font-size: 16px;
      font-weight: 400;
      color: #000000;
    }
    .qrcodeBindWrap {
      margin-top: 10px;
      background: #f4f6f7;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      flex-direction: column;
      width: 161px;
      height: 229px;
      .qrcode {
        width: 100px;
        height: 100px;
      }
      .qrText {
        font-size: 16px;
        font-weight: 400;
        color: #1890ff;
        margin-top: 10px;
        p {
          text-align: center;
          line-height: 25px;
        }
      }
    }
    .benifit {
      width: 406px;
      line-height: 1.8;
      font-size: 12px;
      color: #666666;
      margin-top: 20px;
    }
  }
}
</style>
