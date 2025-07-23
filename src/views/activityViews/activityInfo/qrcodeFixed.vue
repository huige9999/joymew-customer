<!-- 固定二维码设置 -->
<template>
  <sub-page>
    <div class="card">
      <card-top-info title="二维码绑定信息"></card-top-info>
      <div class="block">
        <img :src="fixedQrcode" class="qrcodeImg" />
        <div class="bindedActivityInfo">
          <div class="item"><label>活动标题：</label>{{ bindedActivity.theme }}</div>
          <div class="item"><label>活动地点：</label>{{ bindedActivity.hotelName }}</div>
          <div class="item"><label>活动日期：</label>{{ bindedActivity.date }}</div>
        </div>
        <div class="tip">
          <div class="tipItem">功能介绍：二维码固定不变，默认绑定最近一场活动，也可以绑定指定活动!</div>
          <div class="tipItem">适用场景：多场活动需要同一个二维码!</div>
        </div>
      </div>
    </div>
    <div class="card">
      <card-top-info title="更新二维码绑定"></card-top-info>
      <div class="activityTable">
        <el-table :data="activityList" border style="width: 100%">
          <el-table-column prop="num" type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="theme" label="活动标题" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template slot-scope="scope">
              <el-link type="primary" @click="updateBind(scope.row)">{{ scope.row.id === bindedActivity.id ? '' : '绑定' }}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import CardTopInfo from '@/components/cardTopInfo';
import { getFixedQrcodeInfo, updateFixedQrcodeInfo } from '@/api/setting/activitySetting/activity';

export default {
  name: 'qrcodeFixed',
  components: {
    SubPage,
    CardTopInfo,
  },
  data() {
    return {
      fixedQrcode: '',
      bindedActivity: {
        hotelName: '',
        id: '',
        theme: '',
        date: '',
      },
      activityList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getFixedQrcodeInfo()
        .then((res) => {
          console.log(res);
          this.fixedQrcode = res.data.fix_qrcode_url;
          this.bindedActivity.hotelName = res.data.info.hotel_name;
          this.bindedActivity.id = res.data.info.id;
          this.bindedActivity.theme = res.data.info.theme;
          this.bindedActivity.date = res.data.info.using_date;
          this.activityList = res.data.lateSplidList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateBind(rowData) {
      console.log(rowData);
      updateFixedQrcodeInfo({
        splid: rowData.id,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '绑定成功!',
            type: 'success',
          });
          this.initData();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('绑定失败!');
        });
    },
  },
};
</script>
<style lang="less" scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  margin-top: 18px;
  margin-bottom: 10px;
  &:nth-child(2) {
    flex: 1;
  }
  .block {
    display: flex;
    align-items: center;
    padding: 0 20px 20px 20px;
    position: relative;
    .qrcodeImg {
      width: 140px;
      height: 140px;
      margin-right: 20px;
    }
    .bindedActivityInfo {
      .item {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 400;
        margin-bottom: 12px;
        label {
          margin-right: 12px;
        }
      }
    }
    .tip {
      margin-left: 60px;
      color: rgba(0, 0, 0, 0.65);
      .tipItem {
        font-size: 15px;
        margin-bottom: 8px;
      }
    }
  }
  .activityTable {
    padding: 0 20px 20px 20px;
    width: 50%;
  }
}
</style>
