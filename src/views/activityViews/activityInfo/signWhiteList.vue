<template>
  <sub-page>
    <div class="card">
      <card-top-info title="签到白名单开关"></card-top-info>
      <div class="whiteForm">
        <div class="formItem">
          <div class="leftCt">
            <div class="key">是否开启签到白名单功能：</div>
            <el-switch
              v-model="isSignWhiteListFuncOn"
              active-value="1"
              inactive-value="0"
              class="whiteFuncSwitch"
              @change="handleSignWhiteListFuncChange"
            ></el-switch>
            <div class="resultVal">{{ isSignWhiteListFuncOnTxt }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <card-top-info title="白名单设置"></card-top-info>
      <div class="whiteForm">
        <div class="formItem">
          <div class="leftCt">白名单：</div>
          <div class="rightCt">
            <div class="controlBtnGroup">
              <el-upload name="uploadFile" :show-file-list="false" :http-request="handleSheetFile" action>
                <el-button type="primary" size="mini">导入名单</el-button>
              </el-upload>
              <el-button size="mini" @click="cancelWhiteList">取消上传</el-button>
              <el-button type="text" size="mini" @click="downloadTemp">模板下载</el-button>
            </div>
          </div>
        </div>
        <div class="formItem">
          <el-table :data="whiteList" border style="width: 90%">
            <el-table-column prop="num" type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="user_name" label="用户名" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </sub-page>
</template>
<script>
import CardTopInfo from '@/components/cardTopInfo';
import SubPage from '@/components/subPage';

import { getActivity } from '@/api/setting/activitySetting/theme';
import { cancelUploadedWhiteList, getWhiteList, setWhiteListStatus, uploadWhiteList } from '@/api/setting/whiteList.js';

import { mapState } from 'vuex';

export default {
  name: 'signWhiteList',
  data() {
    return {
      isSignWhiteListFuncOn: '0',
      whiteList: [],
      tmpFile: null,
    };
  },
  components: {
    SubPage,
    CardTopInfo,
  },
  computed: {
    isSignWhiteListFuncOnTxt() {
      return this.isSignWhiteListFuncOn === '1' ? '开启' : '关闭';
    },
    ...mapState({
      liveId: (state) => state.liveId,
    }),
  },
  created() {
    this.getSetting();
    this.getListData();
  },
  methods: {
    // 获取配置数据
    async getSetting() {
      const res = await getActivity({
        splid: this.liveId,
      });
      if (res && res.data) {
        const target = res.data;
        const { check_phone_switch } = target;
        this.isSignWhiteListFuncOn = check_phone_switch || '0';
      }
    },
    // 白名单功能开关状态同步到服务端
    async handleSignWhiteListFuncChange() {
      const res = await setWhiteListStatus({
        splid: this.liveId,
        check_phone_switch: this.isSignWhiteListFuncOn,
      });
      if (res && res.code && String(res.code) === '200') {
        this.$message.success('操作成功');
      } else {
        this.$message.error('网络错误');
      }
    },
    handleSheetFile(e) {
      const fileName = e.file.name;
      // 类型判断
      const extName = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      if (extName.indexOf('xlsx') > -1 || extName.indexOf('xls') > -1) {
        this.tmpFile = e.file;
        this.uploadWhiteList();
      } else {
        this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
      }
    },
    downloadTemp() {
      window.location.href = 'https://ustatic.hudongmiao.com/phoneWhiteList.xlsx';
    },
    // 白名单文件上传服务端
    async uploadWhiteList() {
      const formData = new FormData();
      formData.append('file', this.tmpFile);
      formData.append('splid', this.liveId);
      const res = await uploadWhiteList(formData);
      if (res && res.code && String(res.code) === '200') {
        this.$message.success('上传成功');
        this.getListData();
      } else {
        this.$message.error('网络错误');
      }
    },
    // 取消上传白名单（撤回上传的白名单）
    async cancelWhiteList() {
      const res = await cancelUploadedWhiteList(this.liveId);
      if (res && res.code && String(res.code) === '200') {
        this.$message.success('操作成功');
        this.getListData();
      } else {
        this.$message.error('网络错误');
      }
    },
    // 获取白名单数据
    async getListData() {
      const res = await getWhiteList(this.liveId);
      if (res && res.data && res.data.seatList) {
        const list = res.data.seatList || [];
        this.whiteList = list.map((item) => {
          const { seat_val, seat_number } = item;
          return {
            user_name: seat_number,
            phone: seat_val,
          };
        });
      }
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
  .whiteForm {
    .formItem {
      width: 90%;
      display: flex;
      padding: 0 20px;
      padding-bottom: 20px;
      .leftCt {
        display: flex;
        align-items: center;
        .name {
          font-size: 16px;
          width: 120px;
          margin-right: 10px;
          color: #000;
        }
        .resultVal {
          color: #999999;
          font-size: 16px;
        }
        .whiteFuncSwitch {
          margin-right: 10px;
        }
      }
      .rightCt {
        display: flex;
        align-items: center;
        .controlBtnGroup {
          display: flex;
          column-gap: 10px;
        }
        label {
          color: #000;
          font-size: 18px;
          margin-left: 12px;
        }
      }
    }
  }
  &:nth-child(2) {
    flex: 1;
  }
}
</style>
