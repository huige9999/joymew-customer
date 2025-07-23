<template>
  <sub-page class="xifenIndex">
    <xifen-header class="header" :name="name" :avatar="avatar" />
    <main-card class="xifenTable">
      <div
        class="button"
        @click="bindOfficialAccount"
        v-if="powder_switch === '1'"
      >
        公众号绑定
      </div>
      <my-table class="my-table" v-if="powder_switch === '1'">
        <el-table
          :data="xiFenTableData"
          header-row-class-name="table-header"
          v-loading="tableLoading"
          style="width: 100%"
        >
          <el-table-column
            label="编号"
            header-align="center"
            align="center"
            min-width="30"
            class-name="column-header"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
              <!-- <div>{{scope.row}}</div> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="wx_avator"
            label="公众号logo"
            header-align="center"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <el-avatar :size="22" :src="scope.row.wx_avator"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            prop="wx_name"
            label="公众号名称"
            class-name="name"
            min-width="65"
          >
          </el-table-column>
          <el-table-column
            prop="wx_public_name"
            header-align="center"
            align="center"
            label="公众号类型"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="授权状态"
            min-width="40"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.status ? "已授权" : "已授权" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            header-align="center"
            align="center"
            label="授权时间"
            min-width="50"
          >
            <template slot-scope="scope">
              {{ new Date(scope.row.create_time) | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ispowder"
            header-align="center"
            align="center"
            label="吸粉操作"
            min-width="35"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.ispowder"
                active-value="1"
                inactive-value="2"
                active-color="#249AFF"
                inactive-color="#D5D9DF"
                @change="setIsXifen(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="ispowder"
            header-align="center"
            align="center"
            label="游戏二维码绑定"
            min-width="135"
          >
            <template slot-scope="scope">
              <div
                class="editEntry"
                @click="openGameQrcodeBind(scope.row)"
                v-if="scope.row.ispowder === '1'"
              >
                绑定
              </div>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="showCount"
        :total="totalCount"
        class="my-pagination"
        v-if="powder_switch === '1'"
      />
      <div class="introCover" v-if="powder_switch === '0'">
        <div class="tit">流量如黄金的时代，实现低成本转化客户</div>
        <img src="@/assets/image/icon/xifen/text.png" class="textImg" />
        <div class="ctBox">
          <div class="funcIntro">
            嗨喵营销获客功能，0成本快速增加粉丝，迅速传播推广企业品牌，可持续后续营销活动。
          </div>
          <div class="funcList">
            <div class="funcItem">
              <img src="@/assets/image/icon/xifen/func1.png" />
              增加曝光
            </div>
            <div class="funcItem">
              <img src="@/assets/image/icon/xifen/func2.png" />
              快速吸粉
            </div>
            <div class="funcItem">
              <img src="@/assets/image/icon/xifen/func4.png" />
              转化意向
            </div>
            <div class="funcItem">
              <img src="@/assets/image/icon/xifen/func3.png" />
              成交订单
            </div>
          </div>
          <div class="contactInfo">
            <img
              src="https://ustatic.hudongmiao.com/miao/app/cp-qrcode.png"
              class="qrcodeImg"
            />
            <div class="contactText">
              <div class="para">1.微信扫码咨询，专属客服7*24小时贴心服务</div>
              <div class="para">2.支持换号，灵活配置，打造公众号矩阵</div>
            </div>
          </div>
        </div>
      </div>
    </main-card>
    <div class="tips">
      <div class="text">您可能需要了解：</div>
      <div class="items">
        <span
          @click="
            openInfoBox(
              '什么是订阅号：',
              '订阅号生成的活动二维码为原始二维码，每次只能申请一场活动。订阅号同时举行多场活动，扫码后会跳转到开始时间最近的一场活动。【未认证的服务号，也只能生成原始二维码】'
            )
          "
          >什么是订阅号？</span
        >
        <span @click="clickDialog">绑定公众号的流程是什么</span>
        <el-dialog
          :visible="isShow"
          @close="closeDialog"
          title="绑定公众号的流程是什么？"
        >
          <div class="dialog">
            <p>1.使用公众号管理员微信登录https://mp.weixin.qq.com/</p>
            <p>2.点击左侧小程序菜单</p>
            <p>3.点击添加</p>
            <p>4.点击关联小程序</p>
            <p>5.微信扫码</p>
            <p>6.输入小程序id，点击发送关联邀请</p>
          </div>
        </el-dialog>
      </div>
    </div>
    <el-dialog title="绑定公众号" :visible.sync="officialAccountVisible" center>
      <img :src="officialAccountImg" alt="" />
    </el-dialog>
    <el-dialog
      title="游戏二维码绑定"
      :visible.sync="gameQrcodeBindVisible"
      center
    >
      <div class="gameQrcodeBindBox">
        <el-checkbox-group v-model="gameQrcodeBindCheckList" class="checkList">
          <el-checkbox
            label="hmPlay6"
            :disabled="disablePlayInfoList.indexOf('hmPlay6') > -1"
            >摇一摇</el-checkbox
          >
          <el-checkbox
            label="hmPlay7"
            :disabled="disablePlayInfoList.indexOf('hmPlay7') > -1"
            >划一划</el-checkbox
          >
          <el-checkbox
            label="hmPlay1"
            :disabled="disablePlayInfoList.indexOf('hmPlay1') > -1"
            >红包雨</el-checkbox
          >
          <el-checkbox
            label="hmPlay11"
            :disabled="disablePlayInfoList.indexOf('hmPlay11') > -1"
            >点红包</el-checkbox
          >
          <el-checkbox
            label="hmPlay4"
            :disabled="disablePlayInfoList.indexOf('hmPlay4') > -1"
            >转一转</el-checkbox
          >
          <el-checkbox
            label="hmPlay3"
            :disabled="disablePlayInfoList.indexOf('hmPlay3') > -1"
            >扭一扭</el-checkbox
          >
          <el-checkbox
            label="hmPlay8"
            :disabled="disablePlayInfoList.indexOf('hmPlay8') > -1"
            >谁最牛</el-checkbox
          >
          <el-checkbox
            label="hmPlay9"
            :disabled="disablePlayInfoList.indexOf('hmPlay9') > -1"
            >切水果</el-checkbox
          >
          <el-checkbox
            label="hmPlay2"
            :disabled="disablePlayInfoList.indexOf('hmPlay2') > -1"
            >开宝箱</el-checkbox
          >
          <el-checkbox
            label="hmPlay5"
            :disabled="disablePlayInfoList.indexOf('hmPlay5') > -1"
            >红包墙</el-checkbox
          >
          <el-checkbox
            label="sign"
            :disabled="disablePlayInfoList.indexOf('sign') > -1"
            >签到</el-checkbox
          >
        </el-checkbox-group>
        <el-button type="primary" @click="confirmGameQrcodeBind"
          >确认绑定</el-button
        >
      </div>
    </el-dialog>
  </sub-page>
</template>

<script>
import {
  editGameQrcodeBind,
  getFansERCode,
  getFansList,
  getFansSwitch,
} from '@/api/app/user';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import XifenHeader from '@/layout/home/components/xifen/xifenHeader';
import messageMixin from '@/mixins/messageBoxMixin';
import { formatDate } from '@/utils/format';
import { mapState } from 'vuex';

const gameInfo = {
  hmPlay6: '摇一摇',
  hmPlay7: '划一划',
};
export default {
  name: 'xifenIndex',
  mixins: [messageMixin],
  components: {
    XifenHeader,
    MyTable,
    MainCard,
    SubPage,
  },
  data() {
    return {
      tableData: [],
      xiFenTableData: [],
      tableLoading: true,
      showCount: 10,
      totalCount: 1,
      currentPage: 1,
      officialAccountImg: '',
      officialAccountVisible: false,
      gameQrcodeBindVisible: false,
      avatar: '',
      name: '',
      isShow: false,
      authorizer_appid: '',
      gameQrcodeBindCheckList: [],
      disablePlayInfoList: [],
      currentId: '',
      gameInfo,
    };
  },
  filters: {
    // 格式化时间
    dateFormat(value) {
      const date = value;
      return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    },
  },
  methods: {
    closeDialog() {
      this.isShow = false;
    },
    /* 获取吸粉列表数据 */
    getXifen() {
      getFansList({
        request_from_page: 'app/xifen/index',
      }).then((res) => {
        const tempLen = res.data.authList.length;
        const tempList = [];
        for (let i = 0; i < tempLen; i += 1) {
          if (res.data.authList[i].play_info) {
            res.data.authList[i].play_info = JSON.parse(res.data.authList[i].play_info);
            tempList.push({
              index: i,
              play_info: res.data.authList[i].play_info,
            });
          } else {
            tempList.push({
              index: i,
              play_info: [],
            });
          }
        }
        for (let i = 0; i < tempLen; i += 1) {
          res.data.authList[i].disablePlayInfoList = [];
          for (let j = 0; j < tempLen; j += 1) {
            if (j !== i) {
              res.data.authList[i].disablePlayInfoList = res.data.authList[
                i
              ].disablePlayInfoList.concat(tempList[j].play_info);
            }
          }
        }
        this.xiFenTableData = res.data.authList;
        console.log('吸粉列表数据', this.xiFenTableData);
        if (res.data.authList && res.data.authList.length > 0) {
          this.avatar = res.data.authList[0].wx_avator;
          this.name = res.data.authList[0].wx_name;
          this.authorizer_appid = res.data.authList[0].id;
        }
        this.tableLoading = false;
      });
    },
    /* 设置吸粉开关 */
    setIsXifen(obj) {
      console.log(obj);
      const { id } = obj;
      getFansSwitch({
        id,
        request_from_page: 'app/xifen/index',
      }).then((res) => {
        console.log('set xifen', res);
        this.$message.success('操作成功');
      });
    },
    // 点击绑定公众号按钮
    bindOfficialAccount() {
      // 打开窗口
      this.officialAccountVisible = true;
    },
    clickDialog() {
      this.isShow = true;
    },
    openGameQrcodeBind(obj) {
      console.log(obj);
      this.gameQrcodeBindCheckList = obj.play_info || [];
      this.disablePlayInfoList = obj.disablePlayInfoList;
      this.currentId = obj.id;
      this.gameQrcodeBindVisible = true;
    },
    confirmGameQrcodeBind() {
      editGameQrcodeBind({
        play_info: JSON.stringify(this.gameQrcodeBindCheckList),
        id: this.currentId,
      })
        .then((res) => {
          console.log(res);
          this.$message.success('绑定成功');
          this.gameQrcodeBindVisible = false;
          this.getXifen();
        })
        .catch((err) => {
          console.log(err);
          this.alertError('请求出错！');
        });
    },
  },
  computed: {
    ...mapState({
      powder_switch: (state) => state.login.userInfo.powder_switch,
    }),
  },
  created() {
    this.getXifen();
    const { id } = this.$store.state.login.userInfo;
    getFansERCode({ id, request_from_page: 'app/xifen/index' })
      .then((data) => {
        this.officialAccountImg = data.qr_url;
      })
      .catch(() => {
        this.alertError('请求出错！');
        return Promise.reject();
      });
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@headerHeight: 110px;
.xifenIndex::v-deep {
  .el-dialog__body {
    text-align: center;
    img {
      width: 100%;
      margin: auto;
      max-width: 380px;
    }
  }
}
.xifenIndex {
  position: relative;
  .xifenTable {
    position: relative;
    .button {
      //样式
      font-size: 13px;
      color: #ffffff;
      background-color: #1e87f0;
      width: 54px;
      height: 54px;
      padding: 7px;
      text-align: center;
      line-height: 20px;
      border-radius: 50%;
      //定位
      position: absolute;
      z-index: 1;
      right: 36px;
      top: -18px;
      cursor: pointer;
    }
    .my-table {
      padding-top: 10px;
    }
  }
  .header {
    height: @headerHeight;
  }
  .el-table::v-deep {
    .name {
      padding-left: 20px;
    }
  }
  .tips {
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
    margin-top: 5px;
    margin-bottom: 10px;
    .text {
      margin-left: 40px;
      display: inline-block;
      padding-right: 25px;
      color: rgba(0, 0, 0, 0.85);
    }
    .items {
      display: inline-block;

      .el-dialog {
        .dialog {
          margin-top: -26px;
          p {
            text-align: left;
            line-height: 40px;
            letter-spacing: 1px;
          }
        }
      }

      span {
        .blue-text();
        cursor: pointer;
        padding-left: 15px;
        padding-right: 15px;
      }
    }
  }
}
img {
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;

  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
.introCover {
  position: relative;
  z-index: 1;
  width: 100%;
  background-image: url("../../../assets/image/icon/xifen/xifenBg.png");
  background-size: 100% 100%;
  padding: 39px;
  flex: 1;
  .tit {
    width: 483px;
    height: 44px;
    font-size: 25px;
    font-weight: 400;
    color: #ffffff;
    background-image: url("../../../assets/image/icon/xifen/textBg.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .textImg {
    width: 881px;
    height: 73px;
    margin-bottom: 18px;
  }
  .ctBox {
    width: 100%;
    background: #ffffff;
    border-radius: 21px;
    padding: 37px 52px;
    max-height: 396px;
    .funcIntro {
      font-size: 24px;
      font-weight: 400;
      color: #333333;
    }
    .funcList {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      .funcItem {
        width: 188px;
        height: 164px;
        background: #ffffff;
        box-shadow: 2px 2px 16px -3px rgba(254, 198, 55, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 20px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 5px;
        img {
          width: 148px;
          height: 112px;
        }
      }
    }
    .contactInfo {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      .qrcodeImg {
        width: 62px;
        height: 62px;
        box-shadow: 0px 4px 4px 0px rgba(56, 246, 64, 0.25);
      }
      .contactText {
        margin-left: 21px;
        .para {
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          margin-bottom: 12px;
        }
      }
    }
  }
}
.checkList::v-deep {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  .el-checkbox {
    margin-bottom: 20px;
  }
  .el-checkbox__label {
    font-size: 18px;
  }
}
.editEntry {
  color: #409eff;
  cursor: pointer;
}
</style>
