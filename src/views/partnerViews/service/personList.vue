<template>
    <div class="person-list-container">
        <div class="group-box">
            <div class="group">
                <div class="top">
                    <div class="group-name">
                        <img src="@/assets/image/icon/primaryIcon.png" alt="" />
                        <span>一级团队</span>
                    </div>
                    <div class="sum">{{ cardInfo.group1.totalSize }}<span calss="unit">人</span></div>
                </div>
                <div class="form-data">
                    <div class="form-item">
                        <div class="label">已激活:</div>
                        <div class="count" style="margin-right: 100px ;color:#3BCACD">
                            {{ cardInfo.group1.jhSize }} <span calss="unit" style="color:#333333">人</span>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">礼物总收益:</div>
                        <div class="count" style="color:#3BCACD">{{ cardInfo.group1.allGiftIncome }} <span calss="unit"
                                style="color:#333333">元</span></div>
                    </div>
                    <div class="form-item">
                        <div class="label">总场次:</div>
                        <div class="count" style="margin-right: 100px;color:#3BCACD">
                            {{ cardInfo.group1.allSpl }} <span calss="unit" style="color:#333333">场</span>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">我的收益:</div>
                        <div class="count" style="color:#FB466C">{{ cardInfo.group1.myIncome }} <span calss="unit"
                                style="color:#333333">元</span></div>
                    </div>
                </div>
            </div>
            <div class="group">
                <div class="top">
                    <div class="group-name">
                        <img src="@/assets/image/icon/secondaryIcon.png" alt="" />
                        <span>二级团队</span>
                    </div>
                    <div class="sum">{{ cardInfo.group2.totalSize }}<span calss="unit">人</span></div>
                </div>
                <div class="form-data">
                    <div class="form-item">
                        <div class="label">已激活:</div>
                        <div class="count" style="margin-right: 100px ;color:#3BCACD">
                            {{ cardInfo.group2.jhSize }} <span calss="unit" style="color:#333333">人</span>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">礼物总收益:</div>
                        <div class="count" style="color:#3BCACD">{{ cardInfo.group2.allGiftIncome }} <span calss="unit"
                                style="color:#333333">元</span></div>
                    </div>
                    <div class="form-item">
                        <div class="label">总场次:</div>
                        <div class="count" style="margin-right: 100px;color:#3BCACD">
                            {{ cardInfo.group2.allSpl }} <span calss="unit" style="color:#333333">场</span>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">我的收益:</div>
                        <div class="count" style="color:#FB466C">{{ cardInfo.group2.myIncome }} <span calss="unit"
                                style="color:#333333">元</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="person-list-table">
            <el-table :data="levelOnePerson" :header-cell-style="{background:'#f2f3f5'}" style="width: 100%" row-key="id" lazy
                border>
                <el-table-column label="姓名" header-align="center" align="center" min-width="150">
                    <template slot-scope="scope">
                        <div class="user-info">
                            <el-avatar :size="22" :src="scope.row.avator"></el-avatar>
                            <span style="margin-left: 5px;  display: inline-block; text-align: centr">{{
                                scope.row.emcee_name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="phonenumber" label="手机号" header-align="center" align="center" min-width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 5px;  display: inline-block; text-align: center">{{
                            scope.row.phonenumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="spltotal" header-align="center" align="center" label="申请场次">
                    <template slot-scope="scope">
                        <span style="margin-left: 5px;  display: inline-block; text-align: center">
                            {{ scope.row.spltotal }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="splactual" header-align="center" align="center" label="完成场次" min-width="50">
                    <template slot-scope="scope">
                        <span style="margin-left: 5px;  display: inline-block; text-align: center">
                            {{ scope.row.splactual }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_income" header-align="center" align="center" label="总收益">
                    <template slot-scope="scope">
                        <span style="margin-left: 5px;  display: inline-block; text-align: center">
                            {{ scope.row.total_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="time_lastlogin" header-align="center" align="center" label="最后登陆" min-width="70">
                    <template slot-scope="scope">
                        <span style="margin-left: 5px;  display: inline-block; text-align: center">
                            {{ new Date(scope.row.format_time_lastlogin) | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="center" header-align="center" align="center" label="查看场次">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getInfo(scope.row)">查看明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next, total" :page-size="showCount" :total="total"
                    @current-change="changePage" :hide-on-single-page="true" />
            </div>
        </div>
        <el-dialog :visible.sync="dialogTableVisible" width="85%" style="margin-left: 14%">
            <div class="abow_dialog">
                <el-table :data="getInfoList" :header-cell-style="{background:'#f2f3f5'}" style="width: 100%" height="70vh"
                    v-loading="tableLoading">
                    <el-table-column prop="emcee_name" label="姓名" align="center" min-width="100"> </el-table-column>
                    <el-table-column prop="theme" label="活动名称 " align="center" min-width="120"> </el-table-column>
                    <el-table-column prop="using_date" label="活动时间" align="center" min-width="100">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.using_date) | dateFormat }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="hotel_name" label="活动地点" align="center"> </el-table-column>

                    <el-table-column prop="scenario" label="活动类型" align="center">
                        <template slot-scope="scope">
                            <span>{{ getInforType(scope.row.scenario) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pcu" align="center">
                        <template slot="header">
                            <span>签到人数</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gift_income" align="center" min-width="100">
                        <template slot="header">
                            <span style="font-size: 12px">礼物收益</span>
                            <el-tooltip class="item" effect="dark" content="您所邀请用户的的礼物收益" placement="right">
                                <i class="el-icon-question" style="color: #249aff"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="earning_gkdhb" align="center" min-width="100">
                        <template slot="header">
                            <span>红包收益</span>
                            <el-tooltip class="item" effect="dark" content="您所邀请用户的的红包收益" placement="right">
                                <i class="el-icon-question" style="color: #249aff"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="earning_gwheel" align="center" min-width="100">
                        <template slot="header">
                            <span>扭一扭收益</span>
                            <el-tooltip class="item" effect="dark" content="您所邀请用户的的扭一扭收益" placement="right">
                                <i class="el-icon-question" style="color: #249aff"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="earning_gegg" align="center" min-width="100">
                        <template slot="header">
                            <span>开宝箱收益</span>
                            <el-tooltip class="item" effect="dark" content="您所邀请用户的的开宝箱收益" placement="right">
                                <i class="el-icon-question" style="color: #249aff"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="live_all_income" align="center">
                        <template slot="header">
                            <span>总收益</span>
                            <el-tooltip class="item" effect="dark" content="您所邀请用户的总收益" placement="right">
                                <i class="el-icon-question" style="color: #249aff"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagenation">
                <el-pagination background layout="prev, pager, next, total" :page-size="getInfoTotalshowCount"
                    :total="getInfoTotalResult" :hide-on-single-page="true" class="my-pagination"
                    @current-change="changePage1" />
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
  getHhrInfo1,
  getHhrInfo2,
  getHhrDetail,
} from '@/api/partnerSystem/index';
import { formatDate } from '@/utils/format';

export default {
  name: 'PartnerPersonList',
  data() {
    return {
      isLoading: false,
      tableLoading: false,
      dialogTableVisible: false,
      showCount: 10,
      currentPage: 1,
      total: 0,
      totalPage: 1,
      levelOnePerson: [],
      invitee_id: '',
      getInfoTotalCurrentPage: 1,
      getInfoTotalshowCount: 10,
      getInfoTotalResult: 0,
      getInfoList: [],
      cardInfo: {
        group1: {
          totalSize: '', // 总人数
          jhSize: '', // 激活人数
          allGiftIncome: '', // 礼物总收益
          allSpl: '', // 总场次
          myIncome: '', // 我的收益
        },
        group2: {
          totalSize: '',
          jhSize: '',
          allGiftIncome: '',
          allSpl: '',
          myIncome: '',
        },
      },
    };
  },
  created() {
    this.getHhrInfo1();
    this.getLevelOnePerson();
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd');
    },
  },
  computed: {
    getInforType() {
      return (type) => {
        console.log(type);
        if (type.length > 1) {
          type = String(type).substr(0, 1);
        }
        let tmpSceneVal;
        if (type === 0 || type === '0') {
          tmpSceneVal = '婚礼版';
        }
        if (type === 1 || type === '1') {
          tmpSceneVal = '年会版';
        }
        if (type === 2 || type === '2') {
          tmpSceneVal = '生日版';
        }
        return tmpSceneVal;
      };
    },
  },
  methods: {
    async getHhrInfo1() {
      this.isLoading = true;
      const res = await getHhrInfo1();
      console.log('人员列表数据：', res.data);
      const { hhr, info1, info2 } = res.data;
      this.isLoading = false;
      this.cardInfo.group1.totalSize = info1.size;
      this.cardInfo.group1.jhSize = info1.jhSize.size;
      this.cardInfo.group1.allGiftIncome = hhr.one_income_all;
      this.cardInfo.group1.allSpl = info1.wedding_size;
      this.cardInfo.group1.myIncome = hhr.one_income_my;

      this.cardInfo.group2.totalSize = info2.size;
      this.cardInfo.group2.jhSize = info2.jhSize.size;
      this.cardInfo.group2.allGiftIncome = hhr.two_income_all;
      this.cardInfo.group2.allSpl = info2.wedding_size;
      this.cardInfo.group2.myIncome = hhr.two_income_my;
    },
    async getLevelOnePerson() {
      this.isLoading = true;
      const res = await getHhrInfo2({
        params: '',
        showCount: this.showCount,
        currentPage: this.currentPage,
      });
      console.log('一级团队用户数据：', res.data);
      const target = res.data;
      this.levelOnePerson = [...target.list];
      this.total = target.totalResult;
      this.totalPage = target.totalPage;
    },
    changePage(val) {
      // 显示加载图标
      this.isLoading = true;
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      // this.getMyInviteList();
      this.getLevelOnePerson();
    },
    getInfo(obj) {
      console.log(obj);
      this.invitee_id = obj.id;
      this.getDialogTableData();
      this.dialogTableVisible = true;
    },
    async getDialogTableData() {
      const Obj = {
        invitee_id: this.invitee_id,
        currentPage: this.getInfoTotalCurrentPage,
        showCount: this.getInfoTotalshowCount,
      };
      this.tableLoading = true;
      const res = await getHhrDetail(Obj);
      console.log('明细信息', res);
      this.tableLoading = false;
      this.getInfoList = res.data.liveList;
      this.getInfoTotalResult = res.data.totalResult;
    },
    changePage1(val) {
      // 显示加载图标
      this.loading = true;
      // 改变当前页
      this.getInfoTotalCurrentPage = val;
      console.log(this.getInfoTotalCurrentPage);
      // 请求数据
      this.getDialogTableData();
    },
  },
};
</script>
<style lang="less" scoped>
.person-list-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 6px;

    .group-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;

        div {
            box-sizing: border-box;
        }

        .group {
            flex: 1;
            // height: 14vw;
            margin-right: 20px;
            padding: 1.8vw;
            box-sizing: border-box;
            background: #fff;
            // border: 1px solid red;
            border-radius: 6px;
            color: #333333;
            box-shadow: 3px 4px 13px 0px rgba(119, 119, 119, 0.1);

            &:last-of-type {
                margin-right: 0;
            }

            .top {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                height: 4vw;

                .group-name {
                    font-size: 27px;
                    font-size: 1.4vw;
                    display: flex;
                    align-items: center;

                    img {
                        width: 66px;
                        height: 66px;
                    }
                }

                .sum {
                    font-size: 43px;
                    font-size: 2.23vw;
                }
            }

            .form-data {
                display: flex;
                flex-wrap: wrap;
                height: 10vw;

                justify-content: space-around;
                align-items: space-around;

                .form-item {
                    height: 5vw;
                    width: 50%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .label {
                        font-size: 1.1vw;
                    }

                    .count {
                        font-size: 1.6vw;

                        span {
                            font-size: 1.1vw;
                            height: 5vw;
                            line-height: 5vw;
                        }
                    }
                }
            }
        }
    }

    .person-list-table {
        width: 100%;
        margin-top: 20px;

        .user-info {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .pagination {
            width: 100%;
            padding: 10px 0;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-content: center;
            background-color: #fff;
        }
    }

    .abow_dialog {
        margin-bottom: 10px;
    }

    .pagenation {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
}
</style>
