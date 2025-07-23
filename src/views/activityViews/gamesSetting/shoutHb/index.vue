<template>
  <sub-page>
    <main-card>
      <card-top-info title="喊红包设置"></card-top-info>
      <div style="padding: 20px; display: flex; flex-direction: column; width: fit-content">
        <div>
          第一行弹幕：
          <el-input
            style="width: 200px; margin-bottom: 10px"
            v-model="formData.danmu1"
            placeholder="请输入第一行弹幕"
            maxlength="4"
          />
        </div>
        <div>
          第二行弹幕：
          <el-input
            style="width: 200px; margin-bottom: 10px"
            v-model="formData.danmu2"
            placeholder="请输入第二行弹幕"
            maxlength="4"
          />
        </div>
        <div>
          第三行弹幕：
          <el-input
            style="width: 200px; margin-bottom: 10px"
            v-model="formData.danmu3"
            placeholder="请输入第三行弹幕"
            maxlength="4"
          />
        </div>
        <div class="btn-box">
          <el-button
            type="primary"
            @click="save"
          >
            保存
          </el-button>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import { reqShouHbData, reqUpdateShoutHbData } from '@/api/gameSetting/index.js';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
/**
 * 服务端数据转表单数据
 */
const serverDataToFormData = (data) => {
  if (!data) {
    return this.formData;
  }
  try {
    const tmpObj = JSON.parse(data);
    return {
      danmu1: tmpObj.rightText.split('_')[0] || '',
      danmu2: tmpObj.rightText.split('_')[1] || '',
      danmu3: tmpObj.rightText.split('_')[2] || '',
    };
  } catch (err) {
    return this.formData;
  }
};

/**
 * 表单数据转服务端需要的数据
 */
const formDataToServerData = (formData) => {
  const tmpStr = Object.values(formData)
    .filter((item) => item)
    .join('_');
  const tmpObj = {
    rightText: tmpStr,
  };
  return JSON.stringify(tmpObj);
};

export default {
  async created() {
    const hhb = await reqShouHbData();
    console.log('>>>>', hhb);
    this.formData = serverDataToFormData(hhb);
  },
  data() {
    return {
      formData: {
        danmu1: '',
        danmu2: '',
        danmu3: '',
      },
    };
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  methods: {
    save() {
      if (!(this.formData.danmu1 || this.formData.danmu2 || this.formData.danmu3)) {
        this.$message.error('请至少填写一个完整的弹幕内容');
        return;
      }
      if (this.formData.danmu1.length > 4 || this.formData.danmu2.length > 4 || this.formData.danmu3.length > 4) {
        this.$message.error('弹幕长度不能超过4');
        return;
      }

      reqUpdateShoutHbData(formDataToServerData(this.formData)).then(() => {
        this.$message.success('保存成功');
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
