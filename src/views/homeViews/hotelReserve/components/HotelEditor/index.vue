<template>
  <div class="formWrap">
    <div class="formArea">
      <div class="formTit">{{ hotelFormTitle }}</div>
      <el-form ref="form" :model="value" label-width="80px">
        <el-form-item label="酒店名称">
          <el-input :value="value.hotelName" @input="onHotelFormNameInput" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="酒店地址">
          <el-input :value="value.location" @input="onHotelFormLocationInput" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="酒店电话">
          <el-input :value="value.phone" @input="onHotelFormPhoneInput" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="轮播图">
          <el-upload action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false">
            <div class="LBImgWrap">
              <div class="uploadLBImg" v-for="img in value.carouselList" :key="img" @click.stop="() => {}">
                <div class="close" @click="removeCurrentCarousel(img)"></div>
                <img :src="img" alt="" class="img" />
              </div>
              <div class="uploadLBImg">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="轮播视频">
          <el-upload action multiple :http-request="handleFormVideoFile" list-type="picture" :show-file-list="false">
            <div class="LBImgWrap">
              <div class="uploadLBImg" v-for="video in value.carouselVideoList " :key="video" @click.stop="() => { }">
                <div class="close" @click="removeCurrentVideoCarousel(video)"></div>
                <video :src="video" controls="controls" class="video"></video>
              </div>
              <div class="uploadLBImg">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="轮播视频" style="margin-bottom: 40px">
          <div class="LBImgWrap">
            <div class="uploadLBImg" v-for="video in value.carouselVideoList" :key="video.path" @click.stop="() => {}">
              <div class="close" @click="removeCurrentVideoCarousel(video.path)"></div>
              <video :src="video.path" controls="controls" class="video" v-if="!video.poster"></video>
              <img :src="video.poster" alt="" class="img" v-else />
              <el-button type="text" @click="showUploadVideo(video)" class="editIcon">编辑</el-button>
            </div>
            <div class="uploadLBImg" @click="showUploadVideo">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <!-- <el-upload action multiple :http-request="handleFormVideoFile" list-type="picture" :show-file-list="false">
            <div class="LBImgWrap">
              <div class="uploadLBImg" v-for="video in value.carouselVideoList" :key="video.path" @click.stop="() => {}">
                <div class="close" @click="removeCurrentVideoCarousel(video.path)"></div>
                <video :src="video.path" controls="controls" class="video" v-if="!video.poster"></video>
                <img :src="video.poster" alt="" class="img" v-else />
              </div>
              <div class="uploadLBImg">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-upload> -->
        </el-form-item>
        <el-form-item label="标签">
          <el-tag :key="tag" v-for="tag in value.baseLabelList" closable :disable-transitions="false" @close="handleTagClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputTagVisible"
            v-model="inputTagValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleTagInputConfirm"
            @blur="handleTagInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item label="参数">
          <el-button type="text" @click="showParaEdit">编辑</el-button>
        </el-form-item>
        <el-form-item label="入口Logo">
          <el-upload action :http-request="handleIconImg" :show-file-list="false" list-type="picture" class="uploadImg">
            <img v-if="value.icon" :src="value.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button type="primary" @click="submitHotelForm">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog class="paraEditBox" :visible.sync="paraEditBoxVisible" width="500px" center>
      <el-form :model="paraForm" label-width="140px">
        <el-form-item label="装修时间/年">
          <el-input v-model="paraForm.decoTime"></el-input>
        </el-form-item>
        <el-form-item label="宴会厅数量/个">
          <el-input v-model="paraForm.banquetNum"></el-input>
        </el-form-item>
        <el-form-item label="宴会厅最大容量/桌">
          <el-input v-model="paraForm.banquetCapacity"></el-input>
        </el-form-item>
        <el-form-item label="最低餐标">
          <el-input v-model="paraForm.mealLowPrice"></el-input>
        </el-form-item>
        <el-form-item label="停车位">
          <el-input v-model="paraForm.parkNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" center>
        <el-button @click="cancelParaEdit">取消</el-button>
        <el-button type="primary" @click="confirmCancelParaEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="videoUploadBox" :visible.sync="videoUploadBoxVisible" width="500px" center>
      <el-form :model="videoUploadForm" label-width="140px">
        <el-form-item label="视频">
          <el-upload action :http-request="handleFormVideoFile" list-type="picture" :show-file-list="false">
            <div class="LBImgWrap">
              <div class="uploadLBImg" @click.stop="() => {}" v-if="videoUploadForm.videoPath">
                <video :src="videoUploadForm.videoPath" controls="controls" class="video"></video>
              </div>
              <div class="uploadLBImg" v-else>
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload action :http-request="handleFormCoverFile" list-type="picture" :show-file-list="false">
            <div class="LBImgWrap">
              <div class="uploadLBImg" @click.stop="() => {}" v-if="videoUploadForm.imgPath">
                <img :src="videoUploadForm.imgPath" class="img" />
              </div>
              <div class="uploadLBImg" v-else>
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" center>
        <el-button @click="cancelUploadVideo">取消</el-button>
        <el-button type="primary" @click="confirmUploadVideo" v-loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHotelInfo, editHotel, setIcon } from '@/api/hotelReserve/index';
import { uploadImg } from '../index';

export default {
  name: 'hotelEditor',
  props: {
    value: Object,
    id: [Number, String],
  },
  data() {
    return {
      inputTagVisible: false,
      inputTagValue: '',
      paraEditBoxVisible: false,
      paraForm: {
        decoTime: '',
        banquetNum: '',
        banquetCapacity: '',
        mealLowPrice: '',
        parkNum: '',
      },
      videoUploadBoxVisible: false,
      videoUploadForm: {
        videoPath: '',
        imgPath: '',
        videoFile: '',
        imgFile: '',
      },
      loading: false,
    };
  },
  computed: {
    hotelFormTitle() {
      return this.id ? '信息修改:' : '创建酒店：';
    },
  },
  created() {
    if (!this.id) {
      this.$message.error('酒店信息错误');
      return;
    }
    this.getHotelInfo();
  },
  methods: {
    handleFormImgFile(e) {
      console.log(e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      console.log('打印图片');
      console.log(e.file);
      // return;
      uploadImg(e.file)
        .then((res) => {
          const carouselList = this.value.carouselList.map((item) => item);
          carouselList.push(res);
          console.log(res);
          this.$emit('input', {
            ...this.value,
            carouselList,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleIconImg(e) {
      console.log(e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      console.log('打印图片');
      console.log(e.file);

      uploadImg(e.file)
        .then((res) => {
          console.log(res);
          this.$emit('input', {
            ...this.value,
            icon: res,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getHotelInfo() {
      const { id } = this;
      console.log('storeId', id);
      getHotelInfo({
        wedding_id: String(id),
      })
        .then((res) => {
          console.log(res);
          if (res.data) {
            const targetHotel = res.data.list[0].json_data;
            if (!targetHotel) {
              return;
            }
            const tempJsonData = JSON.parse(targetHotel);
            console.log(tempJsonData);
            let tmpCarouselVideoList = [];
            if (tempJsonData.carouselVideoList && tempJsonData.carouselVideoList.length > 0) {
              tmpCarouselVideoList = tempJsonData.carouselVideoList.map((item) => {
                if (typeof item === 'string') {
                  return {
                    path: item,
                    poster: '',
                  };
                }
                return item;
              });
            }

            this.$emit('input', {
              ...tempJsonData,
              location: tempJsonData.location.des,
              switchStatus: res.data.is_show_wedding,
              icon: res.data.wedding_icon,
              carouselVideoList: tmpCarouselVideoList,
              baseParaList: tempJsonData.baseParaList || [],
              baseLabelList: tempJsonData.baseLabelList || [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitHotelForm() {
      const { carouselList, icon, location, hotelName, phone, carouselVideoList, baseLabelList, baseParaList } = this.value;
      if (carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张轮播图!',
        });
        return;
      }
      if (!icon) {
        this.$message({
          type: 'warning',
          message: '入口Logo需要上传!',
        });
        return;
      }
      if (!hotelName) {
        this.$message({
          type: 'warning',
          message: '酒店名称不能为空!',
        });
        return;
      }
      if (!location) {
        this.$message({
          type: 'warning',
          message: '酒店地址不能为空!',
        });
        return;
      }
      if (!phone) {
        this.$message({
          type: 'warning',
          message: '手机号不能为空!',
        });
        return;
      }
      console.log(this.value);
      const tempForm = {
        carouselList,
        hotelName,
        phone,
        location: {
          des: location,
          lat: '',
          lng: '',
        },
      };
      if (carouselVideoList.length > 0) {
        tempForm.carouselVideoList = carouselVideoList;
      }
      if (baseLabelList.length > 0) {
        tempForm.baseLabelList = baseLabelList;
      }
      if (baseParaList.length > 0) {
        tempForm.baseParaList = baseParaList;
      }
      console.log(tempForm);
      Promise.all([setIcon(icon, this.id), editHotel(this.id, JSON.stringify(tempForm))])
        .then((res) => {
          console.log(res);
          this.$message.success('修改成功!');
          this.getHotelInfo(true);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('修改失败!');
        });
    },
    removeCurrentCarousel(imgPath) {
      this.$emit('input', {
        ...this.value,
        carouselList: this.value.carouselList.filter((item) => item !== imgPath),
      });
    },
    removeCurrentVideoCarousel(videoPath) {
      let carouselVideoList = this.value.carouselVideoList.map((item) => item);
      carouselVideoList = carouselVideoList.filter((item) => item.path !== videoPath);
      this.$emit('input', {
        ...this.value,
        carouselVideoList,
      });
    },
    onHotelFormNameInput(val) {
      this.$emit('input', {
        ...this.value,
        hotelName: val,
      });
    },
    onHotelFormLocationInput(val) {
      this.$emit('input', {
        ...this.value,
        location: val,
      });
    },
    onHotelFormPhoneInput(val) {
      this.$emit('input', {
        ...this.value,
        phone: val,
      });
    },
    handleTagClose(tag) {
      const tmpBaseLabelList = this.value.baseLabelList.map((item) => item);
      tmpBaseLabelList.splice(this.value.baseLabelList.indexOf(tag), 1);
      this.$emit('input', {
        ...this.value,
        baseLabelList: tmpBaseLabelList,
      });
    },
    showTagInput() {
      this.inputTagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleTagInputConfirm() {
      const { inputTagValue } = this;
      const tmpBaseLabelList = this.value.baseLabelList.map((item) => item);
      if (inputTagValue) {
        tmpBaseLabelList.push(inputTagValue);
      }
      this.$emit('input', {
        ...this.value,
        baseLabelList: tmpBaseLabelList,
      });
      this.inputTagVisible = false;
      this.inputTagValue = '';
    },
    cancelParaEdit() {
      this.paraForm.decoTime = '';
      this.paraForm.banquetNum = '';
      this.paraForm.banquetCapacity = '';
      this.paraForm.mealLowPrice = '';
      this.paraForm.parkNum = '';
      this.paraEditBoxVisible = false;
    },
    confirmCancelParaEdit() {
      if (
        !this.paraForm.decoTime
        || !this.paraForm.banquetNum
        || !this.paraForm.banquetCapacity
        || !this.paraForm.mealLowPrice
        || !this.paraForm.parkNum
      ) {
        this.$message({
          type: 'warning',
          message: '请填写完整参数!',
        });
        return;
      }
      this.$emit('input', {
        ...this.value,
        baseParaList: [
          this.paraForm.decoTime,
          `${this.paraForm.banquetNum}/${this.paraForm.banquetCapacity}`,
          this.paraForm.mealLowPrice,
          this.paraForm.parkNum,
        ],
      });
      this.paraEditBoxVisible = false;
    },
    showParaEdit() {
      if (this.value.baseParaList.length > 0) {
        const tmpBaseParaList = this.value.baseParaList.map((item) => item);
        const [decoTime, banquet, mealLowPrice, parkNum] = tmpBaseParaList;
        const [banquetNum, banquetCapacity] = banquet.split('/');
        this.paraForm.decoTime = decoTime;
        this.paraForm.banquetNum = banquetNum;
        this.paraForm.banquetCapacity = banquetCapacity;
        this.paraForm.mealLowPrice = mealLowPrice;
        this.paraForm.parkNum = parkNum;
      }
      this.paraEditBoxVisible = true;
    },
    cancelUploadVideo() {
      this.videoUploadBoxVisible = false;
    },
    confirmUploadVideo() {
      if (!this.videoUploadForm.videoPath) {
        this.$message.error('请上传视频!');
        return;
      }
      if (!this.videoUploadForm.imgPath) {
        this.$message.error('请上传封面!');
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.videoUploadForm.videoFile && this.videoUploadForm.imgFile) {
        // 需要上传视频和封面
        Promise.all([
          uploadImg(this.videoUploadForm.videoFile).then((res) => {
            this.videoUploadForm.videoPath = res;
          }),
          uploadImg(this.videoUploadForm.imgFile).then((res) => {
            this.videoUploadForm.imgPath = res;
          }),
        ])
          .then(() => {
            console.log(this.videoUploadForm);
            const carouselVideoList = this.value.carouselVideoList.map((item) => item);
            carouselVideoList.push({
              path: this.videoUploadForm.videoPath,
              poster: this.videoUploadForm.imgPath,
            });
            this.$emit('input', {
              ...this.value,
              carouselVideoList,
            });
            this.videoUploadBoxVisible = false;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else if (this.videoUploadForm.videoFile && !this.videoUploadForm.imgFile) {
        // 只需要上传视频
        uploadImg(this.videoUploadForm.videoFile)
          .then((res) => {
            this.videoUploadForm.videoPath = res;
            console.log(this.videoUploadForm);
            const carouselVideoList = this.value.carouselVideoList.map((item) => item);
            carouselVideoList.push({
              path: this.videoUploadForm.videoPath,
              poster: this.videoUploadForm.imgPath,
            });
            this.$emit('input', {
              ...this.value,
              carouselVideoList,
            });
            this.videoUploadBoxVisible = false;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else if (!this.videoUploadForm.videoFile && this.videoUploadForm.imgFile) {
        // 只需要上传封面
        uploadImg(this.videoUploadForm.imgFile)
          .then((res) => {
            this.videoUploadForm.imgPath = res;
            console.log(this.videoUploadForm);
            const carouselVideoList = this.value.carouselVideoList.map((item) => item);
            carouselVideoList.push({
              path: this.videoUploadForm.videoPath,
              poster: this.videoUploadForm.imgPath,
            });
            this.$emit('input', {
              ...this.value,
              carouselVideoList,
            });
            this.videoUploadBoxVisible = false;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        // 无需上传
        this.videoUploadBoxVisible = false;
        this.loading = false;
      }
    },
    showUploadVideo(e) {
      console.log(e);
      if (e) {
        this.videoUploadForm.videoPath = e.path;
        this.videoUploadForm.imgPath = e.poster;
      } else {
        this.videoUploadForm.videoPath = '';
        this.videoUploadForm.imgPath = '';
      }
      this.videoUploadForm.videoFile = '';
      this.videoUploadForm.imgFile = '';
      this.videoUploadBoxVisible = true;
    },
    handleFormVideoFile(e) {
      if (e.file.size > 10300000) {
        this.$message.error('上传视频不超过10M!');
        return;
      }
      if (!(e.file.type === 'video/mp4')) {
        this.$message.error('上传视频只能是mp4格式');
        return;
      }
      console.log('打印视频');
      console.log(e.file);
      this.videoUploadForm.videoFile = e.file;
      // file转dataURL
      const reader = new FileReader();
      reader.readAsDataURL(e.file);
      reader.onload = (e) => {
        this.videoUploadForm.videoPath = e.target.result;
      };
    },
    handleFormCoverFile(e) {
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      console.log('打印图片');
      console.log(e.file);
      this.videoUploadForm.imgFile = e.file;
      // file转dataURL
      const reader = new FileReader();
      reader.readAsDataURL(e.file);
      reader.onload = (e) => {
        this.videoUploadForm.imgPath = e.target.result;
      };
    },
  },
};
</script>

<style lang="less" scoped>
.myMainCard {
  position: relative;
}

.formWrap {
  width: 100%;
  height: 100%;
}

.formArea::v-deep {
  // width: 60%;
  // position: absolute;
  // left: 428px;
  // top: 63px;
  .formTit {
    font-size: 19px;
    font-weight: 500;
    color: #3b3c3d;
    margin-bottom: 20px;
  }

  .el-form {
    .LBImgWrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      .uploadLBImg {
        width: 213.33px;
        height: 120px;
        margin-left: 17px;
        margin-top: 17px;
        border: 1px solid #dcdcdc;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        position: relative;

        .close {
          width: 24px;
          height: 24px;
          background-image: url('~@/assets/image/hotel/close.png');
          background-size: 100% 100%;
          position: absolute;
          top: -12px;
          right: -12px;
        }

        .img {
          width: 213.33px;
          height: 120px;
          pointer-events: none;
        }

        .video {
          width: 213.33px;
          height: 120px;
        }

        .editIcon {
          position: absolute;
          top: 120px;
        }
      }
    }

    .uploadImg {
      box-sizing: border-box;
      display: block;
      position: relative;

      .avatar {
        width: 160px;
        height: 160px;
        border: 1px solid #dcdcdc;
      }

      .el-upload__tip {
        display: none;
      }
    }

    .el-tag {
      margin-left: 10px;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
}

.videoUploadBox {
  .LBImgWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .uploadLBImg {
      width: 213.33px;
      height: 120px;
      margin-left: 17px;
      margin-top: 17px;
      border: 1px solid #dcdcdc;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      position: relative;

      .close {
        width: 24px;
        height: 24px;
        background-image: url('~@/assets/image/hotel/close.png');
        background-size: 100% 100%;
        position: absolute;
        top: -12px;
        right: -12px;
      }

      .img {
        width: 213.33px;
        height: 120px;
        pointer-events: none;
      }

      .video {
        width: 213.33px;
        height: 120px;
      }

      .editIcon {
        position: absolute;
        top: 120px;
      }
    }
  }
}
</style>
