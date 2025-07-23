<template>
  <div class="screen-theme-area">
    <div class="changeBgEntry">
      <div class="text">大屏背景</div>
      <div class="select-bg-button" @click="showUploadBgDialog">
        <i class="el-icon-plus"></i>
        &nbsp;自选
      </div>
      <div class="isLS">
        <el-select v-model="isLS" @change="handleBdModelSelectChange" class="lsSelect">
          <el-option v-for="item in bgModelList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-button type="primary" class="templateMaterialEntry" @click="onTemplateMaterialEntryClick">
        模板库
      </el-button>
      <el-button type="text" size="small" class="compressBtn" @click="imageCompressDrawerVisible = true">图片压缩</el-button>
    </div>
    <div class="preview-area">
      <img src="@/assets/image/pc-theme.png" class="lapTopImg" />
      <el-carousel class="carouselWrap" trigger="click" height="100%">
        <el-carousel-item v-for="item in screenBgList" :key="item.id">
          <div class="modelBg" :style="{ backgroundImage: 'url(' + item.url + ')' }" v-if="isLS === '2'"></div>
          <div
            class="carouselImg"
            :style="{ backgroundImage: 'url(' + item.url + ')' }"
            :class="{ LS: isLS === '1', DBSF: isLS === '2' }"
          ></div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 上传弹出区域 -->
    <transition
      enter-active-class="animate__animated animate__faster animate__fadeIn"
      leave-active-class="animate__animated animate__faster animate__fadeOut"
    >
      <div class="themeUploadPopArea" v-show="isThemeUploadPop">
        <div class="screenThemeUploadBox" v-loading="isLoading">
          <div class="head">
            <div class="name">大屏主题自定义</div>
            <el-button type="text" size="small" class="changeOrderBtn" @click="showPhotoOrderChangeDialog">调整图片顺序</el-button>
            <img src="@/assets/image/close.png" class="closeIcon" @click="closeThemeUploadPop" />
          </div>
          <div class="content">
            <el-scrollbar class="scrollBar">
              <div class="upload-img-wrap">
                <!-- 上传图片 -->
                <el-upload
                  drag
                  action
                  multiple
                  :http-request="handleBgFile"
                  :file-list="fileList"
                  list-type="picture"
                  :on-remove="handleRemove"
                  :show-file-list="true"
                  class="uploadImg"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将图片拖到此处，或
                    <em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
                </el-upload>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </transition>

    <!-- 素材弹出区域 -->
    <templateMaterials
      v-if="templateMaterialChooseVisible"
      ref="templateMaterialsRef"
      :screenBgList="screenBgList"
      @screenBgListRefresh="onScreenBgListRefresh"
      @mobileThemeRefresh="onMobileThemeRefresh"
      @templateMaterialClose="onTemplateMaterialClose"
    />

    <!-- 照片顺序更改区域 -->
    <screenPhotoOrder
      v-if="screenPhotoOrderVisible"
      ref="screenPhotoOrderRef"
      :screenBgList="screenBgList"
      @onScreenPhotoOrderDialogClose="onScreenPhotoOrderDialogClose"
      @refreshScreenBgList="onScreenBgListRefresh"
    />

    <!-- 图片压缩配置区域 -->
    <imageCompress
      :imageCompressDrawerVisible="imageCompressDrawerVisible"
      @closeImageCompress="imageCompressDrawerVisible = false"
      type="screen"
    />
  </div>
</template>
<script>
import uploadImage from '@/api/app/qiniuUpload';
import { getActivityMsg } from '@/api/setting/activitySetting/gameSetting';
import { getScreenList } from '@/api/setting/activitySetting/theme';
import { setBgImgSort } from '@/api/setting/whiteList';
import imageCompress from '@/components/imageCompress.vue';
import { compressImage } from '@/utils/index';
import request from '@/utils/request';
import { mapState } from 'vuex';
import screenPhotoOrder from './screenPhotoOrder.vue';
import templateMaterials from './templateMaterials.vue';

let BASEURL;

export default {
  name: 'screenTheme',
  data() {
    return {
      // 是否显示大屏主题弹框
      isThemeUploadPop: false,
      // 图片对象
      bgFile: '',
      fileList: [],
      screenBgList: [],
      isLS: '0',
      bgModelList: [
        {
          id: '0',
          label: '拉伸',
        },
        {
          id: '1',
          label: '铺满',
        },
        {
          id: '2',
          label: '等比例缩放',
        },
      ],
      isLoading: false,
      templateMaterialChooseVisible: false,
      screenPhotoOrderVisible: false,
      backSortList: [],
      imageCompressDrawerVisible: false,
    };
  },
  computed: {
    ...mapState({
      isScreenBgLS: (state) => state.login.isScreenBgLS,
    }),
  },
  components: {
    templateMaterials,
    screenPhotoOrder,
    imageCompress,
  },
  watch: {
    isScreenBgLS: {
      handler: function handler(newVal) {
        this.isLS = newVal;
      },
      immediate: true,
    },
  },
  created() {
    BASEURL = this.$store.state.login.userInfo.qinNiu_prefix;
    this.requestScreenBgList();
  },
  methods: {
    showUploadBgDialog() {
      this.isThemeUploadPop = true;
    },
    onScreenBgListRefresh() {
      this.requestScreenBgList();
    },
    closeThemeUploadPop() {
      this.isThemeUploadPop = false;
      this.requestScreenBgList();
    },
    handleRemove(file) {
      // 查找backSortList中对应的url并删除
      this.backSortList = this.backSortList.filter((item) => item.url !== file.url);
      setBgImgSort(this.$store.state.liveId, this.backSortList);
      // 删除背景图
      const params = {
        id: file.id,
        url: file.url,
      };
      request
        .post('/beiJing/removePcBeiJing', params)
        .then((res) => {
          console.log(res);
          this.$message({
            message: '删除成功!',
            type: 'success',
          });
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].id === params.id) {
              this.fileList.splice(i, 1);
              break;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('删除失败!');
        });
    },
    handleBgFile(e) {
      console.log(e);
      if (e.file.size > 31000000) {
        this.$message.error('上传图片不超过30M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      compressImage('screen', e.file)
        .then((compressedFile) => {
          console.log('上传压缩后的图');
          // 压缩成功的情况上传压缩后的图
          this.requestUploadImgFront(compressedFile);
        })
        .catch(() => {
          console.log('上传原图');
          // 压缩失败或不执行压缩的情况上传原图
          this.requestUploadImgFront(e.file);
        });
    },
    // 七牛直传
    requestUploadImgFront(file) {
      this.isLoading = true;
      uploadImage(file, 'screenTheme', 0.7, this.$store.state.login.userInfo.qinNiu_prefix)
        .then((res) => {
          console.log(res);
          console.log(this.$store.state.login.userInfo.qinNiu_prefix);
          const img_url = this.$store.state.login.userInfo.qinNiu_prefix;
          const params = {
            splid: this.$store.state.liveId,
            piclink: res.key.split(img_url)[1],
          };

          request
            .post('/beiJing/savePcBeiJing', params)
            .then((res) => {
              this.isLoading = false;
              this.$message({
                message: '背景图上传成功!',
                type: 'success',
              });
              this.fileList.unshift({
                name: res.data.info.picname,
                id: res.data.info.id,
                url: BASEURL + res.data.info.piclink,
              });
              this.screenBgList.unshift({
                name: res.data.info.picname,
                id: res.data.info.id,
                url: BASEURL + res.data.info.piclink,
              });
              console.log('pic-unload', res);
              // 如果排过序 还需要同步下照片顺序接口
              if (this.backSortList.length > 0) {
                this.backSortList.unshift({
                  id: res.data.info.id,
                  url: BASEURL + res.data.info.piclink,
                });
                setBgImgSort(this.$store.state.liveId, this.backSortList);
              }
            })
            .catch((err) => {
              console.log(err);
              this.isLoading = false;
              this.$message.error('背景图上传失败!');
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 走后台上传(废弃)
    requestUploadImg() {
      const formData = new FormData();
      formData.append('file', this.bgFile);
      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log('上传主题图片的图片地址', res);
          console.log('图片前缀', this.$store.state.login.userInfo.qinNiu_prefix);
          const img_url = this.$store.state.login.userInfo.qinNiu_prefix;
          // res.filePath
          const params = {
            splid: this.$store.state.liveId,
            piclink: res.data.filePath.split(img_url)[1],
          };
          request
            .post('/beiJing/savePcBeiJing', params)
            .then((res) => {
              this.$message({
                message: '背景图上传成功!',
                type: 'success',
              });
              this.fileList.unshift({
                name: res.data.info.picname,
                id: res.data.info.id,
                url: BASEURL + res.data.info.piclink,
              });
              console.log('pic-unload', res);
            })
            .catch((err) => {
              console.log(err);
              this.$message.error('背景图上传失败!');
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取轮播图数据
    requestScreenBgList() {
      // 重置目标数组
      this.fileList.splice(0);
      this.screenBgList.splice(0);
      // 1、先获取轮播图顺序列表
      getActivityMsg({
        id: this.$store.state.liveId,
      })
        .then((rawData) => {
          console.log('存在轮播图顺序列表嘛？：', rawData);
          const { back_sort_json } = rawData.data;
          if (back_sort_json && back_sort_json.includes('http')) {
            // 2.1、如果有 则给fileList、screenBgList赋值
            const backSortList = JSON.parse(back_sort_json);
            this.backSortList = backSortList;
            this.backSortList.forEach((backSortItem) => {
              this.fileList.push({
                name: '大屏背景',
                id: backSortItem.id,
                url: backSortItem.url,
              });
              this.screenBgList.push({
                name: '大屏背景',
                id: backSortItem.id,
                url: backSortItem.url,
              });
            });
          } else {
            // 2.2、如果没有 则调用旧的轮播图列表逻辑
            this.oldRequestScreenBgList();
            this.backSortList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    oldRequestScreenBgList() {
      const params = {
        splid: this.$store.state.liveId,
      };
      getScreenList({ params })
        .then((res) => {
          console.log(res);
          if (res.data.varList.length > 0) {
            for (let i = 0; i < res.data.varList.length; i++) {
              this.fileList.push({
                name: res.data.varList[i].picname,
                id: res.data.varList[i].id,
                url: BASEURL + res.data.varList[i].piclink,
              });
              this.screenBgList.push({
                name: res.data.varList[i].picname,
                id: res.data.varList[i].id,
                url: BASEURL + res.data.varList[i].piclink,
              });
            }
          }
          console.log('screenBgList', this.screenBgList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateLS(e) {
      console.log(e);
      request
        .post('/qiYeNe/update', {
          splid: this.$store.state.liveId,
          draw_switch: e,
        })
        .then(() => {
          this.$message({
            message: '修改成功!',
            type: 'success',
          });
          this.$store.commit('login/updateIsScreenBgLS', e);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    handleBdModelSelectChange(e) {
      this.isLS = e;
      console.log(this.isLS);
      this.updateLS(this.isLS);
    },
    onTemplateMaterialEntryClick() {
      this.templateMaterialChooseVisible = true;
      this.$nextTick(() => {
        this.$refs.templateMaterialsRef.openDialog();
      });
    },
    showPhotoOrderChangeDialog() {
      // 如果已上传的照片数量小于等于1则不打开弹窗
      if (this.screenBgList.length <= 1) {
        this.$message.warning('至少上传2张照片!');
        return;
      }
      // 先关闭上传弹窗
      this.isThemeUploadPop = false;
      // 打开排序弹窗
      // 1、先让子组件显示 2、设置子组件弹窗visible
      this.screenPhotoOrderVisible = true;
      this.$nextTick(() => {
        this.$refs.screenPhotoOrderRef.openDialog();
      });
    },
    onScreenPhotoOrderDialogClose() {
      this.screenPhotoOrderVisible = false;
    },
    onMobileThemeRefresh() {
      this.$emit('mobileThemeRefresh');
    },
    onTemplateMaterialClose() {
      this.templateMaterialChooseVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.screen-theme-area {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .preview-area {
    width: 97%;
    position: relative;
    transform: scale(0.85);
    .lapTopImg {
      width: 100%;
      height: auto;
    }
    .carouselWrap {
      position: absolute;
      width: 94%;
      height: 59%;
      top: 4%;
      left: 50%;
      transform: translateX(-50%);
      .modelBg {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        left: 0;
        filter: blur(8px);
      }
      .carouselImg {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        &.LS {
          background-size: 100% 100%;
        }
        &.DBSF {
          background-size: contain;
        }
      }
    }
  }
  .changeBgEntry {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -3px;
    position: relative;
    z-index: 1;
    .text {
      font-size: 15px;
    }
    .select-bg-button {
      margin-left: 20px;
      cursor: pointer;
      font-size: 13px;
      color: #3694f1;
      text-align: center;
      width: 67px;
      height: 26px;
      line-height: 26px;
      border-radius: 3px;
      border: dashed 1px #3694f1;
      margin: 10px auto;
    }
    .isLS {
      display: flex;
      position: absolute;
      left: 94px;
      top: 2px;
      width: 138px;
      flex-direction: column;
    }
    .templateMaterialEntry {
      position: absolute;
      left: -112px;
      top: 2px;
    }
    .compressBtn {
      position: absolute;
      bottom: -50%;
      left: 5%;
      color: #67c23a;
    }
  }
}
/* 上传弹出区域 */
.themeUploadPopArea {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
  .screenThemeUploadBox {
    width: 59%;
    height: 66%;
    background-color: #ffffff;
    position: absolute;
    top: 19%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 320px;
    min-height: 280px;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 12px 14px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 5%;
      .changeOrderBtn {
        position: absolute;
        left: 120px;
      }
      .name {
        font-size: 14px;
        font-weight: 600;
        color: rgba(165, 165, 165, 1);
      }

      .closeIcon {
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 88%;
      margin-top: 24px;
      overflow: hidden;
      position: relative;
      .scrollBar {
        height: 105%;
        .uploadImg::v-deep {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          .el-upload-list--picture .el-upload-list__item {
            padding: 0;
            width: 169px;
            height: 92px;
            float: left;
            margin-right: 5px;
            &.is-ready {
              display: none;
            }
          }
          .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
            display: none;
          }
          .el-upload-list--picture .el-upload-list__item-thumbnail {
            width: 167px;
            height: 95px;
            margin-left: 0px;
          }
          .el-upload-list--picture .el-upload-list__item-status-label {
            z-index: 1;
          }
          .el-upload-list__item .el-icon-close {
            color: black;
            z-index: 1;
          }
          .el-upload-list--text {
            display: none;
          }
        }
      }
    }
  }
}
</style>
