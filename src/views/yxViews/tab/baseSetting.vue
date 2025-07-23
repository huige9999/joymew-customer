<template>
  <div class="base">
    <div class="title">基本设置</div>
    <el-form
      class="demo-form-inline"
      :inline="true"
      label-width="88px"
      label-position="left"
      :rules="rules"
      size="middle"
      :model="baseForm"
      ref="baseForm"
    >
      <el-form-item label="活动标题" class="item" label-width prop="name">
        <el-col :span="24">
          <el-input v-model="baseForm.name" placeholder="参与活动赢大奖" class="hm-input-max"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="活动时间" required class="item item-small">
        <div class="flex-wrap">
          <el-col :span="8">
            <el-form-item prop="start_time">
              <el-date-picker
                v-model="baseForm.start_time"
                type="datetime"
                placeholder="选择开始日期"
                class="hm-input-middle date-class"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="split">至</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="end_time">
              <el-date-picker
                v-model="baseForm.end_time"
                type="datetime"
                placeholder="选择结束日期"
                class="hm-input-middle date-class"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </div>
      </el-form-item>

      <el-form-item label="参与人数" class="item">
        <el-radio v-model="baseForm.allow" label="0">不限</el-radio>
        <el-radio v-model="baseForm.allow" label="1">限制</el-radio>
        <el-input v-model="baseForm.allowCount" placeholder="人" class="hm-input-mini"></el-input>
        <span>人参与</span>
      </el-form-item>

      <el-form-item label="主办单位" class="item" prop="organizer">
        <el-input v-model="baseForm.organizer" placeholder="输入内容" class="hm-input-max"></el-input>
      </el-form-item>

      <el-form-item label="活动说明" class="item">
        <el-input
          v-model="baseForm.explain"
          placeholder="输入内容"
          class="hm-input-max"
          type="textarea"
          :rows="4"
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="submitForm('baseForm')">保存</el-button>
    </el-form>
  </div>
</template>
<script>
import { saveBaseInfo, editBaseInfo, getBaseInfo } from '../../../api/yx/yx';

export default {
  props: {
    aid: [Number, String],
  },
  data() {
    return {
      is_release: null,
      // id: null,
      baseForm: {
        name: '',
        start_time: '',
        end_time: '',
        allow: '0',
        allowCount: '0',
        organizer: '',
        explain: '',
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        organizer: [{ required: true, message: '请选择主办单位', trigger: 'blur' }],
        // explain: [{ required: true, message: '', trigger: 'blur' }],
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
      const start = new Date(this.baseForm.start_time).getTime();
      const end = new Date(this.baseForm.end_time).getTime();
      console.log(start, end);
      if (start > end) {
        this.baseForm.end_time = '';
        this.$message.error('结束时间不能大于开始时间');
        return;
      }

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
    saveBaseInfo() {
      const { name, start_time, end_time, allowCount, organizer, explain, allow } = this.baseForm;
      const params = {
        title: name,
        start_date: start_time,
        end_date: end_time,
        canyu_size: String(allowCount),
        organizer: organizer || '',
        activity_desc: explain || '',
        type: '1',
        limit_switch: String(allow),
        // data_json: '派奖方式',
      };

      // console.log(params);

      saveBaseInfo(params)
        .then((res) => {
          console.log(res);
          if (res.data.id) {
            this.$emit('update', { id: res.data.id });
          }

          this.$message.success('保存成功');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('保存失败');
        });
    },
    editBaseInfo() {
      const { name, start_time, end_time, allowCount, organizer, explain, allow } = this.baseForm;
      const params = {
        title: name,
        start_date: start_time,
        end_date: end_time,
        canyu_size: String(allowCount),
        organizer,

        activity_desc: explain,
        type: '1',
        id: String(this.aid),
        is_release: '0',
        is_delete: '0',
        limit_switch: String(allow),
        // data_json: '派奖方式',
      };
      if (this.is_release) {
        params.is_release = this.is_release;
      }
      // console.log(params)
      // return;
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
            this.baseForm.name = res.data.title || '';
            this.baseForm.start_time = res.data.start_date || '';
            if (res.data.end_time) {
              const hasMH = res.data.end_time.indexOf(':') > -1;
              const hasXG = res.data.end_time.indexOf('-') > -1;
              if (!hasMH && hasXG) {
                res.data.end_time = `${res.data.end_time} 08:00:00`;
              }
            }

            if (res.data.start_time) {
              const hasMH = res.data.start_time.indexOf(':') > -1;
              const hasXG = res.data.start_time.indexOf('-') > -1;
              if (!hasMH && hasXG) {
                res.data.start_time = `${res.data.start_time} 08:00:00`;
              }
            }

            this.baseForm.end_time = res.data.end_date || '';
            this.baseForm.organizer = res.data.organizer || '';
            this.baseForm.explain = res.data.activity_desc || '';
            this.baseForm.allow = res.data.limit_switch || '0';
            this.baseForm.allowCount = res.data.canyu_size || '0';
            this.is_release = res.data.is_release;

            // if (res.data.canyu_size === '') {
            //   console.log(0, res.data.canyu_size);
            //   this.baseForm.allow = '0';
            //   this.baseForm.allowCount = '';
            // } else {
            //   console.log(1, res.data.canyu_size);

            //   this.baseForm.allow = '1';
            //   this.baseForm.allowCount = res.data.canyu_size;
            // }
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
.date-class {
  // .el-input__inner {
  //   width: 150px;
  // }
  // .el-input__suffix {
  //   right: 80px;
  // }
}
</style>
  <style lang="less">
.hm-input-mini {
  width: 60px;
}
.hm-input-max {
  width: 400px;
}
.hm-input-middle {
  width: 80px;
}
// .hm-date-input{
//   width: 100px;
// }
</style>
  <style lang="less" scoped>
.flex-wrap {
  display: flex;
  .split {
    margin: 0 10px;
  }
}
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
    width: 120%;
    // &.item-small{
    //   width: 80%;
    // }

    //  ::deep .el-form-item__content{
    //     display: flex;
    //   }

    .input-all {
      width: 100%;
    }
  }
}
</style>
