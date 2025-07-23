<template>
  <sub-page class="myInfo">
    <main-card>
      <el-form :model="infoForm" ref="infoForm" label-width="55px">
        <el-form-item label="角色">
          <el-radio-group v-model="infoForm.hltRoleId">
            <el-radio :label="item.id" v-for="item in hltRoleList" :key="item.id">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="infoForm.phonenumber" placeholder="请输入账号" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="emcee_name" placeholder="请输入昵称" size="mini" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="infoForm.passwd" placeholder="请输入密码" size="mini" type="password"></el-input>
        </el-form-item>
        <!-- <el-form-item label="新密码">
          <el-input v-model="infoForm.password" placeholder="请输入新密码" size="mini" type="password"></el-input>
        </el-form-item> -->
      </el-form>
      <my-button type="primary" @click.native="submitForm('infoForm')" height="36" width="92" class="save-button"> 保存 </my-button>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyButton from '@/components/my-button';
import request from '@/utils/request';

export default {
  name: 'register',
  components: {
    MyButton,
    MainCard,
    SubPage,
  },
  data() {
    return {
      chooseImg: '',
      emcee_name: '',
      infoForm: {
        phonenumber: '',
        passwd: '',
        hltRoleId: '',
      },
      hltRoleList: [
        {
          id: '1',
          label: '运营人员',
        },
        {
          id: '2',
          label: '婚礼策划',
        },
      ],
    };
  },
  mounted() {
    // const { userInfo } = this.$store.state.login;
    // this.infoForm.phone = userInfo.phonenumber;
  },
  watch: {},

  methods: {
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
      if (!this.infoForm.phonenumber.match(/^1\d{10}$/)) {
        this.$message({
          type: 'warning',
          message: '手机格式不正确',
        });
        return;
      }
      if (!this.infoForm.passwd) {
        this.$message({
          type: 'warning',
          message: '密码不能为空',
        });
        return;
      }
      if (this.infoForm.passwd.trim() === '') {
        this.$message({
          type: 'warning',
          message: '密码中不能全为空格',
        });
        return;
      }
      if (!this.infoForm.hltRoleId) {
        this.$message({
          type: 'warning',
          message: '请选择角色',
        });
        return;
      }
      const obj = {
        phonenumber: this.infoForm.phonenumber,
        passwd: this.infoForm.passwd,
        emcee_name: this.emcee_name,
        hltRoleName: this.hltRoleList.find((item) => item.id === this.infoForm.hltRoleId).label,
      };
      if (this.$store.state.login.userInfo.high_privilege === 4) {
        obj.high_privilege = '4';
      } else if (this.$store.state.login.userInfo.high_privilege === 5) {
        obj.high_privilege = '5';
      }
      request
        .post('/host/tqlLogin', obj)
        .then((res) => {
          console.log('下级注册', res.success);
          if (res.code === 200 || res.code === '200') {
            this.infoForm.passwd = '';
            this.$message({
              type: 'success',
              message: res.msg,
            });
          } else {
            this.$message({
              type: 'warning',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: 'warning',
            message: err,
          });
          console.log(err);
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
