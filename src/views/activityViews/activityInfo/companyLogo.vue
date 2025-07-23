<!-- 企业logo设置 -->
<template>
  <sub-page>
    <div class="set-company-container">
      <main-card>
        <card-top-info title="上传企业信息"></card-top-info>
        <div class="block">
          <span class="label">上传logo</span>
          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
            <img :src="imgurl" class="preview" alt v-if="imgurl" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
          <el-link type="primary" @click="cancelUpload" style="margin-left: 20px"
            v-if="imgurl && imgurl.indexOf('touming') === -1">取消上传</el-link>
        </div>
        <div class="block">
          <span class="label">企业名称</span>
          <el-input class="input-name" v-model="logo_name"></el-input>
        </div>
        <div class="block">
          <span class="label">字体大小</span>
          <el-slider class="slider" v-model="fontSize" :format-tooltip="fontSizeFormat"></el-slider>
        </div>
        <div class="block">
          <span class="label">Logo大小</span>
          <el-slider class="slider" v-model="logoSize" :format-tooltip="logoSizeFormat"></el-slider>
        </div>
        <div class="block">
          <span class="label">字体颜色</span>
          <el-color-picker v-model="logo_font_color"></el-color-picker>
        </div>
        <el-button type="primary" class="save" @click="save">确认保存</el-button>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { getCompanyLogo, setCompanyLogo } from '@/api/setting/setting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import request from '@/utils/request';

const tmImg = 'https://static.joymew.com/joymewCustomer/touming.png';
export default {
  name: 'setCompany',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      fontSize: 0,
      logoSize: 0,
      color: 'rgba(19, 206, 102, 0.8)',

      imgurl: '', // Logo
      logo_font_color: '', // 字体颜色
      logo_font_size: '', // 字体大小
      logo_name: '', // 企业名称
      pic_font_size: '', // logo尺寸

      dialogCropperVisible: false,
      option: {
        img: '',
        size: 0.8,
        outputType: 'jpg',
      },
      logoFile: '',
    };
  },
  created() {
    this.getCompanyInfo();
  },
  methods: {
    handleFile(e) {
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.imgurl = freader.result;
        this.requestUploadFileNoCompress(e.file);
      };
    },
    requestUploadFileNoCompress(file) {
      const formData = new FormData();
      formData.append('file', file);
      request
        .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '图片上传成功!',
            type: 'success',
          });
          this.imgurl = res.data.filePath;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    requestUploadFile() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.imgurl;
      // const that = this;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');
        // const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);
        request
          .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功!',
              type: 'success',
            });
            this.imgurl = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败!');
          });
      };
    },
    remove() { },
    fontSizeFormat(val) {
      this.logo_font_size = val / 2 + 30;
      return `${this.logo_font_size}px`;
    },
    logoSizeFormat(val) {
      this.pic_font_size = val + 80;
      return `${this.pic_font_size}px`;
    },
    save() {
      // if (!this.logo_name) {
      //   this.$message.error('请填写企业名称!');
      //   return;
      // }
      if (!this.logo_font_size) {
        this.$message.error('请选择字体大小!');
        return;
      }
      if (!this.pic_font_size) {
        this.$message.error('请选择logo大小!');
        return;
      }
      if (!this.logo_font_color) {
        this.$message.error('请选择字体颜色!');
        return;
      }
      const params = {
        title_piclink: this.imgurl || tmImg,
        title_name: this.logo_name || '',
        title_fontcolor: this.logo_font_color,
        title_fontsize: this.logo_font_size,
        pic_font_size: this.pic_font_size,
        splid: this.$store.state.liveId,
      };
      setCompanyLogo(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '企业信息设置成功',
          });

          // 保存到 localStorage
          const logoConfig = {
            logo_font_size: this.logo_font_size,
            pic_font_size: this.pic_font_size,
            logo_font_color: this.logo_font_color,
          };
          localStorage.setItem('logoConfig', JSON.stringify(logoConfig));
        }
      });
    },
    getCompanyInfo() {
      getCompanyLogo({ splid: this.$store.state.liveId })
        .then((res) => {
          console.log(res, 'company info------');
          if (res.data.title_fontcolor) {
            this.imgurl = res.data.title_piclink;
            this.logo_font_color = res.data.title_fontcolor;
            this.logo_font_size = res.data.title_fontsize;
            this.logo_name = res.data.title_name;
            this.pic_font_size = res.data.picsize;

            this.fontSize = (this.logo_font_size - 30) * 2;
            this.logoSize = this.pic_font_size - 80;
          } else {
            this.loadFromLocalStorage();
          }
        })
        .catch((err) => {
          console.log(err);
          this.loadFromLocalStorage();
        });
    },
    cancelUpload() {
      this.imgurl = '';
      this.save();
    },
    loadFromLocalStorage() {
      const cachedConfig = localStorage.getItem('logoConfig');
      if (cachedConfig) {
        try {
          const config = JSON.parse(cachedConfig);
          this.logo_font_size = config.logo_font_size;
          this.pic_font_size = config.pic_font_size;
          this.logo_font_color = config.logo_font_color;
          this.fontSize = (this.logo_font_size - 30) * 2;
          this.logoSize = this.pic_font_size - 80;
        } catch (e) {
          console.error('解析 localStorage 的 logoConfig 失败', e);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.head-upload {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
  border-radius: 50%;
  background-color: #eaeaea;
}

.deleteLabel {
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: 21px;
}

.no-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
}

.preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
}

.deleteIcon {
  width: 22px;
  height: 22px;
  position: absolute;
  top: -8px;
  right: -25px;
}

.save {
  width: 100px;
  margin: 50px 0 50px 130px;
}

.block {
  margin-top: 30px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 40px;
  // .suggest {
  //   position: absolute;
  //   left: 110px;
  //   bottom: 0;
  //   font-size: 14px;
  //   color: #ff5384;
  // }

  .label {
    font-size: 15px;
    width: 100px;
    margin-right: 10px;

    &::after {
      content: ':';
      margin-left: 5px;
    }
  }

  // .logo-preview {
  //   width: 200px;
  //   height: 65px;
  //   border: 1px solid rgba(208, 208, 208, 1);
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   cursor: pointer;
  // }

  .input-name {
    width: 200px;
  }

  .slider {
    width: 200px;
  }
}
</style>
