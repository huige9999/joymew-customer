<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="酒店信息"></card-top-info>
      <div class="previewArea">
        <section class="block1" v-if="!hasNoHotel || previewData.carouselList.length > 0">
          <div class="imgItem" v-for="(item, index) in previewData.carouselList" :key="index">
            <img :src="item" class="cImg" @click="openEditForm" />
            <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCarousel(item)" />
          </div>
        </section>
        <section class="block2" v-if="!hasNoHotel || previewData.hotelName || previewData.location || previewData.phone">
          <div class="hotelName" v-show="previewData.hotelName" @click="openEditForm">{{ previewData.hotelName }}</div>
          <div class="gapLine"></div>
          <div class="contactInfo">
            <div class="address" v-show="previewData.location" @click="openEditForm">
              <img src="@/assets/image/placeIcon.png" class="placeIcon" />
              {{ previewData.location }}
            </div>
            <div class="phone" v-show="previewData.phone" @click="openEditForm">
              <img src="@/assets/image/phoneIcon.png" class="phoneIcon" />
              电话
              <el-popover placement="top-start" title="手机号" width="150" trigger="hover" :content="previewData.phone">
                <el-button slot="reference"></el-button>
              </el-popover>
            </div>
          </div>
          <div class="entryInfo" @click="openEditForm">
            <label>入口Logo：</label>
            <img :src="icon" v-show="icon" />
          </div>
          <div class="funcSwitch" v-show="hotelId">
            <label>功能开关：</label>
            <el-switch v-model="switchStatus" active-value="1" inactive-value="0" @change="switchHotelReserveFunc"> </el-switch>
          </div>
        </section>
        <section
          class="block3"
          v-if="
            hasNoHotel && !previewData.hotelName && !previewData.location && !previewData.phone && previewData.carouselList.length === 0
          "
        >
          暂无酒店
          <el-button type="primary" @click="openCreateForm" class="openCreateFormBtn">立即创建</el-button>
        </section>
      </div>
      <!-- 表单——创建酒店 -->
      <div class="formArea" v-show="createFormVisible">
        <div class="formTit">创建酒店：</div>
        <el-form ref="form" :model="createForm" label-width="80px">
          <el-form-item label="轮播图">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="酒店名称">
            <el-input v-model="createForm.hotelName" @input="onCreateFormNameInput" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址">
            <el-input v-model="createForm.location" @input="onCreateFormLocationInput" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="酒店电话">
            <el-input v-model="createForm.phone" @input="onCreateFormPhoneInput" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="入口Logo">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile2"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitCreateForm">立即创建</el-button>
            <el-button @click="cancelCreateForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表单——信息修改 -->
      <div class="formArea" v-show="editFormVisible">
        <div class="formTit">信息修改</div>
        <el-form ref="form" :model="editForm" label-width="80px">
          <el-form-item label="轮播图">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="酒店名称">
            <el-input v-model="editForm.hotelName" @input="onEditFormNameInput" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址">
            <el-input v-model="editForm.location" @input="onEditFormLocationInput" maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="酒店电话">
            <el-input v-model="editForm.phone" @input="onEditFormPhoneInput" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="入口Logo">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile2"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditForm">确认修改</el-button>
            <el-button @click="cancelEditForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';
import {
  getHotelInfo, createHotel, editHotel, setIcon, switchFunc,
} from '@/api/hotelReserve/index';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      hasNoHotel: true,
      hotelId: '',
      previewData: {
        carouselList: [],
        hotelName: '',
        location: '',
        phone: '',
      },
      createFormVisible: false,
      createForm: {
        hotelName: '',
        location: '',
        phone: '',
        carouselList: [],
      },
      editFormVisible: false,
      editForm: {
        hotelName: '',
        location: '',
        phone: '',
        carouselList: [],
      },
      icon: '',
      switchStatus: '0',
    };
  },
  created() {
    // this.mockGetBaseInfo();
    if (this.$route.query.hasNoHotel) {
      this.openCreateForm();
    }
    if (this.$store.state.login.hotelId) {
      this.hasNoHotel = false;
      this.hotelId = this.$store.state.login.hotelId;
    }
    this.getHotelInfo();
  },
  methods: {
    switchHotelReserveFunc(e) {
      console.log(e);
      switchFunc(e, this.hotelId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
      this.requestUploadImg(e.file);
    },
    requestUploadImg(tmpFile) {
      const formData = new FormData();
      formData.append('file', tmpFile);
      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log('图片地址', res);
          this.previewData.carouselList.push(res.data.filePath);
          this.editForm.carouselList = this.previewData.carouselList;
          if (this.hasNoHotel) {
            this.createForm.carouselList.push(res.data.filePath);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleFormImgFile2(e) {
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
      this.requestUploadImg2(e.file);
    },
    requestUploadImg2(tmpFile) {
      const formData = new FormData();
      formData.append('file', tmpFile);
      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log('图片地址', res);
          this.icon = res.data.filePath;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getHotelInfo(uFlag) {
      getHotelInfo()
        .then((res) => {
          console.log(res);
          if (!res.data) {
            this.hasNoHotel = true;
          } else {
            this.hasNoHotel = false;
            const tempJsonData = JSON.parse(res.data.json_data);
            this.previewData = {
              ...tempJsonData,
              location: tempJsonData.location.des,
            };
            this.hotelId = res.data.wedding_id;
            this.switchStatus = res.data.is_show_wedding;
            this.$store.commit('login/setHotelId', this.hotelId);
            if (uFlag) {
              setIcon(this.icon, this.hotelId).then((res2) => {
                console.log(res2);
              });
            } else {
              this.icon = res.data.wedding_icon || '';
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitCreateForm() {
      if (this.createForm.carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张轮播图!',
        });
        return;
      }
      if (!this.icon) {
        this.$message({
          type: 'warning',
          message: '入口Logo需要上传!',
        });
        return;
      }
      if (!this.createForm.hotelName) {
        this.$message({
          type: 'warning',
          message: '酒店名称不能为空!',
        });
        return;
      }
      if (!this.createForm.location) {
        this.$message({
          type: 'warning',
          message: '酒店地址不能为空!',
        });
        return;
      }
      if (!this.createForm.location) {
        this.$message({
          type: 'warning',
          message: '手机号不能为空!',
        });
        return;
      }
      console.log(this.createForm);
      const tempForm = {
        ...this.createForm,
        location: {
          des: this.createForm.location,
          lat: '',
          lng: '',
        },
      };
      createHotel(JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.hasNoHotel = false;
          this.cancelCreateForm();
          this.$message.success('创建成功!');
          this.getHotelInfo(true);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
        });
    },
    submitEditForm() {
      if (this.editForm.carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张轮播图!',
        });
        return;
      }
      if (!this.icon) {
        this.$message({
          type: 'warning',
          message: '入口Logo需要上传!',
        });
        return;
      }
      if (!this.editForm.hotelName) {
        this.$message({
          type: 'warning',
          message: '酒店名称不能为空!',
        });
        return;
      }
      if (!this.editForm.location) {
        this.$message({
          type: 'warning',
          message: '酒店地址不能为空!',
        });
        return;
      }
      if (!this.editForm.location) {
        this.$message({
          type: 'warning',
          message: '手机号不能为空!',
        });
        return;
      }
      console.log(this.editForm);
      const tempForm = {
        ...this.editForm,
        location: {
          des: this.editForm.location,
          lat: '',
          lng: '',
        },
      };
      editHotel(this.hotelId, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.hasNoHotel = false;
          this.cancelEditForm();
          this.$message.success('修改成功!');
          this.getHotelInfo(true);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('修改失败!');
        });
    },
    cancelCreateForm() {
      this.createFormVisible = false;
      this.createForm.hotelName = '';
      this.createForm.location = '';
      this.createForm.phone = '';
      this.createForm.carouselList = [];
      if (this.hasNoHotel) {
        this.previewData.carouselList = [];
        this.previewData.hotelName = '';
        this.previewData.location = '';
        this.previewData.phone = '';
      }
    },
    cancelEditForm() {
      this.editFormVisible = false;
      this.editForm.hotelName = '';
      this.editForm.location = '';
      this.editForm.phone = '';
      this.editForm.carouselList = [];
    },
    openCreateForm() {
      this.createFormVisible = true;
    },
    openEditForm() {
      this.editFormVisible = true;
      this.editForm.hotelName = this.previewData.hotelName;
      this.editForm.location = this.previewData.location;
      this.editForm.phone = this.previewData.phone;
      this.editForm.carouselList = this.previewData.carouselList;
    },
    removeCurrentCarousel(imgPath) {
      this.previewData.carouselList = this.previewData.carouselList.filter((item) => item !== imgPath);
      if (this.hasNoHotel) {
        this.createForm.carouselList = this.createForm.carouselList.filter((item) => item !== imgPath);
      } else {
        this.editForm.carouselList = this.editForm.carouselList.filter((item) => item !== imgPath);
        this.openEditForm();
      }
    },
    onCreateFormNameInput(val) {
      this.previewData.hotelName = val;
    },
    onCreateFormLocationInput(val) {
      this.previewData.location = val;
    },
    onCreateFormPhoneInput(val) {
      this.previewData.phone = val;
    },
    onEditFormNameInput(val) {
      this.previewData.hotelName = val;
    },
    onEditFormLocationInput(val) {
      this.previewData.location = val;
    },
    onEditFormPhoneInput(val) {
      this.previewData.phone = val;
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
  background-image: url('../../../assets/image/iphone.png');
  background-size: 100% 100%;
  margin-left: 40px;
  padding: 25px;
  margin-bottom: 20px;
  .block1 {
    padding-top: 20px;
    overflow-x: scroll;
    white-space: nowrap;
    cursor: pointer;
    .imgItem {
      width: 242px;
      height: 177px;
      margin-right: 20px;
      position: relative;
      display: inline-block;
      &:nth-child(1) {
        margin-left: 20px;
      }
      .cImg {
        width: 100%;
        height: 100%;
        border-radius: 15px;
      }
      .deleteIcon {
        position: absolute;
        width: 22px;
        height: 22px;
        right: -21px;
        top: 1px;
        cursor: pointer;
        opacity: 0;
      }
      &:hover {
        .deleteIcon {
          opacity: 1;
        }
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
  .block2 {
    margin-top: 20px;
    .hotelName {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      padding: 0 20px;
      cursor: pointer;
    }
    .gapLine {
      width: 262px;
      height: 2px;
      background: #f0f0f0;
      margin: 0 auto;
      margin-top: 12px;
    }
    .contactInfo {
      height: 67px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .address {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 210px;
        .placeIcon {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }
      .phone::v-deep {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 9px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.25);
        position: relative;
        .phoneIcon {
          width: 18px;
          height: 18px;
          margin-bottom: 2px;
        }
        .el-button {
          position: absolute;
          top: 0;
          left: -6px;
          width: 54px;
          padding: 0;
          height: 35px;
          opacity: 0;
        }
        &::after {
          content: '';
          display: block;
          width: 2px;
          height: 30px;
          background: #f0f0f0;
          position: absolute;
          left: -13px;
        }
      }
    }
    .entryInfo {
      display: flex;
      align-items: center;
      padding: 0 20px;
      label {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        margin-right: 10px;
      }
      img {
        width: 110px;
        height: 120px;
      }
    }
    .funcSwitch {
      display: flex;
      align-items: center;
      padding: 0 20px;
      margin-top: 20px;
      label {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        margin-right: 10px;
      }
    }
  }
  .block3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 28px;
    height: 100%;
    .openCreateFormBtn {
      margin-top: 20px;
    }
  }
}
.formArea::v-deep {
  width: 60%;
  position: absolute;
  left: 428px;
  top: 63px;
  .formTit {
    font-size: 19px;
    font-weight: 500;
    color: #3b3c3d;
    margin-bottom: 20px;
  }
  .el-form {
    width: 50%;
    .uploadImg {
      position: relative;
      .el-upload__tip {
        display: none;
      }
      .el-upload-dragger {
        height: 150px;
      }
    }
  }
}
</style>
