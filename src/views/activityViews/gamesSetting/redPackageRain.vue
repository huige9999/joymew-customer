<!--红包雨-->
<template>
  <sub-page>
    <!-- 红包雨充值头部 -->
    <div class="redp-header">
      <main-card>
        <card-top-info title="红包雨充值"></card-top-info>
        <div class="redp-header-container">
          <div class="redp-logo"><img src="@/assets/image/redPackageRain/redpackage-logo.png" alt="" width="40" height="40" /></div>
          <div class="redp-account" :class="{hidden: hiddenDetail}">
            <div class="title-text">红包账户</div>
            <div class="account-num">{{ hbBalance }}</div>
          </div>
          <div class="btn-group">
            <div class="recharge-btn" @click="showRechargeDialog">充值</div>
            <div class="cashout-btn" @click="showCashoutDialog" v-if="txVisible">提现</div>
          </div>
          <div class="tips">
            <my-tip-bar class="my-tip-bar" colorStyle="yellow">
              未发放的红包：活动结束或关闭，会自动退回至您的红包账号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </my-tip-bar>
          </div>
        </div>
        <div class="redp-setting-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">平均红包： 每一个来宾获得红包金额一样。</span>
                </div>
                <div>
                  <el-switch
                    v-model="averageRed"
                    active-text="平均红包"
                    inactive-text="随机红包"
                    active-value="1"
                    inactive-value="0"
                    @change="changeSwitch"
                  ></el-switch>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">数值越大,摇得红包的难度越大</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="saveHbHard">保存</el-button>
                </div>
                <div>
                  <div class="block">
                    <el-slider v-model="hardValue" show-input :min="1"></el-slider>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6" v-if="!isInHMenuHidden && txVisible && !inAppTempMode">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">发红包的扣点比例(单位%)</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="saveRate">保存</el-button>
                </div>
                <div>
                  <div class="block">
                    <el-slider v-model="rateValue" show-input :min="8" :max="80"></el-slider>
                  </div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card class="box-card" shadow="hover" style="padding-bottom: 10px">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">设置红包指定时间内全部发完</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="saveSpeciftTime">保存</el-button>
                </div>
                <div class="setSwitch_Slider">
                  <el-switch v-model="setTimeRedvalue" @change="setTimeRedRain" active-color="true" inactive-color="false"></el-switch>
                  <div class="block" v-show="setTimeRedvalue">
                    <el-slider class="el-slider" v-model="specifyTime" :min="30" :max="300"></el-slider>
                    <span v-show="setTimeRedvalue">{{ specifyTime }} 秒</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 20px" v-if="txVisible">
            <el-col :span="6">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span style="color: #dd0000">前三名：开启只显示排行榜前三名</span>
                </div>
                <div>
                  <el-switch
                    v-model="hbyKind"
                    active-text="未开启"
                    inactive-text="开启"
                    active-value="1"
                    inactive-value="0"
                    @change="changeTopThreeSwitch"
                  ></el-switch>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </main-card>
    </div>
    <!-- 红包明细 -->
    <div class="redp-info-container" v-if="!hiddenDetail">
      <main-card>
        <card-top-info title="红包明细">
          <!-- 前后切换按钮 -->
          <!-- <div class="lastNext-btn-group" v-show="false">
            <div class="last" @click="lastBtnClick" :class="{ 'heigh-light-btn': isLastBtnHightlight }">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="next" @click="nextBtnClick" :class="{ 'heigh-light-btn': isNextBtnHightlight }">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div> -->
        </card-top-info>
        <!-- 轮数切换 -->
        <div class="toggle-bar" v-show="hbyInfo && hbyLotteryList">
          <div class="toggle-bar-item" @click="clickBarItem(item)" v-for="(item, index) in totleSort" :key="index">
            {{ `第${item}轮` }}
            <div :class="{ underLine: currentSort === item }"></div>
          </div>
        </div>
        <!-- 红包详情数据 -->
        <div class="hby-info-container" v-show="hbyInfo && hbyLotteryList">
          <div class="line1">
            <div>
              <img src="@/assets/image/redPackageRain/hby01.png" width="13" height="15" alt="" />
              红包个数:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.score }}
            </div>
            <div>
              <img src="@/assets/image/redPackageRain/hby02.png" width="14" height="14" alt="" />
              发送金额:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.bonustotal }}
            </div>
            <!-- <div><img src="@/assets/image/redPackageRain/hby03.png" width="7" height="12" alt="" />已抢:&nbsp;&nbsp;&nbsp;8个</div> -->
            <div class="time">
              <img src="@/assets/image/redPackageRain/hby04.png" width="13" height="14" alt="" />
              开始时间:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.c03 }}
            </div>
          </div>
          <div class="line2">
            <div>
              <img src="@/assets/image/redPackageRain/hby05.png" width="14" height="14" alt="" />
              已抢金额:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.bonusrobbed }}
            </div>
            <div>
              <img src="@/assets/image/redPackageRain/hby06.png" width="14" height="14" alt="" />
              剩余金额:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.balance }}
            </div>
            <!-- <div><img src="@/assets/image/redPackageRain/hby07.png" width="7" height="13" alt="" />未抢:&nbsp;&nbsp;&nbsp;2个</div> -->
            <div class="time">
              <img src="@/assets/image/redPackageRain/hby08.png" width="13" height="14" alt="" />
              结束时间:&nbsp;&nbsp;&nbsp;{{ hbyInfo && hbyInfo.c04 }}
            </div>
          </div>
        </div>
        <!-- 红包用户列表 -->
        <div class="hby-user-list-container">
          <my-table style="height: auto">
            <el-table
              :data="hbyLotteryList"
              highlight-current-row
              style="width: 100%"
              header-row-class-name="table-header"
              :cell-style="cellStyle"
            >
              <!-- el-table height="250" -->
              <el-table-column type="index" width="120" align="center" header-align="center" label="编号"></el-table-column>
              <el-table-column min-width="120" label="姓名" align="center" header-align="center">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="22" height="22" style="border-radius: 50%" :src="scope.row.avator" />
                    <span>{{ scope.row.wx_name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label="金额" prop="redsum" align="center" header-align="center"></el-table-column>
              <el-table-column min-width="100" label="到账时间" align="center" header-align="center">
                <template slot-scope="scope">
                  {{ new Date(scope.row.create_time) | dateFormat }}
                </template>
              </el-table-column>
            </el-table>
          </my-table>
        </div>
        <export-table :URL="tableURL"></export-table>
      </main-card>
    </div>
    <!-- 红包雨内定 -->
    <hbyNeiding :switchHbyNd="switchHbyNd" v-if="!hiddenDetail"/>
    <!-- 红包充值弹出框 -->
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
                红包充值金额&nbsp;&nbsp;
                <span>￥{{ rechargeAmount }}</span>
              </div>
              <div class="erweima-box" style="margin-left: 17px">
                <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
              </div>
              <el-button
                type="primary"
                @click="DoneRecharge"
                size="small"
                style="height: 40px; position: absolute; left: 185px; bottom: 80px"
              >
                已完成支付
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </my-dialog>
    <!-- 红包提现弹出框 -->
    <my-dialog :show="cashoutDialogIsShow">
      <div class="cashoutTitle" slot="title">
        <img src="@/assets/image/redPackageRain/hbyrecharge-logo.png" alt="" width="26" height="31" />
        <div class="title-text">红包提现</div>
      </div>
      <!-- 用户绑定情况下显示提现具体信息界面 -->
      <div class="cashout-info" v-show="isShowWXQRcode">
        <div class="balance-box">
          <div class="title">红包账户余额</div>
          <div class="info">{{ hbBalance }}</div>
        </div>
        <div class="cashout-box">
          <!-- <div class="cashout-amount">
            <div class="title">提现金额</div>
            <div class="do-cashout">
              <el-input v-model="hbBalance" :disabled="true">
                <div slot="suffix" class="cashout-unit" style="margin-top: 10px;margin-right: 20px;">元</div>
              </el-input>
            </div>
          </div> -->
          <div class="get-money-time">
            <div class="title">到账时间</div>
            <div class="info">实时到账</div>
          </div>
          <div class="first-cashout-type">
            <div class="title">提现首款方式</div>
            <div class="info">微信钱包账户</div>
            <!-- <div class="tips">你还没有绑定微信,请先<a href="">绑定</a></div> -->
          </div>
          <div class="cashout-tips">
            <div class="title">提现金额</div>
            <div class="info">每次提现金额1-2000元，大于2000请使用支付宝提现</div>
          </div>
          <div class="cashout-extra-amount">
            <div class="title">提现费用</div>
            <div class="info">8%</div>
          </div>
          <div class="agreement">
            <el-checkbox v-model="isAgree"></el-checkbox>
            <div class="agreeTxt">
              已阅读并同意
              <label @click="toReadAgreement">嗨喵红包提现服务协议</label>
            </div>
          </div>
          <div class="btn-group">
            <el-button type="primary" @click="confirmCashout">确认提现</el-button>
            <el-button type="info" @click="cancelCashout">取消</el-button>
          </div>
        </div>
      </div>
      <!-- 用户未绑定微信 显示二维码轮询 -->
      <div class="cashout-info2" v-show="!isShowWXQRcode">
        <div class="qrcode-container">
          <img :src="officialAccountQRCode" alt="" />
        </div>
        <div class="test">请扫码绑定公众号，提现自动到账微信零钱</div>
        <div class="btn-group">
          <el-button type="primary" @click="cancelWXCashout">关闭</el-button>
        </div>
      </div>
    </my-dialog>
    <el-dialog class="newUserRechargeTipDialog" :visible.sync="newUserRechargeTipDialogVisible" width="780px" center>
      <template slot="title">
        <div class="newUserRechargeTitle">充值失败</div>
      </template>
      <div class="newUserRechargeMain">
        <img src="https://ustatic.hudongmiao.com/miao/app/cp-qrcode.png" class="kefuImg" />
        <div class="tipText">
          新手
          <label>暂无红包充值权限</label>
          ，请添加客服微信申请开通
        </div>
        <el-button type="primary" class="getItBtn" @click="newUserRechargeTipDialogVisible = false">
          我知道了
        </el-button>
      </div>
    </el-dialog>
  </sub-page>
</template>

<script>
import { getBindWXERCode, judgeIsBindWX } from '@/api/app/user';
import { editActivityMsg, updateHbyKind } from '@/api/setting/activitySetting/activity';
import {
  averageHb,
  getActivityMsg,
  getHbyErweima2,
  getHbyLotteryList,
  hardHb,
  updateHbRate,
} from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import ExportTable from '@/components/exportTable';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import MyTable from '@/components/myTable';
import MyTipBar from '@/components/myTipBar';
import SubPage from '@/components/subPage';
import { formatDate } from '@/utils/format';
import { judgeIsHttps } from '@/utils/index';
import request, { BASEURL } from '@/utils/request';
import { mapState } from 'vuex';
import hbyNeiding from './components/hbyNeiding';

let timer;
export default {
  name: 'redPackageRain',
  data() {
    return {
      // 前后按钮是否高亮状态
      isLastBtnHightlight: false,
      isNextBtnHightlight: true,
      // 红包详情
      hbyInfo: {},
      // 红包用户列表
      hbyLotteryList: [],
      // 红包总轮数
      totleSort: 1,
      // 当前红包轮数
      currentSort: 1,
      // 充值弹出框是否显示
      rechargeDialogIsShow: false,
      // 提现弹出框是否显示
      cashoutDialogIsShow: false,
      // 充值金额
      rechargeAmount: 0,
      // 红包账户余额
      hbBalance: 0,
      // 弹出框中支付二维码是否显示
      isShowErweima: false,
      // 支付二维码html标签
      erweimaHtml: '',
      publicPath: process.env.BASE_URL,
      // 绑定微信二维码图片地址
      officialAccountQRCode: '',
      // 是否显示二维码
      // isShowWXQRcode: true,
      tableURL: '#',
      // 是否开启平均红包
      averageRed: '0',
      // 是否开启红包雨前三名
      hbyKind: '0',
      // 红包雨难度值
      hardValue: 1,
      // 红包雨扣点比例
      rateValue: 8,
      // 是否显示充值手续费提示
      isShowShouxu: false,
      // maxHbyRate: 30,
      isAgree: false,
      // 设置规定时间红包雨发完按钮
      setTimeRedvalue: true,
      // 设置一定时间红包发完
      specifyTime: 0,
      newUserRechargeTipDialogVisible: false,
      switchHbyNd: '0', // 红包雨内定开关
      inAppTempMode: localStorage.getItem('funcs'),
    };
  },
  computed: {
    // isShow(){
    //   return this.totleSort ? {} : {display: 'none'}
    // }
    ...mapState({
      isInHMenuHidden: (state) => state.menu.isInHMenuHidden,
      // high_privilege: (state) => state.login.userInfo.high_privilege,
    }),
    isShowWXQRcode() {
      const { userInfo } = this.$store.state.login;
      if (userInfo && userInfo.wx_openid) {
        return true;
      }
      return false;
    },
    txVisible() {
      const { is_hide_tx } = this.$store.state.login.userInfo.config;
      return !is_hide_tx;
    },
    /**
     * 链接配置模式下隐藏明细
     */
    hiddenDetail() {
      return this.$route.name === 'Hby';
    },
  },
  beforeDestroy() {
    console.log('离开了');
    clearInterval(timer);
  },
  created() {
    this.request(this.currentSort);
    this.requestHbInfo();
    this.getWXbindQRcode(); // 显示二维码
    const { liveId } = this.$store.state;
    this.tableURL = `${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=hby_report&type=hongbaoyu`;
    // this.initTimeRedRain();
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    },
  },
  methods: {
    /* 设置平均红包开关 */
    changeSwitch() {
      const data = {
        // liveId: this.$store.state.liveId,
        splid: this.$store.state.liveId,
      };
      averageHb(data)
        .then(() => {
          this.$message({
            message: '更改成功!',
            type: 'success',
          });
          this.requestHbInfo();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('开启或关闭失败!');
        });
    },
    // 红包雨前三名开关
    changeTopThreeSwitch() {
      updateHbyKind({
        splid: this.$store.state.liveId,
        hby_kind: this.hbyKind,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '更改成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('开启或关闭失败!');
        });
    },
    // 设置一定时间内红包雨开关
    // async initTimeRedRain() {
    //   const data = {
    //     id: this.$store.state.liveId,
    //   };
    //   const res = await getActivityMsg(data);
    //   // 回显
    //   if (parseInt(res.data.userInfo.hby_end_time, 10) >= 30) {
    //     this.specifyTime = parseInt(res.data.userInfo.hby_end_time, 10);
    //   }
    //   if (res.data.userInfo.hby_end_time === '0') {
    //     this.setTimeRedvalue = false;
    //     this.specifyTime = 0;
    //   }
    // },
    async setTimeRedRain() {
      const data = {
        id: this.$store.state.liveId,
      };
      if (this.setTimeRedvalue) {
        const res = await getActivityMsg(data);
        // 回显
        if (parseInt(res.data.userInfo.hby_end_time, 10) >= 30) {
          this.specifyTime = parseInt(res.data.userInfo.hby_end_time, 10);
        }
      } else {
        editActivityMsg({
          splid: this.$store.state.liveId,
          hby_end_time: '0',
        }).then((res) => {
          console.log('关闭时间', res);
        });
        this.specifyTime = 0;
      }
    },
    // 保存设置时间
    saveSpeciftTime() {
      editActivityMsg({
        splid: this.$store.state.liveId,
        hby_end_time: this.specifyTime.toString(),
      })
        .then((res) => {
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
          console.log('关闭时间1111', res);
          this.setTimeRedRain();
        })
        .catch(() => {
          this.$message.error('保存失败!');
        });
    },
    /* 保存红包难度更改 */
    saveHbHard() {
      const data = {
        // liveid: this.$store.state.liveId,
        // num: this.hardValue + '',
        splid: this.$store.state.liveId,
        num: `${this.hardValue}`,
      };
      hardHb(data)
        .then(() => {
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
          this.requestHbInfo();
        })
        .catch(() => {
          this.$message.error('保存失败!');
        });
    },
    saveRate() {
      const data = {
        splid: this.$store.state.liveId,
        hby_kd_rate_val: `${this.rateValue}`,
      };
      updateHbRate(data)
        .then(() => {
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
          this.requestHbInfo();
        })
        .catch(() => {
          this.$message.error('保存失败!');
        });
    },
    /* 红包设置初始化 */
    requestHbInfo(onlyUpdateBalance) {
      const data = {
        id: this.$store.state.liveId,
      };
      getActivityMsg(data)
        .then((res) => {
          if (onlyUpdateBalance) {
            this.hbBalance = res.data.balance;
          } else {
            // if (res.data.is_gift_to_hbkd === '0') {
            //   this.maxHbyRate = 30;
            // } else {
            //   this.maxHbyRate = 80;
            // }
            this.hbBalance = res.data.balance;
            this.averageRed = res.data.averagebao;
            this.hardValue = parseInt(res.data.hby_time, 10);
            this.rateValue = parseInt(res.data.hby_kd_rate_val, 10);
            this.isShowShouxu = res.data.isNotD;
          }

          if (parseInt(res.data.userInfo.hby_end_time, 10) >= 30) {
            this.specifyTime = parseInt(res.data.userInfo.hby_end_time, 10);
          }
          if (res.data.userInfo.hby_end_time === '0') {
            this.setTimeRedvalue = false;
            this.specifyTime = 0;
          }
          // 红包雨内定设置
          this.switchHbyNd = res.data.userInfo.switch_hby_nd;
          // 红包雨前三名设置
          this.hbyKind = res.data.hby_kind;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /* 关闭提现框微信绑定二维码 */
    cancelWXCashout() {
      this.cashoutDialogIsShow = false;
      clearInterval(timer);
    },
    /* 请求绑定微信二维码 */
    getWXbindQRcode() {
      getBindWXERCode({
        request_from_page: 'app/activity/gamesSetting/hby',
      })
        .then((img) => {
          this.officialAccountQRCode = img;
        })
        .catch(() => {});
    },
    /* 判断是否绑定微信 */
    checkIsBindWX() {
      // 判断是否绑定微信

      if (!this.isShowWXQRcode) {
        // 未绑定微信 显示绑定二维码  做轮询请求

        // 重复轮询请求
        timer = setInterval(() => {
          judgeIsBindWX({
            request_from_page: 'app/activity/gamesSetting/hby',
          })
            .then((res) => {
              console.log('提现轮询结果', res);
              if (res.success) {
                // 关注成功 切换到提现详情
                clearInterval(timer);
                if (res.data.wx_openid) {
                  this.$store.commit('login/updateUserInfo', {
                    wx_openid: res.data.wx_openid,
                  });
                }
                // this.isShowWXQRcode = true;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }, 2000);
      }
    },
    /* 显示充值弹框 */
    showRechargeDialog() {
      if (!this.txVisible) {
        this.newUserRechargeTipDialogVisible = true;
        return;
      }
      console.log('充值弹出');
      this.rechargeDialogIsShow = true;
    },
    /* 确认充值 显示二维码 */
    confirmRecharge() {
      // console.log(typeof this.rechargeAmount)
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(this.rechargeAmount) || this.rechargeAmount === 0 || this.rechargeAmount === '0') {
        this.$message.error('请输入合法的金额');
        return;
      }
      this.isShowErweima = true;

      this.requestErweima(this.rechargeAmount);
    },
    /* 金额输入框改变触发 */
    reChargeInputChange() {
      // 隐藏二维码相关区域
      this.isShowErweima = false;
    },
    /* 取消充值 关闭弹框 */
    cancelRecharge() {
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    /* 已经完成支付 关闭弹框 */
    DoneRecharge() {
      // 及时更新账户余额
      this.requestHbInfo('onlyUpdateBalance');
      this.rechargeDialogIsShow = false;
      this.isShowErweima = false;
      this.rechargeAmount = 0;
    },
    /* 请求支付二维码 */
    requestErweima(rechargeAmount) {
      const data = {
        splid: this.$store.state.liveId,
        money: rechargeAmount,
        pay_type: 'alipay',
        isHttps: judgeIsHttps(),
      };
      getHbyErweima2(data).then((res) => {
        console.log('支付二维码返回结果:', res.data.order);
        this.erweimaHtml = `${res.data.order}`;
      });
    },
    /* 显示提现弹框 */
    showCashoutDialog() {
      // 判断是否绑定微信
      this.checkIsBindWX();
      console.log('提现弹框');
      this.cashoutDialogIsShow = true;
    },
    /* 确认提现 */
    confirmCashout() {
      if (!this.isAgree) {
        this.$message.error('请先阅读并同意嗨喵红包提现服务协议!');
        return;
      }
      if (this.hbBalance < 0.4) {
        this.$message.error('提现金额不能小于0.4元!');
        return;
      }
      // 已绑定微信  请求提现接口
      request.post('/newHuoDongHm/moneyTiXian', { splid: this.$store.state.liveId }).then((res) => {
        console.log('提现信息', res);
        // 提现成功余额恢复0
        this.hbBalance = 0;
        this.$message({
          type: 'success',
          message: '微信提现成功请注意查收',
        });
      });
      this.cashoutDialogIsShow = false;
    },
    /* 取消提现 */
    cancelCashout() {
      this.cashoutDialogIsShow = false;
    },
    /* last按钮点击事件 */
    lastBtnClick() {
      console.log('last click');
      this.isLastBtnHightlight = true;
      this.isNextBtnHightlight = !this.isLastBtnHightlight;
    },
    /* next按钮点击事件 */
    nextBtnClick() {
      console.log('next click');
      this.isNextBtnHightlight = true;
      this.isLastBtnHightlight = !this.isNextBtnHightlight;
    },
    /* 数据请求 参数1：轮数 */
    request(sort) {
      const data = {
        // liveId: this.$store.state.liveId,
        // type: 'hongbaoyu',
        // currentPage: 1,
        // showCount: '500',
        // sort
        splid: this.$store.state.liveId,
        type: 'hongbaoyu',
        currentPage: 1,
        showCount: '500',
        order_by: sort,
      };

      getHbyLotteryList(data)
        .then((res) => {
          console.log('hby数据', res);
          console.log(res.data.hbyInfo);
          this.hbyInfo = res.data.hbyInfo;
          this.totleSort = res.data.maxSort;
          this.hbyLotteryList = res.data.hbyLotteryList;
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('红包人数', this.hbyLotteryList);
    },
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tcolor = '';
      if (columnIndex === 2) {
        tcolor = 'color:#ff6260';
      }
      return tcolor;
    },
    // 点击切换第几轮
    clickBarItem(index) {
      this.currentSort = index;
      console.log(`this is${index}`);
      this.request(this.currentSort);
    },
    /* 导出报表 */
    exportTable() {
      const { liveId } = this.$store.state;
      const sort = this.currentSort;
      request
        .get(`${BASEURL}/reportFormsHm/findReportInfo?splid=${liveId}&report_type=hby_report&type=hongbaoyu&sort=${sort}`)
        .then((res) => {
          console.log('export table', res);
          this.$message({
            type: 'success',
            message: '导出报表成功',
          });
        });
    },
    toReadAgreement() {
      window.open('https://www.hudongmiao.com/agreement/index.html', '_blank');
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTipBar,
    MyTable,
    ExportTable,
    myDialog,
    hbyNeiding,
  },
};
</script>

<style lang="less" scoped>
.redp-header-container {
  padding: 13px 0px 35px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .redp-account {
    margin: 0 20px;
    .title-text {
      position: relative;
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 18px;
      &:after {
        content: '明细';
        font-size: 11px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        line-height: 18px;
        text-align: center;
        position: absolute;
        top: -14px;
        right: -37px;
        width: 37px;
        height: 19px;
        background: #f4c15b;
        border-radius: 10px 10px 10px 0px;
      }
    }
    .account-num {
      font-size: 28px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      line-height: 33px;
      letter-spacing: 1px;
    }
    &.hidden {
      .title-text {
        &:after {
          display: none;
        }
      }
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
    .cashout-btn {
      margin-left: 25px;
      color: #ffffff;
      font-size: 13px;
      width: 51px;
      height: 26px;
      line-height: 26px;
      background: #1e87f0;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
  }
  .tips {
    margin-left: 30px;
    height: 50px;
    align-items: flex-end;
    display: flex;
  }
}
.redp-setting-container {
  padding: 0 20px 20px 20px;
  .el-card::v-deep {
    .el-card__body {
      height: 75px;
    }
  }
}
.lastNext-btn-group {
  display: flex;
  justify-content: center;
  margin-right: 25px;
  /* 前后切换按钮触发时的样式 */
  .heigh-light-btn {
    background: #1e87f0 !important;
    opacity: 1 !important;
  }
  .last,
  .next {
    color: #ffffff;
    width: 26px;
    height: 26px;
    border-radius: 4px 0px 0px 4px;
    margin-left: 10px;
    font-size: 15px;
    text-align: center;
    line-height: 26px;
    cursor: pointer;
    background: #000000;
    opacity: 0.27;
  }
  .next {
    border-radius: 0px 4px 4px 0px;
  }
}
.toggle-bar {
  display: flex;
  border-bottom: 1px solid #eeeeee;
  .toggle-bar-item {
    position: relative;
    flex-basis: 100px;
    justify-content: flex-start;
    padding: 10px 0;
    text-align: center;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #666666;
    cursor: pointer;
    .underLine {
      position: absolute;
      width: 20px;
      height: 5px;
      background: #1e87f0;
      bottom: 0;
      left: 40px;
      border-radius: 2px;
    }
  }
}
// 红包详情数据
.hby-info-container {
  width: 97%;
  height: 72px;
  border: 1px solid #bae7ff;
  background: #e6f7ff;
  margin: 17px auto;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 3%;
  > div {
    display: flex;
    div {
      flex-basis: 22%;
      img {
        margin-right: 15px;
      }
    }
    .time {
      flex: 1;
    }
  }
}
// 红包用户列表
.hby-user-list-container {
  .upload-img {
    display: flex;
    align-items: center;
    margin-left: 30%;
    span {
      margin-left: 15px;
    }
  }
}
/* 前后切换按钮没有触发时的样式 */
.default-light-btn {
  background: #000000;
  opacity: 0.27;
}
/* 红包充值弹出框 */
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
/* 红包提现弹出框 */
.cashoutTitle {
  display: flex;
  align-items: center;
  .title-text {
    margin-left: 20px;
    font-size: 25px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.cashout-info2 {
  .qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 250px;
      height: 250px;
    }
  }
  .test {
    padding: 30px 20%;
    text-align: center;
  }
  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
  }
}
.cashout-info {
  .balance-box {
    display: flex;
    align-items: center;
    margin-top: 40px;
    .title {
      width: 150px;
      font-size: 14px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .info {
      font-size: 27px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #fb466c;
      letter-spacing: 1px;
    }
  }
  .cashout-box {
    & > div {
      display: flex;
      align-items: center;
      margin-top: 40px;
      .title {
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
        width: 150px;
      }
      .info {
        font-size: 14px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
      }
    }
    .first-cashout-type {
      .tips {
        font-size: 13px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #fb466c;
        margin-left: 20px;
        a {
          font-size: 13px;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #249aff;
        }
      }
    }
    .agreement {
      label {
        color: #1e87f0;
        cursor: pointer;
      }
      .agreeTxt {
        margin-left: 10px;
      }
    }
    .btn-group {
      display: flex;
      padding-left: 150px;
      padding-bottom: 30px;
    }
  }
}

.box-card {
  height: 150px;
}

.setSwitch_Slider {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items:flex-start;
  .block {
    flex: 1;
    margin-top: -28px;
    margin-left: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-slider {
      width: 90px;
    }
  }
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
