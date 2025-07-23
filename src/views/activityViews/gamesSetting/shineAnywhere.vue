<!--签到红包-->
<template>
  <sub-page>
    <!-- 充值到红包口袋余额板块 -->
    <main-card>
      <card-top-info title="签到红包"><span class="subTxt">（来宾扫码签到后可以领取红包，适用于年会、发布会等场合）</span></card-top-info>
      <div class="rechargeInfo">
        <div class="rechargeBox">
          <div class="key">充值金额：</div>
          <div class="doRecharge">
            <el-input class="charge-input" v-model="moneyRecharge" @input="handleRechargeInputChange">
              <div slot="suffix" class="unit">元</div>
            </el-input>
            <span class="rechargeTip">（充值金额将到账红包口袋）</span>
          </div>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="confirmRecharge">确认充值</el-button>
          <el-button type="info" @click="cancelRecharge">取消</el-button>
        </div>
        <div class="qrcodeArea" v-show="qrcodeRechargeVisible">
          <div class="text1">支付宝支付</div>
          <div class="text2">
            红包充值金额<span>￥{{ moneyRecharge }}</span>
          </div>
          <div class="qrcodeBox">
            <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
          </div>
          <el-button type="primary" @click="doneRecharge" class="doneRechargeBtn" size="small">已完成支付</el-button>
        </div>
      </div>
    </main-card>
    <!-- 红包口袋余额板块 -->
    <main-card>
      <card-top-info title="红包余额"><span class="subTxt">（红包口袋余额与签到红包余额可以相互转账）</span></card-top-info>
      <div class="hbkd-container">
        <div class="hb-account-remain">
          <div class="remain-num-label">
            签到红包余额：<span class="remain-num">{{ signHbRemain || 0 }}</span>
          </div>
          <div class="turn-to-other-account" @click="showZhuanDialog('1')">转账至红包口袋</div>
        </div>
        <div class="hb-account-remain">
          <div class="remain-num-label">
            红包口袋余额：<span class="remain-num">{{ hbkdRemain || 0 }}</span>
          </div>
          <div class="turn-to-other-account" @click="showZhuanDialog('2')">转账至签到红包</div>
        </div>
      </div>
    </main-card>
    <!-- 签到红包设置板块 -->
    <main-card>
      <card-top-info title="签到红包设置"><span class="subTxt">（金额发送完之后的用户不再获得红包）</span></card-top-info>
      <div class="sign-bg-config">
        <el-form ref="signHbForm" :model="signHbConfigForm" :rules="signConfigFormRule">
          <el-form-item label="发放数量:" prop="hb_num">
            <el-input-number v-model="signHbConfigForm.hb_num" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="选择红包类型:" prop="hb_type">
            <div class="hb-type-item">
              <el-radio-group v-model="signHbConfigForm.hb_type">
                <el-radio :label="hbType.value" v-for="hbType in hbTypesMap" :key="hbType.value">
                  {{ hbType.txt }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="红包最大金额:" prop="max_hb" class="input-item" v-if="signHbConfigForm.hb_type === '1'">
            <div class="input-container">
              <el-input placeholder="请输入" v-model="signHbConfigForm.max_hb" class="num-input"></el-input>元
            </div>
          </el-form-item>
          <el-form-item label="红包最小金额:" prop="min_hb" class="input-item" v-if="signHbConfigForm.hb_type === '1'">
            <div class="input-container">
              <el-input placeholder="请输入" v-model="signHbConfigForm.min_hb" class="num-input"></el-input>元
            </div>
          </el-form-item>
        </el-form>
        <div class="avarge-hb-tip" v-show="signHbConfigForm.hb_type === '2'">{{ `扫码签到后，可领到${avarageNum}元` }}</div>
        <div class="confirm-btn" @click="confirmSignHbFormConfig">确认保存</div>
      </div>
    </main-card>
    <!-- 红包封面设置 -->
    <main-card>
      <card-top-info title="红包封面设置"></card-top-info>
      <div class="hb-style-config">
        <div class="config-form">
          <el-form ref="hbStyleForm" :model="hbConfigForm" label-width="130px" label-position="right">
            <el-form-item label="上传红包头像:" class="display-inline">
              <el-upload v-if="!hbConfigForm.avator" :http-request="handlerBgUpload" action :limit="1" :show-file-list="false">
                <div class="add-container"></div>
              </el-upload>
              <div class="show-img" v-else>
                <img :src="hbConfigForm.avator" class="choose-img" />
                <img src="~@/assets/image/hotel/close.png" class="close-icon" @click="removeAvator" />
              </div>
            </el-form-item>
            <el-form-item label="主办方名称:" class="display-inline">
              <el-input class="style-config-input" placeholder="请输入主办方名称" v-model="hbConfigForm.organizer" clearable></el-input>
            </el-form-item>
            <el-form-item label="祝福语:" class="display-inline">
              <div class="hb-config-input-container">
                <el-input
                  class="style-config-input"
                  placeholder="例：欢迎参加本次活动"
                  v-model="hbConfigForm.bless.lineOne"
                  clearable
                ></el-input>
                <el-input class="style-config-input" placeholder="签到红包送给你" v-model="hbConfigForm.bless.lineTwo" clearable></el-input>
              </div>
            </el-form-item>
          </el-form>
          <div class="save-hb-style-btn" :class="{ canSave: canSave }" @click="saveHbStyleConfig">确认保存</div>
        </div>
        <div class="config-preview">
          <div class="content-container">
            <div class="preview-header">{{ hbConfigForm.organizer || '主办方名称' }}</div>
            <img :src="hbConfigForm.avator || defaultAvator" class="organizer-avator" />
            <div class="bless">{{ hbConfigForm.bless.lineOne || '欢迎参加本次活动' }}</div>
            <div class="bless" :style="{ marginBottom: '16px' }">{{ hbConfigForm.bless.lineTwo || '签到红包送给你' }}</div>
            <img src="~@/assets/image/hb-config/kai-icon.png" class="kai-icon" />
            <div class="tip">注：红包由{{ hbConfigForm.organizer || '主办方' }}送出</div>
          </div>
        </div>
      </div>
    </main-card>
    <!-- 转账弹窗 -->
    <el-dialog
      :title="currentZhuanType === '1' ? '转账至红包口袋' : '转账至签到红包'"
      :visible.sync="isShowZhuan"
      width="30%"
      :before-close="closeZhuanDialog"
    >
      <div class="dialog-container" v-if="!isZhuanSuccess">
        <el-form
          ref="zhuanForm"
          :model="dialogForm"
          label-width="120px"
          label-position="right"
          :rules="dialogFormRule"
          :destroy-on-close="true"
        >
          <el-form-item :label="currentZhuanType === '1' ? '签到红包余额：' : '红包口袋余额：'">
            <div class="remain-item">{{ dialogForm.remain }}</div>
          </el-form-item>
          <el-form-item label="转账金额：" prop="zhuan_num">
            <el-input v-model="dialogForm.zhuan_num" placeholder="请输入转账金额"></el-input>
          </el-form-item>
          <div class="zhuanTip">注意：平台将代为扣取5%作为微信技术服务费及提现手续费</div>
        </el-form>
      </div>
      <div class="dialog-container" v-else>
        <img src="~@/assets/image/hb-config/success-tick.png" class="success-icon" />
        <div class="success-tip">转账成功</div>
      </div>
      <div class="dialog-footer">
        <el-button @click="closeZhuanDialog">取 消</el-button>
        <el-button type="primary" @click="confirmBtnHandler">确 定</el-button>
      </div>
    </el-dialog>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopWithSubTxt.vue';
import { shineAnywhereSetting, getHbyErweima2, zhuanZhangAccount } from '@/api/setting/activitySetting/gameSetting';
import { getActivity } from '@/api/setting/activitySetting/theme';
import request from '@/utils/request';
import { mapState } from 'vuex';

export default {
  name: 'shineAnywhere',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      moneyRecharge: 0,
      qrcodeRechargeVisible: false,
      rechargeTipVisible: false,
      erweimaHtml: '',
      isShowZhuan: false, // 是否打开转账弹窗
      currentZhuanType: '1', // 转账弹窗类型: 1 -> 转账至红包口袋; 2 -> 转账至签到红包
      // 签到红包类型
      hbTypesMap: [
        {
          txt: '随机红包',
          value: '1',
        },
        {
          txt: '平均红包',
          value: '2',
        },
      ],
      // 签到红包设置
      signHbConfigForm: {
        hb_num: 1,
        hb_type: '1',
        max_hb: '',
        min_hb: '',
      },
      // 签到红包表单验证规则
      signConfigFormRule: {
        hb_num: [{ required: true, message: '请输入发送数量', trigger: 'blur' }],
        hb_type: [{ required: true, message: '请选择红包类型', trigger: 'blur' }],
        max_hb: [
          { required: true, message: '请输入最大金额', trigger: 'blur' },
          { validator: this.validateMaxMoney, trigger: 'blur' },
        ],
        min_hb: [
          { required: true, message: '请输入最小金额', trigger: 'blur' },
          { validator: this.validateMinMoney, trigger: 'blur' },
        ],
      },
      signHbRemain: 0, // 签到红包余额
      hbkdRemain: 0, // 红包口袋余额
      isLoading: false,
      // 红包封面设置
      hbConfigForm: {
        avator: '',
        organizer: '',
        bless: {
          lineOne: '',
          lineTwo: '',
        },
      },
      dialogForm: {
        remain: 0,
        zhuan_num: '',
      },
      isZhuanSuccess: false, // 是否转账成功
      dialogFormRule: {
        zhuan_num: [
          { required: true, message: '请输入发送数量', trigger: 'blur' },
          { validator: this.validateZhuanNum, trigger: 'blur' },
        ],
      },
      defaultAvator: 'http://ustatic.joymew.com/emcee/common/b51d744c7b3f4f379d3f7f989c295daf',
    };
  },
  computed: {
    ...mapState({
      splid: (state) => state.liveId,
    }),
    avarageNum() {
      return Number(this.signHbRemain / this.signHbConfigForm.hb_num).toFixed(2);
    },
    canSave() {
      let flag = false;
      Object.keys(this.hbConfigForm).some((key) => {
        if (key === 'bless') {
          Object.keys(this.hbConfigForm.bless).some((subKey) => {
            if (this.hbConfigForm.bless[subKey]) {
              flag = true;
              return true;
            }
            return false;
          });
        }
        if (this.hbConfigForm[key]) {
          flag = true;
          return true;
        }
        return false;
      });
      return flag;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    // 处理二维码充值已打开时，修改充值金额，则关闭充值窗口
    handleRechargeInputChange() {
      this.qrcodeRechargeVisible = false;
    },
    // 点击确认充值
    confirmRecharge() {
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(this.moneyRecharge) || this.moneyRecharge === 0 || this.moneyRecharge === '0') {
        this.$message.error('请输入合法的金额');
        return;
      }
      this.qrcodeRechargeVisible = true;
      this.getQrcodeInfo();
    },
    // 点击取消充值
    cancelRecharge() {
      this.qrcodeRechargeVisible = false;
      this.moneyRecharge = 0;
    },
    // 点击完成充值，刷新页面数据
    doneRecharge() {
      this.qrcodeRechargeVisible = false;
      this.moneyRecharge = 0;
      this.initData();
    },
    // 检查随机红包最大金额是否合法的方法
    validateMaxMoney(rule, value, callback) {
      const reg = /^\d+(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error('数字非法'));
      } else if (parseFloat(value) <= 0) {
        callback(new Error('最大金额必须大于0'));
      } else if (parseFloat(value) > parseFloat(this.signHbRemain)) {
        callback(new Error('最大金额不能超过可用余额'));
      } else if (parseFloat(value) < parseFloat(this.signHbConfigForm.min_hb)) {
        callback(new Error('最大金额不能小于最小金额'));
      } else {
        callback();
      }
    },
    // 检查随机红包最小金额是否合法的方法
    validateMinMoney(rule, value, callback) {
      const reg = /^\d+(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error('数字非法'));
      } else if (parseFloat(value) < 0.33) {
        callback(new Error('最小金额必须大于等于0.33'));
      } else if (parseFloat(value) > parseFloat(this.signHbRemain)) {
        callback(new Error('最小金额不能超过可用余额'));
      } else if (parseFloat(value) > parseFloat(this.signHbRemain)) {
        callback(new Error('最小金额不能大于最大金额'));
      } else {
        callback();
      }
    },
    // 验证平均红包的情况下单个红包的金额需要大于等于0.33
    // 非平均红包的情况下可用余额需要在[最小金额*发送数量,最大金额*发送数量]之间
    validateSingleHb() {
      if (this.signHbConfigForm.hb_type === '2') {
        if (Number(this.avarageNum) < 0.33) {
          this.$message.error('单个红包金额不能小于0.33');
          return false;
        }
      } else if (this.signHbConfigForm.hb_type === '1') {
        if (this.signHbRemain < this.signHbConfigForm.min_hb * this.signHbConfigForm.hb_num || this.signHbRemain > this.signHbConfigForm.max_hb * this.signHbConfigForm.hb_num) {
          this.$message.error('可用余额不在范围内');
          return false;
        }
      }
      return true;
    },
    // 提交保存签到红包设置
    confirmSignHbFormConfig() {
      this.$refs.signHbForm.validate((valid) => {
        if (valid && this.validateSingleHb()) {
          let tmpSunDataJsonObj;
          // 随机红包
          if (this.signHbConfigForm.hb_type === '1') {
            tmpSunDataJsonObj = {
              maxmoney: this.signHbConfigForm.max_hb,
              minmoney: this.signHbConfigForm.min_hb,
              type: '1',
            };
          } else if (this.signHbConfigForm.hb_type === '2') {
            // 平均红包
            tmpSunDataJsonObj = {
              type: '2',
            };
          }
          const tmpSunDataJsonStr = JSON.stringify(tmpSunDataJsonObj);
          this.isLoading = true;
          shineAnywhereSetting({
            splid: this.splid,
            sun_remain_size: this.signHbConfigForm.hb_num,
            sun_data_json: tmpSunDataJsonStr,
          })
            .then((res) => {
              console.log(res);
              this.$message.success('设置成功');
              this.initData();
              this.isLoading = false;
            })
            .catch((err) => {
              console.log(err);
              this.$message.error('设置失败');
              this.isLoading = false;
            });
          return true;
        }
        return false;
      });
    },
    // 获取支付宝付款二维码的方法
    getQrcodeInfo() {
      getHbyErweima2({
        splid: this.$store.state.liveId,
        pay_type: 'alipay',
        isHttps: '1',
        money: this.moneyRecharge,
      })
        .then((res) => {
          console.log(res);
          this.erweimaHtml = `${res.data.order}`;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 初始化页面数据的方法
    initData() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log('活动信息:', res.data);
        // res.data.sun_money_all res.data.sun_money_remain res.data sun_remain_size
        this.hbkdRemain = res.data.balance || 0;
        this.signHbRemain = res.data.sun_money_remain || 0;

        this.signHbConfigForm.hb_num = res.data.sun_remain_size || 0;

        // 签到红包配置数据
        const tmpSunDataJsonStr = res.data.sun_data_json;
        if (tmpSunDataJsonStr) {
          const tmpSunDataJsonObj = JSON.parse(tmpSunDataJsonStr);
          const { type, maxmoney, minmoney } = tmpSunDataJsonObj;
          // 随机红包
          if (!type) return;
          this.signHbConfigForm.hb_type = type;
          if (type === '1') {
            this.signHbConfigForm.max_hb = maxmoney;
            this.signHbConfigForm.min_hb = minmoney;
          }
        }

        // 红包样式配置数据
        const tmpStyleDataJson = res.data.sun_info_json;
        if (tmpStyleDataJson) {
          const tmpStyleData = JSON.parse(tmpStyleDataJson);
          Object.keys(tmpStyleData).forEach((key) => {
            if (tmpStyleData[key]) {
              this.hbConfigForm[key] = tmpStyleData[key];
            }
          });
        }
      });
    },
    // 上传背景的接口
    handlerBgUpload(e) {
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.hbConfigForm.avator = freader.result;
        this.requestUploadFileNoCompress(e.file);
      };
    },
    requestUploadFileNoCompress(file) {
      const formData = new FormData();
      formData.append('file', file);
      request
        .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
        .then((res) => {
          console.log(res);
          this.$message.success('图片上传成功!');
          this.hbConfigForm.avator = res.data.filePath;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    // 删除选中的红包头像
    removeAvator() {
      this.hbConfigForm.avator = '';
    },
    showZhuanDialog(type) {
      this.currentZhuanType = type;
      this.isShowZhuan = true;
      const remain = type === '1' ? this.signHbRemain : this.hbkdRemain;
      this.dialogForm.remain = remain;
    },
    closeZhuanDialog() {
      this.dialogForm.remain = 0;
      this.dialogForm.zhuan_num = '';
      this.isShowZhuan = false;
      this.isZhuanSuccess = false;
    },
    // 验证转账金额
    validateZhuanNum(rule, value, callback) {
      console.log('验证方法', value);
      const reg = /^\d+(?=\.{0,1}\d+$|$)/;
      if (!reg.test(value)) {
        callback(new Error('最大金额必须是数字'));
      } else if (value <= 0) {
        callback(new Error('最大金额必须大于0'));
      } else if (Number(value) > Number(this.dialogForm.remain)) {
        callback(new Error('余额不足，请重新输入转账金额'));
      } else {
        callback();
      }
    },
    // 转账的方法
    confirmBtnHandler() {
      if (!this.isZhuanSuccess) {
        this.$refs.zhuanForm.validate(async (res) => {
          if (res) {
            await zhuanZhangAccount(this.splid, this.currentZhuanType, String(this.dialogForm.zhuan_num));
            this.initData();
            // 转账成功，显示转账成功
            this.isZhuanSuccess = true;
          }
        });
      } else {
        this.closeZhuanDialog();
      }
    },
    // 保存红包样式的配置
    saveHbStyleConfig() {
      const target = JSON.stringify(this.hbConfigForm);
      shineAnywhereSetting({
        splid: this.splid,
        sun_info_json: target,
      })
        .then((res) => {
          console.log(res);
          this.$message.success('设置成功');
          this.initData();
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('设置失败');
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.subTxt {
  color: rgba(0, 0, 0, 0.25);
  font-size: 25px;
}
.rechargeInfo {
  padding: 13px 0px 35px 20px;
  .rechargeBox {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    .key {
      font-size: 14px;
      font-weight: 400;
      color: #6f7682;
    }
    .doRecharge {
      margin-left: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .unit {
        margin-top: 10px;
        margin-right: 20px;
      }
      .charge-input {
        margin-right: 5px;
      }
      .rechargeTip {
        flex-shrink: 0;
        font-size: 18px;
        margin-left: 10px;
      }
    }
  }

  .btnGroup {
    margin-top: 30px;
    margin-left: 100px;
  }
  .qrcodeArea {
    margin-top: 30px;
    margin-left: 50px;
    width: 449px;
    border: 1px solid #eeeeee;
    position: relative;
    .text1 {
      font-size: 14px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #249aff;
      padding: 15px;
    }
    .text2 {
      padding-left: 15px;
      padding-bottom: 10px;
      span {
        font-size: 18px;
        font-weight: 500;
        color: #fb466c;
      }
    }
    .qrcodeBox {
      margin-left: 17px;
      display: flex;
      align-items: center;
    }
    .doneRechargeBtn {
      height: 40px;
      position: absolute;
      left: 185px;
      bottom: 80px;
    }
  }
}
.hbkd-container {
  width: 100%;
  padding-bottom: 27px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .hb-account-remain {
    display: flex;
    flex-direction: column;
    align-items: center;
    .remain-num-label {
      margin-bottom: 36px;
      font-size: 21px;
      .remain-num {
        color: #fb466c;
        font-size: 43px;
        font-weight: bold;
      }
    }
    .turn-to-other-account {
      width: fit-content;
      padding: 10px 27px;
      box-sizing: border-box;
      background-color: #1e87f0;
      letter-spacing: 3px;
      border-radius: 4px;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
}
.sign-bg-config {
  padding: 0 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
  .avarge-hb-tip {
    width: fit-content;
    margin-left: 110px;
    margin-top: -20px;
    margin-bottom: 40px;
    padding: 4px 30px;
    box-sizing: border-box;
    background-color: rgba(30, 135, 240, 0.1);
    border-radius: 3px;
    font-size: 12px;
    color: #1e87f0;
  }
  .confirm-btn {
    width: fit-content;
    margin-left: 100px;
    padding: 10px 16px;
    box-sizing: border-box;
    background-color: #1e87f0;
    border-radius: 4px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
  .input-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .input-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .num-input {
        width: 150px;
        margin-right: 10px;
      }
      .num-input /deep/.el-input__inner {
        width: 150px !important;
      }
    }
  }
}
.hb-style-config {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .config-form {
    flex: 1;
    .display-inline /deep/.el-form-item__content {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .hb-config-input-container {
      .style-config-input {
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
    .add-container {
      width: 88px;
      height: 88px;
      background-image: url('~@/assets/image/hb-config/add-icon.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .show-img {
      width: 88px;
      height: 88px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
      .choose-img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: cover;
      }
      .close-icon {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        cursor: pointer;
      }
    }
    .save-hb-style-btn {
      width: fit-content;
      margin: 0 auto;
      margin-top: 50px;
      padding: 10px 16px;
      box-sizing: border-box;
      background-color: #979797;
      border-radius: 4px;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }
    .canSave {
      background-color: #1e87f0;
    }
  }
  .config-preview {
    flex-shrink: 0;
    width: 367px;
    height: 445px;
    padding: 36px;
    box-sizing: border-box;
    background-color: #e9f3fe;
    border-radius: 11px;
    .content-container {
      width: 100%;
      height: 100%;
      background-image: url('~@/assets/image/hb-config/hb-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      .preview-header {
        width: 206px;
        height: 40px;
        margin-bottom: 12px;
        padding: 0 30px;
        box-sizing: border-box;
        background-image: url('~@/assets/image/hb-config/banner-bg.png');
        background-size: 100% 100%;
        color: #ff7a00;
        font-size: 19px;
        text-align: center;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .organizer-avator {
        width: 81px;
        height: 81px;
        margin-bottom: 9px;
        padding: 0;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
      }
      .bless {
        color: #fff;
        font-size: 16px;
        margin-bottom: 5px;
      }
      .kai-icon {
        width: 116px;
        height: 116px;
        margin-bottom: 8px;
        cursor: pointer;
      }
      .tip {
        padding: 6px 12px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 21px;
        color: #fff;
        font-size: 9px;
      }
    }
  }
}
.dialog-container {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .remain-item {
    color: #fb466c;
    font-size: 40px;
    font-weight: bold;
  }
  .success-icon {
    width: 168px;
    height: 168px;
    margin-bottom: 36px;
  }
  .success-tip {
    margin-bottom: 37px;
    font-size: 27px;
  }
  .zhuanTip {
    color: #f56c6c;
    font-size: 12px;
    margin-bottom: 20px;
  }
}
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
