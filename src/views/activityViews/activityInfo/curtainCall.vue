<!-- 谢幕设置 -->
<template>
  <sub-page v-loading="loading">
    <div class="card">
      <card-top-info title="谢幕标题"></card-top-info>
      <el-input class="inputHisTitle" v-model="formData.weddingTitle" maxlength="40"></el-input>
    </div>
    <div class="card">
      <card-top-info title="人员信息"></card-top-info>
      <div class="blockList">
        <div class="blockItem" v-for="item in itemList" :key="item.key">
          <div class="block-slogan">
            <span class="label">{{ item.name }}</span>
            <el-input class="input-name-two" v-model="formData[item.key]" maxlength="40"></el-input>
          </div>
          <div class="uploadEntry">
            <el-upload
              class="upload-demo"
              action
              :http-request="handleBgFile"
              :limit="1"
              v-if="fileList[item.index] && !fileList[item.index].url"
              :name="item.index + ''"
            >
              <img src="@/assets/image/imgIcon.png" class="imgIcon" />
            </el-upload>
            <img :src="fileList[item.index].url" v-if="fileList[item.index] && fileList[item.index].url" class="previewImg" />
            <img
              src="@/assets/image/delete_icon.png"
              class="deleteIcon"
              v-if="fileList[item.index] && fileList[item.index].url"
              @click="handleRemoveImg(item.index)"
            />
          </div>
        </div>
      </div>
      <div class="tipBlockList">
        <div class="block-slogan">
          <span class="label">提示语1:</span> <el-input class="input-name-two" v-model="formData.tip1" maxlength="40"></el-input>
        </div>
        <div class="block-slogan">
          <span class="label">提示语2:</span> <el-input class="input-name-two" v-model="formData.tip2" maxlength="40"></el-input>
        </div>
      </div>
      <el-button type="primary" class="save" @click="confirmInfo">确认保存</el-button>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';
import { getActivity } from '@/api/setting/activitySetting/theme';

const BLOCKLIST = [
  {
    name: '新郎,新娘:',
    key: 'xnxl',
    index: 0,
  },
  {
    name: '婚礼主持:',
    key: 'host',
    index: 1,
  },
  {
    name: '婚庆公司:',
    key: 'company',
    index: 2,
  },
  {
    name: '婚礼摄影:',
    key: 'photographer',
    index: 3,
  },
  {
    name: '婚礼摄像:',
    key: 'cameraman',
    index: 4,
  },
  {
    name: '婚礼策划:',
    key: 'plan',
    index: 5,
  },
  {
    name: '婚礼DJ:',
    key: 'dj',
    index: 6,
  },
  {
    name: '婚礼管家:',
    key: 'manager',
    index: 7,
  },
  {
    name: '酒店:',
    key: 'hotel',
    index: 8,
  },
  {
    name: '化妆师:',
    key: 'dresser',
    index: 9,
  },
];
export default {
  name: 'curtainCall',
  components: {
    SubPage,
    CardTopInfo,
  },
  data() {
    return {
      fileList: [],
      activityTitle: '',
      formData: {
        weddingTitle: '', // 0
        xnxl: '',
        host: '',
        company: '',
        photographer: '',
        cameraman: '',
        plan: '',
        dj: '',
        manager: '',
        hotel: '',
        dresser: '',
        tip1: '感谢各位亲朋好友参加我们的婚礼请各位在回家的路上注意安全',
        tip2: '友情提示: 开车不喝酒，喝酒不开车',
      },
      itemList: BLOCKLIST,
      loading: false,
    };
  },
  computed: {},
  watch: {
    activityTitle: function activityTitle(newVal) {
      if (newVal && !this.formData.weddingTitle) {
        this.formData.weddingTitle = newVal;
      }
    },
  },
  created() {
    for (let i = 0; i < 10; i += 1) {
      this.fileList.push({
        url: '',
      });
    }
    this.getActivityInfo();
    this.initData();
  },
  methods: {
    handleBgFile(e) {
      console.log(e);
      if (e.file.size > 21000000) {
        this.$message.error('上传图片不超过20M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = freader.result;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.clearRect(0, 0, img.width, img.height);
          context.drawImage(img, 0, 0, img.width, img.height);
          const result = canvas.toDataURL('image/jpeg', 0.7);

          // 转换成 file
          const arr = result.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'photo');

          console.log('上传的图片');
          console.log(file);
          this.bgFile = file;
          // 调用图片上传接口
          this.uploadBgFile(parseInt(e.filename, 10));
        };
      };
    },
    // 走后台上传
    uploadBgFile(fileIndex) {
      const formData = new FormData();
      formData.append('file', this.bgFile);
      request.post('/beiJing/shangchuanTomcat', formData).then((res) => {
        console.log('上传主题图片的图片地址', res);
        this.fileList[fileIndex].url = res.data.filePath;
      });
    },
    // 删除图片
    handleRemoveImg(fileIndex) {
      this.fileList[fileIndex].url = '';
    },
    confirmInfo() {
      // console.log(this.formData.weddingTitle);
      // console.log(this.formData.xnxl);
      // console.log(this.formData.host);
      // console.log(this.formData.company);
      // console.log(this.formData.photographer);
      // console.log(this.formData.cameraman);
      // console.log(this.formData.plan);
      // console.log(this.formData.dj);
      // console.log(this.formData.manager);
      // console.log(this.formData.hotel);
      // console.log(this.formData.tip1);
      // console.log(this.formData.tip2);
      if (!this.validateInfo()) {
        // 信息验证不通过
        return;
      }

      this.formData.imgList = this.fileList;
      const formData = {
        xiemu: JSON.stringify(this.formData),
        splid: this.$store.state.liveId,
      };
      request.post('/qiYeNe/update', formData).then((res) => {
        console.log(res);
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    initData() {
      this.loading = true;
      request.get(`/qiYeNe/liebiao?splid=${this.$store.state.liveId}`).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.data.xiemu) {
          const xiemuObj = JSON.parse(res.data.xiemu);
          if (xiemuObj.weddingTitle) {
            this.formData.weddingTitle = xiemuObj.weddingTitle;
          }
          if (xiemuObj.xnxl) {
            this.formData.xnxl = xiemuObj.xnxl;
          }
          if (xiemuObj.host) {
            this.formData.host = xiemuObj.host;
          }
          if (xiemuObj.company) {
            this.formData.company = xiemuObj.company;
          }
          if (xiemuObj.photographer) {
            this.formData.photographer = xiemuObj.photographer;
          }
          if (xiemuObj.cameraman) {
            this.formData.cameraman = xiemuObj.cameraman;
          }
          if (xiemuObj.plan) {
            this.formData.plan = xiemuObj.plan;
          }
          if (xiemuObj.dj) {
            this.formData.dj = xiemuObj.dj;
          }
          if (xiemuObj.manager) {
            this.formData.manager = xiemuObj.manager;
          }
          if (xiemuObj.hotel) {
            this.formData.hotel = xiemuObj.hotel;
          }
          if (xiemuObj.dresser) {
            this.formData.dresser = xiemuObj.dresser;
          }
          if (xiemuObj.tip1) {
            this.formData.tip1 = xiemuObj.tip1;
          }
          if (xiemuObj.tip2) {
            this.formData.tip2 = xiemuObj.tip2;
          }
          if (xiemuObj.imgList) {
            this.fileList = xiemuObj.imgList;
            const tempLen = this.fileList.length;
            if (tempLen < 10) {
              for (let i = tempLen; i < 10; i += 1) {
                this.fileList.push({
                  url: '',
                });
              }
            }
          }
          // 防止覆盖掉JSON字符串中其他业务的配置项
          if (xiemuObj.otherBusinessMahjongDegree) {
            this.formData.otherBusinessMahjongDegree = xiemuObj.otherBusinessMahjongDegree;
          }
          if (xiemuObj.otherBusinessCustomMenuIds) {
            this.formData.otherBusinessCustomMenuIds = xiemuObj.otherBusinessCustomMenuIds;
          }
        }
      });
    },
    // 获取活动的信息
    getActivityInfo() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        this.activityTitle = res.data.theme;
      });
    },
    // 验证信息
    validateInfo() {
      let tmpFlag = true;
      if (!this.formData.weddingTitle) {
        tmpFlag = false;
        this.$message.error('请填写谢幕标题!');
      } else if (!this.formData.xnxl) {
        tmpFlag = false;
        this.$message.error('请填写新娘,新郎!');
      } else {
        const tmpKeyList = Object.keys(this.formData).filter((item, index) => {
          console.log(item, index);
          return index !== 0 && index !== 11 && index !== 12 && index !== 13;
        });
        const tmpLen = tmpKeyList.length;
        console.log(this.fileList);
        for (let i = 0; i < tmpLen; i += 1) {
          if (
            (this.formData[tmpKeyList[i]] && this.fileList[i] && !this.fileList[i].url)
            || (this.fileList[i] && this.fileList[i].url && !this.formData[tmpKeyList[i]])
          ) {
            if (!this.fileList[i].url) {
              this.$message.error(`请上传${BLOCKLIST[i].name.split(':')[0]}图片`);
            } else if (!this.formData[tmpKeyList[i]]) {
              this.$message.error(`请填写${BLOCKLIST[i].name.split(':')[0]}`);
            }
            tmpFlag = false;
            break;
          }
        }
      }
      return tmpFlag;
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
  .inputHisTitle {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .blockList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 7.5% 20px 7.5%;
    .blockItem {
      width: 23%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 8%;
      margin-bottom: 37px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .block-slogan {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        .label {
          font-size: 15px;
          width: 100px;
          position: relative;
          &::after {
            margin-left: 5px;
          }
        }
        .input-name-two {
          width: 100%;
          margin-left: 10px;
        }
      }
      .uploadEntry {
        width: 100%;
        height: 179px;
        background: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 17px;
        position: relative;
        .imgIcon {
          width: 29%;
        }
        .previewImg {
          width: 100%;
          height: 100%;
        }
        .shade {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: -24px;
          top: 1px;
          cursor: pointer;
        }
        .upload-demo::v-deep {
          .el-upload-list {
            display: none;
          }
        }
      }
    }
  }
  .tipBlockList {
    width: 82%;
    margin: 0px auto;
    .block-slogan {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 20px;
      .label {
        font-size: 15px;
        width: 71px;
        position: relative;
        &::after {
          margin-left: 5px;
        }
        &.must {
          &::before {
            content: '*';
            display: block;
            color: red;
            position: absolute;
            left: -10px;
            top: 0px;
            font-size: 19px;
          }
        }
      }
      .input-name-two {
        width: 100%;
        margin-left: 10px;
      }
    }
  }
  .save {
    width: 100px;
    margin: 20px auto;
    margin-bottom: 37px;
  }
  &:nth-child(2) {
    flex: 1;
  }
}
</style>
