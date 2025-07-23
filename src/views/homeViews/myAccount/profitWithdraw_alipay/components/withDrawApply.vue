<!--提现申请-->
<template>
  <div class="with-draw-apply">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="left">
      <el-form-item label="支付宝姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="支付宝账户" prop="account">
        <el-input v-model="form.account" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input v-model="form.money" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item class="submit-button">
        <el-button type="primary" @click="submitForm('form')" height="29" width="67"> 立即创建 </el-button>
      </el-form-item>
      <el-form-item>
        <info-bar>
          <p>1. 为了保证快速到账，请填写真实信息，并仔细核对支付宝账号是否正确</p>
          <p>2. 提现到账时间为T+1，即今天提现-财务审核-明日即可到账</p>
          <p>3.遇法定节假日顺延</p>
        </info-bar>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InfoBar from '@/components/infoBar';
import messageMixin from '@/mixins/messageMixin';

export default {
  mixins: [messageMixin],
  name: 'withDrawApply',
  components: { InfoBar },
  data() {
    return {
      form: {
        name: '',
        account: '',
        money: '',
      },
      rules: {
        name: [{ required: true, message: '该内容不能为空！', trigger: 'blur' }],
        account: [{ required: true, message: '该内容不能为空！', trigger: 'blur' }],
        money: [{ required: true, message: '该内容不能为空！', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm() {
      this.alertSuccess('该功能暂时未开放，敬请期待！');
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     // 提交表单
      //     const { form } = this;
      //     alipayApplyWithDraw({
      //       user_name: form.name,
      //       ali_account: form.account,
      //       withdraw_fee: form.money,
      //       request_from_page: 'app/myAccount/profitWithdraw-alipay',
      //     })
      //       .then((response) => {
      //         console.log(response);
      //         if (response.code === 200) {
      //           this.alertSuccess(response.msg);
      //           this.$refs[formName].resetFields();
      //         } else {
      //           throw new Error();
      //         }
      //       })
      //       .catch(() => {
      //         this.alertError('申请提现失败！');
      //       });
      //   }
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.with-draw-apply::v-deep {
  margin-top: 29px;
  .el-form-item {
    // 上下输入框间距
    margin-bottom: 35px;
  }
  .el-input {
    max-width: 388px;
  }
}
.with-draw-apply {
  .submit-button {
    margin-bottom: 12px;
  }
  .info-bar {
    display: inline-block;
    p {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
