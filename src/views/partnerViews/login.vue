<template>
    <div class="login">
        <div class="login-bg">
            <div class="bg">
                <div class="bg1">
                </div>
                <div class="bg2">
                </div>
            </div>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <div class="title">
                <div class="left">
                    <img src="@/assets/image/partner/logo.png" alt="">
                    <div class="info">
                        <div class="info-top">嗨喵合伙人</div>
                        <div class="info-bottom">Hi Miao</div>
                    </div>
                </div>
                <div class="line"></div>
                <div class="right" @click="toGuanwang">
                    <img src="@/assets/image/partner/turn-icon.png">
                    <div class="right-text">去嗨喵官网</div>
                </div>
            </div>
            <el-form-item prop="phone" class="username-item form-item">
                <div class="item-label">手机号</div>
                <div class="tel">
                    <span>+86</span>
                    <el-input class="un-input" v-model="loginForm.phone" type="text" auto-complete="off"
                        placeholder="请输入手机号">
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item prop="password" class="ps-item form-item">
                <div class="input-cpn">
                    <div class="item-label">密码</div>
                    <el-input class="ps-input" v-model="loginForm.password" :type="cpnType" auto-complete="off"
                        placeholder="请输入密码" @keyup.enter.native="handleLogin">
                    </el-input>
                </div>
                <img src="@/assets/image/partner/not-see-icon.png" @click="showPS">
            </el-form-item>
            <el-form-item class="btn-item" style="width: 100%">
                <el-button :loading="loading" size="medium" type="primary" style="width: 100%"
                    @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
            <div class="remember-btn">
                <div class="select-icon" @click="changeSelectStatus">
                    <div class="none-select" v-if="!isRemember"></div>
                    <img src="../../assets/image/partner/selected-icon.png" v-else>
                </div>
                <div class="remember-tip">记住密码</div>
            </div>
        </el-form>

        <div class="footer">Copyright &copy; 2020-2022 www.hudongmiao.com. All Rights Reserved 上海嗨喵网络科技有限公司版权所有 沪ICP备
            2020028729号</div>
    </div>
</template>
<script>
import { login } from '@/api/partnerSystem/index';
import { setTokenPartner } from '@/utils/request';

export default {
  name: 'PartnerLogin',
  data() {
    return {
      isShowPS: false,
      isRemember: false,
      cpnType: 'password',
      loginForm: {
        phone: '',
        password: '',
      },
      loginRules: {
        phone: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
        ],
      },
      loading: false,
    };
  },
  created() {
    const phone = localStorage.getItem('phone');
    const password = localStorage.getItem('password');
    const isRemember = localStorage.getItem('isRemember');
    if (phone) {
      this.loginForm.phone = phone;
      localStorage.removeItem('phone');
    }
    if (password) {
      this.loginForm.password = password;
      localStorage.removeItem('password');
    }
    if (isRemember) {
      this.isRemember = isRemember;
      localStorage.removeItem('isRemember');
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            await login({
              phone: this.loginForm.phone,
              password: this.loginForm.password,
            }).then((res) => {
              const target = res.data;
              this.loading = false;

              if (target.emcee_name) {
                this.$message.success('登录成功');
                // 如果选择了记住密码，将密码存储到localStorage中
                if (this.isRemember) {
                  localStorage.setItem('phone', this.loginForm.phone);
                  localStorage.setItem('password', this.loginForm.password);
                  localStorage.setItem('isRemember', this.isRemember);
                }
                localStorage.setItem('tokenPartner', target.token);
                setTokenPartner(target.token);
                // 将用户数据存储到state中
                this.$store.dispatch('partner/changeUserInfo', target);
                this.$router.push({
                  path: '/partnerSystem/partnerHome',
                });
              } else if (target.code === '500') {
                this.$message.error('账号密码错误');
              } else if (target.code === '501') {
                this.$message.error('您不是合伙人，无法登录！');
              }
            });
          } catch (err) {
            console.log(err);
            this.loading = false;
            this.$message.error('登录失败');
          }
        }
      });
    },
    changeSelectStatus() {
      this.isRemember = !this.isRemember;
    },
    showPS() {
      this.isShowPS = !this.isShowPS;
      if (this.isShowPS) {
        this.cpnType = 'text';
      } else {
        this.cpnType = 'password';
      }
    },
    toGuanwang() {
      window.open('/', '_self');
    },
  },
};
</script>
<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;

    .login-bg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        perspective: 500px;
        transform-style: preserve-3d;
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: opacity(.5);

        .bg {
            width: 130%;
            padding-top: 100px;
            box-sizing: border-box;
            position: absolute;
            top: -45%;
            left: 50%;
            z-index: 0;
            transform: rotateX(15deg) translateX(-50%);
            transform-origin: center;
            vertical-align: middle;

            .bg1,
            .bg2 {
                width: 100%;
                min-width: 1980px;
                height: 1080px;
                background-image: url("../../assets/image/partner/login-bg.png");
                background-size: 105% 105%;
                background-repeat: no-repeat;
            }

            .bg1 {
                // background: 50% no-repeat;
                // background-size: 100% 100%;
                animation: bg1-data-v-c2c41fa4 20s linear infinite
            }

            .bg2 {
                // margin-top: -40px;
                animation: bg2-data-v-c2c41fa4 20s linear infinite;
            }
        }
    }

    @keyframes bg1-data-v-c2c41fa4 {
        0% {
            transform: translateY(0)
        }

        to {
            transform: translateY(-100%)
        }
    }

    @keyframes bg2-data-v-c2c41fa4 {
        0% {
            transform: translateY(0)
        }

        to {
            transform: translateY(-100%)
        }
    }

    .login-form {
        width: 446px;
        padding: 58px 40px;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, .4);
        border-radius: 6px;
        z-index: 2;

        /deep/.el-input {
            height: 38px;

            input {
                height: 38px;
            }
        }

        .input-icon {
            height: 39px;
            width: 14px;
            margin-left: 2px;
        }

        .remember-btn {
            height: 16px;
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, .5);
            font-size: 16px;
            line-height: 16px;

            .select-icon {
                margin-right: 8px;
                display: flex;
                align-items: center;
                cursor: pointer;

                .none-select {
                    width: 16px;
                    height: 16px;
                    box-sizing: border-box;
                    border: 1px solid rgba(255, 255, 255, .5);
                    border-radius: 50%;
                    cursor: pointer;
                }

                img {
                    width: 16px;
                    height: 16px;
                    vertical-align: middle;
                }
            }

        }

        .title {
            width: 100%;
            height: 42px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-content: center;

                img {
                    width: 42px;
                    height: 42px;
                    margin-right: 16px;
                    border-radius: 50%;
                }

                .info {
                    color: #FFFFFF;
                    font-size: 20px;

                    .info-bottom {
                        margin-top: 2px;
                        color: rgba(255, 255, 255, .7);
                        font-size: 10px;
                    }
                }
            }

            .line {
                width: 1px;
                height: 32px;
                background-color: rgba(255, 255, 255, .5);
                border-radius: 6px;
            }

            .right {
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                color: #FFFFFF;
                font-size: 20px;
                cursor: pointer;

                img {
                    width: 24px;
                    height: 24px;
                    margin: 0 12px 0 27px;
                }
            }
        }

        .form-item {
            width: 366px;
            height: 70px;
            padding: 8px 16px;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, .5);
            border-radius: 6px;
            color: rgba(255, 255, 255, .7);
            font-size: 14px;
            line-height: 33px;
            backdrop-filter: blur(14px);

            .item-label {
                font-size: 14px;
                height: 20px;
                margin-top: 8px;
                margin-bottom: 2px;
                line-height: 20px;
            }
        }

        .username-item {
            display: flex;
            align-items: center;

            .tel::v-deep {
                width: 100%;
                display: flex;
                align-items: center;

                span {
                    color: #FFFFFF;
                }

                .el-input__inner {
                    margin-left: 12px;
                    border: none;
                    background: none;
                }

                .el-input__inner::placeholder {
                    color: #FFFFFF;
                }
            }
        }

        .ps-item::v-deep {
            width: 100%;
            display: flex;
            align-items: center;
            // justify-content: space-between;

            img {
                width: 17px;
                height: 13px;
                cursor: pointer;
            }

            .el-form-item__content {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .el-input__inner::placeholder {
                color: #FFFFFF;
            }

            .input-cpn {
                flex: 1;

                .el-input__inner {
                    border: none;
                    background: none;
                    padding: 0;
                }
            }
        }

        .btn-item::v-deep {
            .el-button--primary {
                width: 148px !important;
                height: 45px;
                background-color: #165DFF;
                border: #165DFF;
            }
        }
    }

    .footer {
        width: 100%;
        color: #FFFFFF;
        font-size: 14px;
        text-align: center;
        position: absolute;
        bottom: 37px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
