<template>
    <div class="home-container">
        <div class="home-top">
            <div class="top-left">
                <!-- 用户信息 -->
                <div class="userInfo">
                    <div class="welcome">👏 欢迎回来，尊敬的嗨喵合伙人<span>{{ user.username }}</span></div>
                    <div class="more-info">
                        <div class="user-avatar"><img :src="user.avatar"></div>
                        <div class="info-item">
                            <div class="top info-label"><span>用户名：</span>{{ user.username }}</div>
                            <div class="bottom info-label"><span>等级：</span>{{ user.level }}</div>
                        </div>
                        <div class="info-item">
                            <div class="top info-label"><span>总场次：</span>{{ user.splTotal }}</div>
                            <div class="bottom info-label"><span>邀请人数：</span>{{ user.inviteTotal }}</div>
                        </div>
                        <!-- <div class="info-item">
                            <div class="top"><span>上周收益排名：</span></div>
                            <div class="bottom"><span>跟进记录排名：</span></div>
                        </div> -->
                    </div>
                </div>
                <!-- 用户日志 -->
                <div class="user-log">
                    <div class="sign-log log">
                        <div class="log-title">登录次数</div>
                        <div class="show-item">
                            <div class="item-label">{{ "本周（" + user.log_week + "/7）" }}</div>
                            <div class="item-process">
                                <process :processData="{ actual: user.log_week, total: 7 }"></process>
                            </div>
                        </div>
                        <div class="show-item">
                            <div class="item-label">{{ "本月（" + user.log_month + "/30）" }}</div>
                            <div class="item-process">
                                <process :processData="{ actual: user.log_month, total: 30 }" bgC="rgba(0 ,178, 255, .3)"
                                    activeBgc="#00B2FF"></process>
                            </div>
                        </div>
                    </div>
                    <div class="record-log log">
                        <div class="log-title">跟进次数</div>
                        <div class="show-item">
                            <div class="item-label">{{ "本周（" + user.emaccountRecord_week + "/7）" }}</div>
                            <div class="item-process">
                                <process :processData="{ actual: user.emaccountRecord_week, total: 7 }"
                                    bgC="rgba(255, 205, 128, .4)" activeBgc="#FFCD80"></process>
                            </div>
                        </div>
                        <div class="show-item">
                            <div class="item-label">{{ "本月（" + user.emaccountRecord_month + "/30）" }}</div>
                            <div class="item-process">
                                <process :processData="{ actual: user.emaccountRecord_month, total: 30 }"
                                    bgC="rgba(247, 114, 52, .3)" activeBgc="#F77234"></process>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="top-right">
                <div class="part-header">
                    <div class="part-title">公告</div>
                    <div class="more-btn">查看更多</div>
                </div>
                <div class="mes-container">
                    <div class="mes-item" v-for="mes in mesList" :key="mes.end_login_time">
                        <div class="mes-icon">消息</div>
                        <div class="mes-detail">{{ mes.name + mes.end_login_time_desc + '登录了合伙人系统' }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-bottom">
            <div class="income-list list">
                <div class="header-icon income-icon">上个月合伙人收益排行</div>
                <div class="income-rank rank">
                    <el-table :data="incomeList" stripe :header-cell-style="{ background: '#f2f3f5', color: '#1D2129' }">
                        <el-table-column type="index" label="排名" width="150" align="left"></el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="200" align="left"></el-table-column>
                        <el-table-column prop="income" label="收益" min-width="200" align="left">
                            <template slot-scope="scope">
                                {{ scope.row.income + ' 元' }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="record-list list">
                <div class="header-icon record-icon">合伙人跟进记录条数记录排名</div>
                <div class="record-rank rank">
                    <el-table :data="recordList" stripe :header-cell-style="{ background: '#f2f3f5', color: '#1D2129' }">
                        <el-table-column type="index" label="排名" width="150" align="left"></el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="200" align="left"></el-table-column>
                        <el-table-column prop="size" label="跟进记录数量" min-width="200" align="left"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
  getLoginList,
  getUserBaseInfo,
  getIncomeRank,
  getFollowRecordRank,
} from '@/api/partnerSystem/index';
import process from './components/process.vue';

export default {
  name: 'PartnerHome',
  components: {
    process,
  },
  data() {
    return {
      mesList: [],
      incomeList: [],
      recordList: [],
      sign_week_times: 2,
      sign_month_times: 10,
      record_week_times: 3,
      record_month_times: 20,
      user: {
        username: '',
        avatar: '',
        level: '',
        splTotal: 0,
        inviteTotal: 0,
        emaccountRecord_month: 0,
        emaccountRecord_week: 0,
        log_month: 0,
        log_week: 0,
      },
    };
  },
  created() {
    this.username = this.$store.state.partner.user.emcee_name;
    this.userAvatar = this.$store.state.partner.user.avator;
    this.getUserBaseInfo();
    this.getLoginList();
    this.getIncomeRank();
    this.getFollowRecordRank();
  },
  methods: {
    async getLoginList() {
      const res = await getLoginList();
      const target = res.data;
      console.log('登录消息列表：', target);
      this.mesList = [...target.list];
    },
    async getUserBaseInfo() {
      const res = await getUserBaseInfo();
      const target = res.data;
      console.log('首页用户信息', target);
      const {
        name,
        vip_grade,
        spltotal,
        invite_pcount,
        avator,
        constantInfo,
      } = target;
      this.user.username = name;
      this.user.avatar = avator;
      this.user.splTotal = spltotal;
      this.user.inviteTotal = invite_pcount;
      this.user.level = vip_grade;
      if (constantInfo.log_week >= 7) {
        this.user.log_week = 7;
      } else {
        this.user.log_week = constantInfo.log_month;
      }
      if (constantInfo.log_month >= 30) {
        this.user.log_month = 30;
      } else {
        this.user.log_month = constantInfo.log_month;
      }
      if (constantInfo.emaccountRecord_week >= 7) {
        this.user.emaccountRecord_week = 7;
      } else {
        this.user.emaccountRecord_week = constantInfo.emaccountRecord_week;
      }
      if (constantInfo.emaccountRecord_month >= 30) {
        this.user.emaccountRecord_month = 30;
      } else {
        this.user.emaccountRecord_month = constantInfo.emaccountRecord_month;
      }
    },
    async getIncomeRank() {
      const res = await getIncomeRank();
      const target = res.data;
      console.log('收益排行', target);
      target.list.map((person) => {
        this.incomeList.push({
          name: person.name,
          income: person.my_income_total,
        });
        return person;
      });
      console.log(this.incomeList);
    },
    async getFollowRecordRank() {
      const res = await getFollowRecordRank();
      const target = res.data;
      console.log('跟进排行', target);
      target.list.map((person) => {
        this.recordList.push({
          name: person.name,
          size: person.size,
        });
        return person;
      });
      console.log(this.recordList);
    },
  },
};
</script>
<style lang="less" scoped>
.home-container {
    width: 100%;
    // min-width: 1350px;

    .home-top {
        width: 100%;
        height: 330px;
        display: flex;
        align-content: center;

        .top-left {
            flex: 1;
            height: 100%;
            margin-right: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .userInfo {
                width: 100%;
                height: 172px;
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 0 5px 10px rgba(0, 21, 41, .08);

                .welcome {
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    color: #1D2129;
                    font-size: 20px;
                    font-weight: bold;
                    border-bottom: 1px #F2F3F5 solid;

                    span {
                        margin-left: 4px;
                        color: #165DFF;
                    }
                }

                .more-info {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .user-avatar {
                        width: 60px;
                        height: 60px;
                        margin-right: 40px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }

                    .info-item {
                        height: 100%;
                        margin-right: 153px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        color: #1D2129;
                        font-size: 14px;

                        .top {
                            margin-bottom: 12px;
                        }

                        .info-label {
                            span {
                                color: #4E5969;
                            }
                        }

                        &:last-of-type {
                            margin-right: 68px;
                        }
                    }
                }
            }

            .user-log {
                width: 100%;
                flex: 1;
                margin-top: 20px;
                display: flex;
                justify-content: center;
                align-items: center;

                .log {
                    flex: 1;
                    height: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                    background-color: #fff;
                    border-radius: 6px;
                    box-shadow: 0 5px 10px rgba(0, 21, 41, .08);

                    .log-title {
                        margin-bottom: 15px;
                        color: #1D2129;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .show-item {
                        width: 100%;
                        height: 22px;
                        margin-bottom: 15px;
                        padding-right: 47px;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: flex-start;
                        align-content: center;
                        color: #1D2129;
                        font-size: 14px;

                        .item-label {
                            margin-right: 15px;
                        }

                        &:last-of-type {
                            margin-bottom: 0;
                        }

                        .item-process {
                            flex: 1;
                            height: 100%;
                        }
                    }
                }

                .sign-log {
                    margin-right: 20px;
                }
            }
        }

        .top-right {
            width: 304px;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 5px 10px rgba(0, 21, 41, .08);

            .part-header {
                width: 100%;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .part-title {
                    font-size: 16px;
                    font-weight: bold;
                }

                .more-btn {
                    color: #165DFF;
                    font-size: 12px;

                    &:hover {
                        cursor: pointer;
                        text-decoration: underline;
                    }
                }
            }

            .mes-container {
                width: 100%;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content:  flex-start;

                .mes-item {
                    width: 100%;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;

                    .mes-icon {
                        width: 44px;
                        height: 20px;
                        margin-right: 8px;
                        border-radius: 2px;
                        background-color: #E8FFFB;
                        color: #0FC6C2;
                        text-align: center;
                        line-height: 20px;
                    }

                    .mes-detail {
                        width: 218px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
    }

    .home-bottom {
        width: 100%;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .list {
            flex: 1;
            padding: 20px;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 6px;

            &:first-of-type {
                margin-right: 20px;
            }

            .header-icon {
                width: 200px;
                height: 36px;
                margin-left: 10px;
                padding-right: 8px;
                box-sizing: border-box;
                background-color: rgba(255, 184, 184, .2);
                color: #F53F3F;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                line-height: 36px;
                position: relative;

                &::before {
                    content: '';
                    width: 0px;
                    height: 0px;
                    display: block;
                    border-width: 0 0 36px 8px;
                    border-style: solid;
                    border-color: transparent rgba(255, 184, 184, .2) rgba(255, 184, 184, .2) transparent;
                    position: absolute;
                    top: 0;
                    left: -8px;
                }
            }

            .record-icon {
                width: 250px;
                background-color: rgba(190, 218, 255, .2);
                color: #3491FA;

                &::before {
                    border-color: transparent rgba(190, 218, 255, .2) rgba(190, 218, 255, .2) transparent;
                }
            }

            .rank {
                margin-top: 8px;
            }
        }
    }
}
</style>
