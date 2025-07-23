<template>
    <div class="hd-container">
        <div class="query-selectors">
            <div class="part-title">用户查询</div>
            <div class="selector-part">
                <div class="selectors">
                    <div class="selector phone-pick">
                        <div class="select-label">手机号</div>
                        <el-input placeholder="请输入手机号" v-model="queryData.phonenumber" clearable>
                        </el-input>
                    </div>
                    <div class="selector date-pick">
                        <div class="select-label">开始日期</div>
                        <el-date-picker v-model="queryData.start_time" value-format="yyyy-MM-dd" type="date"
                            placeholder="请选择开始日期" clearable>
                        </el-date-picker>
                    </div>
                    <div class="selector date-pick">
                        <div class="select-label">结束日期</div>
                        <el-date-picker v-model="queryData.end_time" value-format="yyyy-MM-dd" type="date"
                            placeholder="请选择结束日期" clearable>
                        </el-date-picker>
                    </div>
                    <div class="selector scenario-pick">
                        <div class="select-label">版本类型</div>
                        <el-select v-model="queryData.scenario" placeholder="请选择版本类型" clearable>
                            <el-option v-for="item in scenarioList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selector user-kind">
                        <div class="select-label">用户类型</div>
                        <el-select v-model="queryData.uesr_kind" placeholder="请选择用户类型" clearable>
                            <el-option v-for="item in userKinds" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selector schedule-pick">
                        <div class="select-label">时间段</div>
                        <el-select v-model="queryData.wedding_schedule" placeholder="请选择时间段" clearable>
                            <el-option v-for="item in scheduleList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selector activityTime-pick">
                        <div class="select-label">日期</div>
                        <el-select v-model="queryData.using_date_sort" placeholder="请选择活动时间" clearable>
                            <el-option v-for="item in activityTimeList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selector end-ip-pick">
                        <div class="select-label">登录地址</div>
                        <el-input placeholder="请输入登录地址" prefix-icon="el-icon-search" v-model="queryData.end_ip_location"
                            clearable>
                        </el-input>
                    </div>
                </div>
                <div class="btn-handler">
                    <div class="query-btn btn" @click="searchBtn">查询</div>
                    <div class="reset-btn btn" @click="resetBtn">重置</div>
                </div>
            </div>
        </div>
        <div class="hudong-table">
            <el-table v-loading="isloading" border :data="hdList" :span-method="hebing" :header-cell-style="{background:'#f2f3f5'}">
                <el-table-column label="活动信息" align="left" min-width="310">
                    <template slot-scope="scope">
                        <div class="hudong-item-container">
                            <div class="siyi-info">
                                <div class="siyi-avatar">
                                    <el-avatar :src="scope.row.avator"></el-avatar>
                                </div>
                                <div class="siyi-base-info">
                                    <div class="siyi-name">{{ scope.row.emcee_name }}</div>
                                    <div class="siyi-phone-number">
                                        {{ scope.row.phonenumber }}
                                    </div>
                                </div>
                                <div class="siyi-type">
                                    {{ userKinds[scope.row.uesr_kind].label }}
                                </div>
                                <div class="siyi-earning item-flex">
                                    <span class="info-label">总收益：</span>{{ scope.row.earning_total + "元" }}
                                </div>
                                <div class="siyi-youxiao item-flex">
                                    <span class="info-label">有效场次：</span>{{ scope.row.splactual + "场" }}
                                </div>
                                <div class="siyi-invite item-flex">
                                    <span class="info-label">邀请：</span>{{ scope.row.invite_pcount + "人" }}
                                </div>
                                <div class="siyi-status item-flex font-bold">
                                    <span class="info-label">周期：</span>{{ scope.row.user_state_name }}
                                </div>
                                <div class="siyi-address item-flex font-bold">
                                    <img class="icon-img" src="@/assets/image/partner/hudong/location-icon.png" />
                                    {{ scope.row.end_ip_location.split(",").join(" ") }}
                                </div>
                                <div class="siyi-address item-flex">
                                    <img class="icon-img" src="@/assets/image/partner/hudong/kf-icon.png" />
                                    {{ scope.row.kf_user ? scope.row.kf_user : "暂无" }}
                                </div>
                                <div class="siyi-user-icon item-flex">
                                    <el-popover placement="left" title="上级信息" width="220" trigger="hover">
                                        <div class="hover-el item-flex" slot="reference">
                                            <img class="icon-img" src="@/assets/image/partner/hudong/person-icon.png" />上级信息
                                        </div>
                                        <div class="boss-info">
                                            <div class="boss-name info-item">
                                                <span class="info-label">用户名：</span>{{ scope.row.parent_name }}
                                            </div>
                                            <div class="boss-phone info-item">
                                                <span class="info-label">手机号：</span>{{ scope.row.parent_phone }}
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                            <div class="wedding-table">
                                <el-table border :data="[scope.row]" :show-header="false">
                                    <el-table-column min-width="310">
                                        <template slot-scope="subScope">
                                            <div class="hudong-info-container">
                                                <div class="container-right">
                                                    <div class="line-one">
                                                        <div class="item-theme">
                                                            {{ subScope.row.theme }}
                                                        </div>
                                                        <div class="item-time">
                                                            {{ subScope.row.wedding_schedule_name }}
                                                        </div>
                                                    </div>
                                                    <div class="line-two">
                                                        <span class="item-label">日期：</span>{{ subScope.row.using_date }}
                                                    </div>
                                                    <div class="line-three">
                                                        <span class="item-label">地点：</span>{{ subScope.row.hotel_name }}
                                                    </div>
                                                    <div class="line-four">
                                                        <span class="item-label">类型：</span>{{ subScope.row.banben }}
                                                    </div>
                                                    <div class="line-five" v-if="subScope.row.comment_json">
                                                        <span class="item-label">主持人二维码：</span> <img
                                                            :src="subScope.row.comment_json" class="qrcode" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="签到/弹幕数" align="center" min-width="150">
                                        <template slot-scope="subScope">
                                            <div class="people-num">
                                                <div class="sign-in-people">
                                                    {{ "签到数：" + subScope.row.pcu + " 人" }}
                                                </div>
                                                <div class="chat-size">
                                                    {{ "弹幕数：" + subScope.row.chat_size + " 条" }}
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="红包金额" align="center" min-width="100">
                                        <template slot-scope="subScope">
                                            <div style="color: #f53f3f">
                                                {{ subScope.row.totalsum + " 元" }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="收益信息" align="center" min-width="150">
                                        <template slot-scope="subScope">
                                            <div class="earning-detail">
                                                <div class="hbbl" style="color: #f53f3f">
                                                    {{
                                                        "红包比例：" +
                                                        (
                                                            (subScope.row.hby_kd_rate_val * 1) /
                                                            100
                                                        ).toFixed(2)
                                                    }}
                                                </div>
                                                <div class="gift">
                                                    {{ "礼物收益：" + subScope.row.gift + " 元" }}
                                                </div>
                                                <div class="game">
                                                    {{ "游戏收益：" + subScope.row.game_income + " 元" }}
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" align="center" min-width="154">
                                        <template slot-scope="subScope">
                                            <div class="handler-btns">
                                                <div class="upload-record-btn btn"
                                                    @click="uploadRecord(subScope.row.userId)">
                                                    跟进
                                                </div>
                                                <div class="record-list-btn btn"
                                                    @click="turnToRecordList(subScope.row.userId)">
                                                    跟进记录
                                                </div>
                                                <div class="record-list-btn btn" @click="turnToUserDetail(subScope.row)">
                                                    查看详情
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="签到/弹幕数" align="center" min-width="150"></el-table-column>
                <el-table-column label="红包金额" align="center" min-width="100"></el-table-column>
                <el-table-column label="收益信息" align="center" min-width="150"></el-table-column>
                <el-table-column label="操作" align="center" min-width="154"></el-table-column>
            </el-table>
        </div>
        <div class="pagination-content">
            <el-pagination background v-show="totalPage > 0" layout="prev, pager, next, total" :total="total"
                :page.sync="queryData.currentPage" :limit.sync="queryData.showCount" @current-change="changePage" />
        </div>
        <div class="page-dialog">
            <el-dialog :title="dialogForm.title" :visible.sync="dialogVisible" :width="dialogWidth" center
                @close="closeHandler">
                <div class="dialog-content">
                    <div v-if="currentType === 'user'">
                        <el-select v-model="modifyInfo.user_kind" placeholder="请选择修改后用户的类型">
                            <el-option v-for="kind in userKinds" :key="kind.label" :label="kind.label" :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-else-if="currentType === 'kf'">
                        <el-select v-model="modifyInfo.kf_user" placeholder="请选择修改后的客服">
                            <el-option v-for="kf in kfUserList" :key="kf" :value="kf" :label="kf"></el-option>
                        </el-select>
                    </div>
                    <div v-else-if="currentType === 'uploadRecord'">
                        <div class="input-record">
                            <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="modifyInfo.record_remark">
                            </el-input>
                        </div>
                    </div>
                    <div v-else-if="currentType === 'recordList'">
                        <el-table v-loading="recordLoading" :header-cell-style="{background:'#f2f3f5'}" :data="recordList" border size="small">
                            <el-table-column prop="emcee_name" label="昵称" width="240" align="center">
                            </el-table-column>
                            <el-table-column prop="phonenumber" label="手机号" width="160" align="center">
                            </el-table-column>
                            <el-table-column prop="record_time" label="跟进日期" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="record_remark" label="跟进内容" align="center">
                            </el-table-column>
                        </el-table>
                        <div class="pagination-content">
                            <el-pagination background v-show="recordTotal > 0" layout="prev, pager, next, total"
                                :total="recordTotal" :page.sync="recordList.currentPage" :limit.sync="recordList.showCount"
                                @current-change="changePageRecord" />
                        </div>
                    </div>
                </div>
                <template slot="footer" v-if="currentType !== 'recordList'">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm">确 定</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {
  getHdList,
  uploadRecord,
  getRecordList,
} from '@/api/partnerSystem/index';

const scenarioList = [
  {
    label: '婚礼版',
    value: '0',
  },
  {
    label: '企业版',
    value: '1',
  },
  {
    label: '生日版',
    value: '2',
  },
  {
    label: '宝宝宴',
    value: '21',
  },
  {
    label: '寿宴',
    value: '22',
  },
  {
    label: '成人礼',
    value: '23',
  },
  {
    label: '毕业礼',
    value: '41',
  },
  {
    label: '谢师宴',
    value: '42',
  },
  {
    label: '金榜题名',
    value: '43',
  },
];
export default {
  name: 'PartnerHd',
  data() {
    return {
      isloading: false,
      dialogVisible: false,
      scenarioList,
      queryData: {
        phonenumber: '',
        start_time: '',
        end_time: '',
        scenario: '',
        uesr_kind: '',
        wedding_schedule: '',
        using_date_sort: '',
        end_ip_location: '',
        currentPage: 1,
        showCount: 10,
      },
      userKinds: {
        1: {
          value: '1',
          label: '主持人',
        },
        2: {
          value: '2',
          label: '婚庆公司',
        },
        3: {
          value: '3',
          label: '酒店婚礼堂',
        },
        4: {
          value: '4',
          label: '企业C端用户',
        },
      },
      scheduleList: [
        {
          value: '1',
          label: '午宴',
        },
        {
          value: '2',
          label: '晚宴',
        },
      ],
      activityTimeList: [
        {
          label: '从近到远',
          value: 2,
        },
        {
          label: '从远到近',
          value: 1,
        },
      ],
      hdList: [],
      totalPage: 1,
      total: 0,
      dialogForm: {
        title: '',
        userId: '',
      },
      currentType: '',
      modifyInfo: {
        user_kind: '',
        kf_user: '',
        record_remark: '',
      },
      recordFormData: {
        currentPage: 1,
        showCount: 10,
        userId: '',
        start_time: '',
        end_time: '',
        type: '',
      },
      recordLoading: false,
      recordList: [],
      recordTotal: 0,
    };
  },
  mounted() {
    this.getHdList();
  },
  computed: {
    dialogWidth() {
      return this.currentType === 'recordList' ? '1200px' : '400px';
    },
  },
  methods: {
    async getHdList() {
      this.isloading = true;
      const res = await getHdList(this.queryData);
      this.isloading = false;
      this.totalPage = res.data.totalPage;
      this.total = res.data.totalResult;
      this.hdList = res.data.list;
    },
    searchBtn() {
      this.queryData.currentPage = 1;
      this.getHdList();
    },
    resetBtn() {
      this.queryData = {
        start_time: '',
        end_time: '',
        phonenumber: '',
        currentPage: 1,
        showCount: 10,
        scenario: '',
        uesr_kind: '',
        wedding_schedule: '',
        end_ip_location: '',
        using_date_sort: '',
      };
      this.getHdList();
    },
    // 合并表格列方法
    hebing({ columnIndex }) {
      if (columnIndex === 0) {
        return [1, 5];
      }
      return false;
    },
    changePage(val) {
      // 显示加载图标
      this.isLoading = true;
      // 改变当前页
      this.queryData.currentPage = val;
      this.getHdList();
    },
    changePageRecord(val) {
      // 显示加载图标
      this.isLoading = true;
      this.recordFormData.currentPage = val;
      this.getRecordList();
    },
    // 上传跟进内容
    uploadRecord(id) {
      this.dialogForm.title = '上传跟进内容';
      this.dialogVisible = true;
      this.currentType = 'uploadRecord';
      this.dialogForm.userId = id;
    },
    // 展示跟进列表
    turnToRecordList(id) {
      this.recordFormData.userId = id;
      this.currentType = 'recordList';
      this.dialogForm.title = '跟进记录';
      this.dialogVisible = true;
      this.getRecordList();
    },
    // 跳转到详情页
    turnToUserDetail(row) {
      this.$router.push({
        name: 'PartnerHdDetail',
        params: {
          id: row.id,
          userId: row.userId,
        },
      });
    },
    // 弹出框确定
    dialogConfirm() {
      if (this.currentType === 'uploadRecord') {
        uploadRecord({
          userId: this.dialogForm.userId,
          record_remark: this.modifyInfo.record_remark,
        })
          .then(() => {
            this.dialogVisible = false;
          })
          .then(() => {
            this.getHdList();
          });
      }
    },
    // 弹出框关闭按钮
    closeHandler() {
      this.dialogVisible = false;
      this.dialogForm = {
        title: '',
        userId: '',
      };
      this.modifyInfo = {
        user_kind: '',
        kf_user: '',
        record_remark: '',
      };
    },
    getRecordList() {
      this.recordLoading = true;
      getRecordList(this.recordFormData).then((res) => {
        console.log('跟进列表信息：', res.data);
        this.recordLoading = false;
        this.recordList = [...res.data.list];
        this.recordTotal = res.data.totalResult;
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.hd-container {
    width: 100%;
    height: 100%;

    .query-selectors {
        width: 100%;
        // height: 164px;
        margin-bottom: 20px;
        padding: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

        .part-title {
            margin-bottom: 16px;
            font-size: 20px;
            font-weight: bold;
        }

        .selector-part {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .selectors {
                flex: 1;

                .selector {
                    height: 32px;
                    float: left;
                    margin-right: 24px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .select-label {
                        margin-right: 16px;
                        font-size: 14px;
                        color: #4E5969;
                        white-space: nowrap;
                    }
                }

                .phone-pick::v-deep {
                    .el-input__inner {
                        width: 150px;
                    }
                }

                .date-pick::v-deep {
                    .el-date-editor {
                        width: 160px;
                    }

                    // .el-input__inner {
                    //     width: 150px;
                    // }
                }

                .scenario-pick::v-deep {
                    .el-input {
                        width: 150px;
                    }
                }

                .user-kind::v-deep {
                    .el-input {
                        width: 150px;
                    }
                }

                .schedule-pick::v-deep {
                    .el-input {
                        width: 150px;
                    }
                }

                .activityTime-pick::v-deep {
                    .el-input__inner {
                        width: 180px;
                    }
                }

                .end-ip-pick::v-deep {
                    .el-input__inner {
                        width: 200px;
                    }
                }
            }

            .btn-handler {
                width: 161px;
                height: 32px;
                padding-left: 14px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-around;
                align-items: center;
                border-left: 1px solid #E5E6EB;

                .btn {
                    width: 60px;
                    height: 32px;
                    background-color: #F2F3F5;
                    border-radius: 2px;
                    font-size: 14px;
                    line-height: 32px;
                    letter-spacing: 1px;
                    text-align: center;
                    cursor: pointer;
                }

                .query-btn {
                    color: #fff;
                    background-color: #165DFF;
                }
            }

        }
    }

    .hudong-table {
        width: 100%;
        height: 70%;

        .hudong-item-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .siyi-info {
                width: 100%;
                height: 64px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                background-color: #e5e6eb;

                .siyi-avatar {
                    width: 38px;
                    height: 38px;
                    margin-left: 16px;
                    margin-right: 10px;
                }

                .siyi-base-info {
                    height: 100%;
                    margin-right: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    line-height: 20px;

                    .siyi-name {
                        width: 100%;
                        color: #165dff;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: left;
                    }

                    .siyi-phone-number {
                        color: #86909c;
                    }
                }

                .siyi-type {
                    margin-right: 26px;
                    color: #0fc6c2;
                    font-size: 14px;
                }

                .siyi-earning {
                    color: #f53f3f;
                    font-size: 14px;
                    font-weight: bold;
                }

                .siyi-user-icon {
                    height: 100%;

                    .hover-el {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                }

                .item-flex {
                    margin-right: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                }

                .info-label {
                    margin-right: 6px;
                    font-size: 14px;
                    font-weight: bold;
                }

                .icon-img {
                    width: 20px;
                    height: 20px;
                    margin-right: 6px;
                }

                .font-bold {
                    font-weight: bold;
                }
            }

            .wedding-table {
                width: 100%;

                .hudong-info-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-content: center;

                    .container-right {
                        flex: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;

                        .line-one {
                            margin-bottom: 5px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            text-align: center;

                            .item-theme {
                                max-width: 200px;
                                margin-right: 12px;
                                color: #165dff;
                                font-weight: bold;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }

                            .item-time {
                                width: 50px;
                                color: #ff9a2e;
                            }
                        }

                        .line-two {
                            margin-bottom: 5px;
                        }

                        .line-three {
                            margin-bottom: 5px;
                        }

                        .line-four {
                            color: #165dff;
                            margin-bottom: 5px;

                            span {
                                color: #4e5969;
                            }
                        }

                        .line-five {
                            display: flex;
                            align-items: center;

                            span {
                                color: #4e5969;
                            }

                            .qrcode {
                                width: 25px;
                                height: 25px;
                            }
                        }
                    }
                }

                .people-num {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .sign-in-people {
                        margin-bottom: 5px;
                    }
                }

                .handler-btns {
                    width: 100%;
                    height: 100%;
                    padding: 0 35px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    box-sizing: border-box;

                    .btn {
                        margin-bottom: 5px;
                        color: #6aa1ff;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .pagination-content {
        width: 100%;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
}
</style>
