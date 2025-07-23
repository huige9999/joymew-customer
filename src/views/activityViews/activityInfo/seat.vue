<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="席位表"></card-top-info>
      <div class="previewArea">
        <div class="seat">
          <div class="search">
            <input type="text" placeholder="输入您的姓名或手机号，搜索您的席位" v-model="searchName" />
            <img src="@/assets/image/seat/search.png" class="searchIcon" @click="toSearch" />
          </div>
          <div class="result">
            <div class="unSearch" v-if="!result">您可以直接搜索查看您的席位</div>
            <div class="searchResult" v-if="result">
              您的位置在
              <span>{{ result }}</span>
            </div>
          </div>
          <div class="seats sheet" v-if="seatList.length > 0">
            <div class="item" v-for="(item, index) in seatList" :key="index">
              <div class="number">{{ item.seat_number }}</div>
              <div class="users">
                <div class="userItem" v-for="(itemInner, indexInner) in item.userList" :key="indexInner">{{ itemInner }}</div>
              </div>
            </div>
          </div>
          <div class="emptySeats" v-else>
            <img src="@/assets/image/seat/noSeatImage.png" class="noSeatImage" />
            <div class="emptyTip">暂无席位表......</div>
          </div>
        </div>
      </div>
      <div class="operateArea">
        <el-button style="margin-left: 20px; margin-top: 200px" type="primary" icon="el-icon-upload" @click="showImportDialog"
          >导入席位表</el-button
        >
      </div>
      <my-dialog :show="isShowImportDialog">
        <div class="import-dialog-container">
          <div class="import-title" slot="title">
            <img src="@/assets/image/importList.png" alt="" width="34" height="29" />
            <div class="text">导入席位表</div>
          </div>
          <div class="import-info">
            <div class="upload-temp">
              <div class="title">下载席位表模板<span>(下载后请勿更改模板格式)</span></div>
              <div class="btn">
                <el-button icon="el-icon-download" type="warning" @click="downloadTemplate">下载</el-button>
              </div>
            </div>
            <div class="upload-file">
              <div class="title">上传席位表文件<span>(提示：重新导入模板后将覆盖原有数据)</span></div>
              <div class="btn">
                <el-upload name="uploadFile" :show-file-list="false" :http-request="handleFile" action accept="txt">
                  <el-button type="primary" icon="el-icon-upload2">上传</el-button>
                </el-upload>
              </div>
            </div>
            <div class="btn-group">
              <el-button type="primary" @click="confirmUpload">确认导入</el-button>
              <el-button type="info" @click="cancelUpload" style="margin-left: 20px">取消</el-button>
            </div>
          </div>
        </div>
      </my-dialog>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';
import myDialog from '@/components/myDialog';
import { getSeatList } from '@/api/setting/activitySetting/gameSetting';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    myDialog,
  },
  data() {
    return {
      searchName: '',
      result: '',
      seatList: [],
      isShowImportDialog: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getSeatList({
        splid: this.$store.state.liveId,
      })
        .then((res) => {
          console.log(res);
          this.seatList = res.data.seatList.map((item) => {
            return {
              userList: item.seat_val.split(','),
              ...item,
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toSearch() {
      this.updateResult();
      if (!this.searchName) {
        this.$message.error('请输入您的名字或手机号');
        return;
      }
      this.seatList.forEach((item) => {
        const tmpLen = item.userList.length;
        for (let i = 0; i < tmpLen; i += 1) {
          if (item.userList[i].indexOf(this.searchName) > -1) {
            this.updateResult(item.seat_number);
            break;
          }
        }
      });

      if (!this.result) {
        this.$message.error('很抱歉，没有搜索到您的名字!');
      }
    },
    updateResult(result) {
      if (!result) {
        this.result = '';
      }
      if (this.result) {
        this.result = `${this.result},${result}`;
      } else {
        this.result = result;
      }
    },
    confirmUpload() {
      this.isShowImportDialog = false;
      this.seatList.splice(0);
      this.initData();
    },
    cancelUpload() {
      this.isShowImportDialog = false;
    },
    showImportDialog() {
      this.isShowImportDialog = true;
    },
    downloadTemplate() {
      window.location.href = 'https://ustatic.hudongmiao.com/seatMod.xlsx';
    },
    handleFile(e) {
      const fileName = e.file.name;
      // 类型判断
      const extName = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      console.log(extName);
      if (extName.indexOf('xlsx') > -1 || extName.indexOf('xls') > -1) {
        this.tmpFile = e.file;
        this.uploadNameSheet();
      } else {
        this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
      }
    },
    uploadNameSheet() {
      const formData = new FormData();
      formData.append('file', this.tmpFile);
      formData.append('splid', this.$store.state.liveId);
      request
        .post('/neiDing/shangchuanSeatMd', formData)
        .then((res) => {
          console.log(res);
          this.$message({
            message: '上传成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.myMainCard {
  position: relative;
}
.previewArea {
  width: 350px;
  height: 667px;
  background-image: url('~@/assets/image/iphone.png');
  background-size: 100% 100%;
  margin-left: 40px;
  padding: 25px;
  margin-bottom: 20px;
  padding-top: 40px;
  .seat {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 30px 20px;
    .search {
      height: 33px;
      position: relative;
      input {
        width: 100%;
        height: 33px;
        background: rgba(237, 237, 237, 1);
        border-radius: 16px;
        border: none;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 12px;
      }
      .searchIcon {
        position: absolute;
        width: 15px;
        height: 15px;
        padding: 10px;
        right: 5px;
        top: 0px;
        cursor: pointer;
      }
    }
    .result {
      font-size: 13px;
      font-weight: normal;
      color: rgba(102, 102, 102, 1);
      line-height: 13px;
      margin: 18px auto 0 auto;
      text-align: center;
      .searchResult {
        span {
          font-size: 22px;
          color: #4e8cee;
          padding: 0 5px;
          line-height: 30px;
        }
      }
    }
    .seats {
      margin-top: 20px;
      padding-bottom: 10px;
      &.sheet {
        .item {
          overflow: hidden;
          color: #666666;
          font-size: 15px;
          &:not(:first-child) {
            margin-top: 24px;
          }
          .number {
            width: 25%;
            float: left;
            text-align: center;
            line-height: 25px;
            &::after {
              content: ' :';
            }
          }
          .users {
            width: 75%;
            float: left;
            .userItem {
              float: left;
              margin-left: 7px;
              line-height: 25px;
            }
          }
        }
      }
    }
    .emptySeats {
      margin-top: 20px;
      .noSeatImage {
        width: 100%;
      }
      .emptyTip {
        font-size: 13px;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
        margin-top: 20px;
        text-align: center;
      }
    }
    &::-webkit-scrollbar {
      width: 7px;
      height: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 6px;
    }
    &::-webkit-scrollbar-corner {
      background-color: rgba(0, 0, 0, 0.8);
    }
    &::-webkit-scrollbar-thumb:horizontal {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
    &::-webkit-scrollbar-thumb:vertical {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
  }
}
.operateArea {
  width: 60%;
  position: absolute;
  left: 428px;
  top: 63px;
}
.import-dialog-container {
  padding-bottom: 30px;
  .import-title {
    display: flex;
    align-items: center;
    .text {
      margin-left: 20px;
      font-size: 25px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #42474e;
    }
  }
  .import-info {
    position: relative;
    margin-left: 55px;
    &::after {
      position: absolute;
      width: 1px;
      height: 100px;
      background: #d8d8d8;
    }
    & > div {
      .title {
        font-size: 14px;
        line-height: 50px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 600;
        color: #333333;
        span {
          margin-left: 10px;
          color: #fa3e3e;
          font-size: 14px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 600;
        }
      }
    }
    .upload-temp {
      position: relative;
      margin-top: 20px;
      &::after {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #d8d8d8;
        border-radius: 50%;
      }
    }
    .upload-file {
      position: relative;
      margin-top: 35px;
      &::after {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #d8d8d8;
        border-radius: 50%;
      }
    }
    .btn-group {
      margin-top: 50px;
    }
  }
}
</style>
