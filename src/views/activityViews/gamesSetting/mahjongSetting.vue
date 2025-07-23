<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card>
        <card-top-info title="雀神大赛设置"></card-top-info>
        <div class="setting-form">
          <el-form :model="settingForm" label-width="100px">
            <el-form-item label="难度选择：">
              <el-radio-group v-model="settingForm.degree">
                <el-radio v-for="item in degreeOptions" :key="item.value" :label="item.value" border>
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSettingForm">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';

export default {
  name: 'mahjongSetting',
  data() {
    return {
      xiemu: null,
      settingForm: {
        degree: '', // 难度选择 取值'common'，'easy'
      },
      degreeOptions: [
        // 单选框选项
        {
          label: '普通',
          value: 'common',
        },
        {
          label: '简单',
          value: 'easy',
        },
      ],
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  watch: {
    'settingForm.degree': function watchDegree(val) {
      console.log(val);
      this.xiemu.otherBusinessMahjongDegree = val;
    },
  },
  methods: {
    initData() {
      request
        .get(`/qiYeNe/liebiao?splid=${this.$store.state.liveId}`)
        .then((res) => {
          console.log(res);
          if (!res.data.xiemu) {
            this.settingForm.degree = 'common';
            this.xiemu = {
              otherBusinessMahjongDegree: 'common',
            };
            return;
          }
          const xiemuObj = JSON.parse(res.data.xiemu);
          this.xiemu = xiemuObj;
          if (this.xiemu.otherBusinessMahjongDegree) {
            this.settingForm.degree = this.xiemu.otherBusinessMahjongDegree;
          } else {
            this.settingForm.degree = 'common';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitSettingForm() {
      //   console.log(this.settingForm.degree);
      this.xiemu.otherBusinessMahjongDegree = this.settingForm.degree;
      console.log(this.xiemu);
      request
        .post('/qiYeNe/update', {
          xiemu: JSON.stringify(this.xiemu),
          splid: this.$store.state.liveId,
        })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
