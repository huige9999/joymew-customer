<template>
  <sub-page class="myInfo">
    <main-card>
      <id-card>
        <template v-slot:left>
          <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="handleFile">
            <img v-if="chooseImg" :src="chooseImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <div class="upload-description">请上传JPG/PNG格式图片，图片大小不超过3M</div>
        </template>
        <template v-slot:right>
          <div class="form-container" style="margin-top: 30px">
            <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="55px">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="infoForm.name" placeholder="请输入姓名" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="infoForm.phone" placeholder="请输入电话" size="mini" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="邀请码">
                <el-input v-model="infoForm.inviteCode" placeholder="请输入邀请码" size="mini" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </id-card>
      <my-button type="primary" @click.native="submitForm('infoForm')" height="36" width="92" class="save-button"> 保存 </my-button>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import IdCard from '@/layout/home/components/userCenter/idCard';
import MyButton from '@/components/my-button';
import { editNameAndHeadImg } from '@/api/app/user';
import { uploadImage } from '@/api/app/upload';

export default {
  name: 'myInfo_unsaved',
  components: {
    MyButton,
    IdCard,
    MainCard,
    SubPage,
  },
  data() {
    return {
      chooseImg: '',
      infoForm: {
        name: '',
        phone: '',
        inviteCode: '',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    const { userInfo } = this.$store.state.login;
    this.infoForm.name = userInfo.emcee_name;
    this.infoForm.phone = userInfo.phonenumber;
    this.infoForm.inviteCode = userInfo.invite_key;
    this.chooseImg = userInfo.avator;
  },
  methods: {
    /* 上传图片 */
    handleFile(e) {
      // 处理文件
      //  console.log(e)
      // 压缩一下文件
      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestUploadFile();
      };
    },
    /* base 64 转换成file  这里对base64 进行压缩 */
    requestUploadFile() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.chooseImg;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');

        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);

        uploadImage(formData)
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功!',
              type: 'success',
            });
            this.chooseImg = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败!');
          });
      };
    },
    // 修改个人资料
    editUserInfo() {
      editNameAndHeadImg({
        avator: this.chooseImg,
        emcee_name: this.infoForm.name,
      }).then((res) => {
        console.log('edit userinfo', res);
        // 更新store中的头像姓名数据
        this.$store.commit('login/updateName', this.infoForm.name);
        this.$store.commit('login/upadateImgUrl', this.chooseImg);
        this.$message({
          message: '修改资料信息成功',
          type: 'success',
        });
      });
    },

    // 上传信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          this.editUserInfo();
        } else {
          this.$message({
            message: '请完善个人信息',
            type: 'error',
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.myInfo::v-deep {
  .el-form-item {
    margin-bottom: 3px;
  }
  .el-form-item__error {
    padding-top: 0;
    margin-top: -4px;
  }
  .area-selects {
    .el-select {
      width: 48%;
    }
    .first-select {
      margin-right: 2%;
    }
  }
}
.myInfo {
  .save-button {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
  }
  .avatar {
    margin-top: 15px;
    height: 130px;
    width: 130px;
    overflow: hidden;
    img {
      width: 100%;
      height: atuo;
    }
  }
  .upload-button {
    background: #1e87f0;
    height: 156px;
    display: flex;
    flex-direction: column;
    img {
      margin: auto;
      margin-top: 28px;
      margin-bottom: 20px;
    }
    span {
      text-align: center;
      font-size: 15px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
  }
  .upload-description {
    margin-top: 6px;
    font-size: 11px;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
  }
}
</style>
