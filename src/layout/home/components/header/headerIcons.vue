<!--头部数据组件-->
<!--
索引：
成功邀请
礼物收益
邀请人数
总收入
持股数
可提现
已提现
收益奖励
可用红包
已用红包
已过期红包
累计收益
礼物总收益
-->
<template>
  <div class="header-icons" :style="{ padding: getPadding }">
    <!-- 成功邀请 -->
    <div class="item" v-if="exists.includes('inviteSuccess')" :style="{ order: exists.indexOf('inviteSuccess') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/inviteNumber.png" alt="" />
      </div>
      <div class="right">
        <div>成功邀请</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="inviteSuccess" :count="dataObj.inviteSuccess || 0"></count-up>
        </div>
      </div>
    </div>
    <!--团员收益：礼物总收益-->
    <div class="item" v-if="exists.includes('team_gift')" :style="{ order: exists.indexOf('team_gift') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/lwzsy.png" alt="" />
      </div>
      <div class="right">
        <div>礼物总收益</div>
        <div :style="{ color: color.orange }">
          $<count-up element-id="team_gift" :count="dataObj.team_gift || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团员收益：全屏特效总收益 -->
    <div class="item" v-if="exists.includes('team_super')" :style="{ order: exists.indexOf('team_super') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/qptx.png" alt="" />
      </div>
      <div class="right">
        <div>全屏特效总收益</div>
        <div :style="{ color: color.red }">
          $<count-up element-id="team_super" :count="dataObj.team_super || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团员收益：红包雨总收益 -->
    <div class="item" v-if="exists.includes('team_hby')"
      :style="{ order: exists.indexOf('team_hby') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/hby.png" alt="" />
      </div>
      <div class="right">
        <div>红包雨总收益</div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_hby" :count="dataObj.team_hby || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团员收益：开宝箱总收益 -->
    <div class="item" v-if="exists.includes('team_kbx')"
      :style="{ order: exists.indexOf('team_kbx') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftProfit.png" alt="" />
      </div>
      <div class="right">
        <div>开宝箱总收益</div>
        <div :style="{ color: color.yellow }">
          $<count-up element-id="team_kbx" :count="dataObj.team_kbx || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团员收益：红包墙总收益 -->
    <div class="item" v-if="exists.includes('team_hbq')" :style="{ order: exists.indexOf('team_hbq') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/hbq.png" alt="" />
      </div>
      <div class="right">
        <div>红包墙总收益</div>
        <div :style="{ color: color.yellow }">
          $<count-up element-id="team_hbq" :count="dataObj.team_hbq || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团队收益：团队总收益 -->
    <div class="item" v-if="exists.includes('team_total_income')" :style="{ order: exists.indexOf('team_total_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/tdzsy.png" alt="" />
      </div>
      <div class="right">
        <div>团队总收益</div>
        <div :style="{ color: color.yellow }">
          $<count-up element-id="team_total_income" :count="dataObj.team_total_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团队收益：礼物分成收益 -->
    <div class="item" v-if="exists.includes('team_gift_income')"
      :style="{ order: exists.indexOf('team_gift_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/lwzsy.png" alt="" />
      </div>
      <div class="right">
        <div>礼物分成收益
          <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动礼物流水(已进入红包口袋的部分除外)的10%作为团队收益">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.orange }">
          $<count-up element-id="team_gift_income" :count="dataObj.team_gift_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团队收益：全屏特效分成收益 -->
    <div class="item" v-if="exists.includes('team_super_income')"
      :style="{ order: exists.indexOf('team_super_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/qptx.png" alt="" />
      </div>
      <div class="right">
        <div>全屏特效分成收益
          <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动全屏特效(已进入红包口袋的部分除外)的10%作为团队收益">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.yellow }">
          $<count-up element-id="team_super_income" :count="dataObj.team_super_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团队收益：红包雨分成总收益 -->
    <div class="item" v-if="exists.includes('team_hby_income')" :style="{ order: exists.indexOf('team_hby_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/hby.png" alt="" />
      </div>
      <div class="right">
        <div>红包雨分成收益
          <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动所创造红包雨游戏平台所得收益的20%作为团队收益。">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_hby_income" :count="dataObj.team_hby_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 团队收益：开宝箱总收益 -->
    <div class="item" v-if="exists.includes('team_kbx_income')"
      :style="{ order: exists.indexOf('team_kbx_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftProfit.png" alt="" />
      </div>
      <div class="right">
        <div>开宝箱总收益
          <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动开宝箱游戏总收益的10%作为团队收益">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_kbx_income" :count="dataObj.team_kbx_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!--团队收益：红包墙总收益  -->
    <div class="item" v-if="exists.includes('team_hbq_income')"
      :style="{ order: exists.indexOf('team_hbq_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/hbq.png" alt="" />
      </div>
      <div class="right">
        <div>红包墙总收益
          <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动所创造红包墙游戏平台所得收益的20%作为团队收益。">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_hbq_income" :count="dataObj.team_hbq_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 阶段性成就奖励 -->
    <div class="item" v-if="exists.includes('team_additional_income')" :style="{ order: exists.indexOf('team_additional_income') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/jdxcj.png" alt="" />
      </div>
      <div class="right">
        <div>阶段性成就奖励
          <el-popover placement="bottom-end" width="250" trigger="hover">
            <div>
              <h3 style="text-align:center">团队阶段性成就奖励</h3>
              <table border='1' cellspacing="0" width='100%' style = "text-align:center;">
                <tr>
                  <td>
                    <h4>团队红包雨发放金额</h4>
                  </td>
                  <td>
                    <h4>
                      激励奖励金
                    </h4>
                  </td>
                </tr>
                <tr>
                  <td>5万元</td>
                  <td>1000元</td>
                </tr>
                <tr>
                  <td>10万元</td>
                  <td>1500元</td>
                </tr>
                <tr>
                  <td>30万元</td>
                  <td>3000元</td>
                </tr>
                <tr>
                  <td>50万元</td>
                  <td>5000元</td>
                </tr>
                <tr>
                  <td>100万元</td>
                  <td>10000元</td>
                </tr>
              </table>
            </div>
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover>
        </div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_additional_income" :count="dataObj.team_additional_income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 红包雨游戏总金额 -->
    <div class="item" v-if="exists.includes('team_red_flow')" :style="{ order: exists.indexOf('team_red_flow') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/hby.png" alt="" />
      </div>
      <div class="right">
        <div>红包雨游戏总金额
          <!-- <el-popover placement="bottom-end" width="200" trigger="hover" content="团队将获得团员每场活动所创造红包雨游戏平台所得收益的20%作为团队收益。">
            <i class="el-icon-question question-icon" slot="reference" style="color: red"></i>
          </el-popover> -->
        </div>
        <div :style="{ color: color.blue }">
          $<count-up element-id="team_red_flow" :count="dataObj.team_red_flow || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 邀请码 -->
    <div class="item" v-if="exists.includes('inviteUrl')" :style="{ order: exists.indexOf('inviteUrl') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/inviteCode.png" alt="" />
      </div>
      <div class="right">
        <div>邀请码</div>
        <div :style="{ color: color.red }">
          <!-- <count-up element-id="inviteUrl" :count="dataObj.invtercode || 0"></count-up> -->
          {{ dataObj.invtercode || 0 }}
        </div>
      </div>
    </div>
    <!-- ------ -->
    <div class="item" v-if="exists.includes('giftProfit')" :style="{ order: exists.indexOf('giftProfit') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftProfit.png" alt="" />
      </div>
      <div class="right">
        <div>礼物奖励</div>
        <div :style="{ color: color.lightGreen }">60%</div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('inviteNumber')" :style="{ order: exists.indexOf('inviteNumber') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/inviteNumber.png" alt="" />
      </div>
      <div class="right">
        <div>邀请人数</div>
        <div :style="{ color: color.orange }">881</div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('totalProfit')" :style="{ order: exists.indexOf('totalProfit') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/totalProfit.png" alt="" />
      </div>
      <div class="right">
        <div>总收入</div>
        <div :style="{ color: color.red }">
          <count-up element-id="totalProfit" :count="totalProfit"></count-up>
        </div>
      </div>
    </div>
    <!-- 礼物邀请 -->
    <div class="item" v-if="exists.includes('totalProfit-lj')" :style="{ order: exists.indexOf('totalProfit-lj') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/totalProfit.png" alt="" />
      </div>
      <div class="right">
        <div>
          礼物奖励
          <span style="
              widht: 51px;
              background: #1e87f0;
              color: #ffffff;
              border-radius: 10px 10px 10px 0px;
              margin-left: 10px;
              display: inline-block;
            ">+{{ dataObj.sharRate }}%</span>
        </div>
        <div :style="{ color: color.lightGreen }">
          <count-up element-id="totalProfitLj" :count="dataObj.totalProfitLj"></count-up>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="item" v-if="exists.includes('sharesNumber')" :style="{ order: exists.indexOf('sharesNumber') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/sharesNumber.png" alt="" />
      </div>
      <div class="right">
        <div>持股数</div>
        <div :style="{ color: color.gray }">5693</div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('canWithDraw')" :style="{ order: exists.indexOf('canWithDraw') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/canWithDraw.png" alt="" />
      </div>
      <div class="right">
        <div>可提现</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="canWithDraw" :count="canWithDraw"></count-up>
        </div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('withdrawal')" :style="{ order: exists.indexOf('withdrawal') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/withdrawal.png" alt="" />
      </div>
      <div class="right">
        <div>已提现</div>
        <div :style="{ color: color.gray }">
          <count-up element-id="withdrawal" :count="withdrawal"></count-up>
        </div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('profit')" :style="{ order: exists.indexOf('profit') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftProfit.png" alt="" />
      </div>
      <div class="right">
        <div>收益奖励</div>
        <div :style="{ color: color.lightGreen }"><count-up element-id="profitRate" :count="profitRate"></count-up>{{
    `%` }}</div>
      </div>
    </div>
    <!-- 开宝箱邀请 -->
    <div class="item" v-if="exists.includes('inviteProfit')" :style="{ order: exists.indexOf('inviteProfit') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/giftProfit.png" alt="" />
      </div>
      <div class="right">
        <div>
          开宝箱奖励
          <span style="
              widht: 51px;
              background: #1e87f0;
              color: #ffffff;
              border-radius: 10px 10px 10px 0px;
              margin-left: 10px;
              display: inline-block;
            ">+{{ dataObj.kbxShareRateVal }}%</span>
        </div>
        <div :style="{ color: color.yellow }"><count-up element-id="inviteProfit"
            :count="dataObj.inviteProfit"></count-up></div>
      </div>
    </div>
    <!--  -->
    <div class="item" v-if="exists.includes('canUseHb')" :style="{ order: exists.indexOf('canUseHb') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/totalProfit.png" alt="" />
      </div>
      <div class="right">
        <div>可用红包</div>
        <div :style="{ color: color.red }">
          <count-up element-id="canUseHb" :count="dataObj.keYongHb"></count-up>
        </div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('hbUsed')" :style="{ order: exists.indexOf('hbUsed') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/canWithDraw.png" alt="" />
      </div>
      <div class="right">
        <div>已用红包</div>
        <div :style="{ color: color.orange }"><count-up element-id="hbUsed" :count="dataObj.yiLingHb"></count-up></div>
      </div>
    </div>
    <div class="item" v-if="exists.includes('overdueHb')" :style="{ order: exists.indexOf('overdueHb') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/withdrawal.png" alt="" />
      </div>
      <div class="right">
        <div>已失效红包</div>
        <div :style="{ color: color.gray }"><count-up element-id="overdueHb" :count="dataObj.guoQiHb"></count-up></div>
      </div>
    </div>
    <!-- 成功邀请 -->
    <div class="item" v-if="exists.includes('inviteSuccessTwo')" :style="{ order: exists.indexOf('inviteSuccessTwo') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/inviteNumberTwo.png" alt="" />
      </div>
      <div class="right">
        <div>成功邀请</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="inviteSuccess" :count="dataObj.inviteSuccess || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 已激活 -->
    <div class="item" v-if="exists.includes('Activated')" :style="{ order: exists.indexOf('Activated') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/Activated.png" alt="" />
      </div>
      <div class="right">
        <div>已激活</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="Activated" :count="dataObj.Activated || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 待激活 -->
    <div class="item" v-if="exists.includes('toActivate')" :style="{ order: exists.indexOf('toActivate') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/toActivate.png" alt="" />
      </div>
      <div class="right">
        <div>待激活</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="toActivate" :count="dataObj.toActivate || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 激活红包 -->
    <div class="item" v-if="exists.includes('activateHb')" :style="{ order: exists.indexOf('activateHb') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/activateHb.png" alt="" />
      </div>
      <div class="right">
        <div>激活红包</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="activateHb" :count="dataObj.activateHb || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 互动申请场次 -->
    <div class="item" v-if="exists.includes('applyNum')"
      :style="{ order: exists.indexOf('applyNum'), borderRight: 'unset' }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/applyIcon.png" alt="" />
      </div>
      <div class="right">
        <div>互动申请场次</div>
        <div :style="{ color: color.blue }">
          <count-up element-id="applyNum" :count="dataObj.applyNum || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 互动使用场次 -->
    <div class="item" v-if="exists.includes('useNum')"
      :style="{ order: exists.indexOf('useNum'), borderRight: 'unset' }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/liveCountIcon.png" alt="" />
      </div>
      <div class="right">
        <div>互动使用场次</div>
        <div :style="{ color: color.lightGreen }">
          <count-up element-id="activateHb" :count="dataObj.useNum || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 互动收益 -->
    <div class="item" v-if="exists.includes('income')"
      :style="{ order: exists.indexOf('income'), borderRight: 'unset' }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/incomeIcon.png" alt="" />
      </div>
      <div class="right">
        <div>互动收益</div>
        <div :style="{ color: color.red }">
          <count-up element-id="income" :count="dataObj.income || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 签到人数 -->
    <div class="item" v-if="exists.includes('signNum')"
      :style="{ order: exists.indexOf('signNum'), borderRight: 'unset' }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/signIcon.png" alt="" />
      </div>
      <div class="right">
        <div>签到人数</div>
        <div :style="{ color: color.orange }">
          <count-up element-id="signNum" :count="dataObj.signNum || 0"></count-up>
        </div>
      </div>
    </div>
    <!-- 区域 -->
    <div class="item" v-if="exists.includes('areaProxyArea')" :style="{ order: exists.indexOf('areaProxyArea') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/signIcon.png" alt="" />
      </div>
      <div class="right">
        <div>区域</div>
        <div :style="{ color: color.orange }">{{ dataObj.areaProxyArea }}</div>
      </div>
    </div>
    <!-- 区域码 -->
    <div class="item" v-if="exists.includes('areaProxyCode')" :style="{ order: exists.indexOf('areaProxyCode') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/inviteCode.png" alt="" />
      </div>
      <div class="right">
        <div>区域码</div>
        <div :style="{ color: color.red }">{{ dataObj.areaProxyCode }}</div>
      </div>
    </div>
    <!-- 区域人数 -->
    <div class="item" v-if="exists.includes('areaProxyPeople')" :style="{ order: exists.indexOf('areaProxyPeople') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/user.png" alt="" />
      </div>
      <div class="right">
        <div>区域人数</div>
        <div :style="{ color: color.lightGreen }">{{ dataObj.areaProxyPeople }}人</div>
      </div>
    </div>
    <!-- 区域流水 -->
    <div class="item" v-if="exists.includes('areaProxyMoney')" :style="{ order: exists.indexOf('areaProxyMoney') }">
      <div class="left">
        <img src="@/assets/image/icon/headerData/cost.png" alt="" />
      </div>
      <div class="right">
        <div>区域流水</div>
        <div :style="{ color: color.orange }">{{ dataObj.areaProxyMoney }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CountUp from '@/components/countUp';

export default {
  name: 'headerIcons',
  components: { CountUp },
  props: {
    exists: Array,
    padding: String,
    dataObj: Object,
  },
  methods: {
  },
  data() {
    return {
      color: {
        orange: '#FFB97E',
        lightGreen: '#3BCACD',
        red: '#FB466C',
        gray: '#ABB7C7',
        yellow: '#FF7873',
        blue: '#1890FF',
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userInfo;
    },
    totalProfit() {
      return (this.userInfo.user_money || {}).earning_total || 0;
    },
    canWithDraw() {
      return (this.userInfo.user_money || {}).balance_withdraw || 0;
    },
    withdrawal() {
      return (this.userInfo.user_money || {}).earning_hasTx || 0;
    },
    profitRate() {
      return this.userInfo.income_rate || 0;
    },
    getPadding() {
      if (this.padding) {
        return this.padding;
      }
      if (this.exists.length === 3) {
        return '10px 190px 24px';
      }
      return '10px 55px 24px';
    },
  },
};
</script>

<style lang="less" scoped>
.header-icons {
  display: flex;
  width: 100%;

  .item {
    height: 68px;
    display: flex;
    justify-content: center;
    // flex-basis: 0;
    flex-grow: 1;
    //分割线
    border-right: solid 2px #eeeeee;

    // 1 2 2 1 布局 START
    &:last-child,
    &:first-child {
      flex-grow: 1;
    }

    &:first-child {
      // justify-content: flex-start;
    }

    &:last-child {
      // justify-content: flex-end;
      border-right: none;
    }

    // 1 2 2 1 布局 END
    &:last-child {
      border-right: none;
    }

    //左侧图片
    .left {
      height: 100%;
      .hvCenter();

      img {
        height: 40px;
        width: 40px;
      }
    }

    //右侧文字
    .right {
      margin-left: 19px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      div:first-of-type {
        height: 17px;
        font-size: 13px;
        color: #666666;
        line-height: 17px;
      }

      div:last-of-type {
        height: 33px;
        font-size: 25px;
        line-height: 33px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
