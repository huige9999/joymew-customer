<template>
  <sub-page>
    <!-- 游戏奖励金额设置 -->
    <div class="game-reward-header">
      <main-card>
        <card-top-info title="游戏奖励金额设置"></card-top-info>
        <!-- 第一行：红包账户金额和可用于游戏金额 -->
        <div class="reward-header-container">
          <div class="reward-logo">
            <img src="@/assets/image/redPackageRain/redpackage-logo.png" alt="" width="40" height="40" />
          </div>
          <div class="reward-account">
            <div class="title-text">红包账户金额</div>
            <div class="account-num">{{ hbBalance }}</div>
          </div>
          <div class="usable-amount">
            <div class="title-text">可用于游戏金额</div>
            <div class="amount-num">{{ usableAmount }}</div>
          </div>
          <div class="btn-group">
            <div class="recharge-btn" @click="showRechargeDialog">充值</div>
          </div>
        </div>

        <!-- 第二行：游戏发放金额和剩余可发放金额 -->
        <div class="reward-setting-container">
          <div class="reward-logo">
            <img src="@/assets/image/redPackageRain/redpackage-logo.png" alt="" width="40" height="40" />
          </div>
          <div class="game-issuance-amount">
            <div class="title-text">游戏发放金额</div>
            <div class="amount-num">{{ gameIssuanceAmount }}</div>
          </div>
          <div class="remaining-amount">
            <div class="title-text">剩余可发放金额</div>
            <div class="amount-num">{{ remainingAmount }}</div>
          </div>
        </div>
      </main-card>
    </div>

    <!-- 摇钱树游戏设置 -->
    <div class="money-tree-setting">
      <main-card>
        <card-top-info title="摇钱树游戏设置"></card-top-info>
        <div class="setting-container">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">游戏时间</span>
                </div>
                <div class="time-setting">
                  <el-input-number v-model="gameTime" :min="5" :max="120" controls-position="right"
                    size="small"></el-input-number>
                  <span class="unit">秒</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">领奖人数</span>
                </div>
                <div class="winner-setting">
                  <el-input-number v-model="winnerCount" :min="1" :max="10" controls-position="right"
                    size="small"></el-input-number>
                  <span class="unit">人</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 奖金设置 -->
        <div class="prize-setting">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span style="color: #dd0000">奖金设置: (金额只能为整数)</span>
            </div>
            <div class="prize-list">
              <el-row :gutter="20">
                <el-col :span="8" v-for="(prize, index) in prizeList" :key="index">
                  <div class="prize-item">
                    <span class="rank-label">第{{ index + 1 }}名:</span>
                    <el-input-number v-model="prize.amount" :min="0" :max="10000" :precision="0" :step="1"
                      controls-position="right" size="small" placeholder="0"></el-input-number>
                    <span class="unit">元</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="save-btn-container">
              <el-button type="primary" @click="savePrizeSettings">奖金设置保存</el-button>
            </div>
          </el-card>
        </div>
      </main-card>
    </div>

    <!-- 充值弹出框 -->
    <my-dialog :show="rechargeDialogIsShow">
      <div class="rechargeTitle" slot="title">
        <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
        <div class="title-text">红包账户充值:</div>
      </div>
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
            <span v-show="isShowShouxu">红包账户充值手续费为充值金额的8%</span>
            <div class="btn-group">
              <el-button type="primary" @click="confirmRecharge">确认充值</el-button>
              <el-button type="info" @click="cancelRecharge">取消</el-button>
            </div>
            <div class="erweima-container" v-show="isShowErweima">
              <div class="text1" style="padding: 15px">支付宝支付</div>
              <div class="text2" style="padding-left: 15px; padding-bottom: 10px">
                红包充值金额
                <span>￥{{ rechargeAmount }}</span>
              </div>
              <div class="erweima-box" style="margin-left: 17px">
                <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
              </div>
              <el-button type="primary" @click="DoneRecharge" size="small"
                style="height: 40px; position: absolute; left: 185px; bottom: 80px">
                已完成支付
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </my-dialog>
  </sub-page>
</template>

<script>
// 引入接口
import { reqUpdateMoneyShakeTreeData } from '@/api/gameSetting';
import { getActivityMsg, getHbyErweima2 } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import SubPage from '@/components/subPage';
import { judgeIsHttps } from '@/utils/index';

export default {
  name: 'MoneyShakeTree',
  data() {
    return {
      // 红包账户余额 (从接口获取)
      hbBalance: 0,
      // 扣点比例, 写死为0.92 (即扣8个点)
      deductionRatio: 0.92,
      // 游戏时间（秒）
      gameTime: 50,
      // 领奖人数
      winnerCount: 3,
      // 奖金列表
      prizeList: [],
      // 充值相关
      rechargeDialogIsShow: false,
      rechargeAmount: 0,
      isShowErweima: false,
      erweimaHtml: '',
      isShowShouxu: false,
    };
  },
  computed: {
    /**
     * @description: 可用于游戏金额 (业务规则 5)
     * @return {Number}
     */
    usableAmount() {
      // 计算方式：红包账户金额 * 扣点比例
      // 使用 Math.floor(...)/100 来截断多余小数位, 避免浮点数精度问题
      return Math.floor((this.hbBalance || 0) * this.deductionRatio * 100) / 100;
    },
    /**
     * @description: 游戏发放金额 (业务规则 2)
     * @return {Number}
     */
    gameIssuanceAmount() {
      // 计算方式: 奖金设置各项金额的累计和 (金额为整数)
      if (!this.prizeList || this.prizeList.length === 0) {
        return 0;
      }
      return this.prizeList.reduce((total, prize) => {
        const amount = parseInt(prize.amount, 10) || 0;
        return total + amount;
      }, 0);
    },
    /**
     * @description: 剩余可发放金额 (业务规则 1)
     * @return {Number}
     */
    remainingAmount() {
      // 计算方式: 可用于游戏金额 - 游戏发放金额
      const result = this.usableAmount - this.gameIssuanceAmount;
      // 保证结果不为负数，并保留两位小数
      return result < 0 ? 0 : parseFloat(result.toFixed(2));
    },
  },
  watch: {
    // 监听领奖人数变化 (业务规则 3)
    winnerCount(newCount) {
      this.handleWinnerCountChange(newCount);
    },
  },
  created() {
    // 组件创建时，获取初始账户余额
    this.getBalance();
    // 根据默认的领奖人数，初始化奖金列表
    this.handleWinnerCountChange(this.winnerCount);
  },
  methods: {
    /**
     * @description: 获取账户余额
     */
    getBalance() {
      getActivityMsg({
        id: this.$store.state.liveId,
      }).then((res) => {
        if (res.code === 200 && res.data) {
          console.log('获取余额成功', res);
          this.hbBalance = res.data.balance || 0;

          try {
            const moneyTreeConfigStr = res.data.money_tree_json;
            if (moneyTreeConfigStr) {
              const config = JSON.parse(moneyTreeConfigStr);
              this.gameTime = parseInt(config.time, 10) || this.gameTime;
              this.winnerCount = parseInt(config.size, 10) || this.winnerCount;
              // 更新 prizeList 以匹配新的 winnerCount
              this.handleWinnerCountChange(this.winnerCount);

              // 填充奖金金额
              for (let i = 0; i < this.winnerCount; i++) {
                const rankKey = `rank${i + 1}`;
                if (Object.prototype.hasOwnProperty.call(config, rankKey)) {
                  // 确保 prizeList[i] 存在（handleWinnerCountChange 应该已处理）
                  if (this.prizeList[i] !== undefined) {
                    this.prizeList[i].amount = parseInt(config[rankKey], 10) || 0;
                  }
                }
              }
            }
          } catch (parseError) {
            console.error('解析摇钱树配置失败:', parseError);
            this.$message.warning('解析历史配置失败，使用默认配置');
            // 如果解析失败，可能需要重置为默认值或保持当前值
            this.handleWinnerCountChange(this.winnerCount); // 确保列表长度正确
          }
        } else {
          this.$message.error(res.msg || '获取账户余额失败');
          this.hbBalance = 0;
        }
      }).catch((err) => {
        console.error('获取账户余额接口异常', err);
        this.$message.error('获取账户余额接口异常');
        this.hbBalance = 0;
      });
    },

    // 显示充值弹框
    showRechargeDialog() {
      this.rechargeDialogIsShow = true;
    },

    // 确认充值 显示二维码
    confirmRecharge() {
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(this.rechargeAmount) || Number(this.rechargeAmount) <= 0) {
        this.$message.error('请输入合法的充值金额');
        return;
      }
      this.isShowErweima = true;
      this.requestErweima(this.rechargeAmount);
    },

    // 金额输入框改变触发
    reChargeInputChange() {
      // 隐藏二维码相关区域
      this.isShowErweima = false;
    },

    // 取消充值 关闭弹框
    cancelRecharge() {
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },

    /**
     * @description: 已完成支付 (接口文档 1.2)
     */
    DoneRecharge() {
      this.getBalance(); // 重新获取余额
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },

    // 请求支付二维码
    requestErweima(rechargeAmount) {
      const data = {
        splid: this.$store.state.liveId,
        money: rechargeAmount,
        pay_type: 'alipay',
        isHttps: judgeIsHttps(),
      };
      getHbyErweima2(data).then((res) => {
        if (res.code === 200 && res.data.order) {
          console.log('支付二维码返回结果:', res.data.order);
          this.erweimaHtml = `${res.data.order}`;
        } else {
          this.$message.error(res.msg || '获取支付二维码失败');
          this.isShowErweima = false;
        }
      });
    },

    /**
     * @description: 保存奖金设置 (业务规则 4)
     */
    savePrizeSettings() {
      // 校验：游戏发放金额不能超过可用于游戏的金额
      if (this.gameIssuanceAmount > this.usableAmount) {
        this.$message.error('游戏发放总金额已超出可用于游戏的金额，请调整！');
        return;
      }
      const isAnyAmountZero = this.prizeList.some((prize) => (parseInt(prize.amount, 10) || 0) <= 0);
      if (isAnyAmountZero) {
        this.$message.error('每一名的奖金金额必须大于0，请调整！');
        return;
      }
      // 构建后端要求的数据格式
      const settingsData = {
        size: this.winnerCount.toString(),
        time: this.gameTime.toString(),
      };
      // 添加排名奖金 (金额为整数)
      for (let i = 0; i < this.winnerCount; i++) {
        const amount = parseInt(this.prizeList[i]?.amount, 10) || 0;
        settingsData[`rank${i + 1}`] = amount.toString();
      }
      // 转换为JSON字符串
      const jsonString = JSON.stringify(settingsData);
      console.log('保存的奖金设置JSON:', jsonString);

      // 调用新导入的 API 接口
      reqUpdateMoneyShakeTreeData(jsonString)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '奖金设置保存成功!',
              type: 'success',
            });
          } else {
            this.$message.error(res.msg || '保存失败');
          }
        })
        .catch((err) => {
          console.error('保存奖金设置接口异常', err);
          this.$message.error('保存奖金设置接口异常');
        });
    },

    /**
     * @description: 监听领奖人数变化，动态调整奖金列表 (业务规则 3)
     */
    handleWinnerCountChange(count) {
      const newCount = count || 0;
      const currentCount = this.prizeList.length;

      if (newCount > currentCount) {
        // 增加奖金项
        for (let i = currentCount; i < newCount; i++) {
          this.prizeList.push({ amount: 0 });
        }
      } else if (newCount < currentCount) {
        // 减少奖金项
        this.prizeList.splice(newCount);
      }
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    myDialog,
  },
};
</script>

<style scoped lang="less">
.game-reward-header {
  margin-bottom: 20px;
}

.reward-header-container {
  padding: 13px 0px 35px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .reward-logo {
    margin-right: 20px;
    width: 40px;
    flex-shrink: 0;
  }

  .reward-account {
    margin: 0 20px;

    .title-text {
      position: relative;
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 18px;
    }

    .account-num {
      font-size: 28px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      line-height: 33px;
      letter-spacing: 1px;
    }
  }

  .usable-amount {
    margin: 0 20px;

    .title-text {
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 18px;
    }

    .amount-num {
      font-size: 28px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #1e87f0;
      line-height: 33px;
      letter-spacing: 1px;
    }
  }

  .btn-group {
    height: 50px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 5px;

    .recharge-btn {
      margin-left: 25px;
      color: #ffffff;
      font-size: 13px;
      width: 51px;
      height: 26px;
      line-height: 26px;
      background: #fb466d;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
  }
}

.reward-setting-container {
  padding: 0 20px 20px 20px;
  display: flex;
  align-items: center;

  .reward-logo {
    margin-right: 20px;
    width: 40px;
    flex-shrink: 0;
  }

  .game-issuance-amount {
    margin: 0 20px;

    .title-text {
      position: relative;
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 18px;
    }

    .amount-num {
      font-size: 28px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      line-height: 33px;
      letter-spacing: 1px;
    }
  }

  .remaining-amount {
    margin: 0 20px;

    .title-text {
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 18px;
    }

    .amount-num {
      font-size: 28px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #1e87f0;
      line-height: 33px;
      letter-spacing: 1px;
    }
  }
}

.money-tree-setting {
  .setting-container {
    padding: 0 20px 20px 20px;

    .time-setting,
    .winner-setting {
      display: flex;
      align-items: center;

      .unit {
        margin-left: 10px;
        color: #666;
      }
    }
  }

  .prize-setting {
    padding: 0 20px 20px 20px;

    .box-card {
      /* 调整卡片高度以适应更多内容 */
      min-height: 120px;
      height: auto;
    }

    .prize-list {
      margin-bottom: 20px;

      .prize-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .rank-label {
          width: 60px;
          font-size: 14px;
          color: #333;
          flex-shrink: 0;
        }

        .unit {
          margin-left: 10px;
          color: #666;
        }
      }
    }

    .save-btn-container {
      text-align: center;
      margin-top: 20px;
    }
  }
}

.box-card {
  height: 120px;
}

/* 充值弹出框样式 */
.rechargeTitle {
  display: flex;

  .title-text {
    margin-left: 20px;
    font-size: 25px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}

.recharge-info {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .balance-box {
    display: flex;
    align-items: center;
    margin-top: 40px;

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
          margin-bottom: 20px;

          .erweima {
            background: #f1f8fc;
            width: 311px;
            height: 184px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
