<template>
  <div class="base">
    <div class="title">派奖设置</div>
    <el-form
      class="demo-form-inline"
      :inline="true"
      label-width="128px"
      label-position="left"
      :rules="rules"
      size="middle"
      :model="awardForm"
      ref="awardForm"
    >
      <el-form-item label="答题时间" class="item" label-width="" prop="limitTime">
        在规定时间 <el-input v-model="awardForm.limitTime" placeholder="" class="hm-input-mini"></el-input>秒完成答题，方可参与抽奖
      </el-form-item>

      <el-form-item label="参与门槛" class="item" prop="limitUser">
        <el-radio v-model="awardForm.limitUser" label="0">关闭</el-radio>
        <el-radio v-model="awardForm.limitUser" label="1">商城用户参与</el-radio>
      </el-form-item>

      <el-form-item label="每日参与机会" class="item" label-width="" prop="dayCount">
        每人每日有 <el-input v-model="awardForm.dayCount" placeholder="" class="hm-input-mini"></el-input>次参与机会
      </el-form-item>

      <el-form-item label="排行榜" class="item" prop="limitRank">
        显示 <el-input v-model="awardForm.limitRank" placeholder="" class="hm-input-mini"></el-input>名中奖用户
      </el-form-item>

      <el-form-item label="答题数量" class="item">
        每次随机 <el-input v-model="awardForm.questionCount" placeholder="" class="hm-input-mini"></el-input>道题目
      </el-form-item>

      <el-button  type="primary" @click="submitForm('awardForm')">保存</el-button>
    </el-form>
  </div>
</template>

<script>
import { editBaseInfo, getBaseInfo } from '../../../api/yx/yx';

export default {
  props: {
    aid: String,
  },
  data() {
    return {
      awardForm: {
        limitTime: '60',
        limitUser: '0',
        dayCount: '3',
        limitRank: '10',
        questionCount: '10',
      },
      rules: {
        limitTime: [{ required: true, message: '请输入答题时间', trigger: 'blur' }],
        dayCount: [{ required: true, message: '请输入每日参与机会', trigger: 'blur' }],
        limitRank: [{ required: true, message: '请输入排行榜显示人数', trigger: 'blur' }],

        questionCount: [{ required: true, message: '请输入答题数量', trigger: 'blur' }],
      },
    };
  },
  created() {
    if (this.aid) {
      this.getBaseInfo();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.aid) {
            this.editBaseInfo();
          } else {
            this.saveBaseInfo();
          }
        }
      });
    },

    editBaseInfo() {
      const data_json = this.awardForm;

      const params = {
        id: String(this.aid),

        data_json: JSON.stringify(data_json),
      };

      editBaseInfo(params)
        .then((res) => {
          console.log(res);
          this.$message.success('编辑成功');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('编辑失败');
        });
    },
    getBaseInfo() {
      getBaseInfo({
        id: this.aid,
      })
        .then((res) => {
          console.log('res', res.data);
          if (res.data) {
            const data_json = JSON.parse(res.data.data_json || {});
            console.log(data_json);
            const keys = Object.keys(data_json);
            for (let i = 0; i < keys.length; i++) {
              this.awardForm[keys[i]] = data_json[keys[i]];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less">
.hm-input-mini {
  width: 60px;
  margin: 0 10px;
}
.hm-input-max {
  width: 400px;
}
.hm-input-middle {
  width: 80px;
}
</style>
<style lang="less" scoped>
.base {
  width: 100%;
  padding-left: 40px;
  .title {
    font-weight: 500;
    color: #333333;
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f3f3;
  }
}
.demo-form-inline {
  font-size: 16px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .item {
    width: 100%;

    //  ::deep .el-form-item__content{
    //     display: flex;
    //   }

    .input-all {
      width: 100%;
    }
  }
}
</style>
