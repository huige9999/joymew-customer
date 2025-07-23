<template>
  <div class="daodian-config-page">
    <!-- 左侧预览 -->
    <div class="left-preview">
      <div class="preview-container">
        <div class="bottom">
          <!-- 轮播图 -->
          <el-carousel trigger="click" height="233px" style="background-color: rgba(0, 0, 0, .4); z-index: -1;">
            <el-carousel-item v-for="item in hlt_info.hlt_imgs" :key="item">
              <img :src="item" class="swiper-img" />
            </el-carousel-item>
          </el-carousel>
          <div class="hlt-info">
            <div class="about">关于{{ hlt_info.hlt_name }}</div>
            <div class="hlt-name">{{ hlt_info.hlt_name }}</div>
            <div class="handlers">
              <img src="~@/assets/image/yx/daodianli/phone.png" class="handler-img" />
              <img src="~@/assets/image/yx/daodianli/we-chat.png" class="handler-img" />
              <img src="~@/assets/image/yx/daodianli/address.png" class="handler-img" />
              <img src="~@/assets/image/yx/daodianli/account.png" class="handler-img" />
              <img src="~@/assets/image/yx/daodianli/share.png" class="handler-img" />
            </div>
          </div>
        </div>
        <div class="top">
          <div class="model-container">
            <div class="model-title">领取到店礼</div>
            <div class="tip">预约到店即送到店礼</div>
            <div class="phone-input">
              <div class="phone-label">手机号码</div>
              <div class="phone-number">18888888888</div>
            </div>
            <div class="gift-part">
              <img src="~@/assets/image/yx/daodianli/gift-icon.png" class="gift-icon" />
              <div class="txt">到店礼</div>
              <div class="gift-name">{{ config.gift_name || '婚纱、衬衫、窗门道具' }}</div>
            </div>
            <div class="get-btn" @click="showTip">确定</div>
          </div>
        </div>
        <div class="tip-out" v-if="isShowTip">领取成功，到店即可领取礼物</div>
      </div>
    </div>
    <!-- 右侧配置表单 -->
    <div class="right-config">
      <div class="header-left">
        <div class="back-btn" @click="back">返回上一级</div>
      </div>
      <div class="config-form">
        <el-form ref="giftConfig" label-position="right" :rules="rules" label-width="130px" :model="config">
          <el-form-item label="活动名称：" prop="activity_name">
            <el-input v-model="config.activity_name" placeholder="输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="到店礼品：" prop="gift_name">
            <el-input v-model="config.gift_name" placeholder="例如：婚纱、衬衫、窗门道具等"></el-input>
          </el-form-item>
          <el-form-item label="礼品数量：" class="count-input" prop="gift_account">
            <el-input class="content-input" v-model="config.gift_account"></el-input>个
          </el-form-item>
          <el-form-item label="用券时间：" required>
            <template #default>
              <div class="use-container">
                <el-form :inline="true" ref="timeConfig" :model="config" :rules="rules" class="my-form">
                  <el-form-item class="my-form-item" prop="gift_effect_time">
                    <div class="use-part">领券后<el-input class="time-input" v-model="config.gift_effect_time"></el-input>天后生效</div>
                  </el-form-item>
                  <el-form-item class="my-form-item" prop="gift_valid">
                    <div class="use-part">有效期<el-input class="time-input" v-model="config.gift_valid"></el-input>天</div>
                  </el-form-item>
                </el-form>
                <div class="tips">例：客户在1月1日9:00领取，则该券的可用时间为1月2日00:00至次年1月1日23:59:59（按自然天计算）</div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="领取次数限制：" prop="gift_limit">
            <el-radio v-model="config.gift_limit" :label="'-1'">每人领取次数不限</el-radio>
            <el-radio class="radio-input" v-model="config.gift_limit" :label="config.diy_limit">
              <div class="use-part">
                每人最多可领取<el-input
                  class="time-input"
                  v-model="config.diy_limit"
                  @focus="config.gift_limit = config.diy_limit"
                  @change="config.gift_limit = config.diy_limit"
                  @blur="config.gift_limit = config.diy_limit"
                  @input="config.gift_limit = config.diy_limit"
                ></el-input
                >次
              </div>
            </el-radio>
          </el-form-item>
          <el-form-item label="使用须知：" prop="gift_description">
            <el-input class="outer" type="textarea" autosize placeholder="请输入使用须知" v-model="config.gift_description"> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom-handler">
        <el-button type="primary" v-if="activity_id">预览并发布</el-button>
        <el-button type="primary" @click="save">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createDaodian, showDaodianData, modifyDaodian, getSwiper } from '@/api/yx/daodian';

export default {
  name: 'yxDaodian',
  data() {
    return {
      hlt_info: {
        hlt_name: '云镜盛宴',
        hlt_imgs: [],
      },
      activity_id: '',
      config: {
        activity_name: '',
        gift_name: '',
        gift_account: '1',
        gift_effect_time: '1',
        gift_valid: '365',
        gift_limit: '-1',
        gift_description: '',
        diy_limit: '1',
      },
      isShowTip: false,
      tipTimer: null,
      rules: {
        activity_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        gift_name: [{ required: true, message: '请输入到店礼品', trigger: 'blur' }],
        gift_account: [{ required: true, message: '请输入礼品数量', trigger: 'blur' }],
        gift_limit: [{ required: true, message: '请填写领取次数', trigger: 'blur' }],
        gift_effect_time: [{ required: true, message: '请输入生效时间', trigger: 'blur' }],
        gift_valid: [{ required: true, message: '请输入优惠券有效期', trigger: 'blur' }],
      },
    };
  },
  created() {
    const { id } = this.$route.query;
    this.getSwiperImgs();
    if (id) {
      this.activity_id = id;
      // 获取活动数据
      this.getDaodianData();
    }
  },
  methods: {
    /** 展示预览的提示弹窗 */
    showTip() {
      if (this.tipTimer) return;
      this.isShowTip = true;
      this.tipTimer = setTimeout(() => {
        this.isShowTip = false;
        clearTimeout(this.tipTimer);
        this.tipTimer = null;
      }, 1500);
    },
    /** 获取到店礼信息 */
    async getDaodianData() {
      const res = await showDaodianData(this.activity_id);
      const { data } = res;
      if (data) {
        const { data_json, prize_json, limit_switch, title } = data;
        const baseData = JSON.parse(data_json);
        const { effectTime, validateTime, tips } = baseData;
        const awardInfo = JSON.parse(prize_json);
        const { award_name, award_num } = awardInfo;
        this.config.activity_name = title || '';
        this.config.gift_name = award_name || '';
        this.config.gift_account = award_num || '1';
        this.config.gift_effect_time = effectTime || '1';
        this.config.gift_valid = validateTime || '365';
        if (Number(limit_switch) !== -1) {
          this.config.diy_limit = limit_switch;
        }
        this.config.gift_limit = limit_switch || '-1';
        this.config.gift_description = tips || '';
      }
    },
    /** 获取轮播图 */
    async getSwiperImgs() {
      const res = await getSwiper();
      const imgs = JSON.parse(res.data);
      this.hlt_info.hlt_imgs.splice(0);
      imgs.forEach((item) => {
        this.hlt_info.hlt_imgs.push(item);
      });
    },
    /** 返回上一级 */
    back() {
      this.$router.back();
    },
    /** 保存 */
    async save() {
      this.$refs.giftConfig.validate(async (res) => {
        if (res) {
          // 将数据转化为json
          const dataJson = JSON.stringify({
            effectTime: this.config.gift_effect_time || '',
            validateTime: this.config.gift_valid || '',
            tips: this.config.gift_description || '',
          });
          const prizeJson = JSON.stringify({
            award_name: this.config.gift_name,
            award_num: this.config.gift_account,
          });
          // 调用接口
          // 判断是否有activity_id：有则为修改，没有则为新建
          let targetRes = '';
          const targetData = {
            data_json: dataJson,
            prize_json: prizeJson,
            title: this.config.activity_name,
            type: '3',
            limit_switch: String(this.config.gift_limit),
          };
          if (this.activity_id) {
            targetRes = await modifyDaodian(this.activity_id, targetData);
          } else {
            targetRes = await createDaodian(targetData);
          }
          if (targetRes && targetRes.msg && String(targetRes.msg) === 'ok') {
            this.$message.success('操作成功');
            setTimeout(() => {
              // 返回到我的活动列表
              this.$router.replace({
                path: '/app/yx/myActivities',
              });
            }, 1500);
          } else {
            this.$message.error('操作失败，请稍后重试~');
          }
          return;
        }
        this.$message.error('请检查配置信息是否填写完整');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.daodian-config-page {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .left-preview {
    width: 466px;
    padding: 38px;
    box-sizing: border-box;
    .preview-container {
      width: 390px;
      height: 670px;
      background-color: #c4c4c4;
      position: relative;
      .bottom {
        position: relative;
        z-index: 2;
        .swiper-img {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .hlt-info {
          width: 100%;
          margin-top: -10px;
          padding: 20px 10px;
          box-sizing: border-box;
          border-radius: 10px 10px 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-image: linear-gradient(to right, #fffdf6, #ffffff 30%);
          z-index: 2;
          position: relative;
          .hlt-name {
            margin-bottom: 20px;
            font-size: 22px;
            font-weight: bolder;
            position: relative;

            &::before,
            &::after {
              content: '';
              width: 39px;
              height: 2px;
              border-radius: 4px;
              background-image: linear-gradient(to right, #ffffff, #fae3a6);
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
            }
            &::before {
              left: -50px;
            }
            &::after {
              right: -50px;
              transform: translateY(-50%) rotate(180deg);
            }
          }
          .about {
            width: fit-content;
            padding: 4px 10px;
            padding-right: 4px;
            box-sizing: border-box;
            background-color: #eaf5ff;
            color: #2f74e9;
            font-size: 12px;
            font-weight: bold;
            border-radius: 20px 0 0 20px;
            position: absolute;
            right: 0;
            top: 23px;
          }
          .handlers {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            .handler-img {
              width: 40px;
              height: 40px;
              margin: 0 14px;
              &:first-of-type {
                margin-left: 0;
              }
              &:last-of-type {
                margin-right: 0;
              }
            }
          }
        }
      }
      .top {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        .model-container {
          width: 100%;
          height: 320px;
          padding: 20px 16px;
          box-sizing: border-box;
          border-radius: 10px 10px 0 0;
          background-color: #fff;
          background-image: linear-gradient(180deg, rgba(248, 212, 222, 0.3), #ffffff 40%);
          position: absolute;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .model-title {
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: bold;
          }
          .tip {
            width: 100%;
            margin-bottom: 12px;
            color: rgba(0, 0, 0, 0.4);
            font-size: 14px;
          }
          .phone-input {
            width: 100%;
            margin-bottom: 17px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 16px;
            .phone-label {
              margin-right: 24px;
              font-weight: bold;
            }
          }
          .gift-part {
            width: 100%;
            margin-bottom: 30px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-image: linear-gradient(to right, #fdf2f5, transparent 60%);
            border-radius: 8px;
            .gift-icon {
              width: 16px;
              height: 16px;
              margin-right: 12px;
            }
            .txt {
              margin-right: 17px;
              font-size: 16px;
              font-weight: bold;
            }
            .gift-name {
              font-size: 14px;
            }
          }
          .get-btn {
            width: 100%;
            height: 50px;
            border-radius: 27px;
            background-image: linear-gradient(81deg, #ff9dad, #ff4867);
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
            line-height: 50px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
      .tip-out {
        /* width: 100%; */
        padding: 0 16px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
        white-space: nowrap;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
      }
    }
  }
  .right-config {
    flex: 1;
    height: 758px;
    padding: 40px;
    padding-top: 0;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .header-left {
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: absolute;
      right: 20px;
      top: 10px;

      .back-btn {
        height: 22px;
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4e5969;
        font-size: 14px;
        cursor: pointer;
        &::before {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-image: url('~@/assets/image/yx/back-icon.png');
          background-size: 100% 100%;
          background-position: center;
          margin-right: 4px;
          margin-top: 2px;
        }
      }
    }
    .config-form {
      margin-top: 60px;
    }
    .bottom-handler {
      width: 100%;
      margin-top: 150px;
      display: flex;
      justify-content: center;
    }
    .outer {
      /deep/.el-textarea__inner {
        min-height: 80px !important;
      }
    }

    .use-container {
      .tips {
        margin-top: 20px;
        color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
        line-height: 22px;
      }
    }

    .my-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .count-input {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      /deep/.el-input__inner {
        width: 80px;
        height: 32px;
        margin-right: 10px;
      }
    }

    .use-time {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .use-part {
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        .time-input {
          width: 35px;
          margin: 0 10px;
          /deep/.el-input__inner {
            width: 100% !important;
          }
        }
        &:last-of-type {
          .time-input {
            width: 70px;
          }
        }
      }
    }

    /deep/.el-form-item__content {
      margin-left: 0 !important;
      display: flex;
      align-items: center;
    }

    .radio-input {
      width: 150px;
      display: flex;
      align-items: center;
    }
    .use-part {
      display: flex;
      align-items: center;
      .time-input {
        width: 70px;
        margin: 0 10px;
        display: flex;
        align-items: center;
        /deep/.el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
