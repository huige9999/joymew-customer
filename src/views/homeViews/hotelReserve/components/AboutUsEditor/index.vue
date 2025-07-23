<template>
  <div class="about-us-form">
    <div class="form-container">
      <el-form ref="aboutUsConfig" :model="value" label-width="130px" :rules="rules">
        <el-form-item label="集团名称" prop="hlt_name">
          <el-input type="text" v-model="value.hlt_name" placeholder="请输入集团名称"></el-input>
        </el-form-item>
        <el-form-item label="集团头像" prop="hlt_logo">
          <div class="qr-code" @click.stop="() => {}" v-if="value.hlt_logo">
            <div class="close" @click="removeHltLogo"></div>
            <img :src="value.hlt_logo" class="qr-code-img" />
          </div>
          <el-upload action multiple list-type="picture" :show-file-list="false" :http-request="uploadHltLogo" v-else>
            <div class="add-icon-qr">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="集团电话" prop="kf_phone">
          <el-input type="text" v-model="value.kf_phone" placeholder="请输入集团电话" />
        </el-form-item>
        <el-form-item label="集团微信号" prop="wx_account">
          <el-input type="text" v-model="value.wx_account" placeholder="请输入集团微信号"></el-input>
        </el-form-item>
        <el-form-item label="客服微信二维码" prop="kf_qr_code">
          <div class="qr-code" @click.stop="() => {}" v-if="value.kf_qr_code">
            <div class="close" @click="removeQrCode"></div>
            <img :src="value.kf_qr_code" class="qr-code-img" />
          </div>
          <el-upload action multiple list-type="picture" :show-file-list="false" :http-request="uploadQrCode" v-else>
            <div class="add-icon-qr">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="集团介绍" prop="hlt_intro">
          <div class="input-part">
            <el-input
              type="textarea"
              :autosize="{ minRows: 9 }"
              :placeholder="intro_placeholder.replaceAll(' ', '')"
              v-model="value.hlt_intro"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="轮播图" prop="swiper_imgs">
          <div class="swiper-imgs-container">
            <div class="swiper-img-item" v-for="(img, index) in value.swiper_imgs" :key="`${index}swiper`" @click.stop>
              <div class="close" @click="removeSwiperImg(img)"></div>
              <img :src="img" class="swiper-img" />
            </div>
            <el-upload action multiple list-type="picture" :show-file-list="false" :http-request="uploadSwiperImg">
              <div class="add-icon">
                <i class="el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="宣传海报" prop="hlt_poster">
          <div class="swiper-imgs-container">
            <div class="swiper-img-item" v-for="(img, index) in value.hlt_poster" :key="`${index}poster`" @click.stop>
              <div class="close" @click="removeHltPoster(img)"></div>
              <img :src="img" class="swiper-img" />
            </div>
            <el-upload action multiple list-type="picture" :show-file-list="false" :http-request="uploadHltPoster">
              <div class="add-icon">
                <i class="el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="handler-btns">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { saveAboutUsData, getAboutUs } from '@/api/hotelReserve';
import { uploadImg } from '../index';

export default {
  name: 'AboutUsEditor',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          kf_phone: '',
          wx_account: '',
          kf_qr_code: '',
          hlt_intro: '',
          swiper_imgs: [],
          hlt_poster: [],
          hlt_name: '',
          hlt_logo: '',
        };
      },
    },
  },
  data() {
    return {
      intro_placeholder: `每句使用;隔开例如：
        我们是一家位于市中心的高档酒店;
        专注于为新人提供完美的婚礼场地和服务;
        我们的婚礼堂酒店拥有宽敞豪华的宴会厅;
        可以容纳多达500位宾客;
        宴会厅装饰典雅，氛围温馨;
        为您的婚礼增添了浪漫和隆重感;
        我们的专业团队将根据您的需求和喜好;
        精心布置宴会厅，打造出独一无二的婚礼场景;`,
      rules: {
        kf_phone: [{ required: true, message: '请输入集团电话', trigger: 'blur' }],
        wx_account: [{ required: true, message: '请输入客服微信号', trigger: 'blur' }],
        kf_qr_code: [{ required: true, message: '请上传客服微信二维码', trigger: 'blur' }],
        hlt_intro: [{ required: true, message: '请输入集团介绍', trigger: 'blur' }],
        swiper_imgs: [{ required: true, message: '请上传至少1张轮播图', trigger: 'blur' }],
        hlt_poster: [{ required: true, message: '请上传至少1张宣传海报', trigger: 'blur' }],
        hlt_name: [{ required: true, message: '请输入集团名称', trigger: 'blur' }],
        hlt_logo: [{ required: true, message: '请上传集团头像', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    /** 获取关于我们的数据 */
    this.getData();
  },
  methods: {
    /** 获取之前的数据 */
    async getData() {
      const res = await getAboutUs();
      if (res && res.data) {
        const { dataJson } = res.data;
        const data = JSON.parse(dataJson);
        console.log('数据', data);
        const { hlt_intro, hlt_poster, kf_phone, kf_qr_code, swiper_imgs, wx_account, hlt_name, hlt_logo } = data;
        const target = {
          kf_phone,
          wx_account,
          kf_qr_code,
          hlt_intro,
          swiper_imgs: swiper_imgs.split(',').filter((item) => item !== ''),
          hlt_poster: hlt_poster.split(',').filter((item) => item !== ''),
          hlt_name,
          hlt_logo,
        };
        this.$emit('input', {
          ...target,
        });
      }
    },
    /** 上传客服微信二维码 */
    uploadQrCode(e) {
      console.log('e', e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // return;
      uploadImg(e.file)
        .then((res) => {
          this.$emit('input', {
            ...this.value,
            kf_qr_code: res,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    /** 删除客服微信二维码 */
    removeQrCode() {
      this.$emit('input', {
        ...this.value,
        kf_qr_code: '',
      });
    },
    /** 上传集团头像 */
    uploadHltLogo(e) {
      console.log('e', e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // return;
      uploadImg(e.file)
        .then((res) => {
          this.$emit('input', {
            ...this.value,
            hlt_logo: res,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    /** 删除集团Logo */
    removeHltLogo() {
      this.$emit('input', {
        ...this.value,
        hlt_logo: '',
      });
    },
    /** 上传轮播图 */
    uploadSwiperImg(e) {
      console.log('e', e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // return;
      uploadImg(e.file)
        .then((res) => {
          const target = this.value.swiper_imgs.map((item) => item);
          target.push(res);
          this.$emit('input', {
            ...this.value,
            swiper_imgs: target,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    /** 删除上传的轮播图 */
    removeSwiperImg(img) {
      const idx = this.value.swiper_imgs.findIndex((url) => url === img);
      const target = this.value.swiper_imgs.map((item) => item);
      target.splice(idx, 1);
      this.$emit('input', {
        ...this.value,
        swiper_imgs: target,
      });
    },
    /** 上传宣传海报 */
    uploadHltPoster(e) {
      console.log('e', e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      // return;
      uploadImg(e.file)
        .then((res) => {
          const target = this.value.hlt_poster.map((item) => item);
          target.push(res);
          this.$emit('input', {
            ...this.value,
            hlt_poster: target,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    /** 删除上传的宣传海报 */
    removeHltPoster(img) {
      const idx = this.value.hlt_poster.findIndex((url) => url === img);
      const target = this.value.hlt_poster.map((item) => item);
      target.splice(idx, 1);
      this.$emit('input', {
        ...this.value,
        hlt_poster: target,
      });
    },
    /** 保存配置 */
    async save() {
      this.$refs.aboutUsConfig.validate(async (res) => {
        console.log('检查结果', res);
        if (res) {
          // 将数据转成JSON
          const copy = {
            kf_phone: this.$props.value.kf_phone,
            wx_account: this.$props.value.wx_account,
            kf_qr_code: this.$props.value.kf_qr_code,
            hlt_intro: this.$props.value.hlt_intro,
            swiper_imgs: this.$props.value.swiper_imgs.join(','),
            hlt_poster: this.$props.value.hlt_poster.join(','),
            hlt_name: this.$props.value.hlt_name,
            hlt_logo: this.$props.value.hlt_logo,
          };
          const target = JSON.stringify(copy);
          // 调用api
          const saveRes = await saveAboutUsData(target);
          console.log('保存结果', saveRes);
          if (saveRes && saveRes.msg && String(saveRes.msg) === 'ok') {
            this.$message.success('操作成功');
          } else {
            this.$message.error('操作失败，请稍后重试~');
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.about-us-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  .form-container {
    width: 100%;
    .qr-code {
      width: 150px;
      height: 150px;
      margin-top: 12px;
      position: relative;
      .close {
        width: 24px;
        height: 24px;
        background-image: url('~@/assets/image/hotel/close.png');
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        cursor: pointer;
      }
      .qr-code-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
        border-radius: 5px;
      }
    }
    .add-icon-qr {
      width: 150px;
      height: 150px;
      margin-top: 14px;
      border: 1px dashed #dcdcdc;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      position: relative;
    }
    .input-part {
      margin-top: 12px;
    }

    .swiper-imgs-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .swiper-img-item {
        width: 213.33px;
        height: 120px;
        margin-top: 12px;
        margin-right: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        position: relative;

        .close {
          width: 24px;
          height: 24px;
          background-image: url('~@/assets/image/hotel/close.png');
          background-size: 100% 100%;
          position: absolute;
          top: -12px;
          right: -12px;
          cursor: pointer;
        }

        .swiper-img {
          width: 213.33px;
          height: 120px;
          object-fit: cover;
          border-radius: 5px;
        }
      }
    }
    .add-icon {
      width: 213.33px;
      height: 120px;
      margin-top: 14px;
      border: 1px dashed #dcdcdc;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      position: relative;
    }
  }
  .handler-btns {
    margin-top: 58rpx;
  }
}
</style>
