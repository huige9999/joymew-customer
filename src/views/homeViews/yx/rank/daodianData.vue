<template>
  <div class="page-container">
    <div class="page-header">
      <img class="back-icon" src="~@/assets/image/yx/back-icon2.png" @click="back" />
      <span @click="back">返回上一级</span>
    </div>
    <div class="table-container">
      <div class="table-content">
        <div class="table-header">
          <div class="header-label">获奖名单</div>
        </div>
        <div class="query-inputs">
          <div class="input-container">
            <div class="form-item">
              <div class="item-label">用户昵称</div>
              <el-input placeholder="输入用户昵称" v-model="queryObj.nickname" clearable> </el-input>
            </div>
            <!-- <div class="form-item">
              <div class="item-label">奖项</div>
              <el-select v-model="queryObj.awardType" placeholder="请选择">
                <el-option v-for="(item, index) in awardTypeMap" :key="index" :label="item.text" :value="item.text"> </el-option>
              </el-select>
            </div> -->
            <div class="form-item time-picker">
              <div class="item-label">领取时间</div>
              <el-date-picker v-model="queryObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
              </el-date-picker>
              <span class="split">-</span>
              <el-date-picker v-model="queryObj.end_time" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="handler">
            <div class="handler-btn" @click="initList">查询</div>
            <div class="handler-btn" @click="reset">重置</div>
          </div>
        </div>
        <div class="table">
          <el-table :header-cell-style="headerStyle" :v-load="isLoading" :data="couponList" stripe style="width: 100%" align="center">
            <el-table-column label="用户" min-width="150" align="center">
              <template slot-scope="scope">
                <div class="user-content">
                  <el-avatar :src="scope.row.headimg"></el-avatar>
                  <div class="user-name">{{ scope.row.nickname }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="100" align="center"></el-table-column>
            <!-- <el-table-column prop="awardType" label="中奖奖项" min-width="150" align="center">
              <template slot-scope="scope">
                <div class="award-type">{{ scope.row.awardType }}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="awardName" label="奖品内容" min-width="220" align="center"></el-table-column>
            <el-table-column label="券有效时间" min-width="220" align="center">
              <template slot-scope="scope">
                <div class="use-time">{{ scope.row.start_time }} 至 {{ scope.row.end_time }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="领取时间" min-width="180" align="center">
              <template slot-scope="scope">
                {{ new Date(scope.row.create_time) | formatDate }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="showCount"
            :total="totalResult"
            @current-change="getTargetData"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/format';
import { getDaodianData } from '@/api/yx/daodian';

export default {
  name: 'daodianData',
  data() {
    return {
      currentPage: 1,
      showCount: 10,
      queryObj: {
        start_time: '',
        end_time: '',
        nickname: '',
      },
      couponList: [
        {
          create_time: '2023-08-25 15:00:00',
          nickname: '温暖的李宁',
          headimg: '',
          start_time: '2023-08-25',
          end_time: '2024-08-25',
          awardName: '婚纱、衬衫、窗贴道具等',
          phone: '18888888888',
        },
      ],
      totalPage: 0,
      totalResult: 0,
      isLoading: false,
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundColor: '#fafafa',
      };
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
    this.initList();
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy-MM-dd');
    },
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'myActivities',
      });
    },
    formatTime(timeStr) {
      const time = new Date(timeStr);
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const day = time.getDay();
      const arr = [year, month, day];
      arr.forEach((item, index) => {
        if (Number(item) < 10) {
          arr[index] = `0${item}`;
        }
      });
      return arr.join('-');
    },
    /** 获取用户数据的方法 */
    async getList() {
      const res = await getDaodianData({
        username: this.queryObj.nickname || '',
        dateGe: this.queryObj.start_time || '',
        dateLe: this.queryObj.end_time || '',
        showCount: '10',
        currentPage: String(this.currentPage),
      });
      this.isLoading = false;
      const { list, totalPage, totalResult } = res.data;
      this.totalPage = totalPage;
      this.totalResult = totalResult;
      if (list) {
        // eslint-disable-next-line array-callback-return
        list.map((item) => {
          const { create_time, end_date, phone, start_date, wx_headimg, wx_name, name } = item;
          this.couponList.push({
            create_time,
            nickname: wx_name,
            headimg: wx_headimg,
            start_time: start_date,
            end_time: end_date,
            phone,
            awardName: name,
          });
        });
      }
    },
    /** 初始化数据列表 */
    initList() {
      this.currentPage = 1;
      this.totalPage = 0;
      this.totalResult = 0;
      this.couponList.splice(0);
      this.isLoading = true;
      this.getList();
    },
    /** 获取指定页的数据 */
    getTargetData(e) {
      const targetPage = e;
      this.currentPage = targetPage;
      this.totalPage = 0;
      this.totalResult = 0;
      this.couponList.splice(0);
    },
    reset() {
      this.currentPage = 1;
      this.totalPage = 0;
      this.totalResult = 0;
      this.queryObj = {
        start_time: '',
        end_time: '',
        nickname: '',
      };
      this.initList();
    },
  },
};
</script>

<style lang="less" scoped>
.page-container {
  width: 100%;

  .page-header {
    width: 100%;
    padding: 14px 0 14px 21px;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-weight: bold;

    .back-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      cursor: pointer;
    }
    span {
      cursor: pointer;
    }
  }

  .table-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    .table-content {
      width: 100%;
      min-height: 600px;
      padding-bottom: 20px;
      box-sizing: border-box;
      overflow: auto;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 2px 3px 10px 0px rgba(119, 119, 119, 0.1);

      .table-header {
        width: 100%;
        height: 69px;
        background-color: #fff;
        border-bottom: 1px solid #eeeeee;
        box-sizing: border-box;
        position: relative;
        .header-label {
          width: 90px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e87f0;
          font-size: 16px;
          font-weight: bold;
          background-color: rgba(30, 135, 240, 0.17);
          position: absolute;
          bottom: 0;
          left: 20px;

          &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 21px;
            height: 5px;
            background-color: #1e87f0;
            border-radius: 3px;
            transform: translateX(-50%);
          }
        }
      }

      .table {
        padding: 0 20px;
        box-sizing: border-box;
        .table-header-row {
          background-color: rgba(0, 0, 0, 0.4);
        }
      }

      .query-inputs {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .input-container {
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .form-item {
            width: 250px;
            height: 72px;
            margin-bottom: 10px;
            margin-right: 24px;
            display: flex;
            align-items: center;
            justify-content: center;

            .item-label {
              flex-shrink: 0;
              margin-right: 20px;
            }

            &:last-of-type {
              margin-right: 0;
            }
          }
          .time-picker {
            width: 450px;

            .split {
              margin: 0 10px;
            }
          }
        }

        .handler {
          height: 32px;
          padding-left: 24px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border-left: 1px solid #e5e6eb;

          .handler-btn {
            width: 60px;
            height: 100%;
            line-height: 32px;
            text-align: center;
            background-color: #f2f3f5;
            font-size: 14px;
            cursor: pointer;
            &:first-of-type {
              margin-right: 17px;
              color: #ffffff;
              background-color: #1e87f0;
            }
          }
        }
      }

      .user-content {
        width: 100%;
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .user-name {
          margin-left: 10px;
        }
      }

      .award-type {
        color: #ff6260;
        font-size: 14px;
        font-weight: bold;
      }

      .pagination {
        width: 100%;
        margin-top: 20px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>
