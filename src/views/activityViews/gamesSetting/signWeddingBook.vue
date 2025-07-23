<!--
  * 签婚书
  * @author: Ruan Jiazhen
  * @date: 2024-04-19  14:22:32
-->
<template>
  <div>
    <card-top-info title="签婚书"></card-top-info>
    <el-form ref="form" :model="form" label-width="100px" style="max-width: 400px;">
      <el-form-item label="新郎姓名">
        <el-input v-model="form.bridegroomName"></el-input>
      </el-form-item>
      <el-form-item label="新娘姓名">
        <el-input v-model="form.brideName"></el-input>
      </el-form-item>
      <el-form-item label="结婚日期">
        <el-date-picker v-model="form.weddingDate" type="date" placeholder="选择日期"
          value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-button type="primary" :loading="isLoading" @click="onSubmit">保存</el-button>
    </el-form>
  </div>
</template>

<script>
import CardTopInfo from '@/components/cardTopInfo';

import { reqGetSubmittedInfo, reqSubmitSignWeddingBook } from '@/api/gameSetting/signWeddingBook';

export default {
  name: 'signWeddingBook',
  components: {
    CardTopInfo,
  },
  data() {
    return {
      form: {
        bridegroomName: '',
        brideName: '',
        weddingDate: '',
      },
      isLoading: false,
    };
  },
  created() {
    this.getSubmittedInfo();
  },
  methods: {
    async getSubmittedInfo() {
      const res = await reqGetSubmittedInfo(this.$store.state.liveId);
      this.form = {
        bridegroomName: res.data.marryMan,
        brideName: res.data.marryWoman,
        weddingDate: res.data.marryDate,
      };
    },
    async onSubmit() {
      try {
        this.isLoading = true;
        const res = await reqSubmitSignWeddingBook({
          marryMan: this.form.bridegroomName,
          marryWoman: this.form.brideName,
          marryDate: this.form.weddingDate,
          splid: this.$store.state.liveId,
        });
        this.isLoading = false;

        if (res.code !== 200) {
          throw new Error(res.msg);
        }

        this.$message.success('提交成功');
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
      }
    },
  },
};
</script>
