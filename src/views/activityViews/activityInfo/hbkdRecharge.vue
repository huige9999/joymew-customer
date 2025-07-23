<template>
  <sub-page>
    <div class="set-company-container">
      <main-card>
        <card-top-info title="红包口袋充值(请用支付宝扫码充值!)"></card-top-info>
        <div class="recharge-info">
          <div class="balance-box">
            <div class="title" style="width: 100px">红包账户余额</div>
            <div class="info">{{ hbBalance }}</div>
          </div>
          <div class="recharge-box">
            <div class="title" style="width: 100px">充值金额</div>
            <div class="do-recharge">
              <el-input v-model="rechargeAmount" style="margin-bottom: 10px" @input="reChargeInputChange">
                <div slot="suffix" class="recharge-unit" style="margin-top: 10px; margin-right: 20px">元</div>
              </el-input>
              <div class="btn-group">
                <el-button type="primary" @click="confirmRecharge">确认充值</el-button>
                <el-button type="info" @click="cancelRecharge">取消</el-button>
              </div>
              <div class="erweima-container" v-show="isShowErweima">
                <div class="text1" style="padding: 15px">支付宝支付</div>
                <div class="text2" style="padding-left: 15px; padding-bottom: 10px">
                  红包充值金额&nbsp;&nbsp;<span>￥{{ rechargeAmount }}</span>
                </div>
                <div class="erweima-box" style="margin-left: 17px">
                  <div class="erweima">
                    <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
                  </div>
                  <el-button
                    type="primary"
                    @click="DoneRecharge"
                    size="small"
                    style="height: 40px;position:absolute;left:185px;bottom:90px;"
                    >已完成支付</el-button
                  >
                </div>
              </div>
            </div>
            <div class="tip">提示：输入金额后会出现支付宝二维码，用支付宝扫码充值!</div>
          </div>
        </div>
      </main-card>
      <main-card v-if="templateChooseVisile">
        <card-top-info title="选择红包口袋模板"></card-top-info>
        <div class="templateChoose">
          <div class="templateItem" v-for="item in templateList" :key="item.id" @click="chooseTemplateItem(item.id)">
            <div class="templateTitle">{{ item.title }}</div>
            <div class="templateBox">
              <img :src="item.imgPath" class="templateImg" />
            </div>
            <el-radio v-model="choosedTemplateId" :label="item.id" class="chooseRadio" @click.native.prevent>选择此模板</el-radio>
          </div>
        </div>
        <el-button type="primary" @click="saveTemplate" class="saveBtn" v-loading="isLoading">保存</el-button>
      </main-card>
    </div>
    <el-dialog class="newUserRechargeTipDialog" :visible.sync="newUserRechargeTipDialogVisible" width="780px" center>
      <template slot="title">
        <div class="newUserRechargeTitle">充值失败</div>
      </template>
      <div class="newUserRechargeMain">
        <img src="https://ustatic.hudongmiao.com/miao/app/cp-qrcode.png" class="kefuImg" />
        <div class="tipText">新手<label>暂无红包充值权限</label>，请添加客服微信申请开通</div>
        <el-button type="primary" class="getItBtn" @click="newUserRechargeTipDialogVisible = false">
          我知道了
        </el-button>
      </div>
    </el-dialog>
  </sub-page>
</template>
<script>
import { editActivityInfo } from '@/api/setting/activitySetting/activity';
import { getActivityMsg, getHbyErweima2 } from '@/api/setting/activitySetting/gameSetting';
import { getHBKDTemplateBySceneType } from '@/assets/constant/default';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import { judgeIsHttps } from '@/utils/index';
import { mapState } from 'vuex';

export default {
  name: 'hbkdRecharge',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  computed: {
    ...mapState({
      sceneType: (state) => state.sceneType,
      highPrivilege: (state) => state.login.userInfo.high_privilege,
    }),
    templateChooseVisile() {
      return !/^5[1-4]$/.test(this.sceneType) && this.highPrivilege !== 3 && this.highPrivilege !== 4 && this.highPrivilege !== 5;
    },
    isNewUser() {
      const { is_hide_tx } = this.$store.state.login.userInfo.config;
      return is_hide_tx;
    },
  },
  data() {
    return {
      // 红包账户余额
      hbBalance: 0,
      // 充值金额
      rechargeAmount: 0,
      erweimaHtml: '',
      isShowErweima: false,
      templateList: [
        {
          id: '1',
          title: '模板一：财富满满',
          imgPath: '',
          value: [],
        },
        {
          id: '2',
          title: '模板二：喜气洋洋',
          imgPath: '',
          value: [],
        },
        {
          id: '3',
          title: '模板三：情意绵绵',
          imgPath: '',
          value: [],
        },
      ],
      choosedTemplateObj: {},
      choosedTemplateId: '2',
      isLoading: false,
      newUserRechargeTipDialogVisible: false,
    };
  },
  created() {
    if (this.templateChooseVisile) {
      this.initTemplateInfo();
    }
  },
  methods: {
    // 获取账户余额
    getBalance() {
      getActivityMsg({
        id: this.$store.state.liveId,
      }).then((res) => {
        console.log('余额', res);
        this.hbBalance = res.data.balance;
      });
    },
    reChargeInputChange() {
      // 隐藏二维码相关区域
      this.isShowErweima = false;
    },
    confirmRecharge() {
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(this.rechargeAmount) || this.rechargeAmount === 0 || this.rechargeAmount === '0') {
        this.$message.error('请输入合法的金额');
        return;
      }
      if (this.isNewUser) {
        this.newUserRechargeTipDialogVisible = true;
        return;
      }
      this.isShowErweima = true;
      this.requestErweima(this.rechargeAmount);
    },
    cancelRecharge() {
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    requestErweima(rechargeAmount) {
      const data = {
        splid: this.$store.state.liveId,
        money: rechargeAmount,
        pay_type: 'alipay',
        isHttps: judgeIsHttps(),
      };
      getHbyErweima2(data).then((res) => {
        // this.erweimaHtml = `${res}?id=${new Date().getTime()}`;
        // console.log('erweima', this.erweimaHtml);
        // this.$forceUpdate();
        console.log('信息:', res);
        this.erweimaHtml = `${res.data.order}`;
      });
    },
    DoneRecharge() {
      // 及时更新账户余额
      this.getBalance();
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    chooseTemplateItem(templateId) {
      if (this.choosedTemplateId === templateId) {
        this.choosedTemplateId = '0';
        return;
      }
      this.choosedTemplateId = templateId;
    },
    saveTemplate() {
      if (this.isLoading) {
        return;
      }
      let targetTemplateItemStr;
      if (this.choosedTemplateId && this.choosedTemplateId !== '0') {
        const choosedTemplateItem = this.templateList.find((item) => item.id === this.choosedTemplateId);
        const targetTemplateItem = {
          id: choosedTemplateItem.id,
          title: choosedTemplateItem.title,
          value: choosedTemplateItem.value,
        };
        this.choosedTemplateObj[this.sceneType] = targetTemplateItem;
        targetTemplateItemStr = JSON.stringify(this.choosedTemplateObj);
      } else {
        targetTemplateItemStr = '0';
      }
      console.log('choosedTemplateItemStr:', targetTemplateItemStr);
      this.isLoading = true;
      editActivityInfo({
        hbkd_str: targetTemplateItemStr,
      })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message.success('设置成功~');
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('设置失败!');
        });
    },
    initTemplateInfo() {
      const tmpTemplateInfo = getHBKDTemplateBySceneType(this.sceneType);
      // const tmpLen = tmpTemplateInfo.length;
      // for (let i = 0; i < tmpLen; i += 1) {
      // this.templateList[i].title = tmpTemplateInfo[i].title;
      // this.templateList[i].imgPath = tmpTemplateInfo[i].imgPath;
      // this.templateList[i].value = tmpTemplateInfo[i].value;
      // }
      this.templateList = tmpTemplateInfo.map((item, index) => {
        return {
          id: `${index + 1}`,
          ...item,
        };
      });
      getActivityMsg({ id: this.$store.state.liveId })
        .then((res) => {
          console.log(res);
          const tmpHbkdStr = res.data.userInfo.hbkd_str;
          if (!tmpHbkdStr || tmpHbkdStr === '0') {
            return;
          }
          const tmpHbkdObj = JSON.parse(tmpHbkdStr);
          // 旧版数据结构 废弃
          // {id,title,value:{[sceneType]:[]}}
          if (tmpHbkdObj.value && typeof tmpHbkdObj.value === 'object') {
            this.choosedTemplateId = '0';
          } else {
            // 新版数据结构
            // {[sceneType]: {id,title,value:[]}}
            // choosedTemplateObj 初始化
            this.choosedTemplateObj = tmpHbkdObj;
            // choosedTemplateId初始化
            if (tmpHbkdObj[this.sceneType]) {
              this.choosedTemplateId = tmpHbkdObj[this.sceneType].id;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.recharge-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  .balance-box {
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .info {
      margin-left: 40px;
      font-size: 27px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      letter-spacing: 1px;
    }
  }
  .recharge-box {
    display: flex;
    margin-top: 40px;
    padding-bottom: 30px;
    .title {
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .do-recharge {
      margin-left: 40px;
      .btn-group {
        display: flex;
        align-items: center;
        margin-top: 30px;
      }
      .erweima-container {
        margin-top: 30px;
        width: 449px;
        border: 1px solid #eeeeee;
        position: relative;
        .text1 {
          font-size: 14px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          color: #249aff;
        }
        .text2 {
          font-size: 14px;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #6f7682;
          span {
            font-size: 18px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: #fb466c;
          }
        }
        .erweima-box {
          display: flex;
          align-items: center;
          .erweima {
            width: 311px;
            height: 184px;
            margin-right: 20px;
          }
        }
      }
    }
    .tip {
      font-size: 12px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
      margin-left: 20px;
    }
  }
}
.templateChoose {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  row-gap: 40px;
  .templateItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .templateTitle {
      font-size: 21px;
      font-weight: 500;
      color: #000000;
    }
    .templateBox {
      width: 225px;
      height: 334px;
      background: #e9f3fe;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      .templateImg {
        width: 170px;
        height: 314px;
      }
    }
    .chooseRadio {
      margin-top: 24px;
    }
  }
}
.saveBtn {
  margin: 36px auto;
}
.newUserRechargeTipDialog {
  .newUserRechargeTitle {
    font-size: 28px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .newUserRechargeMain {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .kefuImg {
      width: 194px;
      height: 189px;
    }
    .tipText {
      font-size: 24px;
      font-weight: 400;
      color: #000000;
      margin-top: 50px;
      label {
        color: #fb466c;
      }
    }
    .getItBtn {
      margin-top: 40px;
    }
    &::after {
      content: '';
      display: block;
      width: 780px;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
      position: absolute;
      top: 200px;
    }
  }
}
</style>
