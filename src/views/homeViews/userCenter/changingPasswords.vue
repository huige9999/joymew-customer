<template>
  <sub-page class="myInfo">
    <main-card>
      <!-- <id-card> -->
      <!-- <template v-slot:right> -->
      <!-- <div class="form-container" style="margin-top: 30px"> -->
      <el-form :model="infoForm" ref="infoForm" label-width="55px">
        <el-form-item label="账号">
          <el-input v-model="infoForm.phone" placeholder="请输入姓名" size="mini" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="旧密码">
          <el-input v-model="infoForm.oldPwd" placeholder="请输入旧密码" size="mini" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="infoForm.password" placeholder="请输入新密码" size="mini" type="password"></el-input>
        </el-form-item>
      </el-form>
      <!-- </div> -->
      <!-- </template> -->
      <!-- </id-card> -->
      <my-button type="primary" @click.native="submitForm('infoForm')" height="36" width="92" class="save-button"> 保存 </my-button>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyButton from '@/components/my-button';
import request from '@/utils/request';

import { editNameAndHeadImg } from '@/api/app/user';

export default {
  name: 'changingPasswords',
  components: {
    MyButton, MainCard, SubPage,
  },
  data() {
    return {
      chooseImg: '',
      infoForm: {
        phone: '',
        oldPwd: '',
        password: '',
      },
    };
  },
  mounted() {
    const { userInfo } = this.$store.state.login;
    this.infoForm.phone = userInfo.phonenumber;
  },
  methods: {
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
      });
    },

    // 上传信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          //   this.editUserInfo();
        } else {
          this.$message({
            message: '请完善个人信息',
            type: 'error',
          });
        }
      });
      if (!this.infoForm.oldPwd) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      if (!this.infoForm.password) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      if (this.infoForm.password.trim() === '') {
        this.$message({
          type: 'warning',
          message: '密码中不能全为空格',
        });
        return;
      }
      const obj = {
        phonenumber: this.infoForm.phone,
        oldPwd: this.infoForm.oldPwd,
        newPassword: this.infoForm.password,
      };
      request.post('/dengLuHm/upPassword', obj).then((res) => {
        console.log(res);
        if (res.code === 200 || res.code === '200') {
          this.infoForm.oldPwd = '';
          this.infoForm.password = '';
          this.$message({
            type: 'success',
            message: res.msg,
          });
        } else {
          this.$message({
            type: 'warning',
            message: res.msg,
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 20%;
  padding-top: 10%;
  margin: 0 auto;
  label {
    width: 65px;
  }
  .el-form-item {
    margin-top: 10%;
  }
}
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
    margin-top: 40px;
    // margin-bottom: 30px;
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
  //   .upload-description {
  //     margin-top: 6px;
  //     font-size: 11px;
  //     font-weight: 400;
  //     color: #999999;
  //     line-height: 16px;
  //   }
}
</style>
