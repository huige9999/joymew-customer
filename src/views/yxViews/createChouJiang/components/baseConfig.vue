<template>
  <div class="base-cpn">
    <div class="title-text">基本设置</div>
    <el-form ref="baseConfigForm" label-position="right" :rules="rules" label-width="130px" :model="baseConfig">
      <el-form-item label="活动名称：" prop="name">
        <el-input v-model="baseConfig.name" placeholder="输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动简介：">
        <el-input v-model="baseConfig.introduce" placeholder="输入活动简介"></el-input>
      </el-form-item>
      <el-form-item label="用券时间：" required>
        <template #default>
          <div class="use-container">
            <el-form :inline="true" :model="baseConfig" :rules="rules" class="my-form">
              <el-form-item class="my-form-item" prop="effectTime">
                <div class="use-part">领券后<el-input class="time-input" v-model="baseConfig.effectTime"></el-input>天后生效</div>
              </el-form-item>
              <el-form-item class="my-form-item" prop="validateTime">
                <div class="use-part">有效期<el-input class="time-input" v-model="baseConfig.validateTime"></el-input>天</div>
              </el-form-item>
            </el-form>
            <div class="tips">例：客户在1月1日9:00领取，则该券的可用时间为1月2日00:00至次年1月1日23:59:59（按自然天计算）</div>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="领取次数限制：" prop="times">
        <el-radio v-model="baseConfig.times" :label="'-1'">每人领取次数不限</el-radio>
        <el-radio class="radio-input" v-model="baseConfig.times" :label="baseConfig.diyTimes">
          <div class="use-part">
            每人最多可领取<el-input
              class="time-input"
              v-model="baseConfig.diyTimes"
              @focus="baseConfig.times = baseConfig.diyTimes"
              @change="baseConfig.times = baseConfig.diyTimes"
              @blur="baseConfig.times = baseConfig.diyTimes"
              @input="baseConfig.times = baseConfig.diyTimes"
            ></el-input
            >次
          </div>
        </el-radio>
      </el-form-item>
      <el-form-item label="使用须知：" prop="tips">
        <el-input
          class="outer"
          type="textarea"
          autosize
          placeholder="请输入内容（20 - 150字）"
          v-model="baseConfig.tips"
          maxlength="150"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="next-btn" @click="nextStep">下一步</div>
  </div>
</template>

<script>
// 接口
import { createChouJiang, modifyChouJiangData } from '@/api/yx/chouJiang';

export default {
  name: 'baseConfig',
  props: {
    config: {
      type: Object,
    },
    yxId: {
      type: String,
    },
  },
  data() {
    return {
      id: '',
      baseConfig: {
        name: '', // 优惠券名称
        introduce: '', // 优惠券简介
        effectTime: '1', // 生效时间，默认1
        validateTime: '365', // 有效期，默认365
        times: '1', // 领取次数，-1 代表无限
        diyTimes: '1',
        tips: '', // 使用须知
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        times: [{ required: true, message: '请选择领取次数', trigger: 'blur' }],
        effectTime: [{ required: true, message: '请输入生效时间', trigger: 'blur' }],
        validateTime: [{ required: true, message: '请输入优惠券有效期', trigger: 'blur' }],
        tips: [
          { required: true, message: '请输入使用须知', trigger: 'blur' },
          { min: 20, max: 150, message: '20 ~ 150字', trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    // 如果有活动数据，则获取活动数据
    this.initData(this.$props.config);
    if (this.$props.yxId) {
      this.id = this.$props.yxId;
    }
  },
  watch: {
    config(newValue) {
      this.initData(newValue);
    },
    yxId(newValue) {
      if (newValue) {
        this.id = newValue;
      }
    },
  },
  methods: {
    nextStep() {
      // 验证表单
      this.$refs.baseConfigForm.validate(async (valid) => {
        // 如果验证通过且没有活动id，则为创建活动
        if (valid && !this.$props.config.name) {
          // 调用接口保存基本设置
          const data_json = {
            effectTime: String(this.baseConfig.effectTime),
            validateTime: String(this.baseConfig.validateTime),
            tips: String(this.baseConfig.tips),
          };
          // 处理请求接口的参数
          const newItem = {
            title: this.baseConfig.name,
            activity_desc: this.baseConfig.introduce,
            data_json: JSON.stringify(data_json),
            limit_switch: String(this.baseConfig.times),
          };
          // 调用接口
          const { data: res } = await createChouJiang(newItem);
          console.log('创建结果', res);
          // 获取其中的活动id并回传
          const { id } = res;
          // 更换为奖项设置
          this.$emit('complete', id);
          this.$message.success('保存成功');
        } else if (valid && this.$props.config.name) {
          // 如果验证通过且有活动数据，则走更新流程
          this.modifyData();
        } else {
          this.$message.error('请检查表单是否填写完整');
        }
      });
    },
    // 初始化数据
    initData(data) {
      if (data) {
        Object.keys(data).forEach((key) => {
          this.baseConfig[key] = data[key];
        });
      }
    },
    // 修改活动的基本数据
    async modifyData() {
      // 处理要修改的数据
      const data_json = {
        effectTime: String(this.baseConfig.effectTime),
        validateTime: String(this.baseConfig.validateTime),
        tips: String(this.baseConfig.tips),
      };
      // 处理请求接口的参数
      const paramObj = {
        id: this.id,
        title: this.baseConfig.name,
        activity_desc: this.baseConfig.introduce,
        data_json: JSON.stringify(data_json),
        limit_switch: String(this.baseConfig.times),
      };
      const res = await modifyChouJiangData(paramObj);
      console.log('修改活动数据结果', res);
      if (res && res.msg === 'edit成功') {
        this.$message.success('保存成功');
        this.$emit('complete', this.id);
        return;
      }
      this.$message.error('保存失败，请稍后重试');
    },
  },
};
</script>

<style lang="less" scoped>
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
  .my-form-item {
    display: flex;
    align-items: center;
    justify-content: center;
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

.base-cpn {
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-text {
    width: 100%;
    margin-bottom: 44px;
    padding: 15px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #f3f3f3;
    color: #333333;
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: bold;
  }
}

.next-btn {
  width: 118px;
  height: 44px;
  margin-top: 44px;
  border-radius: 4px;
  background-color: #249aff;
  color: #ffffff;
  line-height: 44px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
</style>
